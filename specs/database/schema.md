# Database Schema Specification

## Overview
Complete database schema for the Full-Stack Web Todo Application using PostgreSQL (Neon) with SQLModel ORM. The schema supports multi-user task management with secure authentication.

## Database Technology
- **Database**: PostgreSQL 15+ (Neon serverless)
- **ORM**: SQLModel (combines SQLAlchemy + Pydantic)
- **Migrations**: Alembic (SQLModel compatible)
- **Connection Pooling**: Built-in Neon connection pooling

## Schema Design Principles
- UUID primary keys for security and scalability
- Timestamps for audit trails (created_at, updated_at)
- Foreign key constraints for referential integrity
- Indexes on frequently queried columns
- NOT NULL constraints for required fields
- Sensible default values where applicable

---

## Tables

### users
**Description**: User accounts managed by Better Auth. This table is created and managed by the Better Auth library.

**Table Definition**:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True, nullable=False)
    name: Optional[str] = Field(default=None, max_length=255)
    password_hash: str = Field(max_length=255, nullable=False)
    email_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
```

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique user identifier |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User email address (login credential) |
| `name` | VARCHAR(255) | NULL | User display name |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password (never plaintext) |
| `email_verified` | BOOLEAN | DEFAULT FALSE | Email verification status |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `PRIMARY KEY (id)` - Clustered index on primary key
- `UNIQUE INDEX idx_users_email ON users(email)` - Unique constraint + fast email lookup

**Constraints**:
- Email must be valid format (enforced at application layer)
- Password hash must be bcrypt format (enforced at application layer)
- Email is case-insensitive (normalized to lowercase before storage)

**Notes**:
- This table is managed by Better Auth library
- Do not manually modify password_hash field
- Use Better Auth APIs for user creation and authentication
- Additional Better Auth tables may exist (sessions, verification_tokens, etc.)

---

### tasks
**Description**: User tasks with title, description, and completion status. Each task belongs to exactly one user.

**Table Definition**:
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship (optional, for ORM convenience)
    # user: Optional["User"] = Relationship(back_populates="tasks")
```

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique task identifier |
| `user_id` | UUID | NOT NULL, FOREIGN KEY → users(id) | Owner of the task |
| `title` | VARCHAR(255) | NOT NULL | Task title (required) |
| `description` | TEXT | NULL | Task description (optional, max 1000 chars at app layer) |
| `completed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Task creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last modification timestamp |

**Indexes**:
- `PRIMARY KEY (id)` - Clustered index on primary key
- `INDEX idx_tasks_user_id ON tasks(user_id)` - Fast lookup of user's tasks
- `INDEX idx_tasks_completed ON tasks(completed)` - Fast filtering by status
- `INDEX idx_tasks_created_at ON tasks(created_at DESC)` - Fast sorting by creation date
- `COMPOSITE INDEX idx_tasks_user_completed ON tasks(user_id, completed)` - Optimized for filtered queries

**Foreign Keys**:
- `user_id` → `users(id)` with `ON DELETE CASCADE`
  - When a user is deleted, all their tasks are automatically deleted
  - Maintains referential integrity

**Constraints**:
- `title` cannot be empty string (enforced at application layer)
- `title` max length: 255 characters
- `description` max length: 1000 characters (enforced at application layer)
- `completed` must be boolean (true/false)

**Validation Rules** (Application Layer):
- Title: 1-255 characters, no leading/trailing whitespace
- Description: 0-1000 characters (optional)
- Completed: boolean only

---

## Relationships

### User → Tasks (One-to-Many)
- One user can have many tasks
- Each task belongs to exactly one user
- Cascade delete: deleting a user deletes all their tasks

**Relationship Diagram**:
```
users (1) ──────< (many) tasks
  id                      user_id
```

**SQLModel Relationship** (Optional):
```python
class User(SQLModel, table=True):
    # ... other fields ...
    tasks: list["Task"] = Relationship(back_populates="user")

class Task(SQLModel, table=True):
    # ... other fields ...
    user: Optional["User"] = Relationship(back_populates="tasks")
