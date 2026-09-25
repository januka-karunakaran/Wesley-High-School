"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, Loader2, Save, Users, AlertCircle, ArrowLeft } from 'lucide-react';

interface ExamMark {
  id?: string;
  studentId: string;
  term: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
}

export default function AdminMarksPage() {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ExamMark>({
    studentId: "",
    term: "Term 1",
    subjectName: "",
    marksObtained: 0,
    maxMarks: 100
  });

  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name.includes("marks") || name.includes("max") ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setNotification(null);
      const res = await fetch("http://localhost:8080/api/v1/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setNotification({ type: 'success', message: 'Marks successfully saved!' });
        setFormData(prev => ({ ...prev, marksObtained: 0, subjectName: "" })); // reset some fields
      } else {
        setNotification({ type: 'error', message: 'Failed to save marks. Check inputs.' });
      }
    } catch (error) {
      console.error("Error saving marks:", error);
      setNotification({ type: 'error', message: 'Network error while saving.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <GraduationCap className="text-amber-600 h-8 w-8" />
              Marks Entry (Staff & Teacher Portal)
            </h1>
            <p className="text-gray-500 mt-1">Portal for faculty and teachers to record student examination marks and term assessments.</p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-gray-300 hover:border-amber-400 px-4 py-2.5 rounded-xl shadow-sm transition-all self-start sm:self-center"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Staff & Teacher Portal
          </Link>
        </div>

        {notification && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Enter Marks Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 p-6">
            <h2 className="text-xl font-bold text-gray-900">Enter Exam Marks</h2>
            <p className="text-sm text-gray-500 mt-1">Record subject marks for a specific student and term.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Student ID *</label>
                <input required name="studentId" value={formData.studentId} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g. STU-2023-001" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Academic Term *</label>
                <select required name="term" value={formData.term} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                  <option>Term 1</option>
                  <option>Term 2</option>
                  <option>Term 3</option>
                  <option>Final Exam</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-900">Subject Name *</label>
                <input required name="subjectName" value={formData.subjectName} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g. Mathematics" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Marks Obtained *</label>
                <input required name="marksObtained" value={formData.marksObtained} onChange={handleInputChange} type="number" min="0" max={formData.maxMarks} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="0" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Maximum Marks *</label>
                <input required name="maxMarks" value={formData.maxMarks} onChange={handleInputChange} type="number" min="1" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
              </div>

            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 active:scale-95 disabled:opacity-70">
                {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin"/> Saving...</> : <><Save className="h-5 w-5" /> Save Record</>}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
