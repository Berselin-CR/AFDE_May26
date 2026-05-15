# Helpdesk Ticket Management System — Phase 1

A full-stack web application for managing internal IT support tickets.

## Tech Stack

| Layer     | Technology       |
|-----------|-----------------|
| Frontend  | React           |
| Backend   | FastAPI (Python)|
| Database  | SQLite          |
| API Tests | Postman         |

---

## Project Structure

```
helpdesk/
├── backend/
│   ├── main.py          # FastAPI app, CORS, /search endpoint
│   ├── database.py      # SQLAlchemy engine & session
│   ├── models.py        # ORM model (Ticket table)
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── crud.py          # All DB operations
│   ├── routers/
│   │   └── tickets.py   # /tickets CRUD routes
│   ├── services/        # Business logic (future use)
│   └── requirements.txt
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   ├── TicketCard.js
        │   └── SearchBar.js
        ├── pages/
        │   ├── Dashboard.js
        │   ├── TicketList.js
        │   ├── CreateTicket.js
        │   └── TicketDetail.js
        ├── services/
        │   └── ticketService.js
        ├── App.js
        └── api.js
```

---

## Setup Instructions

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at: http://localhost:8000  
Swagger docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npx create-react-app .          # only first time
npm install axios react-router-dom
# Copy all files from frontend/src/ into the generated src/
npm start
```

App runs at: http://localhost:3000

---

## API Endpoints

| Method | Endpoint          | Description           |
|--------|------------------|-----------------------|
| GET    | /tickets/        | Get all tickets       |
| GET    | /tickets/{id}    | Get ticket by ID      |
| POST   | /tickets/        | Create ticket         |
| PUT    | /tickets/{id}    | Update ticket         |
| DELETE | /tickets/{id}    | Delete ticket         |
| GET    | /search          | Search & filter       |

### Search query params
- `keyword` — searches employee name, department, description
- `category` — exact category match
- `status` — exact status match

---

## Ticket Fields

| Field            | Type     | Values                              |
|------------------|----------|-------------------------------------|
| employee_name    | String   | —                                   |
| department       | String   | —                                   |
| issue_category   | String   | VPN Issue, Password Reset, etc.     |
| description      | Text     | —                                   |
| priority         | String   | Low, Medium, High, Critical         |
| status           | String   | Open, In Progress, Resolved, Closed |
| resolution_notes | Text     | Added by admin                      |
| created_at       | DateTime | Auto-set on creation                |
