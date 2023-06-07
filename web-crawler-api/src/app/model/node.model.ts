import { FrontendWebsite } from "./index";
import { pool } from "../../server";
import { timestampToDate } from "../controllers";

export interface FrontendNode {
    id?: string;
    title?: string;
    url: string;
    crawlTime?: string;
    links: FrontendNode[];
    owner: FrontendWebsite;
    parentId?: string;
}

export interface BackendNode {
    id: string;
    title?: string;
    url: string;
    crawlTime?: string;
    owner: string;
    parentId?: string;
}

export async function getFrontendNode(node: BackendNode): Promise<FrontendNode> {

    // TODO: parses BackendNode to FrontendNode

    const result_node: FrontendNode = {
        id: node.id,
        url: node.url,
        links: await getFrontEndLinks(node.id),
        owner: await ownerToFrontendWebsite(node.owner),
        parentId: node.parentId ?? undefined
    };

    if(typeof node.title !== 'undefined' && node.title != null) {
        result_node.title = node.title;
    }
    if( typeof node.crawlTime !== 'undefined' && node.crawlTime != null) {
        result_node.crawlTime = timestampToDate(node.crawlTime);
    }

    return result_node;
}

async function getFrontEndLinks(parent: string): Promise<FrontendNode[]> {
    const statement = 'SELECT * FROM nodes WHERE  parentid = ?';
    const values = [parent];
    const [result] = await pool.execute(statement, values);
    const [rows_size] = await pool.execute('SELECT COUNT(*) FROM nodes WHERE parentid = ?', values);
    const size: number = parseInt(rows_size[0]["COUNT(*)"]);

    const nodes: FrontendNode[] = [];

    if(size !== 0) {
        for(let i = 0; i < size; i++) {
            const node: FrontendNode = {
                url: result[i].url,
                links: await getFrontEndLinks(result[i].id),
                owner: await ownerToFrontendWebsite(result[i].owner)
            };

            if(typeof result[i].title !== 'undefined' && result[i].title != null) {
                node.title = result[i].title;
            }
            if( typeof result[i].crawlTime !== 'undefined' && result[i].crawlTime != null) {
                node.crawlTime = timestampToDate(result[i].crawlTime);
            }

            nodes.push(node);
        }
    }

    return nodes;
}

async function ownerToFrontendWebsite(owner: string): Promise<FrontendWebsite> {
    const statement = 'SELECT * FROM webpages WHERE  id = ?';
    const values = [owner];
    const [result] = await pool.execute(statement, values);
    const row = result[0];

    const web: FrontendWebsite = {
        identifier: owner,
        label: row.label,
        url: row.url,
        regexp: row.regex,
        periodicity: row.periodicity,
        tags: row.tags.split('-'),
        active: row.active,
        crawling: row.crawling
    };

    return web;
}

export interface GetNodesProps {
    webPages: string[];
    limit?: number;
    offset?: number;
}