// Realistic initial mock dataset for StockSense Inventory Management System
// Demo data intentionally tuned for an Indian manufacturing and distribution setup.

export const INITIAL_WAREHOUSES = [
  {
    id: 'wh-1',
    name: 'Mumbai Central Warehouse',
    code: 'WH-MUM-CEN',
    address: 'Plot 18, MIDC Andheri East, Mumbai, Maharashtra',
    locationsCount: 4,
    totalItems: 680
  },
  {
    id: 'wh-2',
    name: 'Pune Distribution Centre',
    code: 'WH-PUN-DC',
    address: 'Ranjangaon Industrial Area, Pune, Maharashtra',
    locationsCount: 3,
    totalItems: 240
  },
  {
    id: 'wh-3',
    name: 'Bengaluru Regional Store',
    code: 'WH-BLR-RG',
    address: 'Hoskote Industrial Layout, Bengaluru, Karnataka',
    locationsCount: 2,
    totalItems: 180
  }
];

export const INITIAL_LOCATIONS = [
  { id: 'loc-1', warehouseId: 'wh-1', warehouseName: 'Mumbai Central Warehouse', name: 'Main Store', code: 'LOC-MUM-01' },
  { id: 'loc-2', warehouseId: 'wh-1', warehouseName: 'Mumbai Central Warehouse', name: 'Rack A', code: 'LOC-MUM-A' },
  { id: 'loc-3', warehouseId: 'wh-1', warehouseName: 'Mumbai Central Warehouse', name: 'Rack B', code: 'LOC-MUM-B' },
  { id: 'loc-4', warehouseId: 'wh-1', warehouseName: 'Mumbai Central Warehouse', name: 'Production Floor', code: 'LOC-MUM-PROD' },
  { id: 'loc-5', warehouseId: 'wh-2', warehouseName: 'Pune Distribution Centre', name: 'Receiving Bay', code: 'LOC-PUN-RCV' },
  { id: 'loc-6', warehouseId: 'wh-2', warehouseName: 'Pune Distribution Centre', name: 'Storage Bay 1', code: 'LOC-PUN-SB1' },
  { id: 'loc-7', warehouseId: 'wh-3', warehouseName: 'Bengaluru Regional Store', name: 'Regional Rack', code: 'LOC-BLR-REG' }
];

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Industrial Metals', description: 'Steel, aluminium sections, and structural raw material' },
  { id: 'cat-2', name: 'Fasteners & Hardware', description: 'Bolts, nuts, washers, clamps, and fixing hardware' },
  { id: 'cat-3', name: 'Electrical', description: 'Cable, conduit, panel accessories, and wiring essentials' },
  { id: 'cat-4', name: 'Packaging', description: 'Boxes, wrap films, tapes, and dispatch materials' },
  { id: 'cat-5', name: 'Office & Workstation', description: 'Office furniture, seating, and support equipment' },
  { id: 'cat-6', name: 'Safety & Maintenance', description: 'Safety gear, consumables, and workshop maintenance items' }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'TMT Steel Rod 12mm',
    sku: 'TMT-12MM',
    categoryId: 'cat-1',
    categoryName: 'Industrial Metals',
    unitOfMeasure: 'kg',
    minReorderLevel: 120,
    totalStock: 420,
    stockByLocation: [
      { locationId: 'loc-1', locationName: 'Main Store', locationCode: 'LOC-MUM-01', quantity: 220 },
      { locationId: 'loc-2', locationName: 'Rack A', locationCode: 'LOC-MUM-A', quantity: 200 }
    ],
    createdAt: '2026-08-15T09:30:00Z',
    updatedAt: '2026-09-24T14:20:00Z'
  },
  {
    id: 'prod-2',
    name: 'Cement Bag 50kg',
    sku: 'CEM-50KG',
    categoryId: 'cat-1',
    categoryName: 'Industrial Metals',
    unitOfMeasure: 'bag',
    minReorderLevel: 80,
    totalStock: 65,
    stockByLocation: [
      { locationId: 'loc-5', locationName: 'Receiving Bay', locationCode: 'LOC-PUN-RCV', quantity: 35 },
      { locationId: 'loc-6', locationName: 'Storage Bay 1', locationCode: 'LOC-PUN-SB1', quantity: 30 }
    ],
    createdAt: '2026-08-18T11:00:00Z',
    updatedAt: '2026-09-25T10:15:00Z'
  },
  {
    id: 'prod-3',
    name: 'M12 Hex Bolt Pack',
    sku: 'BOLT-M12-BOX',
    categoryId: 'cat-2',
    categoryName: 'Fasteners & Hardware',
    unitOfMeasure: 'box',
    minReorderLevel: 30,
    totalStock: 90,
    stockByLocation: [
      { locationId: 'loc-2', locationName: 'Rack A', locationCode: 'LOC-MUM-A', quantity: 42 },
      { locationId: 'loc-3', locationName: 'Rack B', locationCode: 'LOC-MUM-B', quantity: 48 }
    ],
    createdAt: '2026-08-20T14:45:00Z',
    updatedAt: '2026-09-22T08:30:00Z'
  },
  {
    id: 'prod-4',
    name: 'PVC Pressure Pipe 2 inch',
    sku: 'PVC-2IN',
    categoryId: 'cat-3',
    categoryName: 'Electrical',
    unitOfMeasure: 'piece',
    minReorderLevel: 18,
    totalStock: 12,
    stockByLocation: [
      { locationId: 'loc-1', locationName: 'Main Store', locationCode: 'LOC-MUM-01', quantity: 12 }
    ],
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-26T09:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Industrial Office Chair',
    sku: 'OFF-CHAIR-01',
    categoryId: 'cat-5',
    categoryName: 'Office & Workstation',
    unitOfMeasure: 'pcs',
    minReorderLevel: 7,
    totalStock: 5,
    stockByLocation: [
      { locationId: 'loc-7', locationName: 'Regional Rack', locationCode: 'LOC-BLR-REG', quantity: 5 }
    ],
    createdAt: '2026-09-05T16:20:00Z',
    updatedAt: '2026-09-26T11:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'A4 Copier Paper Ream',
    sku: 'PPR-A4-500',
    categoryId: 'cat-4',
    categoryName: 'Packaging',
    unitOfMeasure: 'ream',
    minReorderLevel: 25,
    totalStock: 120,
    stockByLocation: [
      { locationId: 'loc-5', locationName: 'Receiving Bay', locationCode: 'LOC-PUN-RCV', quantity: 60 },
      { locationId: 'loc-7', locationName: 'Regional Rack', locationCode: 'LOC-BLR-REG', quantity: 60 }
    ],
    createdAt: '2026-09-10T13:20:00Z',
    updatedAt: '2026-09-26T12:10:00Z'
  },
  {
    id: 'prod-7',
    name: 'MS Flat Bar 40x5',
    sku: 'MS-FLAT-40X5',
    categoryId: 'cat-1',
    categoryName: 'Industrial Metals',
    unitOfMeasure: 'kg',
    minReorderLevel: 110,
    totalStock: 280,
    stockByLocation: [
      { locationId: 'loc-1', locationName: 'Main Store', locationCode: 'LOC-MUM-01', quantity: 170 },
      { locationId: 'loc-3', locationName: 'Rack B', locationCode: 'LOC-MUM-B', quantity: 110 }
    ],
    createdAt: '2026-08-30T12:15:00Z',
    updatedAt: '2026-09-16T15:10:00Z'
  },
  {
    id: 'prod-8',
    name: 'GI Pipe 1 inch',
    sku: 'GI-PIPE-1IN',
    categoryId: 'cat-3',
    categoryName: 'Electrical',
    unitOfMeasure: 'piece',
    minReorderLevel: 22,
    totalStock: 18,
    stockByLocation: [
      { locationId: 'loc-5', locationName: 'Receiving Bay', locationCode: 'LOC-PUN-RCV', quantity: 10 },
      { locationId: 'loc-6', locationName: 'Storage Bay 1', locationCode: 'LOC-PUN-SB1', quantity: 8 }
    ],
    createdAt: '2026-09-02T14:40:00Z',
    updatedAt: '2026-09-26T10:50:00Z'
  },
  {
    id: 'prod-9',
    name: 'Copper Cable 4 sq mm',
    sku: 'CU-CABLE-4SQ',
    categoryId: 'cat-3',
    categoryName: 'Electrical',
    unitOfMeasure: 'm',
    minReorderLevel: 180,
    totalStock: 330,
    stockByLocation: [
      { locationId: 'loc-4', locationName: 'Production Floor', locationCode: 'LOC-MUM-PROD', quantity: 120 },
      { locationId: 'loc-7', locationName: 'Regional Rack', locationCode: 'LOC-BLR-REG', quantity: 210 }
    ],
    createdAt: '2026-08-27T08:10:00Z',
    updatedAt: '2026-09-23T12:05:00Z'
  },
  {
    id: 'prod-10',
    name: 'Industrial Safety Gloves',
    sku: 'SAFE-GLOVE-M',
    categoryId: 'cat-6',
    categoryName: 'Safety & Maintenance',
    unitOfMeasure: 'pair',
    minReorderLevel: 40,
    totalStock: 90,
    stockByLocation: [
      { locationId: 'loc-3', locationName: 'Rack B', locationCode: 'LOC-MUM-B', quantity: 48 },
      { locationId: 'loc-5', locationName: 'Receiving Bay', locationCode: 'LOC-PUN-RCV', quantity: 42 }
    ],
    createdAt: '2026-09-08T09:20:00Z',
    updatedAt: '2026-09-25T18:40:00Z'
  },
  {
    id: 'prod-11',
    name: 'Nylon Strapping Roll',
    sku: 'NYLON-STRAP-50',
    categoryId: 'cat-4',
    categoryName: 'Packaging',
    unitOfMeasure: 'roll',
    minReorderLevel: 25,
    totalStock: 52,
    stockByLocation: [
      { locationId: 'loc-1', locationName: 'Main Store', locationCode: 'LOC-MUM-01', quantity: 32 },
      { locationId: 'loc-7', locationName: 'Regional Rack', locationCode: 'LOC-BLR-REG', quantity: 20 }
    ],
    createdAt: '2026-09-11T10:55:00Z',
    updatedAt: '2026-09-26T07:40:00Z'
  },
  {
    id: 'prod-12',
    name: 'Forklift Battery 12V',
    sku: 'FORK-BATT-12V',
    categoryId: 'cat-6',
    categoryName: 'Safety & Maintenance',
    unitOfMeasure: 'unit',
    minReorderLevel: 5,
    totalStock: 4,
    stockByLocation: [
      { locationId: 'loc-2', locationName: 'Rack A', locationCode: 'LOC-MUM-A', quantity: 4 }
    ],
    createdAt: '2026-08-19T15:30:00Z',
    updatedAt: '2026-09-21T14:20:00Z'
  }
];

