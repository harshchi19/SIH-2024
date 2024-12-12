import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'Sameer4224',
    database: process.env.POSTGRES_DATABASE || 'sih24'
});