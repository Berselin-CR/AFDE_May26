# Helpdesk Ticket Management System — Phase 1

A full-stack web application for managing internal IT support tickets.  
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

The Helpdesk Ticket Management System allows employees to raise IT support tickets and track their resolution. Support admins can update ticket status, add resolution notes, and delete tickets through a clean web interface.

## Features

- Submit IT support tickets with employee name, department, category, description, and priority
- Dashboard with summary statistics by status, priority, and category
- Browse all tickets in a searchable list
- Search and filter by keyword, category, or status
- Support Admin role: update status, add resolution notes, delete tickets
- Ticket activity log tracking all status changes
- Role-based access control (frontend + backend enforced)

## Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Backend    | Python 3.10+, FastAPI 0.111, SQLAlchemy 2.0.49          |
| Validation | Pydantic 2.13                                           |
| Database   | SQLite                                                  |
| Frontend   | React 18, Vite 5, Axios                                 |
| Styling    | Inline styles (JS style objects)                        |

## Project Structure

```
helpdesk/
├── backend/
│   ├── main.py              # App entry point, CORS, /api/search, static file serving
│   ├── routers/
│   │   └── tickets.py       # All /api/tickets/* endpoints
│   ├── crud.py              # Database query functions
│   ├── models.py            # SQLAlchemy Ticket model
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── database.py          # SQLite engine and session dependency
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api.js           # Axios instance with X-Role header interceptor
│   │   ├── App.js           # Routes and PrivateRoute wrapper
│   │   ├── components/      # Navbar, TicketCard, SearchBar
│   │   ├── pages/           # Dashboard, TicketList, CreateTicket, TicketDetail
│   │   └── services/        # ticketService.js
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
