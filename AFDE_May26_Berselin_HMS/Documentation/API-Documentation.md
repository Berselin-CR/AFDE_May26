# API Documentation

**Base URL:** `http://127.0.0.1:8000`  
**Interactive Docs:** `http://127.0.0.1:8000/docs` (Swagger UI)  
**Content-Type:** `application/json`

---

## Authentication

The API uses a lightweight header-based role system. Include the following header on admin-only requests:

```
X-Role: support_admin
```

No tokens or sessions are required. Omitting or sending a non-admin value on protected routes returns `HTTP 403`.

---

## Data Model

### Ticket Object

| Field              | Type     | Description                                                        |
|--------------------|----------|--------------------------------------------------------------------|
| `ticket_id`        | integer  | Auto-generated primary key                                         |
| `employee_name`    | string   | Name of the employee raising the ticket (1–100 chars)              |
| `department`       | string   | Department of the employee (1–100 chars)                           |
| `issue_category`   | string   | Category of the issue (see valid values below)                     |
| `description`      | string   | Detailed description of the issue (min 5 chars)                    |
| `priority`         | string   | Ticket priority: `Low`, `Medium`, `High`, `Critical`               |
| `status`           | string   | Current status: `Open`, `In Progress`, `Resolved`, `Rejected`      |
| `resolution_notes` | string   | Notes added by Support Admin on resolution (optional)              |
| `created_at`       | datetime | Auto-set timestamp on creation (ISO 8601)                          |

### Valid Enum Values

**issue_category:**
- `VPN Issue`
- `Password Reset`
- `Software Installation`
- `Laptop Issue`
- `Email Access`
- `Network Connectivity`
- `Hardware Request`
- `Other`

**priority:** `Low` · `Medium` · `High` · `Critical` (default: `Medium`)

**status:** `Open` · `In Progress` · `Resolved` · `Rejected`

---

## Endpoints

---

### 1. Get All Tickets

Retrieve all tickets.

```
GET /api/tickets/
```

**Auth required:** No

**Response `200 OK`**
```json
[
  {
    "ticket_id": 1,
    "employee_name": "John Doe",
    "department": "IT",
    "issue_category": "VPN Issue",
    "description": "Unable to connect to VPN since this morning",
    "priority": "High",
    "status": "Open",
    "resolution_notes": null,
    "created_at": "2026-05-15T09:00:00"
  }
]
```

---

### 2. Get Ticket by ID

Retrieve a single ticket by its ID.

```
GET /api/tickets/{ticket_id}
```

**Auth required:** No

**Path parameter:**

| Parameter   | Type    | Description      |
|-------------|---------|------------------|
| `ticket_id` | integer | ID of the ticket |

**Response `200 OK`**
```json
{
  "ticket_id": 1,
  "employee_name": "John Doe",
  "department": "IT",
  "issue_category": "VPN Issue",
  "description": "Unable to connect to VPN since this morning",
  "priority": "High",
  "status": "Open",
  "resolution_notes": null,
  "created_at": "2026-05-15T09:00:00"
}
```

**Response `404 Not Found`**
```json
{ "detail": "Ticket not found" }
```

---

### 3. Create Ticket

Submit a new support ticket.

```
POST /api/tickets/
```

**Auth required:** No

**Request Body**
```json
{
  "employee_name": "John Doe",
  "department": "IT",
  "issue_category": "VPN Issue",
  "description": "Unable to connect to VPN since this morning",
  "priority": "High"
}
```

**Field rules:**

| Field            | Required | Constraints                          |
|------------------|----------|--------------------------------------|
| `employee_name`  | Yes      | 1–100 characters                     |
| `department`     | Yes      | 1–100 characters                     |
| `issue_category` | Yes      | Must be one of the valid enum values |
| `description`    | Yes      | Minimum 5 characters                 |
| `priority`       | No       | Low / Medium / High / Critical (default: Medium) |

**Response `201 Created`**
```json
{
  "ticket_id": 1,
  "employee_name": "John Doe",
  "department": "IT",
  "issue_category": "VPN Issue",
  "description": "Unable to connect to VPN since this morning",
  "priority": "High",
  "status": "Open",
  "resolution_notes": null,
  "created_at": "2026-05-15T09:00:00"
}
```

