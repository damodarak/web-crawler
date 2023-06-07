const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const mysql = require("mysql2");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const web = require('worker_threads').workerData.web;

var exeId;

const pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbName,
    waitForConnections: true,
    queueLimit: 0
}).promise();;

function generateId() {
    const id = Math.random().toString(19).slice(2);
    return id;
}

async function changeCrawlingState(state) {
    const statement = 'UPDATE webpages SET crawling = ? WHERE id = ?';
    const values = [state, web.identifier];
    await pool.execute(statement, values);
}

function timestampToDate(str) {
    const date = new Date(str);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str) && str.length < 2049;
}

async function start() {
    await crawler();
    setInterval(await crawler, web.periodicity * 1000);
}

start();

async function setTimestamp() {
    const statement = 'UPDATE webpages SET timestamp = CURRENT_TIMESTAMP WHERE id = ?';
    const values = [web.identifier];
    await pool.execute(statement, values);
}

async function crawler() {
    const statementExe = 'INSERT INTO executions (id,pageid,finished) VALUES (?,?,?)';
    exeId = generateId();
    const valuesExe = [exeId,web.identifier,false];
    await pool.execute(statementExe,valuesExe);

    await changeCrawlingState(true);
    await setTimestamp();
    await clearNodesByOwner(web.identifier);
    const node = await createInitialNode(web);
    await crawl(node, new RegExp(web.regexp), 0);
    await changeCrawlingState(false);

    const st = 'UPDATE executions SET finished = true WHERE id = ?';
    const vl = [exeId];
    pool.execute(st,vl);
}

function testData(data, url) {
    const contentType = data.headers['content-type'];
    if (!contentType || !contentType.includes('text/html')) {
        console.log(`not a html page`);
        return false;
    }

    if (data.status > 399) {
        console.log(`error in fetch with status code: ${data.status}, on page: ${url}`);
        return false;
    } else if (data === null) {
        console.log(`no html body found on page: ${url}`);
        return false;
    } else if (data.length === 0) {
        console.log(`empty html body found on page: ${url}`);
        return false;
    }

    return true;
}

async function getReferencesFromUrl(url) {    
    let data;

    await axios
    .get(url)
    .then((response) => {
        data = response;
    })
    .catch((err) => {
        return [];
    });

    if(data == null || !testData(data, url)) {
        return [];
    }

    const dom = new JSDOM(data.data);
    const links = dom.window.document.querySelectorAll('a');

    const refs = [];

    for(let i = 0; i < links.length; i++) {
        let link = links[i].href;
        try{
            if(!link) {
                continue;
            }
            
            if(link.startsWith('http://') || link.startsWith('https://')) {
                const test = new URL(link);
                refs.push(test.toString());
                continue;
            }

            const test = new URL(link, url);
            refs.push(test.toString());           
        }
        catch(e){}
    }
        
    return refs;
}

async function getTitleFromUrl(url) {
    let data; 
    
    await axios
    .get(url)
    .then((response) => {
        data = response;
    })
    .catch((err) => {
        return null;
    });

    if(data == null || !testData(data, url)) {
        return null;
    }

    return (new JSDOM(data.data)).window.document.title;
}

async function clearNodesByOwner(ownerid) {
    const statement = 'DELETE FROM nodes WHERE owner = ?';
    const values = [ownerid];
    await pool.execute(statement, values);
}

async function crawl(node, regex, depth = 0) {
    if (depth >= 3) {
        return;
    }

    console.log(`crawling ${node.url}`);

    const allRefs = await getReferencesFromUrl(node.url);

    const refs = allRefs
    .filter(ref => regex.test(ref))
    .filter(ref => validURL(ref));;

    const otherRefs = allRefs
    .filter(ref => !refs.includes(ref))
    .filter(ref => validURL(ref));

    for(let i = 0; i < otherRefs.length; i++) {
        const statement = 'INSERT INTO nodes (id,url,parentid,owner) VALUES (?,?,?,?)';
        const values = [generateId(),otherRefs[i],node.id,node.owner];
        pool.execute(statement, values);//without await because these nodes won't be crawled in the future
    }

    for(let i = 0; i < refs.length; i++) {
        if(!( await isUrlCrawled(refs[i], node.owner))) {
            const newNode = {
                id: generateId(),
                title: await getTitleFromUrl(refs[i]),
                url: refs[i],
                parentId: node.id,
                owner: node.owner
            };           

            const statement = 'INSERT INTO nodes (id,title,url,parentid,owner) VALUES (?, ?, ?, ?, ?)';
            const values = [newNode.id,newNode.title,newNode.url,newNode.parentId,newNode.owner];
            await pool.execute(statement, values);

            await crawl(newNode, regex, depth + 1);
        }
    }

    const statement = 'UPDATE nodes SET crawltime = CURRENT_TIMESTAMP WHERE id = ?';
    const values = [node.id];
    await pool.execute(statement, values);

    const statemen1 = 'UPDATE executions SET crawled = crawled + 1 WHERE id = ?';
    const values1 = [exeId];
    await pool.execute(statemen1, values1);
}

async function isUrlCrawled(url, owner) {
    const statement = 'SELECT COUNT(*) FROM nodes WHERE url = ? AND owner = ?';
    const values = [url, owner];

    const [rows, fields] = await pool.execute(statement,values);
    return rows[0]['COUNT(*)'] > 0;
}

async function createInitialNode(web) {
    const id = generateId();
    const title = await getTitleFromUrl(web.url);
    const url = web.url;
    const parentid = null;
    const owner = web.identifier;

    const statement = 'INSERT INTO nodes (id,title,url,parentid,owner) VALUES (?,?,?,?,?)';
    const values = [id,title,url,parentid, owner];
    await pool.execute(statement, values);

    return {
        id: id,
        title: title,
        url: url,
        owner: owner,
        parentId: parentid
    };
}