export const INITIAL_RECEIPTS = [
  {
    id: 'rec-1',
    referenceNumber: 'REC-2026-001',
    supplierName: 'Bharat Steel Traders',
    status: 'Done',
    createdBy: 'Inventory Manager',
    destinationLocationId: 'loc-1',
    destinationLocationName: 'Main Store (WH-MUM-CEN)',
    createdAt: '2026-09-20T10:00:00Z',
    validatedAt: '2026-09-20T11:30:00Z',
    items: [
      { id: 'ri-1', productId: 'prod-1', productName: 'TMT Steel Rod 12mm', sku: 'TMT-12MM', quantity: 150, unitOfMeasure: 'kg' },
      { id: 'ri-2', productId: 'prod-3', productName: 'M12 Hex Bolt Pack', sku: 'BOLT-M12-BOX', quantity: 25, unitOfMeasure: 'box' }
    ]
  },
  {
    id: 'rec-2',
    referenceNumber: 'REC-2026-002',
    supplierName: 'Vijay Cement Supply Co',
    status: 'Ready',
    createdBy: 'Warehouse Staff',
    destinationLocationId: 'loc-5',
    destinationLocationName: 'Receiving Bay (WH-PUN-DC)',
    createdAt: '2026-09-25T14:10:00Z',
    validatedAt: null,
    items: [
      { id: 'ri-3', productId: 'prod-2', productName: 'Cement Bag 50kg', sku: 'CEM-50KG', quantity: 40, unitOfMeasure: 'bag' }
    ]
  },
  {
    id: 'rec-3',
    referenceNumber: 'REC-2026-003',
    supplierName: 'Shree Office Equipments',
    status: 'Draft',
    createdBy: 'Inventory Manager',
    destinationLocationId: 'loc-7',
    destinationLocationName: 'Regional Rack (WH-BLR-RG)',
    createdAt: '2026-09-26T08:00:00Z',
    validatedAt: null,
    items: [
      { id: 'ri-4', productId: 'prod-5', productName: 'Industrial Office Chair', sku: 'OFF-CHAIR-01', quantity: 12, unitOfMeasure: 'pcs' },
      { id: 'ri-5', productId: 'prod-6', productName: 'A4 Copier Paper Ream', sku: 'PPR-A4-500', quantity: 30, unitOfMeasure: 'ream' }
    ]
  },
  {
    id: 'rec-4',
    referenceNumber: 'REC-2026-004',
    supplierName: 'Nirmal Pipe House',
    status: 'Done',
    createdBy: 'Warehouse Staff',
    destinationLocationId: 'loc-5',
    destinationLocationName: 'Receiving Bay (WH-PUN-DC)',
    createdAt: '2026-09-18T09:45:00Z',
    validatedAt: '2026-09-18T10:25:00Z',
    items: [
      { id: 'ri-6', productId: 'prod-8', productName: 'GI Pipe 1 inch', sku: 'GI-PIPE-1IN', quantity: 28, unitOfMeasure: 'piece' },
      { id: 'ri-7', productId: 'prod-10', productName: 'Industrial Safety Gloves', sku: 'SAFE-GLOVE-M', quantity: 60, unitOfMeasure: 'pair' }
    ]
  },
  {
    id: 'rec-5',
    referenceNumber: 'REC-2026-005',
    supplierName: 'Maharashtra Cables Ltd',
    status: 'Ready',
    createdBy: 'Inventory Manager',
    destinationLocationId: 'loc-4',
    destinationLocationName: 'Production Floor (WH-MUM-CEN)',
    createdAt: '2026-09-24T13:20:00Z',
    validatedAt: null,
    items: [
      { id: 'ri-8', productId: 'prod-9', productName: 'Copper Cable 4 sq mm', sku: 'CU-CABLE-4SQ', quantity: 180, unitOfMeasure: 'm' }
    ]
  }
];

