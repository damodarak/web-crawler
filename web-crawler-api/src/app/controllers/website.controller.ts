import { AddWebsiteProps, DeleteWebsiteProps, FrontendWebsite, Response, UpdateWebsiteProps, GetWebsitesProps } from "../model";
import { pool } from "../../server";
import { workers, ids } from "../../server";
import { Worker } from "worker_threads";

export async function getWebsites(props: GetWebsitesProps): Promise<FrontendWebsite[]> {

    // TODO: retrieve websites from MySQL database
    const allowedValuesSortOrder = ["ASC", "DESC"];
    const allowedValuesSortBy = ["url", "timestamp"];
    const bothParams = allowedValuesSortBy.includes(props.sortBy) && allowedValuesSortOrder.includes(props.sortOrder);
    const sortBy = (bothParams ? `ORDER BY ${props.sortBy}` : "");
    const sortOrder = (bothParams ? props.sortOrder : "");

    const websites: FrontendWebsite[] = [];

    const [rows] = await pool.query(((props.limit !== undefined) && (props.offset !== undefined)) ? 
    `SELECT * FROM webpages ${sortBy} ${sortOrder} LIMIT ${props.limit} OFFSET ${props.offset}` : `SELECT * FROM webpages ${sortBy} ${sortOrder}`);
    
    const [rows_size] = await pool.query('SELECT COUNT(*) FROM webpages');
    const size: number = parseInt(rows_size[0]["COUNT(*)"]);

    for (let i = 0; i < size; i++) {   
        let row = rows[i];
        if(row === undefined){
            continue;
        }

        websites.push({
            identifier: row.id,
            label: row.label,
            url: row.url,
            regexp: row.regex,
            periodicity: row.periodicity,
            tags: row.tags.split('-'),
            active: row.active,
            crawling: row.crawling,
            timestamp: timestampToDate(row.timestamp)
        });
    }

    return websites;
}

export function timestampToDate(str: string): string {
    const date = new Date(str);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function generateId(): string {
    const id: string = Math.random().toString(19).slice(2);
    return id;
}

function validURL(str: string): boolean {
    var pattern = new RegExp('^(https?:\\/\\/)'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str) && str.length < 2049;
}

export async function addWebsite(props: AddWebsiteProps): Promise<Response> {
    
    // TODO: check parameter validity and add website to MySQL database

    const { label, url, regexp, periodicity, tags, active } = props;
    const id: string = generateId();

    if(label === undefined ||  label == null || 
        !validURL(url) || regexp === undefined || regexp == null ||
        periodicity === undefined || periodicity == null ||
        active === undefined || active == null ||
         tags === undefined || tags == null)
    {
        return { status: 400, message: "Failed to add a website"};
    }

    const statement = 'INSERT INTO webpages (id,label,url,regex,periodicity,tags,active) VALUES (?,?,?,?,?,?,?)';
    const values = [id, label, url, decodeURIComponent(regexp), periodicity, tags.join('-'), active];
    await pool.execute(statement, values);

    if(active) {
        const web: FrontendWebsite = {
            identifier: id,
            label: label,
            url: url,
            regexp: decodeURIComponent(regexp),
            periodicity: periodicity,
            tags: tags,
            active: active,
            crawling: false
        };
        const worker: Worker = new Worker('./src/app/controllers/worker.controller.ts', { workerData: { web } });
        workers.push(worker);
        ids.push(web.identifier);
    }

    return { status: 200, message: "Website added successfully"};
}

export async function deleteWebsite(props: DeleteWebsiteProps): Promise<Response> {

    // TODO: check parameter validity and delete website from MySQL database

    const { id } = props;
    
    if(id === undefined || id === "") {
        const statusCode: number = 400;
        const msg: string = "id is not a string";

        return {status: statusCode, message: msg};
    }
    const statement1 = 'DELETE FROM webpages WHERE id = ?';
    const statement2 = 'DELETE FROM nodes WHERE owner = ?';
    const statement3 = 'DELETE FROM executions WHERE pageid = ?'
    const values = [id];

    await pool.execute(statement1, values);
    await pool.execute(statement2, values);
    await pool.execute(statement3, values);

    const index = ids.indexOf(id)
    if(index !== -1) {
        workers[index].terminate();
        workers[index] = undefined;
        workers.splice(index, 1);
        ids.splice(index, 1);
    }

    return { status: 200, message: "Website deleted successfully" };
}

export async function updateWebsite(props: UpdateWebsiteProps): Promise<Response> {

    const { id, label, url, regexp, periodicity, tags, active } = props;

    const st = 'UPDATE webpages SET crawling = ? WHERE id = ?';
    const vl = [false,id];
    await pool.execute(st,vl);

    const web: FrontendWebsite = await getWebsite(id);

    if(id === undefined || id === "" || web == null) {
        return { status: 400, message: "Failed to update a website" };
    }

    if(label !== undefined && label != null) {
        const statement = 'UPDATE webpages SET label = ? WHERE id = ?'
        const values = [label,id];
        await pool.execute(statement, values);
    }
    if(url !== undefined && url != null && validURL(url)) {
        const statement = 'UPDATE webpages SET url = ? WHERE id = ?'
        const values = [url,id];
        await pool.execute(statement, values);

        web.url = url;
    }
    if(regexp !== undefined && regexp != null) {
        const statement = 'UPDATE webpages SET regex = ? WHERE id = ?'
        const values = [decodeURIComponent(regexp),id];
        await pool.execute(statement, values);

        web.regexp = decodeURIComponent(regexp);
    }
    if(periodicity !== undefined && periodicity != null) {
        const statement = 'UPDATE webpages SET periodicity = ? WHERE id = ?'
        const values = [periodicity,id];
        await pool.execute(statement, values);

        web.periodicity = periodicity;
    }
    if(tags !== undefined) {
        const statement = 'UPDATE webpages SET tags = ? WHERE id = ?'
        const values = [tags.join('-'),id];
        await pool.execute(statement, values);
    }
    if(active !== undefined && active != null) {
        const statement = 'UPDATE webpages SET active = ? WHERE id = ?'
        const values = [active,id];
        await pool.execute(statement, values);

        web.active = active;
    }


    const index = ids.indexOf(web.identifier)
    if(index !== -1) {
        workers[index].terminate();
        workers[index] = undefined;
        workers.splice(index, 1);
        ids.splice(index, 1);            
    }
    if(web.active){
        const worker: Worker = new Worker('./src/app/controllers/worker.controller.ts', { workerData: { web } });
        workers.push(worker);
        ids.push(web.identifier);
    }

    return { status: 200, message: "Website updated successfully" };
}

export async function getWebsite(id: string): Promise<FrontendWebsite> {

    const statement = 'SELECT * FROM webpages WHERE id = ?';
    const values = [id];
    const [rows] = await pool.execute(statement, values);

    const [rows_size] = await pool.query('SELECT COUNT(*) FROM webpages');
    const size: number = parseInt(rows_size[0]["COUNT(*)"]);
    if(size === 0) {
        return null;
    }

    const row = rows[0];

    const web: FrontendWebsite = {
        identifier: row.id,
        label: row.label,
        url: row.url,
        regexp: row.regex,
        periodicity: row.periodicity,
        tags: row.tags.split('-'),
        active: row.active,
        crawling: row.crawling,
        timestamp: timestampToDate(row.timestamp)
    };

    return web;
}