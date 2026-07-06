const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

const pool = new Pool({
  user: 'ule_user',
  host: 'localhost',
  database: 'ule_db',
  password: 'pin8800',
  port: 5432,
});

const runSqlFiles = async (filePaths) => {
  const client = await pool.connect();
  try {
    for (const filePath of filePaths) {
      const sql = await fs.readFile(filePath, 'utf-8');
      await client.query(sql);
      console.log(`Successfully executed ${path.basename(filePath)}`);
    }
  } catch (err) {
    console.error(`Error executing SQL files:`, err);
    throw err; // Re-throw to be handled by the caller
  } finally {
    client.release();
  }
};

// This allows the script to be run directly from the command line
if (require.main === module) {
  const filePaths = process.argv.slice(2);

  if (filePaths.length === 0) {
    console.error('Please provide at least one path to a .sql file.');
    process.exit(1);
  }

  runSqlFiles(filePaths)
    .then(() => {
      console.log('All SQL files executed successfully.');
    })
    .catch(() => {
      // The error is already logged by runSqlFiles
      console.error('Failed to execute SQL files.');
      process.exit(1);
    })
    .finally(() => {
      pool.end();
    });
}

module.exports = { runSqlFiles, pool };