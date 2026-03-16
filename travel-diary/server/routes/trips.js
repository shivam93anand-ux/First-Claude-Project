const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { queryAll, queryOne, execute, run } = require('../db');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// GET /api/trips - list user's trips
router.get('/', authenticate, (req, res) => {
  const trips = queryAll(`
    SELECT t.*,
           (SELECT COUNT(*) FROM moments m WHERE m.trip_id = t.id) as moment_count,
           (SELECT m2.photo_path FROM moments m2 WHERE m2.trip_id = t.id AND m2.photo_path IS NOT NULL LIMIT 1) as cover_photo
    FROM trips t
    WHERE t.user_id = ?
    ORDER BY t.created_at DESC
  `, [req.userId]);

  res.json({ trips });
});

// POST /api/trips - create a new trip
router.post('/', authenticate, (req, res) => {
  const { title, description, cover_emoji, start_date, end_date } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const shareToken = uuidv4();

  const id = execute(`
    INSERT INTO trips (user_id, title, description, cover_emoji, share_token, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    req.userId,
    title,
    description || '',
    cover_emoji || '✈️',
    shareToken,
    start_date || null,
    end_date || null
  ]);

  const trip = queryOne('SELECT * FROM trips WHERE id = ?', [id]);
  res.status(201).json({ trip });
});

// GET /api/trips/:id - get trip with moments
router.get('/:id', authenticate, (req, res) => {
  const trip = queryOne('SELECT * FROM trips WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);

  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const moments = queryAll(
    'SELECT * FROM moments WHERE trip_id = ? ORDER BY captured_at ASC',
    [trip.id]
  );

  res.json({ trip, moments });
});

// PUT /api/trips/:id - update trip
router.put('/:id', authenticate, (req, res) => {
  const trip = queryOne('SELECT * FROM trips WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);

  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const { title, description, cover_emoji, is_public, start_date, end_date } = req.body;

  run(`
    UPDATE trips SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      cover_emoji = COALESCE(?, cover_emoji),
      is_public = COALESCE(?, is_public),
      start_date = COALESCE(?, start_date),
      end_date = COALESCE(?, end_date),
      updated_at = datetime('now')
    WHERE id = ?
  `, [
    title || null,
    description !== undefined ? description : null,
    cover_emoji || null,
    is_public !== undefined ? (is_public ? 1 : 0) : null,
    start_date || null,
    end_date || null,
    trip.id
  ]);

  const updated = queryOne('SELECT * FROM trips WHERE id = ?', [trip.id]);
  res.json({ trip: updated });
});

// DELETE /api/trips/:id
router.delete('/:id', authenticate, (req, res) => {
  const trip = queryOne('SELECT * FROM trips WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);

  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  run('DELETE FROM moments WHERE trip_id = ?', [trip.id]);
  run('DELETE FROM trips WHERE id = ?', [trip.id]);
  res.json({ success: true });
});

// GET /api/shared/:shareToken - public trip view
router.get('/shared/:shareToken', (req, res) => {
  const trip = queryOne('SELECT * FROM trips WHERE share_token = ? AND is_public = 1', [req.params.shareToken]);

  if (!trip) {
    return res.status(404).json({ error: 'Trip not found or not public' });
  }

  const moments = queryAll(
    'SELECT * FROM moments WHERE trip_id = ? ORDER BY captured_at ASC',
    [trip.id]
  );

  const user = queryOne('SELECT username FROM users WHERE id = ?', [trip.user_id]);

  res.json({ trip, moments, author: user ? user.username : 'Unknown' });
});

module.exports = router;
