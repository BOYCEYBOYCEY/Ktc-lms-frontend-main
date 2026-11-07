import React from "react";
import { CheckCircle, Clock, BookOpen, FileText } from "lucide-react";

const getActivityIcon = (action) => {
  if (action.includes("attendance")) return <CheckCircle className="w-4 h-4 text-green-600" />;
  if (action.includes("marks")) return <FileText className="w-4 h-4 text-blue-600" />;
  if (action.includes("assignment")) return <BookOpen className="w-4 h-4 text-purple-600" />;
  return <Clock className="w-4 h-4 text-gray-600" />;
};

const getTimeAgo = (timestamp) => {
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
};

export default function TeacherActivityFeed({ activities }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Teacher Activity
        </h3>
        <span className="text-xs text-gray-500">Latest updates</span>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0"
          >
            {/* Icon */}
            <div className="pt-1">{getActivityIcon(activity.action)}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {activity.teacher}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Class: {activity.class}
                  </p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {getTimeAgo(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
