import { Shipment } from '../../types';

export const SEED_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-2026-001',
    trackingNumber: 'TRK-MSC-2026-99120',
    purchaseOrderId: 'PO-2026-001',
    supplierId: 'SUP-ZM-101',
    supplierName: 'Copperbelt Consolidated Mining Ltd',
    buyerId: 'BUY-KR-301',
    buyerName: 'Hansol Advanced Materials Corp',
    batchId: 'BTC-ZM-CU-4401',
    mineral: 'Copper',
    shippedQuantity: 200,
    unit: 'MT',
    originPort: 'Port of Dar es Salaam, Tanzania (ex-Inland Hub)',
    destinationPort: 'Busan Port, South Korea',
    transportMode: 'Multi-Modal Rail/Sea',
    logisticsProvider: 'Bolloré Africa Logistics / Mediterranean Shipping Co',
    vesselOrConsignmentNumber: 'MSC LILIAN v.2608W (IMO 9484936)',
    dispatchDate: '2026-03-18T09:00:00Z',
    estimatedArrivalDate: '2026-04-18',
    status: 'In Transit',
    milestones: [
      {
        id: 'MLS-001-01',
        title: 'Cargo Dispatched from Kitwe Smelter',
        location: 'Kitwe Mining Terminal',
        timestamp: '2026-03-02T08:00:00Z',
        status: 'Completed',
        description: 'Loaded onto 8 bonded road transport flatbeds with tamper-evident cable seals.',
        recordedBy: 'Charles Lungu, Transport Coordinator'
      },
      {
        id: 'MLS-001-02',
        title: 'Nakonde / Tunduma Border Clearance',
        location: 'Border Transit Hub',
        timestamp: '2026-03-06T14:30:00Z',
        status: 'Completed',
        description: 'Single Window Export Clearance processed. Customs seal inspection passed.',
        recordedBy: 'Border Customs Unit'
      },
      {
        id: 'MLS-001-03',
        title: 'Arrival & Container Stuffing at Dar es Salaam',
        location: 'Bolloré CFS, Port of Dar es Salaam',
        timestamp: '2026-03-12T11:00:00Z',
        status: 'Completed',
        description: 'Transferred into 10 x 20ft heavy-duty sea containers with floor bracing.',
        recordedBy: 'Hamisi Bakari, CFS Operations Lead'
      },
      {
        id: 'MLS-001-04',
        title: 'Vessel Loaded & Ocean Transit Commenced',
        location: 'Port of Dar es Salaam, Berth 5',
        timestamp: '2026-03-18T09:00:00Z',
        status: 'Completed',
        description: 'Loaded onto MSC LILIAN v.2608W. Clean On Board Bill of Lading issued.',
        recordedBy: 'MSC Port Agency Tanzania'
      },
      {
        id: 'MLS-001-05',
        title: 'Transit Singapore Transshipment Hub',
        location: 'Port of Singapore',
        timestamp: '2026-04-04T12:00:00Z',
        status: 'Current',
        description: 'Vessel en route across Indian Ocean. Expected bunkering & intermediate clearance.',
        recordedBy: 'MSC Regional Tracking System'
      },
      {
        id: 'MLS-001-06',
        title: 'Discharge & Final Customs at Destination',
        location: 'Busan New Port, South Korea',
        timestamp: '2026-04-18T10:00:00Z',
        status: 'Pending',
        description: 'Vessel arrival, discharge to bonded container yard, buyer joint assay sampling.',
        recordedBy: 'Hansol Receiving Logistics'
      }
    ],
    documentsAttached: ['DOC-2026-BL-MSC-4401.pdf', 'DOC-2026-PL-001.pdf', 'DOC-2026-CO-001.pdf'],
    createdAt: '2026-03-02T08:00:00Z',
    updatedAt: '2026-03-24T12:00:00Z'
  },
  {
    id: 'SHP-2026-002',
    trackingNumber: 'TRK-BLR-2026-44031',
    purchaseOrderId: 'PO-2026-002',
    supplierId: 'SUP-ZM-101',
    supplierName: 'Copperbelt Consolidated Mining Ltd',
    buyerId: 'BUY-KR-302',
    buyerName: 'Daehan Battery Metals Inc',
    batchId: 'BTC-ZM-CO-4403',
    mineral: 'Cobalt',
    shippedQuantity: 60,
    unit: 'MT',
    originPort: 'Ndola Central Bonded Depot',
    destinationPort: 'Incheon Port, South Korea',
    transportMode: 'Multi-Modal Rail/Sea',
    logisticsProvider: 'Bolloré Africa Logistics',
    vesselOrConsignmentNumber: 'RAIL-TAZ-2609 / CMA CGM LA SCALA',
    dispatchDate: '2026-04-05T08:00:00Z',
    estimatedArrivalDate: '2026-05-05',
    status: 'Ready for Dispatch',
    milestones: [
      {
        id: 'MLS-002-01',
        title: 'Packaging & Warehouse Inspection',
        location: 'Ndola Bonded Depot',
        timestamp: '2026-03-20T10:00:00Z',
        status: 'Completed',
        description: '60 FIBC 1-ton bulk bags checked for integrity, humidity sensor seals active.',
        recordedBy: 'Bwalya Kangwa, Depot Superintendent'
      },
      {
        id: 'MLS-002-02',
        title: 'Export Documentation & Customs Inspection',
        location: 'Ndola Customs House',
        timestamp: '2026-03-24T15:00:00Z',
        status: 'Completed',
        description: 'Export declaration approved. Escrow release condition 1 met.',
        recordedBy: 'Customs Officer Mutale'
      },
      {
        id: 'MLS-002-03',
        title: 'Dispatch to TAZARA Railhead',
        location: 'Kapiri Mposhi Terminal',
        timestamp: '2026-04-05T08:00:00Z',
        status: 'Pending',
        description: 'Scheduled rail transport to Dar es Salaam port terminal.',
        recordedBy: 'TAZARA Freight Operations'
      }
    ],
    documentsAttached: ['DOC-2026-COB-INSP.pdf', 'DOC-2026-EXP-4403.pdf'],
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-25T11:00:00Z'
  },
  {
    id: 'SHP-2026-003',
    trackingNumber: 'TRK-SGV-2026-1002',
    purchaseOrderId: 'PO-2026-003',
    supplierId: 'SUP-ZM-106',
    supplierName: 'Serenje Graphite Ventures',
    buyerId: 'BUY-KR-303',
    buyerName: 'Shinhan Anode Materials Ltd',
    batchId: 'BTC-ZM-GP-4406',
    mineral: 'Graphite',
    shippedQuantity: 100,
    unit: 'MT',
    originPort: 'Serenje Rail Siding Transit Hub',
    destinationPort: 'Gwangyang Port, South Korea',
    transportMode: 'Multi-Modal Rail/Sea',
    logisticsProvider: 'Maersk Line / TAZARA',
    vesselOrConsignmentNumber: 'MAERSK SHANGHAI v.2604',
    dispatchDate: '2026-04-02T09:00:00Z',
    estimatedArrivalDate: '2026-05-02',
    status: 'Preparation',
    milestones: [
      {
        id: 'MLS-003-01',
        title: 'Palletizing & Moisture Barrier Verification',
        location: 'Serenje Warehouse',
        timestamp: '2026-03-22T14:00:00Z',
        status: 'Completed',
        description: '100 MT jumbo flake graphite packaged in shrink-wrapped pallets.',
        recordedBy: 'Grace Musonda, SGV Lead'
      },
      {
        id: 'MLS-003-02',
        title: 'Pre-Shipment Assay Verification',
        location: 'Serenje Plant',
        timestamp: '2026-03-24T09:30:00Z',
        status: 'Current',
        description: 'AHK inspector conducting final random lot check before loading.',
        recordedBy: 'AHK Inspector Kalaba'
      }
    ],
    documentsAttached: ['DOC-2026-GP-PL.pdf'],
    createdAt: '2026-03-22T14:00:00Z',
    updatedAt: '2026-03-24T09:30:00Z'
  },
  {
    id: 'SHP-2026-004',
    trackingNumber: 'TRK-HAP-2026-11840',
    purchaseOrderId: 'PO-2026-005',
    supplierId: 'SUP-ZM-109',
    supplierName: 'Southern Base Metals Ltd',
    buyerId: 'BUY-NL-307',
    buyerName: 'EuroMetals BV',
    batchId: 'BTC-ZM-NI-4407',
    mineral: 'Nickel',
    shippedQuantity: 120,
    unit: 'MT',
    originPort: 'Port of Walvis Bay, Namibia',
    destinationPort: 'Rotterdam Port, Netherlands',
    transportMode: 'Ocean Freight',
    logisticsProvider: 'Hapag-Lloyd Africa Express',
    vesselOrConsignmentNumber: 'VALPARAISO EXPRESS v.2602E',
    dispatchDate: '2026-02-01T10:00:00Z',
    estimatedArrivalDate: '2026-03-12',
    actualArrivalDate: '2026-03-14T11:00:00Z',
    status: 'Delivered',
    milestones: [
      {
        id: 'MLS-004-01',
        title: 'Munali Mine Dispatch via Trans-Kalahari Corridor',
        location: 'Munali to Walvis Bay Corridor',
        timestamp: '2026-01-22T08:00:00Z',
        status: 'Completed',
        description: 'Transported by road to Port of Walvis Bay container terminal.',
        recordedBy: 'Trans-Kalahari Logistics'
      },
      {
        id: 'MLS-004-02',
        title: 'Vessel Departure from Walvis Bay',
        location: 'Walvis Bay Port, Namibia',
        timestamp: '2026-02-01T10:00:00Z',
        status: 'Completed',
        description: 'Vessel departure on schedule.',
        recordedBy: 'Hapag-Lloyd Port Agent'
      },
      {
        id: 'MLS-004-03',
        title: 'Discharged & Delivered at Port of Rotterdam',
        location: 'Rotterdam ECT Delta Terminal, Netherlands',
        timestamp: '2026-03-14T11:00:00Z',
        status: 'Completed',
        description: 'Cargo received, weighed, and accepted by EuroMetals. Escrow settled in simulation.',
        recordedBy: 'EuroMetals Inbound Receiving'
      }
    ],
    documentsAttached: ['DOC-2026-ROT-POD.pdf'],
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-03-15T09:00:00Z'
  },
  {
    id: 'SHP-2026-005',
    trackingNumber: 'TRK-MSC-2026-77312',
    purchaseOrderId: 'PO-2026-006',
    supplierId: 'SUP-ZM-103',
    supplierName: 'Luapula Manganese Syndicate',
    buyerId: 'BUY-IN-308',
    buyerName: 'Tata Steel Alloys Ltd',
    batchId: 'BTC-ZM-MN-4405',
    mineral: 'Manganese',
    shippedQuantity: 500,
    unit: 'MT',
    originPort: 'Port of Beira, Mozambique',
    destinationPort: 'Mumbai Port (JNPT), India',
    transportMode: 'Ocean Freight',
    logisticsProvider: 'Ocean Bulk Carriers Ltd',
    vesselOrConsignmentNumber: 'M/V BEIRA EXPLORER',
    dispatchDate: '2026-03-05T09:00:00Z',
    estimatedArrivalDate: '2026-03-28',
    status: 'Delayed',
    isDelayed: true,
    delayReason: 'Cyclone weather alert in Mozambique Channel caused 6-day port anchoring delay.',
    revisedArrivalDate: '2026-04-04',
    milestones: [
      {
        id: 'MLS-005-01',
        title: 'Loaded at Port of Beira',
        location: 'Port of Beira, Berth 2',
        timestamp: '2026-03-05T09:00:00Z',
        status: 'Completed',
        description: '500 MT bulk manganese loaded into cargo hold #3.',
        recordedBy: 'Cornelder Port Terminal Beira'
      },
      {
        id: 'MLS-005-02',
        title: 'Adverse Weather Delay Notification',
        location: 'Mozambique Channel',
        timestamp: '2026-03-12T16:00:00Z',
        status: 'Current',
        description: 'Vessel anchored at safe haven off Nacala awaiting storm clearance.',
        recordedBy: 'Harbor Master Alert'
      }
    ],
    documentsAttached: ['DOC-2026-DELAY-WEATHER.pdf'],
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-13T10:00:00Z'
  }
];
