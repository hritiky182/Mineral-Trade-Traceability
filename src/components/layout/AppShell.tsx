import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { GlobalSearchModal } from '../navigation/GlobalSearchModal';
import {
  LayoutDashboard,
  Globe2,
  LineChart,
  Building2,
  ShieldCheck,
  Package,
  FileSpreadsheet,
  FileText,
  MessagesSquare,
  FileCheck2,
  Truck,
  Cpu,
  FileLock2,
  FolderArchive,
  History,
  Coins,
  TrendingUp,
  BarChart3,
  Bell,
  Settings,
  ChevronRight,
  ChevronDown,
  Search,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  LogOut,
  Lock,
  Layers
} from 'lucide-react';

export const AppShell: React.FC = () => {
  const { store, activeRole, currentUser, setActiveRole, markNotificationRead, markAllNotificationsRead, logout, sessionInfo } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const unreadNotifications = store.notifications.filter(n => !n.isRead);

  // Dynamic Badges calculated from active store state
  const pendingVerificationsCount = store.suppliers.filter(s => s.verificationStatus === 'Submitted' || s.verificationStatus === 'Under Review').length;
  const activeRfqsCount = store.rfqs.filter(r => r.status === 'Submitted' || r.status === 'Offer Received' || r.status === 'Negotiation').length;
  const inTransitShipmentsCount = store.shipments.filter(s => s.status === 'In Transit' || s.status === 'Customs Processing').length;
  const pendingComplianceCount = store.documents.filter(d => d.reviewStatus === 'Under Review' || d.reviewStatus === 'Submitted').length;

  const roleLabels: Record<UserRole, { title: string; badge: string; color: string }> = {
    admin: { title: 'Platform Administrator', badge: 'MINERALINK Trade Authority', color: 'bg-navy-800 text-white' },
    supplier: { title: 'Mineral Supplier', badge: 'Kafue Mineral Trading Ltd', color: 'bg-teal-700 text-white' },
    buyer: { title: 'International Buyer', badge: 'Hanwha Global Resources (KR)', color: 'bg-blue-700 text-white' },
    compliance: { title: 'Compliance Officer', badge: 'Global Extractive Compliance Unit', color: 'bg-amber-700 text-white' },
    investor: { title: 'Strategic Investor', badge: 'Korea Strategic Metals Fund', color: 'bg-purple-700 text-white' }
  };

  const navGroups = [
    {
      title: 'Workspace',
      items: [
        { path: '/workspace', label: 'Overview', icon: LayoutDashboard },
        { path: '/workspace/trade-opportunities', label: 'Trade Opportunities', icon: Globe2 },
        { path: '/workspace/market-intelligence', label: 'Market Intelligence', icon: LineChart }
      ]
    },
    {
      title: 'Supply Network',
      items: [
        { path: '/workspace/suppliers', label: 'Suppliers', icon: Building2 },
        { path: '/workspace/supplier-verification', label: 'Supplier Verification', icon: ShieldCheck, badge: pendingVerificationsCount, badgeColor: 'bg-amber-500' },
        { path: '/workspace/inventory', label: 'Mineral Inventory', icon: Package },
        { path: '/workspace/assays', label: 'Assay & Quality Reports', icon: FileSpreadsheet }
      ]
    },
    {
      title: 'Trade Operations',
      items: [
        { path: '/workspace/rfqs', label: 'Requests for Quotation', icon: FileText, badge: activeRfqsCount, badgeColor: 'bg-blue-500' },
        { path: '/workspace/negotiations', label: 'Trade Negotiations', icon: MessagesSquare },
        { path: '/workspace/purchase-orders', label: 'Purchase Orders', icon: FileCheck2 },
        { path: '/workspace/shipments', label: 'Shipments & Logistics', icon: Truck, badge: inTransitShipmentsCount, badgeColor: 'bg-teal-600' }
      ]
    },
    {
      title: 'Trust & Compliance',
      items: [
        { path: '/workspace/traceability', label: 'Traceability & Chain of Custody', icon: Cpu },
        { path: '/workspace/compliance', label: 'Compliance Center', icon: FileLock2, badge: pendingComplianceCount, badgeColor: 'bg-rose-500' },
        { path: '/workspace/documents', label: 'Document Repository', icon: FolderArchive },
        { path: '/workspace/audit-trail', label: 'Audit Trail', icon: History }
      ]
    },
    {
      title: 'Trade Finance',
      items: [
        { path: '/workspace/escrow', label: 'Escrow & Settlements', icon: Coins },
        { path: '/workspace/investments', label: 'Mining Opportunities', icon: TrendingUp }
      ]
    },
    {
      title: 'Administration',
      items: [
        { path: '/workspace/analytics', label: 'Analytics & Reports', icon: BarChart3 },
        { path: '/workspace/notifications', label: 'Notification Center', icon: Bell, badge: unreadNotifications.length, badgeColor: 'bg-amber-600' },
        { path: '/workspace/settings', label: 'Platform Settings', icon: Settings }
      ]
    }
  ];

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setIsRoleDropdownOpen(false);
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const getBreadcrumbTitle = (pathname: string) => {
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.path === pathname) return item.label;
      }
    }
    if (pathname.includes('/suppliers/')) return 'Supplier Detail';
    if (pathname.includes('/trade-opportunities/')) return 'Listing Detail';
    if (pathname.includes('/supplier-onboarding')) return 'Supplier Registration Flow';
    return 'Institutional Operations';
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F5F7FA] flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Global Command Palette / Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <div className="flex-1 flex overflow-hidden relative h-full">
        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs z-30 lg:hidden"
          />
        )}

        {/* Left Sidebar - Fixed and Locked */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy-900 border-r border-navy-800 text-slate-300 flex flex-col h-full shrink-0 transition-transform duration-200 ease-in-out lg:static lg:h-full lg:shrink-0 lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-navy-800 flex items-center justify-between bg-navy-900/90 shrink-0">
            <Link to="/workspace" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-500 transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white flex items-center gap-1">
                  MINERALINK
                </span>
                <span className="block text-[9px] text-teal-300 font-medium tracking-wide uppercase">
                  Institutional Gateway
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/workspace' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-teal-600/20 text-teal-300 border-l-2 border-teal-500'
                          : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {typeof item.badge === 'number' && item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white shrink-0 ${item.badgeColor || 'bg-slate-700'}`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Authenticated Tenant Session Footer */}
          <div className="p-3 bg-navy-800/60 border-t border-navy-800 space-y-2 shrink-0">
            <div className="p-2.5 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] font-semibold text-white truncate">{currentUser.name}</span>
                </div>
                <div className="text-[10px] text-teal-400 truncate mt-0.5 font-medium">{currentUser.organizationName}</div>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-navy-800 text-slate-300 border border-navy-700">
                {activeRole}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1">
              <Link to="/" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                <span>Public Portal</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 font-semibold"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Right Main Content Area - Scrollable Workspace */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb Navigation */}
              <nav className="hidden sm:flex items-center text-xs text-slate-500 font-medium">
                <Link to="/workspace" className="hover:text-navy-900 transition-colors">Workspace</Link>
                <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
                <span className="text-navy-900 font-semibold">{getBreadcrumbTitle(location.pathname)}</span>
              </nav>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              {/* Global Search Bar */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-500 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Search suppliers, minerals, POs...</span>
                <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-400 shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Multi-Tenant Organization Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-navy-900 transition-colors shadow-2xs"
                  title="Switch Active Organization Tenant"
                >
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  <span className="hidden sm:inline font-mono text-[11px]">{currentUser.organizationName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Multi-Tenant Enterprise Access
                      </div>
                      <div className="text-xs font-semibold text-navy-900 mt-0.5">
                        Switch Active Organization Profile
                      </div>
                    </div>
                    <div className="py-1 space-y-1">
                      {(['admin', 'supplier', 'buyer', 'compliance', 'investor'] as UserRole[]).map((r) => {
                        const isCurrent = activeRole === r;
                        return (
                          <button
                            key={r}
                            onClick={() => handleRoleChange(r)}
                            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                              isCurrent ? 'bg-teal-50 text-teal-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div>
                              <div className="font-semibold">{roleLabels[r].title}</div>
                              <div className="text-[10px] text-slate-500 font-normal">{roleLabels[r].badge}</div>
                            </div>
                            {isCurrent && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Bell Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                  className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                  )}
                </button>

                {isNotifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="font-semibold text-xs text-navy-900">
                        Platform Notifications ({unreadNotifications.length} unread)
                      </div>
                      {unreadNotifications.length > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-teal-600 hover:text-teal-700 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                      {store.notifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.targetLink) {
                              navigate(n.targetLink);
                              setIsNotifDropdownOpen(false);
                            }
                          }}
                          className={`p-2.5 text-xs rounded-lg cursor-pointer transition-colors ${
                            n.isRead ? 'opacity-70 hover:bg-slate-50' : 'bg-teal-50/40 hover:bg-teal-50'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold text-navy-900">
                            <span>{n.title}</span>
                            {!n.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2 border-t border-slate-100 text-center">
                      <NavLink
                        to="/workspace/notifications"
                        onClick={() => setIsNotifDropdownOpen(false)}
                        className="text-xs text-teal-600 hover:text-teal-700 font-medium block"
                      >
                        View all notification center →
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Avatar & Sign Out */}
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-8 h-8 rounded-full bg-navy-800 text-white font-bold text-xs flex items-center justify-center border-2 border-teal-500 shadow-xs hover:ring-2 hover:ring-teal-400 transition-all"
                  title="Account Profile"
                >
                  {currentUser.name.charAt(0)}
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-bold text-xs text-navy-900">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className="text-[10px] text-teal-700 font-semibold mt-1">{currentUser.organizationName}</div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/workspace/settings"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Platform Settings</span>
                      </Link>
                      <Link
                        to="/"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        <span>View Public Website</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Institutional Portal</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Page Workspace */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </main>

          {/* Enterprise Platform Footer */}
          <footer className="mt-auto shrink-0 px-6 py-4 bg-white border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-navy-900">MINERALINK</span>
              <span>•</span>
              <span>Verified Minerals. Transparent Trade. Global Opportunities.</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Institutional Gateway: TLS 1.3 Active
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">Statutory Mining Framework Aligned</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
