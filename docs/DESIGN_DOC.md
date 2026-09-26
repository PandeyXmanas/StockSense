# StockSense — Design Document

**Status:** Baseline / Source of Truth  
**Version:** 1.0  
**Purpose:** Define the system architecture, domain model, boundaries, and key technical decisions before implementation.

## 1. Design Principle

StockSense is centered around one invariant:

> The current inventory state must be explainable by a sequence of recorded stock movements.

The inventory quantity shown to users and the stock ledger must remain consistent.

## 2. High-Level Architecture

```text
                    ┌──────────────────────┐
                    │      Web Client      │
                    │ React + Vite + UI   │
                    └──────────┬───────────┘
                               │ HTTPS / JSON
                               ▼
                    ┌──────────────────────┐
                    │     REST API Layer   │
                    │ Node.js + Express    │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
      Authentication     Inventory Service   Dashboard/Query
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │      MySQL DB        │
                    │ Sequelize ORM        │
                    └──────────────────────┘
```

## 3. Architectural Boundaries

### Frontend
Responsible for:
- Authentication screens
- Dashboard
- Product screens
- Receipt/delivery/transfer/adjustment forms
- Tables, filters, search, status display
- Client-side form validation

The frontend must not be the source of truth for inventory calculations.

### Backend
Responsible for:
- Authentication and authorization
- Business rules
- Inventory calculations
- Operation validation
- Stock updates
- Ledger creation
- Dashboard aggregates

### Database
Responsible for durable storage and transactional consistency.

## 4. Core Domain Entities

The following entities are derived from the product requirements and represent the baseline data model.

### User
Suggested fields:
- id
- name
- email
- passwordHash
- role
- createdAt
- updatedAt

### Product
- id
- name
- sku
- categoryId
- unitOfMeasure
- initialStock (optional at creation)
- createdAt
- updatedAt

### Category
- id
- name
- createdAt
- updatedAt

### Warehouse
- id
- name
- code
- createdAt
- updatedAt

### Location
- id
- warehouseId
- name
- code
- createdAt
- updatedAt

### InventoryBalance
Represents current product quantity at a location.

- id
- productId
- locationId
- quantity
- updatedAt

### Receipt
- id
- referenceNumber
- supplierName
- status
- createdBy
- createdAt
- validatedAt
- canceledAt (optional)

### ReceiptItem
- id
- receiptId
- productId
- quantity
- destinationLocationId

### DeliveryOrder
- id
- referenceNumber
- status
- createdBy
- createdAt
- validatedAt
- canceledAt (optional)

### DeliveryItem
- id
- deliveryOrderId
- productId
- quantity
- sourceLocationId

### InternalTransfer
- id
- referenceNumber
- status
- fromLocationId
- toLocationId
- createdBy
- createdAt
- validatedAt

### InternalTransferItem
- id
- transferId
- productId
- quantity

### InventoryAdjustment
- id
- referenceNumber
- status
- locationId
- createdBy
- createdAt
- validatedAt

### InventoryAdjustmentItem
- id
- adjustmentId
- productId
- countedQuantity
- previousQuantity
- deltaQuantity

### StockLedgerEntry
- id
- productId
- locationId
- movementType
- quantityDelta
- referenceType
- referenceId
- createdBy
- createdAt

## 5. Relationship Model

```text
User
 │
 ├────────────── creates ──────────────┐
 │                                     │
 ▼                                     ▼
Receipt ──< ReceiptItem             DeliveryOrder ──< DeliveryItem
                                      
Warehouse ──< Location ──< InventoryBalance >── Product >── Category
     │
     └──────── locations participate in transfers/adjustments/deliveries

InternalTransfer ──< InternalTransferItem

InventoryAdjustment ──< InventoryAdjustmentItem

Receipt / Delivery / Transfer / Adjustment
                    │
                    ▼
              StockLedgerEntry
```

## 6. Inventory State Model

### Receipt
```text
Before: location quantity = Q
Receipt validated: +R
After: location quantity = Q + R
```

### Delivery
```text
Before: location quantity = Q
Delivery validated: -D
After: location quantity = Q - D
```

