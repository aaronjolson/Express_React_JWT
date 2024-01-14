const { Pool } = require('pg');
const { DB_CONFIG } = require('./config');

const pool = new Pool(DB_CONFIG);

const query = (text, params) => pool.query(text, params);

module.exports = { query };