const db = require('../index');

const up = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS learning_streaks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      completion_date DATE NOT NULL,
      UNIQUE(user_id, completion_date)
    );
  `);
};

const down = async () => {
  await db.query('DROP TABLE IF EXISTS learning_streaks');
};

module.exports = { up, down };