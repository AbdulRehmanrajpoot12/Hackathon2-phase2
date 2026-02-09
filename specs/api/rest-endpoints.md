# REST API Endpoints Specification

## Overview
Complete REST API specification for the Full-Stack Web Todo Application. All endpoints require authentication via JWT token unless explicitly marked as public.

## Authentication Requirement
**ALL task-related endpoints require authentication.** Every request must include a valid JWT token in the Authorization header.

### Required Header
```
Authorization: Bearer <jwt_token>
```

### Authentication Flow
1. User authenticates via Better Auth endpoints
2. JWT token is issued and stored in httpOnly cookie
3. Frontend automatically includes token in all API requests
4. Backend validates token and extracts user ID
5. All operations are scoped to the authenticated user

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://api.yourdomain.com`

## API Versioning
- **Current Version**: v1
- **Base Path**: `/api/v1`
- **Future Versions**: `/api/v2`, etc.

---

## Authentication Endpoints

### POST /api/auth/signup
**Description**: Register a new user account

**Authentication**: Public (no token required)

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Request Schema**:
```json
{
  "type": "object",
  "required": ["email", "password"],
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "maxLength": 255
    },
    "password": {
      "type": "string",
      "minLength": 8,
      "maxLength": 128
    },
    "name": {
      "type": "string",
      "maxLength": 255
    }
  }
}
```

**Response (201 Created)**:
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2026-02-07T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- **400 Bad Request**: Invalid email format or password too weak
  ```json
  {
    "detail": "Invalid email format",
    "error_code": "VALIDATION_ERROR"
  }
  ```
- **409 Conflict**: Email already exists
  ```json
  {
    "detail": "An account with this email already exists",
    "error_code": "AUTH_EMAIL_EXISTS"
  }
  ```

---

### POST /api/auth/signin
**Description**: Authenticate existing user and issue JWT token

**Authentication**: Public (no token required)

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Request Schema**:
```json
{
  "type": "object",
  "required": ["email", "password"],
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    },
    "password": {
      "type": "string"
    }
  }
}
```

**Response (200 OK)**:
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid credentials
  ```json
  {
    "detail": "Invalid email or password",
    "error_code": "AUTH_INVALID_CREDENTIALS"
  }
  ```

---

### POST /api/auth/signout
**Description**: Invalidate user session and clear authentication

**Authentication**: Required

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Body**: None

**Response (200 OK)**:
```json
{
  "message": "Successfully logged out"
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid or missing token

---

### GET /api/auth/me
**Description**: Get current authenticated user information

**Authentication**: Required

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2026-01-15T10:30:00Z"
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid or missing token

---

## Task Management Endpoints

### GET /api/tasks
**Description**: Retrieve all tasks for the authenticated user with optional filtering and sorting

**Authentication**: Required

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | string | No | `all` | Filter by completion status: `all`, `completed`, `incomplete` |
| `sort` | string | No | `created_at:desc` | Sort order: `created_at:asc`, `created_at:desc`, `title:asc`, `title:desc` |
| `limit` | integer | No | `100` | Maximum number of tasks to return (1-1000) |
| `offset` | integer | No | `0` | Number of tasks to skip for pagination |

**Example Request**:
```bash
GET /api/tasks?status=incomplete&sort=created_at:desc&limit=50
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**:
```json
{
  "tasks": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Complete project documentation",
      "description": "Write comprehensive docs for the API",
      "completed": false,
      "created_at": "2026-02-07T10:30:00Z",
      "updated_at": "2026-02-07T10:30:00Z"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Review pull requests",
      "description": null,
      "completed": false,
      "created_at": "2026-02-06T15:20:00Z",
      "updated_at": "2026-02-06T15:20:00Z"
    }
  ],
  "total": 2,
  "limit": 50,
  "offset": 0
}
```

**Response Schema**:
```json
{
  "type": "object",
  "properties": {
    "tasks": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/Task"
      }
    },
    "total": {
      "type": "integer",
      "description": "Total number of tasks matching the filter"
    },
    "limit": {
      "type": "integer"
    },
    "offset": {
      "type": "integer"
    }
  }
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid or missing token
- **400 Bad Request**: Invalid query parameters
  ```json
  {
    "detail": "Invalid sort parameter. Use format: field:direction",
    "error_code": "VALIDATION_ERROR"
  }
  ```

---

### GET /api/tasks/{task_id}
**Description**: Retrieve a specific task by ID (must belong to authenticated user)

**Authentication**: Required

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task_id` | UUID | Yes | Unique identifier of the task |

**Example Request**:
```bash
GET /api/tasks/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the API",
  "completed": false,
  "created_at": "2026-02-07T10:30:00Z",
  "updated_at": "2026-02-07T10:30:00Z"
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Task does not exist or does not belong to user
  ```json
  {
    "detail": "Task not found",
    "error_code": "TASK_NOT_FOUND"
  }
  ```

---

### POST /api/tasks
**Description**: Create a new task for the authenticated user

**Authentication**: Required

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the API",
  "completed": false
}
```

**Request Schema**:
```json
{
  "type": "object",
  "required": ["title"],
  "properties": {
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 255,
      "description": "Task title (required)"
    },
    "description": {
      "type": "string",
      "maxLength": 1000,
      "nullable": true,
      "description": "Task description (optional)"
    },
    "completed": {
      "type": "boolean",
      "default": false,
      "description": "Completion status (defaults to false)"
    }
  }
}
```

**Response (201 Created)**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the API",
  "completed": false,
  "created_at": "2026-02-07T10:30:00Z",
  "updated_at": "2026-02-07T10:30:00Z"
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid or missing token
- **400 Bad Request**: Validation error
  ```json
  {
    "detail": "Title is required and must be between 1 and 255 characters",
    "error_code": "VALIDATION_ERROR",
    "field": "title"
  }
  ```
