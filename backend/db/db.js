const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else {
  require('dotenv').config();
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function executeSqlFile(filePath) {
  const sql = await fs.readFile(filePath, 'utf-8');
  await pool.query(sql);
}

async function reset() {
  console.log('Starting database reset...');
  try {
    console.log('Dropping all tables...');
    await executeSqlFile(path.join(__dirname, 'init.sql'));

    console.log('Database reset completed successfully.');
  } catch (error) {
    console.error('Error during database reset:', error);
    throw error;
  }
}

module.exports = { pool, reset };