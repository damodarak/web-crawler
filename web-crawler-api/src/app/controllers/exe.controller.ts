import { GetExesProps, exe } from "../model";
import { pool } from "../../server";
import { timestampToDate, getWebsite } from "./website.controller";

export async function getExes(props: GetExesProps): Promise<exe[]> {

    const exes: exe[] = [];

    let rows;

    if(props.webPage === undefined) {
        [rows] = await pool.query(((props.limit !== undefined) && (props.offset !== undefined)) ? 
    `SELECT * FROM executions ORDER BY timestamp DESC LIMIT ${props.limit} OFFSET ${props.offset}` : 'SELECT * FROM executions ORDER BY timestamp DESC');
    }
    else {
        [rows] = await pool.query(((props.limit !== undefined) && (props.offset !== undefined)) ? 
    `SELECT * FROM executions WHERE pageid="${props.webPage}" ORDER BY timestamp DESC LIMIT ${props.limit} OFFSET ${props.offset}` : 
    `SELECT * FROM executions WHERE pageid="${props.webPage}" ORDER BY timestamp DESC`);
    }
    
    const [rows_size] = await pool.query('SELECT COUNT(*) FROM executions');
    const size: number = parseInt(rows_size[0]["COUNT(*)"]);

    for (let i = 0; i < size; i++) {   
        let row = rows[i];
        if(row === undefined){
            continue;
        }
        exes.push({
            id: row.id,
            page: await getWebsite(row.pageid),
            crawled: row.crawled,
            finished: row.finished,
            timestamp: timestampToDate(row.timestamp)
        });
    }

    return exes;
}