export const INITIAL_DELIVERIES = [
  {
    id: 'del-1',
    referenceNumber: 'DEL-2026-001',
    recipientName: 'Arihant Infra Projects',
    status: 'Done',
    createdBy: 'Warehouse Staff',
    sourceLocationId: 'loc-1',
    sourceLocationName: 'Main Store (WH-MUM-CEN)',
    createdAt: '2026-09-22T09:15:00Z',
    validatedAt: '2026-09-22T15:00:00Z',
    items: [
      { id: 'di-1', productId: 'prod-1', productName: 'TMT Steel Rod 12mm', sku: 'TMT-12MM', quantity: 60, unitOfMeasure: 'kg' }
    ]
  },
  {
    id: 'del-2',
    referenceNumber: 'DEL-2026-002',
    recipientName: 'Navajivan Sales Office',
    status: 'Waiting',
    createdBy: 'Inventory Manager',
    sourceLocationId: 'loc-7',
    sourceLocationName: 'Regional Rack (WH-BLR-RG)',
    createdAt: '2026-09-25T16:45:00Z',
    validatedAt: null,
    items: [
      { id: 'di-2', productId: 'prod-5', productName: 'Industrial Office Chair', sku: 'OFF-CHAIR-01', quantity: 2, unitOfMeasure: 'pcs' }
    ]
  },
  {
    id: 'del-3',
    referenceNumber: 'DEL-2026-003',
    recipientName: 'Sahyadri Fabrication Works',
    status: 'Done',
    createdBy: 'Warehouse Staff',
    sourceLocationId: 'loc-3',
    sourceLocationName: 'Rack B (WH-MUM-CEN)',
    createdAt: '2026-09-19T12:30:00Z',
    validatedAt: '2026-09-19T13:10:00Z',
    items: [
      { id: 'di-3', productId: 'prod-7', productName: 'MS Flat Bar 40x5', sku: 'MS-FLAT-40X5', quantity: 80, unitOfMeasure: 'kg' },
      { id: 'di-4', productId: 'prod-3', productName: 'M12 Hex Bolt Pack', sku: 'BOLT-M12-BOX', quantity: 18, unitOfMeasure: 'box' }
    ]
  },
  {
    id: 'del-4',
    referenceNumber: 'DEL-2026-004',
    recipientName: 'Metro Electrical Solutions',
    status: 'Ready',
    createdBy: 'Inventory Manager',
    sourceLocationId: 'loc-4',
    sourceLocationName: 'Production Floor (WH-MUM-CEN)',
    createdAt: '2026-09-26T08:50:00Z',
    validatedAt: null,
    items: [
      { id: 'di-5', productId: 'prod-9', productName: 'Copper Cable 4 sq mm', sku: 'CU-CABLE-4SQ', quantity: 60, unitOfMeasure: 'm' }
    ]
  }
];

