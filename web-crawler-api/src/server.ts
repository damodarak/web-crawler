import express, { Express, Request, Response } from "express";
import { graphqlHTTP } from "express-graphql";
import mysql from 'mysql2/promise';
import { schema, resolver } from "./graphql";
import dotenv from 'dotenv';
import { startCrawler } from './app/controllers';
import { Worker } from "worker_threads";
import cors from "cors";

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const app: Express = express();
const port: number = 3000;

// TODO: use this variable as your database instance
export const pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export let workers: Worker[] = [];
export let ids: string[] = [];

startCrawler();

app.get("/", (request: Request, response: Response) => {
    response.json("Hello from Web Crawler!");
});

app.use(cors());

app.use("/graphql", graphqlHTTP((request, response, graphQLParams) => ({
    schema,
    rootValue: resolver,
    graphiql: true,
    context: { request, response }
})));

function startListening(port) {
    app
      .listen(port, () => console.log(`GraphQL server is running on localhost:${port}/graphql V.2`))
      .on("error", (error) => {
        if (port < 65535) {
          startListening(port + 1);
        }
      });
  }
  
startListening(3000);