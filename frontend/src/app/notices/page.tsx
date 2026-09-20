"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell, Search, Filter, Download, FileText, Calendar,
  ChevronRight, AlertCircle, Info, BookOpen, Award,
  ArrowLeft, ExternalLink, Clock, Tag, Loader2
} from "lucide-react";

interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  category?: string;
  urgent?: boolean;
  pdfUrl?: string;
  pdfFileName?: string;
  postedBy?: string;
  createdAt?: string;
}

// ── Realistic fallback circulars ───────────────────────────────────────────
const MOCK_NOTICES: Notice[] = [
  {
    id: "m1", type: "Circular", category: "Examinations", urgent: true,
    title: "G.C.E. (O/L) 2025 Internal Assessment Timetable – Term 2",
    description: "The second-term internal assessment schedule for Grades 10 and 11 has been finalised. Students are advised to report 30 minutes before the first paper. Hall tickets must be collected from the class teacher by October 5, 2025.",
    date: "2025-09-18", postedBy: "Academic Branch, Wesley High School",
    pdfFileName: "OL_Assessment_Timetable_Term2_2025.pdf",
  },
  {
    id: "m2", type: "Notice", category: "Admissions", urgent: true,
    title: "Grade 1 Admission 2026 – Official Notification & Document Checklist",
    description: "Applications are invited for Grade 1 admission for the academic year 2026 under the National School Admission Guidelines issued by the Ministry of Education. Interviews will be held from November 10–20, 2025.",
    date: "2025-09-15", postedBy: "Principal's Office",
    pdfFileName: "Grade1_Admission_2026_Circular.pdf",
  },
  {
    id: "m3", type: "Event", category: "Sports",
    title: "140th Annual Inter-House Athletic Championship – Wesley Grounds",
    description: "The prestigious Inter-House Athletic Championship will be held on October 20, 2025. All four houses — Wesley, Arthur, Mack, and Allen — will compete. Parents are warmly invited to attend.",
    date: "2025-10-20", postedBy: "Sports Committee",
  },
  {
    id: "m4", type: "Circular", category: "Academic",
    title: "A/L Science & Commerce Stream Registration – 2025/2026",
    description: "Students qualifying for Grade 12 are requested to submit stream preference forms to the A/L coordinator by September 30. Minimum Z-score criteria apply for Physical Science and Biological Science streams.",
    date: "2025-09-10", postedBy: "A/L Coordinator",
    pdfFileName: "AL_Stream_Registration_2025.pdf",
  },
  {
    id: "m5", type: "Notice", category: "Achievements",
    title: "All-Island Science Fair – Wesley Team Qualifies for National Round",
    description: "Congratulations to the Wesley High School Senior Science Society team for qualifying to the National Round of the All-Island School Science & Innovation Fair with their Smart Agricultural Monitoring System project.",
    date: "2025-09-05", postedBy: "Science Department",
  },
  {
    id: "m6", type: "Circular", category: "Examinations",
    title: "Grade 5 Scholarship Examination 2025 – Preparation Workshops",
    description: "Intensive coaching sessions for Grade 5 scholarship aspirants will be conducted every Saturday from October 4, 2025. Registration open at the Primary Section office.",
    date: "2025-09-01", postedBy: "Primary Section Head",
    pdfFileName: "Grade5_Scholarship_Workshop_Schedule.pdf",
  },
  {
    id: "m7", type: "Event", category: "Heritage",
    title: "Wesley Day Thanksgiving Service – 140th Founders' Commemoration",
    description: "The annual Wesley Day Thanksgiving Service will be held on October 2, 2025, at the College Memorial Hall. All students, staff, and OBA members are cordially invited. Dress code: Full School Uniform.",
    date: "2025-10-02", postedBy: "Principal's Office",
  },
  {
    id: "m8", type: "Circular", category: "Academic",
    title: "Mid-Year Academic Progress Reports – Parent Distribution Schedule",
    description: "Mid-year progress reports for Grades 6–11 will be distributed during the Parent-Teacher Meeting scheduled for September 27, 2025. At least one parent/guardian must collect the report in person.",
    date: "2025-08-28", postedBy: "Academic Branch",
    pdfFileName: "PTM_Schedule_Sept2025.pdf",
  },
];

