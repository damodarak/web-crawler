import {getExecutionsQuery, getWebsiteNodesQuery, getWebsiteQuery} from "@/api/api";
import WebsitesScreen from "@/pages/websites";
import Website from "@/screens/website/Website";
import {notConnected, redirect} from "@/utils/utils";
import {useEffect} from "react";

export default function WebsiteScreen({ website, executions }) {

    return <Website website={website} executions={executions} />;
}

export async function getServerSideProps({ query }) {
    const { id, limit, offset } = query;

    /*
    if (!limit || !offset) {
        return redirect(`/websites/${id}?limit=10&offset=0`);
    }

    const queryLimit = limit ? parseInt(limit) : 10;
    const queryOffset = offset ? parseInt(offset) * limit : 0;
    */

    const getWebsite = await getWebsiteQuery(id);
    if (getWebsite === null) return notConnected();

    const website = getWebsite?.data?.data?.website ?? null;

    const getExecutions = await getExecutionsQuery({ webPage: website.identifier });
    const executions = getExecutions?.data?.data?.executions ?? null;

    return { props: { website, executions } };
}