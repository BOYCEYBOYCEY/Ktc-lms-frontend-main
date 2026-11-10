import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentLedger, getPaymentAnalytics, getParentChildren } from '../../lib/dataHelpers';
import { useAuth } from '../../context/AuthContext';
import { Download, Filter, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ParentLedger = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('all');
  const [searchDate, setSearchDate] = useState('');

  const parentPhone = user?.parentPhone || user?.phone;

  console.log('🔍 ParentLedger Debug:', { parentPhone, user });

  const parentChildren = parentPhone ? getParentChildren(parentPhone) : [];
  console.log('👶 Parent children found:', parentChildren);

  const resolvedStudentId = studentId ? parseInt(studentId) : parentChildren[0]?.id;
  console.log('📚 Resolved student ID:', resolvedStudentId);

  const [selectedChild, setSelectedChild] = useState(resolvedStudentId);

  // Update selectedChild if it's not set yet
  useEffect(() => {
    if (!selectedChild && resolvedStudentId) {
      setSelectedChild(resolvedStudentId);
    }
  }, [resolvedStudentId, selectedChild]);

  if (!parentPhone) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Parent phone not found in user data</p>
        <p className="text-xs">Debug: {JSON.stringify(user)}</p>
      </div>
    );
  }

  if (parentChildren.length === 0) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>No children found for phone {parentPhone}</p>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>No child selected. Available: {parentChildren.map(c => c.id).join(', ')}</p>
      </div>
    );
  }

  const ledger = getStudentLedger(selectedChild);
  console.log('📄 Ledger for student', selectedChild, ':', ledger);

  if (ledger && ledger.ledgerEntries) {
    console.log('📅 Transaction dates:', ledger.ledgerEntries.map(e => e.date));
  }

  const analytics = getPaymentAnalytics(selectedChild);

  if (!ledger) return (
    <div className="text-center py-8 text-red-500">
      <p>Student data not found</p>
    </div>
  );

  // Filter entries
  const filteredEntries = useMemo(() => {
    let filtered = ledger.ledgerEntries;

    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.type === filterType);
    }

    if (searchDate) {
      // searchDate format is "YYYY-MM" from month input
      // entry.date format is "YYYY-MM-DD"
      filtered = filtered.filter(e => e.date && e.date.startsWith(searchDate));
      console.log('📅 Date filter applied:', searchDate, 'Found:', filtered.length, 'entries');
    }

    return filtered;
  }, [filterType, searchDate, ledger.ledgerEntries]);

  const downloadPDF = () => {
    try {
      console.log('📄 Starting PDF generation...');
      console.log('jsPDF available:', typeof jsPDF);

      if (!jsPDF) {
        throw new Error('jsPDF is not loaded');
      }

      const doc = new jsPDF();
      console.log('✅ jsPDF instance created');

      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header
      doc.setFontSize(16);
      doc.text('Fee Ledger Statement', 20, yPosition);
      doc.setFontSize(10);
      yPosition += 10;

      // Student & Summary Info
      doc.setFontSize(11);
      doc.text(`Student: ${ledger.student.name || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Class: ${ledger.student.class || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Academic Year: 2026-27`, 20, yPosition);
      yPosition += 10;

      // Summary Box
      doc.setDrawColor(200);
      doc.rect(20, yPosition, 170, 30);
      doc.setFontSize(9);
      const totalCharged = isNaN(ledger.summary.totalCharged) ? 0 : Math.round(ledger.summary.totalCharged);
      const totalPaid = isNaN(ledger.summary.totalPaid) ? 0 : Math.round(ledger.summary.totalPaid);
      const currentBalance = isNaN(ledger.summary.currentBalance) ? 0 : Math.round(ledger.summary.currentBalance);

      doc.text(`Total Charged: Rs.${totalCharged}`, 25, yPosition + 6);
      doc.text(`Total Paid: Rs.${totalPaid}`, 25, yPosition + 12);
      doc.text(`Current Balance: Rs.${currentBalance}`, 25, yPosition + 18);
      doc.text(`Status: ${(ledger.summary.paymentStatus || 'UNKNOWN').toUpperCase()}`, 25, yPosition + 24);
      yPosition += 35;

      console.log('✅ PDF header and summary added');

      // Ledger Table
      const tableData = filteredEntries.map(entry => [
        entry.date || 'N/A',
        (entry.description || 'N/A').substring(0, 30),
        entry.debit && !isNaN(entry.debit) ? `Rs.${Math.round(entry.debit)}` : '-',
        entry.credit && !isNaN(entry.credit) ? `Rs.${Math.round(entry.credit)}` : '-',
        entry.runningBalance && !isNaN(entry.runningBalance) ? `Rs.${Math.round(entry.runningBalance)}` : '-',
      ]);

      console.log('✅ Table data prepared:', tableData.length, 'rows');

      // Check if autoTable is available
      if (typeof doc.autoTable !== 'function') {
        console.warn('⚠️ autoTable not available, using simple text table');
        // Fallback: just save without table
        doc.text('Transaction details omitted', 20, yPosition);
        doc.save(`Ledger_${ledger.student.name || 'Student'}_${new Date().toISOString().split('T')[0]}.pdf`);
        console.log('✅ PDF saved (without table)');
        alert('PDF downloaded successfully (table feature unavailable)');
        return;
      }

      doc.autoTable({
        startY: yPosition,
        head: [['Date', 'Description', 'Debit', 'Credit', 'Balance']],
        body: tableData.length > 0 ? tableData : [['No transactions', '', '', '', '']],
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [66, 139, 202] },
        didDrawPage: () => {
          const pageCount = doc.internal.pages.length;
          doc.setFontSize(8);
          doc.text(`Page ${pageCount - 1}`, doc.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });
        },
      });

      console.log('✅ Table added to PDF');

      const filename = `Ledger_${(ledger.student.name || 'Student').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      console.log('✅ PDF saved:', filename);
      alert('PDF downloaded successfully!');
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      console.error('Error stack:', error.stack);
      alert(`Failed to generate PDF: ${error.message}\nCheck console for details.`);
    }
  };

  const downloadCSV = () => {
    try {
      let csv = 'Date,Type,Description,Debit,Credit,Balance\n';
      filteredEntries.forEach(entry => {
        const debit = isNaN(entry.debit) ? 0 : entry.debit;
        const credit = isNaN(entry.credit) ? 0 : entry.credit;
        const balance = isNaN(entry.runningBalance) ? 0 : entry.runningBalance;
        csv += `${entry.date || 'N/A'},${entry.type || 'N/A'},"${(entry.description || 'N/A').replace(/"/g, '""')}",${debit},${credit},${balance}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Ledger_${ledger.student.name || 'Student'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('CSV generation failed:', error);
      alert('Failed to generate CSV. Check console for errors.');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      fee_charge: 'bg-red-50 border-red-200',
      payment: 'bg-green-50 border-green-200',
      waiver: 'bg-blue-50 border-blue-200',
      late_fee: 'bg-orange-50 border-orange-200',
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  const getTypeIcon = (type) => {
    const icons = {
      fee_charge: '📋',
      payment: '✅',
      waiver: '🎓',
      late_fee: '⚠️',
    };
    return icons[type] || '•';
  };

  return (
    <div className="space-y-6">
      {/* Header with Child Selector */}
      {parentChildren.length > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Child</label>
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(parseInt(e.target.value))}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md"
          >
            {parentChildren.map(child => (
              <option key={child.id} value={child.id}>
                {child.name} ({child.class})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Header with Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Charged</p>
          <p className="text-2xl font-bold text-gray-900">₹{isNaN(ledger.summary.totalCharged) ? '0' : Math.round(ledger.summary.totalCharged)}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">₹{isNaN(ledger.summary.totalPaid) ? '0' : Math.round(ledger.summary.totalPaid)}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Waivers Applied</p>
          <p className="text-2xl font-bold text-blue-600">₹{isNaN(ledger.summary.totalWaived) ? '0' : Math.round(ledger.summary.totalWaived)}</p>
        </div>

        <div className={`p-4 rounded-lg border shadow-sm ${
          (isNaN(ledger.summary.currentBalance) ? 0 : ledger.summary.currentBalance) === 0
            ? 'bg-green-50 border-green-300'
            : 'bg-orange-50 border-orange-300'
        }`}>
          <p className="text-sm text-gray-600 mb-1">Current Balance</p>
          <p className={`text-2xl font-bold ${
            (isNaN(ledger.summary.currentBalance) ? 0 : ledger.summary.currentBalance) === 0 ? 'text-green-600' : 'text-orange-600'
          }`}>
            ₹{isNaN(ledger.summary.currentBalance) ? '0' : Math.round(ledger.summary.currentBalance)}
          </p>
        </div>
      </div>

      {/* Payment Analytics */}
      {analytics && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Payment Behavior</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">{analytics.behavior === 'on_time_payer' ? '✓ Regular Payer' : '⚠ Late Payer'}</span> -
                  {analytics.totalPayments} payments made
                </p>
                <p className="text-gray-600">
                  On-time: {analytics.onTimePayments} | Late: {analytics.latePayments}
                  {analytics.averageDaysLate > 0 && ` (avg ${analytics.averageDaysLate} days late)`}
                </p>
              </div>
            </div>
            <div className="text-3xl">
              {analytics.behavior === 'on_time_payer' ? '✅' : '📊'}
            </div>
          </div>
        </div>
      )}

      {/* Filters & Downloads */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Transactions</option>
                <option value="fee_charge">Fee Charges</option>
                <option value="payment">Payments</option>
                <option value="waiver">Waivers</option>
                <option value="late_fee">Late Fees</option>
              </select>
            </div>

            <input
              type="month"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Filter by date"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition text-sm font-medium"
            >
              <Download size={16} /> PDF
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition text-sm font-medium"
            >
              <Download size={16} /> CSV
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Entries */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>

        {filteredEntries.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No transactions found for selected filter</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className={`p-4 rounded-lg border ${getTypeColor(entry.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{getTypeIcon(entry.type)}</span>
                      <p className="font-medium text-gray-900">{entry.description}</p>
                      <span className="text-xs text-gray-500 ml-auto">{entry.date}</span>
                    </div>

                    {entry.details && (
                      <div className="text-xs text-gray-600 mt-2 ml-7">
                        {entry.details.transactionId && (
                          <p>Transaction ID: {entry.details.transactionId}</p>
                        )}
                        {entry.details.method && <p>Method: {entry.details.method}</p>}
                        {entry.details.reason && <p>Reason: {entry.details.reason}</p>}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1 ml-4">
                    {!isNaN(entry.debit) && entry.debit > 0 && (
                      <p className="text-red-600 font-semibold">+₹{Math.round(entry.debit)}</p>
                    )}
                    {!isNaN(entry.credit) && entry.credit > 0 && (
                      <p className="text-green-600 font-semibold">−₹{Math.round(entry.credit)}</p>
                    )}
                    <p className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded">
                      Balance: ₹{isNaN(entry.runningBalance) ? '0' : Math.round(entry.runningBalance)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">Legend</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <span className="text-gray-700">Fee Charge</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="text-gray-700">Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <span className="text-gray-700">Scholarship/Waiver</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span className="text-gray-700">Late Fee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentLedger;
