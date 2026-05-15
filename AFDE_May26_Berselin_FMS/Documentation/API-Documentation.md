# API Documentation

**Base URL:** `http://127.0.0.1:8000`  
**Interactive Docs:** `http://127.0.0.1:8000/docs` (Swagger UI)  
**Content-Type:** `application/json`

---

## Authentication

The API uses a lightweight header-based role system. Include the following header on admin-only requests:

```
X-Role: admin
```

No tokens or sessions are required. Omitting or sending a non-admin value on protected routes returns `HTTP 403`.

---

## Data Model

### Feedback Object

| Field              | Type     | Description                        |
|--------------------|----------|------------------------------------|
| `feedback_id`      | integer  | Auto-generated primary key         |
| `participant_name` | string   | Name of the participant (1–255 chars) |
| `program_name`     | string   | Name of the program/event (1–255 chars) |
| `rating`           | integer  | Rating from 1 (Poor) to 5 (Excellent) |
| `comments`         | string   | Optional free-text comments        |
| `submitted_at`     | datetime | Auto-set timestamp (ISO 8601)      |

---

## Endpoints

---

### 1. Get All Feedback

Retrieve all feedback entries.

```
GET /api/feedback/
```

**Auth required:** No

**Response `200 OK`**
```json
[
  {
    "feedback_id": 1,
    "participant_name": "Jack",
    "program_name": "Leadership",
    "rating": 3,
    "comments": "Nice session, but can be made more interesting.",
    "submitted_at": "2026-05-14T17:56:00"
  }
]
```

---

### 2. Get Single Feedback

Retrieve one feedback entry by ID.

```
GET /api/feedback/{feedback_id}
```

**Auth required:** No

**Path parameter:**

| Parameter     | Type    | Description       |
|---------------|---------|-------------------|
| `feedback_id` | integer | ID of the entry   |

**Response `200 OK`**
```json
{
  "feedback_id": 1,
  "participant_name": "Jack",
  "program_name": "Leadership",
  "rating": 3,
  "comments": "Nice session, but can be made more interesting.",
  "submitted_at": "2026-05-14T17:56:00"
}
```

**Response `404 Not Found`**
```json
{ "detail": "Feedback not found" }
```

---

### 3. Create Feedback

Submit a new feedback entry.

```
POST /api/feedback/
```

**Auth required:** No

**Request Body**
```json
{
  "participant_name": "Helen",
  "program_name": "Leadership",
  "rating": 5,
  "comments": "Overall a very good and exciting topic."
}
```

**Field rules:**

| Field              | Required | Constraints              |
|--------------------|----------|--------------------------|
| `participant_name` | Yes      | 1–255 characters         |
| `program_name`     | Yes      | 1–255 characters         |
| `rating`           | Yes      | Integer between 1 and 5  |
| `comments`         | No       | Any string               |

**Response `201 Created`**
```json
{
  "feedback_id": 2,
  "participant_name": "Helen",
  "program_name": "Leadership",
  "rating": 5,
  "comments": "Overall a very good and exciting topic.",
  "submitted_at": "2026-05-14T18:00:00"
}
```

**Response `422 Unprocessable Entity`** — validation error
```json
{
  "detail": [
    {
      "loc": ["body", "rating"],
      "msg": "ensure this value is less than or equal to 5",
      "type": "value_error.number.not_le"
    }
  ]
}
```

---

### 4. Update Feedback

Update an existing feedback entry. All fields are optional — only send what needs to change.

```
PUT /api/feedback/{feedback_id}
```

**Auth required:** Yes — `X-Role: admin`

**Path parameter:**

| Parameter     | Type    | Description       |
|---------------|---------|-------------------|
| `feedback_id` | integer | ID of the entry   |

**Request Body** (all fields optional)
```json
{
  "participant_name": "Jack",
  "program_name": "Leadership",
  "rating": 4,
  "comments": "Updated comment after reflection."
}
```

**Response `200 OK`**
```json
{
  "feedback_id": 1,
  "participant_name": "Jack",
  "program_name": "Leadership",
  "rating": 4,
  "comments": "Updated comment after reflection.",
  "submitted_at": "2026-05-14T17:56:00"
}
```

**Response `403 Forbidden`** — missing or wrong role header
```json
{ "detail": "Administrator access required" }
```

**Response `404 Not Found`**
```json
{ "detail": "Feedback not found" }
```

---

### 5. Delete Feedback

Permanently delete a feedback entry.

```
DELETE /api/feedback/{feedback_id}
```

**Auth required:** Yes — `X-Role: admin`

**Path parameter:**

| Parameter     | Type    | Description       |
|---------------|---------|-------------------|
| `feedback_id` | integer | ID of the entry   |

**Response `204 No Content`** — deletion successful (empty body)

**Response `403 Forbidden`**
```json
{ "detail": "Administrator access required" }
```

**Response `404 Not Found`**
```json
{ "detail": "Feedback not found" }
```

---

### 6. Search / Filter Feedback

Search feedback by keyword, rating, or program name. All query parameters are optional.

```
GET /api/search
```

**Auth required:** No

**Query Parameters:**

| Parameter      | Type    | Description                                           |
|----------------|---------|-------------------------------------------------------|
| `keyword`      | string  | Searches participant name, program name, and comments |
| `rating`       | integer | Exact rating match (1–5)                              |
| `program_name` | string  | Exact program name match                              |

**Example requests:**

```
GET /api/search?keyword=leadership
GET /api/search?rating=5
GET /api/search?program_name=Leadership&rating=4
GET /api/search?keyword=good&rating=5
```

**Response `200 OK`**
```json
[
  {
    "feedback_id": 2,
    "participant_name": "Helen",
    "program_name": "Leadership",
    "rating": 5,
    "comments": "Overall a very good and exciting topic.",
    "submitted_at": "2026-05-14T18:00:00"
  }
]
```

Returns an empty array `[]` if no entries match.

---

## Rating Scale

| Rating | Label     |
|--------|-----------|
| 1      | Poor      |
| 2      | Fair      |
| 3      | Good      |
| 4      | Very Good |
| 5      | Excellent |

---

## Error Reference

| Status Code | Meaning                                      |
|-------------|----------------------------------------------|
| 200         | Success                                      |
| 201         | Resource created                             |
| 204         | Success, no content (DELETE)                 |
| 403         | Forbidden — admin role required              |
| 404         | Resource not found                           |
| 422         | Validation error — check request body fields |
