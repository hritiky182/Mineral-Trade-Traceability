import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatDateTime } from '../../utils/formatters';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  ExternalLink,
  CheckCheck,
  Search,
  Filter
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { store, markNotificationRead, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState<string>('all');
  const [onlyUnread, setOnlyUnread] = useState(false);

  const filteredNotifications = store.notifications.filter((n) => {
    if (onlyUnread && n.isRead) return false;
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-rose-600" />;
      case 'info': default: return <Info className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-teal-600" />
            Operational Notification Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time alerts generated from verified milestones, incoming commercial RFQs, and compliance decisions.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-navy-900 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-teal-600" />
          Mark All as Read
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-subtle text-xs">
        <div className="flex items-center gap-2">
          {['all', 'info', 'success', 'warning', 'error'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full font-semibold capitalize transition-colors ${
                filterType === t
                  ? 'bg-navy-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-slate-600 cursor-pointer font-medium">
          <input
            type="checkbox"
            checked={onlyUnread}
            onChange={(e) => setOnlyUnread(e.target.checked)}
            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          Show Unread Only ({store.notifications.filter(n => !n.isRead).length})
        </label>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No notifications match your selected filter criteria.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                notif.isRead ? 'bg-white hover:bg-slate-50/60' : 'bg-teal-50/30 hover:bg-teal-50/50'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-1.5 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-navy-900">{notif.title}</span>
                    {!notif.isRead && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-600 text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {formatDateTime(notif.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {!notif.isRead && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="text-[11px] text-slate-500 hover:text-navy-900 font-medium px-2 py-1"
                  >
                    Mark read
                  </button>
                )}

                {notif.targetLink && (
                  <button
                    onClick={() => {
                      markNotificationRead(notif.id);
                      navigate(notif.targetLink!);
                    }}
                    className="px-3 py-1 rounded bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <span>View Record</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
