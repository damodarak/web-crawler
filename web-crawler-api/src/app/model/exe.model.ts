import { FrontendWebsite } from "./website.model";

export interface exe {
    id: string;
    page: FrontendWebsite;
    crawled: number;
    finished: boolean;
    timestamp: string;
}

export interface GetExesProps{
    limit?: number;
    offset?: number;
    webPage?: string;
}