export const INITIAL_TRANSFERS = [
  {
    id: 'trn-1',
    referenceNumber: 'TRN-2026-001',
    fromLocationId: 'loc-1',
    fromLocationName: 'Main Store (WH-MUM-CEN)',
    toLocationId: 'loc-4',
    toLocationName: 'Production Floor (WH-MUM-CEN)',
    status: 'Done',
    createdBy: 'Warehouse Staff',
    createdAt: '2026-09-23T11:00:00Z',
    validatedAt: '2026-09-23T11:45:00Z',
    items: [
      { id: 'ti-1', productId: 'prod-1', productName: 'TMT Steel Rod 12mm', sku: 'TMT-12MM', quantity: 30, unitOfMeasure: 'kg' }
    ]
  },
  {
    id: 'trn-2',
    referenceNumber: 'TRN-2026-002',
    fromLocationId: 'loc-2',
    fromLocationName: 'Rack A (WH-MUM-CEN)',
    toLocationId: 'loc-6',
    toLocationName: 'Storage Bay 1 (WH-PUN-DC)',
    status: 'Ready',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-26T09:30:00Z',
    validatedAt: null,
    items: [
      { id: 'ti-2', productId: 'prod-3', productName: 'M12 Hex Bolt Pack', sku: 'BOLT-M12-BOX', quantity: 10, unitOfMeasure: 'box' }
    ]
  },
  {
    id: 'trn-3',
    referenceNumber: 'TRN-2026-003',
    fromLocationId: 'loc-5',
    fromLocationName: 'Receiving Bay (WH-PUN-DC)',
    toLocationId: 'loc-6',
    toLocationName: 'Storage Bay 1 (WH-PUN-DC)',
    status: 'Done',
    createdBy: 'Warehouse Staff',
    createdAt: '2026-09-21T14:15:00Z',
    validatedAt: '2026-09-21T15:05:00Z',
    items: [
      { id: 'ti-3', productId: 'prod-8', productName: 'GI Pipe 1 inch', sku: 'GI-PIPE-1IN', quantity: 12, unitOfMeasure: 'piece' }
    ]
  }
];

