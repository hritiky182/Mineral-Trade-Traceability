import { SEED_SUPPLIERS } from './suppliers';
import { SEED_LISTINGS } from './listings';
import { SEED_ASSAYS } from './assays';
import { SEED_BATCHES } from './batches';
import { SEED_RFQS } from './rfqs';
import { SEED_PURCHASE_ORDERS } from './purchaseOrders';
import { SEED_SHIPMENTS } from './shipments';
import { SEED_ESCROWS } from './escrows';
import { SEED_INVESTMENTS, SEED_EXPRESSIONS_OF_INTEREST } from './investments';
import { SEED_DOCUMENTS } from './documents';
import { SEED_NOTIFICATIONS } from './notifications';
import { SEED_ACTIVITIES } from './activity';
import { DEMO_USERS, DEFAULT_APP_SETTINGS } from './users';
import { UserRole } from '../../types';

export interface AppDataStore {
  version: string;
  activeRole: UserRole;
  suppliers: typeof SEED_SUPPLIERS;
  listings: typeof SEED_LISTINGS;
  assays: typeof SEED_ASSAYS;
  batches: typeof SEED_BATCHES;
  rfqs: typeof SEED_RFQS;
  purchaseOrders: typeof SEED_PURCHASE_ORDERS;
  shipments: typeof SEED_SHIPMENTS;
  escrows: typeof SEED_ESCROWS;
  investments: typeof SEED_INVESTMENTS;
  expressionsOfInterest: typeof SEED_EXPRESSIONS_OF_INTEREST;
  documents: typeof SEED_DOCUMENTS;
  notifications: typeof SEED_NOTIFICATIONS;
  activities: typeof SEED_ACTIVITIES;
  users: typeof DEMO_USERS;
  settings: typeof DEFAULT_APP_SETTINGS;
}

export function createInitialDataStore(): AppDataStore {
  return {
    version: '1.0.0',
    activeRole: 'admin',
    suppliers: [...SEED_SUPPLIERS],
    listings: [...SEED_LISTINGS],
    assays: [...SEED_ASSAYS],
    batches: [...SEED_BATCHES],
    rfqs: [...SEED_RFQS],
    purchaseOrders: [...SEED_PURCHASE_ORDERS],
    shipments: [...SEED_SHIPMENTS],
    escrows: [...SEED_ESCROWS],
    investments: [...SEED_INVESTMENTS],
    expressionsOfInterest: [...SEED_EXPRESSIONS_OF_INTEREST],
    documents: [...SEED_DOCUMENTS],
    notifications: [...SEED_NOTIFICATIONS],
    activities: [...SEED_ACTIVITIES],
    users: { ...DEMO_USERS },
    settings: { ...DEFAULT_APP_SETTINGS }
  };
}
