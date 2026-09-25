"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search, GraduationCap, Calendar, Award, DollarSign,
  ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Loader2,
  User, BookOpen, BarChart2, TrendingUp, Clock, ChevronDown, Download
} from "lucide-react";
import { generateReportCardPdf } from "../../utils/generateReportCardPdf";

// ── Type Definitions ────────────────────────────────────────────────────────
interface Student {
  id: string; studentId: string; fullName: string;
  gradeClass: string; gender?: string; parentName?: string;
  parentContact?: string; photoUrl?: string; academicYear?: string; status?: string;
}
interface ExamMark {
  id: string; studentId: string; term: string;
  subjectName: string; marksObtained: number; maxMarks: number;
}
interface FeeRecord {
  id: string; studentId: string; term: string; academicYear: string;
  totalAmount: number; paidAmount: number; dueAmount: number;
  paymentStatus: string; lastPaymentDate?: string; remarks?: string;
}
interface PortalSummary {
  student: Student;
  attendancePercentage: number;
  totalAttendanceDays: number;
  presentDays: number;
  examResults: ExamMark[];
  feeRecords: FeeRecord[];
}

// ── Mock fallback (student not yet in system) ────────────────────────────────
const MOCK_SUMMARY: PortalSummary = {
  student: {
    id: "demo", studentId: "WHS-2025-0142",
    fullName: "Mohamed Irfan Fathima", gradeClass: "10-A",
    gender: "Female", parentName: "Mohamed Irfan",
    parentContact: "+94 77 123 4567", academicYear: "2025", status: "ACTIVE",
  },
  attendancePercentage: 91.5,
  totalAttendanceDays: 120,
  presentDays: 110,
  examResults: [
    { id: "r1", studentId: "WHS-2025-0142", term: "Term 1", subjectName: "Mathematics", marksObtained: 88, maxMarks: 100 },
    { id: "r2", studentId: "WHS-2025-0142", term: "Term 1", subjectName: "Science", marksObtained: 79, maxMarks: 100 },
    { id: "r3", studentId: "WHS-2025-0142", term: "Term 1", subjectName: "English Language", marksObtained: 85, maxMarks: 100 },
    { id: "r4", studentId: "WHS-2025-0142", term: "Term 1", subjectName: "Tamil Language", marksObtained: 92, maxMarks: 100 },
    { id: "r5", studentId: "WHS-2025-0142", term: "Term 1", subjectName: "History", marksObtained: 74, maxMarks: 100 },
    { id: "r6", studentId: "WHS-2025-0142", term: "Term 2", subjectName: "Mathematics", marksObtained: 91, maxMarks: 100 },
    { id: "r7", studentId: "WHS-2025-0142", term: "Term 2", subjectName: "Science", marksObtained: 83, maxMarks: 100 },
    { id: "r8", studentId: "WHS-2025-0142", term: "Term 2", subjectName: "English Language", marksObtained: 87, maxMarks: 100 },
  ],
  feeRecords: [
    { id: "f1", studentId: "WHS-2025-0142", term: "Term 1", academicYear: "2025", totalAmount: 2500, paidAmount: 2500, dueAmount: 0, paymentStatus: "PAID", lastPaymentDate: "2025-01-15" },
    { id: "f2", studentId: "WHS-2025-0142", term: "Term 2", academicYear: "2025", totalAmount: 2500, paidAmount: 1500, dueAmount: 1000, paymentStatus: "PARTIAL", lastPaymentDate: "2025-05-10" },
    { id: "f3", studentId: "WHS-2025-0142", term: "Term 3", academicYear: "2025", totalAmount: 2500, paidAmount: 0, dueAmount: 2500, paymentStatus: "PENDING" },
  ],
};

