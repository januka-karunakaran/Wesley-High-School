"use client";

import React, { useState, useEffect } from 'react';
import { School, Calendar, Bell, ChevronRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
}

export default function PublicHome() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/notices");
        if (res.ok) {
          const data = await res.json();
          setNotices(data);
        }
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl">
              <School className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Wesley High School</h1>
              <p className="text-xs font-medium text-indigo-600 tracking-wide uppercase">Utmost for the Highest</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/results" className="hidden md:inline-flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium rounded-lg transition-colors">
              Student Results
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all active:scale-95">
              <LayoutDashboard className="h-4 w-4" /> Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-indigo-900 text-white overflow-hidden flex-1 flex items-center justify-center min-h-[500px]">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-indigo-900 to-black"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-800/50 border border-indigo-700 text-indigo-200 text-xs font-semibold tracking-wider uppercase mb-2 backdrop-blur-sm">
            Excellence Since 1923
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Empowering Minds. <br/> <span className="text-indigo-400">Shaping Futures.</span>
          </h1>
          <p className="text-xl md:text-2xl text-indigo-200 max-w-2xl mx-auto font-light">
            Welcome to Wesley High School. We are committed to academic excellence, character development, and creating leaders for tomorrow.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/admissions" className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-all">
              Apply for Admission
            </Link>
            <Link href="#notices" className="w-full sm:w-auto px-8 py-4 bg-indigo-800/50 hover:bg-indigo-800/80 border border-indigo-700 text-white font-medium rounded-xl transition-all backdrop-blur-sm flex items-center justify-center gap-2">
              View Latest News <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Notices & Events Section */}
      <div id="notices" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12">
            
            {/* Notices Board */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-red-100 p-2.5 rounded-lg">
                  <Bell className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Notice Board</h2>
              </div>
              
              <div className="space-y-4">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                    ))}
                  </div>
                ) : notices.filter(n => n.type === 'Notice').length > 0 ? (
                  notices.filter(n => n.type === 'Notice').map(notice => (
                    <div key={notice.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 group-hover:bg-red-600 transition-colors"></div>
                      <span className="text-xs font-semibold text-gray-500 mb-2 block">{new Date(notice.date).toLocaleDateString()}</span>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{notice.title}</h3>
                      <p className="text-sm text-gray-600">{notice.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 bg-white rounded-xl border border-gray-200 text-center text-gray-500">
                    No recent notices posted.
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-emerald-100 p-2.5 rounded-lg">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              </div>
              
              <div className="space-y-4">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1,2].map(i => (
                      <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                    ))}
                  </div>
                ) : notices.filter(n => n.type === 'Event').length > 0 ? (
                  notices.filter(n => n.type === 'Event').map(event => (
                    <div key={event.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start gap-5 hover:border-emerald-200 transition-colors">
                      <div className="flex flex-col items-center justify-center bg-emerald-50 rounded-lg p-3 min-w-[70px]">
                        <span className="text-xs font-bold text-emerald-600 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-2xl font-extrabold text-emerald-700">{new Date(event.date).getDate()}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 bg-white rounded-xl border border-gray-200 text-center text-gray-500">
                    No upcoming events.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center text-sm border-t border-gray-800">
        <p>&copy; {new Date().getFullYear()} Wesley High School. All rights reserved.</p>
        <p className="mt-2">Developed as part of the Wesley School Management System.</p>
      </footer>
    </div>
  );
}
