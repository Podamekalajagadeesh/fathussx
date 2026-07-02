const { up } = require('./migrations/add_streaks_table');

up().then(() => {
  console.log('Migration complete!');
  process.exit();
});