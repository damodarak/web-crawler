import { FrontendWebsite } from "../model";
import { getWebsites } from "./website.controller";
import { Worker } from "worker_threads";
import { workers, ids } from "../../server";

export async function startCrawler() {
    const webs: FrontendWebsite[] = await getWebsites({});

    for(const web of webs) {
        if(web.active) {
            const worker: Worker = new Worker('./src/app/controllers/worker.controller.ts', { workerData: { web } });
            workers.push(worker);
            ids.push(web.identifier);
        }        
    }
}