const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  res.json(db.getAll());
});

router.get('/:id', (req, res) => {
  const job = db.getById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

router.post('/', (req, res) => {
  const { title, company, applied_date, status, location, salary_range, job_url, notes } = req.body;
  if (!title || !company || !applied_date || !status) {
    return res.status(400).json({ error: 'title, company, applied_date, and status are required' });
  }
  const job = db.create({ title, company, applied_date, status, location: location || null, salary_range: salary_range || null, job_url: job_url || null, notes: notes || null });
  res.status(201).json(job);
});

router.put('/:id', (req, res) => {
  const existing = db.getById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Job not found' });
  const { title, company, applied_date, status, location, salary_range, job_url, notes } = req.body;
  const job = db.update(req.params.id, {
    title: title ?? existing.title,
    company: company ?? existing.company,
    applied_date: applied_date ?? existing.applied_date,
    status: status ?? existing.status,
    location: location !== undefined ? location : existing.location,
    salary_range: salary_range !== undefined ? salary_range : existing.salary_range,
    job_url: job_url !== undefined ? job_url : existing.job_url,
    notes: notes !== undefined ? notes : existing.notes,
  });
  res.json(job);
});

router.delete('/:id', (req, res) => {
  const deleted = db.delete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Job not found' });
  res.json({ message: 'Job deleted' });
});

module.exports = router;
