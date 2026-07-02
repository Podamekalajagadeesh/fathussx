const db = require('../db');

const seedAchievements = async () => {
  try {
    console.log('Seeding achievements...');

    await db.query(`
      INSERT INTO achievements (slug, name, description, icon) VALUES
      ('first-gig-created', 'Gig Pioneer', 'You created your first gig!', 'fas fa-star'),
      ('first-lesson-completed', 'Eager Learner', 'You completed your first lesson!', 'fas fa-graduation-cap'),
      ('five-lessons-completed', 'Dedicated Student', 'You completed five lessons!', 'fas fa-book-reader'),
      ('first-application', 'Go-Getter', 'You submitted your first application!', 'fas fa-rocket');
    `);

    console.log('Achievements seeded successfully!');
  } catch (err) {
    console.error('Error seeding achievements:', err);
  }
};

seedAchievements();