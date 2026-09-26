# StockSense — Project Specification Index

This folder contains the four canonical project documents:

1. `PRD.md` — What we are building and what is in/out of scope.
2. `DESIGN_DOC.md` — How the system is architected and how inventory works.
3. `TECH_STACK.md` — Which technologies are used and which choices are locked.
4. `IMPLEMENTATION.md` — How we build, test, review, and change the system.

## Source Priority

When documents appear to conflict:

1. Product behavior/scope → `PRD.md`
2. Architecture/data rules → `DESIGN_DOC.md`
3. Technology choices → `TECH_STACK.md`
4. Build sequencing/process → `IMPLEMENTATION.md`

A genuine conflict should be resolved by updating the appropriate source-of-truth document before coding.

## Project Baseline

StockSense is a centralized Inventory Management System covering products, warehouses/locations, receipts, deliveries, internal transfers, adjustments, dashboard KPIs, alerts, and an auditable stock ledger.

## Do Not Drift

- Do not add unrelated product domains.
- Do not change the selected stack casually.
- Do not move inventory business logic into the frontend.
- Do not update stock without a corresponding auditable movement.
- Do not silently alter statuses or workflows.
- Do not let AI coding sessions make architectural decisions independently of these files.
