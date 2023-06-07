import gql from "graphql-tag";

export const GetExecutionsQuery = gql`
    query executions($limit: Int, $offset: Int, $webPage: ID) {
        executions(limit: $limit, offset: $offset, webPage: $webPage) {
            id
            timestamp
            crawled
            finished
            page {
                identifier
                label
                url
                regexp
                tags
                active
                crawling
                periodicity
                timestamp
            }
        }
    }
`

export const GetWebsitesQuery = gql`
    query websites($limit: Int, $offset: Int, $sortBy: String, $sortOrder: String) {
        websites(limit: $limit, offset: $offset, sortBy: $sortBy, sortOrder: $sortOrder) {
            identifier
            label
            url
            regexp
            tags
            active
            crawling
            periodicity
            timestamp
        }
    }
`

export const GetWebsiteQuery = gql`
    query website($webPageId: ID!) {
        website(webPageId: $webPageId) {
            identifier
            label
            url
            regexp
            tags
            active
            crawling
            periodicity
            timestamp
        }
    }
`;

export const GetWebsiteCrawlingQuery = gql`
    query website($webPageId: ID!) {
        website(webPageId: $webPageId) {
            crawling
        }
    }
`

export const AddWebsiteQuery = gql`
    mutation addWebsite($label: String!, $url: String!, $regexp: String!, $periodicity: Int!, $tags: [String!]!, $active: Boolean!) {
        addWebsite(label: $label, url: $url, regexp: $regexp, periodicity: $periodicity, tags: $tags, active: $active) {
            message
            status
        }
    }
`;

export const UpdateWebsiteQuery = gql`
    mutation updateWebsite($id: ID!, $label: String, $url: String, $regexp: String, $periodicity: Int, $tags: [String!], $active: Boolean) {
        updateWebsite(id: $id, label: $label, url: $url, regexp: $regexp, periodicity: $periodicity, tags: $tags, active: $active) {
            message
            status
        }
    }
`;

export const DeleteWebsiteQuery = gql`
    mutation deleteWebsite($id: ID!) {
        deleteWebsite(id: $id) {
            message
            status
        }
    }
`;

export const GetWebsiteNodesQuery = gql`
    query nodes($webPages: [ID!]!, $limit: Int, $offset: Int) {
        nodes(webPages: $webPages, limit: $limit, offset: $offset) {
            id
            title
            url
            parentId
            crawlTime
        }
    }
`;
