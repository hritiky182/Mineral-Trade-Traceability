import { ActivityLog } from '../../types';

export const SEED_ACTIVITIES: ActivityLog[] = [
  {
    id: 'ACT-2026-901',
    timestamp: '2026-03-25T11:30:00Z',
    actor: 'Elena Rostova',
    role: 'compliance',
    action: 'ESCROW_CONDITIONS_VERIFIED',
    entityType: 'Escrow',
    entityReference: 'ESC-2026-003',
    description: 'Verified final dispatch release approval for Serenje Graphite Ventures escrow.'
  },
  {
    id: 'ACT-2026-902',
    timestamp: '2026-03-25T08:20:00Z',
    actor: 'Lillian Chanda',
    role: 'supplier',
    action: 'SUPPLIER_ONBOARDING_SUBMITTED',
    entityType: 'Supplier',
    entityReference: 'SUP-ZM-112',
    description: 'Submitted onboarding verification pack for Muchinga Manganese Mining Enterprise.'
  },
  {
    id: 'ACT-2026-903',
    timestamp: '2026-03-24T15:30:00Z',
    actor: 'Customs Officer Mutale',
    role: 'compliance',
    action: 'CUSTOMS_EXPORT_APPROVED',
    entityType: 'Shipment',
    entityReference: 'SHP-2026-002',
    description: 'Issued export declaration clearance for 60 MT Cobalt Hydroxide at Central Customs Terminal.'
  },
  {
    id: 'ACT-2026-904',
    timestamp: '2026-03-24T12:00:00Z',
    actor: 'Dr. Mwamba Chileshe',
    role: 'supplier',
    action: 'LISTING_UPDATED',
    entityType: 'Listing',
    entityReference: 'LST-CU-201',
    description: 'Updated available quantity to 450 MT following PO-2026-001 allocation.'
  },
  {
    id: 'ACT-2026-905',
    timestamp: '2026-03-22T10:00:00Z',
    actor: 'Chanda Bwalya',
    role: 'supplier',
    action: 'COMMERCIAL_OFFER_SUBMITTED',
    entityType: 'RFQ',
    entityReference: 'RFQ-2026-0049',
    description: 'Submitted commercial offer ($245/MT FOB Dar es Salaam) to Nippon Mineral Smelting.'
  },
  {
    id: 'ACT-2026-906',
    timestamp: '2026-03-18T09:30:00Z',
    actor: 'Capt. Tariq Al-Mansoor',
    role: 'admin',
    action: 'SHIPMENT_DISPATCH_RECORDED',
    entityType: 'Shipment',
    entityReference: 'SHP-2026-001',
    description: 'Recorded vessel loading on MSC LILIAN v.2608W at Dar es Salaam Berth 5.'
  },
  {
    id: 'ACT-2026-907',
    timestamp: '2026-03-16T14:00:00Z',
    actor: 'EuroMetals Receiving',
    role: 'buyer',
    action: 'ESCROW_RELEASED_SIMULATION',
    entityType: 'Escrow',
    entityReference: 'ESC-2026-005',
    description: 'Simulated escrow release of $2,046,240 to Southern Base Metals following Rotterdam delivery confirmation.'
  },
  {
    id: 'ACT-2026-908',
    timestamp: '2026-03-10T11:00:00Z',
    actor: 'Min-Jun Park',
    role: 'buyer',
    action: 'PURCHASE_ORDER_ISSUED',
    entityType: 'PurchaseOrder',
    entityReference: 'PO-2026-004',
    description: 'Issued Purchase Order PO-KCR-2026-004 to Kafue Copper Ridge Resources.'
  },
  {
    id: 'ACT-2026-909',
    timestamp: '2026-03-02T11:00:00Z',
    actor: 'Min-Jun Park',
    role: 'buyer',
    action: 'ESCROW_FUNDED_SIMULATION',
    entityType: 'Escrow',
    entityReference: 'ESC-2026-001',
    description: 'Simulated escrow funding of $1,857,450 for Purchase Order PO-CCM-2026-001.'
  },
  {
    id: 'ACT-2026-910',
    timestamp: '2026-02-15T09:00:00Z',
    actor: 'Elena Rostova',
    role: 'compliance',
    action: 'SUPPLIER_VERIFIED',
    entityType: 'Supplier',
    entityReference: 'SUP-ZM-101',
    description: 'Verified large-scale mining enterprise credentials for Copperbelt Consolidated Mining Ltd.'
  }
];
