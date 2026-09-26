# StockSense — Implementation Plan

**Status:** Baseline / Source of Truth  
**Version:** 1.0  
**Purpose:** Provide the fixed build order, coding rules, acceptance gates, and team boundaries for implementation.

## 1. Implementation Strategy

Build the product incrementally in vertical slices. Each slice should result in a working feature connected across UI → API → database.

Do not build disconnected screens first and postpone business logic until the end.

## 2. Milestones

### Milestone 0 — Project Foundation

Deliver:
- Repository structure
- Frontend React/Vite app
- Backend Node/Express app
- MySQL connection
- Sequelize configuration
- Environment variable setup
- Basic API health check
- Basic frontend routing/layout
- Git ignore rules

Gate:
- Frontend runs.
- Backend runs.
- Backend can connect to MySQL.
- `.env` is ignored.

### Milestone 1 — Authentication

Deliver:
- Signup
- Login
- Auth middleware
- Protected routes
- Logout/session handling
- OTP password reset flow
- Dashboard redirect after login

Gate:
- Unauthenticated users cannot access protected application pages/API resources.

### Milestone 2 — Product & Category Management

Deliver:
- Category CRUD
- Product CRUD
- Unique SKU
- Unit of measure
- Optional initial stock
- Product search
- Product list/detail UI

Gate:
- User can create a valid product and view it.

### Milestone 3 — Warehouse & Location Foundation

Deliver:
- Warehouse CRUD
- Location CRUD
- Product availability by location

Gate:
- Inventory can be represented as product + location + quantity.

### Milestone 4 — Inventory Engine

Deliver:
- InventoryBalance persistence
- Central inventory service
- Quantity validation
- Transaction support
- Stock calculation rules

Gate:
- A controlled test can increase/decrease/move inventory correctly.

### Milestone 5 — Receipts

Deliver:
- Receipt creation
- Supplier field
- Receipt items
- Status lifecycle
- Validation action
- Automatic stock increase
- Ledger entry

Gate:
- Validating a receipt changes the correct location quantity and creates a ledger record atomically.

### Milestone 6 — Delivery Orders

Deliver:
- Delivery creation
- Picking/packing UI states as required by the workflow
- Delivery items
- Validation action
- Stock availability check
- Automatic stock decrease
- Ledger entry

Gate:
- Delivery cannot overdraw available stock under the baseline rule.

### Milestone 7 — Internal Transfers

Deliver:
- Source location
- Destination location
- Transfer items
- Validation
- Atomic source decrease + destination increase
- Ledger entries

Gate:
- Total stock remains unchanged after a successful transfer.

### Milestone 8 — Adjustments

Deliver:
- Product/location selection
- Physical counted quantity
- Delta calculation
- Inventory update
- Ledger entry

Gate:
- Post-adjustment inventory equals the physical count entered by the user.

### Milestone 9 — Stock Ledger / Move History

Deliver:
- Ledger API
- Move History page
- Filtering
- Reference links to source documents where practical

Gate:
- Every validated stock-changing operation can be traced.

### Milestone 10 — Dashboard

Deliver:
- Total products in stock
- Low/out-of-stock items
- Pending receipts
- Pending deliveries
- Internal transfers scheduled
- Required filters

Gate:
- KPI values reflect current database state.

### Milestone 11 — Alerts & Reordering

Deliver:
- Reordering rules
- Low-stock alerts
- Out-of-stock visibility

Gate:
- Required alert states can be reproduced from database quantities/rules.

### Milestone 12 — Hardening

Deliver:
- Validation review
- Error handling review
- Permission review
- Transaction/concurrency review
- UI consistency pass
- Test pass
- README and setup documentation

## 3. Suggested Team Workstreams

### Workstream A — Frontend
Owns:
- Layout
- Navigation
- Dashboard
- Products UI
- Operations UI
- Filters/search
- Form UX

### Workstream B — Backend
Owns:
- Express application
- API routes/controllers
- Service layer
- Authentication
- Validation
- Business rules

### Workstream C — Database
Owns:
- Sequelize models
- Associations
- Migrations
- Indexes
- Transaction support

### Workstream D — Integration / QA
Owns:
- API/frontend integration
- End-to-end testing
- Regression testing
- Acceptance criteria
- Bug verification

One person can own multiple workstreams in a small team.

## 4. Backend Layering Rule

Use a predictable backend flow:

```text
Route
  ↓
Controller
  ↓
Validation
  ↓
Service / Business Logic
  ↓
Sequelize Model / Query
  ↓
MySQL
```

Controllers should remain thin. Inventory rules belong in services, not UI code and not route handlers full of business logic.

## 5. Inventory Service Contract

All stock-changing actions should use a central service conceptually equivalent to:

```text
receiveStock(product, location, quantity, reference)
deliverStock(product, location, quantity, reference)
transferStock(product, fromLocation, toLocation, quantity, reference)
adjustStock(product, location, countedQuantity, reference)
```

