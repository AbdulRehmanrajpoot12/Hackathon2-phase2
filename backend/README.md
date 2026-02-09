# Todo Backend API

FastAPI backend service for the Todo application with JWT authentication and PostgreSQL persistence.

## Features

- **FastAPI Framework**: High-performance async API
- **JWT Authentication**: Secure token-based authentication using Better Auth
- **PostgreSQL Database**: Neon Serverless PostgreSQL with SQLModel ORM
- **User Isolation**: All data scoped to authenticated users
- **CORS Support**: Configured for frontend at localhost:3000
- **RESTful API**: Complete CRUD operations for tasks

## Prerequisites

- Python 3.10+
- PostgreSQL database (Neon Serverless)
- Better Auth configured on frontend

## Setup

### 1. Install Dependencies

```bash
cd Phase-2/backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
BETTER_AUTH_SECRET=your_jwt_secret_here
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

**Important**: The `BETTER_AUTH_SECRET` must match the secret used in the frontend for JWT token generation.

### 3. Run Server

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

### Interactive Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

#### Health Check

- **GET** `/health` - Health check endpoint
- **GET** `/` - API information

#### Tasks

- **GET** `/api/{user_id}/tasks` - List all tasks for user
  - Query params: `status` (all/pending/completed), `sort` (created_at/title)
- **POST** `/api/{user_id}/tasks` - Create new task
- **GET** `/api/{user_id}/tasks/{task_id}` - Get specific task
- **PUT** `/api/{user_id}/tasks/{task_id}` - Update task
- **DELETE** `/api/{user_id}/tasks/{task_id}` - Delete task
- **PATCH** `/api/{user_id}/tasks/{task_id}/complete` - Toggle task completion

### Request/Response Examples

#### Create Task

```bash
curl -X POST http://localhost:8000/api/{user_id}/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }'
```

Response:
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-02-08T10:00:00Z",
  "updated_at": "2026-02-08T10:00:00Z"
}
```

#### List Tasks

```bash
curl http://localhost:8000/api/{user_id}/tasks?status=pending&sort=created_at \
  -H "Authorization: Bearer <token>"
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BETTER_AUTH_SECRET` | JWT signing secret (must match frontend) | Yes |
| `DATABASE_URL` | PostgreSQL connection string with SSL | Yes |

## Database Schema

### Tasks Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| user_id | VARCHAR | NOT NULL, INDEXED |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | NULL |
| completed | BOOLEAN | DEFAULT false, INDEXED |
| created_at | TIMESTAMP | NOT NULL, INDEXED |
| updated_at | TIMESTAMP | NOT NULL |

**Indexes**: `user_id`, `completed`, `created_at`

## Security

- **JWT Verification**: All endpoints verify JWT tokens
- **User Isolation**: Database queries filtered by authenticated user_id
- **Path Validation**: URL user_id must match token user_id
- **CORS**: Restricted to http://localhost:3000
- **No Secrets in Code**: All sensitive data in .env file

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful deletion) |
| 400 | Bad Request |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (user_id mismatch) |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Development

### Project Structure

```
backend/
├── main.py              # FastAPI app entry point
├── db.py                # Database engine and session
├── models.py            # SQLModel database models
├── dependencies/
│   ├── __init__.py
│   └── auth.py          # JWT authentication
├── routes/
│   ├── __init__.py
│   └── tasks.py         # Task CRUD endpoints
├── schemas/
│   ├── __init__.py
│   └── task.py          # Pydantic request/response models
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
└── .gitignore          # Git ignore patterns
```

### Running Tests

Integration tests require the frontend to be running for JWT token generation.

1. Start backend: `uvicorn main:app --reload --port 8000`
2. Start frontend: `cd ../frontend && npm run dev`
3. Test via frontend UI or API documentation at `/docs`

## Troubleshooting

### CORS Errors

**Issue**: Browser blocks API calls from frontend

**Solution**: Verify CORS middleware in `main.py` allows `http://localhost:3000`

### 401 Unauthorized Errors

**Issue**: All API calls return 401

**Solution**: Check that `BETTER_AUTH_SECRET` matches in both frontend and backend `.env` files

### Database Connection Errors

**Issue**: Cannot connect to Neon PostgreSQL

**Solution**:
- Verify `DATABASE_URL` is correct
- Ensure URL includes `sslmode=require` and `channel_binding=require`
- Check network connectivity to Neon

### User Sees Other Users' Tasks

**Issue**: Data isolation not working

**Solution**: Verify all database queries filter by `user_id` in `routes/tasks.py`

## Production Deployment

### Environment Variables

Set these in your production environment:
- `BETTER_AUTH_SECRET`: Strong random secret
- `DATABASE_URL`: Production database connection string

### Security Checklist

- [ ] Change `BETTER_AUTH_SECRET` to a strong random value
- [ ] Use HTTPS in production
- [ ] Update CORS origins to production frontend URL
- [ ] Enable database connection pooling
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Review and update security headers

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
