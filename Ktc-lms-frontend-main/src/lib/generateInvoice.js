import jsPDF from "jspdf";
import "jspdf-autotable";

const schoolDetails = {
  name: "Kendriya Vidyalaya",
  address: "123 Education Lane, New Delhi - 110001",
  phone: "011-4567-8900",
  email: "info@kvschool.edu.in",
};

export const generateFeeInvoice = (student, feeData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(25, 118, 210);
  doc.text(schoolDetails.name, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("FEE INVOICE", pageWidth / 2, yPosition, { align: "center", style: "bold" });
  yPosition += 7;

  // School details
  doc.setFontSize(8);
  doc.text(schoolDetails.address, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 4;
  doc.text(`${schoolDetails.phone} | ${schoolDetails.email}`, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  // Horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPosition, pageWidth - 15, yPosition);
  yPosition += 5;

  // Invoice details
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  const invoiceNo = `INV-${student.admissionNo}-${new Date().getFullYear()}`;
  const today = new Date().toLocaleDateString("en-IN");

  doc.text(`Invoice No: ${invoiceNo}`, 15, yPosition);
  doc.text(`Date: ${today}`, pageWidth - 50, yPosition);
  yPosition += 6;

  doc.text(`Due Date: ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")}`, pageWidth - 50, yPosition);
  yPosition += 8;

  // Student Details Box
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(15, yPosition, pageWidth - 30, 30);

  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.text("STUDENT DETAILS", 18, yPosition + 4);

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  yPosition += 8;
  doc.text(`Name: ${student.name}`, 18, yPosition);
  doc.text(`Admission No: ${student.admissionNo}`, pageWidth / 2 + 5, yPosition);
  yPosition += 5;
  doc.text(`Class: ${student.class}`, 18, yPosition);
  doc.text(`Roll No: ${student.rollNo}`, pageWidth / 2 + 5, yPosition);
  yPosition += 12;

  // Fee Breakdown Table
  const tableData = [
    ["Description", "Amount (₹)"],
    ["Base Tuition Fee", `${feeData.baseFee.toLocaleString()}`],
  ];

  // Add add-ons
  feeData.addOns.forEach(addon => {
    const addOnData = {
      bus: 12000,
      sports: 8000,
      music: 6000,
      coding: 10000,
    };
    tableData.push([`  • ${addon.charAt(0).toUpperCase() + addon.slice(1)}`, `${(addOnData[addon] || 0).toLocaleString()}`]);
  });

  tableData.push(
    ["", ""],
    ["Subtotal", `${feeData.subtotal.toLocaleString()}`],
  );

  if (feeData.discountAmount > 0) {
    tableData.push(["Payment Plan Discount (-10%)", `-${feeData.discountAmount.toLocaleString()}`]);
  }

  if (feeData.siblingDiscountAmount > 0) {
    tableData.push(["Sibling Discount", `-${feeData.siblingDiscountAmount.toLocaleString()}`]);
  }

  if (feeData.waiverDiscountAmount > 0) {
    tableData.push(["Scholarship/Waiver", `-${feeData.waiverDiscountAmount.toLocaleString()}`]);
  }

  tableData.push(
    ["", ""],
    ["TOTAL DUE", `${feeData.finalAmount.toLocaleString()}`]
  );

  doc.autoTable({
    startY: yPosition,
    head: [tableData[0]],
    body: tableData.slice(1),
    headStyles: {
      fillColor: [25, 118, 210],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: {
      textColor: 0,
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: pageWidth - 60 },
      1: { halign: "right", cellWidth: 45 },
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 15, right: 15 },
  });

  yPosition = doc.lastAutoTable.finalY + 8;

  // Terms & Conditions
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("PAYMENT TERMS & CONDITIONS:", 15, yPosition);
  yPosition += 4;
  doc.setFontSize(7);
  const terms = [
    "• Late payment fee: ₹50 per day after due date (max ₹1,500)",
    "• Payment can be made online through UPI, Net Banking, or Card",
    "• For any queries, contact the office: " + schoolDetails.phone,
    "• This is an electronically generated document",
  ];
  terms.forEach(term => {
    doc.text(term, 15, yPosition);
    yPosition += 3;
  });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for your payment | Kendriya Vidyalaya", pageWidth / 2, pageHeight - 10, { align: "center" });

  // Save
  doc.save(`invoice-${student.admissionNo}.pdf`);
};

export const generateChallan = (student, amount) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 15;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(25, 118, 210);
  doc.text(schoolDetails.name, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("FEE PAYMENT CHALLAN", pageWidth / 2, yPosition, { align: "center", style: "bold" });
  yPosition += 3;

  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text("(To be submitted with payment at bank)", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  // Challan details
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  const challanNo = `CHL-${student.admissionNo}-${new Date().getFullYear()}`;

  doc.text(`Challan No: ${challanNo}`, 15, yPosition);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, pageWidth - 50, yPosition);
  yPosition += 6;

  // Box with student details
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(1);
  doc.rect(15, yPosition, pageWidth - 30, 35);

  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.text("STUDENT DETAILS FOR PAYMENT", 18, yPosition + 4);

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");

  const details = [
    [`Student Name:`, `${student.name}`],
    [`Class:`, `${student.class}`],
    [`Admission No:`, `${student.admissionNo}`],
    [`Amount Due:`, `₹${amount.toLocaleString()}`],
    [`Parent Phone:`, `${student.parentPhone}`],
  ];

  yPosition += 8;
  details.forEach((detail, idx) => {
    doc.text(detail[0], 18, yPosition);
    if (idx < 3) {
      doc.text(detail[1], pageWidth / 2, yPosition);
    } else {
      doc.setTextColor(200, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text(detail[1], pageWidth / 2, yPosition, { fontSize: 11 });
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "normal");
    }
    yPosition += 5;
  });

  yPosition += 10;

  // Instructions
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text("BANK PAYMENT INSTRUCTIONS:", 15, yPosition, { style: "bold" });
  yPosition += 6;

  const instructions = [
    "1. This challan should be submitted at any branch of State Bank of India",
    "2. Bank details:",
    "   • Account Name: Kendriya Vidyalaya",
    "   • Account No: 12345678901234",
    "   • IFSC Code: SBIN0001234",
    "3. Keep the bank receipt for reference",
    "4. Do not write anything on the reverse side of this challan",
    "5. Online payment can be made directly from the parent portal",
  ];

  doc.setFontSize(8);
  instructions.forEach(instr => {
    doc.text(instr, 15, yPosition);
    yPosition += 4;
  });

  yPosition += 5;

  // Footer box
  doc.setDrawColor(25, 118, 210);
  doc.setLineWidth(1);
  doc.rect(15, yPosition, pageWidth - 30, 12);
  doc.setFillColor(230, 240, 255);
  doc.rect(15, yPosition, pageWidth - 30, 12, "F");

  doc.setFontSize(7);
  doc.setTextColor(25, 118, 210);
  doc.text("For any queries, contact: " + schoolDetails.phone, pageWidth / 2, yPosition + 4, { align: "center" });
  doc.text(schoolDetails.email, pageWidth / 2, yPosition + 8, { align: "center" });

  // Save
  doc.save(`challan-${student.admissionNo}.pdf`);
};