// ── Helper Utilities ─────────────────────────────────────────────────────────
function getGrade(pct: number) {
  if (pct >= 90) return { label: "A+", color: "text-emerald-600" };
  if (pct >= 80) return { label: "A",  color: "text-emerald-600" };
  if (pct >= 70) return { label: "B",  color: "text-sky-600" };
  if (pct >= 60) return { label: "C",  color: "text-amber-600" };
  if (pct >= 50) return { label: "S",  color: "text-orange-600" };
  return { label: "F", color: "text-red-600" };
}

const feeStatusStyle: Record<string, string> = {
  PAID:    "bg-emerald-100 text-emerald-800 border-emerald-200",
  PARTIAL: "bg-amber-100 text-amber-800 border-amber-200",
  PENDING: "bg-slate-100 text-slate-700 border-slate-200",
  OVERDUE: "bg-red-100 text-red-700 border-red-200",
};
const feeStatusIcon: Record<string, React.ReactNode> = {
  PAID:    <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
  PARTIAL: <AlertTriangle className="w-4 h-4 text-amber-600" />,
  PENDING: <Clock className="w-4 h-4 text-slate-500" />,
  OVERDUE: <XCircle className="w-4 h-4 text-red-600" />,
};

export default function StudentPortalPage() {
  const [studentIdInput, setStudentIdInput] = useState("");
  const [summary, setSummary]               = useState<PortalSummary | null>(null);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [activeTab, setActiveTab]           = useState<"results" | "attendance" | "fees">("results");
  const [activeTerm, setActiveTerm]         = useState("All");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdInput.trim()) return;
    setLoading(true);
    setError("");
    setSummary(null);

    try {
      const res = await fetch(`http://localhost:8080/api/v1/portal/${studentIdInput.trim()}/summary`);
      if (res.ok) {
        setSummary(await res.json());
      } else if (res.status === 404) {
        // Use demo data if ID starts with "WHS-" for demonstration
        if (studentIdInput.toUpperCase().startsWith("WHS-")) {
          setSummary({ ...MOCK_SUMMARY, student: { ...MOCK_SUMMARY.student, studentId: studentIdInput } });
        } else {
          setError("No student record found for this ID. Please check and try again.");
        }
      } else {
        setError("Server error. Please try again later.");
      }
    } catch {
      // Offline: use mock for any ID starting with "WHS-"
      if (studentIdInput.toUpperCase().startsWith("WHS-")) {
        setSummary({ ...MOCK_SUMMARY, student: { ...MOCK_SUMMARY.student, studentId: studentIdInput } });
      } else {
        setError("Unable to connect to the server. Please try again or contact the ICT Department.");
      }
    } finally { setLoading(false); }
  };

  // Derived data
  const terms = summary ? [...new Set(summary.examResults.map(r => r.term))] : [];
  const filteredResults = summary?.examResults.filter(r => activeTerm === "All" || r.term === activeTerm) ?? [];

  const attendancePct   = summary?.attendancePercentage ?? 0;
  const attendanceColor = attendancePct >= 85 ? "text-emerald-600" : attendancePct >= 75 ? "text-amber-600" : "text-red-600";
  const attendanceBg    = attendancePct >= 85 ? "bg-emerald-500" : attendancePct >= 75 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-[#071526] text-white py-10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-crest">Student Self-Service Portal</h1>
          </div>
          <p className="text-slate-300 text-sm max-w-xl">
            Enter your Wesley High School Student ID to view your personal attendance record, examination results, and fee payment status.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={studentIdInput}
                onChange={e => setStudentIdInput(e.target.value)}
                placeholder="Enter Student ID  e.g. WHS-2025-0142"
                className="w-full pl-9 pr-4 py-3 bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Searching..." : "View Records"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-900/40 border border-red-700 rounded-xl text-sm text-red-300 flex items-center gap-2 max-w-xl">
              <XCircle className="w-4 h-4 text-red-400 shrink-0" /> {error}
            </div>
          )}
        </div>
      </div>

      {/* Demo hint */}
      {!summary && !loading && (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
            <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Demo Mode
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Try entering <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">WHS-2025-0142</code> to see a sample student portal with attendance, results, and fee records.
            </p>
          </div>
        </div>
      )}

      {/* Student Dashboard */}
      {summary && (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-amber-400 flex items-center justify-center text-slate-600 shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 font-crest">{summary.student.fullName}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {summary.student.studentId} · Grade {summary.student.gradeClass} · {summary.student.academicYear}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  summary.student.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                  {summary.student.status}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div><p className="text-slate-400">Parent/Guardian</p><p className="font-semibold text-slate-800">{summary.student.parentName}</p></div>
                <div><p className="text-slate-400">Contact</p><p className="font-semibold text-slate-800">{summary.student.parentContact}</p></div>
                <div><p className="text-slate-400">Academic Year</p><p className="font-semibold text-slate-800">{summary.student.academicYear}</p></div>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${attendancePct >= 85 ? "bg-emerald-50" : "bg-amber-50"}`}>
                <Calendar className={`w-6 h-6 ${attendanceColor}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Attendance</p>
                <p className={`text-2xl font-extrabold ${attendanceColor}`}>{attendancePct}%</p>
                <p className="text-xs text-slate-500">{summary.presentDays} / {summary.totalAttendanceDays} days</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-sky-50">
                <Award className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Exam Results</p>
                <p className="text-2xl font-extrabold text-sky-700">
                  {summary.examResults.length > 0
                    ? `${Math.round(summary.examResults.reduce((s, r) => s + (r.marksObtained / r.maxMarks) * 100, 0) / summary.examResults.length)}%`
                    : "—"}
                </p>
                <p className="text-xs text-slate-500">Average across all subjects</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-50">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Fee Status</p>
                <p className="text-2xl font-extrabold text-amber-700">
                  LKR {summary.feeRecords.reduce((s, f) => s + f.dueAmount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">Total outstanding balance</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200">
              {([
                { id: "results",    label: "Exam Results",  icon: <BookOpen className="w-4 h-4" /> },
                { id: "attendance", label: "Attendance",     icon: <Calendar className="w-4 h-4" /> },
                { id: "fees",       label: "Fee Status",     icon: <DollarSign className="w-4 h-4" /> },
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "border-amber-500 text-amber-700 bg-amber-50/50"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6">
              {/* ── RESULTS TAB ── */}
              {activeTab === "results" && (
                <div className="space-y-4">
                  {/* Term filter & PDF download */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {["All", ...terms].map(term => (
                        <button
                          key={term}
                          onClick={() => setActiveTerm(term)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            activeTerm === term ? "bg-[#071526] text-amber-300 border-amber-500/30" : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {term}
                        </button>
                      ))}
                    </div>

                    {filteredResults.length > 0 && (
                      <button
                        onClick={() => {
                          generateReportCardPdf({
                            student: {
                              studentId: summary.student.studentId,
                              fullName: summary.student.fullName,
                              gradeClass: summary.student.gradeClass,
                              academicYear: summary.student.academicYear || "2025/2026",
                              attendancePercentage: summary.attendancePercentage,
                              totalDays: summary.totalAttendanceDays,
                              presentDays: summary.presentDays,
                            },
                            term: activeTerm === "All" ? "Cumulative Annual" : activeTerm,
                            results: filteredResults,
                            attendancePct: summary.attendancePercentage,
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-950" />
                        <span>Download Official Report Card (PDF)</span>
                      </button>
                    )}
                  </div>

                  {filteredResults.length === 0 ? (
                    <p className="text-sm text-slate-500 py-8 text-center">No results available.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="text-left px-4 py-3">Subject</th>
                            <th className="text-left px-4 py-3 hidden sm:table-cell">Term</th>
                            <th className="text-right px-4 py-3">Marks</th>
                            <th className="text-right px-4 py-3">Percentage</th>
                            <th className="text-center px-4 py-3">Grade</th>
                            <th className="px-4 py-3 hidden sm:table-cell w-32"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredResults.map(result => {
                            const pct   = Math.round((result.marksObtained / result.maxMarks) * 100);
                            const grade = getGrade(pct);
                            return (
                              <tr key={result.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-900">{result.subjectName}</td>
                                <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{result.term}</td>
                                <td className="px-4 py-3 text-right text-slate-700">{result.marksObtained} / {result.maxMarks}</td>
                                <td className="px-4 py-3 text-right font-semibold text-slate-900">{pct}%</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`font-extrabold text-base ${grade.color}`}>{grade.label}</span>
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── ATTENDANCE TAB ── */}
              {activeTab === "attendance" && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-4 py-4">
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                        <circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke={attendancePct >= 85 ? "#10b981" : attendancePct >= 75 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          strokeDashoffset={`${2 * Math.PI * 42 * (1 - attendancePct / 100)}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-extrabold ${attendanceColor}`}>{attendancePct}%</span>
                        <span className="text-xs text-slate-500 mt-0.5">Attendance</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-center mt-2">
                      <div>
                        <p className="text-2xl font-extrabold text-slate-900">{summary.totalAttendanceDays}</p>
                        <p className="text-xs text-slate-500">Total Days</p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-emerald-600">{summary.presentDays}</p>
                        <p className="text-xs text-slate-500">Present</p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-red-600">{summary.totalAttendanceDays - summary.presentDays}</p>
                        <p className="text-xs text-slate-500">Absent</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border text-sm ${
                    attendancePct >= 85 ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                    attendancePct >= 75 ? "bg-amber-50 border-amber-200 text-amber-800" :
                    "bg-red-50 border-red-200 text-red-800"
                  }`}>
                    {attendancePct >= 85 ? (
                      <p><CheckCircle2 className="inline w-4 h-4 mr-1.5 text-emerald-600" /><strong>Excellent attendance!</strong> Keep up the great commitment to your education.</p>
                    ) : attendancePct >= 75 ? (
                      <p><AlertTriangle className="inline w-4 h-4 mr-1.5 text-amber-600" /><strong>Attendance requires improvement.</strong> The Ministry of Education mandates a minimum of 80% attendance for examination eligibility.</p>
                    ) : (
                      <p><XCircle className="inline w-4 h-4 mr-1.5 text-red-600" /><strong>Critical attendance warning.</strong> Below the minimum threshold. Please consult your class teacher or principal immediately.</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── FEES TAB ── */}
              {activeTab === "fees" && (
                <div className="space-y-4">
                  {summary.feeRecords.length === 0 ? (
                    <p className="text-sm text-slate-500 py-8 text-center">No fee records available.</p>
                  ) : (
                    <>
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                              <th className="text-left px-4 py-3">Term</th>
                              <th className="text-left px-4 py-3 hidden sm:table-cell">Year</th>
                              <th className="text-right px-4 py-3">Total</th>
                              <th className="text-right px-4 py-3">Paid</th>
                              <th className="text-right px-4 py-3">Due</th>
                              <th className="text-center px-4 py-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {summary.feeRecords.map(fee => (
                              <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-900">{fee.term}</td>
                                <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{fee.academicYear}</td>
                                <td className="px-4 py-3 text-right text-slate-700">LKR {fee.totalAmount.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right text-emerald-600 font-semibold">LKR {fee.paidAmount.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right font-bold text-red-600">
                                  {fee.dueAmount > 0 ? `LKR ${fee.dueAmount.toLocaleString()}` : "—"}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${feeStatusStyle[fee.paymentStatus] ?? ""}`}>
                                    {feeStatusIcon[fee.paymentStatus]} {fee.paymentStatus}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                        <p>For fee payments and official receipts, please visit the <strong>Finance Office</strong> at Wesley High School, Kalmunai, or contact <strong>+94 (67) 222 2345</strong>.</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
