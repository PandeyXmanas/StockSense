# StockSense — Product Requirements Document (PRD)

**Status:** Baseline / Source of Truth  
**Version:** 1.0  
**Product:** StockSense  
**Purpose:** Keep future AI/vibe-coding prompts aligned with one agreed product definition.

## 1. Product Vision

StockSense is a modular Inventory Management System (IMS) that digitizes and streamlines stock-related operations inside a business. It replaces manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use application.

The uploaded problem statement is the authoritative source for the product requirements in this document.

## 2. Target Users

### Inventory Managers
- Manage incoming and outgoing stock.
- Monitor inventory status.
- Review stock operations.

### Warehouse Staff
- Perform transfers.
- Pick and pack outgoing items.
- Perform shelving and counting activities.

## 3. Product Goals

1. Maintain a centralized inventory record.
2. Track stock by product and location.
3. Record every stock-changing operation.
4. Keep stock quantities automatically updated after validated operations.
5. Provide a dashboard snapshot of inventory operations.
6. Support multiple warehouses/locations.
7. Reduce dependency on manual registers and spreadsheets.

## 4. Non-Goals / Scope Protection

The first version must not introduce unrelated domains such as:
- Accounting or ERP modules
- Payroll or HR
- CRM
- E-commerce storefronts
- Supplier marketplaces
- AI demand forecasting
- Advanced BI/analytics not required by the brief

These can be considered future work only through an explicit scope change.

## 5. Authentication Requirements

The system must support:
- User signup
- User login
- OTP-based password reset
- Redirect to the Inventory Dashboard after authentication

## 6. Dashboard Requirements

The landing dashboard must show:

### KPIs
- Total Products in Stock
- Low Stock / Out of Stock Items
- Pending Receipts
- Pending Deliveries
- Internal Transfers Scheduled

### Filters
Filter operations by:
- Document type: Receipts / Delivery / Internal / Adjustments
- Status: Draft / Waiting / Ready / Done / Canceled
- Warehouse or location
- Product category

## 7. Navigation

Primary navigation:
1. Products
2. Operations
   - Receipts
   - Delivery Orders
   - Inventory Adjustment
   - Move History
3. Dashboard
4. Settings
   - Warehouse
5. Profile Menu
   - My Profile
   - Logout

## 8. Product Management

Users can create/update products with:
- Name
- SKU / Code
- Category
- Unit of Measure
- Initial stock (optional)

Additional product capabilities from the brief:
- Stock availability per location
- Product categories
- Reordering rules
- SKU search
- Smart filters

## 9. Inventory Operations

### 9.1 Receipts — Incoming Stock

Purpose: Record goods arriving from vendors.

Flow:
1. Create a receipt.
2. Add supplier and products.
3. Enter quantities received.
4. Validate the receipt.
5. Validated quantity increases stock automatically.

Example:
- Receive 50 units of Steel Rods.
- Stock increases by 50.

### 9.2 Delivery Orders — Outgoing Stock

Purpose: Record stock leaving the warehouse for customer shipment.

Flow:
1. Pick items.
2. Pack items.
3. Validate the delivery.
4. Validated quantity decreases stock automatically.

Example:
- Delivery of 10 chairs.
- Chair stock decreases by 10.

### 9.3 Internal Transfers

Purpose: Move stock within the company.

Examples:
- Main Warehouse → Production Floor
- Rack A → Rack B
- Warehouse 1 → Warehouse 2

Rules:
- Total company stock remains unchanged.
- Source location quantity decreases.
- Destination location quantity increases.
- The movement is logged in the stock ledger.

### 9.4 Stock Adjustments

Purpose: Correct differences between recorded stock and physical count.

Flow:
1. Select product/location.
2. Enter counted quantity.
3. System calculates the adjustment.
4. System updates inventory.
5. System logs the adjustment.

## 10. Stock Ledger — Core Requirement

Every stock-changing event must be traceable through a stock ledger.

Ledger events include at minimum:
- Receipt
- Delivery
- Internal transfer
- Adjustment

The ledger must preserve enough information to understand:
- What product moved
- Quantity involved
- Location involved
- Movement type
- Related operation/document
- When the movement happened

## 11. Alerts and Multi-Warehouse

The system must support:
- Low-stock alerts
- Multi-warehouse inventory
- Location-aware stock availability
- Reordering rules

## 12. Inventory Rules

These rules are mandatory for implementation consistency:

1. Stock changes only through defined inventory operations.
2. A receipt increases stock only after validation.
3. A delivery decreases stock only after validation.
4. An internal transfer moves quantity between locations without changing total stock.
5. An adjustment reconciles recorded quantity with physical quantity.
6. Each validated stock movement creates a ledger entry.
7. Location-level stock must be maintained separately from total stock.
8. Inventory operations must not silently modify stock without an auditable record.

## 13. Document Statuses

The product brief defines these statuses:
- Draft
- Waiting
- Ready
- Done
- Canceled

Any workflow change or new status requires an explicit scope decision.

## 14. End-to-End Example

1. Receive 100 kg of steel → stock +100.
2. Transfer steel from Main Store → Production Rack → total stock unchanged; location changes.
3. Deliver 20 kg → stock for the relevant inventory decreases by 20.
4. Record 3 kg damaged → stock decreases by 3.
5. All events remain visible in the stock ledger.

## 15. MVP Acceptance Criteria

A release is functionally complete only when a user can:

- Register/login.
- Reset a password using OTP.
- Create/update products.
- Configure warehouses/locations.
- Receive stock and see inventory increase after validation.
- Deliver stock and see inventory decrease after validation.
- Transfer stock between locations while preserving total stock.
- Perform an inventory adjustment using a physical count.
- View the resulting movement history/stock ledger.
- View dashboard KPIs.
- Filter operations by required dimensions.
- See low-stock/out-of-stock information.

## 16. Change Control

This document is the product-scope baseline.

When a future prompt proposes a new feature, classify it as:
- **Existing requirement:** implement without changing this PRD.
- **Implementation detail:** may change without changing product scope.
- **Scope change:** update this PRD before coding.

Do not silently introduce new product requirements while coding.
