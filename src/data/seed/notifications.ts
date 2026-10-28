import { PlatformNotification } from '../../types';

export const SEED_NOTIFICATIONS: PlatformNotification[] = [
  {
    id: 'NOTIF-2026-001',
    title: 'Clean Bill of Lading Registered',
    message: 'MSC has uploaded Clean On-Board Ocean Bill of Lading for Shipment SHP-2026-001 (200 MT Copper Cathodes). Escrow release condition 3 satisfied.',
    type: 'success',
    targetRole: 'all',
    targetEntity: 'Shipment',
    targetLink: '/shipments',
    isRead: false,
    createdAt: '2026-03-18T10:05:00Z'
  },
  {
    id: 'NOTIF-2026-002',
    title: 'New Commercial Offer Received',
    message: 'Solwezi Critical Metals Corp submitted a commercial offer of $9,080/MT for RFQ-2026-0048 (250 MT Copper Cathodes).',
    type: 'info',
    targetRole: 'buyer',
    targetEntity: 'RFQ',
    targetLink: '/rfqs',
    isRead: false,
    createdAt: '2026-03-18T11:05:00Z'
  },
  {
    id: 'NOTIF-2026-003',
    title: 'Shipment Weather Delay Alert',
    message: 'Shipment SHP-2026-005 (Manganese to India) reported a 6-day weather delay in Mozambique Channel due to cyclone warning.',
    type: 'warning',
    targetRole: 'all',
    targetEntity: 'Shipment',
    targetLink: '/shipments',
    isRead: false,
    createdAt: '2026-03-12T16:15:00Z'
  },
  {
    id: 'NOTIF-2026-004',
    title: 'New Supplier Verification Submission',
    message: 'Muchinga Manganese Mining Enterprise submitted an onboarding registration with 5 compliance documents.',
    type: 'info',
    targetRole: 'compliance',
    targetEntity: 'Supplier',
    targetLink: '/supplier-verification',
    isRead: false,
    createdAt: '2026-03-25T08:20:00Z'
  },
  {
    id: 'NOTIF-2026-005',
    title: 'Document Nearing Expiry Warning',
    message: 'Environmental Decision Letter for Mwinilunga Lithium Corp (DOC-2026-EMA-105) will expire on 2026-04-30.',
    type: 'warning',
    targetRole: 'compliance',
    targetEntity: 'Document',
    targetLink: '/compliance',
    isRead: true,
    createdAt: '2026-03-20T09:00:00Z'
  },
  {
    id: 'NOTIF-2026-006',
    title: 'Purchase Order Issued',
    message: 'Hansol Advanced Materials issued Purchase Order PO-KCR-2026-004 ($1,386,997) to Kafue Copper Ridge Resources.',
    type: 'info',
    targetRole: 'supplier',
    targetEntity: 'PurchaseOrder',
    targetLink: '/purchase-orders',
    isRead: false,
    createdAt: '2026-03-10T11:05:00Z'
  },
  {
    id: 'NOTIF-2026-007',
    title: 'Escrow Release Eligible',
    message: 'Escrow ESC-2026-003 ($144,840) for Serenje Graphite Ventures has satisfied all release conditions and is eligible for simulated settlement.',
    type: 'success',
    targetRole: 'all',
    targetEntity: 'Escrow',
    targetLink: '/escrow',
    isRead: false,
    createdAt: '2026-03-25T11:35:00Z'
  },
  {
    id: 'NOTIF-2026-008',
    title: 'New Expression of Interest Received',
    message: 'Temasek Resource Holdings submitted an Expression of Interest ($8.0M) for the Kafue Copper SX-EW Expansion project.',
    type: 'info',
    targetRole: 'investor',
    targetEntity: 'Project',
    targetLink: '/investments',
    isRead: true,
    createdAt: '2026-03-10T09:20:00Z'
  }
];
