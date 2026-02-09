<!--
Sync Impact Report:
Version: 1.0.0 (Initial Constitution)
Modified Principles: N/A (initial creation)
Added Sections: All sections created from template
Removed Sections: None
Templates Status:
  - ✅ .specify/templates/plan-template.md (aligned)
  - ✅ .specify/templates/spec-template.md (aligned)
  - ✅ .specify/templates/tasks-template.md (aligned)
Follow-up TODOs: None
-->

# Full-Stack Web Todo Application Constitution

## Core Principles

### I. Specification-First Development
Every feature begins with a complete specification before any code is written. Specifications must include user stories, acceptance criteria, API contracts, database schema, and UI/UX designs. No implementation work starts until the specification is reviewed and approved. This ensures clarity, reduces rework, and maintains alignment between all stakeholders.

**Rationale**: Prevents scope creep, reduces implementation errors, and ensures all team members understand requirements before development begins.

### II. Authentication and Authorization (NON-NEGOTIABLE)
All task-related operations MUST be protected by authentication. User data MUST be isolated per authenticated user. No user can access, modify, or delete another user's tasks. Authentication tokens MUST be validated on every request. User ID is extracted from JWT tokens, never from request parameters.

**Rationale**: Protects user privacy, prevents unauthorized access, and ensures data security in a multi-tenant application.

### III. API-First Architecture
Backend APIs are designed and documented before frontend implementation. All endpoints follow RESTful conventions with clear request/response schemas. API contracts are versioned and backward-compatible. Frontend consumes APIs through a centralized client layer.

**Rationale**: Enables parallel frontend/backend development, facilitates testing, and ensures consistent API behavior.

### IV. Type Safety and Validation
All data structures use TypeScript types (frontend) and Pydantic models (backend). Input validation occurs at API boundaries. Database models use SQLModel for type-safe ORM operations. No implicit type coercion or unsafe type casting.

**Rationale**: Catches errors at compile time, prevents runtime type errors, and improves code maintainability.

### V. Database Integrity
All database operations use ORM (SQLModel) to prevent SQL injection. Foreign key constraints enforce referential integrity. Indexes are created for frequently queried columns. Migrations are versioned and reversible. No direct SQL string concatenation.

**Rationale**: Ensures data consistency, prevents security vulnerabilities, and maintains database performance.

### VI. Component Reusability
UI components are small, focused, and reusable. Each component has a single responsibility. Components accept props for configuration rather than hardcoding values. Shared components live in a centralized components directory.

**Rationale**: Reduces code duplication, improves maintainability, and ensures UI consistency.

### VII. Accessibility First
All UI components meet WCAG 2.1 AA standards. Proper semantic HTML is used. ARIA attributes are added where needed. Keyboard navigation is fully supported. Color contrast ratios meet minimum requirements. Touch targets are at least 44x44px.

**Rationale**: Ensures the application is usable by all users, including those with disabilities, and improves overall user experience.

### VIII. Error Handling and User Feedback
All error states are handled gracefully with user-friendly messages. Loading states are shown for async operations. Success feedback is provided for user actions. Network errors include retry mechanisms. Form validation provides inline feedback.

**Rationale**: Improves user experience, reduces frustration, and helps users understand what went wrong and how to fix it.

## Security Requirements

### Authentication Security
- JWT tokens stored in httpOnly cookies to prevent XSS attacks
- Tokens signed with cryptographically secure secret (min 32 characters)
- Token expiration enforced (default 7 days)
- Password hashing with bcrypt (10-12 rounds)
- Rate limiting on authentication endpoints (10 requests/minute)

### API Security
- All endpoints validate authentication tokens
- User ID extracted from token, never from request parameters
- Return 404 (not 403) for unauthorized resource access to prevent user enumeration
- Input validation using Pydantic models
- SQL injection prevention via ORM
- CORS configured for specific origins only

### Data Privacy
- Passwords never stored in plaintext
- Passwords never returned in API responses
- User data isolated per authenticated user
- Sensitive data encrypted at rest (future enhancement)

