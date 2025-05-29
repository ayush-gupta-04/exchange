"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPool = createPool;
const pg_1 = require("pg");
function createPool() {
    const pool = new pg_1.Pool({
        user: "postgres",
        host: "localhost",
        database: "newdb",
        password: "secret",
        port: 5432,
        max: 100, // Set max connections
        idleTimeoutMillis: 10000
    });
    return pool;
}
