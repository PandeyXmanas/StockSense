// Realistic initial mock dataset for StockSense Inventory Management System

export const INITIAL_WAREHOUSES = [
  {
    id: 'wh-1',
    name: 'Main Central Warehouse',
    code: 'WH-MAIN',
    address: '100 Logistics Blvd, Zone A',
    locationsCount: 3,
    totalItems: 480
  },
  {
    id: 'wh-2',
    name: 'North Distribution Center',
    code: 'WH-NORTH',
    address: '45 Industrial Park, Sector 4',
    locationsCount: 2,
    totalItems: 125
  }
];

export const INITIAL_LOCATIONS = [
  { id: 'loc-1', warehouseId: 'wh-1', warehouseName: 'Main Central Warehouse', name: 'Main Store', code: 'LOC-MAIN-01' },
  { id: 'loc-2', warehouseId: 'wh-1', warehouseName: 'Main Central Warehouse', name: 'Rack A', code: 'LOC-RACK-A' },
  { id: 'loc-3', warehouseId: 'wh-1', warehouseName: 'Main Central Warehouse', name: 'Rack B', code: 'LOC-RACK-B' },
  { id: 'loc-4', warehouseId: 'wh-1', warehouseName: 'Main Central Warehouse', name: 'Production Floor', code: 'LOC-PROD-01' },
  { id: 'loc-5', warehouseId: 'wh-2', warehouseName: 'North Distribution Center', name: 'Receiving Bay North', code: 'LOC-NORTH-RCV' },
  { id: 'loc-6', warehouseId: 'wh-2', warehouseName: 'North Distribution Center', name: 'Storage Bay 1', code: 'LOC-NORTH-SB1' }
];

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Raw Materials', description: 'Metals, plastics, and structural raw stock' },
  { id: 'cat-2', name: 'Hardware', description: 'Fasteners, bolts, screws, and structural fittings' },
  { id: 'cat-3', name: 'Furniture', description: 'Office desks, chairs, and storage units' },
  { id: 'cat-4', name: 'Office Supplies', description: 'Consumables and office stationery' }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Steel Rods 10mm',
    sku: 'STL-10MM',
    categoryId: 'cat-1',
    categoryName: 'Raw Materials',
    unitOfMeasure: 'kg',
    minReorderLevel: 100,
    totalStock: 350,
    stockByLocation: [
      { locationId: 'loc-1', locationName: 'Main Store', locationCode: 'LOC-MAIN-01', quantity: 200 },
      { locationId: 'loc-2', locationName: 'Rack A', locationCode: 'LOC-RACK-A', quantity: 150 }
    ],
    createdAt: '2026-08-15T09:30:00Z',
    updatedAt: '2026-09-24T14:20:00Z'
  },
  {
    id: 'prod-2',
    name: 'Aluminum Sheets 2mm',
    sku: 'ALM-2MM',
    categoryId: 'cat-1',
    categoryName: 'Raw Materials',
    unitOfMeasure: 'sheet',
    minReorderLevel: 40,
    totalStock: 35, // Low stock warning!
    stockByLocation: [
      { locationId: 'loc-1', locationName: 'Main Store', locationCode: 'LOC-MAIN-01', quantity: 20 },
      { locationId: 'loc-6', locationName: 'Storage Bay 1', locationCode: 'LOC-NORTH-SB1', quantity: 15 }
    ],
    createdAt: '2026-08-18T11:00:00Z',
    updatedAt: '2026-09-25T10:15:00Z'
  },
  {
    id: 'prod-3',
    name: 'M8 Hex Bolts (100 pk)',
    sku: 'BLT-M8-100',
    categoryId: 'cat-2',
    categoryName: 'Hardware',
    unitOfMeasure: 'box',
    minReorderLevel: 25,
    totalStock: 85,
    stockByLocation: [
      { locationId: 'loc-2', locationName: 'Rack A', locationCode: 'LOC-RACK-A', quantity: 50 },
      { locationId: 'loc-3', locationName: 'Rack B', locationCode: 'LOC-RACK-B', quantity: 35 }
    ],
    createdAt: '2026-08-20T14:45:00Z',
    updatedAt: '2026-09-22T08:30:00Z'
  },
  {
    id: 'prod-4',
    name: 'Ergonomic Office Chair',
    sku: 'CHR-ERG-01',
    categoryId: 'cat-3',
    categoryName: 'Furniture',
    unitOfMeasure: 'pcs',
    minReorderLevel: 10,
    totalStock: 4, // Low stock!
    stockByLocation: [
      { locationId: 'loc-1', locationName: 'Main Store', locationCode: 'LOC-MAIN-01', quantity: 4 }
    ],
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-26T09:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Industrial Heavy Desk',
    sku: 'DSK-WD-02',
    categoryId: 'cat-3',
    categoryName: 'Furniture',
    unitOfMeasure: 'pcs',
    minReorderLevel: 5,
    totalStock: 0, // Out of stock!
    stockByLocation: [],
    createdAt: '2026-09-05T16:20:00Z',
    updatedAt: '2026-09-26T11:00:00Z'
  }
];

