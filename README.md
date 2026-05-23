# Job Tracker

Track your job applications — add, edit, and delete jobs with status tracking and a detail sidebar.

## Stack

- **Next.js 15** (App Router, API routes)
- **SQLite** via `node:sqlite` (built into Node.js 22+)
- **Tailwind CSS**
- **TypeScript**

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`. The SQLite database (`jobs.db`) is created automatically on first run.

## Structure

```
app/
  page.tsx              # main UI
  layout.tsx
  globals.css
  api/jobs/
    route.ts            # GET /api/jobs, POST /api/jobs
    [id]/route.ts       # PUT /api/jobs/:id, DELETE /api/jobs/:id
components/
  JobTable.tsx
  AddJobModal.tsx
  JobDetailsPanel.tsx
lib/
  db.ts                 # SQLite init
types/
  index.ts              # Job type
```

## Job Fields

Title, Company, Applied Date, Status, Location, Salary Range, Job URL, Notes

## Statuses

Applied → Interviewing → Offer → Accepted / Rejected / Withdrawn
