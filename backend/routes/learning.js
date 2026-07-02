const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { awardAchievement } = require('../utils/achievements');

// @route   GET api/learning/courses
// @desc    Get all courses
// @access  Public
router.get('/courses', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM courses');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/learning/my-courses
// @desc    Get the current user's courses with progress
// @access  Private
router.get('/my-courses', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT
         c.id,
         c.title,
         c.description,
         COUNT(DISTINCT l.id)::int AS total_lessons,
         COUNT(DISTINCT ulp.lesson_id)::int AS completed_lessons,
         CASE
           WHEN COUNT(DISTINCT l.id) = 0 THEN 0
           ELSE ROUND(COUNT(DISTINCT ulp.lesson_id) * 100.0 / COUNT(DISTINCT l.id))
         END AS progress_percentage
       FROM courses c
       JOIN modules m ON m.course_id = c.id
       JOIN lessons l ON l.module_id = m.id
       LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = l.id AND ulp.user_id = $1
       WHERE c.id IN (
         SELECT DISTINCT m2.course_id
         FROM modules m2
         JOIN lessons l2 ON l2.module_id = m2.id
         JOIN user_lesson_progress ulp2 ON ulp2.lesson_id = l2.id
         WHERE ulp2.user_id = $1
       )
       GROUP BY c.id, c.title, c.description
       ORDER BY c.title`,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/learning/lessons/:lessonId
// @desc    Get a single lesson by ID
// @access  Public
router.get('/lessons/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lessonRes = await db.query('SELECT * FROM lessons WHERE id = $1', [lessonId]);

    if (lessonRes.rows.length === 0) {
      return res.status(404).json({ msg: 'Lesson not found' });
    }

    res.json(lessonRes.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/learning/courses/:courseId
// @desc    Get a single course with its modules and lessons
// @access  Public
router.get('/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const courseRes = await db.query('SELECT * FROM courses WHERE id = $1', [courseId]);

    if (courseRes.rows.length === 0) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    const modulesRes = await db.query(
      'SELECT * FROM modules WHERE course_id = $1 ORDER BY module_order',
      [courseId]
    );

    const course = courseRes.rows[0];
    const modules = modulesRes.rows;

    for (const module of modules) {
      const lessonsRes = await db.query(
        'SELECT * FROM lessons WHERE module_id = $1 ORDER BY lesson_order',
        [module.id]
      );
      module.lessons = lessonsRes.rows;
    }

    course.modules = modules;
    res.json(course);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/learning/progress
// @desc    Get the current user's lesson progress
// @access  Private
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT lesson_id FROM user_lesson_progress WHERE user_id = $1',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/learning/lessons/:lessonId/complete
// @desc    Mark a lesson as complete for the current user
// @access  Private
router.post('/lessons/:lessonId/complete', authMiddleware, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    // Check if the progress already exists
    const existingProgress = await db.query(
      'SELECT * FROM user_lesson_progress WHERE user_id = $1 AND lesson_id = $2',
      [userId, lessonId]
    );

    if (existingProgress.rows.length > 0) {
      return res.json(existingProgress.rows[0]);
    }

    const newProgress = await db.query(
      'INSERT INTO user_lesson_progress (user_id, lesson_id) VALUES ($1, $2) RETURNING *',
      [userId, lessonId]
    );

    // Add to learning streaks
    await db.query(
      'INSERT INTO learning_streaks (user_id, completion_date) VALUES ($1, NOW()) ON CONFLICT (user_id, completion_date) DO NOTHING',
      [userId]
    );

    // Award achievements
    const progressCountRes = await db.query('SELECT COUNT(*) FROM user_lesson_progress WHERE user_id = $1', [userId]);
    const lessonCount = parseInt(progressCountRes.rows[0].count, 10);

    if (lessonCount === 1) {
      await awardAchievement(userId, 'first-lesson-completed');
    } else if (lessonCount === 5) {
      await awardAchievement(userId, 'five-lessons-completed');
    }

    res.json(newProgress.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/learning/streak
// @desc    Get the current user's learning streak
// @access  Private
router.get('/streak', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await db.query(
      `WITH dates AS (
        SELECT DISTINCT completion_date FROM learning_streaks WHERE user_id = $1
      ),
      streaks AS (
        SELECT
          completion_date,
          completion_date - LAG(completion_date, 1, completion_date) OVER (ORDER BY completion_date) as diff
        FROM dates
      )
      SELECT COUNT(*) as streak
      FROM streaks
      WHERE diff <= 1;`,
      [userId]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   POST api/learning/lessons/:lessonId/quiz
// @desc    Submit a quiz answer
// @access  Private
router.post('/lessons/:lessonId/quiz', authMiddleware, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { answer } = req.body;
    const userId = req.user.id;

    const lessonRes = await db.query('SELECT correct_answer FROM lessons WHERE id = $1', [lessonId]);
    if (lessonRes.rows.length === 0) {
      return res.status(404).json({ msg: 'Lesson not found' });
    }

    const isCorrect = lessonRes.rows[0].correct_answer === answer;

    if (isCorrect) {
      // Mark lesson as complete
      await db.query(
        'INSERT INTO user_lesson_progress (user_id, lesson_id) VALUES ($1, $2) ON CONFLICT (user_id, lesson_id) DO NOTHING',
        [userId, lessonId]
      );

      // Award 'first-quiz-passed' achievement
      const quizProgressCountRes = await db.query(
        `SELECT COUNT(*) 
         FROM user_lesson_progress ulp
         JOIN lessons l ON ulp.lesson_id = l.id
         WHERE ulp.user_id = $1 AND l.content_type = 'quiz'`, 
        [userId]
      );
      const quizCount = parseInt(quizProgressCountRes.rows[0].count, 10);

      if (quizCount === 1) {
        await awardAchievement(userId, 'first-quiz-passed');
      }
    }

    res.json({ correct: isCorrect });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/learning/courses/:courseId/progress
// @desc    Get user's progress for a specific course
// @access  Private
router.get('/courses/:courseId/progress', authMiddleware, async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const courseRes = await db.query('SELECT title FROM courses WHERE id = $1', [courseId]);
    if (courseRes.rows.length === 0) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    const lessonProgressRes = await db.query(
      `SELECT l.id as lesson_id, l.title as lesson_title, ulp.is_completed
       FROM lessons l
       LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = $1
       WHERE l.course_id = $2`,
      [userId, courseId]
    );

    const quizProgressRes = await db.query(
      `SELECT q.id as quiz_id, q.title as quiz_title, uqs.score
       FROM quizzes q
       LEFT JOIN user_quiz_scores uqs ON q.id = uqs.quiz_id AND uqs.user_id = $1
       WHERE q.course_id = $2`,
      [userId, courseId]
    );

    const completedLessons = lessonProgressRes.rows.filter(l => l.is_completed).length;
    const totalLessons = lessonProgressRes.rows.length;
    const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    res.json({
      course_title: courseRes.rows[0].title,
      overall_progress: overallProgress.toFixed(0),
      lessons: lessonProgressRes.rows,
      quizzes: quizProgressRes.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/learning/my-courses
// @desc    Get all courses a user is enrolled in
// @access  Private
router.get('/my-courses', authMiddleware, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { rows } = await db.query(
      `SELECT DISTINCT c.*
       FROM courses c
       JOIN modules m ON c.id = m.course_id
       JOIN lessons l ON m.id = l.module_id
       JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id
       WHERE ulp.user_id = $1`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;