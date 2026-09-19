"use client";

import React, { useState } from 'react';
import { School, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdmissionsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    dateOfBirth: "",
    gradeApplyingFor: "",
    parentContact: "",
    address: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:8080/api/v1/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsSuccess(true);
      } else {
        alert("Failed to submit admission form. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-10 text-center space-y-6">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Application Received!</h2>
            <p className="text-gray-500 mt-3 leading-relaxed">
              Thank you for applying to Wesley High School. Your admission application for <span className="font-semibold text-gray-900">{formData.studentName}</span> has been successfully submitted. Our team will contact you shortly at {formData.parentContact}.
            </p>
          </div>
          <Link href="/" className="inline-block mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="bg-indigo-600 p-3 rounded-2xl inline-block shadow-md">
            <School className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Online Admission</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Join the Wesley High School family. Fill out the application form below and take the first step towards excellence.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-900">Student Full Name *</label>
                <input required name="studentName" value={formData.studentName} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. John Doe" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Date of Birth *</label>
                <input required name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Grade Applying For *</label>
                <select required name="gradeApplyingFor" value={formData.gradeApplyingFor} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                  <option value="">Select a grade...</option>
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                  <option>Grade 11</option>
                  <option>Grade 12</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-900">Parent / Guardian Contact *</label>
                <input required name="parentContact" value={formData.parentContact} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. +1 234 567 8900 or parent@email.com" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-900">Residential Address *</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" placeholder="Enter complete residential address..." />
              </div>

            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">
                Cancel Application
              </Link>
              <button type="submit" disabled={isSubmitting} className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-70">
                {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin"/> Submitting...</> : "Submit Application"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