export const INITIAL_ADJUSTMENTS = [
  {
    id: 'adj-1',
    referenceNumber: 'ADJ-2026-001',
    locationId: 'loc-1',
    locationName: 'Main Store (WH-MUM-CEN)',
    status: 'Done',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-24T16:00:00Z',
    validatedAt: '2026-09-24T16:05:00Z',
    reason: 'Monthly physical verification of incoming stock',
    items: [
      { id: 'ai-1', productId: 'prod-2', productName: 'Cement Bag 50kg', sku: 'CEM-50KG', previousQuantity: 70, countedQuantity: 65, deltaQuantity: -5, unitOfMeasure: 'bag' }
    ]
  },
  {
    id: 'adj-2',
    referenceNumber: 'ADJ-2026-002',
    locationId: 'loc-7',
    locationName: 'Regional Rack (WH-BLR-RG)',
    status: 'Done',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-23T11:20:00Z',
    validatedAt: '2026-09-23T11:35:00Z',
    reason: 'Variance after dispatch review',
    items: [
      { id: 'ai-2', productId: 'prod-11', productName: 'Nylon Strapping Roll', sku: 'NYLON-STRAP-50', previousQuantity: 38, countedQuantity: 32, deltaQuantity: -6, unitOfMeasure: 'roll' }
    ]
  }
];