export const INITIAL_RECEIPTS = [
  {
    id: 'rec-1',
    referenceNumber: 'REC-2026-001',
    supplierName: 'Apex Metal Supplies Ltd',
    status: 'Done',
    createdBy: 'Inventory Manager',
    destinationLocationId: 'loc-1',
    destinationLocationName: 'Main Store (WH-MAIN)',
    createdAt: '2026-09-20T10:00:00Z',
    validatedAt: '2026-09-20T11:30:00Z',
    items: [
      { id: 'ri-1', productId: 'prod-1', productName: 'Steel Rods 10mm', sku: 'STL-10MM', quantity: 100, unitOfMeasure: 'kg' },
      { id: 'ri-2', productId: 'prod-2', productName: 'Aluminum Sheets 2mm', sku: 'ALM-2MM', quantity: 20, unitOfMeasure: 'sheet' }
    ]
  },
  {
    id: 'rec-2',
    referenceNumber: 'REC-2026-002',
    supplierName: 'Fastener Direct Inc',
    status: 'Ready',
    createdBy: 'Warehouse Staff',
    destinationLocationId: 'loc-2',
    destinationLocationName: 'Rack A (WH-MAIN)',
    createdAt: '2026-09-25T14:10:00Z',
    validatedAt: null,
    items: [
      { id: 'ri-3', productId: 'prod-3', productName: 'M8 Hex Bolts (100 pk)', sku: 'BLT-M8-100', quantity: 40, unitOfMeasure: 'box' }
    ]
  },
  {
    id: 'rec-3',
    referenceNumber: 'REC-2026-003',
    supplierName: 'Global Furniture Co',
    status: 'Draft',
    createdBy: 'Inventory Manager',
    destinationLocationId: 'loc-1',
    destinationLocationName: 'Main Store (WH-MAIN)',
    createdAt: '2026-09-26T08:00:00Z',
    validatedAt: null,
    items: [
      { id: 'ri-4', productId: 'prod-4', productName: 'Ergonomic Office Chair', sku: 'CHR-ERG-01', quantity: 15, unitOfMeasure: 'pcs' },
      { id: 'ri-5', productId: 'prod-5', productName: 'Industrial Heavy Desk', sku: 'DSK-WD-02', quantity: 8, unitOfMeasure: 'pcs' }
    ]
  }
];

export const INITIAL_DELIVERIES = [
  {
    id: 'del-1',
    referenceNumber: 'DEL-2026-001',
    recipientName: 'BuildCorp Construction',
    status: 'Done',
    createdBy: 'Warehouse Staff',
    sourceLocationId: 'loc-1',
    sourceLocationName: 'Main Store (WH-MAIN)',
    createdAt: '2026-09-22T09:15:00Z',
    validatedAt: '2026-09-22T15:00:00Z',
    items: [
      { id: 'di-1', productId: 'prod-1', productName: 'Steel Rods 10mm', sku: 'STL-10MM', quantity: 50, unitOfMeasure: 'kg' }
    ]
  },
  {
    id: 'del-2',
    referenceNumber: 'DEL-2026-002',
    recipientName: 'Metro Tech Hub LLC',
    status: 'Waiting',
    createdBy: 'Inventory Manager',
    sourceLocationId: 'loc-1',
    sourceLocationName: 'Main Store (WH-MAIN)',
    createdAt: '2026-09-25T16:45:00Z',
    validatedAt: null,
    items: [
      { id: 'di-2', productId: 'prod-4', productName: 'Ergonomic Office Chair', sku: 'CHR-ERG-01', quantity: 2, unitOfMeasure: 'pcs' }
    ]
  }
];

