const { Pool } = require('pg');
const path = require('path');
const fs = require('fs').promises;

async function seedMVPData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://ule_user:pin8800@localhost:5432/ule_db_test',
  });

  try {
    console.log('🌱 Seeding MVP data...');

    // Create test admin user
    const adminUser = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      ['admin', 'admin@example.com', '$2a$10$...hashed_password...', 'admin']
    );
    console.log('✓ Admin user created');

    // Create 5 MVP courses
    const courses = [
      {
        title: 'Python Basics: Intro to Programming',
        description: 'Learn Python fundamentals: variables, loops, functions, and basic data structures.'
      },
      {
        title: 'Web Development: HTML & CSS',
        description: 'Master HTML5 and CSS3 to build beautiful, responsive websites.'
      },
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn JavaScript ES6+, async programming, and DOM manipulation.'
      },
      {
        title: 'React for Beginners',
        description: 'Build interactive UIs with React: components, hooks, state management.'
      },
      {
        title: 'Database Basics with SQL',
        description: 'Learn SQL: queries, joins, indexing, and database design fundamentals.'
      }
    ];

    const courseIds = [];
    for (const course of courses) {
      const result = await pool.query(
        'INSERT INTO courses (title, description) VALUES ($1, $2) RETURNING id',
        [course.title, course.description]
      );
      courseIds.push(result.rows[0].id);
    }
    console.log(`✓ Created ${courseIds.length} courses`);

    // Create modules for first course (Python)
    const pythonModules = [
      { title: 'Getting Started with Python', order: 1 },
      { title: 'Variables and Data Types', order: 2 },
      { title: 'Control Flow', order: 3 }
    ];

    const moduleIds = [];
    for (const mod of pythonModules) {
      const result = await pool.query(
        'INSERT INTO modules (course_id, title, module_order) VALUES ($1, $2, $3) RETURNING id',
        [courseIds[0], mod.title, mod.order]
      );
      moduleIds.push(result.rows[0].id);
    }
    console.log(`✓ Created ${moduleIds.length} modules`);

    // Create lessons for first module
    const lessons = [
      {
        title: 'What is Python?',
        content_type: 'video',
        content: 'https://example.com/python-intro.mp4',
        order: 1
      },
      {
        title: 'Installing Python',
        content_type: 'text',
        content: '# Installing Python\n\n1. Visit python.org\n2. Download Python 3.11+\n3. Run the installer\n4. Add to PATH',
        order: 2
      },
      {
        title: 'Your First Program',
        content_type: 'video',
        content: 'https://example.com/hello-world.mp4',
        order: 3
      }
    ];

    for (const lesson of lessons) {
      await pool.query(
        'INSERT INTO lessons (module_id, title, content_type, content, lesson_order, quiz_options, correct_answer) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [
          moduleIds[0],
          lesson.title,
          lesson.content_type,
          lesson.content,
          lesson.order,
          JSON.stringify({ options: ['Option 1', 'Option 2', 'Option 3'] }),
          'Option 1'
        ]
      );
    }
    console.log(`✓ Created lessons for Module 1`);

    // Create achievements/badges
    const badges = [
      { slug: 'first-lesson', name: 'First Step', description: 'Completed your first lesson' },
      { slug: 'course-complete', name: 'Course Master', description: 'Completed an entire course' },
      { slug: 'quiz-perfect', name: 'Perfect Score', description: 'Got 100% on a quiz' },
      { slug: 'week-streak', name: '7 Day Streak', description: 'Learned for 7 days in a row' }
    ];

    for (const badge of badges) {
      await pool.query(
        'INSERT INTO achievements (slug, name, description, icon) VALUES ($1, $2, $3, $4) ON CONFLICT (slug) DO NOTHING',
        [badge.slug, badge.name, badge.description, '🏆']
      );
    }
    console.log(`✓ Created ${badges.length} achievements`);

    console.log('\n✅ MVP seed data created successfully!\n');
    console.log('Test credentials:');
    console.log('  Username: admin');
    console.log('  Email: admin@example.com\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedMVPData();
