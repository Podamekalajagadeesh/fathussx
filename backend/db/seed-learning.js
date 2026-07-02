const db = require('./index');

const seedLearning = async () => {
  try {
    // Create a course
    const courseRes = await db.query(
      "INSERT INTO courses (title, description) VALUES ($1, $2) RETURNING id",
      ['Web Development Fundamentals', 'A beginner-friendly introduction to the world of web development.']
    );
    const courseId = courseRes.rows[0].id;

    // Create modules
    const module1Res = await db.query(
      "INSERT INTO modules (course_id, title, module_order) VALUES ($1, $2, $3) RETURNING id",
      [courseId, 'Introduction to HTML', 1]
    );
    const module1Id = module1Res.rows[0].id;

    const module2Res = await db.query(
      "INSERT INTO modules (course_id, title, module_order) VALUES ($1, $2, $3) RETURNING id",
      [courseId, 'Introduction to CSS', 2]
    );
    const module2Id = module2Res.rows[0].id;

    // Create lessons
    await db.query(
      "INSERT INTO lessons (module_id, title, content_type, content, lesson_order) VALUES ($1, $2, $3, $4, $5)",
      [module1Id, 'What is HTML?', 'text', 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.', 1]
    );
    await db.query(
      "INSERT INTO lessons (module_id, title, content_type, content, lesson_order, quiz_options, correct_answer) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [module1Id, 'Basic HTML Tags Quiz', 'quiz', 'What does the <a> tag stand for?', 3, JSON.stringify(['Apple', 'Anchor', 'Application']), 'Anchor']
    );
    await db.query(
      "INSERT INTO lessons (module_id, title, content_type, content, lesson_order) VALUES ($1, $2, $3, $4, $5)",
      [module2Id, 'What is CSS?', 'text', 'CSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in a markup language like HTML.', 1]
    );

    console.log('Learning content seeded successfully!');
  } catch (err) {
    console.error('Error seeding learning content:', err);
  }
};

seedLearning();