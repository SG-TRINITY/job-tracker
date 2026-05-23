const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'jobs.json');

function read() {
  if (!fs.existsSync(DB_PATH)) return { jobs: [], nextId: 1 };
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function write(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function now() {
  return new Date().toISOString();
}

module.exports = {
  getAll() {
    return read().jobs.sort((a, b) => b.id - a.id);
  },
  getById(id) {
    return read().jobs.find(j => j.id === Number(id)) || null;
  },
  create(fields) {
    const data = read();
    const job = { id: data.nextId++, ...fields, created_at: now(), updated_at: now() };
    data.jobs.push(job);
    write(data);
    return job;
  },
  update(id, fields) {
    const data = read();
    const idx = data.jobs.findIndex(j => j.id === Number(id));
    if (idx === -1) return null;
    data.jobs[idx] = { ...data.jobs[idx], ...fields, updated_at: now() };
    write(data);
    return data.jobs[idx];
  },
  delete(id) {
    const data = read();
    const idx = data.jobs.findIndex(j => j.id === Number(id));
    if (idx === -1) return false;
    data.jobs.splice(idx, 1);
    write(data);
    return true;
  },
};
