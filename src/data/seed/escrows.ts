import { EscrowRecord } from '../../types';

export const SEED_ESCROWS: EscrowRecord[] = [
  {
    id: 'ESC-2026-001',
    purchaseOrderId: 'PO-2026-001',
    poNumber: 'PO-CCM-2026-001',
    buyerId: 'BUY-KR-301',
    buyerName: 'Hansol Advanced Materials Corp',
    supplierId: 'SUP-ZM-101',
    supplierName: 'Copperbelt Consolidated Mining Ltd',
    principalAmount: 1857450,
    currency: 'USD',
    fundingStatus: 'Funded (Simulated)',
    status: 'Awaiting Release Conditions',
    fundedDate: '2026-03-02T11:00:00Z',
    simulatedTxHash: '0x9d4a821e7845ba023c91e77f0a823b1c67e91402a7b8e19c3d4f5a6b7c8d9e0f',
    conditions: [
      {
        id: 'COND-001-01',
        title: 'Preshipment Quality & Assay Verification',
        description: 'Certified lab assay report confirming Cu >= 99.99% uploaded and approved by buyer inspector.',
        isSatisfied: true,
        satisfiedAt: '2026-02-16T11:00:00Z',
        verifiedBy: 'Eng. Hastings Mulenga (AHK)'
      },
      {
        id: 'COND-001-02',
        title: 'Statutory Single Window Export Clearance',
        description: 'Official export permit and customs stamped export manifest registered.',
        isSatisfied: true,
        satisfiedAt: '2026-03-10T16:00:00Z',
        verifiedBy: 'Border Customs Officer Musenge'
      },
      {
        id: 'COND-001-03',
        title: 'Clean On-Board Ocean Bill of Lading',
        description: 'Issued by ocean carrier MSC confirming 200 MT loaded on MSC LILIAN at Dar es Salaam.',
        isSatisfied: true,
        satisfiedAt: '2026-03-18T09:00:00Z',
        verifiedBy: 'MSC Port Agency Tanzania'
      },
      {
        id: 'COND-001-04',
        title: 'Destination Port Discharge & Joint Assay Reconciliation',
        description: 'Vessel discharge at Busan Port and joint sampling confirmation by Hansol Receiving Quality Team.',
        isSatisfied: false
      }
    ],
    createdAt: '2026-03-01T16:00:00Z',
    updatedAt: '2026-03-18T09:30:00Z'
  },
  {
    id: 'ESC-2026-002',
    purchaseOrderId: 'PO-2026-002',
    poNumber: 'PO-CCM-2026-002',
    buyerId: 'BUY-KR-302',
    buyerName: 'Daehan Battery Metals Inc',
    supplierId: 'SUP-ZM-101',
    supplierName: 'Copperbelt Consolidated Mining Ltd',
    principalAmount: 1979250,
    currency: 'USD',
    fundingStatus: 'Funded (Simulated)',
    status: 'Funded in Simulation',
    fundedDate: '2026-03-06T10:30:00Z',
    simulatedTxHash: '0x8c3b710f6734ab912b80d66e9f712a0b56d80391b6a7d08b2c3e4a5b6c7d8e9f',
    conditions: [
      {
        id: 'COND-002-01',
        title: 'Independent Cobalt Hydroxide Assay Verification',
        description: 'Certified cobalt content >= 30% Co with moisture <= 10%.',
        isSatisfied: true,
        satisfiedAt: '2026-02-21T15:00:00Z',
        verifiedBy: 'Eng. Hastings Mulenga (AHK)'
      },
      {
        id: 'COND-002-02',
        title: 'Desiccant Packaging & Serialization Verification',
        description: 'Inspection certificate verifying hermetically sealed FIBC bags with telemetry sensors.',
        isSatisfied: true,
        satisfiedAt: '2026-03-20T10:00:00Z',
        verifiedBy: 'Bolloré Logistics Superintendent'
      },
      {
        id: 'COND-002-03',
        title: 'Export Customs Clearance Stamp',
        description: 'National Revenue & Customs export declaration approval.',
        isSatisfied: true,
        satisfiedAt: '2026-03-24T15:00:00Z',
        verifiedBy: 'Customs Officer Mutale'
      },
      {
        id: 'COND-002-04',
        title: 'Ocean Bill of Lading & Transshipment Confirmation',
        description: 'Clean on-board ocean bill of lading issued for Incheon destination.',
        isSatisfied: false
      }
    ],
    createdAt: '2026-03-05T09:00:00Z',
    updatedAt: '2026-03-24T15:30:00Z'
  },
  {
    id: 'ESC-2026-003',
    purchaseOrderId: 'PO-2026-003',
    poNumber: 'PO-SGV-2026-003',
    buyerId: 'BUY-KR-303',
    buyerName: 'Shinhan Anode Materials Ltd',
    supplierId: 'SUP-ZM-106',
    supplierName: 'Serenje Graphite Ventures',
    principalAmount: 144840,
    currency: 'USD',
    fundingStatus: 'Funded (Simulated)',
    status: 'Release Eligible in Simulation',
    fundedDate: '2026-03-10T09:00:00Z',
    simulatedTxHash: '0x7b2a609e5623ba801a70c55d8e601f9a45c79280a5b6c97a1b2d3e4f5a6b7c8d',
    conditions: [
      {
        id: 'COND-003-01',
        title: 'Jumbo Flake Graphite Assay Certification',
        description: 'Fixed carbon >= 95.0% confirmed by AHK laboratory.',
        isSatisfied: true,
        satisfiedAt: '2026-02-24T17:00:00Z',
        verifiedBy: 'AHK Ndola'
      },
      {
        id: 'COND-003-02',
        title: 'Warehouse Palletizing & Pre-Export Inspection',
        description: 'Palletized units shrink-wrapped with tamper tags verified.',
        isSatisfied: true,
        satisfiedAt: '2026-03-22T14:00:00Z',
        verifiedBy: 'Grace Musonda (SGV)'
      },
      {
        id: 'COND-003-03',
        title: 'Dispatch Release Approval by Buyer',
        description: 'Buyer Shinhan Anode Materials confirmed release approval upon dispatch documentation.',
        isSatisfied: true,
        satisfiedAt: '2026-03-25T11:00:00Z',
        verifiedBy: 'Shinhan Procurement Lead'
      }
    ],
    createdAt: '2026-03-09T10:00:00Z',
    updatedAt: '2026-03-25T11:30:00Z'
  },
  {
    id: 'ESC-2026-004',
    purchaseOrderId: 'PO-2026-004',
    poNumber: 'PO-KCR-2026-004',
    buyerId: 'BUY-KR-301',
    buyerName: 'Hansol Advanced Materials Corp',
    supplierId: 'SUP-ZM-111',
    supplierName: 'Kafue Copper Ridge Resources',
    principalAmount: 1386997,
    currency: 'USD',
    fundingStatus: 'Unfunded',
    status: 'Awaiting Funding',
    conditions: [
      {
        id: 'COND-004-01',
        title: 'Supplier Formal Order Confirmation',
        description: 'Supplier digital countersignature and allocation of lot BTC-ZM-CU-4409.',
        isSatisfied: false
      },
      {
        id: 'COND-004-02',
        title: 'Full Escrow Deposit by Buyer',
        description: 'Buyer deposit of $1,386,997 into transaction escrow account.',
        isSatisfied: false
      }
    ],
    createdAt: '2026-03-10T11:30:00Z',
    updatedAt: '2026-03-10T11:30:00Z'
  },
  {
    id: 'ESC-2026-005',
    purchaseOrderId: 'PO-2026-005',
    poNumber: 'PO-ZNB-2026-005',
    buyerId: 'BUY-NL-307',
    buyerName: 'EuroMetals BV',
    supplierId: 'SUP-ZM-109',
    supplierName: 'Southern Base Metals Ltd',
    principalAmount: 2046240,
    currency: 'USD',
    fundingStatus: 'Funded (Simulated)',
    status: 'Released in Simulation',
    fundedDate: '2026-01-18T10:00:00Z',
    releasedDate: '2026-03-16T14:00:00Z',
    simulatedTxHash: '0x6a1f598d4512aa790f69b44c7d590e8f34b6817994a5b8690a1c2d3e4f5a6b7c',
    conditions: [
      {
        id: 'COND-005-01',
        title: 'Pre-Export Assay Certificate',
        description: 'Nickel sulphide concentrate assay 13.92% Ni.',
        isSatisfied: true,
        satisfiedAt: '2026-01-16T09:00:00Z',
        verifiedBy: 'SGS Kalulushi'
      },
      {
        id: 'COND-005-02',
        title: 'Ocean Bill of Lading (Walvis Bay to Rotterdam)',
        description: 'Hapag-Lloyd bill of lading issued.',
        isSatisfied: true,
        satisfiedAt: '2026-02-01T10:00:00Z',
        verifiedBy: 'Hapag-Lloyd Agent'
      },
      {
        id: 'COND-005-03',
        title: 'Delivery Confirmation at Rotterdam Terminal',
        description: 'Cargo received, weighed, and final commercial settlement executed.',
        isSatisfied: true,
        satisfiedAt: '2026-03-15T11:00:00Z',
        verifiedBy: 'EuroMetals Receiving'
      }
    ],
    createdAt: '2026-01-17T09:00:00Z',
    updatedAt: '2026-03-16T14:00:00Z'
  }
];
