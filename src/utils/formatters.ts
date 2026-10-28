import { format, parseISO } from 'date-fns';

export function formatCurrency(amount: number, currency: 'USD' | 'EUR' | 'GBP' | 'KRW' = 'USD'): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '$0.00';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (currency === 'KRW') {
    return `₩${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)}`;
  }
  return formatter.format(amount);
}

export function formatQuantity(amount: number, unit: string = 'MT'): string {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(amount)} ${unit}`;
}

export function formatNumber(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(amount);
}

export function formatDate(dateString?: string, formatStr: string = 'MMM dd, yyyy'): string {
  if (!dateString) return '—';
  try {
    return format(parseISO(dateString), formatStr);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '—';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
  } catch {
    return dateString;
  }
}

export function getStatusBadgeClass(status: string): { bg: string; text: string; dot: string } {
  switch (status) {
    case 'Verified':
    case 'Published':
    case 'Confirmed':
    case 'Delivered':
    case 'Released in Simulation':
    case 'Approved in Demo Workflow':
    case 'Fulfilled':
    case 'Completed':
    case 'Verified Qualified':
      return { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-600' };

    case 'Under Review':
    case 'In Transit':
    case 'Funded in Simulation':
    case 'Negotiation':
    case 'Offer Received':
    case 'Submitted':
    case 'Pending Buyer Review':
    case 'Customs Processing':
    case 'Fulfillment in Progress':
    case 'Due Diligence Active':
    case 'Preliminary Review':
    case 'Awaiting Release Conditions':
      return { bg: 'bg-blue-50 border border-blue-200', text: 'text-blue-800', dot: 'bg-blue-600' };

    case 'Additional Information Required':
    case 'Paused':
    case 'Supplier Acknowledgment Pending':
    case 'Release Eligible in Simulation':
    case 'Preparation':
    case 'Ready for Dispatch':
    case 'Awaiting Funding':
    case 'Draft':
    case 'Early Exploration':
      return { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', dot: 'bg-amber-600' };

    case 'Rejected':
    case 'Suspended':
    case 'Declined':
    case 'Cancelled':
    case 'Delayed':
    case 'Disputed':
    case 'Refund Requested':
    case 'Expired':
      return { bg: 'bg-rose-50 border border-rose-200', text: 'text-rose-800', dot: 'bg-rose-600' };

    case 'Fully Allocated':
    case 'Closed':
    case 'Refunded in Simulation':
    case 'Archived':
    default:
      return { bg: 'bg-slate-100 border border-slate-200', text: 'text-slate-700', dot: 'bg-slate-500' };
  }
}

export function formatStatusLabel(status: string): string {
  if (status === 'Approved in Demo Workflow') return 'Approved & Verified';
  if (status === 'Funded in Simulation') return 'Escrow Funded';
  if (status === 'Release Eligible in Simulation') return 'Release Eligible';
  if (status === 'Released in Simulation') return 'Escrow Released';
  if (status === 'Refunded in Simulation') return 'Escrow Refunded';
  return status;
}
