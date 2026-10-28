import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';

// Public Institutional Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RequestAccessPage } from './pages/public/RequestAccessPage';

// Protected Trading Workspace Pages
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { MarketplacePage } from './pages/marketplace/MarketplacePage';
import { MarketIntelligencePage } from './pages/intelligence/MarketIntelligencePage';
import { SuppliersPage } from './pages/suppliers/SuppliersPage';
import { SupplierVerificationPage } from './pages/verification/SupplierVerificationPage';
import { SupplierOnboardingPage } from './pages/suppliers/SupplierOnboardingPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { AssaysPage } from './pages/assays/AssaysPage';
import { RfqsPage } from './pages/rfqs/RfqsPage';
import { NegotiationsPage } from './pages/negotiations/NegotiationsPage';
import { PurchaseOrdersPage } from './pages/orders/PurchaseOrdersPage';
import { ShipmentsPage } from './pages/shipments/ShipmentsPage';
import { TraceabilityPage } from './pages/traceability/TraceabilityPage';
import { ComplianceCenterPage } from './pages/compliance/ComplianceCenterPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { AuditTrailPage } from './pages/audit/AuditTrailPage';
import { EscrowPage } from './pages/escrow/EscrowPage';
import { InvestmentsPage } from './pages/investments/InvestmentsPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { SettingsPage } from './pages/settings/SettingsPage';

export const router = createBrowserRouter([
  // 1. PUBLIC COMMERCIAL SITE & PORTAL ENTRY
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/request-access',
    element: <RequestAccessPage />
  },

  // 2. PROTECTED INSTITUTIONAL TRADING WORKSPACE
  {
    path: '/workspace',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <OverviewPage />
          },
          {
            path: 'overview',
            element: <Navigate to="/workspace" replace />
          },
          {
            path: 'trade-opportunities',
            element: <MarketplacePage />
          },
          {
            path: 'market-intelligence',
            element: <MarketIntelligencePage />
          },
          {
            path: 'suppliers',
            element: <SuppliersPage />
          },
          {
            path: 'supplier-verification',
            element: <SupplierVerificationPage />
          },
          {
            path: 'supplier-onboarding',
            element: <SupplierOnboardingPage />
          },
          {
            path: 'inventory',
            element: <InventoryPage />
          },
          {
            path: 'assays',
            element: <AssaysPage />
          },
          {
            path: 'rfqs',
            element: <RfqsPage />
          },
          {
            path: 'negotiations',
            element: <NegotiationsPage />
          },
          {
            path: 'purchase-orders',
            element: <PurchaseOrdersPage />
          },
          {
            path: 'shipments',
            element: <ShipmentsPage />
          },
          {
            path: 'traceability',
            element: <TraceabilityPage />
          },
          {
            path: 'compliance',
            element: <ComplianceCenterPage />
          },
          {
            path: 'documents',
            element: <DocumentsPage />
          },
          {
            path: 'audit-trail',
            element: <AuditTrailPage />
          },
          {
            path: 'escrow',
            element: <EscrowPage />
          },
          {
            path: 'investments',
            element: <InvestmentsPage />
          },
          {
            path: 'analytics',
            element: <AnalyticsPage />
          },
          {
            path: 'notifications',
            element: <NotificationsPage />
          },
          {
            path: 'settings',
            element: <SettingsPage />
          }
        ]
      }
    ]
  },

  // 3. LEGACY / DIRECT SHORTCUT REDIRECTS TO PROTECTED WORKSPACE
  { path: '/overview', element: <Navigate to="/workspace" replace /> },
  { path: '/trade-opportunities', element: <Navigate to="/workspace/trade-opportunities" replace /> },
  { path: '/market-intelligence', element: <Navigate to="/workspace/market-intelligence" replace /> },
  { path: '/suppliers', element: <Navigate to="/workspace/suppliers" replace /> },
  { path: '/supplier-verification', element: <Navigate to="/workspace/supplier-verification" replace /> },
  { path: '/supplier-onboarding', element: <Navigate to="/workspace/supplier-onboarding" replace /> },
  { path: '/inventory', element: <Navigate to="/workspace/inventory" replace /> },
  { path: '/assays', element: <Navigate to="/workspace/assays" replace /> },
  { path: '/rfqs', element: <Navigate to="/workspace/rfqs" replace /> },
  { path: '/negotiations', element: <Navigate to="/workspace/negotiations" replace /> },
  { path: '/purchase-orders', element: <Navigate to="/workspace/purchase-orders" replace /> },
  { path: '/shipments', element: <Navigate to="/workspace/shipments" replace /> },
  { path: '/traceability', element: <Navigate to="/workspace/traceability" replace /> },
  { path: '/compliance', element: <Navigate to="/workspace/compliance" replace /> },
  { path: '/documents', element: <Navigate to="/workspace/documents" replace /> },
  { path: '/audit-trail', element: <Navigate to="/workspace/audit-trail" replace /> },
  { path: '/escrow', element: <Navigate to="/workspace/escrow" replace /> },
  { path: '/investments', element: <Navigate to="/workspace/investments" replace /> },
  { path: '/analytics', element: <Navigate to="/workspace/analytics" replace /> },
  { path: '/notifications', element: <Navigate to="/workspace/notifications" replace /> },
  { path: '/settings', element: <Navigate to="/workspace/settings" replace /> },

  // Catch-all route
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
