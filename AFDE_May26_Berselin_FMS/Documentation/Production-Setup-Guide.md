# Production Setup Guide

This guide covers running the Feedback Management System in production mode — a single server on a single port, with no separate frontend process.

---

## Prerequisites

| Tool    | Version | Download                          |
|---------|---------|-----------------------------------|
| Python  | 3.10+   | https://www.python.org/downloads/ |
| Node.js | 18+     | https://nodejs.org/               |
| npm     | 9+      | Bundled with Node.js              |

> Node.js and npm are only needed for the one-time frontend build step. They do not need to run in production.

> **Python 3.14 users:** If you encounter a `TypeError: Can't replace canonical symbol '__firstlineno__'` on startup, run `pip install "sqlalchemy>=2.0.36"` before proceeding.

---

## Overview

In production mode:

1. The React frontend is compiled into static files once using `npm run build`.
2. Only the FastAPI backend runs (`uvicorn` on port 8000).
3. FastAPI serves both the API and the compiled frontend — one process, one port.

---

## Step 1 — Clone / Download the Project

```bash
git clone <repository-url>
cd Feedback-Management
```

---

## Step 2 — Install Backend Dependencies

### 2a. Navigate to the backend folder

```bash
cd backend
```

### 2b. (Optional) Create a virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

### 2c. Install dependencies

```bash
pip install -r requirements.txt
```

| Package           | Version | Purpose                     |
|-------------------|---------|-----------------------------|
| fastapi           | 0.111.0 | Web framework               |
| uvicorn[standard] | 0.29.0  | ASGI server                 |
| sqlalchemy        | 2.0.30  | ORM for SQLite              |
| pydantic          | 1.10.17 | Request/response validation |

> The project uses Pydantic v1. Do not upgrade to v2 — it will break startup.

---

## Step 3 — Build the Frontend

### 3a. Open a new terminal and navigate to the frontend folder

```bash
cd frontend
```

### 3b. Install Node dependencies

```bash
npm install
```

### 3c. Build for production

```bash
npm run build
```

This compiles the React app into `frontend/dist/`. You only need to run this once (or again whenever frontend code changes).

Expected output:

```
✓ built in ~500ms
dist/index.html
dist/assets/index-*.css
dist/assets/index-*.js
```

---

## Step 4 — Start the Server

From the `backend/` folder:

```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

The full application is now available at: `http://127.0.0.1:8000`  
API docs (Swagger UI): `http://127.0.0.1:8000/docs`

> The SQLite database file (`feedback.db`) is auto-created on the first run inside `backend/`.

> Remove `--reload` in a real production environment — hot-reload is for development only.

---

## Step 5 — Logging In

| Role          | Login                                         |
|---------------|-----------------------------------------------|
| User          | Select "User" — enter any name                |
| Administrator | Select "Administrator" — password: `admin123` |

- **User** can view, submit, and search feedback.
- **Administrator** can also edit and delete feedback entries.

---

## Stopping the Server

### Windows (PowerShell)

```powershell
$proc = Get-NetTCPConnection -LocalPort 8000 | Select-Object -ExpandProperty OwningProcess
Stop-Process -Id $proc -Force
```

### macOS / Linux

```bash
lsof -ti:8000 | xargs kill -9
```

---

## Re-deploying Frontend Changes

If you modify any frontend source files, rebuild and restart:

```bash
# From the frontend/ folder
npm run build

# Then restart the backend
cd ../backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

No backend restart is needed for frontend-only changes if you rebuild before starting — the static files are read from disk on each request.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Directory 'dist/assets' does not exist` | Run `npm run build` inside the `frontend/` folder first |
| `ModuleNotFoundError` on startup | Run `pip install -r requirements.txt` inside the `backend/` folder |
| Port 8000 already in use | Stop the existing process (see Stopping the Server above) or change `--port` |
| `ValidationError` or `AttributeError` referencing `from_attributes` | Pydantic v2 is installed. Run: `pip install "pydantic==1.10.17"` then restart |
| `TypeError: Can't replace canonical symbol '__firstlineno__'` | SQLAlchemy too old for Python 3.14. Run: `pip install "sqlalchemy>=2.0.36"` |
| `pip install` fails with SSL certificate error | Behind a corporate proxy. Try: `pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org` |
