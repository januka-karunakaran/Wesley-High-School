"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar, Clock, User, BookOpen, MapPin, ChevronLeft,
  Plus, Printer, Filter, Sparkles, CheckCircle2, AlertCircle, X, Loader2
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageToggle } from "../../components/LanguageToggle";

interface TimetableEntry {
  id?: string;
  gradeClass: string;
  grade?: string;
  dayOfWeek: string;
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  teacherId?: string;
  roomNumber?: string;
  academicYear?: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const CLASSES = ["6-A", "7-A", "8-A", "9-A", "10-A", "10-B", "11-A", "11-B", "12-Maths", "12-Bio", "13-Science"];

const PERIOD_TIMES: { [key: number]: { start: string; end: string } } = {
  1: { start: "07:50 AM", end: "08:35 AM" },
  2: { start: "08:35 AM", end: "09:20 AM" },
  3: { start: "09:20 AM", end: "10:05 AM" },
  4: { start: "10:05 AM", end: "10:50 AM" },
  5: { start: "11:10 AM", end: "11:50 AM" },
  6: { start: "11:50 AM", end: "12:30 PM" },
  7: { start: "12:30 PM", end: "01:10 PM" },
  8: { start: "01:10 PM", end: "01:50 PM" },
};

const SUBJECT_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  Mathematics: { bg: "bg-blue-500/10", text: "text-blue-700", border: "border-blue-200" },
  Science: { bg: "bg-emerald-500/10", text: "text-emerald-700", border: "border-emerald-200" },
  "English Language": { bg: "bg-purple-500/10", text: "text-purple-700", border: "border-purple-200" },
  "Tamil Language": { bg: "bg-amber-500/10", text: "text-amber-700", border: "border-amber-200" },
  History: { bg: "bg-rose-500/10", text: "text-rose-700", border: "border-rose-200" },
  "Information & Communication Tech": { bg: "bg-cyan-500/10", text: "text-cyan-700", border: "border-cyan-200" },
  ICT: { bg: "bg-cyan-500/10", text: "text-cyan-700", border: "border-cyan-200" },
  Commerce: { bg: "bg-indigo-500/10", text: "text-indigo-700", border: "border-indigo-200" },
  "Christianity / Religion": { bg: "bg-amber-500/10", text: "text-amber-800", border: "border-amber-300" },
  Geography: { bg: "bg-teal-500/10", text: "text-teal-700", border: "border-teal-200" },
  Physics: { bg: "bg-sky-500/10", text: "text-sky-700", border: "border-sky-200" },
  Chemistry: { bg: "bg-emerald-500/10", text: "text-emerald-700", border: "border-emerald-200" },
  Biology: { bg: "bg-green-500/10", text: "text-green-700", border: "border-green-200" },
};

