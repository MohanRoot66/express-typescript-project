const { Pool } = require('pg');
const dotenv = require("dotenv").config();

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: 'localhost',
  port: 5432,
  database: process.env.DATABASE
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
