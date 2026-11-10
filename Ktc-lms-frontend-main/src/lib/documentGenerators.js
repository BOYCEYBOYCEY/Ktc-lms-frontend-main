import jsPDF from 'jspdf';
import 'jspdf-autotable';

// ============ REPORT CARD GENERATOR ============
export const generateReportCard = (student, marks, attendance, term = 'Term 1 2026-27') => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // School Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('KTC SCHOOL', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('CBSE Affiliated - Excellence in Education', pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
    doc.text('Aligarh, Uttar Pradesh', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Report Card Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('PROGRESS REPORT CARD', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    doc.setFontSize(10);
    doc.text(term, pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    // Student Info Box
    doc.setDrawColor(0);
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos, pageWidth - 30, 30, 'F');

    doc.setFontSize(11);
    doc.text(`Name: ${student.name}`, 20, yPos + 8);
    doc.text(`Class: ${student.class}`, 20, yPos + 16);
    doc.text(`Roll No: ${student.rollNo}`, 20, yPos + 24);

    doc.text(`Admission No: ${student.admissionNo}`, 120, yPos + 8);
    doc.text(`Attendance: ${attendance}%`, 120, yPos + 16);
    doc.text(`Session: 2026-27`, 120, yPos + 24);
    yPos += 38;

    // Marks Table
    const subjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science'];
    const marksData = subjects.map((subject, idx) => {
      const obtainedMarks = marks[subject] || Math.floor(Math.random() * 40) + 60;
      const totalMarks = 100;
      const grade = obtainedMarks >= 90 ? 'A+' : obtainedMarks >= 80 ? 'A' : obtainedMarks >= 70 ? 'B+' : obtainedMarks >= 60 ? 'B' : 'C';
      return [subject, totalMarks, obtainedMarks, grade];
    });

    const totalObtained = marksData.reduce((sum, row) => sum + row[2], 0);
    const totalMax = marksData.length * 100;
    const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
    const overallGrade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : 'C';

    marksData.push(['TOTAL', totalMax, totalObtained, overallGrade]);

    doc.autoTable({
      startY: yPos,
      head: [['Subject', 'Max Marks', 'Marks Obtained', 'Grade']],
      body: marksData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202], fontStyle: 'bold' },
      footStyles: { fillColor: [220, 220, 220], fontStyle: 'bold' },
      foot: [[`Percentage: ${percentage}%`, '', `Overall Grade: ${overallGrade}`, '']],
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Teacher Remarks
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Teacher Remarks:', 20, yPos);
    yPos += 6;
    doc.setFont(undefined, 'normal');
    const remark = percentage >= 80 ? 'Excellent performance! Keep it up.' : percentage >= 70 ? 'Good work. Focus on weaker subjects.' : 'Needs improvement. Please work harder.';
    doc.text(remark, 20, yPos);
    yPos += 15;

    // Signatures
    doc.text('_________________', 20, yPos);
    doc.text('_________________', 100, yPos);
    doc.text('_________________', 160, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.text('Class Teacher', 20, yPos);
    doc.text('Principal', 100, yPos);
    doc.text('Parent Signature', 160, yPos);

    // Footer
    yPos = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('This is a computer-generated report card', pageWidth / 2, yPos, { align: 'center' });

    const filename = `ReportCard_${student.name.replace(/\s+/g, '_')}_${term.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
    return { success: true, filename };
  } catch (error) {
    console.error('Report card generation failed:', error);
    return { success: false, error: error.message };
  }
};

// ============ ID CARD GENERATOR ============
export const generateIDCard = (user, role = 'student') => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [85.6, 54], // ID card size
    });

    // Front side
    doc.setFillColor(66, 139, 202);
    doc.rect(0, 0, 85.6, 10, 'F');

    doc.setTextColor(255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('KTC SCHOOL', 42.8, 7, { align: 'center' });

    // Photo placeholder
    doc.setDrawColor(0);
    doc.setFillColor(220, 220, 220);
    doc.rect(8, 13, 25, 30, 'FD');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('PHOTO', 20.5, 28, { align: 'center' });

    // Details
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(user.name, 40, 18);

    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text(`${role === 'student' ? 'Class' : 'Staff ID'}: ${role === 'student' ? user.class : user.staffId || 'ST001'}`, 40, 23);
    doc.text(`Roll No: ${user.rollNo || user.admissionNo}`, 40, 28);
    doc.text(`Ph: ${user.parentPhone || user.phone || 'N/A'}`, 40, 33);
    doc.text(`Valid Till: 31-Mar-2027`, 40, 38);

    // Barcode representation
    doc.setDrawColor(0);
    for (let i = 0; i < 40; i++) {
      const x = 8 + (i * 1.5);
      const height = Math.random() > 0.5 ? 5 : 3;
      doc.line(x, 45, x, 45 + height);
    }
    doc.setFontSize(6);
    doc.text(user.admissionNo || user.id.toString(), 42.8, 52, { align: 'center' });

    const filename = `IDCard_${user.name.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
    return { success: true, filename };
  } catch (error) {
    console.error('ID card generation failed:', error);
    return { success: false, error: error.message };
  }
};

// ============ ADMIT CARD GENERATOR ============
export const generateAdmitCard = (student, examSchedule, examName = 'Term 1 Examination 2026-27') => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('KTC SCHOOL', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    doc.setFontSize(12);
    doc.text('EXAMINATION ADMIT CARD', pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(examName, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Student details
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos, pageWidth - 30, 40, 'F');

    // Photo placeholder
    doc.setFillColor(220, 220, 220);
    doc.rect(pageWidth - 45, yPos + 5, 30, 30, 'FD');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('PHOTO', pageWidth - 30, yPos + 22, { align: 'center' });

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`Name: ${student.name}`, 20, yPos + 10);
    doc.text(`Class: ${student.class}`, 20, yPos + 18);
    doc.text(`Roll No: ${student.rollNo}`, 20, yPos + 26);
    doc.text(`Admission No: ${student.admissionNo}`, 20, yPos + 34);
    yPos += 48;

    // Exam Schedule
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Examination Schedule:', 20, yPos);
    yPos += 8;

    const scheduleData = examSchedule || [
      ['15-Dec-2026', 'Mathematics', '10:00 AM - 1:00 PM', 'Room 101'],
      ['16-Dec-2026', 'Science', '10:00 AM - 1:00 PM', 'Room 101'],
      ['17-Dec-2026', 'English', '10:00 AM - 1:00 PM', 'Room 101'],
      ['18-Dec-2026', 'Hindi', '10:00 AM - 1:00 PM', 'Room 101'],
      ['19-Dec-2026', 'Social Science', '10:00 AM - 1:00 PM', 'Room 101'],
    ];

    doc.autoTable({
      startY: yPos,
      head: [['Date', 'Subject', 'Time', 'Room']],
      body: scheduleData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Instructions
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Instructions:', 20, yPos);
    yPos += 6;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    const instructions = [
      '1. Bring this admit card to the examination hall.',
      '2. Reach 30 minutes before the exam starts.',
      '3. Carry your ID card along with this admit card.',
      '4. Use of mobile phones is strictly prohibited.',
    ];
    instructions.forEach(instruction => {
      doc.text(instruction, 20, yPos);
      yPos += 5;
    });

    yPos += 10;
    doc.text('_________________', 150, yPos);
    yPos += 5;
    doc.text('Principal Signature', 150, yPos);

    const filename = `AdmitCard_${student.name.replace(/\s+/g, '_')}_${examName.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
    return { success: true, filename };
  } catch (error) {
    console.error('Admit card generation failed:', error);
    return { success: false, error: error.message };
  }
};
