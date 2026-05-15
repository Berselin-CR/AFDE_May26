# Installation & Setup Guide

## Prerequisites

Make sure the following are installed on your machine before proceeding:

| Tool    | Version | Download                          |
|---------|---------|-----------------------------------|
| Python  | 3.10+   | https://www.python.org/downloads/ |
| Node.js | 18+     | https://nodejs.org/               |
| npm     | 9+      | Bundled with Node.js              |

> **Python 3.14 users:** If you encounter a `TypeError: Can't replace canonical symbol '__firstlineno__'` on startup, run `pip install "sqlalchemy>=2.0.36"` before proceeding.

---

## 1. Clone / Download the Project

Download and extract the project, or clone it:

```bash
git clone <repository-url>
cd helpdesk
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

| Package           | Version  | Purpose                     |
|-------------------|----------|-----------------------------|
| fastapi           | 0.111.0  | Web framework               |
| uvicorn           | 0.29.0   | ASGI server                 |
| sqlalchemy        | 2.0.49   | ORM for SQLite              |
| pydantic          | 2.13.3   | Request/response validation |
| python-dotenv     | 1.0.1    | Environment variable loader |

> **Note:** The project uses Pydantic v2 (`2.13.3`). Do not downgrade to Pydantic v1 — `schemas.py` uses `from_attributes = True` and other v2 APIs.

### 2d. Start the backend server

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at: `http://127.0.0.1:8000`  
Interactive API docs (Swagger UI): `http://127.0.0.1:8000/docs`

> The SQLite database file (`helpdesk.db`) is auto-created on the first run inside `backend/`.

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

| Role          | Login                                              |
|---------------|----------------------------------------------------|
| Employee      | Select "Employee" — enter any name                 |
| Support Admin | Select "Support Admin" — enter admin credentials   |

- **Employee** can view, submit, and search tickets.
- **Support Admin** can also update status, add resolution notes, and delete tickets.

---

## 6. Stopping the Server

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

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` on startup | Run `pip install -r requirements.txt` inside the `backend/` folder |
| `Directory 'dist/assets' does not exist` | Run `npm run build` inside the `frontend/` folder first |
| Port 8000 already in use | Stop the existing process or change the `--port` value |
| `TypeError: Can't replace canonical symbol '__firstlineno__'` | SQLAlchemy too old for Python 3.14. Run: `pip install "sqlalchemy>=2.0.36"` |
| `pip install` fails with SSL certificate error | Behind a corporate proxy. Try: `pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org` |
