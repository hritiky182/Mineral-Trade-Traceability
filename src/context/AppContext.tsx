import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppDataStore } from '../data/seed';
import { StorageService } from '../services/storage/storageService';
import {
  UserRole,
  UserProfile,
  VerificationStatus,
  Supplier,
  MineralListing,
  AssayReport,
  RequestForQuotation,
  CommercialOffer,
  PurchaseOrder,
  Shipment,
  ShipmentMilestone,
  EscrowRecord,
  ComplianceDocument,
  DocumentReviewStatus,
  ExpressionOfInterest,
  TraceabilityEvent,
  ActivityLog,
  PlatformNotification,
  AppSettings
} from '../types';
import { generateSha256, generateEventCanonicalPayload } from '../utils/crypto';

export interface SessionInfo {
  token: string;
  authenticatedAt: string;
  expiresAt: string;
  terminalIp: string;
  authMethod: 'Enterprise SSO (SAML)' | '2FA Corporate Token' | 'Institutional Key';
}

interface AppContextType {
  store: AppDataStore;
  activeRole: UserRole;
  currentUser: UserProfile;
  setActiveRole: (role: UserRole) => void;
  
  // Authentication & Session
  isAuthenticated: boolean;
  sessionInfo: SessionInfo | null;
  login: (role?: UserRole, email?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  
  // Suppliers & Verification
  createSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Supplier;
  updateVerificationStatus: (supplierId: string, status: VerificationStatus, notes: string) => void;
  
  // Inventory & Listings
  createListing: (listing: Omit<MineralListing, 'id' | 'createdAt' | 'updatedAt'>) => MineralListing;
  updateListingStatus: (listingId: string, status: MineralListing['status']) => void;
  toggleWatchlist: (listingId: string) => void;
  
  // Assays
  createAssayReport: (assay: Omit<AssayReport, 'id' | 'createdAt' | 'updatedAt'>) => AssayReport;
  
  // RFQs & Negotiations
  createRfq: (rfq: Omit<RequestForQuotation, 'id' | 'createdAt' | 'updatedAt' | 'offers' | 'messages' | 'status'>) => RequestForQuotation;
  submitCommercialOffer: (rfqId: string, offer: Omit<CommercialOffer, 'id' | 'rfqId' | 'createdAt'>) => CommercialOffer;
  acceptCommercialOffer: (rfqId: string, offerId: string) => { po: PurchaseOrder; escrow: EscrowRecord };
  declineCommercialOffer: (rfqId: string, offerId: string, reason?: string) => void;
  sendNegotiationMessage: (rfqId: string, message: string, proposedPrice?: number) => void;
  
  // Purchase Orders
  confirmPurchaseOrder: (poId: string) => void;
  
  // Escrow & Settlements
  fundEscrowSimulation: (escrowId: string) => void;
  releaseEscrowSimulation: (escrowId: string) => boolean;
  disputeEscrow: (escrowId: string, reason: string) => void;
  toggleEscrowCondition: (escrowId: string, conditionId: string) => void;
  
  // Shipments & Logistics
  createShipment: (shipment: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt' | 'milestones'>) => Shipment;
  addShipmentMilestone: (shipmentId: string, milestone: Omit<ShipmentMilestone, 'id' | 'timestamp'>) => void;
  recordShipmentDelay: (shipmentId: string, reason: string, revisedDate: string) => void;
  updateShipmentStatus: (shipmentId: string, status: Shipment['status']) => void;
  
  // Traceability & Chain of Custody
  addTraceabilityEvent: (batchId: string, event: Omit<TraceabilityEvent, 'id' | 'timestamp' | 'previousEventHash' | 'currentEventHash'>) => Promise<TraceabilityEvent>;
  
  // Documents & Compliance
  uploadComplianceDocument: (doc: Omit<ComplianceDocument, 'id' | 'createdAt' | 'submissionDate'>) => ComplianceDocument;
  reviewComplianceDocument: (docId: string, status: DocumentReviewStatus, notes?: string) => void;
  
  // Investment Opportunities
  submitExpressionOfInterest: (projectId: string, eoi: Omit<ExpressionOfInterest, 'id' | 'projectId' | 'submittedDate'>) => ExpressionOfInterest;
  
  // Notifications & Activity
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  
  // Settings & System
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetEnvironment: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<AppDataStore>(() => StorageService.getStore());

  useEffect(() => {
    const unsubscribe = StorageService.subscribe((updatedStore) => {
      setStore({ ...updatedStore });
    });
    return unsubscribe;
  }, []);

  const activeRole = store.activeRole;
  const currentUser = store.users[activeRole] || store.users.admin;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mineralink_session') !== null;
  });

  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(() => {
    try {
      const saved = localStorage.getItem('mineralink_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (role?: UserRole, email?: string, _password?: string): Promise<boolean> => {
    const targetRole = role || activeRole;
    if (role && role !== activeRole) {
      const updated = { ...store, activeRole: role };
      StorageService.saveStore(updated);
    }
    const userToAuth = store.users[targetRole] || store.users.admin;
    const session: SessionInfo = {
      token: `MNLK-AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      authenticatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      terminalIp: '197.221.248.82 (Primary Secure Gateway)',
      authMethod: '2FA Corporate Token'
    };
    localStorage.setItem('mineralink_session', JSON.stringify(session));
    setSessionInfo(session);
    setIsAuthenticated(true);
    addActivity('USER_AUTHENTICATED', 'User', targetRole, `Institutional access granted for ${userToAuth.name} (${userToAuth.organizationName})`);
    addNotification('Institutional Session Initialized', `Authenticated as ${userToAuth.name} (${userToAuth.organizationName}). Secure TLS connection established.`, 'info');
    return true;
  };

  const logout = () => {
    localStorage.removeItem('mineralink_session');
    setSessionInfo(null);
    setIsAuthenticated(false);
    addActivity('USER_LOGOUT', 'User', activeRole, `Session closed for ${currentUser.name}`);
  };

  const setActiveRole = (role: UserRole) => {
    const updated = { ...store, activeRole: role };
    StorageService.saveStore(updated);
    addActivity('TENANT_SWITCHED', 'User', role, `Switched active enterprise tenant to ${role.toUpperCase()} (${store.users[role]?.organizationName})`);
  };

  const addActivity = (action: string, entityType: ActivityLog['entityType'], entityReference: string, description: string) => {
    const newAct: ActivityLog = {
      id: `ACT-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      role: activeRole,
      action,
      entityType,
      entityReference,
      description
    };
    store.activities.unshift(newAct);
  };

  const addNotification = (title: string, message: string, type: PlatformNotification['type'], targetLink?: string, targetRole: PlatformNotification['targetRole'] = 'all') => {
    const newNotif: PlatformNotification = {
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      title,
      message,
      type,
      targetRole,
      targetLink,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    store.notifications.unshift(newNotif);
  };

  // 1. Supplier & Verification
  const createSupplier = (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `SUP-ZM-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const newSupplier: Supplier = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };
    const updatedSuppliers = [newSupplier, ...store.suppliers];
    const newStore = { ...store, suppliers: updatedSuppliers };
    StorageService.saveStore(newStore);
    
    addActivity('SUPPLIER_ONBOARDED', 'Supplier', id, `Registered new supplier organization: ${data.name}`);
    addNotification('New Supplier Registered', `${data.name} submitted registration credentials. Awaiting compliance review.`, 'info', '/supplier-verification', 'compliance');
    return newSupplier;
  };

  const updateVerificationStatus = (supplierId: string, status: VerificationStatus, notes: string) => {
    const updatedSuppliers = store.suppliers.map((s) => {
      if (s.id === supplierId) {
        return {
          ...s,
          verificationStatus: status,
          verificationNotes: notes,
          verifiedBy: status === 'Verified' ? `${currentUser.name} (${currentUser.title})` : s.verifiedBy,
          verificationDate: status === 'Verified' ? new Date().toISOString() : s.verificationDate,
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });

    const targetSupplier = store.suppliers.find(s => s.id === supplierId);
    const newStore = { ...store, suppliers: updatedSuppliers };
    StorageService.saveStore(newStore);

    addActivity('SUPPLIER_VERIFICATION_DECISION', 'Supplier', supplierId, `Verification status updated to ${status} for ${targetSupplier?.name}`);
    addNotification('Supplier Verification Updated', `${targetSupplier?.name} is now ${status}. Notes: ${notes}`, status === 'Verified' ? 'success' : 'warning', '/suppliers');
  };

  // 2. Inventory & Listings
  const createListing = (data: Omit<MineralListing, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `LST-${data.mineral.slice(0, 2).toUpperCase()}-${Math.floor(200 + Math.random() * 800)}`;
    const now = new Date().toISOString();
    const newListing: MineralListing = {
      ...data,
      id,
      allocatedQuantity: 0,
      createdAt: now,
      updatedAt: now
    };
    const updatedListings = [newListing, ...store.listings];
    const newStore = { ...store, listings: updatedListings };
    StorageService.saveStore(newStore);

    addActivity('LISTING_CREATED', 'Listing', id, `Created listing for ${data.availableQuantity} MT of ${data.mineral} (${data.supplierName})`);
    addNotification('New Mineral Listing Published', `${data.supplierName} listed ${data.availableQuantity} MT of ${data.gradePurity} at $${data.indicativePrice}/${data.unit}.`, 'info', '/trade-opportunities');
    return newListing;
  };

  const updateListingStatus = (listingId: string, status: MineralListing['status']) => {
    const updated = store.listings.map((l) => l.id === listingId ? { ...l, status, updatedAt: new Date().toISOString() } : l);
    const newStore = { ...store, listings: updated };
    StorageService.saveStore(newStore);
    addActivity('LISTING_STATUS_CHANGED', 'Listing', listingId, `Listing ${listingId} status changed to ${status}`);
  };

  const toggleWatchlist = (listingId: string) => {
    const updated = store.listings.map((l) => l.id === listingId ? { ...l, isWatchlisted: !l.isWatchlisted } : l);
    const newStore = { ...store, listings: updated };
    StorageService.saveStore(newStore);
  };

  // 3. Assays
  const createAssayReport = (data: Omit<AssayReport, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `ASY-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const newAssay: AssayReport = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };
    const updatedAssays = [newAssay, ...store.assays];
    const newStore = { ...store, assays: updatedAssays };
    StorageService.saveStore(newStore);

    addActivity('ASSAY_REPORT_REGISTERED', 'Assay', id, `Registered lab assay report by ${data.laboratoryName} for ${data.purityResult}`);
    addNotification('New Assay Report Added', `Assay cert ${data.sampleReference} from ${data.laboratoryName} has been attached.`, 'info', '/assays');
    return newAssay;
  };

  // 4. RFQ & Commercial Negotiations
  const createRfq = (data: Omit<RequestForQuotation, 'id' | 'createdAt' | 'updatedAt' | 'offers' | 'messages' | 'status'>) => {
    const id = `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const newRfq: RequestForQuotation = {
      ...data,
      id,
      status: 'Submitted',
      offers: [],
      messages: [
        {
          id: `MSG-${Date.now().toString().slice(-4)}`,
          senderRole: activeRole,
          senderName: currentUser.name,
          senderOrganization: currentUser.organizationName,
          message: `Inquiry submitted for ${data.requiredQuantity} ${data.unit} of ${data.mineral}. Required delivery: ${data.requiredDeliveryDate} to ${data.destinationPort}.`,
          timestamp: now,
          proposedQuantity: data.requiredQuantity,
          proposedPrice: data.targetUnitPrice
        }
      ],
      createdAt: now,
      updatedAt: now
    };
    const updatedRfqs = [newRfq, ...store.rfqs];
    const newStore = { ...store, rfqs: updatedRfqs };
    StorageService.saveStore(newStore);

    addActivity('RFQ_SUBMITTED', 'RFQ', id, `Submitted inquiry for ${data.requiredQuantity} MT of ${data.mineral} to ${data.supplierName}`);
    addNotification('New RFQ Received', `${data.buyerName} requested a quote for ${data.requiredQuantity} MT ${data.mineral}.`, 'info', '/rfqs', 'supplier');
    return newRfq;
  };

  const submitCommercialOffer = (rfqId: string, offerData: Omit<CommercialOffer, 'id' | 'rfqId' | 'createdAt'>) => {
    const offerId = `OFR-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const newOffer: CommercialOffer = {
      ...offerData,
      id: offerId,
      rfqId,
      status: 'Pending Buyer Review',
      createdAt: now
    };

    const updatedRfqs = store.rfqs.map((rfq) => {
      if (rfq.id === rfqId) {
        return {
          ...rfq,
          status: 'Offer Received' as const,
          offers: [newOffer, ...rfq.offers],
          messages: [
            ...rfq.messages,
            {
              id: `MSG-${Date.now().toString().slice(-4)}`,
              senderRole: activeRole,
              senderName: currentUser.name,
              senderOrganization: currentUser.organizationName,
              message: `Submitted commercial offer: $${offerData.unitPrice}/${offerData.unit} (${offerData.incoterm} ${offerData.deliveryLocation}). Total indicative value: $${offerData.totalValue.toLocaleString()}. ${offerData.commercialNotes}`,
              timestamp: now,
              proposedPrice: offerData.unitPrice,
              proposedQuantity: offerData.confirmedQuantity
            }
          ],
          updatedAt: now
        };
      }
      return rfq;
    });

    const newStore = { ...store, rfqs: updatedRfqs };
    StorageService.saveStore(newStore);

    addActivity('COMMERCIAL_OFFER_SUBMITTED', 'RFQ', rfqId, `Offer of $${offerData.unitPrice}/MT submitted for ${offerData.confirmedQuantity} MT`);
    addNotification('Commercial Offer Received', `${offerData.supplierName} submitted an offer of $${offerData.unitPrice}/MT for RFQ ${rfqId}.`, 'success', '/rfqs', 'buyer');
    return newOffer;
  };

  const acceptCommercialOffer = (rfqId: string, offerId: string) => {
    const rfq = store.rfqs.find(r => r.id === rfqId);
    if (!rfq) throw new Error('RFQ not found');
    const offer = rfq.offers.find(o => o.id === offerId);
    if (!offer) throw new Error('Offer not found');

    const now = new Date().toISOString();
    const poNumber = `PO-${offer.supplierId.split('-')[2] || 'ZM'}-2026-${Math.floor(100 + Math.random() * 900)}`;
    const poId = `PO-2026-${Math.floor(100 + Math.random() * 900)}`;
    const escrowId = `ESC-2026-${Math.floor(100 + Math.random() * 900)}`;

    const subtotal = offer.unitPrice * offer.confirmedQuantity;
    const logisticsInsuranceFee = Math.round(subtotal * 0.01);
    const exportLevyEstimate = Math.round(subtotal * 0.005);
    const totalIndicativeValue = subtotal + logisticsInsuranceFee + exportLevyEstimate;

    // 1. Create Purchase Order
    const newPO: PurchaseOrder = {
      id: poId,
      poNumber,
      buyerId: rfq.buyerId,
      buyerName: rfq.buyerName,
      buyerCountry: rfq.buyerCountry,
      supplierId: offer.supplierId,
      supplierName: offer.supplierName,
      supplierCountry: 'Global Origin',
      listingId: rfq.listingId,
      mineral: rfq.mineral,
      specification: `${rfq.mineral} (${rfq.requiredGradePurity || 'High Grade'})`,
      quantity: offer.confirmedQuantity,
      unit: offer.unit,
      unitPrice: offer.unitPrice,
      currency: offer.currency,
      subtotal,
      logisticsInsuranceFee,
      exportLevyEstimate,
      totalIndicativeValue,
      incoterm: offer.incoterm,
      deliveryDestination: offer.deliveryLocation,
      paymentTerms: offer.paymentTerms,
      rfqId,
      offerId,
      escrowId,
      creationDate: now,
      expectedDeliveryDate: rfq.requiredDeliveryDate,
      status: 'Confirmed',
      supplierAcknowledgedAt: now,
      notes: `Generated upon commercial offer acceptance (${offer.id}).`,
      createdAt: now,
      updatedAt: now
    };

    // 2. Create Escrow Record
    const newEscrow: EscrowRecord = {
      id: escrowId,
      purchaseOrderId: poId,
      poNumber,
      buyerId: rfq.buyerId,
      buyerName: rfq.buyerName,
      supplierId: offer.supplierId,
      supplierName: offer.supplierName,
      principalAmount: totalIndicativeValue,
      currency: offer.currency,
      fundingStatus: 'Unfunded',
      status: 'Awaiting Funding',
      conditions: [
        {
          id: `COND-${escrowId}-01`,
          title: 'Preshipment Quality & Assay Verification',
          description: `Independent accredited laboratory assay confirming ${rfq.mineral} meets agreed contract specifications.`,
          isSatisfied: false
        },
        {
          id: `COND-${escrowId}-02`,
          title: 'Statutory Single Window Export Clearance',
          description: 'Official mineral export permit, environmental clearance, and customs stamped manifest verified.',
          isSatisfied: false
        },
        {
          id: `COND-${escrowId}-03`,
          title: 'Clean On-Board Ocean Bill of Lading',
          description: `Ocean Bill of Lading confirming loading for transit to ${offer.deliveryLocation}.`,
          isSatisfied: false
        },
        {
          id: `COND-${escrowId}-04`,
          title: 'Destination Port Delivery & Receiving Acceptance',
          description: `Arrival confirmation and physical discharge inspection at ${offer.deliveryLocation}.`,
          isSatisfied: false
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    // 3. Update RFQ status & offers
    const updatedRfqs = store.rfqs.map((r) => {
      if (r.id === rfqId) {
        return {
          ...r,
          status: 'Converted to Purchase Order' as const,
          associatedPurchaseOrderId: poId,
          offers: r.offers.map(o => o.id === offerId ? { ...o, status: 'Accepted' as const } : { ...o, status: 'Superseded' as const }),
          messages: [
            ...r.messages,
            {
              id: `MSG-${Date.now().toString().slice(-4)}`,
              senderRole: activeRole,
              senderName: currentUser.name,
              senderOrganization: currentUser.organizationName,
              message: `Offer ${offerId} accepted! Generated Purchase Order ${poNumber} ($${totalIndicativeValue.toLocaleString()}) with linked Escrow ${escrowId}.`,
              timestamp: now
            }
          ],
          updatedAt: now
        };
      }
      return r;
    });

    // 4. Update listing stock allocation
    const updatedListings = store.listings.map((l) => {
      if (l.id === rfq.listingId) {
        const newAllocated = Math.min(l.availableQuantity, (l.allocatedQuantity || 0) + offer.confirmedQuantity);
        const newStatus = newAllocated >= l.availableQuantity ? 'Fully Allocated' as const : l.status;
        return { ...l, allocatedQuantity: newAllocated, status: newStatus, updatedAt: now };
      }
      return l;
    });

    const newStore = {
      ...store,
      rfqs: updatedRfqs,
      listings: updatedListings,
      purchaseOrders: [newPO, ...store.purchaseOrders],
      escrows: [newEscrow, ...store.escrows]
    };
    StorageService.saveStore(newStore);

    addActivity('OFFER_ACCEPTED_PO_GENERATED', 'PurchaseOrder', poId, `Accepted offer ${offerId} for ${rfq.mineral}. Generated PO ${poNumber} and Escrow ${escrowId}.`);
    addNotification('Purchase Order Generated', `PO ${poNumber} for $${totalIndicativeValue.toLocaleString()} has been issued to ${offer.supplierName}.`, 'success', '/purchase-orders');
    return { po: newPO, escrow: newEscrow };
  };

  const declineCommercialOffer = (rfqId: string, offerId: string, reason?: string) => {
    const now = new Date().toISOString();
    const updatedRfqs = store.rfqs.map((r) => {
      if (r.id === rfqId) {
        return {
          ...r,
          status: 'Negotiation' as const,
          offers: r.offers.map(o => o.id === offerId ? { ...o, status: 'Declined' as const } : o),
          messages: [
            ...r.messages,
            {
              id: `MSG-${Date.now().toString().slice(-4)}`,
              senderRole: activeRole,
              senderName: currentUser.name,
              senderOrganization: currentUser.organizationName,
              message: `Declined offer ${offerId}. Reason: ${reason || 'Terms not suitable at this time.'}`,
              timestamp: now
            }
          ],
          updatedAt: now
        };
      }
      return r;
    });
    const newStore = { ...store, rfqs: updatedRfqs };
    StorageService.saveStore(newStore);
    addActivity('OFFER_DECLINED', 'RFQ', rfqId, `Offer ${offerId} declined`);
  };

  const sendNegotiationMessage = (rfqId: string, message: string, proposedPrice?: number) => {
    const now = new Date().toISOString();
    const updatedRfqs = store.rfqs.map((r) => {
      if (r.id === rfqId) {
        return {
          ...r,
          status: 'Negotiation' as const,
          messages: [
            ...r.messages,
            {
              id: `MSG-${Date.now().toString().slice(-4)}`,
              senderRole: activeRole,
              senderName: currentUser.name,
              senderOrganization: currentUser.organizationName,
              message,
              timestamp: now,
              proposedPrice
            }
          ],
          updatedAt: now
        };
      }
      return r;
    });
    const newStore = { ...store, rfqs: updatedRfqs };
    StorageService.saveStore(newStore);
    addActivity('NEGOTIATION_MESSAGE_SENT', 'RFQ', rfqId, `Posted message in negotiation room for RFQ ${rfqId}`);
  };

  // 5. Purchase Orders
  const confirmPurchaseOrder = (poId: string) => {
    const now = new Date().toISOString();
    const updated = store.purchaseOrders.map((po) => {
      if (po.id === poId) {
        return {
          ...po,
          status: 'Confirmed' as const,
          supplierAcknowledgedAt: now,
          updatedAt: now
        };
      }
      return po;
    });
    const target = store.purchaseOrders.find(p => p.id === poId);
    const newStore = { ...store, purchaseOrders: updated };
    StorageService.saveStore(newStore);

    addActivity('PO_CONFIRMED', 'PurchaseOrder', poId, `Supplier confirmed Purchase Order ${target?.poNumber}`);
    addNotification('Purchase Order Confirmed', `PO ${target?.poNumber} has been acknowledged and confirmed for fulfillment.`, 'success', '/purchase-orders');
  };

  // 6. Escrow
  const fundEscrowSimulation = async (escrowId: string) => {
    const now = new Date().toISOString();
    const simulatedHash = await generateSha256(`ESCROW_FUNDED:${escrowId}:${now}:${Math.random()}`);
    
    const updated = store.escrows.map((e) => {
      if (e.id === escrowId) {
        return {
          ...e,
          fundingStatus: 'Funded (Simulated)' as const,
          status: 'Funded in Simulation' as const,
          fundedDate: now,
          simulatedTxHash: simulatedHash,
          updatedAt: now
        };
      }
      return e;
    });

    const target = store.escrows.find(e => e.id === escrowId);
    const newStore = { ...store, escrows: updated };
    StorageService.saveStore(newStore);

    addActivity('ESCROW_FUNDED', 'Escrow', escrowId, `Simulated escrow deposit of $${target?.principalAmount.toLocaleString()} funded by buyer`);
    addNotification('Escrow Funded in Simulation', `Escrow account for PO ${target?.poNumber} has been funded in simulation ($${target?.principalAmount.toLocaleString()}).`, 'success', '/escrow');
  };

  const releaseEscrowSimulation = (escrowId: string): boolean => {
    const target = store.escrows.find(e => e.id === escrowId);
    if (!target) return false;

    // Check if conditions are satisfied
    const allSatisfied = target.conditions.every(c => c.isSatisfied);
    if (!allSatisfied) {
      addNotification('Escrow Release Blocked', 'Cannot release escrow: All required milestone conditions must be verified first.', 'error', '/escrow');
      return false;
    }

    const now = new Date().toISOString();
    const updated = store.escrows.map((e) => {
      if (e.id === escrowId) {
        return {
          ...e,
          status: 'Released in Simulation' as const,
          releasedDate: now,
          updatedAt: now
        };
      }
      return e;
    });

    // Also update linked PO to Fulfilled
    const updatedPOs = store.purchaseOrders.map((po) => {
      if (po.escrowId === escrowId || po.id === target.purchaseOrderId) {
        return { ...po, status: 'Fulfilled' as const, updatedAt: now };
      }
      return po;
    });

    const newStore = { ...store, escrows: updated, purchaseOrders: updatedPOs };
    StorageService.saveStore(newStore);

    addActivity('ESCROW_RELEASED', 'Escrow', escrowId, `Simulated release of $${target.principalAmount.toLocaleString()} to supplier ${target.supplierName}`);
    addNotification('Escrow Released Successfully', `Simulated trade settlement of $${target.principalAmount.toLocaleString()} completed for ${target.supplierName}.`, 'success', '/escrow');
    return true;
  };

  const disputeEscrow = (escrowId: string, reason: string) => {
    const now = new Date().toISOString();
    const updated = store.escrows.map((e) => {
      if (e.id === escrowId) {
        return {
          ...e,
          status: 'Disputed' as const,
          disputeReason: reason,
          updatedAt: now
        };
      }
      return e;
    });
    const newStore = { ...store, escrows: updated };
    StorageService.saveStore(newStore);

    addActivity('ESCROW_DISPUTED', 'Escrow', escrowId, `Dispute lodged on escrow ${escrowId}: ${reason}`);
    addNotification('Escrow Disputed', `Trade dispute opened for Escrow ${escrowId}. Automatic releases halted.`, 'error', '/escrow', 'compliance');
  };

  const toggleEscrowCondition = (escrowId: string, conditionId: string) => {
    const now = new Date().toISOString();
    const updated = store.escrows.map((e) => {
      if (e.id === escrowId) {
        const newConditions = e.conditions.map((c) => {
          if (c.id === conditionId) {
            const nextState = !c.isSatisfied;
            return {
              ...c,
              isSatisfied: nextState,
              satisfiedAt: nextState ? now : undefined,
              verifiedBy: nextState ? `${currentUser.name} (${currentUser.title})` : undefined
            };
          }
          return c;
        });

        // Check if all are satisfied now
        const allDone = newConditions.every(c => c.isSatisfied);
        const nextStatus = allDone && e.fundingStatus === 'Funded (Simulated)'
          ? 'Release Eligible in Simulation' as const
          : (e.fundingStatus === 'Funded (Simulated)' ? 'Funded in Simulation' as const : e.status);

        return {
          ...e,
          conditions: newConditions,
          status: nextStatus,
          updatedAt: now
        };
      }
      return e;
    });

    const newStore = { ...store, escrows: updated };
    StorageService.saveStore(newStore);
    addActivity('ESCROW_CONDITION_TOGGLED', 'Escrow', escrowId, `Updated condition ${conditionId} on Escrow ${escrowId}`);
  };

  // 7. Shipments
  const createShipment = (data: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt' | 'milestones'>) => {
    const id = `SHP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const trackingNumber = `TRK-${data.transportMode.slice(0, 3).toUpperCase()}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const newShipment: Shipment = {
      ...data,
      id,
      trackingNumber,
      status: 'Preparation',
      milestones: [
        {
          id: `MLS-${id}-01`,
          title: 'Shipment Created & Logistics Booked',
          location: data.originPort,
          timestamp: now,
          status: 'Completed',
          description: `Consignment registered for ${data.shippedQuantity} MT ${data.mineral} bound for ${data.destinationPort}.`,
          recordedBy: currentUser.name
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    // Update purchase order status to Fulfillment in Progress
    const updatedPOs = store.purchaseOrders.map((po) => {
      if (po.id === data.purchaseOrderId) {
        return { ...po, status: 'Fulfillment in Progress' as const, shipmentId: id, updatedAt: now };
      }
      return po;
    });

    const newStore = {
      ...store,
      shipments: [newShipment, ...store.shipments],
      purchaseOrders: updatedPOs
    };
    StorageService.saveStore(newStore);

    addActivity('SHIPMENT_PREPARED', 'Shipment', id, `Created shipment consignment ${trackingNumber} for PO ${data.purchaseOrderId}`);
    addNotification('Shipment Booked', `Shipment ${trackingNumber} booked with ${data.logisticsProvider} for ${data.shippedQuantity} MT ${data.mineral}.`, 'info', '/shipments');
    return newShipment;
  };

  const addShipmentMilestone = (shipmentId: string, milestone: Omit<ShipmentMilestone, 'id' | 'timestamp'>) => {
    const now = new Date().toISOString();
    const milestoneId = `MLS-${Date.now().toString().slice(-4)}`;
    const newMilestone: ShipmentMilestone = {
      ...milestone,
      id: milestoneId,
      timestamp: now
    };

    let updatedStatus: Shipment['status'] | undefined;
    if (milestone.title.toLowerCase().includes('dispatched') || milestone.title.toLowerCase().includes('depart')) {
      updatedStatus = 'In Transit';
    } else if (milestone.title.toLowerCase().includes('customs')) {
      updatedStatus = 'Customs Processing';
    } else if (milestone.title.toLowerCase().includes('arrived') || milestone.title.toLowerCase().includes('discharge')) {
      updatedStatus = 'Arrived at Destination';
    } else if (milestone.title.toLowerCase().includes('delivered') || milestone.title.toLowerCase().includes('received')) {
      updatedStatus = 'Delivered';
    }

    const updatedShipments = store.shipments.map((s) => {
      if (s.id === shipmentId) {
        return {
          ...s,
          status: updatedStatus || s.status,
          actualArrivalDate: updatedStatus === 'Delivered' ? now : s.actualArrivalDate,
          milestones: [newMilestone, ...s.milestones],
          updatedAt: now
        };
      }
      return s;
    });

    const newStore = { ...store, shipments: updatedShipments };
    StorageService.saveStore(newStore);

    addActivity('SHIPMENT_MILESTONE_LOGGED', 'Shipment', shipmentId, `Logged milestone '${milestone.title}' at ${milestone.location}`);
    addNotification('Shipment Milestone Logged', `Milestone '${milestone.title}' recorded for shipment ${shipmentId}.`, 'info', '/shipments');
  };

  const recordShipmentDelay = (shipmentId: string, reason: string, revisedDate: string) => {
    const now = new Date().toISOString();
    const updated = store.shipments.map((s) => {
      if (s.id === shipmentId) {
        return {
          ...s,
          isDelayed: true,
          status: 'Delayed' as const,
          delayReason: reason,
          revisedArrivalDate: revisedDate,
          milestones: [
            {
              id: `MLS-${Date.now().toString().slice(-4)}`,
              title: 'Operational Delay Registered',
              location: s.originPort,
              timestamp: now,
              status: 'Completed' as const,
              description: `Delay recorded: ${reason}. Revised arrival estimate: ${revisedDate}.`,
              recordedBy: currentUser.name
            },
            ...s.milestones
          ],
          updatedAt: now
        };
      }
      return s;
    });

    const newStore = { ...store, shipments: updated };
    StorageService.saveStore(newStore);

    addActivity('SHIPMENT_DELAY_RECORDED', 'Shipment', shipmentId, `Delay recorded on shipment ${shipmentId}: ${reason}`);
    addNotification('Shipment Delay Recorded', `Shipment ${shipmentId} delayed: ${reason}. New ETA: ${revisedDate}.`, 'warning', '/shipments');
  };

  const updateShipmentStatus = (shipmentId: string, status: Shipment['status']) => {
    const now = new Date().toISOString();
    const updated = store.shipments.map((s) => s.id === shipmentId ? { ...s, status, updatedAt: now } : s);
    const newStore = { ...store, shipments: updated };
    StorageService.saveStore(newStore);
    addActivity('SHIPMENT_STATUS_UPDATED', 'Shipment', shipmentId, `Status updated to ${status}`);
  };

  // 8. Traceability & Chain of Custody
  const addTraceabilityEvent = async (batchId: string, eventData: Omit<TraceabilityEvent, 'id' | 'timestamp' | 'previousEventHash' | 'currentEventHash'>): Promise<TraceabilityEvent> => {
    const batch = store.batches.find(b => b.id === batchId);
    if (!batch) throw new Error('Batch not found');

    const now = new Date().toISOString();
    const eventId = `EVT-${batchId.split('-')[3] || '00'}-${Date.now().toString().slice(-4)}`;
    const previousEvent = batch.events[batch.events.length - 1];
    const previousEventHash = previousEvent ? previousEvent.currentEventHash : '0x0000000000000000000000000000000000000000000000000000000000000000';

    const canonicalPayload = generateEventCanonicalPayload({
      id: eventId,
      eventType: eventData.eventType,
      timestamp: now,
      location: eventData.location,
      description: eventData.description,
      actorName: eventData.actorName,
      previousEventHash
    });

    const currentEventHash = await generateSha256(canonicalPayload);

    const newEvent: TraceabilityEvent = {
      ...eventData,
      id: eventId,
      timestamp: now,
      previousEventHash,
      currentEventHash
    };

    let nextBatchStatus = batch.status;
    if (eventData.eventType === 'Shipment Dispatched') nextBatchStatus = 'In Transit';
    if (eventData.eventType === 'Delivery Confirmed') nextBatchStatus = 'Delivered';
    if (eventData.eventType === 'Assay Record Attached') nextBatchStatus = 'Quality Certified';

    const updatedBatches = store.batches.map((b) => {
      if (b.id === batchId) {
        return {
          ...b,
          currentCustodyHolder: eventData.organization || b.currentCustodyHolder,
          status: nextBatchStatus,
          events: [...b.events, newEvent],
          updatedAt: now
        };
      }
      return b;
    });

    const newStore = { ...store, batches: updatedBatches };
    StorageService.saveStore(newStore);

    addActivity('TRACEABILITY_EVENT_RECORDED', 'Batch', batchId, `Recorded event '${eventData.eventType}' for batch ${batchId}`);
    addNotification('Traceability Event Recorded', `Event '${eventData.eventType}' sealed in simulated ledger evidence for batch ${batchId}.`, 'info', '/traceability');
    return newEvent;
  };

  // 9. Documents & Compliance
  const uploadComplianceDocument = (docData: Omit<ComplianceDocument, 'id' | 'createdAt' | 'submissionDate'>) => {
    const id = `DOC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const newDoc: ComplianceDocument = {
      ...docData,
      id,
      submissionDate: now,
      createdAt: now
    };
    const updated = [newDoc, ...store.documents];
    const newStore = { ...store, documents: updated };
    StorageService.saveStore(newStore);

    addActivity('DOCUMENT_UPLOADED', 'Document', id, `Uploaded ${docData.documentType}: ${docData.title}`);
    addNotification('Document Uploaded', `${docData.relatedOrganization} uploaded ${docData.title}. Review required.`, 'info', '/compliance', 'compliance');
    return newDoc;
  };

  const reviewComplianceDocument = (docId: string, status: DocumentReviewStatus, notes?: string) => {
    const now = new Date().toISOString();
    const updated = store.documents.map((d) => {
      if (d.id === docId) {
        return {
          ...d,
          reviewStatus: status,
          reviewerName: `${currentUser.name} (${currentUser.title})`,
          reviewNotes: notes || d.reviewNotes
        };
      }
      return d;
    });
    const target = store.documents.find(d => d.id === docId);
    const newStore = { ...store, documents: updated };
    StorageService.saveStore(newStore);

    addActivity('DOCUMENT_REVIEWED', 'Document', docId, `Compliance review updated to ${status} for ${target?.title}`);
    addNotification('Document Review Completed', `${target?.title} has been marked as ${status}.`, status === 'Approved in Demo Workflow' ? 'success' : 'warning', '/documents');
  };

  // 10. Investments
  const submitExpressionOfInterest = (projectId: string, eoiData: Omit<ExpressionOfInterest, 'id' | 'projectId' | 'submittedDate'>) => {
    const id = `EOI-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const newEoi: ExpressionOfInterest = {
      ...eoiData,
      id,
      projectId,
      submittedDate: now
    };

    // Increment count on project
    const updatedProjects = store.investments.map((p) => {
      if (p.id === projectId) {
        return { ...p, expressionsOfInterestCount: (p.expressionsOfInterestCount || 0) + 1, updatedAt: now };
      }
      return p;
    });

    const newStore = {
      ...store,
      investments: updatedProjects,
      expressionsOfInterest: [newEoi, ...store.expressionsOfInterest]
    };
    StorageService.saveStore(newStore);

    const project = store.investments.find(p => p.id === projectId);
    addActivity('EOI_SUBMITTED', 'Project', projectId, `Investor ${eoiData.investorOrganization} submitted EOI of $${eoiData.proposedTicketSize.toLocaleString()}`);
    addNotification('New Investment Expression of Interest', `${eoiData.investorOrganization} expressed interest ($${eoiData.proposedTicketSize.toLocaleString()}) in ${project?.projectName}.`, 'success', '/investments');
    return newEoi;
  };

  // 11. Notifications
  const markNotificationRead = (notifId: string) => {
    const updated = store.notifications.map((n) => n.id === notifId ? { ...n, isRead: true } : n);
    const newStore = { ...store, notifications: updated };
    StorageService.saveStore(newStore);
  };

  const markAllNotificationsRead = () => {
    const updated = store.notifications.map((n) => ({ ...n, isRead: true }));
    const newStore = { ...store, notifications: updated };
    StorageService.saveStore(newStore);
  };

  // 12. Settings & Demo Data
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const newStore = { ...store, settings: { ...store.settings, ...newSettings } };
    StorageService.saveStore(newStore);
  };

  const resetEnvironment = () => {
    const fresh = StorageService.resetStore();
    setStore(fresh);
  };

  const exportDataJson = () => StorageService.exportStoreJson();
  const importDataJson = (json: string) => StorageService.importStoreJson(json);

  return (
    <AppContext.Provider
      value={{
        store,
        activeRole,
        currentUser,
        setActiveRole,
        isAuthenticated,
        sessionInfo,
        login,
        logout,
        createSupplier,
        updateVerificationStatus,
        createListing,
        updateListingStatus,
        toggleWatchlist,
        createAssayReport,
        createRfq,
        submitCommercialOffer,
        acceptCommercialOffer,
        declineCommercialOffer,
        sendNegotiationMessage,
        confirmPurchaseOrder,
        fundEscrowSimulation,
        releaseEscrowSimulation,
        disputeEscrow,
        toggleEscrowCondition,
        createShipment,
        addShipmentMilestone,
        recordShipmentDelay,
        updateShipmentStatus,
        addTraceabilityEvent,
        uploadComplianceDocument,
        reviewComplianceDocument,
        submitExpressionOfInterest,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        resetEnvironment,
        exportDataJson,
        importDataJson
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
