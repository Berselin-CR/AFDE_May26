# Learn Next Feedback Management System

A centralized platform to collect, store, search, and manage training program feedback.  
Built with **FastAPI** (Python) on the backend and **React + Vite** on the frontend.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)

---

## Overview

The Learn Next Feedback Management System allows participants to submit feedback on training programs and events. Administrators can view, edit, search, and delete feedback entries through a clean web interface.

## Features

- Submit feedback with name, program, rating (1–5 stars), and comments
- Dashboard with summary statistics and recent entries
- Browse all feedback in a sortable, scrollable table
- Search and filter by keyword, program name, or rating
- Admin role: edit and delete feedback entries
- Role-based access control (frontend + backend enforced)
- Responsive UI with blue theme

## Tech Stack

| Layer     | Technology                                         |
|-----------|----------------------------------------------------|
| Backend   | Python 3.10+ (3.14 tested), FastAPI 0.111, SQLAlchemy 2.0.49 |
| Validation| Pydantic 2.13                                      |
| Database  | SQLite                                             |
| Frontend  | React 18, Vite, Axios                              |
| Styling   | Plain CSS with CSS variables                       |

## Project Structure

```
Feedback-Management/
├── backend/
│   ├── main.py              # App entry point, CORS, static file serving
│   ├── routers/
│   │   └── feedback.py      # All /api/feedback/* endpoints
│   ├── crud.py              # Database query functions
│   ├── models.py            # SQLAlchemy Feedback model
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── database.py          # SQLite engine and session dependency
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api.js           # Axios instance with X-Role header interceptor
│   │   ├── App.jsx          # Routes and PrivateRoute wrapper
│   │   ├── components/      # Navbar, Modal, Toast, RatingStars, etc.
│   │   ├── pages/           # Dashboard, FeedbackList, SubmitFeedback, SearchFilter
│   │   ├── pages/modals/    # DetailModal, FeedbackFormModal, DeleteModal
│   │   └── services/        # feedbackService.js, AuthContext.jsx
│   └── index.html
└── Documentation/
    ├── README.md
    ├── Installation-Setup-Guide.md
    ├── API-Documentation.md
    └── Screenshots/
        ├── UI-Screenshots/
        └── API-Testing-Screenshots/
```

## Getting Started

See [Installation-Setup-Guide.md](Installation-Setup-Guide.md) for full setup instructions.

## API Reference

See [API-Documentation.md](API-Documentation.md) for all endpoints, request/response formats, and examples.

## Screenshots

See the [Screenshots](Screenshots/) folder for UI and API testing screenshots.
