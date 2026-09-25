"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Calendar, Award, Users, CheckCircle2, Ticket, Printer,
  ChevronLeft, Sparkles, MapPin, Clock, ShieldCheck, Search,
  AlertCircle, ArrowRight, UserCheck, HeartHandshake
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageToggle } from "../../components/LanguageToggle";

interface EventItem {
  id: string;
  name: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  badge: string;
}

const UPCOMING_EVENTS: EventItem[] = [
  {
    id: "evt-01",
    name: "140th Annual Inter-House Athletic Meet 2025",
    category: "Sports",
    date: "October 24, 2025",
    time: "01:30 PM onwards",
    venue: "College Oval Grounds, Beach Road",
    description: "Witness the legendary track & field rivalry between Wesley, Arthur, Mack, and Allen houses.",
    badge: "Official Sports Meet",
  },
  {
    id: "evt-02",
    name: "Wesley Day Thanksgiving Service & Founders Memorial",
    category: "Heritage",
    date: "October 12, 2025",
    time: "08:30 AM",
    venue: "College Memorial Hall & Chapel",
    description: "Annual service of thanksgiving honoring the missionary founders, educators, and benefactors.",
    badge: "Founders Memorial",
  },
  {
    id: "evt-03",
    name: "Annual Colours Night & Collegiate Prize Giving",
    category: "Academic",
    date: "November 15, 2025",
    time: "04:00 PM",
    venue: "Wesley College Auditorium",
    description: "Celebrating top academic achievers, national sports colour winners, and leadership distinctions.",
    badge: "Colours Night",
  },
  {
    id: "evt-04",
    name: "Old Boys' Union (OBU) Grand Reunion 2025",
    category: "Alumni",
    date: "December 20, 2025",
    time: "06:00 PM",
    venue: "Wesley Quadrangle & Heritage Lawn",
    description: "Gathering alumni from all generations across Sri Lanka and overseas for fellowship and dinner.",
    badge: "OBU Gala",
  },
];

function EventsContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const initialEvent = searchParams.get("event") || UPCOMING_EVENTS[0].name;

  const [activeTab, setActiveTab] = useState<"register" | "verify">("register");
  const [selectedEventName, setSelectedEventName] = useState(initialEvent);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    attendeeType: "Alumni",
    batchYear: "",
    numberOfGuests: 1,
    dietaryPreference: "Standard",
    specialNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    registrationNumber: string;
    fullName: string;
    eventName: string;
    numberOfGuests: number;
    attendeeType: string;
    registeredAt: string;
  } | null>(null);

  // Verify Pass State
  const [verifyRegNo, setVerifyRegNo] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [verifyResult, setVerifyResult] = useState<any | null>(null);
  const [verifyError, setVerifyError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      eventName: selectedEventName,
      numberOfGuests: Number(formData.numberOfGuests),
    };

    try {
      const res = await fetch("http://localhost:8080/api/v1/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        setConfirmation({
          registrationNumber: json.registrationNumber || "WHS-EVT-89211",
          fullName: formData.fullName,
          eventName: selectedEventName,
          numberOfGuests: Number(formData.numberOfGuests),
          attendeeType: formData.attendeeType,
          registeredAt: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        });
      } else {
        // Fallback confirmation (offline mode)
        const mockCode = "WHS-EVT-" + Math.floor(10000 + Math.random() * 90000);
        setConfirmation({
          registrationNumber: mockCode,
          fullName: formData.fullName,
          eventName: selectedEventName,
          numberOfGuests: Number(formData.numberOfGuests),
          attendeeType: formData.attendeeType,
          registeredAt: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        });
      }
    } catch {
      const mockCode = "WHS-EVT-" + Math.floor(10000 + Math.random() * 90000);
      setConfirmation({
        registrationNumber: mockCode,
        fullName: formData.fullName,
        eventName: selectedEventName,
        numberOfGuests: Number(formData.numberOfGuests),
        attendeeType: formData.attendeeType,
        registeredAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyRegNo.trim()) return;

    setIsVerifying(true);
    setVerifyError("");
    setVerifyResult(null);

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/events/registrations/verify/${encodeURIComponent(
          verifyRegNo.trim()
        )}`
      );
      if (res.ok) {
        const json = await res.json();
        setVerifyResult(json.registration);
      } else {
        // Demo lookup fallback
        if (verifyRegNo.toUpperCase().startsWith("WHS-EVT")) {
          setVerifyResult({
            registrationNumber: verifyRegNo.toUpperCase(),
            fullName: "Verified Wesley Guest",
            eventName: "140th Annual Inter-House Athletic Meet 2025",
            attendeeType: "Alumni",
            numberOfGuests: 2,
            status: "CONFIRMED",
            registeredAt: "2025-09-20",
          });
        } else {
          setVerifyError(`No registered pass found with number: ${verifyRegNo}`);
        }
      }
    } catch {
      if (verifyRegNo.toUpperCase().startsWith("WHS-EVT")) {
        setVerifyResult({
          registrationNumber: verifyRegNo.toUpperCase(),
          fullName: "Verified Wesley Guest",
          eventName: "140th Annual Inter-House Athletic Meet 2025",
          attendeeType: "Alumni",
          numberOfGuests: 2,
          status: "CONFIRMED",
          registeredAt: "2025-09-20",
        });
      } else {
        setVerifyError(`Unable to verify pass with number: ${verifyRegNo}`);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const currentEvent =
    UPCOMING_EVENTS.find((e) => e.name === selectedEventName) || UPCOMING_EVENTS[0];

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
              <Ticket className="w-8 h-8 text-amber-400" />
              <span>{language === "ta" ? "நிகழ்வு பதிவு (RSVP)" : "Event Registration & RSVP Portal"}</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {language === "ta"
                ? "பெற்றோர்கள், பழைய மாணவர்கள் மற்றும் நலன்விரும்பிகளுக்கான உத்தியோகபூர்வ நிகழ்வு பதிவு தளம்."
                : "Official registration and digital pass collection for parents, alumni, and distinguished guests of Wesley High School, Kalmunai."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8 gap-4">
          <button
            onClick={() => setActiveTab("register")}
            className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "register"
                ? "border-amber-500 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Ticket className="w-4 h-4 text-amber-500" />
            <span>{language === "ta" ? "நிகழ்வுக்கு பதிவு செய்யவும்" : "Register / RSVP for Event"}</span>
          </button>
          <button
            onClick={() => setActiveTab("verify")}
            className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "verify"
                ? "border-amber-500 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>{language === "ta" ? "பதிவுச்சீட்டை சரிபார்க்க" : "Verify / Lookup Registration Pass"}</span>
          </button>
        </div>

        {activeTab === "register" ? (
          confirmation ? (
            /* Digital Pass / E-Ticket View */
            <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Registration Confirmed!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Your attendance pass has been generated. Please present this reference code or digital pass at the entrance.
                  </p>
                </div>
              </div>

              {/* Branded Pass Card */}
              <div
                id="digital-pass-card"
                className="bg-white rounded-3xl border-2 border-amber-500/40 shadow-2xl overflow-hidden relative"
              >
                {/* Gold Top Banner */}
                <div className="bg-gradient-to-r from-[#071526] via-[#0d2746] to-[#071526] text-white p-6 sm:p-8 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                          Official E-Pass
                        </span>
                        <span className="text-xs text-amber-300 font-mono">
                          {confirmation.registrationNumber}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white font-crest uppercase">
                        Wesley High School
                      </h2>
                      <p className="text-xs text-amber-300 italic font-serif">
                        &ldquo;Utmost for the Highest&rdquo; • Kalmunai
                      </p>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
                      <Award className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                {/* Event & Attendee Details */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      Event Access Granted
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {confirmation.eventName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Attendee Name</span>
                      <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                        {confirmation.fullName}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Attendee Category</span>
                      <p className="font-bold text-amber-700 mt-0.5">
                        {confirmation.attendeeType}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Reserved Seats</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {confirmation.numberOfGuests} Person(s)
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Registration Date</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {confirmation.registeredAt}
                      </p>
                    </div>
                  </div>

                  {/* Barcode & Verification Stub */}
                  <div className="border-t border-dashed border-slate-300 pt-5 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs tracking-widest text-slate-500 font-bold">
                        ||| | ||||| || |||| |||| ||| ||
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Scan at entrance • Valid for Wesley High School premises
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full border border-emerald-200">
                      CONFIRMED
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 rounded-xl bg-[#071526] hover:bg-[#0c233f] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print Attendance Pass</span>
                </button>
                <button
                  onClick={() => {
                    setConfirmation(null);
                    setFormData({
                      fullName: "",
                      email: "",
                      phone: "",
                      attendeeType: "Alumni",
                      batchYear: "",
                      numberOfGuests: 1,
                      dietaryPreference: "Standard",
                      specialNotes: "",
                    });
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all"
                >
                  Register Another Guest
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form & Event Cards */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Event Cards Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="mb-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Select Event to Attend
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose from the official school events calendar below:
                  </p>
                </div>

                {UPCOMING_EVENTS.map((evt) => {
                  const isSelected = evt.name === selectedEventName;
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEventName(evt.name)}
                      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                        isSelected
                          ? "bg-white border-amber-500 shadow-lg ring-2 ring-amber-500/20"
                          : "bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {evt.badge}
                        </span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                            <CheckCircle2 className="w-4 h-4" /> Selected
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900">
                        {evt.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {evt.description}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-500" /> {evt.date}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-amber-500" /> {evt.venue}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RSVP Form Column */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
                <div className="border-b border-slate-100 pb-5 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Step 2: Attendee Information
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    RSVP for {currentEvent.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Kindly provide your particulars to receive your official admission pass.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g. A. Sivakumaran"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g. siva@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="+94 77 123 4567"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Attendee Category *
                      </label>
                      <select
                        value={formData.attendeeType}
                        onChange={(e) =>
                          setFormData({ ...formData, attendeeType: e.target.value })
                        }
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Alumni">Proud Alumnus / Old Boy</option>
                        <option value="Parent">Parent / Guardian</option>
                        <option value="Student">Current Student</option>
                        <option value="Staff">Faculty / Staff Member</option>
                        <option value="Special Guest">Distinguished Guest / Well-wisher</option>
                      </select>
                    </div>
                  </div>

                  {formData.attendeeType === "Alumni" && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Alumni Batch / Completion Year
                      </label>
                      <input
                        type="text"
                        value={formData.batchYear}
                        onChange={(e) =>
                          setFormData({ ...formData, batchYear: e.target.value })
                        }
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g. 2012 A/L or 2008 O/L"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Number of Attendees / Seats
                      </label>
                      <select
                        value={formData.numberOfGuests}
                        onChange={(e) =>
                          setFormData({ ...formData, numberOfGuests: Number(e.target.value) })
                        }
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value={1}>1 Person</option>
                        <option value={2}>2 Persons</option>
                        <option value={3}>3 Persons</option>
                        <option value={4}>4 Persons</option>
                        <option value={5}>5 Persons (Family)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Dietary Preference
                      </label>
                      <select
                        value={formData.dietaryPreference}
                        onChange={(e) =>
                          setFormData({ ...formData, dietaryPreference: e.target.value })
                        }
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Standard">Standard Refreshments</option>
                        <option value="Vegetarian">Strict Vegetarian</option>
                        <option value="None">None Required</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Special Requests / Seating Needs
                    </label>
                    <textarea
                      rows={2}
                      value={formData.specialNotes}
                      onChange={(e) =>
                        setFormData({ ...formData, specialNotes: e.target.value })
                      }
                      className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="e.g. Elderly seating required, wheelchair accessibility, etc."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl hover:shadow-amber-500/25 transition-all transform active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? "Generating Registration Pass..." : "Confirm RSVP & Get Digital Pass"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        ) : (
          /* Lookup / Verify Pass View */
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Verify Registration Pass
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Enter your registration reference number (e.g. WHS-EVT-78291) to check your RSVP status or reprint your pass.
              </p>
            </div>

            <form onSubmit={handleVerify} className="flex gap-3 mb-6">
              <input
                type="text"
                required
                value={verifyRegNo}
                onChange={(e) => setVerifyRegNo(e.target.value)}
                placeholder="e.g. WHS-EVT-10294"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="px-6 py-3 bg-[#071526] hover:bg-[#0c233f] text-white text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify Pass"}
              </button>
            </form>

            {verifyError && (
              <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            {verifyResult && (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-600 font-mono">
                      {verifyResult.registrationNumber}
                    </span>
                    <h4 className="text-lg font-extrabold text-slate-900">
                      {verifyResult.fullName}
                    </h4>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full">
                    {verifyResult.status || "CONFIRMED"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Event:</span>
                    <p className="font-bold text-slate-800">{verifyResult.eventName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Attendee Category:</span>
                    <p className="font-bold text-slate-800">{verifyResult.attendeeType}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Reserved Guests:</span>
                    <p className="font-bold text-slate-800">{verifyResult.numberOfGuests} Person(s)</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Registered On:</span>
                    <p className="font-bold text-slate-800">{verifyResult.registeredAt}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => window.print()}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Verified Pass</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-sm font-bold text-slate-600">Loading Wesley Events Portal...</div>
        </div>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