```

---

## Indexes Strategy

### Performance Optimization
1. **Primary Keys**: Automatic clustered index on `id` columns
2. **Foreign Keys**: Index on `tasks.user_id` for fast joins
3. **Filtering**: Index on `tasks.completed` for status filtering
4. **Sorting**: Index on `tasks.created_at` for chronological ordering
5. **Composite**: Index on `(user_id, completed)` for common query pattern

### Query Patterns Optimized
- Get all tasks for a user: `WHERE user_id = ?` (uses `idx_tasks_user_id`)
- Get incomplete tasks for a user: `WHERE user_id = ? AND completed = false` (uses `idx_tasks_user_completed`)
- Get tasks sorted by date: `ORDER BY created_at DESC` (uses `idx_tasks_created_at`)
- User lookup by email: `WHERE email = ?` (uses `idx_users_email`)

### Index Definitions
```sql
-- Automatically created by PRIMARY KEY
CREATE UNIQUE INDEX tasks_pkey ON tasks(id);
CREATE UNIQUE INDEX users_pkey ON users(id);

-- Explicitly created indexes
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
```

---

## Constraints Summary

### NOT NULL Constraints
- `users.id`, `users.email`, `users.password_hash`, `users.created_at`, `users.updated_at`
- `tasks.id`, `tasks.user_id`, `tasks.title`, `tasks.completed`, `tasks.created_at`, `tasks.updated_at`

### UNIQUE Constraints
- `users.email` - No duplicate email addresses

### DEFAULT Values
- `users.email_verified` → `FALSE`
- `users.created_at` → `CURRENT_TIMESTAMP`
- `users.updated_at` → `CURRENT_TIMESTAMP`
- `tasks.completed` → `FALSE`
- `tasks.created_at` → `CURRENT_TIMESTAMP`
- `tasks.updated_at` → `CURRENT_TIMESTAMP`

### Foreign Key Constraints
- `tasks.user_id` → `users.id` ON DELETE CASCADE

### Check Constraints (Future Enhancement)
```sql
-- Ensure title is not empty
ALTER TABLE tasks ADD CONSTRAINT check_title_not_empty
    CHECK (length(trim(title)) > 0);

-- Ensure email format (basic check)
ALTER TABLE users ADD CONSTRAINT check_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

---

## Data Types Rationale

### UUID vs Integer IDs
- **UUID chosen** for security and scalability
- Prevents ID enumeration attacks
- Globally unique across distributed systems
- No auto-increment sequence contention
- Safe to expose in URLs

### VARCHAR vs TEXT
- **VARCHAR(255)** for `email`, `name`, `title` - fixed reasonable limits
- **TEXT** for `description` - variable length, application enforces 1000 char limit
- **VARCHAR(255)** for `password_hash` - bcrypt output is fixed length

### TIMESTAMP WITH TIME ZONE
- Stores UTC timestamps with timezone awareness
- Prevents timezone-related bugs
- Allows proper sorting and comparison across timezones

### BOOLEAN vs TINYINT
- **BOOLEAN** for `completed`, `email_verified` - explicit true/false semantics
- More readable and type-safe than integer flags

---

## Migration Strategy

### Initial Migration (Alembic)
```python
# alembic/versions/001_initial_schema.py
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

def upgrade():
    # Users table (managed by Better Auth, but shown for reference)
    op.create_table(
        'users',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('name', sa.String(255), nullable=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('email_verified', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_users_email', 'users', ['email'], unique=True)

    # Tasks table
    op.create_table(
        'tasks',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    )
    op.create_index('idx_tasks_user_id', 'tasks', ['user_id'])
    op.create_index('idx_tasks_completed', 'tasks', ['completed'])
    op.create_index('idx_tasks_created_at', 'tasks', ['created_at'])
    op.create_index('idx_tasks_user_completed', 'tasks', ['user_id', 'completed'])

def downgrade():
    op.drop_table('tasks')
    op.drop_table('users')
```

---

## Future Schema Enhancements

### Potential Additional Fields

