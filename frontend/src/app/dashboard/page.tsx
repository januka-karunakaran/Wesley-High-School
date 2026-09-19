"use client";

import React, { useState, useEffect } from 'react';
import { Users, Briefcase, CalendarCheck, GraduationCap, LayoutDashboard, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalAttendanceRecords: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <LayoutDashboard className="text-indigo-600 h-8 w-8" />
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Overview and management of Wesley High School.</p>
          </div>
          <Link href="/" className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm">
            View Public Site
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Students</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin text-indigo-500" /> : stats?.totalStudents || 0}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Link href="/students" className="mt-6 flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
              Manage Students <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Teachers</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin text-indigo-500" /> : stats?.totalTeachers || 0}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <Link href="/teachers" className="mt-6 flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Manage Teachers <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Attendance Logs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin text-indigo-500" /> : stats?.totalAttendanceRecords || 0}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <CalendarCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <Link href="/attendance" className="mt-6 flex items-center text-sm font-medium text-purple-600 hover:text-purple-700">
              Mark Attendance <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/students" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
              <Users className="h-8 w-8 text-indigo-600 mb-3" />
              <span className="font-medium text-gray-900">Students</span>
            </Link>
            <Link href="/teachers" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
              <Briefcase className="h-8 w-8 text-emerald-600 mb-3" />
              <span className="font-medium text-gray-900">Teachers</span>
            </Link>
            <Link href="/attendance" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
              <CalendarCheck className="h-8 w-8 text-purple-600 mb-3" />
              <span className="font-medium text-gray-900">Attendance</span>
            </Link>
            <Link href="/marks" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
              <GraduationCap className="h-8 w-8 text-orange-600 mb-3" />
              <span className="font-medium text-gray-900">Marks & Results</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
