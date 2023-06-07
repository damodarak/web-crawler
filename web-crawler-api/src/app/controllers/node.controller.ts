import { BackendNode, FrontendNode, GetNodesProps, getFrontendNode } from "../model";
import { pool } from "../../server";
import { timestampToDate } from "./website.controller";

export async function getNodes(props: GetNodesProps): Promise<FrontendNode[]> {
    const { webPages } = props;

    const unique = webPages.filter(function(item, pos) {
        return webPages.indexOf(item) == pos;
    })
    
    const nodes: FrontendNode[] = [];

    // TODO: retrieve nodes from MySQL database

    for(let i = 0; i < unique.length; i++) {
        const statement = (((props.limit !== undefined) && (props.offset !== undefined)) ? 
        `SELECT * FROM nodes WHERE owner = ? LIMIT ${props.limit} OFFSET ${props.offset}` : 'SELECT * FROM nodes WHERE owner = ?');
        const statement_size = 'SELECT COUNT(*) FROM nodes WHERE  owner = ?';
        const values = [unique[i]];
        const [result] = await pool.execute(statement, values);
        const [size_result] = await pool.execute(statement_size, values);
        const size: number = parseInt(size_result[0]["COUNT(*)"])

        for(let j = 0; j < size; j++) {
            if(result[j] === undefined) {
                continue;
            }
            const node: BackendNode = {
                id: result[j].id,
                url: result[j].url,
                owner: result[j].owner,
                parentId: result[j].parentid
            }
            if(typeof result[j].title !== 'undefined' && result[j].title != null) {
                node.title = result[j].title;
            }
            if( typeof result[j].crawltime !== 'undefined' && result[j].crawltime !== null) {
                node.crawlTime = timestampToDate(result[j].crawltime);
            }
            nodes.push( await getFrontendNode(node));
        }
    }

    return nodes
}