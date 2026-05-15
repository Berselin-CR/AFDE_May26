# Feedback Management System

A full-stack web application to collect, store, search, and manage feedback centrally — with role-based access control.

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | Vanilla HTML / CSS / JavaScript   |
| Backend   | FastAPI (Python)                  |
| Database  | SQLite                            |
| Server    | Uvicorn                           |
| API Docs  | Swagger UI (auto-generated)       |

---

## Project Structure

```
feedback-management-system/
├── backend/
│   ├── main.py           # FastAPI app — serves frontend + API routes
│   ├── database.py       # SQLAlchemy engine and session
│   ├── models.py         # ORM model (Feedback table)
│   ├── schemas.py        # Pydantic request/response models
│   ├── crud.py           # All database operations
│   ├── routers/
│   │   └── feedback.py   # /feedback CRUD routes (admin-guarded PUT & DELETE)
│   ├── services/
│   │   └── __init__.py   # Reserved for future business logic
│   └── requirements.txt
│
└── frontend/
    └── index.html        # Single-page UI (login, dashboard, feedback, search)
```

---

## Setup & Run

### Prerequisites

- Python 3.8 or higher

### 1. Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the server

```bash
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend serves **both the API and the frontend UI** on the same port.

| URL                          | Description              |
|------------------------------|--------------------------|
| `http://127.0.0.1:8000`      | Frontend UI              |
| `http://127.0.0.1:8000/docs` | Swagger API docs         |

> No separate frontend server or npm install needed.

---

## Login & Roles

The application has two roles. Select your role from the dropdown on the login screen.

| Role          | Login                                      | Permissions                        |
|---------------|--------------------------------------------|------------------------------------|
| User          | Any name, no password required             | View & submit feedback             |
| Administrator | Any name + password: `admin123`            | View, submit, edit & delete feedback |

---

## Features

| Page             | Description                                                        |
|------------------|--------------------------------------------------------------------|
| Dashboard        | Stats overview (total entries, average rating, 5-star count, programs) + recent feedback list |
| All Feedback     | Full table of entries with View / Edit / Delete actions (Edit & Delete visible to Administrators only) |
| Submit Feedback  | Form to submit new feedback with interactive star rating picker    |
| Search & Filter  | Filter by keyword, program/event (dropdown), and rating; Clear filter button to reset |

---

## API Endpoints

| Method | Endpoint            | Auth Required  | Description              |
|--------|---------------------|----------------|--------------------------|
| GET    | /feedback/          | None           | Get all feedback         |
| GET    | /feedback/{id}      | None           | Get feedback by ID       |
| POST   | /feedback/          | None           | Submit new feedback      |
| PUT    | /feedback/{id}      | Admin (`X-Role: admin` header) | Update feedback |
| DELETE | /feedback/{id}      | Admin (`X-Role: admin` header) | Delete feedback |
| GET    | /search             | None           | Search & filter feedback |

### Search Query Parameters (`/search`)

| Param        | Type    | Description                        |
|--------------|---------|------------------------------------|
| keyword      | string  | Search in name, program, comments  |
| rating       | integer | Filter by exact rating (1–5)       |
| program_name | string  | Filter by program/event name       |

---

## Database Schema

**Table: feedback**

| Column           | Type     | Notes              |
|------------------|----------|--------------------|
| feedback_id      | Integer  | Primary key        |
| participant_name | String   | Required           |
| program_name     | String   | Required           |
| rating           | Integer  | 1–5                |
| comments         | Text     | Optional           |
| submitted_at     | DateTime | Auto on creation   |

---

## Rating Scale

| Rating | Label     |
|--------|-----------|
| 1      | Poor      |
| 2      | Fair      |
| 3      | Good      |
| 4      | Very Good |
| 5      | Excellent |
