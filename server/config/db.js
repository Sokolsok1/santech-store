const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',         // твой пользователь PostgreSQL
  host: 'localhost',
  database: 'santech_store',      // имя базы
  password: '19942004Yy',       // твой пароль
  port: 5432
});

module.exports = pool;