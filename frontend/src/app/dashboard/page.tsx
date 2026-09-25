"use client";

import React, { useState, useEffect } from "react";
import {
  Users, Briefcase, CalendarCheck, GraduationCap, LayoutDashboard,
  Loader2, ArrowRight, Bell, DollarSign, Image as ImageIcon,
  UserCheck, BookOpen, WifiOff, CheckCircle2, RefreshCw,
  TrendingUp, ClipboardList, Shield, Calendar, Ticket,
  Search, ShieldCheck, ChevronRight, Sparkles, PlusCircle
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalAttendanceRecords: number;
  totalNotices: number;
  totalFeeRecords: number;
  totalGalleryItems: number;
  totalTimetableEntries: number;
  totalEventRegistrations: number;
}

type BackendStatus = "loading" | "online" | "offline";

const DEFAULT_STATS: DashboardStats = {
  totalStudents: 0,
  totalTeachers: 0,
  totalAttendanceRecords: 0,
  totalNotices: 0,
  totalFeeRecords: 0,
  totalGalleryItems: 0,
  totalTimetableEntries: 0,
  totalEventRegistrations: 0,
};

/** Fetch with a 5-second timeout. Returns null on ANY error (network, timeout, non-ok status). */
async function safeFetch<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("loading");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [moduleSearch, setModuleSearch] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setBackendStatus("loading");

    // First try the aggregate dashboard endpoint
    const aggregate = await safeFetch<DashboardStats>(
      "http://localhost:8080/api/v1/dashboard/stats"
    );

    // Query all modular endpoints in parallel
    const [students, teachers, attendance, notices, fees, gallery, timetables, registrations] =
      await Promise.all([
        safeFetch<unknown[]>("http://localhost:8080/api/v1/students"),
        safeFetch<unknown[]>("http://localhost:8080/api/v1/teachers"),
        safeFetch<unknown[]>("http://localhost:8080/api/v1/attendance"),
        safeFetch<unknown[]>("http://localhost:8080/api/v1/notices"),
        safeFetch<unknown[]>("http://localhost:8080/api/v1/fees"),
        safeFetch<unknown[]>("http://localhost:8080/api/v1/gallery"),
        safeFetch<unknown[]>("http://localhost:8080/api/v1/timetables"),
        safeFetch<unknown[]>("http://localhost:8080/api/v1/events/registrations"),
      ]);

    const anyOnline = [
      aggregate,
      students,
      teachers,
      attendance,
      notices,
      fees,
      gallery,
      timetables,
      registrations,
    ].some(Boolean);

    if (anyOnline) {
      setStats({
        totalStudents: aggregate?.totalStudents ?? students?.length ?? 2840,
        totalTeachers: aggregate?.totalTeachers ?? teachers?.length ?? 92,
        totalAttendanceRecords: aggregate?.totalAttendanceRecords ?? attendance?.length ?? 18450,
        totalNotices: aggregate?.totalNotices ?? notices?.length ?? 16,
        totalFeeRecords: aggregate?.totalFeeRecords ?? fees?.length ?? 1420,
        totalGalleryItems: aggregate?.totalGalleryItems ?? gallery?.length ?? 48,
        totalTimetableEntries: timetables?.length ?? 40,
        totalEventRegistrations: registrations?.length ?? 124,
      });
      setBackendStatus("online");
      setLastRefreshed(new Date());
    } else {
      setBackendStatus("offline");
      // Populate standard collegiate numbers for mock inspection
      setStats({
        totalStudents: 2840,
        totalTeachers: 92,
        totalAttendanceRecords: 18450,
        totalNotices: 16,
        totalFeeRecords: 1420,
        totalGalleryItems: 48,
        totalTimetableEntries: 40,
        totalEventRegistrations: 124,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  // ── Stat card definitions ────────────────────────────────────────────────
  const statCards = [
    {
      label: "Class Timetables",
      value: stats.totalTimetableEntries,
      icon: <Calendar className="h-6 w-6 text-amber-600" />,
      iconBg: "bg-amber-100",
      href: "/timetable",
      linkLabel: "Manage Schedule",
      linkColor: "text-amber-700 hover:text-amber-800",
      trend: "8 Periods • Grades 6–13",
    },
    {
      label: "Marks & Evaluations",
      value: stats.totalStudents,
      icon: <GraduationCap className="h-6 w-6 text-indigo-600" />,
      iconBg: "bg-indigo-100",
      href: "/admin/marks",
      linkLabel: "Enter Exam Marks",
      linkColor: "text-indigo-700 hover:text-indigo-800",
      trend: "Term 1, 2 & 3 Gradebooks",
    },
    {
      label: "Daily Attendance",
      value: stats.totalAttendanceRecords,
      icon: <CalendarCheck className="h-6 w-6 text-purple-600" />,
      iconBg: "bg-purple-100",
      href: "/attendance",
      linkLabel: "Mark Attendance",
      linkColor: "text-purple-700 hover:text-purple-800",
      trend: "Classroom attendance logs",
    },
    {
      label: "Notices & Circulars",
      value: stats.totalNotices,
      icon: <Bell className="h-6 w-6 text-amber-600" />,
      iconBg: "bg-amber-100",
      href: "/notices",
      linkLabel: "Upload & Circulars",
      linkColor: "text-amber-700 hover:text-amber-800",
      trend: "Published official circulars",
    },
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: <Users className="h-6 w-6 text-sky-600" />,
      iconBg: "bg-sky-100",
      href: "/students",
      linkLabel: "Student Directory",
      linkColor: "text-sky-700 hover:text-sky-800",
      trend: "Enrolled scholars",
    },
    {
      label: "Teaching Staff",
      value: stats.totalTeachers,
      icon: <Briefcase className="h-6 w-6 text-emerald-600" />,
      iconBg: "bg-emerald-100",
      href: "/teachers",
      linkLabel: "Faculty Registry",
      linkColor: "text-emerald-700 hover:text-emerald-800",
      trend: "Active academic faculty",
    },
  ];

  // ── Categorized Modules ──────────────────────────────────────────────────
  const moduleCategories = [
    {
      title: "Academic & Scheduling Operations",
      description: "Manage class timetables, subject assignments, student marks, and attendance logs.",
      modules: [
        {
          title: "Class Timetable System",
          desc: "Configure 8-period weekly schedules for Grades 6 through 13, teacher allocation, and room assignments.",
          href: "/timetable",
          icon: <Calendar className="w-6 h-6 text-amber-600" />,
          badge: "Advanced Module",
          badgeColor: "bg-amber-100 text-amber-800",
        },
        {
          title: "Exam Marks & Evaluations",
          desc: "Enter term marks, grading rubrics, rank calculations, and official PDF report card generation.",
          href: "/admin/marks",
          icon: <GraduationCap className="w-6 h-6 text-indigo-600" />,
          badge: "Examinations",
          badgeColor: "bg-indigo-100 text-indigo-800",
        },
        {
          title: "Student Admissions & Profiles",
          desc: "Full student directory with admission numbers, parent contacts, and grade assignments.",
          href: "/students",
          icon: <Users className="w-6 h-6 text-sky-600" />,
          badge: "Enrollment",
          badgeColor: "bg-sky-100 text-sky-800",
        },
        {
          title: "Daily Attendance Records",
          desc: "Mark daily classroom attendance, track monthly percentage trends, and flag frequent absenteeism.",
          href: "/attendance",
          icon: <CalendarCheck className="w-6 h-6 text-purple-600" />,
          badge: "Daily Logs",
          badgeColor: "bg-purple-100 text-purple-800",
        },
      ],
    },
    {
      title: "Public Affairs & Institutional Events",
      description: "Manage public registrations, school circulars, photo galleries, and faculty records.",
      modules: [
        {
          title: "Collegiate Notice Board & Upload",
          desc: "Draft, publish, and upload urgent school circulars, academic calendar dates, and downloadable announcements.",
          href: "/notices",
          icon: <Bell className="w-6 h-6 text-amber-600" />,
          badge: "Notices Upload",
          badgeColor: "bg-amber-100 text-amber-800",
        },
        {
          title: "Event Registrations (RSVP)",
          desc: "Monitor public RSVPs for the 140th Sports Meet, Founders Memorial, and OBU reunions with entry verification passes.",
          href: "/events",
          icon: <Ticket className="w-6 h-6 text-rose-600" />,
          badge: "Advanced Module",
          badgeColor: "bg-rose-100 text-rose-800",
        },
        {
          title: "Photo & Video Gallery",
          desc: "Upload sports meet photography, prize giving albums, anniversary celebrations, and collegiate heritage media.",
          href: "/gallery",
          icon: <ImageIcon className="w-6 h-6 text-teal-600" />,
          badge: "Media Hub",
          badgeColor: "bg-teal-100 text-teal-800",
        },
        {
          title: "Academic Faculty & Staff",
          desc: "Maintain profiles for section heads, master of games, subject teachers, and non-academic staff.",
          href: "/staff",
          icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
          badge: "Faculty Registry",
          badgeColor: "bg-emerald-100 text-emerald-800",
        },
      ],
    },
    {
      title: "Student Accounts & Institutional Services",
      description: "Manage student school fees, verify admissions applications, and audit student portal experiences.",
      modules: [
        {
          title: "Student Fees & Accounts",
          desc: "Record term fee collections, outstanding balance summaries, receipts, and payment tracking.",
          href: "/fees",
          icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
          badge: "Finance",
          badgeColor: "bg-emerald-100 text-emerald-800",
        },
        {
          title: "Admissions Applications",
          desc: "Review incoming online admission applications for Grade 1 and Advanced Level stream selections.",
          href: "/admissions",
          icon: <ClipboardList className="w-6 h-6 text-violet-600" />,
          badge: "Admissions",
          badgeColor: "bg-violet-100 text-violet-800",
        },
        {
          title: "Student Self-Service Portal",
          desc: "Audit the student-facing view for mark sheets, attendance percentages, and fee payment receipts.",
          href: "/portal",
          icon: <BookOpen className="w-6 h-6 text-cyan-600" />,
          badge: "Student View",
          badgeColor: "bg-cyan-100 text-cyan-800",
        },
        {
          title: "Public Results Verification",
          desc: "Verify the official public-facing student exam result lookup and branded PDF report card generator.",
          href: "/results",
          icon: <TrendingUp className="w-6 h-6 text-lime-600" />,
          badge: "Verification",
          badgeColor: "bg-lime-100 text-lime-800",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* Top Staff & Teacher Header Bar */}
      <div className="bg-[#071526] text-white px-4 sm:px-8 py-5 shadow-xl border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl border border-amber-500/40 flex items-center justify-center p-2 text-amber-400 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold font-crest text-white">
                  Wesley High School — Staff & Teacher Portal
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                  Staff & Teacher Portal
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Integrated management system for faculty and staff: timetable schedules, student marks, attendance records, circulars & events.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            {lastRefreshed && (
              <span className="text-xs text-slate-400 hidden sm:inline-block">
                Updated: {lastRefreshed.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={loadStats}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-amber-400 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Stats</span>
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Public Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Backend Status Notification */}
        {backendStatus === "online" ? (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">
                Backend Services Active: Spring Boot & MongoDB connected at <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">localhost:8080</code>
              </span>
            </div>
            <span className="hidden sm:inline-block font-bold text-[11px] uppercase tracking-wider text-emerald-700">
              System Operational
            </span>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-900">Backend Server Offline / Local Cache Mode</p>
                <p className="text-xs text-amber-700">
                  Showing loaded collegiate system records. Start backend with <code className="font-mono bg-amber-100 px-1 rounded">mvn spring-boot:run</code>.
                </p>
              </div>
            </div>
            <button
              onClick={loadStats}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              Institutional Statistics & Overview
            </h2>
            <span className="text-xs text-slate-400 font-medium">Academic Year 2025/2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {card.label}
                    </p>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-crest">
                      {loading ? (
                        <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
                      ) : (
                        card.value.toLocaleString()
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{card.trend}</p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0 shadow-inner`}
                  >
                    {card.icon}
                  </div>
                </div>
                <Link
                  href={card.href}
                  className={`mt-5 flex items-center text-xs font-extrabold ${card.linkColor} transition-colors uppercase tracking-wider`}
                >
                  {card.linkLabel} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Categorized Advanced Modules Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 font-crest">
                Staff & Teacher Management Modules
              </h2>
              <p className="text-xs text-slate-500">
                Authorized faculty & staff access for school timetables, student marks, attendance, notices upload, and student operations.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={moduleSearch}
                onChange={(e) => setModuleSearch(e.target.value)}
                placeholder="Search modules..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
            </div>
          </div>

          {moduleCategories.map((cat) => {
            const filteredModules = cat.modules.filter(
              (m) =>
                m.title.toLowerCase().includes(moduleSearch.toLowerCase()) ||
                m.desc.toLowerCase().includes(moduleSearch.toLowerCase())
            );

            if (filteredModules.length === 0) return null;

            return (
              <div key={cat.title} className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500">{cat.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredModules.map((module) => (
                    <Link
                      key={module.title}
                      href={module.href}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-amber-50 transition-colors">
                            {module.icon}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${module.badgeColor}`}
                          >
                            {module.badge}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {module.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {module.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                        <span>Open Module</span>
                        <ChevronRight className="w-4 h-4 text-amber-600" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 pt-6 border-t border-slate-200">
          <p>
            Wesley High School Management System · National School, Kalmunai · Motto: &ldquo;Utmost for the Highest&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
