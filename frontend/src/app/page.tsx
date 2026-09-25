"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  School,
  Calendar,
  Bell,
  ChevronRight,
  LayoutDashboard,
  GraduationCap,
  Award,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  BookOpen,
  Trophy,
  Shield,
  FileText,
  Download,
  ExternalLink,
  Search,
  Menu,
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  Compass,
  Sparkles,
  ChevronDown,
  Ticket
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";

interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  category?: string;
  isUrgent?: boolean;
  downloadUrl?: string;
}

// Fallback notices representing authentic Sri Lankan National School circulars
const FALLBACK_NOTICES: Notice[] = [
  {
    id: "not-01",
    title: "G.C.E. (Advanced Level) 2025/2026 Stream Selection & Applications",
    description: "Calling applications for Grade 12 A/L Physical Science, Biological Science, Commerce, Arts, and Technology streams. Submit before October 15.",
    date: "2025-09-18",
    type: "Notice",
    category: "Academic",
    isUrgent: true,
  },
  {
    id: "not-02",
    title: "140th Annual Inter-House Athletic Meet Schedule Announced",
    description: "The preliminary heats for track and field events will commence on the college grounds. All houses (Wesley, Arthur, Mack, Allen) are requested to assemble.",
    date: "2025-09-15",
    type: "Event",
    category: "Sports",
    isUrgent: false,
  },
  {
    id: "not-03",
    title: "Second Term Examination 2025 Timetable & Instructions",
    description: "Official examination schedule for Grades 6 through 11 has been published. Parents may download the full timetable and grading rubric below.",
    date: "2025-09-12",
    type: "Notice",
    category: "Examinations",
    isUrgent: false,
  },
  {
    id: "not-04",
    title: "Grade 1 Admission Circular 2026 - Ministry of Education Guidelines",
    description: "Interviews and document verification for Grade 1 admissions for the 2026 academic year. Please refer to national school criteria.",
    date: "2025-09-08",
    type: "Notice",
    category: "Admissions",
    isUrgent: true,
  },
  {
    id: "not-05",
    title: "Wesley Day Thanksgiving Service & Founders Memorial",
    description: "Special commemorative service honoring the founders and teachers of Wesley High School at the College Memorial Hall at 8:30 AM.",
    date: "2025-10-02",
    type: "Event",
    category: "Heritage",
    isUrgent: false,
  },
  {
    id: "not-06",
    title: "All-Island School Science & Innovation Fair - Wesley Delegation",
    description: "Congratulations to the Senior Science Society team for qualifying for the National Round in Colombo with their smart agricultural IoT system.",
    date: "2025-09-04",
    type: "Notice",
    category: "Achievements",
    isUrgent: false,
  },
];

