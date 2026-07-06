const { Pool } = require('pg');

async function resetTestDB() {
  const dbName = 'ule_db_test';
  const pool = new Pool({
    connectionString: 'postgresql://postgres:pin8800@localhost:5432/postgres',
  });

  try {
    // Create role if it doesn't exist
    try {
      await pool.query(`CREATE ROLE ule_user WITH LOGIN PASSWORD 'pin8800'`);
      console.log('Role ule_user created.');
    } catch (roleErr) {
      if (!roleErr.message.includes('already exists')) {
        throw roleErr;
      }
      console.log('Role ule_user already exists.');
    }

    await pool.query(`DROP DATABASE IF EXISTS ${dbName}`);
    await pool.query(`CREATE DATABASE ${dbName}`);
    await pool.query(`GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ule_user`);
    console.log(`Database ${dbName} created successfully.`);
  } catch (error) {
    console.error('Error creating test database:', error);
  } finally {
    await pool.end();
  }

  const adminPool = new Pool({
    connectionString: `postgresql://postgres:pin8800@localhost:5432/${dbName}`,
  });

  try {
    // Execute the initialization SQL directly as the DB superuser so
    // schema creation doesn't fail due to permission issues.
    const fs = require('fs').promises;
    const path = require('path');
    const initSqlPath = path.join(__dirname, 'init.sql');
    const sql = await fs.readFile(initSqlPath, 'utf-8');
    await adminPool.query(sql);
    // Ensure the test role has privileges on the new schema and tables
    try {
      await adminPool.query(`GRANT ALL PRIVILEGES ON SCHEMA public TO ule_user`);
      await adminPool.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ule_user`);
      await adminPool.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ule_user`);
      await adminPool.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ule_user`);
      console.log('Test database initialized and privileges granted successfully.');
    } catch (grantErr) {
      console.error('Error granting privileges to ule_user:', grantErr);
      throw grantErr;
    }
  } catch (error) {
    console.error('Error resetting test database:', error);
  } finally {
    await adminPool.end();
  }
}

resetTestDB();