export interface FrontendWebsite {
    identifier: string;
    label: string;
    url: string;
    regexp: string;
    periodicity: number;
    tags: string[];
    active: boolean;
    crawling: boolean;
    timestamp?: string;
}

export interface BackendWebsite {
    id: string;
    label: string;
    url: string;
    regexp: string;
    periodicity: number;
    tags: string;
    active: boolean;
    crawling: boolean;
    timestamp?: string;
}

export interface AddWebsiteProps {
    label: string;
    url: string;
    regexp: string;
    periodicity: number;
    tags: string[];
    active: boolean;
}

export interface DeleteWebsiteProps {
    id: string;
}

export interface UpdateWebsiteProps {
    id: string;
    label: string;
    url: string;
    regexp: string;
    periodicity: number;
    tags: string[];
    active: boolean;
}

export interface GetWebsiteProps {
    webPageId: string;
}

export interface GetWebsitesProps{
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: string;
}