function getSubjectStyle(subject: string) {
  for (const key of Object.keys(SUBJECT_COLORS)) {
    if (subject.toLowerCase().includes(key.toLowerCase())) {
      return SUBJECT_COLORS[key];
    }
  }
  return { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-200" };
}

// Built-in curriculum generator for 10-A and other classes as fallback
function generateDefaultEntries(gradeClass: string): TimetableEntry[] {
  const subjects = [
    { sub: "Mathematics", teacher: "Mr. K. Selvaratnam", room: "Hall 14" },
    { sub: "Science", teacher: "Mrs. R. Pathmanathan", room: "Science Lab A" },
    { sub: "English Language", teacher: "Miss M. Fernando", room: "Hall 14" },
    { sub: "Tamil Language", teacher: "Mr. S. Thavabalasingam", room: "Hall 14" },
    { sub: "History", teacher: "Mrs. N. Gunasekara", room: "Hall 14" },
    { sub: "ICT", teacher: "Mr. A. Razik", room: "Computer Lab 1" },
    { sub: "Commerce", teacher: "Mrs. T. Jeyarajah", room: "Hall 14" },
    { sub: "Christianity / Religion", teacher: "Rev. Fr. D. Emmanuel", room: "College Chapel" },
  ];

  const entries: TimetableEntry[] = [];
  DAYS.forEach((day, dIdx) => {
    for (let p = 1; p <= 8; p++) {
      const item = subjects[(dIdx * 2 + p) % subjects.length];
      entries.push({
        id: `mock-${gradeClass}-${day}-${p}`,
        gradeClass,
        dayOfWeek: day,
        period: p,
        startTime: PERIOD_TIMES[p].start,
        endTime: PERIOD_TIMES[p].end,
        subject: item.sub,
        teacherName: item.teacher,
        roomNumber: item.room,
        academicYear: "2025/2026",
      });
    }
  });
  return entries;
}

export default function TimetablePage() {
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<"class" | "teacher">("class");
  const [selectedClass, setSelectedClass] = useState("10-A");
  const [selectedTeacher, setSelectedTeacher] = useState("Mr. K. Selvaratnam");
  const [selectedDay, setSelectedDay] = useState<string>("All"); // "All" | "Monday" | ...
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");

  // New Entry Form State
  const [formData, setFormData] = useState({
    gradeClass: "10-A",
    dayOfWeek: "Monday",
    period: 1,
    subject: "Mathematics",
    teacherName: "Mr. K. Selvaratnam",
    roomNumber: "Hall 14",
    academicYear: "2025/2026",
  });

  // Fetch from backend API
  const fetchTimetables = async () => {
    try {
      setLoading(true);
      const url =
        viewMode === "class"
          ? `http://localhost:8080/api/v1/timetables/class/${selectedClass}`
          : `http://localhost:8080/api/v1/timetables/teacher/${encodeURIComponent(selectedTeacher)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data: TimetableEntry[] = await res.json();
        if (data && data.length > 0) {
          setEntries(data);
        } else {
          // Fallback to generated default entries
          setEntries(generateDefaultEntries(selectedClass));
        }
      } else {
        setEntries(generateDefaultEntries(selectedClass));
      }
    } catch {
      // Offline fallback
      setEntries(generateDefaultEntries(selectedClass));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, [selectedClass, selectedTeacher, viewMode]);

  // Handle Add Entry
  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormSuccess("");

    const newEntry: TimetableEntry = {
      ...formData,
      period: Number(formData.period),
      startTime: PERIOD_TIMES[Number(formData.period)].start,
      endTime: PERIOD_TIMES[Number(formData.period)].end,
    };

    try {
      const res = await fetch("http://localhost:8080/api/v1/timetables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (res.ok) {
        const saved = await res.json();
        setEntries((prev) => [...prev.filter((x) => !(x.dayOfWeek === saved.dayOfWeek && x.period === saved.period && x.gradeClass === saved.gradeClass)), saved]);
        setFormSuccess("Period added successfully to schedule!");
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess("");
        }, 1200);
      } else {
        // Local update fallback
        setEntries((prev) => [...prev.filter((x) => !(x.dayOfWeek === newEntry.dayOfWeek && x.period === newEntry.period && x.gradeClass === newEntry.gradeClass)), newEntry]);
        setFormSuccess("Saved locally (offline mode)!");
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess("");
        }, 1200);
      }
    } catch {
      setEntries((prev) => [...prev.filter((x) => !(x.dayOfWeek === newEntry.dayOfWeek && x.period === newEntry.period && x.gradeClass === newEntry.gradeClass)), newEntry]);
      setFormSuccess("Saved locally (offline mode)!");
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess("");
      }, 1200);
    } finally {
      setSubmitting(false);
    }
  };

  const teachersList = Array.from(new Set(entries.map((e) => e.teacherName))).filter(Boolean);
  if (!teachersList.includes("Mr. K. Selvaratnam")) teachersList.unshift("Mr. K. Selvaratnam");
  if (!teachersList.includes("Mrs. R. Pathmanathan")) teachersList.push("Mrs. R. Pathmanathan");

  const filteredDays = selectedDay === "All" ? DAYS : [selectedDay];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Banner Header */}
      <div className="bg-[#071526] text-white border-b border-amber-500/20 py-8 px-4 sm:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> {t("navHome")}
              </Link>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-amber-300/80 font-medium tracking-wider uppercase">
                {t("motto")}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Calendar className="w-8 h-8 text-amber-400" />
              <span>{language === "ta" ? "வகுப்பு நேர அட்டவணை" : "Class Timetable System"}</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {language === "ta"
                ? "மாணவர்கள் மற்றும் ஆசிரியர்களுக்கான உத்தியோகபூர்வ வாராந்த கல்வி நேர அட்டவணை (2025/2026)"
                : "Official weekly timetable schedule for students and faculty of Wesley High School, Kalmunai."}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <LanguageToggle />
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Schedule</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Edit Period</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-5 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl w-fit border border-slate-200">
              <button
                onClick={() => setViewMode("class")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "class"
                    ? "bg-[#071526] text-amber-300 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {language === "ta" ? "வகுப்பு ரீதியாக" : "By Class / Grade"}
              </button>
              <button
                onClick={() => setViewMode("teacher")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "teacher"
                    ? "bg-[#071526] text-amber-300 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {language === "ta" ? "ஆசிரியர் ரீதியாக" : "By Teacher"}
              </button>
            </div>

            {/* Filter Dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              {viewMode === "class" ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Class:
                  </span>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        Grade {cls}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Faculty:
                  </span>
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {teachersList.map((tch) => (
                      <option key={tch} value={tch}>
                        {tch}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Day Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {["All", ...DAYS].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedDay === day
                        ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Schedule Grid */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
            <p className="text-slate-600 text-sm font-medium">Loading Wesley High School Timetable...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredDays.map((day) => {
              const dayEntries = entries.filter(
                (e) => e.dayOfWeek.toLowerCase() === day.toLowerCase()
              );

              return (
                <div
                  key={day}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden"
                >
                  {/* Day Header */}
                  <div className="bg-gradient-to-r from-[#071526] to-[#0c233f] text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm border border-amber-400/30">
                        {day.slice(0, 3)}
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold text-white">{day}</h2>
                        <p className="text-xs text-slate-400">
                          {viewMode === "class" ? `Grade ${selectedClass}` : selectedTeacher} • 8 Periods
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      07:50 AM – 01:50 PM
                    </span>
                  </div>

                  {/* Grid of Periods */}
                  <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((pNum) => {
                      const entry = dayEntries.find((e) => e.period === pNum);
                      const style = entry ? getSubjectStyle(entry.subject) : null;

                      return (
                        <div
                          key={`p-${day}-${pNum}`}
                          className={`rounded-xl border p-4 transition-all hover:shadow-md ${
                            entry
                              ? `${style?.bg} ${style?.border}`
                              : "bg-slate-50 border-dashed border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                            <span className="font-bold uppercase tracking-wider text-slate-600">
                              Period {pNum}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {PERIOD_TIMES[pNum].start}
                            </span>
                          </div>

                          {entry ? (
                            <div>
                              <h3 className={`text-base font-extrabold ${style?.text}`}>
                                {entry.subject}
                              </h3>
                              <div className="mt-2 space-y-1 text-xs text-slate-600">
                                <p className="flex items-center gap-1.5 font-medium">
                                  <User className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{entry.teacherName}</span>
                                </p>
                                <p className="flex items-center gap-1.5 text-slate-500">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{entry.roomNumber || "Classroom"}</span>
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic py-3 text-center">
                              Free / Study Period
                            </p>
                          )}
                        </div>
                      );
                    })}

                    {/* Interval / Midday Break Banner */}
                    <div className="col-span-full py-2.5 px-4 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between text-xs font-bold text-amber-900">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>COLLEGIATE MORNING INTERVAL / RECESS</span>
                      </span>
                      <span className="font-mono text-amber-800">10:50 AM – 11:10 AM (20 Mins)</span>
                    </div>

                    {[5, 6, 7, 8].map((pNum) => {
                      const entry = dayEntries.find((e) => e.period === pNum);
                      const style = entry ? getSubjectStyle(entry.subject) : null;

                      return (
                        <div
                          key={`p-${day}-${pNum}`}
                          className={`rounded-xl border p-4 transition-all hover:shadow-md ${
                            entry
                              ? `${style?.bg} ${style?.border}`
                              : "bg-slate-50 border-dashed border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                            <span className="font-bold uppercase tracking-wider text-slate-600">
                              Period {pNum}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {PERIOD_TIMES[pNum].start}
                            </span>
                          </div>

                          {entry ? (
                            <div>
                              <h3 className={`text-base font-extrabold ${style?.text}`}>
                                {entry.subject}
                              </h3>
                              <div className="mt-2 space-y-1 text-xs text-slate-600">
                                <p className="flex items-center gap-1.5 font-medium">
                                  <User className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{entry.teacherName}</span>
                                </p>
                                <p className="flex items-center gap-1.5 text-slate-500">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{entry.roomNumber || "Classroom"}</span>
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic py-3 text-center">
                              Free / Study Period
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-[#071526] text-white p-5 flex items-center justify-between border-b border-amber-500/20">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base">Schedule Period Entry</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="p-6 space-y-4">
              {formSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Class / Grade</label>
                  <select
                    value={formData.gradeClass}
                    onChange={(e) => setFormData({ ...formData, gradeClass: e.target.value })}
                    className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>
                        Grade {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Day of Week</label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                    className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Period (1 - 8)</label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: Number(e.target.value) })}
                    className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                      <option key={p} value={p}>
                        Period {p} ({PERIOD_TIMES[p].start})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Room / Hall</label>
                  <input
                    type="text"
                    required
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Hall 14, Lab 2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase">Subject Name</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. Mathematics, Science"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase">Assigned Teacher</label>
                <input
                  type="text"
                  required
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. Mr. K. Selvaratnam"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save to Timetable"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
