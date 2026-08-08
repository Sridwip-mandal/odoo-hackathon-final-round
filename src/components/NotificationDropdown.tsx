import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Car, CreditCard, Shield, AlertCircle, Trash2 } from 'lucide-react';
import { storage } from '../utils/storage';
import { NotificationItem } from '../types';

export const NotificationDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const notifications = storage.getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif: NotificationItem) => {
    storage.markNotificationRead(notif.id);
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAllRead = () => {
    storage.markAllNotificationsRead();
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'ride':
        return <Car className="w-4 h-4 text-blue-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'vehicle':
        return <Shield className="w-4 h-4 text-purple-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-lg animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 animate-slide-up">
          <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950/60 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 py-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No notifications yet</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition ${
                    notif.read ? 'hover:bg-slate-800/50 opacity-80' : 'bg-blue-950/20 hover:bg-blue-900/30'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/80 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-500">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                  </div>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>}
                </div>
              ))
            )}
          </div>

          <div className="p-2 text-center border-t border-slate-800">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/my-trips');
              }}
              className="text-xs text-slate-400 hover:text-white font-medium"
            >
              View Active Trips & Alerts →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