The exact function signatures may differ, but the architectural responsibility must remain centralized.

## 6. Transaction Requirement

For every stock-changing operation:

```text
validate request
    ↓
BEGIN transaction
    ↓
lock/check relevant inventory rows as needed
    ↓
update inventory
    ↓
create ledger record(s)
    ↓
update document status
    ↓
COMMIT
```

On failure:

```text
ROLLBACK
```

Never leave inventory updated while the corresponding ledger/document update failed.

## 7. Status Handling

Use the baseline status vocabulary:
- Draft
- Waiting
- Ready
- Done
- Canceled

Do not invent additional statuses without recording the product/architecture change first.

## 8. Frontend Page Baseline

```text
/login
/signup
/forgot-password

/dashboard
/products
/products/new
/products/:id

/operations/receipts
/operations/receipts/new
/operations/receipts/:id

/operations/deliveries
/operations/deliveries/new
/operations/deliveries/:id

/operations/transfers
/operations/transfers/new
/operations/transfers/:id

/operations/adjustments
/operations/adjustments/new
/operations/adjustments/:id

/operations/history

/settings/warehouses
/profile
```

Routes are an implementation proposal and can be adjusted without changing product behavior.

## 9. Definition of Done

A feature is done only when:

1. Database model/migration exists where required.
2. Backend endpoint exists.
3. Server-side validation exists.
4. Business logic exists in the appropriate service.
5. Frontend UI exists.
6. Loading/error/empty states are handled.
7. Authentication/authorization is respected.
8. Tests or reproducible manual verification exist.
9. Relevant documentation is updated.
10. No unrelated scope has been added.

## 10. AI / Vibe-Coding Rules

Every AI coding prompt should begin with or reference these files.

### Rule A — Read before changing
Before modifying a feature, inspect:
- PRD.md
- DESIGN_DOC.md
- TECH_STACK.md
- IMPLEMENTATION.md

### Rule B — Preserve architecture
Do not replace the selected stack because another framework/library seems more convenient.

### Rule C — No silent feature creep
If the request introduces behavior not described in the PRD, identify it as a scope change instead of silently implementing it as a permanent requirement.

### Rule D — Do not duplicate business logic
Do not implement inventory calculations separately in multiple controllers/components.

### Rule E — No fake backend behavior
Do not leave mock data or hardcoded inventory values in production feature paths once the corresponding API/database layer exists.

### Rule F — Preserve existing working code
Modify the smallest necessary surface area. Do not rewrite unrelated modules.

### Rule G — Explain breaking changes
Any database migration, API contract change, authentication change, or architectural change must be documented before implementation.

## 11. Testing Baseline

At minimum test these inventory scenarios:

### Receipt
```text
Initial = 20
Receive = 30
Expected = 50
```

### Delivery
```text
Initial = 50
Deliver = 15
Expected = 35
```

### Transfer
```text
A = 40
B = 10
Transfer A→B = 15
Expected: A = 25, B = 25, total = 50
```

### Adjustment
```text
Recorded = 50
Counted = 47
Expected = 47, ledger delta = -3
```

### Failure / rollback
```text
Source stock = 10
Transfer = 20
Expected: operation rejected and inventory remains 10
```

## 12. Git Workflow Baseline

Recommended branches:

```text
main
  └── develop
       ├── feature/auth
       ├── feature/products
       ├── feature/inventory
       ├── feature/receipts
       ├── feature/deliveries
       ├── feature/transfers
       ├── feature/adjustments
       └── feature/dashboard
```

Use focused commits such as:

```text
feat: add product model
feat: implement receipt validation
fix: prevent delivery overdraw
feat: add stock ledger
```

Do not commit secrets or `.env` files.

## 13. Change Protocol

Before a change:

```text
1. Identify whether it is product, design, stack, or implementation.
2. Check the four source-of-truth files.
3. If behavior/scope changes, update PRD first.
4. If architecture changes, update DESIGN_DOC.
5. If technology changes, update TECH_STACK.
6. Update IMPLEMENTATION if build order/acceptance changes.
7. Then code.
```

## 14. Canonical AI Prompt Context

Use this block when starting a new coding session:

```text
You are implementing StockSense.

The repository contains four source-of-truth documents:
- docs/PRD.md — product requirements and scope
- docs/DESIGN_DOC.md — architecture and data design
- docs/TECH_STACK.md — locked technology choices
- docs/IMPLEMENTATION.md — build order and coding rules

Read these before making architectural or behavioral decisions.
Do not silently change requirements, technology, architecture, or data rules.
Prefer the smallest implementation that satisfies the existing specification.
If a request conflicts with these documents, identify the conflict and treat it as a proposed change rather than silently changing the baseline.
```

## 15. Final Implementation Principle

StockSense should be built as an inventory system first, not as a collection of CRUD pages.

The invariant to protect throughout implementation is:

```text
Every valid stock change
        ↓
updates location inventory
        ↓
and creates an auditable ledger record
        ↓
inside one consistent business operation.
```
