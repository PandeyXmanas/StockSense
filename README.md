# StockSense

StockSense is a warehouse and inventory operations dashboard built for managing stock movements, warehouse configuration, product visibility, receipts, deliveries, transfers, and stock adjustments.

This project is designed as a modern inventory management system with a demo-friendly frontend and an extensible backend structure.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL + Sequelize
- UI/UX: Custom dashboard styling with responsive layouts

## Core Features

- Inventory dashboard and KPI overview
- Product catalog and SKU tracking
- Warehouse and location setup
- Goods receipt management
- Delivery order processing
- Internal transfer workflow
- Inventory adjustment tracking
- Low-stock alerts and reorder monitoring
- Demo-ready mock data for videos and presentations

## Repository Structure

```bash
StockSense/
├── backend/
│   ├── src/
│   ├── migrations/
│   ├── models/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── PRD.md
│   ├── DESIGN_DOC.md
│   ├── TECH_STACK.md
│   ├── IMPLEMENTATION.md
│   └── StockSense_PROJECT_SPEC.md
├── README.md
└── .gitignore
```

## Documentation

Please refer to the docs folder for full project context and system design details:

- [docs/PRD.md](docs/PRD.md)
- [docs/DESIGN_DOC.md](docs/DESIGN_DOC.md)
- [docs/TECH_STACK.md](docs/TECH_STACK.md)
- [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md)
- [docs/StockSense_PROJECT_SPEC.md](docs/StockSense_PROJECT_SPEC.md)

## Local Setup

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5174
```

Frontend URL:

```text
http://localhost:5174/
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Demo Mode

The frontend includes realistic mock stock data so the application can be demonstrated even when the backend is not connected to a live database or when the API is unavailable.

## Default Demo User

- Name: MANAS PANDEY
- Role: Inventory Manager

## GitHub

```text
https://github.com/PandeyXmanas/StockSense
```

## Notes

This repository is currently aligned for a polished product demo and presentation workflow, with realistic sample data to showcase the inventory management experience effectively.

