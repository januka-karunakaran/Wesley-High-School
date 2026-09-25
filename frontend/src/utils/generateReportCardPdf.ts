import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ReportCardStudent {
  studentId: string;
  fullName: string;
  gradeClass: string;
  academicYear?: string;
  attendancePercentage?: number;
  totalDays?: number;
  presentDays?: number;
}

export interface ReportCardMark {
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  term?: string;
}

export interface GenerateReportCardParams {
  student: ReportCardStudent;
  term: string;
  results: ReportCardMark[];
  attendancePct?: number;
}

export function generateReportCardPdf({
  student,
  term,
  results,
  attendancePct,
}: GenerateReportCardParams) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ── Outer Decorative Border (Double Gold / Navy) ──
  doc.setDrawColor(7, 21, 38); // Deep Navy
  doc.setLineWidth(1.2);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  doc.setDrawColor(207, 161, 55); // Rich Gold
  doc.setLineWidth(0.4);
  doc.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19);

  // ── Header Navy Banner ──
  doc.setFillColor(7, 21, 38);
  doc.rect(10, 10, pageWidth - 20, 38, "F");

  // Gold accent line under header
  doc.setFillColor(207, 161, 55);
  doc.rect(10, 48, pageWidth - 20, 2, "F");

  // Crest Symbol (Stylized Vector Shield)
  const crestX = 24;
  const crestY = 28;
  doc.setDrawColor(207, 161, 55);
  doc.setFillColor(10, 31, 56);
  doc.circle(crestX, crestY, 11, "FD");
  doc.setTextColor(245, 158, 11);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("WHS", crestX, crestY + 1.5, { align: "center" });

  // School Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("WESLEY HIGH SCHOOL", pageWidth / 2 + 5, 22, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(207, 161, 55);
  doc.text("KALMUNAI • NATIONAL SCHOOL • ESTD. 1885", pageWidth / 2 + 5, 28, {
    align: "center",
  });

  // Official Motto: "Utmost for the Highest"
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(254, 243, 199); // warm cream
  doc.text('"Utmost for the Highest"', pageWidth / 2 + 5, 35, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    "Beach Road, Kalmunai, Eastern Province, Sri Lanka • Ministry of Education",
    pageWidth / 2 + 5,
    42,
    { align: "center" }
  );

  // ── Document Title ──
  doc.setTextColor(7, 21, 38);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("OFFICIAL STUDENT ACADEMIC REPORT CARD", pageWidth / 2, 58, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(180, 83, 9); // Amber 700
  doc.text(
    `${term.toUpperCase()} EVALUATION • ACADEMIC YEAR ${student.academicYear || "2025/2026"}`,
    pageWidth / 2,
    64,
    { align: "center" }
  );

  // Thin separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(16, 68, pageWidth - 16, 68);

  // ── Student Particulars Grid ──
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(16, 71, pageWidth - 32, 26, 2, 2, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(16, 71, pageWidth - 32, 26, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("STUDENT FULL NAME:", 22, 78);
  doc.text("STUDENT ADMISSION ID:", 22, 85);
  doc.text("GRADE & CLASS:", 22, 92);

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(student.fullName || "N/A", 68, 78);
  doc.text(student.studentId || "N/A", 68, 85);
  doc.text(student.gradeClass || "N/A", 68, 92);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("DATE OF ISSUE:", pageWidth / 2 + 10, 78);
  doc.text("ATTENDANCE RATE:", pageWidth / 2 + 10, 85);
  doc.text("COLLEGIATE STATUS:", pageWidth / 2 + 10, 92);

  doc.setTextColor(15, 23, 42);
  const todayStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(todayStr, pageWidth / 2 + 50, 78);

  const effectiveAtt =
    attendancePct !== undefined
      ? `${attendancePct}%`
      : student.attendancePercentage !== undefined
      ? `${student.attendancePercentage}%`
      : "95.0%";
  doc.text(effectiveAtt, pageWidth / 2 + 50, 85);

  doc.setTextColor(16, 149, 106); // Emerald
  doc.text("REGULAR / IN GOOD STANDING", pageWidth / 2 + 50, 92);

  // ── Results Table ──
  const totalObtained = results.reduce((acc, r) => acc + Number(r.marksObtained || 0), 0);
  const totalMax = results.reduce((acc, r) => acc + Number(r.maxMarks || 100), 0);
  const overallAvg =
    totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : "0.0";

  const getGradeInfo = (obtained: number, max: number) => {
    const pct = (obtained / max) * 100;
    if (pct >= 75) return { grade: "A", remarks: "Distinction" };
    if (pct >= 65) return { grade: "B", remarks: "Very Good" };
    if (pct >= 50) return { grade: "C", remarks: "Credit Pass" };
    if (pct >= 35) return { grade: "S", remarks: "Ordinary Pass" };
    return { grade: "F", remarks: "Needs Improvement" };
  };

  const tableRows = results.map((item, index) => {
    const obtained = Number(item.marksObtained || 0);
    const max = Number(item.maxMarks || 100);
    const pct = max > 0 ? ((obtained / max) * 100).toFixed(1) + "%" : "0%";
    const info = getGradeInfo(obtained, max);
    return [
      (index + 1).toString(),
      item.subjectName,
      max.toString(),
      obtained.toString(),
      pct,
      info.grade,
      info.remarks,
    ];
  });

  autoTable(doc, {
    startY: 102,
    margin: { left: 16, right: 16 },
    head: [["#", "SUBJECT", "MAX", "OBTAINED", "PERCENTAGE", "GRADE", "REMARKS"]],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [7, 21, 38], // Navy
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "left",
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { halign: "left", fontStyle: "bold" },
      2: { halign: "right", cellWidth: 16 },
      3: { halign: "right", fontStyle: "bold", cellWidth: 22 },
      4: { halign: "right", cellWidth: 24 },
      5: { halign: "center", fontStyle: "bold", cellWidth: 18 },
      6: { halign: "left", cellWidth: 36 },
    },
  });

  // Position after table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastY = (doc as any).lastAutoTable?.finalY || 180;

  // ── Summary Box ──
  const summaryY = Math.min(lastY + 4, pageHeight - 75);
  doc.setFillColor(254, 243, 199); // Soft Gold
  doc.roundedRect(16, summaryY, pageWidth - 32, 18, 2, 2, "F");
  doc.setDrawColor(207, 161, 55);
  doc.roundedRect(16, summaryY, pageWidth - 32, 18, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(120, 53, 15);
  doc.text("TOTAL MARKS:", 24, summaryY + 7);
  doc.setTextColor(15, 23, 42);
  doc.text(`${totalObtained} / ${totalMax}`, 55, summaryY + 7);

  doc.setTextColor(120, 53, 15);
  doc.text("OVERALL AVERAGE:", 90, summaryY + 7);
  doc.setTextColor(180, 83, 9);
  doc.setFontSize(10);
  doc.text(`${overallAvg}%`, 130, summaryY + 7);

  let termOverallGrade = "F";
  const numAvg = parseFloat(overallAvg);
  if (numAvg >= 75) termOverallGrade = "A (Distinction)";
  else if (numAvg >= 65) termOverallGrade = "B (Very Good)";
  else if (numAvg >= 50) termOverallGrade = "C (Credit)";
  else if (numAvg >= 35) termOverallGrade = "S (Pass)";

  doc.setFontSize(9);
  doc.setTextColor(120, 53, 15);
  doc.text("FINAL GRADE:", 148, summaryY + 7);
  doc.setTextColor(15, 23, 42);
  doc.text(termOverallGrade, 172, summaryY + 7);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Grading Scale: A (75-100% Distinction) | B (65-74% Very Good) | C (50-64% Credit) | S (35-49% Ordinary) | F (0-34% Fail)",
    pageWidth / 2,
    summaryY + 14,
    { align: "center" }
  );

  // ── Authentication & Signatures ──
  const sigY = summaryY + 28;

  // Teacher signature line
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(22, sigY + 12, 75, sigY + 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text("CLASS TEACHER", 48, sigY + 16, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Signature & Remarks", 48, sigY + 20, { align: "center" });

  // Official College Seal in center
  const sealX = pageWidth / 2;
  doc.setDrawColor(180, 83, 9);
  doc.circle(sealX, sigY + 9, 11, "D");
  doc.circle(sealX, sigY + 9, 9.5, "D");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(180, 83, 9);
  doc.text("WESLEY HIGH SCHOOL", sealX, sigY + 6, { align: "center" });
  doc.text("OFFICIAL SEAL", sealX, sigY + 9.5, { align: "center" });
  doc.text("KALMUNAI 1885", sealX, sigY + 13, { align: "center" });

  // Principal signature line
  doc.line(pageWidth - 75, sigY + 12, pageWidth - 22, sigY + 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text("PRINCIPAL / RECTOR", pageWidth - 48, sigY + 16, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Wesley High School, Kalmunai", pageWidth - 48, sigY + 20, { align: "center" });

  // ── Footer Disclaimer ──
  doc.setFont("times", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Motto: "Utmost for the Highest" • Official document issued under the authority of the Ministry of Education, Sri Lanka.',
    pageWidth / 2,
    pageHeight - 12,
    { align: "center" }
  );

  // Trigger Save
  const cleanId = (student.studentId || "student").replace(/[^a-zA-Z0-9_-]/g, "_");
  const cleanTerm = term.replace(/\s+/g, "_");
  doc.save(`Wesley_High_School_${cleanId}_${cleanTerm}_Report_Card.pdf`);
}
