"use client";

import React, { useState, useEffect } from "react";
import {
  Users, Briefcase, CalendarCheck, GraduationCap, LayoutDashboard,
  Loader2, ArrowRight, Bell, DollarSign, Image as ImageIcon,
  UserCheck, BookOpen, WifiOff, CheckCircle2, RefreshCw,
  TrendingUp, ClipboardList, Shield
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalAttendanceRecords: number;
  totalNotices: number;
  totalFeeRecords: number;
  totalGalleryItems: number;
}

type BackendStatus = "loading" | "online" | "offline";

const DEFAULT_STATS: DashboardStats = {
  totalStudents: 0,
  totalTeachers: 0,
  totalAttendanceRecords: 0,
  totalNotices: 0,
  totalFeeRecords: 0,
  totalGalleryItems: 0,
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
    // Intentionally swallowed — network errors are expected when backend is offline
    clearTimeout(timer);
    return null;
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats]               = useState<DashboardStats>(DEFAULT_STATS);
  const [loading, setLoading]           = useState(true);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("loading");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setBackendStatus("loading");

    // First try the aggregate dashboard endpoint
    const aggregate = await safeFetch<DashboardStats>(
      "http://localhost:8080/api/v1/dashboard/stats"
    );

    if (aggregate) {
      setStats(aggregate);
      setBackendStatus("online");
      setLastRefreshed(new Date());
      setLoading(false);
      return;
    }

    // Aggregate unavailable — query individual endpoints in parallel
    const [students, teachers, attendance, notices, fees, gallery] = await Promise.all([
      safeFetch<unknown[]>("http://localhost:8080/api/v1/students"),
      safeFetch<unknown[]>("http://localhost:8080/api/v1/teachers"),
      safeFetch<unknown[]>("http://localhost:8080/api/v1/attendance"),
      safeFetch<unknown[]>("http://localhost:8080/api/v1/notices"),
      safeFetch<unknown[]>("http://localhost:8080/api/v1/fees"),
      safeFetch<unknown[]>("http://localhost:8080/api/v1/gallery"),
    ]);

    // If at least one individual endpoint responds the backend is partially online
    const anyOnline = [students, teachers, attendance, notices, fees, gallery].some(Boolean);

    if (anyOnline) {
      setStats({
        totalStudents:          students?.length           ?? 0,
        totalTeachers:          teachers?.length           ?? 0,
        totalAttendanceRecords: attendance?.length         ?? 0,
        totalNotices:           notices?.length            ?? 0,
        totalFeeRecords:        fees?.length               ?? 0,
        totalGalleryItems:      gallery?.length            ?? 0,
      });
      setBackendStatus("online");
      setLastRefreshed(new Date());
    } else {
      // Backend is completely offline — keep zeros, show banner
      setBackendStatus("offline");
    }

    setLoading(false);
  };

  useEffect(() => { loadStats(); }, []);

  // ── Stat card definitions ────────────────────────────────────────────────
  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: <Users className="h-6 w-6 text-sky-600" />,
      iconBg: "bg-sky-100",
      href: "/students",
      linkLabel: "Manage Students",
      linkColor: "text-sky-600 hover:text-sky-700",
      trend: "+12 this term",
    },
    {
      label: "Teaching Staff",
      value: stats.totalTeachers,
      icon: <Briefcase className="h-6 w-6 text-emerald-600" />,
      iconBg: "bg-emerald-100",
      href: "/teachers",
      linkLabel: "Manage Staff",
      linkColor: "text-emerald-600 hover:text-emerald-700",
      trend: "Active faculty",
    },
    {
      label: "Attendance Logs",
      value: stats.totalAttendanceRecords,
      icon: <CalendarCheck className="h-6 w-6 text-purple-600" />,
      iconBg: "bg-purple-100",
      href: "/attendance",
      linkLabel: "Mark Attendance",
      linkColor: "text-purple-600 hover:text-purple-700",
      trend: "This academic year",
    },
    {
      label: "Notices & Circulars",
      value: stats.totalNotices,
      icon: <Bell className="h-6 w-6 text-amber-600" />,
      iconBg: "bg-amber-100",
      href: "/notices",
      linkLabel: "View Notice Board",
      linkColor: "text-amber-600 hover:text-amber-700",
      trend: "Published circulars",
    },
    {
      label: "Fee Records",
      value: stats.totalFeeRecords,
      icon: <DollarSign className="h-6 w-6 text-red-600" />,
      iconBg: "bg-red-100",
      href: "/fees",
      linkLabel: "Fee Management",
      linkColor: "text-red-600 hover:text-red-700",
      trend: "All terms tracked",
    },
    {
      label: "Gallery Items",
      value: stats.totalGalleryItems,
      icon: <ImageIcon className="h-6 w-6 text-indigo-600" />,
      iconBg: "bg-indigo-100",
      href: "/gallery",
      linkLabel: "View Gallery",
      linkColor: "text-indigo-600 hover:text-indigo-700",
      trend: "Photos & videos",
    },
  ];

  // ── Quick-action module links ─────────────────────────────────────────────
  const quickActions = [
    { href: "/students",    icon: <Users className="h-7 w-7 text-sky-600" />,     label: "Students",          bg: "bg-sky-50 hover:bg-sky-100 border-sky-100" },
    { href: "/teachers",    icon: <Briefcase className="h-7 w-7 text-emerald-600" />, label: "Teachers",       bg: "bg-emerald-50 hover:bg-emerald-100 border-emerald-100" },
    { href: "/attendance",  icon: <CalendarCheck className="h-7 w-7 text-purple-600" />, label: "Attendance",  bg: "bg-purple-50 hover:bg-purple-100 border-purple-100" },
    { href: "/admin/marks", icon: <GraduationCap className="h-7 w-7 text-orange-600" />, label: "Marks & Results", bg: "bg-orange-50 hover:bg-orange-100 border-orange-100" },
    { href: "/notices",     icon: <Bell className="h-7 w-7 text-amber-600" />,    label: "Notices",           bg: "bg-amber-50 hover:bg-amber-100 border-amber-100" },
    { href: "/fees",        icon: <DollarSign className="h-7 w-7 text-red-600" />, label: "Fees",             bg: "bg-red-50 hover:bg-red-100 border-red-100" },
    { href: "/gallery",     icon: <ImageIcon className="h-7 w-7 text-indigo-600" />, label: "Gallery",         bg: "bg-indigo-50 hover:bg-indigo-100 border-indigo-100" },
    { href: "/staff",       icon: <UserCheck className="h-7 w-7 text-teal-600" />, label: "Staff Directory",  bg: "bg-teal-50 hover:bg-teal-100 border-teal-100" },
    { href: "/portal",      icon: <BookOpen className="h-7 w-7 text-cyan-600" />,  label: "Student Portal",   bg: "bg-cyan-50 hover:bg-cyan-100 border-cyan-100" },
    { href: "/admissions",  icon: <ClipboardList className="h-7 w-7 text-violet-600" />, label: "Admissions", bg: "bg-violet-50 hover:bg-violet-100 border-violet-100" },
    { href: "/results",     icon: <TrendingUp className="h-7 w-7 text-lime-600" />, label: "Public Results",  bg: "bg-lime-50 hover:bg-lime-100 border-lime-100" },
    { href: "/",            icon: <Shield className="h-7 w-7 text-slate-600" />,   label: "Public Website",   bg: "bg-slate-50 hover:bg-slate-100 border-slate-100" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Top Admin Header Bar */}
      <div className="bg-[#071526] text-white px-4 sm:px-8 py-4 shadow-lg border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
              <LayoutDashboard className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold font-crest text-white">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Wesley High School, Kalmunai — School Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <p className="text-xs text-slate-400 hidden sm:block">
                Last updated: {lastRefreshed.toLocaleTimeString()}
              </p>
            )}
            <button
              onClick={loadStats}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sm text-slate-200 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link href="/" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-lg transition-colors">
              Public Site →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* Backend Status Banner */}
        {backendStatus === "offline" && !loading && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-sm">
            <WifiOff className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900">Backend Server Offline</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Could not reach <code className="bg-amber-100 px-1 rounded font-mono">http://localhost:8080</code>.
                Ensure the Spring Boot server is running with <code className="bg-amber-100 px-1 rounded font-mono">mvn spring-boot:run</code> and MongoDB is active on port 27017. Statistics will appear once reconnected.
              </p>
            </div>
            <button
              onClick={loadStats}
              className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
            </button>
          </div>
        )}

        {backendStatus === "online" && !loading && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-sm text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Backend server connected — live data loaded successfully.</span>
          </div>
        )}

        {/* Stats Grid */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">System Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.label}</p>
                    <h3 className="text-4xl font-extrabold text-slate-900 mt-2 font-crest">
                      {loading ? (
                        <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
                      ) : (
                        backendStatus === "offline" ? (
                          <span className="text-slate-300 text-2xl">—</span>
                        ) : (
                          card.value.toLocaleString()
                        )
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{card.trend}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                    {card.icon}
                  </div>
                </div>
                <Link
                  href={card.href}
                  className={`mt-5 flex items-center text-sm font-semibold ${card.linkColor} transition-colors`}
                >
                  {card.linkLabel} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Module Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h2 className="text-lg font-extrabold text-slate-900 font-crest mb-6 flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-amber-600" /> All Modules — Quick Access
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:scale-[1.03] hover:shadow-sm ${action.bg}`}
              >
                <div className="mb-2">{action.icon}</div>
                <span className="text-xs font-semibold text-slate-800 text-center leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Info Footer */}
        <div className="text-center text-xs text-slate-400 pb-4">
          <p>Wesley High School Management System · Backend API: <code className="font-mono">localhost:8080</code> · Database: <code className="font-mono">mongodb://localhost:27017/wesley_school</code></p>
        </div>

      </div>
    </div>
  );
}
