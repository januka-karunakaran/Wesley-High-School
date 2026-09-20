"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Search, Mail, Phone, GraduationCap,
  ArrowLeft, Loader2, BookOpen, Filter, Grid, List
} from "lucide-react";

interface Teacher {
  id: string;
  teacherId: string;
  fullName: string;
  email?: string;
  phone?: string;
  subjectSpecialization: string;
  qualification: string;
  photoUrl?: string;
  academicYear?: string;
  status?: string;
  department?: string;
  designation?: string;
  bio?: string;
  joinYear?: number;
}

const MOCK_STAFF: Teacher[] = [
  {
    id: "t1", teacherId: "WHS-STF-001", fullName: "Mr. K. Thangarajah",
    email: "thangarajah@wesleyhighkalmunai.lk", phone: "+94 77 211 1001",
    subjectSpecialization: "Mathematics", qualification: "B.Sc (Hons) Maths, Univ. of Peradeniya",
    department: "Science & Mathematics", designation: "Head of Department – Mathematics",
    bio: "Over 22 years of experience teaching Pure and Applied Mathematics at A/L and O/L levels. Former Eastern Province Best Teacher Awardee 2019.",
    joinYear: 2003, status: "ACTIVE",
  },
  {
    id: "t2", teacherId: "WHS-STF-002", fullName: "Ms. S. Priyanthi",
    email: "priyanthi@wesleyhighkalmunai.lk", phone: "+94 77 211 1002",
    subjectSpecialization: "Biology & Chemistry", qualification: "B.Sc (Hons) Biological Sciences, Univ. of Jaffna",
    department: "Science & Mathematics", designation: "Senior Teacher – Biological Science",
    bio: "Specialist in A/L Biology and Chemistry, with a passion for field science and environmental education. Coordinator of the Eco Club.",
    joinYear: 2008, status: "ACTIVE",
  },
  {
    id: "t3", teacherId: "WHS-STF-003", fullName: "Mr. A. R. Faseekudeen",
    email: "faseekudeen@wesleyhighkalmunai.lk", phone: "+94 77 211 1003",
    subjectSpecialization: "English Language & Literature", qualification: "B.A. (Hons) English, Univ. of Colombo | TEFL Certified",
    department: "Languages", designation: "Head of Department – English",
    bio: "Award-winning English educator with 18 years of service, specialising in English Literature and Language for O/L and A/L Arts stream students.",
    joinYear: 2006, status: "ACTIVE",
  },
  {
    id: "t4", teacherId: "WHS-STF-004", fullName: "Mrs. T. Nithyanantham",
    email: "nithyanantham@wesleyhighkalmunai.lk", phone: "+94 77 211 1004",
    subjectSpecialization: "Tamil Language & History", qualification: "B.A. (Hons) Tamil, Eastern Univ. Sri Lanka",
    department: "Languages", designation: "Senior Teacher – Tamil & History",
    bio: "Dedicated Tamil language educator with expertise in Tamil literature, grammar, and Eastern Sri Lanka heritage.",
    joinYear: 2011, status: "ACTIVE",
  },
  {
    id: "t5", teacherId: "WHS-STF-005", fullName: "Mr. P. Kanagalingam",
    email: "kanagalingam@wesleyhighkalmunai.lk", phone: "+94 77 211 1005",
    subjectSpecialization: "Physics", qualification: "B.Sc (Hons) Physics, Univ. of Peradeniya | M.Sc (Reading)",
    department: "Science & Mathematics", designation: "A/L Physics Teacher",
    bio: "Passionate about modern physics and engineering concepts. Runs weekly physics olympiad training for senior students.",
    joinYear: 2015, status: "ACTIVE",
  },
  {
    id: "t6", teacherId: "WHS-STF-006", fullName: "Ms. R. Mahendran",
    email: "mahendran@wesleyhighkalmunai.lk", phone: "+94 77 211 1006",
    subjectSpecialization: "Commerce & Accounting", qualification: "B.Sc. Business Administration, SLIIT | CIMA (Part)",
    department: "Commerce & Business", designation: "Head of Department – Commerce",
    bio: "Commerce and Accounting specialist with 14 years of experience. Students under her guidance consistently achieve national level distinction at A/L.",
    joinYear: 2010, status: "ACTIVE",
  },
  {
    id: "t7", teacherId: "WHS-STF-007", fullName: "Mr. D. Jeyaram",
    email: "jeyaram@wesleyhighkalmunai.lk", phone: "+94 77 211 1007",
    subjectSpecialization: "ICT & Computer Science", qualification: "B.Sc (Hons) Computer Science, Univ. of Moratuwa",
    department: "Technology", designation: "ICT Coordinator & Teacher-in-Charge",
    bio: "Modern ICT educator managing Wesley's computer laboratories. Trains students for national and international coding competitions.",
    joinYear: 2017, status: "ACTIVE",
  },
  {
    id: "t8", teacherId: "WHS-STF-008", fullName: "Mrs. V. Vaithilingam",
    email: "vaithilingam@wesleyhighkalmunai.lk", phone: "+94 77 211 1008",
    subjectSpecialization: "Art & Drama", qualification: "B.A. (Hons) Fine Arts, Univ. of Kelaniya",
    department: "Arts & Humanities", designation: "Senior Teacher – Art, Aesthetics & Drama",
    bio: "Visionary arts educator who has directed multiple award-winning productions at the Eastern Province Drama Competitions.",
    joinYear: 2012, status: "ACTIVE",
  },
  {
    id: "t9", teacherId: "WHS-STF-009", fullName: "Mr. S. Manikandan",
    email: "manikandan@wesleyhighkalmunai.lk", phone: "+94 77 211 1009",
    subjectSpecialization: "Physical Education & Sports", qualification: "B.Sc. Sports Science, Sri Lanka Sports Sciences Institute",
    department: "Sports & Extra-Curricular", designation: "Physical Director & Sports Coordinator",
    bio: "National-level athlete and PE specialist who has trained Wesley teams to multiple Eastern Province athletic championships.",
    joinYear: 2014, status: "ACTIVE",
  },
  {
    id: "t10", teacherId: "WHS-STF-010", fullName: "Ms. F. Hasanah",
    email: "hasanah@wesleyhighkalmunai.lk", phone: "+94 77 211 1010",
    subjectSpecialization: "Geography & Environmental Science", qualification: "B.Sc. Geography (Hons), Eastern Univ. Sri Lanka",
    department: "Social Studies", designation: "Class Teacher & Senior Teacher – Geography",
    bio: "Environmental science advocate and geography specialist, leading the school's environmental initiatives and climate awareness programs.",
    joinYear: 2018, status: "ACTIVE",
  },
  {
    id: "t11", teacherId: "WHS-STF-011", fullName: "Mr. C. Elankeeran",
    email: "elankeeran@wesleyhighkalmunai.lk", phone: "+94 77 211 1011",
    subjectSpecialization: "Sinhala Language", qualification: "B.A. (Hons) Sinhala, Univ. of Colombo",
    department: "Languages", designation: "Sinhala Language Teacher",
    bio: "Specialist in Sinhala language for multi-ethnic student contexts. Active in promoting inter-ethnic harmony through language education.",
    joinYear: 2019, status: "ACTIVE",
  },
  {
    id: "t12", teacherId: "WHS-STF-012", fullName: "Mrs. K. Sivarajah",
    email: "sivarajah@wesleyhighkalmunai.lk", phone: "+94 77 211 1012",
    subjectSpecialization: "Mathematics (Primary & Junior)", qualification: "Teacher College Diploma, OUSL",
    department: "Primary Section", designation: "Head of Primary Section",
    bio: "Experienced primary mathematics educator with 20+ years nurturing mathematical foundations and scholarship exam coaching.",
    joinYear: 2004, status: "ACTIVE",
  },
];

