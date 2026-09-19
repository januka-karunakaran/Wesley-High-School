"use client";

import React, { useState } from 'react';
import { Loader2, GraduationCap, Search, FileEdit, ClipboardList } from 'lucide-react';
import Link from 'next/link';

interface ExamMark {
  id?: string;
  studentId: string;
  term: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
}

export default function MarksPage() {
  const [activeTab, setActiveTab] = useState<'enter' | 'view'>('enter');
  
  // Enter Marks State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    term: "Term 1",
    subjectName: "",
    marksObtained: "",
    maxMarks: "100"
  });

  // View Results State
  const [searchStudentId, setSearchStudentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ExamMark[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Form Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitMark = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        marksObtained: parseFloat(formData.marksObtained),
        maxMarks: parseFloat(formData.maxMarks)
      };

      const res = await fetch("http://localhost:8080/api/v1/marks/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("Mark entered successfully!");
        setFormData(prev => ({ ...prev, subjectName: "", marksObtained: "" })); // reset partial fields
      } else {
        alert("Failed to save mark.");
      }
    } catch (error) {
      console.error("Error submitting mark:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchStudentId) return;

    try {
      setIsSearching(true);
      setHasSearched(true);
      let url = `http://localhost:8080/api/v1/marks/student/${searchStudentId}`;
      if (searchTerm) {
        url += `?term=${searchTerm}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const calculateTotal = (marks: ExamMark[]) => {
    const obtained = marks.reduce((sum, m) => sum + m.marksObtained, 0);
    const max = marks.reduce((sum, m) => sum + m.maxMarks, 0);
    const percentage = max > 0 ? ((obtained / max) * 100).toFixed(2) : 0;
    return { obtained, max, percentage };
  };

  const totals = results.length > 0 ? calculateTotal(results) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <GraduationCap className="text-indigo-600 h-8 w-8" />
              Marks & Results Portal
            </h1>
            <p className="text-gray-500 mt-1">Enter student grades or search for exam results.</p>
          </div>
          <div className="flex gap-3">
             <Link href="/" className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 w-full max-w-md">
          <button 
            onClick={() => setActiveTab('enter')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'enter' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileEdit className="h-4 w-4" /> Enter Marks
          </button>
          <button 
            onClick={() => setActiveTab('view')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'view' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ClipboardList className="h-4 w-4" /> View Results
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {activeTab === 'enter' && (
            <form onSubmit={handleSubmitMark} className="p-6 md:p-8 space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">Enter Exam Marks</h2>
                <p className="text-sm text-gray-500 mt-1">Input individual subject marks for a student.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Student ID *</label>
                  <input required name="studentId" value={formData.studentId} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. STU-2023-001" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Term *</label>
                  <select name="term" value={formData.term} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                    <option>Term 1</option>
                    <option>Term 2</option>
                    <option>Term 3</option>
                    <option>Final Exam</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Subject Name *</label>
                  <input required name="subjectName" value={formData.subjectName} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. Mathematics" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Marks Obtained *</label>
                    <input required name="marksObtained" value={formData.marksObtained} onChange={handleInputChange} type="number" min="0" step="0.5" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. 85" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Max Marks *</label>
                    <input required name="maxMarks" value={formData.maxMarks} onChange={handleInputChange} type="number" min="1" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="100" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md active:scale-95 disabled:opacity-70">
                  {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin"/> Saving...</> : "Save Exam Mark"}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'view' && (
            <div className="p-6 md:p-8 space-y-8">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">View Student Results</h2>
                <p className="text-sm text-gray-500 mt-1">Search for a student's performance by ID and Term.</p>
              </div>

              <form onSubmit={handleSearchResults} className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <input required type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter Student ID..." value={searchStudentId} onChange={(e) => setSearchStudentId(e.target.value)} />
                </div>
                <div className="flex-1">
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}>
                    <option value="">All Terms</option>
                    <option>Term 1</option>
                    <option>Term 2</option>
                    <option>Term 3</option>
                    <option>Final Exam</option>
                  </select>
                </div>
                <button type="submit" disabled={isSearching} className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-70">
                  {isSearching ? <Loader2 className="h-5 w-5 animate-spin"/> : <Search className="h-5 w-5" />}
                  Find Results
                </button>
              </form>

              {hasSearched && !isSearching && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {results.length > 0 ? (
                    <>
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full whitespace-nowrap">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Term</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Marks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {results.map((mark) => (
                              <tr key={mark.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-600">{mark.term}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{mark.subjectName}</td>
                                <td className="px-6 py-4 text-right font-semibold text-indigo-600">{mark.marksObtained}</td>
                                <td className="px-6 py-4 text-right text-sm text-gray-500">{mark.maxMarks}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {totals && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                           <div>
                              <p className="text-sm font-medium text-indigo-800">Total Performance</p>
                              <h3 className="text-2xl font-bold text-indigo-900 mt-1">{totals.obtained} / {totals.max}</h3>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-medium text-indigo-800">Percentage</p>
                              <h3 className="text-3xl font-bold text-indigo-600 mt-1">{totals.percentage}%</h3>
                           </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-100">
                      <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                      <p className="text-gray-500 mt-1">No marks are recorded for this student ID and term combination.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
