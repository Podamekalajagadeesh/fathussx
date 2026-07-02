const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   POST api/courses
// @desc    Create a course
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newCourse = await db.query(
      'INSERT INTO courses (title, description, creator_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, req.user.id]
    );
    res.json(newCourse.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses
// @desc    Get all courses for the creator
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const courses = await db.query('SELECT * FROM courses WHERE creator_id = $1', [req.user.id]);
    res.json(courses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses/:id
// @desc    Get a course by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const course = await db.query('SELECT * FROM courses WHERE id = $1 AND creator_id = $2', [req.params.id, req.user.id]);
    if (course.rows.length === 0) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.json(course.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/courses/:id
// @desc    Update a course
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, is_published } = req.body;
  try {
    const updatedCourse = await db.query(
      'UPDATE courses SET title = $1, description = $2, is_published = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND creator_id = $5 RETURNING *',
      [title, description, is_published, req.params.id, req.user.id]
    );
    if (updatedCourse.rows.length === 0) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.json(updatedCourse.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/courses/:id
// @desc    Delete a course
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleteRes = await db.query('DELETE FROM courses WHERE id = $1 AND creator_id = $2', [req.params.id, req.user.id]);
    if (deleteRes.rowCount === 0) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.json({ msg: 'Course deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/courses/:id/modules
// @desc    Create a module for a course
// @access  Private
router.post('/:id/modules', authMiddleware, async (req, res) => {
  const { title, module_order } = req.body;
  try {
    const newModule = await db.query(
      'INSERT INTO course_modules (course_id, title, module_order) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, title, module_order]
    );
    res.json(newModule.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses/:id/modules
// @desc    Get all modules for a course
// @access  Private
router.get('/:id/modules', authMiddleware, async (req, res) => {
  try {
    const modules = await db.query('SELECT * FROM course_modules WHERE course_id = $1 ORDER BY module_order', [req.params.id]);
    res.json(modules.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/courses/modules/:moduleId/content
// @desc    Create content for a module
// @access  Private
router.post('/modules/:moduleId/content', authMiddleware, async (req, res) => {
    const { title, content_type, content_url, content_order } = req.body;
    try {
        const newContent = await db.query(
            'INSERT INTO course_content (module_id, title, content_type, content_url, content_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.params.moduleId, title, content_type, content_url, content_order]
        );
        res.json(newContent.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/courses/modules/:moduleId/content
// @desc    Get all content for a module
// @access  Private
router.get('/modules/:moduleId/content', authMiddleware, async (req, res) => {
    try {
        const content = await db.query('SELECT * FROM course_content WHERE module_id = $1 ORDER BY content_order', [req.params.moduleId]);
        res.json(content.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;