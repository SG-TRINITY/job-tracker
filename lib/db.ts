import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const db = new DatabaseSync(path.join(process.cwd(), 'jobs.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    company      TEXT NOT NULL,
    applied_date TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'Applied',
    location     TEXT,
    salary_range TEXT,
    job_url      TEXT,
    notes        TEXT,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export default db;
