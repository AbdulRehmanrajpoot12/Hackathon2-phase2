# Authentication System Specification

## Feature Overview
Secure user authentication system using JWT tokens with Better Auth, enabling user registration, login, logout, and protected route access across the full-stack application.

## User Stories

### US-AUTH-001: User Registration (Sign Up)
As a new user,
I want to create an account with email and password,
So that I can access the todo application and manage my personal tasks.

**Acceptance Criteria:**
- User can access the signup page at `/signup`
- Form includes email field with validation
- Form includes password field with minimum security requirements
- Form includes password confirmation field
- Email uniqueness is validated (no duplicate accounts)
- Password is hashed before storage (never stored in plaintext)
- JWT token is issued immediately upon successful registration
- User is automatically logged in after registration
- User is redirected to `/tasks` after successful signup
- Error messages are displayed for validation failures
- Loading state is shown during registration process

### US-AUTH-002: User Login (Sign In)
As a registered user,
I want to log in with my email and password,
So that I can access my personal tasks and account.

**Acceptance Criteria:**
- User can access the login page at `/signin`
- Form includes email and password fields
- Credentials are validated against database records
- JWT token is issued upon successful authentication
- Token is stored securely in the frontend (httpOnly cookie or secure storage)
- User is redirected to `/tasks` after successful login
- Invalid credentials display appropriate error message
- Loading state is shown during authentication process
- "Remember me" functionality (optional extension)

### US-AUTH-003: User Logout (Sign Out)
As an authenticated user,
I want to log out of my account,
So that I can secure my session when using shared devices.

**Acceptance Criteria:**
- Logout option is available in the navigation/header
- JWT token is invalidated/removed from client storage
- User session is terminated
- User is redirected to `/signin` after logout
- All protected routes become inaccessible after logout
- Confirmation message is displayed (optional)

### US-AUTH-004: Protected Routes
As the application,
I want to restrict access to authenticated users only,
So that unauthorized users cannot access task management features.

**Acceptance Criteria:**
- All `/tasks/*` routes require valid authentication
- Unauthenticated users are redirected to `/signin`
- Authentication status is checked on route navigation
- Token expiration triggers automatic logout
- Public routes (`/signin`, `/signup`) remain accessible to all users
- Root route `/` redirects based on authentication status

### US-AUTH-005: Session Persistence
As an authenticated user,
I want my session to persist across browser refreshes,
So that I don't have to log in repeatedly during normal usage.

**Acceptance Criteria:**
- JWT token persists in secure storage (httpOnly cookie preferred)
- Token is automatically included in API requests
- Token validity is checked on application load
- Expired tokens trigger re-authentication flow
- Session timeout is configurable (default: 7 days)

## JWT Authentication Flow

### Token Issuance (Frontend)
1. User submits credentials via signup or signin form
2. Frontend sends POST request to Better Auth endpoint
3. Better Auth validates credentials and generates JWT
4. JWT is returned to frontend with user information
5. Frontend stores JWT securely (httpOnly cookie via Better Auth)
6. Frontend updates application state with authenticated user

### Token Transmission
- **Method**: HTTP Authorization header
- **Format**: `Authorization: Bearer <jwt_token>`
- **Automatic Inclusion**: All API requests to `/api/*` endpoints
- **Cookie Fallback**: Better Auth manages httpOnly cookies automatically

### Token Verification (Backend)
1. Backend receives request with Authorization header
2. JWT is extracted from `Bearer` token
3. Token signature is verified using `BETTER_AUTH_SECRET`
4. Token expiration is checked
5. User ID is extracted from token payload
6. User existence is verified in database
7. Request proceeds with authenticated user context
8. Invalid/expired tokens return 401 Unauthorized

### Token Payload Structure
```json
{
  "sub": "user_id_uuid",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290,
  "iss": "better-auth"
}
```

## Token Attachment Mechanism

### Frontend Implementation
- Better Auth SDK automatically manages token storage
- Tokens stored in httpOnly cookies (most secure)
- API client (`/frontend/lib/api.ts`) includes token in headers
- Token refresh handled automatically by Better Auth

### Backend Middleware
- FastAPI dependency injection for authentication
- Middleware extracts and validates JWT from Authorization header
- User context is injected into route handlers
- Unauthorized requests are rejected before reaching business logic

## Error Handling

### 401 Unauthorized
**Trigger**: Missing, invalid, or expired JWT token
**Response**:
```json
{
  "detail": "Unauthorized: Invalid or missing authentication token",
  "error_code": "AUTH_INVALID_TOKEN"
}
```
**Frontend Action**: Redirect to `/signin`, clear stored credentials

