import { AlertTriangle, TrendingUp, Users, CheckCircle } from "lucide-react";

export default function InterventionStats({ atRiskStudents }) {
  const criticalCount = atRiskStudents.filter(
    (s) => s.severity === "critical"
  ).length;

  // Calculate most common reason
  const reasonCounts = {};
  atRiskStudents.forEach((student) => {
    student.reasons.forEach((reason) => {
      const shortReason = reason.split("(")[0].trim();
      reasonCounts[shortReason] = (reasonCounts[shortReason] || 0) + 1;
    });
  });
  const topReason = Object.entries(reasonCounts).sort(
    ([, a], [, b]) => b - a
  )[0];

  // Average marks of at-risk
  const avgMarks = Math.round(
    atRiskStudents.reduce((sum, s) => sum + s.currentAvgMarks, 0) /
      atRiskStudents.length
  );

  const avgAttendance = Math.round(
    atRiskStudents.reduce((sum, s) => sum + s.attendance, 0) /
      atRiskStudents.length
  );

  return (
    <div className="space-y-4">
      {/* Urgency Alert */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-start justify-between mb-3">
          <AlertTriangle className="w-6 h-6" />
          <span className="text-2xl font-bold">{criticalCount}</span>
        </div>
        <h3 className="font-semibold">Critical Cases</h3>
        <p className="text-xs text-red-100 mt-1">
          Require immediate intervention
        </p>
      </div>

      {/* Top Issues */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Top Issue</h3>
        <div className="space-y-2">
          <div className="flex items-start">
            <TrendingUp className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {topReason?.[0] || "N/A"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Affects {topReason?.[1] || 0} students
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Group Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Group Metrics</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Avg Marks</span>
              <span className="font-bold text-gray-800">{avgMarks}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-red-600"
                style={{ width: `${avgMarks}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Avg Attendance</span>
              <span className="font-bold text-gray-800">{avgAttendance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-orange-600"
                style={{ width: `${avgAttendance}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-blue-50 rounded-lg shadow p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          Quick Actions
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2 font-bold">1.</span>
            <span>Schedule parent calls for critical cases</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 font-bold">2.</span>
            <span>Arrange peer tutoring sessions</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 font-bold">3.</span>
            <span>Monitor attendance next week</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
