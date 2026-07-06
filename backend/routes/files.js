const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// @route   POST api/files/upload
// @desc    Upload a file
// @access  Private
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'File upload failed. Please check the file type and try again.' });
  }
  const { filename, path, mimetype, size } = req.file;
  try {
    const newFile = await db.query(
      'INSERT INTO files (filename, path, mimetype, size, uploader_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [filename, path, mimetype, size, req.user.id]
    );
    res.json(newFile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/files
// @desc    Get all files
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const files = await db.query('SELECT id, filename FROM files WHERE uploader_id = $1', [req.user.id]);
    res.json(files.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/files/:id
// @desc    Download a file
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const file = await db.query('SELECT * FROM files WHERE id = $1 AND uploader_id = $2', [req.params.id, req.user.id]);
    if (file.rows.length === 0) {
      return res.status(404).json({ msg: 'File not found or you do not have permission to access it.' });
    }
    res.download(file.rows[0].path, file.rows[0].filename);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;