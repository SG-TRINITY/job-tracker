# Job Tracker

A full-stack web application to track job applications with status updates, job details, and management features.

## Features

- 📋 **Job Table**: View all applied jobs with key information
- ➕ **Add Jobs**: Create new job applications via a popup modal
- 👀 **Job Details**: Click on rows to view complete job information in a sidebar
- ✏️ **Edit Jobs**: Modify job details at any time
- 🗑️ **Delete Jobs**: Remove jobs from your tracker
- 📊 **Status Tracking**: Track job status (Applied, Interviewing, Offer, Rejected, Accepted, Withdrawn)
- 💾 **Persistent Storage**: All data is saved to SQLite database

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Axios
- **Backend**: Node.js, Express
- **Database**: SQLite

## Job Fields

- Job Title
- Company
- Application Date
- Status
- Location
- Salary Range
- Job URL
- Notes/Description

## Project Structure

```
job-tracker/
├── backend/                 # Express API server
│   ├── server.js           # Main server entry point
│   ├── db.js               # SQLite database setup
│   ├── routes/
│   │   └── jobs.js         # Job API endpoints
│   ├── package.json
│   └── jobs.db             # SQLite database (auto-created)
│
├── frontend/               # React web application
│   ├── src/
│   │   ├── App.js          # Main application component
│   │   ├── components/
│   │   │   ├── JobTable.js           # Table display component
│   │   │   ├── AddJobModal.js        # Add/Edit job modal
│   │   │   └── JobDetailsPanel.js    # Job details sidebar
│   │   └── index.js        # React entry point
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone/Initialize the project**
   ```bash
   cd job-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   # or for development with auto-reload
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on `http://localhost:3000`

### API Endpoints

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get a specific job
- `POST /api/jobs` - Create a new job
- `PUT /api/jobs/:id` - Update a job
- `DELETE /api/jobs/:id` - Delete a job
- `GET /api/health` - Health check

## Usage

1. **Adding a Job**
   - Click the "+ Add Job" button
   - Fill in the required fields (Title, Company, Application Date, Status)
   - Optionally add Location, Salary Range, Job URL, and Notes
   - Click "Add Job"

2. **Viewing Job Details**
   - Click on any row in the job table
   - Details appear in the right sidebar
   - Shows all job information with formatted dates and links

3. **Editing a Job**
   - Click on a job to view details
   - Click the "Edit" button in the sidebar
   - Modify the information and click "Update Job"

4. **Deleting a Job**
   - Click on a job to view details
   - Click the "Delete" button in the sidebar
   - Confirm the deletion

## Features in Detail

### Status Tracking
- **Applied**: Initial status when job is added
- **Interviewing**: In interview process
- **Offer**: Received offer
- **Rejected**: Application rejected
- **Accepted**: Offer accepted
- **Withdrawn**: Application withdrawn

### Responsive Design
- Tailwind CSS provides a clean, modern UI
- Mobile-friendly interface
- Color-coded status badges for quick identification

## Future Enhancements

- Email notifications for job status updates
- Interview date reminders
- Statistics and analytics dashboard
- Filter and search capabilities
- Export data to CSV/PDF
- Multiple job categories/boards
- User authentication and multiple users
- Salary negotiation tracker

## Troubleshooting

### Backend won't connect
- Make sure the backend is running on port 5000
- Check that all dependencies are installed: `npm install` in backend folder

### Frontend won't connect to backend
- Ensure the proxy in `frontend/package.json` is set to `http://localhost:5000`
- Check that both frontend and backend are running

### Database issues
- Delete `backend/jobs.db` to reset the database
- The database will be recreated on next server start

## Development Tips

- Use React Developer Tools extension for debugging components
- Backend logs show all API requests
- Use browser DevTools Network tab to inspect API calls
- The database file is stored at `backend/jobs.db`

## License

MIT