**Response `422 Unprocessable Entity`** — validation error
```json
{
  "detail": [
    {
      "loc": ["body", "issue_category"],
      "msg": "value is not a valid enumeration member",
      "type": "type_error.enum"
    }
  ]
}
```

---

### 4. Update Ticket

Update an existing ticket. All fields are optional — only send what needs to change.

```
PUT /api/tickets/{ticket_id}
```

**Auth required:** Yes — `X-Role: support_admin`

**Path parameter:**

| Parameter   | Type    | Description      |
|-------------|---------|------------------|
| `ticket_id` | integer | ID of the ticket |

**Request Body** (all fields optional)
```json
{
  "status": "In Progress",
  "resolution_notes": "Investigating the VPN configuration on the user's machine",
  "changed_by": "Admin User"
}
```

**Response `200 OK`**
```json
{
  "ticket_id": 1,
  "employee_name": "John Doe",
  "department": "IT",
  "issue_category": "VPN Issue",
  "description": "Unable to connect to VPN since this morning",
  "priority": "High",
  "status": "In Progress",
  "resolution_notes": "Investigating the VPN configuration on the user's machine",
  "created_at": "2026-05-15T09:00:00"
}
```

**Response `403 Forbidden`** — missing or wrong role header
```json
{ "detail": "Support Admin access required" }
```

**Response `404 Not Found`**
```json
{ "detail": "Ticket not found" }
```

---

### 5. Delete Ticket

Permanently delete a ticket.

```
DELETE /api/tickets/{ticket_id}
```

**Auth required:** Yes — `X-Role: support_admin`

**Path parameter:**

| Parameter   | Type    | Description      |
|-------------|---------|------------------|
| `ticket_id` | integer | ID of the ticket |

**Response `200 OK`**
```json
{ "message": "Ticket 1 deleted successfully" }
```

**Response `403 Forbidden`**
```json
{ "detail": "Support Admin access required" }
```

**Response `404 Not Found`**
```json
{ "detail": "Ticket not found" }
```

---

### 6. Get Ticket Activities

Retrieve the status change history for a specific ticket.

```
GET /api/tickets/{ticket_id}/activities
```

**Auth required:** No

**Path parameter:**

| Parameter   | Type    | Description      |
|-------------|---------|------------------|
| `ticket_id` | integer | ID of the ticket |

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "changed_by": "Admin User",
    "from_status": "Open",
    "to_status": "In Progress",
    "changed_at": "2026-05-15T10:30:00"
  }
]
```

Returns an empty array `[]` if no status changes have occurred yet.

---

### 7. Search / Filter Tickets

Search tickets by keyword, category, or status. All query parameters are optional.

```
GET /api/search
```

**Auth required:** No

**Query Parameters:**

| Parameter  | Type   | Description                                              |
|------------|--------|----------------------------------------------------------|
| `keyword`  | string | Searches employee name, department, and description      |
| `category` | string | Exact category match (must be a valid enum value)        |
| `status`   | string | Exact status match: Open / In Progress / Resolved / Rejected |

**Example requests:**

```
GET /api/search?keyword=VPN
GET /api/search?status=Open
GET /api/search?category=Password Reset
GET /api/search?keyword=John&status=In Progress
GET /api/search?category=VPN Issue&status=Open
```

**Response `200 OK`**
```json
[
  {
    "ticket_id": 1,
    "employee_name": "John Doe",
    "department": "IT",
    "issue_category": "VPN Issue",
    "description": "Unable to connect to VPN since this morning",
    "priority": "High",
    "status": "Open",
    "resolution_notes": null,
    "created_at": "2026-05-15T09:00:00"
  }
]
```

Returns an empty array `[]` if no tickets match.

---

## Error Reference

| Status Code | Meaning                                      |
|-------------|----------------------------------------------|
| 200         | Success                                      |
| 201         | Resource created                             |
| 403         | Forbidden — support_admin role required      |
| 404         | Resource not found                           |
| 422         | Validation error — check request body fields |