const DEPARTMENTS = ["All", "Science & Mathematics", "Languages", "Commerce & Business", "Technology", "Arts & Humanities", "Social Studies", "Sports & Extra-Curricular", "Primary Section"];

const deptColors: Record<string, string> = {
  "Science & Mathematics": "bg-sky-100 text-sky-800 border-sky-200",
  "Languages":             "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Commerce & Business":   "bg-amber-100 text-amber-800 border-amber-200",
  "Technology":            "bg-purple-100 text-purple-800 border-purple-200",
  "Arts & Humanities":     "bg-rose-100 text-rose-800 border-rose-200",
  "Social Studies":        "bg-teal-100 text-teal-800 border-teal-200",
  "Sports & Extra-Curricular": "bg-orange-100 text-orange-800 border-orange-200",
  "Primary Section":       "bg-indigo-100 text-indigo-800 border-indigo-200",
};

function getInitials(name: string) {
  return name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join("");
}

const AVATAR_COLORS = [
  "from-sky-600 to-indigo-700",
  "from-emerald-600 to-teal-700",
  "from-amber-500 to-orange-600",
  "from-purple-600 to-violet-700",
  "from-rose-600 to-pink-700",
];

export default function StaffDirectoryPage() {
  const [staff, setStaff]             = useState<Teacher[]>(MOCK_STAFF);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDept, setActiveDept]   = useState("All");
  const [viewMode, setViewMode]       = useState<"grid" | "list">("grid");
  const [selected, setSelected]       = useState<Teacher | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/teachers");
        if (res.ok) {
          const data: Teacher[] = await res.json();
          if (data.length > 0) setStaff(data.length > 5 ? data : [...data, ...MOCK_STAFF]);
        }
      } catch { /* use mock */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = staff.filter(t => {
    const matchDept   = activeDept === "All" || t.department === activeDept;
    const matchSearch = !searchQuery ||
      t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjectSpecialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.designation?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  // Group by department for list view
  const grouped = DEPARTMENTS.filter(d => d !== "All").reduce<Record<string, Teacher[]>>((acc, dept) => {
    const members = filtered.filter(t => t.department === dept);
    if (members.length > 0) acc[dept] = members;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-[#071526] text-white py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-crest">Staff Directory</h1>
                <p className="text-slate-300 text-sm">Meet the dedicated educators of Wesley High School, Kalmunai</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Users className="w-4 h-4 text-amber-400" />
              <span><strong className="text-white text-lg">{filtered.length}</strong> staff members</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, subject, or designation..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-[#071526] text-amber-300" : "text-slate-500 hover:bg-slate-100"}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-[#071526] text-amber-300" : "text-slate-500 hover:bg-slate-100"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Department Filter */}
        <div className="flex flex-wrap gap-2">
          {DEPARTMENTS.map(dept => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeDept === dept ? "bg-[#071526] text-amber-300 border-amber-500/30" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading staff directory...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold">No staff members found matching your search.</p>
          </div>
        ) : viewMode === "grid" ? (
          /* ── GRID VIEW ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((teacher, idx) => (
              <button
                key={teacher.id}
                onClick={() => setSelected(teacher)}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-left hover:shadow-md hover:border-amber-300 transition-all group"
              >
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white font-extrabold text-xl mb-4 shadow-md`}>
                  {teacher.photoUrl
                    ? <img src={teacher.photoUrl} alt={teacher.fullName} className="w-full h-full object-cover rounded-full" />
                    : getInitials(teacher.fullName)}
                </div>

                <h3 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors font-crest text-base leading-snug">
                  {teacher.fullName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{teacher.designation || teacher.subjectSpecialization}</p>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{teacher.subjectSpecialization}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <GraduationCap className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{teacher.qualification}</span>
                  </div>
                  {teacher.joinYear && (
                    <div className="text-xs text-slate-400 mt-1">
                      Since {teacher.joinYear} · {new Date().getFullYear() - teacher.joinYear} yrs
                    </div>
                  )}
                </div>

                {teacher.department && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${deptColors[teacher.department] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>
                      {teacher.department}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          /* ── LIST VIEW — grouped by department ── */
          <div className="space-y-8">
            {Object.entries(grouped).map(([dept, members]) => (
              <div key={dept}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-4 flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded border text-[11px] ${deptColors[dept] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>{dept}</span>
                  <span className="text-slate-400 font-normal">— {members.length} members</span>
                </h3>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                  {members.map((teacher, idx) => (
                    <button
                      key={teacher.id}
                      onClick={() => setSelected(teacher)}
                      className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors group"
                    >
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                        {getInitials(teacher.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">{teacher.fullName}</p>
                        <p className="text-xs text-slate-500 truncate">{teacher.designation || teacher.subjectSpecialization}</p>
                      </div>
                      <div className="hidden sm:block text-right">
                        <p className="text-xs text-slate-600 truncate max-w-[160px]">{teacher.qualification}</p>
                        {teacher.joinYear && <p className="text-[11px] text-slate-400">Since {teacher.joinYear}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Staff Profile Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-br from-[#071526] to-[#0c2444] p-6 text-white">
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><span className="sr-only">Close</span>✕</button>
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${AVATAR_COLORS[0]} flex items-center justify-center text-white font-extrabold text-2xl border-4 border-amber-400 shadow-lg`}>
                  {selected.photoUrl
                    ? <img src={selected.photoUrl} alt={selected.fullName} className="w-full h-full object-cover rounded-full" />
                    : getInitials(selected.fullName)}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold font-crest text-white">{selected.fullName}</h2>
                  <p className="text-sm text-amber-300 mt-0.5">{selected.designation || selected.subjectSpecialization}</p>
                  <p className="text-xs text-slate-400 mt-1">{selected.teacherId}</p>
                  {selected.department && (
                    <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded border ${deptColors[selected.department] ?? "bg-slate-700 text-white border-slate-600"}`}>
                      {selected.department}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {selected.bio && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Biography</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{selected.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Qualification</h4>
                  <p className="text-slate-800 font-medium">{selected.qualification}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Subject</h4>
                  <p className="text-slate-800 font-medium">{selected.subjectSpecialization}</p>
                </div>
                {selected.joinYear && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Service</h4>
                    <p className="text-slate-800 font-medium">Since {selected.joinYear} · {new Date().getFullYear() - selected.joinYear} years</p>
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Status</h4>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${selected.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                    {selected.status}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors">
                    <Mail className="w-4 h-4 text-amber-600" /> {selected.email}
                  </a>
                )}
                {selected.phone && (
                  <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors">
                    <Phone className="w-4 h-4 text-amber-600" /> {selected.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
