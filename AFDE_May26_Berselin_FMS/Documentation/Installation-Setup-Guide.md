# Installation & Setup Guide

## Prerequisites

Make sure the following are installed on your machine before proceeding:

| Tool        | Version     | Download |
|-------------|-------------|----------|
| Python      | 3.10+       | https://www.python.org/downloads/ |
| Node.js     | 18+         | https://nodejs.org/ |
| npm         | 9+          | Bundled with Node.js |

> **Python 3.14 users:** SQLAlchemy 2.0.30 (the version pinned in `requirements.txt`) may be incompatible with Python 3.14. If you encounter a `TypeError: Can't replace canonical symbol '__firstlineno__'` error on startup, upgrade SQLAlchemy manually: `pip install "sqlalchemy>=2.0.36"`. For Python 3.10–3.13, no extra steps are needed.

---

## 1. Clone / Download the Project

Download and extract the project, or clone it:

```bash
git clone <repository-url>
cd Feedback-Management
```

---

## 2. Backend Setup

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

### 2c. Install Python dependencies

```bash
pip install -r requirements.txt
```

Dependencies installed:

| Package              | Version  | Purpose                          |
|----------------------|----------|----------------------------------|
| fastapi              | 0.111.0  | Web framework                    |
| uvicorn[standard]    | 0.29.0   | ASGI server                      |
| sqlalchemy           | 2.0.30   | ORM for SQLite                   |
| pydantic             | 1.10.17  | Request/response validation      |

> **Note:** The project uses Pydantic v1 (`1.10.17`). Do not upgrade to Pydantic v2 — `orm_mode` and `@validator` used in `schemas.py` are v1 APIs and will break under v2.

### 2d. Start the backend server

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at: `http://127.0.0.1:8000`  
Interactive API docs (Swagger UI): `http://127.0.0.1:8000/docs`

> The SQLite database file (`feedback.db`) is auto-created on the first run.

---

## 3. Frontend Setup

### 3a. Open a new terminal and navigate to the frontend folder

```bash
cd frontend
```

### 3b. Install Node dependencies

```bash
npm install
```

### 3c. Run in development mode

```bash
npm run dev
```

The React dev server will start at: `http://localhost:3000`

> In development mode the React app talks to the FastAPI backend at port 8000 via Axios. Make sure the backend is running first.

---

## 4. Production Build (Single Server)

Build the React app so FastAPI can serve it directly:

```bash
cd frontend
npm run build
```

This generates `frontend/dist/`. The FastAPI backend automatically serves these files.  
Start only the backend:

```bash
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:8000` — the full app runs on a single port.

---

## 5. Logging In

The system has two roles:

| Role          | Login                                      |
|---------------|--------------------------------------------|
| User          | Select "User" — enter any name             |
| Administrator | Select "Administrator" — password: `admin123` |

- **User** can view, submit, and search feedback.
- **Administrator** can also edit and delete feedback entries.

---

## 6. Stopping the Server

### Windows (PowerShell)

```powershell
# Find and kill the process on port 8000
$proc = Get-NetTCPConnection -LocalPort 8000 | Select-Object -ExpandProperty OwningProcess
Stop-Process -Id $proc -Force
```

### macOS / Linux

```bash
lsof -ti:8000 | xargs kill -9
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` on startup | Run `pip install -r requirements.txt` inside the `backend/` folder |
| `Directory 'dist/assets' does not exist` | Run `npm run build` inside the `frontend/` folder first |
| Port 8000 already in use | Stop the existing process or change the `--port` value |
| `ValidationError` or `AttributeError` referencing `from_attributes` | Pydantic v2 is installed. The project requires v1. Run: `pip install "pydantic==1.10.17"` then restart |
| `TypeError: Can't replace canonical symbol '__firstlineno__'` | SQLAlchemy version is too old for Python 3.14. Run: `pip install "sqlalchemy>=2.0.36"` |
| `pip install` fails with SSL certificate error | You may be behind a corporate proxy. Try: `pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org` |