### 403 Forbidden
**Trigger**: Valid token but insufficient permissions (e.g., accessing another user's task)
**Response**:
```json
{
  "detail": "Forbidden: You do not have permission to access this resource",
  "error_code": "AUTH_FORBIDDEN"
}
```
**Frontend Action**: Display error message, do not redirect

### Token Expired
**Trigger**: JWT expiration time (`exp`) has passed
**Response**:
```json
{
  "detail": "Unauthorized: Token has expired",
  "error_code": "AUTH_TOKEN_EXPIRED"
}
```
**Frontend Action**: Redirect to `/signin`, prompt re-authentication

### Invalid Credentials (Login)
**Trigger**: Email/password combination does not match
**Response**:
```json
{
  "detail": "Invalid email or password",
  "error_code": "AUTH_INVALID_CREDENTIALS"
}
```
**Frontend Action**: Display error message, allow retry

### Email Already Exists (Signup)
**Trigger**: Registration attempt with existing email
**Response**:
```json
{
  "detail": "An account with this email already exists",
  "error_code": "AUTH_EMAIL_EXISTS"
}
```
**Frontend Action**: Display error message, suggest login

## Shared Secret Usage (BETTER_AUTH_SECRET)

### Purpose
- Cryptographic key for signing and verifying JWT tokens
- Ensures token integrity and authenticity
- Prevents token forgery and tampering

### Configuration
- **Environment Variable**: `BETTER_AUTH_SECRET`
- **Storage**: `.env` file (never committed to version control)
- **Generation**: Cryptographically secure random string (min 32 characters)
- **Sharing**: Same secret must be configured in both frontend and backend

### Security Requirements
- Secret must be at least 32 characters long
- Use cryptographically secure random generation
- Rotate secret periodically (invalidates all existing tokens)
- Never expose secret in client-side code or logs
- Use different secrets for development, staging, and production

### Example Configuration
```bash
# .env (Backend)
BETTER_AUTH_SECRET=your-super-secure-random-string-min-32-chars

# .env.local (Frontend)
BETTER_AUTH_SECRET=your-super-secure-random-string-min-32-chars
```

## Session vs JWT Explanation

### Session-Based Authentication (Traditional)
- Server stores session data in memory or database
- Client receives session ID cookie
- Server looks up session on each request
- Requires server-side storage and state management
- **Not used in this application**

### JWT-Based Authentication (This Application)
- Server signs token with secret, no server-side storage needed
- Client stores JWT (httpOnly cookie or localStorage)
- Server verifies token signature on each request
- Stateless: no session storage required
- Scalable: works across multiple backend instances
- **Used in this application via Better Auth**

### Hybrid Approach (Better Auth)
- Better Auth uses JWT for authentication
- Optionally stores session metadata in database for advanced features
- Combines benefits of both approaches
- Tokens are self-contained but can be revoked if needed

## Password Requirements

### Minimum Security Standards
- **Minimum Length**: 8 characters
- **Complexity**: At least one uppercase, one lowercase, one number
- **Special Characters**: Recommended but not required
- **Common Passwords**: Rejected (e.g., "password123")
- **Hashing Algorithm**: bcrypt with salt (handled by Better Auth)

### Validation Messages
- "Password must be at least 8 characters long"
- "Password must contain at least one uppercase letter"
- "Password must contain at least one lowercase letter"
- "Password must contain at least one number"
- "This password is too common, please choose a stronger password"

## Security Considerations

### Token Security
- Use httpOnly cookies to prevent XSS attacks
- Set secure flag for HTTPS-only transmission
- Implement CSRF protection for cookie-based auth
- Short token expiration (7 days default)
- Refresh token mechanism (optional extension)

### Password Security
- Never store passwords in plaintext
- Use bcrypt with appropriate cost factor (10-12 rounds)
- Implement rate limiting on login attempts
- Account lockout after multiple failed attempts (optional)
- Password reset functionality (future enhancement)

### API Security
- All task endpoints require authentication
- User ID extracted from JWT, never from request parameters
- Validate token on every request
- Implement request rate limiting
- Log authentication failures for monitoring

## Integration Points

### Frontend Integration
- **Better Auth SDK**: `@better-auth/react` for React hooks
- **API Client**: `/frontend/lib/api.ts` includes token in requests
- **Route Protection**: Middleware checks authentication status
- **User Context**: React Context provides user data globally

### Backend Integration
- **Better Auth Library**: JWT verification utilities
- **FastAPI Dependency**: `get_current_user()` dependency injection
- **Database Models**: User model managed by Better Auth schema
- **Environment Config**: `BETTER_AUTH_SECRET` loaded from environment

## Testing Requirements

### Unit Tests
- Token generation and verification
- Password hashing and validation
- User registration validation
- Login credential validation

### Integration Tests
- Complete signup flow (frontend + backend)
- Complete login flow (frontend + backend)
- Protected route access with valid token
- Protected route rejection with invalid token
- Token expiration handling

### Security Tests
- SQL injection prevention in auth queries
- XSS prevention in user input
- CSRF protection validation
- Rate limiting enforcement
- Token tampering detection

## Performance Requirements
- Authentication check completes within 100ms
- Token verification adds <50ms overhead per request
- Login/signup operations complete within 1 second
- Support 100+ concurrent authentication requests

## Future Enhancements
- OAuth integration (Google, GitHub)
- Two-factor authentication (2FA)
- Password reset via email
- Email verification on signup
- Remember me functionality
- Session management dashboard
- Account deletion and data export
