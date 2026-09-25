"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Loader2, BookOpen, UserCheck, Briefcase, Filter } from 'lucide-react';

interface Teacher {
  id?: string;
  teacherId: string;
  fullName: string;
  email: string;
  phone: string;
  subjectSpecialization: string;
  qualification: string;
  academicYear?: string;
  status?: string;
}

const FALLBACK_TEACHERS: Teacher[] = [
  {
    id: "tch-1",
    teacherId: "TCH-001",
    fullName: "Mr. K. Selvaratnam",
    email: "selvaratnam@wesleyhighkalmunai.lk",
    phone: "+94 77 234 5671",
    subjectSpecialization: "Mathematics",
    qualification: "B.Sc (Hons) Mathematics, PGDE",
    academicYear: "2025",
    status: "ACTIVE"
  },
  {
    id: "tch-2",
    teacherId: "TCH-002",
    fullName: "Mrs. R. Pathmanathan",
    email: "pathmanathan@wesleyhighkalmunai.lk",
    phone: "+94 71 876 5432",
    subjectSpecialization: "Science",
    qualification: "B.Sc Physical Science, M.Ed",
    academicYear: "2025",
    status: "ACTIVE"
  },
  {
    id: "tch-3",
    teacherId: "TCH-003",
    fullName: "Miss M. Fernando",
    email: "fernando@wesleyhighkalmunai.lk",
    phone: "+94 76 987 6543",
    subjectSpecialization: "English Language",
    qualification: "B.A. English (Hons), National Diploma in Teaching",
    academicYear: "2025",
    status: "ACTIVE"
  },
  {
    id: "tch-4",
    teacherId: "TCH-004",
    fullName: "Mr. S. Thavabalasingam",
    email: "thavabalasingam@wesleyhighkalmunai.lk",
    phone: "+94 77 345 6789",
    subjectSpecialization: "Tamil Language & Literature",
    qualification: "B.A. Tamil, PGDE",
    academicYear: "2025",
    status: "ACTIVE"
  },
  {
    id: "tch-5",
    teacherId: "TCH-005",
    fullName: "Mr. A. Razik",
    email: "razik@wesleyhighkalmunai.lk",
    phone: "+94 75 123 9876",
    subjectSpecialization: "Information & Communication Technology",
    qualification: "B.Sc (Hons) Computer Science",
    academicYear: "2025",
    status: "ACTIVE"
  }
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(FALLBACK_TEACHERS);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpec, setFilterSpec] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterStatus, setFilterStatus] = useState("ACTIVE");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    teacherId: "",
    fullName: "",
    email: "",
    phone: "",
    subjectSpecialization: "",
    qualification: "",
    academicYear: new Date().getFullYear().toString(),
    status: "ACTIVE"
  });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);
      const res = await fetch("http://localhost:8080/api/v1/teachers", {
        signal: controller.signal
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTeachers(data);
          return;
        }
      }
      setTeachers(FALLBACK_TEACHERS);
    } catch {
      // Offline fallback
      setTeachers(FALLBACK_TEACHERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:8080/api/v1/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          teacherId: "", fullName: "", email: "", phone: "",
          subjectSpecialization: "", qualification: "",
          academicYear: new Date().getFullYear().toString(), status: "ACTIVE"
        });
        fetchTeachers();
      } else {
        console.error("Failed to add teacher");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uniqueSpecs = Array.from(new Set(teachers.map(t => t.subjectSpecialization))).filter(Boolean);
  const uniqueYears = Array.from(new Set(teachers.map(t => t.academicYear))).filter(Boolean);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          teacher.subjectSpecialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = filterSpec ? teacher.subjectSpecialization === filterSpec : true;
    const matchesYear = filterYear ? teacher.academicYear === filterYear : true;
    const matchesStatus = filterStatus === "ALL" ? true : ((teacher.status || 'ACTIVE') === filterStatus);
    
    return matchesSearch && matchesSpec && matchesYear && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Briefcase className="text-indigo-600 h-8 w-8" />
              Teacher Management
            </h1>
            <p className="text-gray-500 mt-1">Manage teaching staff, subjects, and credentials.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add New Teacher
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Search by Name or Subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700">
              <Filter className="h-4 w-4 text-gray-400" />
              <select className="bg-transparent outline-none text-sm font-medium" value={filterSpec} onChange={(e) => setFilterSpec(e.target.value)}>
                <option value="">All Specializations</option>
                {uniqueSpecs.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 outline-none" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option value="">All Years</option>
              {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 outline-none" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="RETIRED">Retired</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID & Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject & Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        <p>Loading teachers...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="bg-gray-100 p-4 rounded-full">
                          <Briefcase className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-900">No teachers found</p>
                        <p className="text-sm">Try adjusting your filters or add a new teacher.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <UserCheck className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{teacher.fullName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 font-medium">{teacher.teacherId}</p>
                        <p className="text-xs text-gray-500">{teacher.email} • {teacher.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-900 font-medium">{teacher.subjectSpecialization}</p>
                            <p className="text-xs text-gray-500">Joined: {teacher.academicYear || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${(teacher.status || 'ACTIVE') === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {teacher.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 font-medium hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Register New Teacher</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Teacher ID *</label>
                  <input required name="teacherId" value={formData.teacherId} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. TCH-2023-001" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. Jane Smith" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email Address *</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="jane.smith@wesley.edu" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="+1 234 567 8900" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Subject Specialization *</label>
                  <input required name="subjectSpecialization" value={formData.subjectSpecialization} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. Advanced Mathematics" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Qualification *</label>
                  <input required name="qualification" value={formData.qualification} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. M.Sc. in Mathematics" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Joined Year</label>
                  <input name="academicYear" value={formData.academicYear} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. 2024" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="RETIRED">RETIRED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : "Save Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
