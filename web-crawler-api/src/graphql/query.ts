import {
    getNodes,
    getWebsites,
    getWebsite,
    GetNodesProps,
    GetWebsiteProps,
    GetWebsitesProps,
    GetExesProps,
    getExes
} from "../app";

export const query = {
    websites: async (props: GetWebsitesProps, context) => {
        return getWebsites(props); 
    },
    executions: async (props: GetExesProps, context) => {
        return getExes(props);
    },
    website: async (props: GetWebsiteProps, context) => {
        return getWebsite(props.webPageId);
    },
    nodes: async (props: GetNodesProps, context) => {
        console.log("getting nodes");
        return getNodes(props);
    }
};