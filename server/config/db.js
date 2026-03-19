const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'santech_store',
  password: '19942004Yy', // твой пароль
  port: 5432,
});

pool.connect()
  .then(() => console.log('✅ PostgreSQL подключен'))
  .catch(err => console.error('❌ Ошибка подключения:', err));

module.exports = pool;