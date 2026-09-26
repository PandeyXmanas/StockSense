# StockSense — Technology Stack

**Status:** Baseline / Source of Truth  
**Version:** 1.0  
**Purpose:** Freeze the technology choices so coding prompts do not repeatedly change the stack.

## 1. Stack Summary

| Layer | Technology | Decision |
|---|---|---|
| Frontend | React | Locked |
| Build Tool | Vite | Locked |
| Styling | Tailwind CSS | Locked |
| Backend | Node.js | Locked |
| API Framework | Express.js | Locked |
| Database | MySQL | Locked |
| ORM | Sequelize | Locked |
| Version Control | Git | Locked |
| Repository | GitHub | Locked |
| Deployment | Vercel for frontend; backend deployment may use a compatible Node host | Baseline |
| API Style | REST + JSON | Locked |

The locked stack above is a project decision for implementation. It is not claimed as a requirement of the uploaded problem statement.

## 2. Frontend

### React
Use React for the web application UI and component-based architecture.

### Vite
Use Vite for local development and production builds.

### Tailwind CSS
Use Tailwind CSS for styling.

Keep the visual system consistent:
- Shared layout
- Shared sidebar/header
- Reusable buttons
- Reusable inputs/selects
- Reusable tables
- Reusable status badges
- Reusable modal/drawer patterns

## 3. Backend

### Node.js
Use Node.js for the application server.

### Express.js
Use Express.js to expose the REST API.

Recommended backend organization:

```text
backend/
  src/
    config/
    middleware/
    modules/
      auth/
      products/
      categories/
      warehouses/
      inventory/
      receipts/
      deliveries/
      transfers/
      adjustments/
      ledger/
      dashboard/
    routes/
    utils/
    app.js
    server.js
```

## 4. Database

### MySQL
MySQL is the primary persistence layer.

### Sequelize
Use Sequelize for:
- Models
- Associations
- Migrations
- Transactions
- Query construction

Do not mix multiple ORMs or database abstraction layers.

## 5. Authentication

Use token-based authentication for the web/API boundary.

Baseline choice:
- JWT access authentication
- Password hashing
- OTP-based password reset

Exact OTP delivery provider is intentionally not locked yet. The implementation may use a suitable provider later without changing the application architecture.

## 6. API Contract

- JSON requests and responses
- REST resource naming
- HTTP status codes used consistently
- Central error middleware
- Authentication middleware
- Request validation middleware

## 7. Environment Variables

Keep secrets out of Git.

Example:

```text
PORT=
NODE_ENV=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
OTP_SECRET=
OTP_EXPIRY_MINUTES=
```

Values must be stored in local `.env` files or deployment secret managers.

A committed `.env` file is prohibited.

## 8. Repository Structure

Recommended monorepo layout:

```text
stocksense/
  frontend/
  backend/
  docs/
    PRD.md
    DESIGN_DOC.md
    TECH_STACK.md
    IMPLEMENTATION.md
  README.md
  .gitignore
```

## 9. Development Rules

### Rule 1 — Do not change the stack casually
Changing React, Express, MySQL, Sequelize, Vite, or Tailwind requires an explicit architecture decision.

### Rule 2 — Prefer simple dependencies
Do not add a library when the existing stack can reasonably solve the problem without it.

### Rule 3 — Keep business logic server-side
The frontend can calculate display values for UX, but authoritative stock changes must happen in the backend.

### Rule 4 — Keep secrets out of source control
Never commit `.env`, passwords, database credentials, JWT secrets, OTP secrets, or API keys.

### Rule 5 — API first for shared business logic
The web client should consume the backend API rather than directly manipulating the database.

## 10. Optional Libraries

Libraries can be added only when they serve an existing requirement or clearly reduce implementation complexity.

Potential categories:
- Form validation
- Schema validation
- Data fetching/cache
- Date handling
- Icons
- Toast/notification UI

The exact library choice is not locked by this document unless explicitly recorded in a future version.
