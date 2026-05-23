import { NextResponse } from 'next/server';
import db from '@/lib/db';
import type { Job } from '@/types';

export async function GET() {
  const jobs = db.prepare('SELECT * FROM jobs ORDER BY id DESC').all() as unknown as Job[];
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, company, applied_date, status, location, salary_range, job_url, notes } = body;

  if (!title || !company || !applied_date || !status) {
    return NextResponse.json(
      { error: 'title, company, applied_date, and status are required' },
      { status: 400 }
    );
  }

  const result = db
    .prepare(
      'INSERT INTO jobs (title, company, applied_date, status, location, salary_range, job_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    .run(title, company, applied_date, status, location || null, salary_range || null, job_url || null, notes || null);

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid) as unknown as Job;
  return NextResponse.json(job, { status: 201 });
}
