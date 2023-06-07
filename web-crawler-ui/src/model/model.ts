
export interface Website {
    identifier?: string;
    id?: string;
    label?: string;
    url?: string;
    regexp?: string;
    periodicity?: number;
    tags?: string[];
    active?: boolean;
    crawling?: boolean;
    timestamp?: string;
}

export interface Execution {
    id?: string;
    page?: Website;
    timestamp: string;
    crawled?: number;
}