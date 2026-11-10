import React, { useState, useMemo } from 'react';
import { getAllFamilyLedgers } from '../../lib/dataHelpers';
import { Search, AlertTriangle, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const AdminLedgerViewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('balance_desc');
  const [filterBehavior, setFilterBehavior] = useState('all');
  const [expandedFamily, setExpandedFamily] = useState(null);

  const allLedgers = getAllFamilyLedgers();

  // Filter and sort families
  const filteredFamilies = useMemo(() => {
    let families = Object.values(allLedgers);

    // Search filter
    if (searchTerm) {
      families = families.filter(f =>
        f.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.parentPhone.includes(searchTerm)
      );
    }

    // Behavior filter
    if (filterBehavior !== 'all') {
      families = families.filter(f => f.paymentTrend === filterBehavior);
    }

    // Sort
    switch (sortBy) {
      case 'balance_desc':
        return families.sort((a, b) => b.totalBalance - a.totalBalance);
      case 'balance_asc':
        return families.sort((a, b) => a.totalBalance - b.totalBalance);
      case 'name':
        return families.sort((a, b) => a.parentName.localeCompare(b.parentName));
      case 'overdue':
        return families.sort((a, b) => {
          const bOverdue = b.familyLedger.filter(e => e.type === 'late_fee').length;
          const aOverdue = a.familyLedger.filter(e => e.type === 'late_fee').length;
          return bOverdue - aOverdue;
        });
      default:
        return families;
    }
  }, [allLedgers, searchTerm, sortBy, filterBehavior]);

  // Summary statistics
  const summary = useMemo(() => {
    const families = Object.values(allLedgers);
    const totalBalance = families.reduce((sum, f) => sum + f.totalBalance, 0);
    const latePayers = families.filter(f => f.paymentTrend === 'late_payer').length;
    const noPayers = families.filter(f => f.paymentTrend === 'no_payment').length;
    const avgBalance = families.length > 0 ? Math.round(totalBalance / families.length) : 0;

    return { totalBalance, latePayers, noPayers, avgBalance, totalFamilies: families.length };
  }, [allLedgers]);

  const downloadReconciliation = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    doc.setFontSize(16);
    doc.text('Fee Collection Reconciliation Report', 20, yPosition);
    doc.setFontSize(10);
    yPosition += 10;

    // Summary
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Total Outstanding Balance: ₹${summary.totalBalance}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Late Payers: ${summary.latePayers} | Never Paid: ${summary.noPayers}`, 20, yPosition);
    yPosition += 10;

    // Family details
    const tableData = filteredFamilies.map(family => [
      family.parentName,
      family.children.map(c => c.name).join(', '),
      `₹${family.totalBalance}`,
      family.paymentTrend === 'late_payer' ? '⚠ Late' : family.paymentTrend === 'no_payment' ? '❌ Never' : '✓ Regular',
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Parent Name', 'Children', 'Balance', 'Status']],
      body: tableData,
      theme: 'grid',
      fontSize: 9,
    });

    doc.save(`Reconciliation_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Outstanding</p>
          <p className="text-2xl font-bold text-orange-600">₹{summary.totalBalance}</p>
          <p className="text-xs text-gray-500 mt-1">{summary.totalFamilies} families</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Late Payers</p>
          <p className="text-2xl font-bold text-red-600">{summary.latePayers}</p>
          <p className="text-xs text-gray-500 mt-1">Need immediate attention</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Never Paid</p>
          <p className="text-2xl font-bold text-red-700">{summary.noPayers}</p>
          <p className="text-xs text-gray-500 mt-1">Urgent action required</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Average Balance</p>
          <p className="text-2xl font-bold text-gray-900">₹{summary.avgBalance}</p>
          <p className="text-xs text-gray-500 mt-1">Per family</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
          <div className="flex-1 flex gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            {/* Behavior Filter */}
            <select
              value={filterBehavior}
              onChange={(e) => setFilterBehavior(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Behaviors</option>
              <option value="regular_payer">Regular Payers</option>
              <option value="late_payer">Late Payers</option>
              <option value="no_payment">Never Paid</option>
            </select>
          </div>

          {/* Sort & Export */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="balance_desc">Highest Balance First</option>
              <option value="balance_asc">Lowest Balance First</option>
              <option value="name">Name A-Z</option>
              <option value="overdue">Most Overdue</option>
            </select>

            <button
              onClick={downloadReconciliation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition text-sm font-medium"
            >
              <Download size={16} /> Report
            </button>
          </div>
        </div>
      </div>

      {/* Family Ledgers List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Family Accounts ({filteredFamilies.length})</h3>

        {filteredFamilies.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No families match your filters</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFamilies.map((family) => {
              const isExpanded = expandedFamily === family.parentPhone;
              const recentPayments = family.familyLedger
                .filter(e => e.type === 'payment')
                .slice(-3)
                .reverse();

              const behaviorBg = {
                'regular_payer': 'bg-green-50 border-green-200',
                'late_payer': 'bg-orange-50 border-orange-200',
                'no_payment': 'bg-red-50 border-red-200',
              };

              const behaviorIcon = {
                'regular_payer': '✓',
                'late_payer': '⚠',
                'no_payment': '❌',
              };

              return (
                <div
                  key={family.parentPhone}
                  className={`border rounded-lg transition ${behaviorBg[family.paymentTrend] || 'bg-gray-50 border-gray-200'}`}
                >
                  <button
                    onClick={() =>
                      setExpandedFamily(isExpanded ? null : family.parentPhone)
                    }
                    className="w-full p-4 flex items-center justify-between hover:bg-opacity-60"
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-semibold">
                          {behaviorIcon[family.paymentTrend]}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900">{family.parentName}</p>
                          <p className="text-xs text-gray-600">{family.parentPhone}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 ml-10">
                        {family.children.map(c => `${c.name} (${c.class})`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 ml-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ₹{family.totalBalance}
                        </p>
                        <p className="text-xs text-gray-600">Outstanding</p>
                      </div>
                      <div className="text-2xl">
                        {isExpanded ? '▼' : '▶'}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t px-4 py-4 space-y-4">
                      {/* Child breakdown */}
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">STUDENTS</p>
                        <div className="space-y-2">
                          {family.children.map(child => (
                            <div
                              key={child.id}
                              className="flex justify-between items-center text-sm bg-white bg-opacity-40 p-2 rounded"
                            >
                              <span className="text-gray-900">{child.name}</span>
                              <span className="font-semibold">₹{child.balance}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent transactions */}
                      {recentPayments.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            RECENT PAYMENTS ({recentPayments.length})
                          </p>
                          <div className="space-y-1">
                            {recentPayments.map((payment, idx) => (
                              <div
                                key={idx}
                                className="text-xs flex justify-between bg-white bg-opacity-40 p-2 rounded"
                              >
                                <span className="text-gray-700">{payment.date}</span>
                                <span className="text-green-600 font-medium">
                                  −₹{payment.credit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Payment trend */}
                      <div className="pt-2 border-t">
                        <p className="text-xs font-semibold text-gray-700 mb-2">PAYMENT BEHAVIOR</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 text-xs">
                            <p className="text-gray-700">
                              {family.paymentTrend === 'regular_payer'
                                ? '✓ Regular payment history'
                                : family.paymentTrend === 'late_payer'
                                  ? '⚠ Pattern of late payments'
                                  : '❌ No payments made yet'}
                            </p>
                          </div>
                          {family.paymentTrend === 'late_payer' && (
                            <button className="px-2 py-1 text-xs bg-orange-200 text-orange-900 rounded hover:bg-orange-300">
                              Send Reminder
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <p className="font-medium mb-1">💡 How to use this view:</p>
        <ul className="space-y-1 text-xs list-disc list-inside">
          <li><strong>Sort by Balance:</strong> Find families with highest outstanding amounts</li>
          <li><strong>Filter by Behavior:</strong> Identify late payers and those who never paid</li>
          <li><strong>Expand Family:</strong> See detailed breakdown by student and recent payment history</li>
          <li><strong>Export Report:</strong> Generate PDF for finance team reconciliation</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminLedgerViewer;