export const INITIAL_LEDGER = [
  {
    id: 'ledg-1',
    productId: 'prod-1',
    productName: 'TMT Steel Rod 12mm',
    sku: 'TMT-12MM',
    locationId: 'loc-1',
    locationName: 'Main Store',
    movementType: 'RECEIPT',
    quantityDelta: 150,
    referenceType: 'RECEIPT',
    referenceId: 'rec-1',
    referenceNumber: 'REC-2026-001',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-20T11:30:00Z'
  },
  {
    id: 'ledg-2',
    productId: 'prod-1',
    productName: 'TMT Steel Rod 12mm',
    sku: 'TMT-12MM',
    locationId: 'loc-1',
    locationName: 'Main Store',
    movementType: 'DELIVERY',
    quantityDelta: -60,
    referenceType: 'DELIVERY',
    referenceId: 'del-1',
    referenceNumber: 'DEL-2026-001',
    createdBy: 'Warehouse Staff',
    createdAt: '2026-09-22T15:00:00Z'
  },
  {
    id: 'ledg-3',
    productId: 'prod-1',
    productName: 'TMT Steel Rod 12mm',
    sku: 'TMT-12MM',
    locationId: 'loc-4',
    locationName: 'Production Floor',
    movementType: 'TRANSFER',
    quantityDelta: 30,
    referenceType: 'TRANSFER',
    referenceId: 'trn-1',
    referenceNumber: 'TRN-2026-001',
    createdBy: 'Warehouse Staff',
    createdAt: '2026-09-23T11:45:00Z'
  },
  {
    id: 'ledg-4',
    productId: 'prod-2',
    productName: 'Cement Bag 50kg',
    sku: 'CEM-50KG',
    locationId: 'loc-5',
    locationName: 'Receiving Bay',
    movementType: 'ADJUSTMENT',
    quantityDelta: -5,
    referenceType: 'ADJUSTMENT',
    referenceId: 'adj-1',
    referenceNumber: 'ADJ-2026-001',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-24T16:05:00Z'
  },
  {
    id: 'ledg-5',
    productId: 'prod-5',
    productName: 'Industrial Office Chair',
    sku: 'OFF-CHAIR-01',
    locationId: 'loc-7',
    locationName: 'Regional Rack',
    movementType: 'RECEIPT',
    quantityDelta: 12,
    referenceType: 'RECEIPT',
    referenceId: 'rec-3',
    referenceNumber: 'REC-2026-003',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-26T08:15:00Z'
  },
  {
    id: 'ledg-6',
    productId: 'prod-8',
    productName: 'GI Pipe 1 inch',
    sku: 'GI-PIPE-1IN',
    locationId: 'loc-5',
    locationName: 'Receiving Bay',
    movementType: 'RECEIPT',
    quantityDelta: 28,
    referenceType: 'RECEIPT',
    referenceId: 'rec-4',
    referenceNumber: 'REC-2026-004',
    createdBy: 'Warehouse Staff',
    createdAt: '2026-09-18T10:25:00Z'
  },
  {
    id: 'ledg-7',
    productId: 'prod-9',
    productName: 'Copper Cable 4 sq mm',
    sku: 'CU-CABLE-4SQ',
    locationId: 'loc-4',
    locationName: 'Production Floor',
    movementType: 'DELIVERY',
    quantityDelta: -60,
    referenceType: 'DELIVERY',
    referenceId: 'del-4',
    referenceNumber: 'DEL-2026-004',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-26T08:55:00Z'
  },
  {
    id: 'ledg-8',
    productId: 'prod-11',
    productName: 'Nylon Strapping Roll',
    sku: 'NYLON-STRAP-50',
    locationId: 'loc-7',
    locationName: 'Regional Rack',
    movementType: 'ADJUSTMENT',
    quantityDelta: -6,
    referenceType: 'ADJUSTMENT',
    referenceId: 'adj-2',
    referenceNumber: 'ADJ-2026-002',
    createdBy: 'Inventory Manager',
    createdAt: '2026-09-23T11:35:00Z'
  }
];