#### tasks table extensions:
- `due_date` (TIMESTAMP WITH TIME ZONE) - Task deadline
- `priority` (VARCHAR(20)) - Priority level: low, medium, high, urgent
- `category` (VARCHAR(50)) - Task category/tag
- `position` (INTEGER) - Manual ordering position
- `archived` (BOOLEAN) - Soft delete flag
- `deleted_at` (TIMESTAMP WITH TIME ZONE) - Soft delete timestamp

#### New tables (future phases):
- `categories` - Task categories/tags
- `task_tags` - Many-to-many relationship between tasks and tags
- `task_attachments` - File attachments for tasks
- `task_comments` - Comments/notes on tasks
- `task_history` - Audit log of task changes
- `shared_tasks` - Task sharing between users

### Example Future Schema
```sql
-- Task categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many task-category relationship
CREATE TABLE task_categories (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, category_id)
);
```

---

## Database Connection Configuration

### Connection String Format
```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

### Neon PostgreSQL Connection
```python
# Example connection configuration
DATABASE_URL = "postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

# SQLModel engine configuration
from sqlmodel import create_engine

engine = create_engine(
    DATABASE_URL,
    echo=True,  # Log SQL queries (disable in production)
    pool_size=5,  # Connection pool size
    max_overflow=10,  # Max overflow connections
    pool_pre_ping=True,  # Verify connections before use
)
```

### Environment Variables
```bash
# .env file
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
DATABASE_POOL_SIZE=5
DATABASE_MAX_OVERFLOW=10
DATABASE_ECHO=false  # Set to true for SQL query logging
```

---

## Data Seeding (Development)

### Sample Data Script
```python
# scripts/seed_data.py
from sqlmodel import Session, create_engine
from models import User, Task
from uuid import uuid4
from datetime import datetime

def seed_database():
    # Create test user
    user = User(
        id=uuid4(),
        email="test@example.com",
        name="Test User",
        password_hash="$2b$12$...",  # Hashed "password123"
        email_verified=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    # Create sample tasks
    tasks = [
        Task(
            id=uuid4(),
            user_id=user.id,
            title="Complete project documentation",
            description="Write comprehensive API docs",
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        ),
        Task(
            id=uuid4(),
            user_id=user.id,
            title="Review pull requests",
            description=None,
            completed=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        ),
    ]

    with Session(engine) as session:
        session.add(user)
        session.add_all(tasks)
        session.commit()
```

---

## Security Considerations

### Password Storage
- Never store plaintext passwords
- Use bcrypt with appropriate cost factor (10-12 rounds)
- Password hashing handled by Better Auth library

### SQL Injection Prevention
- Use SQLModel ORM for all queries (parameterized queries)
- Never concatenate user input into SQL strings
- Validate and sanitize all inputs at application layer

### Data Isolation
- All queries filtered by authenticated user_id
- Foreign key constraints prevent orphaned records
- Cascade deletes maintain referential integrity

### Sensitive Data
- Email addresses are PII - handle with care
- Consider encryption at rest for sensitive fields (future)
- Implement proper backup and retention policies

---

## Performance Considerations

### Query Optimization
- Use indexes for frequently queried columns
- Avoid N+1 query problems with proper joins
- Implement pagination for large result sets
- Use connection pooling for efficiency

### Scaling Strategy
- Neon PostgreSQL provides automatic scaling
- Read replicas for read-heavy workloads (future)
- Partitioning for very large task tables (future)
- Caching layer (Redis) for frequently accessed data (future)

---

## Backup and Recovery

### Neon Automatic Backups
- Point-in-time recovery (PITR) available
- Automatic daily backups retained for 7 days
- Manual snapshots for major changes

### Disaster Recovery
- Regular backup testing
- Documented restore procedures
- RTO (Recovery Time Objective): < 1 hour
- RPO (Recovery Point Objective): < 15 minutes

---

## Related Specifications
- @specs/api/rest-endpoints.md - API endpoints using this schema
- @specs/features/authentication.md - User authentication flow
- @specs/features/task-crud.md - Task management operations
