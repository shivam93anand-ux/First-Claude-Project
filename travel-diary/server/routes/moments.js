const express = require('express');
const multer = require('multer');
const path = require('path');
const { queryOne, execute, run } = require('../db');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|heic)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// POST /api/trips/:tripId/moments - create a moment
router.post('/trips/:tripId/moments', authenticate, upload.single('photo'), (req, res) => {
  const trip = queryOne('SELECT * FROM trips WHERE id = ? AND user_id = ?', [req.params.tripId, req.userId]);

  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const { note, rating, latitude, longitude, location_name, category, captured_at } = req.body;
  const photoPath = req.file ? req.file.filename : null;

  const id = execute(`
    INSERT INTO moments (trip_id, note, rating, latitude, longitude, location_name, photo_path, category, captured_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')))
  `, [
    trip.id,
    note || '',
    rating ? parseInt(rating) : null,
    latitude ? parseFloat(latitude) : null,
    longitude ? parseFloat(longitude) : null,
    location_name || '',
    photoPath,
    category || 'general',
    captured_at || null
  ]);

  const moment = queryOne('SELECT * FROM moments WHERE id = ?', [id]);
  res.status(201).json({ moment });
});

// PUT /api/moments/:id - update a moment
router.put('/moments/:id', authenticate, (req, res) => {
  const moment = queryOne(`
    SELECT m.* FROM moments m
    JOIN trips t ON t.id = m.trip_id
    WHERE m.id = ? AND t.user_id = ?
  `, [req.params.id, req.userId]);

  if (!moment) {
    return res.status(404).json({ error: 'Moment not found' });
  }

  const { note, rating, location_name, category } = req.body;

  run(`
    UPDATE moments SET
      note = COALESCE(?, note),
      rating = COALESCE(?, rating),
      location_name = COALESCE(?, location_name),
      category = COALESCE(?, category)
    WHERE id = ?
  `, [
    note !== undefined ? note : null,
    rating !== undefined ? parseInt(rating) : null,
    location_name !== undefined ? location_name : null,
    category || null,
    moment.id
  ]);

  const updated = queryOne('SELECT * FROM moments WHERE id = ?', [moment.id]);
  res.json({ moment: updated });
});

// DELETE /api/moments/:id
router.delete('/moments/:id', authenticate, (req, res) => {
  const moment = queryOne(`
    SELECT m.* FROM moments m
    JOIN trips t ON t.id = m.trip_id
    WHERE m.id = ? AND t.user_id = ?
  `, [req.params.id, req.userId]);

  if (!moment) {
    return res.status(404).json({ error: 'Moment not found' });
  }

  run('DELETE FROM moments WHERE id = ?', [moment.id]);
  res.json({ success: true });
});

module.exports = router;
