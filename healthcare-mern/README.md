# MediCare: Healthcare Management System (MERN)

Patients, Doctors and Appointments with full CRUD, JWT auth, search, pagination and role-based delete.

## Run it

Prerequisites: Node 18+, MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI and JWT_SECRET
npm run dev               # http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Open http://localhost:5173, click "Create one", and register. The first account is the admin.

## API

All routes except /api/auth/register and /api/auth/login need `Authorization: Bearer <token>`.

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login, returns token |
| GET | /api/auth/me | Current user |
| GET | /api/{patients,doctors,appointments} | List (?page=&limit=&search=) |
| POST | /api/{resource} | Create |
| GET | /api/{resource}/:id | Read one |
| PUT | /api/{resource}/:id | Update |
| DELETE | /api/{resource}/:id | Delete (admin only) |
