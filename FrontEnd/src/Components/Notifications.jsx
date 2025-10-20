import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Clock, Trophy, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { useNotifications } from './NotificationContext';

const Notifications = ({ contestId }) => {
  const { notifications, markAsRead, markAllAsRead, getUnreadCount, getNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');

  const getFeatureIcon = (feature) => {
    switch (feature) {
      case 'highlights': return <Trophy className="w-4 h-4" />;
      case 'zeeClash': return <Target className="w-4 h-4" />;
      case 'zeePrediction': return <TrendingUp className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getFeatureColor = (feature) => {
    switch (feature) {
      case 'highlights': return 'text-teal-600 bg-teal-50 border-teal-200';
      case 'zeeClash': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'zeePrediction': return 'text-cyan-600 bg-cyan-50 border-cyan-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now - notificationTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const filteredNotifications = activeTab === 'all'
    ? notifications
    : getNotifications(activeTab);

  const tabs = [
    { id: 'all', label: 'All', count: notifications.filter(n => !n.read).length },
    { id: 'highlights', label: 'Highlights', count: getUnreadCount('highlights') },
    { id: 'zeeClash', label: 'Zee Clash', count: getUnreadCount('zeeClash') },
    { id: 'zeePrediction', label: 'Predictions', count: getUnreadCount('zeePrediction') }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
        <p className="text-gray-600 text-sm">Stay updated with Zee's latest insights</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 relative py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {tab.count > 9 ? '9+' : tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Mark All Read Button */}
      {filteredNotifications.some(n => !n.read) && (
        <button
          onClick={() => markAllAsRead(activeTab === 'all' ? null : activeTab)}
          className="flex items-center space-x-2 text-sm text-cyan-600 hover:text-cyan-700 font-medium"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>
      )}

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications yet</p>
            <p className="text-sm text-gray-400">Check back when Zee has updates!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`relative p-4 rounded-lg border transition-all ${
                notification.read
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-300 shadow-sm'
              }`}
            >
              {/* Unread indicator */}
              {!notification.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-l-lg" />
              )}

              <div className="flex items-start space-x-3">
                {/* Feature Icon */}
                <div className={`p-2 rounded-full border ${getFeatureColor(notification.feature)}`}>
                  {getFeatureIcon(notification.feature)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {notification.feature === 'highlights' ? 'Highlights' :
                       notification.feature === 'zeeClash' ? 'Zee Clash' :
                       notification.feature === 'zeePrediction' ? 'Predictions' : 'Zee'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 leading-relaxed">
                    {notification.message}
                  </p>

                  {/* Mark as read button */}
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="mt-2 flex items-center space-x-1 text-xs text-cyan-600 hover:text-cyan-700"
                    >
                      <Check className="w-3 h-3" />
                      <span>Mark as read</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Notifications are kept for 24 hours
        </p>
      </div>
    </div>
  );
};

export default Notifications;