### Transfer
```text
Source before: S
Destination before: D
Transfer quantity: T

Source after      = S - T
Destination after = D + T
Total unchanged
```

### Adjustment
```text
Recorded quantity = R
Physical counted quantity = C
Delta = C - R
New quantity = C
```

## 7. Critical Transaction Rule

Stock-changing operations must be processed as one database transaction.

For a transfer, for example:

```text
BEGIN TRANSACTION
  Validate source availability
  Decrease source inventory
  Increase destination inventory
  Create ledger entries
  Mark transfer as validated/done
COMMIT
```

If any step fails, the whole operation must roll back.

## 8. Ledger Strategy

The ledger is append-oriented and audit-focused.

Do not edit historical ledger records to change current stock. A correction should be represented by a new adjustment or other valid movement.

Recommended movement types:
- RECEIPT
- DELIVERY
- TRANSFER_OUT
- TRANSFER_IN
- ADJUSTMENT

For an internal transfer, two location-level ledger entries may be generated:
- TRANSFER_OUT at source
- TRANSFER_IN at destination

The transfer itself remains one business operation.

## 9. API Design Principles

Use REST-style endpoints and clear resource names.

Suggested baseline endpoints:

```text
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/forgot-password/request-otp
POST   /api/auth/forgot-password/reset

GET    /api/dashboard/summary

GET    /api/products
POST   /api/products
GET    /api/products/:id
PATCH  /api/products/:id

GET    /api/categories
POST   /api/categories

GET    /api/warehouses
POST   /api/warehouses
GET    /api/locations
POST   /api/locations

GET    /api/receipts
POST   /api/receipts
GET    /api/receipts/:id
PATCH  /api/receipts/:id
POST   /api/receipts/:id/validate

GET    /api/deliveries
POST   /api/deliveries
GET    /api/deliveries/:id
PATCH  /api/deliveries/:id
POST   /api/deliveries/:id/validate

GET    /api/transfers
POST   /api/transfers
GET    /api/transfers/:id
PATCH  /api/transfers/:id
POST   /api/transfers/:id/validate

GET    /api/adjustments
POST   /api/adjustments
GET    /api/adjustments/:id
PATCH  /api/adjustments/:id
POST   /api/adjustments/:id/validate

GET    /api/inventory
GET    /api/ledger
```

These routes are an implementation design proposal, not routes explicitly stated in the problem statement.

## 10. Validation Rules

Baseline rules:
- SKU must be unique.
- Product/category/location references must exist.
- Quantities must be valid positive quantities when recording a movement.
- Delivery quantity must not exceed available source inventory unless a future explicit business rule permits negative stock.
- Transfer source and destination must be different.
- Transfer quantity must be available at the source.
- A validated/canceled document must not be silently edited in a way that changes stock history.
- Ledger creation must occur in the same transaction as the stock update.

## 11. UI Structure

### Dashboard
- KPI cards
- Operation filters
- Recent/pending operations
- Low-stock view

### Products
- Product list
- Create/edit form
- Product detail
- Location-wise stock

### Operations
Each operation should support the lifecycle defined by the product brief, using the shared status set where applicable.

## 12. Error Handling

API errors should return predictable JSON:

```json
{
  "success": false,
  "message": "Insufficient stock",
  "code": "INSUFFICIENT_STOCK"
}
```

Success responses should similarly use a predictable envelope where practical.

## 13. Security Baseline

- Passwords stored as strong hashes, never plaintext.
- JWT or equivalent authenticated sessions for API access.
- Authorization checks on protected routes.
- OTP reset tokens must expire and be single-use.
- Validate and sanitize user input.
- Never expose password hashes or OTP secrets in API responses.
- Keep secrets in environment variables.

## 14. Design Decisions That Must Not Drift

1. React + Vite frontend.
2. Node.js + Express backend.
3. MySQL database.
4. Sequelize ORM.
5. REST API between frontend and backend.
6. Inventory changes happen on the backend.
7. Stock operations and ledger writes are transactional.
8. Stock is tracked per location.
9. Ledger is the audit trail.
10. New product features require an explicit PRD change.
