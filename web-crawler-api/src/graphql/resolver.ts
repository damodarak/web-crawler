import { query } from "./query";
import { mutation } from "./mutation";

export const resolver = { ...query, ...mutation };