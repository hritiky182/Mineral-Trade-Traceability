// Domain types for MINERALINK

export type UserRole = 
  | 'admin'
  | 'supplier'
  | 'buyer'
  | 'compliance'
  | 'investor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  title: string;
  avatar?: string;
}

export type MineralType = 
  | 'Copper'
  | 'Cobalt'
  | 'Lithium'
  | 'Manganese'
  | 'Graphite'
  | 'Nickel'
  | 'Tin';

export type VerificationStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Additional Information Required'
  | 'Verified'
  | 'Rejected'
  | 'Suspended';

export interface Supplier {
  id: string; // e.g. "SUP-ZM-101"
  name: string;
  registrationNumber: string;
  country: string;
  city: string;
  address: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
    title: string;
  };
  businessCategory: 'Artisanal & Small Scale' | 'Medium Commercial' | 'Large Enterprise Mining' | 'Trading Aggregator';
  mineralsSupplied: MineralType[];
  verificationStatus: VerificationStatus;
  verificationDate?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  documentsSubmittedCount: number;
  availableSupplyDescription: string;
  miningLicenseNumber: string;
  taxIdentificationNumber: string;
  yearEstablished: number;
  hasAssayReports: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ListingStatus = 
  | 'Draft'
  | 'Pending Review'
  | 'Published'
  | 'Paused'
  | 'Fully Allocated'
  | 'Closed';

