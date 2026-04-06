# TaskFlow

A full stack Kanban board application for managing tasks across workflows.

## Live Demo
> Deployment coming soon

## Built With
- **Frontend** — React, React Router, CSS3
- **Backend** — Node.js, Express.js
- **Database** — MongoDB with Mongoose
- **Auth** — JWT tokens with bcrypt password hashing

## Features
- User registration and login with JWT authentication
- Personal Kanban board with 3 columns — To Do, In Progress, Done
- Add, delete and drag tasks between columns
- Tasks persist in MongoDB across sessions
- Protected routes — board only accessible when logged in
- Fully responsive design

## How It Works
1. User registers → password hashed with bcrypt → saved to MongoDB
2. Login → JWT token generated → stored in localStorage
3. Every API request sends JWT token in Authorization header
4. Backend verifies token → returns user's tasks from MongoDB
5. Tasks saved permanently — survive page refresh and logout

## Installation & Run
```bash
# Clone the repo
git clone https://github.com/rajrathore0107/TaskFlow.git
cd TaskFlow

# Install backend dependencies
cd server
npm install
npm run dev

# Install frontend dependencies (new terminal)
cd client
npm install
npm start
```

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create new account |
| POST | /api/auth/login | Login and get token |
| GET | /api/tasks | Get all user tasks |
| POST | /api/tasks | Create new task |
| PATCH | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

## Project Structure
```
TaskFlow/
├── client/          # React frontend
│   └── src/
│       ├── pages/   # Login, Register, Board
│       ├── components/
│       └── api.js   # API helper functions
└── server/          # Node.js backend
    ├── models/      # MongoDB schemas
    ├── routes/      # API endpoints
    └── middleware/  # JWT auth middleware
```