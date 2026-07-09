const { Pool } = require('pg');

// WARNING: This script is intended for development and will wipe existing project/task data.
// Do not run this in a production environment.

const pool = new Pool({
  user: 'ule_user',
  host: 'localhost',
  database: 'ule_db',
  password: 'pin8800',
  port: 5432,
});

const seed = async () => {
  try {
    console.log('Seeding database...');

    // Clear existing data
    await pool.query('DELETE FROM user_progress');
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM projects');
    console.log('Cleared existing project and task data.');

    // --- Project 1: Personal Portfolio ---
    const portfolioRes = await pool.query(
      `INSERT INTO projects (title, description) VALUES ($1, $2) RETURNING id`,
      ['Build a Personal Portfolio Website', 'A project to create a stunning personal portfolio to showcase your skills and projects.']
    );
    const portfolioId = portfolioRes.rows[0].id;
    console.log(`Inserted project "Personal Portfolio" with ID: ${portfolioId}`);

    await pool.query(
      `INSERT INTO tasks (project_id, title, description, order_num) VALUES ($1, $2, $3, $4), ($1, $5, $6, $7), ($1, $8, $9, $10), ($1, $11, $12, $13), ($1, $14, $15, $16)`,
      [
        portfolioId,
        'Set Up the Project Structure', 'Create the basic HTML, CSS, and JavaScript files.', 1,
        'Create the Navigation Bar', 'Build a responsive navigation menu for the website.', 2,
        'Design the "About Me" Section', 'Add a section with your biography and skills.', 3,
        'Showcase Your Projects', 'Create a gallery to display your best work.', 4,
        'Deploy the Website', 'Publish your portfolio to the web for everyone to see.', 5
      ]
    );

    // --- Project 2: Simple Blog ---
    const blogRes = await pool.query(
      `INSERT INTO projects (title, description) VALUES ($1, $2) RETURNING id`,
      ['Create a Simple Blog', 'Build a full-stack blog application where users can read and write posts.']
    );
    const blogId = blogRes.rows[0].id;
    console.log(`Inserted project "Simple Blog" with ID: ${blogId}`);

    await pool.query(
      `INSERT INTO tasks (project_id, title, description, order_num) VALUES ($1, $2, $3, $4), ($1, $5, $6, $7), ($1, $8, $9, $10), ($1, $11, $12, $13)`,
      [
        blogId,
        'Set Up the Backend API', 'Create Express routes for posts (CRUD operations).', 1,
        'Design the Database Schema', 'Define the tables for users and posts.', 2,
        'Build the Frontend', 'Create React components for displaying posts and writing new ones.', 3,
        'Implement User Authentication', 'Add login and registration to protect the write access.', 4
      ]
    );

    // --- Project 3: Weather App ---
    const weatherRes = await pool.query(
      `INSERT INTO projects (title, description) VALUES ($1, $2) RETURNING id`,
      ['Build a Weather App', 'Create an application that fetches and displays the current weather for a given city.']
    );
    const weatherId = weatherRes.rows[0].id;
    console.log(`Inserted project "Weather App" with ID: ${weatherId}`);

    await pool.query(
      `INSERT INTO tasks (project_id, title, description, order_num) VALUES ($1, $2, $3, $4), ($1, $5, $6, $7), ($1, $8, $9, $10)`,
      [
        weatherId,
        'Find a Weather API', 'Research and get an API key from a free weather data provider.', 1,
        'Create the User Interface', 'Design a simple UI with an input for the city and a display for the weather.', 2,
        'Fetch and Display Data', 'Write the JavaScript code to call the API and show the results.', 3
      ]
    );

    console.log('Inserted starter learning projects and tasks.');
    console.log('Database seeding complete!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await pool.end();
  }
};

seed();