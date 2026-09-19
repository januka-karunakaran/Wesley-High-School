"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, CalendarCheck, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Student {
  id?: string;
  studentId: string;
  fullName: string;
  gradeClass: string;
}

interface AttendanceRecord {
  studentId: string;
  date: string;
  status: string;
  gradeClass: string;
}

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Static fallback list if no students are available
  const availableClasses = ["Grade 9 - A", "Grade 9 - B", "Grade 10 - A", "Grade 10 - B", "Grade 11 - Science", "Grade 11 - Arts"];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => s.gradeClass === selectedClass);
  const uniqueStudentClasses = Array.from(new Set(students.map(s => s.gradeClass)));
  const classOptions = Array.from(new Set([...availableClasses, ...uniqueStudentClasses])).sort();

  // Initialize attendance state when class changes
  useEffect(() => {
    const initialState: Record<string, string> = {};
    filteredStudents.forEach(s => {
      initialState[s.studentId] = "Present"; // Default all to present
    });
    setAttendanceState(initialState);
  }, [selectedClass, students.length]);

  const handleStatusToggle = (studentId: string, status: string) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedDate) return;
    
    const records: AttendanceRecord[] = filteredStudents.map(student => ({
      studentId: student.studentId,
      date: selectedDate,
      status: attendanceState[student.studentId] || "Present",
      gradeClass: selectedClass
    }));

    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:8080/api/v1/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(records)
      });
      if (res.ok) {
        alert("Attendance marked successfully!");
      } else {
        alert("Failed to mark attendance");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CalendarCheck className="text-indigo-600 h-8 w-8" />
              Attendance Marking
            </h1>
            <p className="text-gray-500 mt-1">Select a class and date to mark student attendance.</p>
          </div>
          <div className="flex gap-3">
             <Link href="/" className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-gray-700">Grade / Class</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select a class...</option>
              {classOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Student List */}
        {selectedClass ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             {loading ? (
                <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
             ) : filteredStudents.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                   <p className="text-lg font-medium text-gray-900">No students found in this class.</p>
                   <p className="text-sm mt-1">Please add students to this class in the Student Management portal.</p>
                </div>
             ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredStudents.map(student => (
                          <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{student.fullName}</td>
                            <td className="px-6 py-4 text-gray-500">{student.studentId}</td>
                            <td className="px-6 py-4 flex justify-end gap-2">
                              <button 
                                onClick={() => handleStatusToggle(student.studentId, "Present")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${attendanceState[student.studentId] === 'Present' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} border`}
                              >
                                <CheckCircle2 className="h-4 w-4" /> Present
                              </button>
                              <button 
                                onClick={() => handleStatusToggle(student.studentId, "Absent")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${attendanceState[student.studentId] === 'Absent' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} border`}
                              >
                                <XCircle className="h-4 w-4" /> Absent
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-6 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md active:scale-95 disabled:opacity-70"
                    >
                      {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin"/> Saving...</> : "Submit Attendance"}
                    </button>
                  </div>
                </>
             )}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <CalendarCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-gray-900">No Class Selected</h3>
             <p className="text-gray-500 mt-1">Please select a grade/class above to view students and mark attendance.</p>
          </div>
        )}

      </div>
    </div>
  );
}