- **422 Unprocessable Entity**: Invalid data format
  ```json
  {
    "detail": [
      {
        "loc": ["body", "title"],
        "msg": "field required",
        "type": "value_error.missing"
      }
    ]
  }
  ```

---

### PUT /api/tasks/{task_id}
**Description**: Update an existing task (must belong to authenticated user)

**Authentication**: Required

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task_id` | UUID | Yes | Unique identifier of the task |

**Request Body**:
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true
}
```

**Request Schema**:
```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 255
    },
    "description": {
      "type": "string",
      "maxLength": 1000,
      "nullable": true
    },
    "completed": {
      "type": "boolean"
    }
  }
}
```

**Response (200 OK)**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true,
  "created_at": "2026-02-07T10:30:00Z",
  "updated_at": "2026-02-07T11:45:00Z"
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Task does not exist or does not belong to user
- **400 Bad Request**: Validation error

---

### PATCH /api/tasks/{task_id}
**Description**: Partially update a task (e.g., toggle completion status)

**Authentication**: Required

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task_id` | UUID | Yes | Unique identifier of the task |

**Request Body** (any subset of fields):
```json
{
  "completed": true
}
```

**Response (200 OK)**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the API",
  "completed": true,
  "created_at": "2026-02-07T10:30:00Z",
  "updated_at": "2026-02-07T11:50:00Z"
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Task does not exist or does not belong to user

---

### DELETE /api/tasks/{task_id}
**Description**: Permanently delete a task (must belong to authenticated user)

**Authentication**: Required

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task_id` | UUID | Yes | Unique identifier of the task |

**Example Request**:
```bash
DELETE /api/tasks/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (204 No Content)**:
No response body

**Error Responses**:
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Task does not exist or does not belong to user
  ```json
  {
    "detail": "Task not found",
    "error_code": "TASK_NOT_FOUND"
  }
  ```

---

## Common Response Schemas

### Task Schema
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique task identifier"
    },
    "user_id": {
      "type": "string",
      "format": "uuid",
      "description": "Owner user ID"
    },
    "title": {
      "type": "string",
      "maxLength": 255,
      "description": "Task title"
    },
    "description": {
      "type": "string",
      "maxLength": 1000,
      "nullable": true,
      "description": "Task description"
    },
    "completed": {
      "type": "boolean",
      "description": "Completion status"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "Creation timestamp (ISO 8601)"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "description": "Last update timestamp (ISO 8601)"
    }
  }
}
```

### Error Response Schema
```json
{
  "type": "object",
  "properties": {
    "detail": {
      "type": "string",
      "description": "Human-readable error message"
    },
    "error_code": {
      "type": "string",
      "description": "Machine-readable error code"
    },
    "field": {
      "type": "string",
      "description": "Field name for validation errors (optional)"
    }
  }
}
```

---

## HTTP Status Codes

| Status Code | Meaning | Usage |
|-------------|---------|-------|
| 200 OK | Success | Successful GET, PUT, PATCH requests |
| 201 Created | Resource created | Successful POST requests |
| 204 No Content | Success with no body | Successful DELETE requests |
| 400 Bad Request | Invalid input | Validation errors, malformed requests |
| 401 Unauthorized | Authentication failed | Missing, invalid, or expired token |
| 403 Forbidden | Permission denied | Valid token but insufficient permissions |
| 404 Not Found | Resource not found | Task doesn't exist or doesn't belong to user |
| 409 Conflict | Resource conflict | Duplicate email on signup |
| 422 Unprocessable Entity | Validation error | Pydantic validation failures |
| 500 Internal Server Error | Server error | Unexpected server-side errors |

---

## Rate Limiting

### Limits
- **Authentication endpoints**: 10 requests per minute per IP
- **Task endpoints**: 100 requests per minute per user
- **Global limit**: 1000 requests per hour per user

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1675774800
```

### Rate Limit Exceeded Response (429 Too Many Requests)
```json
{
  "detail": "Rate limit exceeded. Please try again later.",
  "error_code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 60
}
```

---

## CORS Configuration

### Allowed Origins
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

### Allowed Methods
- GET, POST, PUT, PATCH, DELETE, OPTIONS

### Allowed Headers
- Authorization, Content-Type, Accept

### Exposed Headers
- X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

---

## Example API Calls

### Complete Task Creation Flow
```bash
# 1. Sign up
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'

# Response: { "user": {...}, "token": "eyJ..." }

# 2. Create a task
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My first task",
    "description": "This is a test task"
  }'

# 3. Get all tasks
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer eyJ..."

# 4. Update task
curl -X PATCH http://localhost:8000/api/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 5. Delete task
curl -X DELETE http://localhost:8000/api/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer eyJ..."
```

---

## Security Considerations

### Authentication
- All task endpoints require valid JWT token
- Tokens expire after 7 days (configurable)
- User ID extracted from token, never from request parameters
- Token signature verified on every request

### Authorization
- Users can only access their own tasks
- Task ownership verified on all modification operations
- Return 404 (not 403) for unauthorized access to prevent user enumeration

### Input Validation
- All inputs validated using Pydantic models
- SQL injection prevention via SQLModel ORM
- XSS prevention via proper output encoding
- CSRF protection for cookie-based authentication

### Data Privacy
- Passwords never returned in API responses
- User data isolated per authenticated user
- No cross-user data leakage

---

## Related Specifications
- @specs/features/authentication.md - Authentication flow details
- @specs/features/task-crud.md - Task management requirements
- @specs/database/schema.md - Database schema and relationships
- @specs/ui/pages.md - Frontend pages consuming these endpoints
