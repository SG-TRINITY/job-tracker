const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { runAsync, getAsync, allAsync } = require('../db');

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await allAsync('SELECT * FROM jobs ORDER BY createdAt DESC');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await getAsync('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create job
router.post('/', async (req, res) => {
  try {
    const { title, company, applicationDate, status, jobUrl, salaryRange, location, notes } = req.body;
    
    // Validate required fields
    if (!title || !company || !applicationDate || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const result = await runAsync(
      `INSERT INTO jobs (id, title, company, applicationDate, status, jobUrl, salaryRange, location, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, company, applicationDate, status, jobUrl || null, salaryRange || null, location || null, notes || null, now, now]
    );

    const newJob = await getAsync('SELECT * FROM jobs WHERE id = ?', [id]);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update job
router.put('/:id', async (req, res) => {
  try {
    const { title, company, applicationDate, status, jobUrl, salaryRange, location, notes } = req.body;
    const now = new Date().toISOString();

    const existingJob = await getAsync('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await runAsync(
      `UPDATE jobs SET title = ?, company = ?, applicationDate = ?, status = ?, jobUrl = ?, salaryRange = ?, location = ?, notes = ?, updatedAt = ?
       WHERE id = ?`,
      [
        title || existingJob.title,
        company || existingJob.company,
        applicationDate || existingJob.applicationDate,
        status || existingJob.status,
        jobUrl || existingJob.jobUrl,
        salaryRange || existingJob.salaryRange,
        location || existingJob.location,
        notes || existingJob.notes,
        now,
        req.params.id
      ]
    );

    const updatedJob = await getAsync('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const job = await getAsync('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await runAsync('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
