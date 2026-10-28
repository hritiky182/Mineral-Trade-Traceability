import { UserProfile, AppSettings } from '../../types';

export const DEMO_USERS: Record<string, UserProfile> = {
  admin: {
    id: 'USR-ADM-001',
    name: 'Alistair Finch',
    email: 'a.finch@mineralink.io',
    role: 'admin',
    organizationId: 'ORG-PLATFORM-01',
    organizationName: 'MINERALINK Global Operations',
    title: 'Chief Platform Administrator'
  },
  supplier: {
    id: 'USR-SUP-002',
    name: 'Dr. Mwamba Chileshe',
    email: 'm.chileshe@copperbelt-consolidated.com',
    role: 'supplier',
    organizationId: 'SUP-ZM-101',
    organizationName: 'Copperbelt Consolidated Mining Ltd',
    title: 'Commercial & Export Director'
  },
  buyer: {
    id: 'USR-BUY-003',
    name: 'Min-Jun Park',
    email: 'minjun.park@hansol-materials.co.kr',
    role: 'buyer',
    organizationId: 'BUY-KR-301',
    organizationName: 'Hansol Advanced Materials Corp',
    title: 'VP Commodity Procurement (Seoul, South Korea)'
  },
  compliance: {
    id: 'USR-CMP-004',
    name: 'Elena Rostova',
    email: 'elena.rostova@mineralink.io',
    role: 'compliance',
    organizationId: 'ORG-PLATFORM-01',
    organizationName: 'MINERALINK Compliance & ESG Unit',
    title: 'Senior Compliance & Certification Officer'
  },
  investor: {
    id: 'USR-INV-005',
    name: 'Jin-Woo Choi',
    email: 'jinwoo.choi@k-criticalmetals.kr',
    role: 'investor',
    organizationId: 'INV-KR-901',
    organizationName: 'K-Critical Minerals Sovereign Fund',
    title: 'Managing Director - Energy Transition Assets'
  }
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  preferredCurrency: 'USD',
  dateFormat: 'MMM dd, yyyy' as any,
  notifyOnVerification: true,
  notifyOnNewRfq: true,
  notifyOnShipmentMilestone: true,
  notifyOnEscrowStatus: true,
  systemNotificationsEnabled: true
};