const CATEGORIES = ["All", "Circular", "Notice", "Event", "Academic", "Examinations", "Admissions", "Sports", "Achievements"];

const categoryColors: Record<string, string> = {
  "Examinations": "bg-purple-100 text-purple-800 border-purple-200",
  "Admissions":   "bg-sky-100 text-sky-800 border-sky-200",
  "Academic":     "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Sports":       "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Achievements": "bg-amber-100 text-amber-800 border-amber-200",
  "Heritage":     "bg-rose-100 text-rose-800 border-rose-200",
};

const typeIcons: Record<string, React.ReactNode> = {
  "Circular": <FileText className="w-4 h-4" />,
  "Notice":   <Bell className="w-4 h-4" />,
  "Event":    <Calendar className="w-4 h-4" />,
};

export default function NoticesPage() {
  const [notices, setNotices]           = useState<Notice[]>(MOCK_NOTICES);
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery]   = useState("");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/notices");
        if (res.ok) {
          const data: Notice[] = await res.json();
          if (data.length > 0) setNotices([...data, ...MOCK_NOTICES]);
        }
      } catch { /* backend offline – use mock */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = notices.filter(n => {
    const cat = activeCategory;
    const matchesCat =
      cat === "All" ||
      n.type === cat ||
      n.category === cat;
    const matchesSearch =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const urgent = notices.filter(n => n.urgent).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-[#071526] text-white py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
              <Bell className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-crest">Official Notice Board & Circulars</h1>
          </div>
          <p className="text-slate-300 text-sm max-w-2xl">
            Wesley High School, Kalmunai — Official announcements, ministry circulars, examination schedules, and upcoming events.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {/* Urgent Banner */}
        {urgent.length > 0 && (
          <div className="mb-8 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Important Notices
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {urgent.map(n => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNotice(n)}
                  className="text-left p-4 bg-red-50 border border-red-200 rounded-xl hover:border-red-400 transition-colors"
                >
                  <span className="inline-block px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded mb-2">Urgent</span>
                  <p className="text-sm font-bold text-slate-900 line-clamp-2">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(n.date).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search notices, circulars, events..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-medium">{filtered.length} notices</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                activeCategory === cat
                  ? "bg-[#071526] text-amber-300 border-amber-500/30 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notices Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading circulars...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold">No notices found for the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(notice => (
              <div
                key={notice.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all group"
              >
                <div className="p-5 flex items-start gap-5">
                  {/* Date Badge */}
                  <div className="shrink-0 w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center group-hover:bg-amber-50 group-hover:border-amber-200 transition-colors">
                    <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-amber-600">
                      {new Date(notice.date).toLocaleString("en", { month: "short" })}
                    </span>
                    <span className="text-xl font-extrabold text-slate-800 group-hover:text-amber-700">
                      {new Date(notice.date).getDate()}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {new Date(notice.date).getFullYear()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {notice.urgent && (
                        <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded">
                          Important
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${
                        categoryColors[notice.category ?? ""] ?? "bg-slate-100 text-slate-700 border-slate-200"
                      }`}>
                        {notice.category ?? notice.type}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded border border-slate-200">
                        {typeIcons[notice.type] ?? <Tag className="w-3 h-3" />} {notice.type}
                      </span>
                      {notice.postedBy && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {notice.postedBy}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {notice.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <button
                        onClick={() => setSelectedNotice(notice)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Read Full Notice
                      </button>
                      {notice.pdfFileName && (
                        <button
                          onClick={() => alert(`Downloading: ${notice.pdfFileName}`)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> {notice.pdfFileName}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#071526] px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedNotice.urgent && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded">Urgent</span>
                    )}
                    <span className="text-xs text-amber-400 font-semibold uppercase tracking-wide">
                      {selectedNotice.category ?? selectedNotice.type}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white font-crest">{selectedNotice.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(selectedNotice.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    {selectedNotice.postedBy && ` · ${selectedNotice.postedBy}`}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="shrink-0 text-slate-400 hover:text-white p-1 transition-colors"
                >✕</button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed">{selectedNotice.description}</p>

              {selectedNotice.pdfFileName && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{selectedNotice.pdfFileName}</p>
                      <p className="text-xs text-slate-500">Official PDF Circular · Wesley High School</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading: ${selectedNotice.pdfFileName}`)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
