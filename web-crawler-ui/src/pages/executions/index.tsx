import Executions from "@/screens/executions/Executions";
import {getExecutionsQuery, getWebsitesQuery} from "@/api/api";
import {notConnected, redirect} from "@/utils/utils";

function ExecutionsScreen({ executions }) {
    return <Executions executions={executions} />
}

export async function getServerSideProps({ query, eq, params }) {
    const { limit, offset } = query;

    if (!limit || !offset) {
        return redirect("/executions?limit=10&offset=0");
    }

    const queryLimit = limit ? parseInt(limit) : 10;
    const queryOffset = offset ? parseInt(offset) * limit : 0;

    const response = await getExecutionsQuery({ limit: queryLimit, offset: queryOffset });

    if (response === null) return notConnected();

    const executions = response?.data?.data?.executions ?? null;

    return { props: { executions } };
}

export default ExecutionsScreen;