export const INITIAL_TRANSFERS = [
  {
    id: 'trn-1',
    referenceNumber: 'TRN-2026-001',
    fromLocationId: 'loc-1',
    fromLocationName: 'Main Store (WH-MAIN)',
    toLocationId: 'loc-4',
    toLocationName: 'Production Floor (WH-MAIN)',
    status: 'Done',
    createdBy: 'Warehouse Staff',
    createdAt: '2026-09-23T11:00:00Z',
    validatedAt: '2026-09-23T11:45:00Z',
    items: [
      { id: 'ti-1', productId: 'prod-1', productName: 'Steel Rods 10mm', sku: 'STL-10MM', quantity: 30, unitOfMeasure: 'kg' }
    ]
  },
  {
    id: 'trn-2',
    referenceNumber: 'TRN-2026-002',
    fromLocationId: 'loc-2',
    fromLocationName: 'Rack A (WH-MAIN)',
    toLocationId: 'loc-6',
    toLocationName: 'Storage Bay 1 (WH-NORTH)',
    status: 'Ready',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-26T09:30:00Z',
    validatedAt: null,
    items: [
      { id: 'ti-2', productId: 'prod-3', productName: 'M8 Hex Bolts (100 pk)', sku: 'BLT-M8-100', quantity: 10, unitOfMeasure: 'box' }
    ]
  }
];

export const INITIAL_ADJUSTMENTS = [
  {
    id: 'adj-1',
    referenceNumber: 'ADJ-2026-001',
    locationId: 'loc-1',
    locationName: 'Main Store (WH-MAIN)',
    status: 'Done',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-24T16:00:00Z',
    validatedAt: '2026-09-24T16:05:00Z',
    reason: 'Quarterly Physical Count Audit',
    items: [
      { id: 'ai-1', productId: 'prod-2', productName: 'Aluminum Sheets 2mm', sku: 'ALM-2MM', previousQuantity: 23, countedQuantity: 20, deltaQuantity: -3, unitOfMeasure: 'sheet' }
    ]
  }
];

export const INITIAL_LEDGER = [
  {
    id: 'ledg-1',
    productId: 'prod-1',
    productName: 'Steel Rods 10mm',
    sku: 'STL-10MM',
    locationId: 'loc-1',
    locationName: 'Main Store',
    movementType: 'RECEIPT',
    quantityDelta: 100,
    referenceType: 'RECEIPT',
    referenceId: 'rec-1',
    referenceNumber: 'REC-2026-001',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-20T11:30:00Z'
  },
  {
    id: 'ledg-2',
    productId: 'prod-2',
    productName: 'Aluminum Sheets 2mm',
    sku: 'ALM-2MM',
    locationId: 'loc-1',
    locationName: 'Main Store',
    movementType: 'RECEIPT',
    quantityDelta: 20,
    referenceType: 'RECEIPT',
    referenceId: 'rec-1',
    referenceNumber: 'REC-2026-001',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-20T11:30:00Z'
  },
  {
    id: 'ledg-3',
    productId: 'prod-1',
    productName: 'Steel Rods 10mm',
    sku: 'STL-10MM',
    locationId: 'loc-1',
    locationName: 'Main Store',
    movementType: 'DELIVERY',
    quantityDelta: -50,
    referenceType: 'DELIVERY',
    referenceId: 'del-1',
    referenceNumber: 'DEL-2026-001',
    createdBy: 'Warehouse Staff',
    createdAt: '2026-09-22T15:00:00Z'
  },
  {
    id: 'ledg-4',
    productId: 'prod-1',
    productName: 'Steel Rods 10mm',
    sku: 'STL-10MM',
    locationId: 'loc-1',
    locationName: 'Main Store',
    movementType: 'TRANSFER_OUT',
    quantityDelta: -30,
    referenceType: 'TRANSFER',
    referenceId: 'trn-1',
    referenceNumber: 'TRN-2026-001',
    createdBy: 'Warehouse Staff',
    createdAt: '2026-09-23T11:45:00Z'
  },
  {
    id: 'ledg-5',
    productId: 'prod-1',
    productName: 'Steel Rods 10mm',
    sku: 'STL-10MM',
    locationId: 'loc-4',
    locationName: 'Production Floor',
    movementType: 'TRANSFER_IN',
    quantityDelta: 30,
    referenceType: 'TRANSFER',
    referenceId: 'trn-1',
    referenceNumber: 'TRN-2026-001',
    createdBy: 'Warehouse Staff',
    createdAt: '2026-09-23T11:45:00Z'
  },
  {
    id: 'ledg-6',
    productId: 'prod-2',
    productName: 'Aluminum Sheets 2mm',
    sku: 'ALM-2MM',
    locationId: 'loc-1',
    locationName: 'Main Store',
    movementType: 'ADJUSTMENT',
    quantityDelta: -3,
    referenceType: 'ADJUSTMENT',
    referenceId: 'adj-1',
    referenceNumber: 'ADJ-2026-001',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-24T16:05:00Z'
  }
];
