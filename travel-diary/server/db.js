const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'travel-diary.db');

let db = null;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  // Load existing database or create new
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT    NOT NULL UNIQUE,
      email         TEXT    NOT NULL UNIQUE,
      password_hash TEXT    NOT NULL,
      created_at    TEXT    DEFAULT (datetime('now'))
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title         TEXT    NOT NULL,
      description   TEXT    DEFAULT '',
      cover_emoji   TEXT    DEFAULT '✈️',
      share_token   TEXT    NOT NULL UNIQUE,
      is_public     INTEGER DEFAULT 0,
      start_date    TEXT    DEFAULT NULL,
      end_date      TEXT    DEFAULT NULL,
      created_at    TEXT    DEFAULT (datetime('now')),
      updated_at    TEXT    DEFAULT (datetime('now'))
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS moments (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id       INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
      note          TEXT    DEFAULT '',
      rating        INTEGER CHECK(rating IS NULL OR (rating >= 1 AND rating <= 5)),
      latitude      REAL,
      longitude     REAL,
      location_name TEXT    DEFAULT '',
      photo_path    TEXT    DEFAULT NULL,
      category      TEXT    DEFAULT 'general',
      captured_at   TEXT    DEFAULT (datetime('now')),
      created_at    TEXT    DEFAULT (datetime('now'))
    );
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_trips_share ON trips(share_token);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_moments_trip ON moments(trip_id);`);

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON;');

  // Save periodically
  saveDb();

  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// Helper: run a query and return all rows as objects
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Helper: run a query and return first row as object
function queryOne(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let result = null;
  if (stmt.step()) {
    result = stmt.getAsObject();
  }
  stmt.free();
  return result;
}

// Helper: run an insert/update/delete and return last insert id
function execute(sql, params = []) {
  db.run(sql, params);
  saveDb();
  const row = queryOne('SELECT last_insert_rowid() as id');
  return row ? row.id : null;
}

// Helper: run an update/delete (no return value needed)
function run(sql, params = []) {
  db.run(sql, params);
  saveDb();
}

module.exports = { getDb, queryAll, queryOne, execute, run, saveDb };