## Development Workflow

### Specification Phase
1. Create feature specification in `specs/features/[feature-name].md`
2. Define API endpoints in `specs/api/rest-endpoints.md`
3. Design database schema in `specs/database/schema.md`
4. Design UI pages in `specs/ui/pages.md`
5. Design UI components in `specs/ui/components.md`
6. Review and approve specification before proceeding

### Planning Phase
1. Create architectural plan in `specs/[feature]/plan.md`
2. Identify technical dependencies and risks
3. Make architectural decisions and document in ADRs
4. Define implementation approach and patterns
5. Review and approve plan before proceeding

### Task Generation Phase
1. Break down plan into testable tasks in `specs/[feature]/tasks.md`
2. Define acceptance criteria for each task
3. Identify task dependencies
4. Estimate complexity (not time)
5. Review and approve tasks before implementation

### Implementation Phase
1. Implement tasks in dependency order
2. Write tests for each task (unit, integration, e2e)
3. Ensure all acceptance criteria are met
4. Code review before merging
5. Update documentation as needed

### Quality Gates
- All code must pass TypeScript/Python type checking
- All tests must pass before merging
- Code coverage must be maintained (target: 80%+)
- Accessibility audit must pass
- Security scan must pass (no high/critical vulnerabilities)

## Technology Stack Standards

### Frontend (Next.js)
- Next.js 14+ with App Router (not Pages Router)
- React Server Components for data fetching
- Client Components for interactivity
- TypeScript for all code (strict mode)
- Tailwind CSS for styling (no CSS-in-JS)
- Better Auth SDK for authentication

### Backend (FastAPI)
- FastAPI with Python 3.10+
- SQLModel for ORM and data validation
- Pydantic for request/response models
- Dependency injection for authentication
- Alembic for database migrations
- Better Auth for JWT verification

### Database (PostgreSQL)
- Neon PostgreSQL (serverless)
- UUID primary keys (not auto-increment integers)
- Timestamps with timezone (not without timezone)
- Foreign key constraints with CASCADE DELETE
- Indexes on frequently queried columns

### Deployment
- Frontend: Vercel (automatic deployments from main branch)
- Backend: Railway or Render (automatic deployments from main branch)
- Database: Neon (automatic backups and scaling)
- Environment variables managed securely (never committed)

## Code Quality Standards

### Code Style
- Consistent formatting (Prettier for frontend, Black for backend)
- Meaningful variable and function names
- Comments only for complex logic (code should be self-documenting)
- No commented-out code in commits
- No console.log or print statements in production code

### Testing Requirements
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test coverage maintained above 80%
- Tests run automatically in CI/CD pipeline

### Performance Standards
- API endpoints respond within 500ms (p95)
- Page load time under 2 seconds (p95)
- Database queries optimized with proper indexes
- Images optimized and lazy-loaded
- Code splitting for large bundles

## Governance

### Amendment Procedure
1. Propose amendment with rationale and impact analysis
2. Discuss with team and gather feedback
3. Update constitution with version bump (semantic versioning)
4. Update dependent templates and documentation
5. Communicate changes to all team members
6. Document in ADR if architecturally significant

### Versioning Policy
- **MAJOR**: Backward incompatible changes to principles or removal of principles
- **MINOR**: New principles added or existing principles materially expanded
- **PATCH**: Clarifications, wording improvements, typo fixes

### Compliance Review
- All pull requests must verify compliance with constitution
- Architectural decisions must align with core principles
- Deviations from principles require explicit justification and approval
- Constitution reviewed and updated quarterly or as needed

### Conflict Resolution
- Constitution supersedes all other practices and guidelines
- In case of ambiguity, favor security and user privacy
- When in doubt, consult with team lead or architect
- Document decisions in ADRs for future reference

**Version**: 1.0.0 | **Ratified**: 2026-02-07 | **Last Amended**: 2026-02-07