export interface MineralListing {
  id: string; // e.g. "LST-CU-201"
  mineral: MineralType;
  supplierId: string;
  supplierName: string;
  countryOfOrigin: string;
  mineLocation: string;
  availableQuantity: number;
  allocatedQuantity: number;
  unit: 'MT' | 'KG' | 'LBS';
  gradePurity: string; // e.g. "99.99% Cathode Grade A" or "22.5% Co Concentrate"
  assayId?: string;
  assayReferenceNumber?: string;
  minimumOrderQuantity: number;
  indicativePrice: number; // e.g. 8950
  currency: 'USD' | 'EUR' | 'GBP' | 'KRW';
  incoterm: 'FOB' | 'CIF' | 'EXW' | 'DAP' | 'CFR';
  deliveryPortOrLocation: string; // e.g. "Dar es Salaam Port" or "Ndola Depot"
  packagingType: string; // e.g. "Banded Pallets", "1-ton Big Bags"
  status: ListingStatus;
  leadTimeDays: number;
  isWatchlisted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AssayStatus = 'Pending Review' | 'Verified' | 'Disputed' | 'Superseded';

export interface AssayMeasurement {
  element: string; // e.g. "Cu", "Fe", "S", "As", "Co"
  value: number; // e.g. 99.98
  unit: '%' | 'ppm' | 'g/t';
  specificationRange?: string; // e.g. ">= 99.95%"
  isPenaltyElement?: boolean;
}

export interface AssayReport {
  id: string; // e.g. "ASY-2026-089"
  listingId?: string;
  batchId?: string;
  supplierId: string;
  supplierName: string;
  laboratoryName: string; // e.g. "Alfred H Knight International", "SGS Minerals Services"
  labAccreditation: string; // e.g. "ISO/IEC 17025"
  sampleReference: string;
  samplingDate: string;
  testDate: string;
  reportDate: string;
  mineral: MineralType;
  purityResult: string;
  measurements: AssayMeasurement[];
  status: AssayStatus;
  documentReference: string;
  inspectorName: string;
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type TraceabilityEventType = 
  | 'Batch Registered'
  | 'Origin Information Recorded'
  | 'Supplier Verification Confirmed'
  | 'Assay Record Attached'
  | 'Batch Prepared'
  | 'Custody Transferred'
  | 'Export Clearance Granted'
  | 'Shipment Dispatched'
  | 'Transit Checkpoint Cleared'
  | 'Destination Arrival Recorded'
  | 'Delivery Confirmed';

export interface TraceabilityEvent {
  id: string;
  eventType: TraceabilityEventType;
  timestamp: string;
  actorName: string;
  organization: string;
  role: string;
  location: string;
  description: string;
  documentReference?: string;
  currentStatus: string;
  previousStatus?: string;
  previousEventHash?: string;
  currentEventHash: string; // Deterministic SHA-256 hash
}

export type BatchStatus = 
  | 'Registered'
  | 'Quality Certified'
  | 'In Warehouse'
  | 'In Transit'
  | 'Delivered'
  | 'Archived';

export interface TraceabilityBatch {
  id: string; // e.g. "BTC-ZM-CU-4401"
  mineral: MineralType;
  supplierId: string;
  supplierName: string;
  countryOfOrigin: string;
  mineSiteName: string;
  miningPermitNumber: string;
  gpsCoordinates?: string; // Informational display of mine area
  associatedListingId?: string;
  associatedAssayId?: string;
  quantity: number;
  unit: 'MT' | 'KG' | 'LBS';
  currentCustodyHolder: string;
  associatedShipmentId?: string;
  associatedPurchaseOrderId?: string;
  status: BatchStatus;
  events: TraceabilityEvent[];
  createdAt: string;
  updatedAt: string;
}

export type RfqStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Offer Received'
  | 'Negotiation'
  | 'Accepted'
  | 'Declined'
  | 'Expired'
  | 'Converted to Purchase Order';

export interface CommercialOffer {
  id: string; // e.g. "OFR-2026-112"
  rfqId: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'KRW';
  confirmedQuantity: number;
  unit: 'MT' | 'KG' | 'LBS';
  totalValue: number;
  incoterm: 'FOB' | 'CIF' | 'EXW' | 'DAP' | 'CFR';
  deliveryLocation: string;
  estimatedDispatchDate: string;
  offerValidityDate: string;
  paymentTerms: string;
  commercialNotes: string;
  status: 'Pending Buyer Review' | 'Counter-Offer Submitted' | 'Accepted' | 'Declined' | 'Superseded';
  createdAt: string;
}

export interface NegotiationMessage {
  id: string;
  senderRole: UserRole;
  senderName: string;
  senderOrganization: string;
  message: string;
  timestamp: string;
  proposedPrice?: number;
  proposedQuantity?: number;
  attachmentName?: string;
}

export interface RequestForQuotation {
  id: string; // e.g. "RFQ-2026-0045"
  buyerId: string;
  buyerName: string;
  buyerCountry: string;
  supplierId: string;
  supplierName: string;
  listingId?: string;
  mineral: MineralType;
  requiredQuantity: number;
  unit: 'MT' | 'KG' | 'LBS';
  targetUnitPrice?: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'KRW';
  requiredGradePurity: string;
  incoterm: 'FOB' | 'CIF' | 'EXW' | 'DAP' | 'CFR';
  destinationPort: string;
  requiredDeliveryDate: string;
  responseDeadline: string;
  specialInstructions?: string;
  status: RfqStatus;
  offers: CommercialOffer[];
  messages: NegotiationMessage[];
  associatedPurchaseOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export type PurchaseOrderStatus = 
  | 'Draft'
  | 'Issued'
  | 'Supplier Acknowledgment Pending'
  | 'Confirmed'
  | 'Fulfillment in Progress'
  | 'Partially Fulfilled'
  | 'Fulfilled'
  | 'Cancelled';

export interface PurchaseOrder {
  id: string; // e.g. "PO-2026-031"
  poNumber: string;
  buyerId: string;
  buyerName: string;
  buyerCountry: string;
  supplierId: string;
  supplierName: string;
  supplierCountry: string;
  listingId?: string;
  mineral: MineralType;
  specification: string;
  quantity: number;
  unit: 'MT' | 'KG' | 'LBS';
  unitPrice: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'KRW';
  subtotal: number;
  logisticsInsuranceFee: number;
  exportLevyEstimate: number;
  totalIndicativeValue: number;
  incoterm: 'FOB' | 'CIF' | 'EXW' | 'DAP' | 'CFR';
  deliveryDestination: string;
  paymentTerms: string; // e.g. "100% Escrow on Vessel Loading"
  rfqId?: string;
  offerId?: string;
  batchId?: string;
  shipmentId?: string;
  escrowId?: string;
  creationDate: string;
  expectedDeliveryDate: string;
  status: PurchaseOrderStatus;
  supplierAcknowledgedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ShipmentStatus = 
  | 'Preparation'
  | 'Ready for Dispatch'
  | 'Dispatched'
  | 'In Transit'
  | 'Customs Processing'
  | 'Arrived at Destination'
  | 'Delivered'
  | 'Delayed'
  | 'On Hold';

export interface ShipmentMilestone {
  id: string;
  title: string;
  location: string;
  timestamp: string;
  status: 'Completed' | 'Current' | 'Pending';
  description: string;
  recordedBy: string;
}

export interface Shipment {
  id: string; // e.g. "SHP-2026-009"
  trackingNumber: string;
  purchaseOrderId: string;
  supplierId: string;
  supplierName: string;
  buyerId: string;
  buyerName: string;
  batchId: string;
  mineral: MineralType;
  shippedQuantity: number;
  unit: 'MT' | 'KG' | 'LBS';
  originPort: string;
  destinationPort: string;
  transportMode: 'Multi-Modal Rail/Sea' | 'Ocean Freight' | 'Road Transport' | 'Air Cargo';
  logisticsProvider: string; // e.g. "Bolloré Africa Logistics / MSC"
  vesselOrConsignmentNumber: string;
  dispatchDate: string;
  estimatedArrivalDate: string;
  actualArrivalDate?: string;
  status: ShipmentStatus;
  milestones: ShipmentMilestone[];
  isDelayed?: boolean;
  delayReason?: string;
  revisedArrivalDate?: string;
  documentsAttached: string[];
  createdAt: string;
  updatedAt: string;
}

export type EscrowStatus = 
  | 'Not Created'
  | 'Awaiting Funding'
  | 'Funded in Simulation'
  | 'Awaiting Release Conditions'
  | 'Release Eligible in Simulation'
  | 'Released in Simulation'
  | 'Refund Requested'
  | 'Refunded in Simulation'
  | 'Disputed';

export interface EscrowReleaseCondition {
  id: string;
  title: string;
  description: string;
  isSatisfied: boolean;
  satisfiedAt?: string;
  verifiedBy?: string;
}

export interface EscrowRecord {
  id: string; // e.g. "ESC-2026-081"
  purchaseOrderId: string;
  poNumber: string;
  buyerId: string;
  buyerName: string;
  supplierId: string;
  supplierName: string;
  principalAmount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'KRW';
  fundingStatus: 'Unfunded' | 'Funded (Simulated)' | 'Refunded (Simulated)';
  status: EscrowStatus;
  conditions: EscrowReleaseCondition[];
  fundedDate?: string;
  releasedDate?: string;
  disputeReason?: string;
  simulatedTxHash?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStage = 
  | 'Early Exploration'
  | 'Advanced Exploration'
  | 'Development'
  | 'Production';

export interface InvestmentOpportunity {
  id: string; // e.g. "INV-ZM-007"
  projectName: string;
  country: string;
  region: string;
  mineralFocus: MineralType[];
  stage: ProjectStage;
  overview: string;
  projectOwner: string;
  ownerOrganizationId?: string;
  estimatedFundingRequirement: number;
  fundingCurrency: 'USD' | 'EUR';
  intendedUseOfFunds: string;
  licenseNumber: string;
  concessionSizeKm2: number;
  dueDiligenceStatus: 'Verified Qualified' | 'Preliminary Review' | 'Third-Party Audited';
  riskDisclosures: string;
  documentCount: number;
  expressionsOfInterestCount: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpressionOfInterest {
  id: string;
  projectId: string;
  investorId: string;
  investorName: string;
  investorOrganization: string;
  proposedTicketSize: number;
  currency: 'USD' | 'EUR';
  investmentHorizon: string;
  investorMessage: string;
  status: 'Submitted' | 'Under Discussion' | 'Due Diligence Active' | 'Declined';
  submittedDate: string;
}

export type DocumentType = 
  | 'Business Registration'
  | 'Supplier Identity Documentation'
  | 'Mineral Origin Documentation'
  | 'Assay Report'
  | 'Export Documentation'
  | 'Shipping Documentation'
  | 'Purchase Order'
  | 'Commercial Invoice'
  | 'Compliance Declaration'
  | 'Project Due-Diligence Document';

export type DocumentReviewStatus = 
  | 'Submitted'
  | 'Under Review'
  | 'Approved in Demo Workflow'
  | 'Rejected'
  | 'Expired';

export interface ComplianceDocument {
  id: string; // e.g. "DOC-2026-904"
  title: string;
  documentType: DocumentType;
  fileName: string;
  fileSizeKb: number;
  relatedOrganization: string;
  relatedOrganizationId: string;
  relatedEntityType?: 'Supplier' | 'Listing' | 'Batch' | 'PurchaseOrder' | 'Shipment' | 'Project';
  relatedEntityId?: string;
  issueDate: string;
  expiryDate?: string;
  submissionDate: string;
  reviewStatus: DocumentReviewStatus;
  reviewerName?: string;
  reviewNotes?: string;
  fileUrl?: string; // simulated or base64
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  entityType: 'Supplier' | 'Listing' | 'Assay' | 'Batch' | 'RFQ' | 'PurchaseOrder' | 'Shipment' | 'Escrow' | 'Document' | 'Project' | 'User';
  entityReference: string;
  description: string;
}

export interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  targetRole?: UserRole | 'all';
  targetEntity?: string;
  targetLink?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AppSettings {
  preferredCurrency: 'USD' | 'EUR' | 'GBP' | 'KRW';
  dateFormat: 'MM/dd/yyyy' | 'dd/MM/yyyy' | 'yyyy-MM-dd';
  notifyOnVerification: boolean;
  notifyOnNewRfq: boolean;
  notifyOnShipmentMilestone: boolean;
  notifyOnEscrowStatus: boolean;
  systemNotificationsEnabled: boolean;
}
