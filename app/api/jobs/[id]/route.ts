import { NextResponse } from 'next/server';
import db from '@/lib/db';
import type { Job } from '@/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(Number(id)) as unknown as Job | undefined;
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(job);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(Number(id)) as unknown as Job | undefined;
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json();
  const { title, company, applied_date, status, location, salary_range, job_url, notes } = body;

  db.prepare(
    `UPDATE jobs
     SET title = ?, company = ?, applied_date = ?, status = ?,
         location = ?, salary_range = ?, job_url = ?, notes = ?,
         updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    title ?? existing.title,
    company ?? existing.company,
    applied_date ?? existing.applied_date,
    status ?? existing.status,
    location !== undefined ? (location || null) : existing.location,
    salary_range !== undefined ? (salary_range || null) : existing.salary_range,
    job_url !== undefined ? (job_url || null) : existing.job_url,
    notes !== undefined ? (notes || null) : existing.notes,
    Number(id)
  );

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(Number(id)) as unknown as Job;
  return NextResponse.json(job);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(Number(id));
  if (result.changes === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
