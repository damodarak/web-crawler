import { buildSchema } from "graphql";

export const schema = buildSchema(`
    type Query {
        websites(limit: Int, offset: Int, sortBy: String, sortOrder: String): [WebPage!]!
        nodes(webPages: [ID!]!, limit: Int, offset: Int): [Node!]!
        website(webPageId: ID!): WebPage!
        executions(limit: Int, offset: Int, webPage: ID): [Exe!]!
    }

    type Mutation {
        addWebsite(label: String!, url: String!, regexp: String!, periodicity: Int!, tags: [String!]!, active: Boolean!): Response!
        deleteWebsite(id: ID!): Response!
        updateWebsite(id: ID!, label: String, url: String, regexp: String, periodicity: Int, tags: [String], active: Boolean): Response!
    }

    type Exe {
        id: ID!
        page: WebPage!
        crawled: Int!
        finished: Boolean!
        timestamp: String!
    }
    
    type WebPage {
        identifier: ID!
        label: String!
        url: String!
        regexp: String!
        periodicity: Int!
        tags: [String!]!	
        active: Boolean!
        crawling: Boolean!
        timestamp: String!
    }
    
    type Node {
        id: ID!
        title: String
        url: String!
        crawlTime: String
        links: [Node!]!
        owner: WebPage!
        parentId: ID
    }

    type Response {
        status: Int!
        message: String!
    }
`);