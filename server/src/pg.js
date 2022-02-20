import pkg from "pg";
import { pgConf } from "../db/pgConf.js";
const { Pool } = pkg;

const pool = new Pool(pgConf);

export async function execQuery(query) {
    const client = await pool.connect();
    try {
        return await client.query(query);
    } catch (error) {
        console.error("[pg-utils:execQuery]", query, error);
    } finally {
        client.release();
    }
}
