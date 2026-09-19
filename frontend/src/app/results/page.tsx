"use client";

import React, { useState } from 'react';
import { Search, Loader2, Award, FileText, ChevronRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface ExamMark {
  id?: string;
  studentId: string;
  term: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
}

export default function ResultsPortalPage() {
  const [searchStudentId, setSearchStudentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("Term 1");
  const [isSearching, setIsSearching] = useState(false);
  const [studentResults, setStudentResults] = useState<ExamMark[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchStudentId) return;

    try {
      setIsSearching(true);
      const res = await fetch(`http://localhost:8080/api/v1/marks/${searchStudentId}`);
      if (res.ok) {
        const data: ExamMark[] = await res.json();
        const termData = data.filter(mark => mark.term === searchTerm);
        setStudentResults(termData);
      } else {
        setStudentResults([]);
      }
    } catch (error) {
      console.error("Failed to fetch results:", error);
      setStudentResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const calculateTotal = (results: ExamMark[]) => {
    return results.reduce((acc, curr) => acc + curr.marksObtained, 0);
  };

  const calculateMaxTotal = (results: ExamMark[]) => {
    return results.reduce((acc, curr) => acc + curr.maxMarks, 0);
  };

  const getPercentage = (results: ExamMark[]) => {
    if (results.length === 0) return 0;
    const total = calculateTotal(results);
    const max = calculateMaxTotal(results);
    return ((total / max) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-900 text-white py-12 px-6 shadow-md">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-block bg-indigo-800 p-3 rounded-full mb-2">
            <Award className="h-8 w-8 text-indigo-300" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Student Results Portal</h1>
          <p className="text-indigo-200 text-lg">View your academic performance by entering your Student ID.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-10 -mt-8 relative z-10">
        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4">
            <div className="w-full space-y-2">
              <label className="text-sm font-semibold text-gray-900">Student ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input required value={searchStudentId} onChange={(e) => setSearchStudentId(e.target.value)} type="text" className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. STU-2023-001" />
              </div>
            </div>
            <div className="w-full md:w-64 space-y-2">
              <label className="text-sm font-semibold text-gray-900">Term</label>
              <select value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                <option>Term 1</option>
                <option>Term 2</option>
                <option>Term 3</option>
                <option>Final Exam</option>
              </select>
            </div>
            <button type="submit" disabled={isSearching} className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-70 h-[52px]">
              {isSearching ? <Loader2 className="h-5 w-5 animate-spin"/> : "Search Results"}
            </button>
          </form>
        </div>

        {/* Results View */}
        <div className="mt-8">
          {studentResults === null ? (
            <div className="text-center py-20 text-gray-400 space-y-4">
              <FileText className="h-16 w-16 mx-auto text-gray-300" />
              <p className="text-lg">Enter your Student ID to view your marks.</p>
            </div>
          ) : studentResults.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="bg-red-50 text-red-600 p-4 rounded-full inline-block mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No Results Found</h3>
              <p className="text-gray-500 mt-2">We couldn't find any marks for <span className="font-semibold">{searchStudentId}</span> in <span className="font-semibold">{searchTerm}</span>.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Report Card Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-white p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider">{searchTerm} Report Card</p>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">Student: {searchStudentId}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Overall Average</p>
                  <p className="text-3xl font-extrabold text-indigo-600">{getPercentage(studentResults)}%</p>
                </div>
              </div>
              
              {/* Report Card Table */}
              <div className="p-0 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 md:px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 md:px-8 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Marks</th>
                      <th className="px-6 md:px-8 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                      <th className="px-6 md:px-8 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {studentResults.map((mark) => {
                      const percentage = (mark.marksObtained / mark.maxMarks) * 100;
                      let grade = "F";
                      if (percentage >= 75) grade = "A";
                      else if (percentage >= 65) grade = "B";
                      else if (percentage >= 50) grade = "C";
                      else if (percentage >= 35) grade = "S";

                      return (
                        <tr key={mark.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 md:px-8 py-5 text-sm font-semibold text-gray-900">{mark.subjectName}</td>
                          <td className="px-6 md:px-8 py-5 text-right text-sm text-gray-500">{mark.maxMarks}</td>
                          <td className="px-6 md:px-8 py-5 text-right text-sm font-bold text-gray-900">{mark.marksObtained}</td>
                          <td className="px-6 md:px-8 py-5 text-right">
                            <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${
                              grade === 'A' ? 'bg-green-100 text-green-700' :
                              grade === 'B' ? 'bg-blue-100 text-blue-700' :
                              grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                              grade === 'S' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                    <tr>
                      <td className="px-6 md:px-8 py-5 text-sm font-bold text-gray-900 uppercase">Total</td>
                      <td className="px-6 md:px-8 py-5 text-right text-sm font-bold text-gray-900">{calculateMaxTotal(studentResults)}</td>
                      <td className="px-6 md:px-8 py-5 text-right text-lg font-extrabold text-indigo-600">{calculateTotal(studentResults)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            Return to Homepage <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