export default function PublicHome() {
  const { t, language } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>(FALLBACK_NOTICES);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalModalOpen, setPortalModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/notices");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // merge backend notices with realistic rich notices
            setNotices([...data, ...FALLBACK_NOTICES]);
          }
        }
      } catch (error) {
        console.warn("Backend API offline; displaying collegiate portal notices.", error);
      }
    };
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory =
      activeCategory === "All" ||
      notice.category === activeCategory ||
      (activeCategory === "Events" && notice.type === "Event") ||
      (activeCategory === "Circulars" && notice.type === "Notice");

    const matchesSearch =
      searchQuery === "" ||
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const upcomingEvents = notices
    .filter((n) => n.type === "Event" || n.category === "Sports" || n.category === "Heritage")
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1. TOP UTILITY / ANNOUNCEMENT BAR */}
      <div className="bg-[#05111f] text-slate-300 text-xs border-b border-amber-500/20 py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-hidden text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/30 text-[11px] uppercase tracking-wider shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" /> {t("nationalSchoolBadge")}
            </span>
            <span className="hidden md:inline-block text-slate-400 text-xs truncate">
              {t("address")} • Estd. 1885
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
            <LanguageToggle variant="pill" />
            <div className="h-3.5 w-px bg-slate-700 hidden sm:block"></div>
            <Link
              href="/results"
              className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> {t("studentResults")}
            </Link>
            <button
              onClick={() => setPortalModalOpen(true)}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1 rounded border border-amber-500/40 flex items-center gap-1.5 transition-all"
            >
              <Lock className="w-3 h-3 text-amber-400" /> {t("portalLogin")}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#0a1b2e]/95 backdrop-blur-md border-b border-amber-500/20 text-white shadow-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* School Crest & Branding */}
          <Link href="/" className="flex items-center gap-3.5 group">
            {/* SVG School Crest */}
            <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#071526] rounded-[10px] flex items-center justify-center relative overflow-hidden p-1.5">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-amber-400 drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Shield Crest */}
                  <path
                    d="M50 8 L85 20 V50 C85 72 50 92 50 92 C50 92 15 72 15 50 V20 L50 8 Z"
                    fill="#0a1f38"
                    stroke="#cfa137"
                    strokeWidth="3.5"
                  />
                  {/* Inner gold division */}
                  <path
                    d="M50 16 L78 26 V48 C78 66 50 82 50 82 C50 82 22 66 22 48 V26 L50 16 Z"
                    fill="#071526"
                    stroke="#eab308"
                    strokeWidth="1.5"
                  />
                  {/* Cross & Torch Emblem */}
                  <path d="M50 25 V65 M36 38 H64" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                  {/* Open Book of Wisdom */}
                  <path
                    d="M38 52 C44 50 50 53 50 53 C50 53 56 50 62 52 V64 C56 62 50 65 50 65 C50 65 44 62 38 64 V52 Z"
                    fill="#1e3a5f"
                    stroke="#fef3c7"
                    strokeWidth="1.5"
                  />
                  {/* Flame of knowledge */}
                  <circle cx="50" cy="23" r="3.5" fill="#f59e0b" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-crest text-white group-hover:text-amber-300 transition-colors uppercase">
                  {t("schoolName")}
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded tracking-wider">
                  {t("location")}
                </span>
              </div>
              <p className="text-[12px] sm:text-[13px] font-serif italic text-amber-300/90 tracking-wide">
                &ldquo;{t("motto")}&rdquo;
              </p>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                {t("established")}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium text-slate-200">
            <Link href="/" className="text-amber-400 font-semibold transition-colors hover:text-amber-300 py-1 border-b-2 border-amber-400">
              {t("navHome")}
            </Link>
            <Link href="/timetable" className="hover:text-amber-300 transition-colors py-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{t("navTimetable")}</span>
            </Link>
            <Link href="/events" className="hover:text-amber-300 transition-colors py-1 flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>{t("navEvents")}</span>
            </Link>
            <Link href="/notices" className="hover:text-amber-300 transition-colors py-1">
              {t("navNotices")}
            </Link>
            <Link href="/gallery" className="hover:text-amber-300 transition-colors py-1">
              {t("navGallery")}
            </Link>
            <Link href="/portal" className="hover:text-amber-300 transition-colors py-1">
              {t("navPortal")}
            </Link>
            <Link href="/staff" className="hover:text-amber-300 transition-colors py-1">
              {t("navStaff")}
            </Link>
            <Link href="/admissions" className="hover:text-amber-300 transition-colors py-1">
              {t("navAdmissions")}
            </Link>
          </nav>

          {/* Quick Action & Portal Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/admissions"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              {t("enrollNow")}
            </Link>
            <button
              onClick={() => setPortalModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-lg flex items-center gap-2 transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              {t("portalLogin")}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#071526] border-t border-slate-800 px-6 py-5 space-y-4 animate-in slide-in-from-top-3">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Select Language / மொழி:</span>
              <LanguageToggle variant="pill" />
            </div>

            <nav className="flex flex-col space-y-3 text-base font-medium text-slate-200">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-amber-400 font-semibold"
              >
                {t("navHome")}
              </Link>
              <Link
                href="/timetable"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-300 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-amber-400" /> {t("navTimetable")}
              </Link>
              <Link
                href="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-300 transition-colors flex items-center gap-2"
              >
                <Ticket className="w-4 h-4 text-amber-400" /> {t("navEvents")}
              </Link>
              <Link
                href="/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-300 transition-colors flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" /> {t("navPortal")}
              </Link>
              <Link
                href="/results"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-300 transition-colors flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-400" /> {t("studentResults")}
              </Link>
              <Link
                href="/notices"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-300 transition-colors"
              >
                {t("navNotices")}
              </Link>
              <Link
                href="/gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-300 transition-colors"
              >
                {t("navGallery")}
              </Link>
              <Link
                href="/staff"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-300 transition-colors"
              >
                {t("navStaff")}
              </Link>
              <Link
                href="/admissions"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-300 transition-colors"
              >
                {t("navAdmissions")}
              </Link>
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-300 transition-colors"
              >
                {t("navContact")}
              </Link>
            </nav>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
              <Link
                href="/admissions"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition-colors"
              >
                Admissions Application
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setPortalModalOpen(true);
                }}
                className="w-full text-center py-2.5 bg-slate-800 text-white font-medium rounded-lg text-sm border border-slate-700 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-400" /> Portal Login (Staff/Students)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative bg-[#071526] text-white overflow-hidden py-24 sm:py-32 border-b border-amber-500/20">
        {/* Heraldic background textures & geometric glows */}
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d2238_1px,transparent_1px),linear-gradient(to_bottom,#0d2238_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30"></div>
        
        {/* Floating subtle crest watermark */}
        <div className="absolute right-1/12 -bottom-20 opacity-5 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-[500px] h-[500px] text-amber-300" fill="currentColor">
            <path d="M50 8 L85 20 V50 C85 72 50 92 50 92 C50 92 15 72 15 50 V20 L50 8 Z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-6">
            {/* National Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Methodist Heritage & National School • Kalmunai
            </div>

            {/* School Motto Title */}
            <div className="space-y-3">
              <p className="text-amber-400 text-sm sm:text-base font-crest font-semibold uppercase tracking-widest flex items-center gap-2">
                <span className="h-px w-8 bg-amber-400/60 inline-block"></span>
                The Motto of Wesley High School
              </p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-crest leading-[1.08] text-white">
                Utmost for the <br />
                <span className="gold-gradient-text drop-shadow">Highest.</span>
              </h1>
            </div>

            {/* Welcome statement */}
            <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed">
              Fostering intellectual brilliance, moral fortitude, and sporting honor on the historic eastern coast of Sri Lanka since 1885. Inspiring young men and women to lead our nation with dignity and integrity.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/admissions"
                className="px-7 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-2 group text-sm"
              >
                Apply for Admission 2025/26
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/results"
                className="px-7 py-3.5 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-600 text-white font-semibold rounded-xl backdrop-blur-md transition-all flex items-center gap-2 text-sm shadow-md"
              >
                <Award className="w-4 h-4 text-amber-400" />
                Check Student Results
              </Link>
              <Link
                href="#notices"
                className="px-6 py-3.5 bg-transparent hover:bg-slate-800/40 text-slate-300 hover:text-white font-medium rounded-xl transition-all flex items-center gap-1.5 text-sm"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                Latest Circulars
              </Link>
            </div>
          </div>

          {/* Key Facts / Hallmarks Bar */}
          <div className="mt-16 sm:mt-20 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-sm hover:border-amber-500/40 transition-colors">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-crest">140+</div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1">Years of Heritage</div>
              <div className="text-[12px] text-slate-400 mt-1">Estd. 1885 in Kalmunai</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-sm hover:border-amber-500/40 transition-colors">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-crest">2,800+</div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1">Enrolled Scholars</div>
              <div className="text-[12px] text-slate-400 mt-1">Grade 1 through Grade 13</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-sm hover:border-amber-500/40 transition-colors">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-crest">100%</div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1">G.C.E. A/L Excellence</div>
              <div className="text-[12px] text-slate-400 mt-1">Premier National Rankings</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-sm hover:border-amber-500/40 transition-colors">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-crest">4 Houses</div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1">35+ Clubs & Sports</div>
              <div className="text-[12px] text-slate-400 mt-1">Holistic Character Building</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRINCIPAL'S MESSAGE & ABOUT SECTION */}
      <section id="about" className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Principal's Portrait & Collegiate Credo */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Decorative Frame Elements */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-amber-500 via-sky-600 to-indigo-900 opacity-20 blur-lg"></div>
                
                <div className="relative rounded-2xl bg-gradient-to-b from-[#0c233c] to-[#061426] p-8 text-white shadow-2xl border border-amber-500/30 overflow-hidden">
                  <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl"></div>

                  {/* Profile Placeholder / Crest Artwork */}
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-32 h-32 rounded-full border-4 border-amber-400 p-1 bg-slate-800 shadow-xl overflow-hidden relative group">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex flex-col items-center justify-center text-amber-400">
                        <GraduationCap className="w-14 h-14" />
                      </div>
                    </div>

                    <div>
                      <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-semibold rounded-full uppercase tracking-wider border border-amber-400/30">
                        Principal & Head of School
                      </span>
                      <h3 className="text-xl font-bold font-crest mt-2 text-white">
                        Rev. / Mr. S. Jeyakumar
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        M.Ed (Col), B.Sc (Hons), Dip. in Educational Mgmt.
                      </p>
                      <p className="text-[11px] text-amber-400/90 font-mono mt-1">
                        Principal, Wesley High School, Kalmunai
                      </p>
                    </div>

                    <div className="w-full pt-4 border-t border-slate-700/80 text-left space-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Member of the Headmasters’ Conference of Sri Lanka</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>National School Division, Ministry of Education</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Message Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-amber-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-amber-500"></span> Principal&apos;s Welcome
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#071526] font-crest tracking-tight">
                  Guiding Generations with Honor, Wisdom & Faith
                </h2>
              </div>

              <blockquote className="border-l-4 border-amber-500 pl-4 italic text-slate-700 text-base sm:text-lg">
                &ldquo;At Wesley High School Kalmunai, we do not merely educate; we forge character. Guided by our solemn motto, <strong>&apos;Utmost for the Highest&apos;</strong>, we challenge each Wesleyite to seek excellence not for vanity, but for the elevation of our community and the service of Sri Lanka.&rdquo;
              </blockquote>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Established over a century ago under the venerable Methodist mission, Wesley High School has blossomed into a landmark center of scholarship in the Eastern Province. From the quiet shores of Kalmunai to prestigious universities around the globe, our alumni carry the hallmark of diligence, courage, and moral dignity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600" /> Academic Rigour
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Bilingual instruction across Science, Maths, Commerce, Technology, and Humanities.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-600" /> Sporting Tradition
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Renowned cricket, athletics, football, and badminton teams contending at provincial and all-island levels.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600" /> Moral Foundation
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Nurturing integrity, tolerance, inter-faith harmony, and social responsibility.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" /> Global OBA Alumni
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    An esteemed worldwide brotherhood supporting infrastructure, scholarships, and mentorship.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/admissions"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Join Wesley High School <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-4"
                >
                  View Administrative Leadership & Staff Directory &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ACADEMIC SECTIONS & CURRICULUM */}
      <section id="academics" className="py-20 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Curriculum & Streams
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#071526] font-crest">
              Excellence at Every Academic Stage
            </h2>
            <p className="text-sm text-slate-600">
              Structured national syllabi supplemented with modern IT laboratories, English medium instruction, and career preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4 font-bold text-lg">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-crest">Primary Section</h3>
                <p className="text-xs font-semibold text-amber-600 mt-0.5">Grades 1 – 5</p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Building foundational literacy, numeracy, and environmental awareness with student-centered activity learning and Grade 5 Scholarship coaching.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Scholarship Focus</span>
                <span className="font-semibold text-slate-900">Tamil & English</span>
              </div>
            </div>

            {/* Junior Secondary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 mb-4 font-bold text-lg">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-crest">Junior Secondary</h3>
                <p className="text-xs font-semibold text-sky-600 mt-0.5">Grades 6 – 9</p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Comprehensive grounding across general sciences, mathematics, languages, practical technical skills, and active participation in junior clubs and scout troops.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Foundational Skills</span>
                <span className="font-semibold text-slate-900">Core Curriculum</span>
              </div>
            </div>

            {/* Senior Secondary (O/L) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-4 font-bold text-lg">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-crest">G.C.E. Ordinary Level</h3>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">Grades 10 – 11</p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Intensive national exam preparation with specialized seminar series, model papers, laboratory practicals, and career aptitude guidance.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>High Distinction Rate</span>
                <span className="font-semibold text-slate-900">9 Subjects</span>
              </div>
            </div>

            {/* Collegiate A/L */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4 font-bold text-lg">
                  04
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-crest">G.C.E. Advanced Level</h3>
                <p className="text-xs font-semibold text-emerald-600 mt-0.5">Grades 12 – 13</p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Premier streams in Physical Science (Maths), Biological Science, Commerce, Arts, and Engineering/Bio Technology producing district rank holders.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>University Entrance</span>
                <span className="font-semibold text-slate-900">5 Streams</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. THE FOUR HOUSES (SRI LANKAN COLLEGIATE TRADITION) */}
      <section id="houses" className="py-20 bg-[#071526] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-sky-800 to-black"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Collegiate Brotherhood & Spirit
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-crest">
              The Four Houses of Wesley
            </h2>
            <p className="text-sm text-slate-300">
              Instilling teamwork, sportsmanship, and camaraderie through the historic Inter-House Athletic Championships.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Wesley House */}
            <div className="bg-slate-900/80 border-t-4 border-t-blue-500 border-slate-800 rounded-2xl p-6 text-center hover:scale-[1.02] transition-transform shadow-lg">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center font-bold text-xl mb-3 border border-blue-500/40">
                W
              </div>
              <h3 className="text-xl font-bold font-crest text-white">Wesley House</h3>
              <p className="text-xs font-semibold text-blue-400 mt-1 uppercase tracking-wider">House Color: Royal Blue</p>
              <p className="text-xs text-slate-400 mt-3 italic">
                &ldquo;Faith and Fortitude&rdquo;
              </p>
            </div>

            {/* Arthur House */}
            <div className="bg-slate-900/80 border-t-4 border-t-amber-500 border-slate-800 rounded-2xl p-6 text-center hover:scale-[1.02] transition-transform shadow-lg">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold text-xl mb-3 border border-amber-500/40">
                A
              </div>
              <h3 className="text-xl font-bold font-crest text-white">Arthur House</h3>
              <p className="text-xs font-semibold text-amber-400 mt-1 uppercase tracking-wider">House Color: Gold & Yellow</p>
              <p className="text-xs text-slate-400 mt-3 italic">
                &ldquo;Courage in Endeavour&rdquo;
              </p>
            </div>

            {/* Mack House */}
            <div className="bg-slate-900/80 border-t-4 border-t-red-500 border-slate-800 rounded-2xl p-6 text-center hover:scale-[1.02] transition-transform shadow-lg">
              <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center font-bold text-xl mb-3 border border-red-500/40">
                M
              </div>
              <h3 className="text-xl font-bold font-crest text-white">Mack House</h3>
              <p className="text-xs font-semibold text-red-400 mt-1 uppercase tracking-wider">House Color: Crimson Red</p>
              <p className="text-xs text-slate-400 mt-3 italic">
                &ldquo;Valor in Action&rdquo;
              </p>
            </div>

            {/* Allen House */}
            <div className="bg-slate-900/80 border-t-4 border-t-emerald-500 border-slate-800 rounded-2xl p-6 text-center hover:scale-[1.02] transition-transform shadow-lg">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold text-xl mb-3 border border-emerald-500/40">
                L
              </div>
              <h3 className="text-xl font-bold font-crest text-white">Allen House</h3>
              <p className="text-xs font-semibold text-emerald-400 mt-1 uppercase tracking-wider">House Color: Forest Green</p>
              <p className="text-xs text-slate-400 mt-3 italic">
                &ldquo;Perseverance Conquers&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LATEST NOTICES, CIRCULARS & EVENTS GRID */}
      <section id="notices" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-600" /> College Notice Board
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#071526] font-crest">
                Official Notices & Circulars
              </h2>
              <p className="text-sm text-slate-600">
                Stay updated with ministry announcements, term schedules, examinations, and events.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circulars..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["All", "Academic", "Circulars", "Events", "Sports", "Examinations", "Admissions"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-[#071526] text-amber-300 shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Layout: Main Notices on Left, Upcoming Events Calendar on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Notices Column */}
            <div className="lg:col-span-8 space-y-4">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-amber-400 group relative overflow-hidden"
                  >
                    {notice.isUrgent && (
                      <div className="absolute top-0 right-0">
                        <span className="inline-block px-3 py-0.5 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-bl-lg">
                          Important
                        </span>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className="shrink-0 w-14 h-14 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center p-1 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-colors">
                        <span className="text-[10px] font-bold uppercase text-slate-500 group-hover:text-amber-700">
                          {new Date(notice.date).toLocaleString("default", { month: "short" })}
                        </span>
                        <span className="text-xl font-extrabold text-slate-900 group-hover:text-amber-600">
                          {new Date(notice.date).getDate()}
                        </span>
                      </div>

                      {/* Notice Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {notice.category || notice.type}
                          </span>
                          <span className="text-xs text-slate-400">
                            Published on {new Date(notice.date).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {notice.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                          {notice.description}
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                          <button
                            onClick={() => alert(`Opening official circular: ${notice.title}`)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Full Announcement
                          </button>
                          <button
                            onClick={() => alert(`Downloading PDF copy of: ${notice.title}`)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
                          >
                            <Download className="w-3.5 h-3.5" /> Download PDF (Official)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                  <p className="text-base font-semibold">No notices matching your criteria.</p>
                  <p className="text-xs mt-1">Try searching with different keywords or switch filters.</p>
                </div>
              )}
            </div>

            {/* Upcoming Events Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#071526] text-white rounded-2xl p-6 border border-amber-500/20 shadow-lg">
                <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-800">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold font-crest">Upcoming Events</h3>
                </div>

                <div className="space-y-4">
                  {upcomingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1">
                        <span>{new Date(evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-[10px]">
                          {evt.category || "Event"}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-100">{evt.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{evt.description}</p>
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-amber-400/80 font-medium">Public Event</span>
                        <Link
                          href={`/events?event=${encodeURIComponent(evt.title)}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <Ticket className="w-3 h-3" />
                          <span>RSVP / Register</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                  <Link
                    href="/events"
                    className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-1.5"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>{t("registerForEvent")}</span>
                  </Link>
                  <Link
                    href="/timetable"
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors text-center flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>View Class Timetables</span>
                  </Link>
                </div>
              </div>

              {/* Quick Contact & Inquiries Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-slate-900 text-sm font-crest">Inquiries & Assistance</h4>
                <p className="text-xs text-slate-600">
                  Have questions regarding school circulars or student admission dates?
                </p>
                <div className="text-xs space-y-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-600" />
                    <span>General Office: +94 67 222 2345</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span>principal@wesleyhighkalmunai.lk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ADMISSION CALL-OUT BANNER */}
      <section className="bg-gradient-to-r from-[#071526] via-[#0c2444] to-[#071526] text-white py-16 border-y border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Admissions Open 2025 / 2026
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-crest">
              Become a Part of the Wesley Legacy
            </h2>
            <p className="text-sm text-slate-300">
              Grade 1 Primary entry, Grade 6 National School transfer admissions, and Grade 12 Advanced Level collegiate streams.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/admissions"
              className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-sm uppercase tracking-wider"
            >
              Online Application
            </Link>
            <Link
              href="/results"
              className="px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-600 transition-all text-sm"
            >
              Exams & Results
            </Link>
          </div>
        </div>
      </section>

      {/* 9. PRESTIGIOUS FOOTER */}
      <footer id="contact" className="bg-[#05111f] text-slate-400 text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* School Profile Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 p-1 flex items-center justify-center text-amber-400">
                  <School className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-crest text-white">Wesley High School</h3>
                  <p className="text-xs text-amber-400 italic">&ldquo;Utmost for the Highest&rdquo;</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                A premier national school in Kalmunai, Sri Lanka, fostering academic mastery, physical fortitude, and spiritual values for over a century since 1885.
              </p>
              <div className="text-xs text-slate-400 space-y-2 pt-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Beach Road, Kalmunai 32300, Ampara District, Eastern Province, Sri Lanka</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>General Office: +94 (67) 222 2345 | Fax: +94 (67) 222 2346</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>info@wesleyhighkalmunai.lk</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider font-crest">
                Academics
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="#academics" className="hover:text-amber-300 transition-colors">Primary Section</Link></li>
                <li><Link href="#academics" className="hover:text-amber-300 transition-colors">Junior Secondary</Link></li>
                <li><Link href="#academics" className="hover:text-amber-300 transition-colors">G.C.E. O/L Section</Link></li>
                <li><Link href="#academics" className="hover:text-amber-300 transition-colors">G.C.E. A/L Science & Maths</Link></li>
                <li><Link href="#academics" className="hover:text-amber-300 transition-colors">A/L Commerce & Technology</Link></li>
                <li><Link href="/results" className="hover:text-amber-300 transition-colors">Examination Results</Link></li>
              </ul>
            </div>

            {/* School Life & Houses */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider font-crest">
                Collegiate Life
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="#houses" className="hover:text-amber-300 transition-colors">Wesley House (Blue)</Link></li>
                <li><Link href="#houses" className="hover:text-amber-300 transition-colors">Arthur House (Gold)</Link></li>
                <li><Link href="#houses" className="hover:text-amber-300 transition-colors">Mack House (Red)</Link></li>
                <li><Link href="#houses" className="hover:text-amber-300 transition-colors">Allen House (Green)</Link></li>
                <li><Link href="#about" className="hover:text-amber-300 transition-colors">Sports & Athletics</Link></li>
                <li><Link href="#about" className="hover:text-amber-300 transition-colors">Old Boys Association (OBA)</Link></li>
              </ul>
            </div>

            {/* Portal & System Shortcuts */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider font-crest">
                Portal Shortcuts
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/dashboard" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Teacher & Admin Login
                  </Link>
                </li>
                <li><Link href="/results" className="hover:text-amber-300 transition-colors">Student Marksheets</Link></li>
                <li><Link href="/attendance" className="hover:text-amber-300 transition-colors">Attendance Portal</Link></li>
                <li><Link href="/students" className="hover:text-amber-300 transition-colors">Student Information</Link></li>
                <li><Link href="/admissions" className="hover:text-amber-300 transition-colors">New Admissions Desk</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>
              &copy; {new Date().getFullYear()} Wesley High School, Kalmunai. All rights reserved. Ministry of Education, Sri Lanka.
            </p>
            <p className="flex items-center gap-3">
              <span>National School ID: 10423</span>
              <span>•</span>
              <span>School Census: Wesley Kalmunai</span>
            </p>
          </div>
        </div>
      </footer>

      {/* 10. PORTAL LOGIN MODAL */}
      {portalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#071526] border border-amber-500/30 text-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl space-y-5">
            <button
              onClick={() => setPortalModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-2 border border-amber-400/30">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-crest">Wesley High School Portal</h3>
              <p className="text-xs text-slate-300">
                Select your designated portal to proceed with authentication.
              </p>
            </div>

            <div className="space-y-3">
              {/* Student Portal */}
              <Link
                href="/results"
                onClick={() => setPortalModalOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300">Student & Parents</h4>
                    <p className="text-[11px] text-slate-400">View exam results, reports & circulars</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Staff & Teacher Portal */}
              <Link
                href="/dashboard"
                onClick={() => setPortalModalOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300">Staff & Teachers</h4>
                    <p className="text-[11px] text-slate-400">Manage marks, attendance & classrooms</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Administrator Portal */}
              <Link
                href="/admin/marks"
                onClick={() => setPortalModalOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300">Principal & Administration</h4>
                    <p className="text-[11px] text-slate-400">Institution registry, admissions & audit</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-400">
                Need credential assistance? Contact the ICT Department at{" "}
                <span className="text-amber-400">ict@wesleyhighkalmunai.lk</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
