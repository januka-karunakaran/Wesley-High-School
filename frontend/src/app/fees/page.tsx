"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign, Search, Filter, Plus, Edit2, Trash2,
  CheckCircle2, AlertTriangle, XCircle, Clock,
  ArrowLeft, Loader2, Save, X, ChevronDown, TrendingUp
} from "lucide-react";

interface FeeRecord {
  id?: string;
  studentId: string;
  studentName: string;
  gradeClass: string;
  term: string;
  academicYear: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount?: number;
  paymentStatus?: string;
  lastPaymentDate?: string;
  remarks?: string;
}

const MOCK_FEES: FeeRecord[] = [
  { id: "f1", studentId: "WHS-2025-0001", studentName: "Ahmed Irfan",     gradeClass: "10-A", term: "Term 1", academicYear: "2025", totalAmount: 2500, paidAmount: 2500, dueAmount: 0,    paymentStatus: "PAID",    lastPaymentDate: "2025-01-12" },
  { id: "f2", studentId: "WHS-2025-0002", studentName: "Priya Sutharsan", gradeClass: "10-A", term: "Term 1", academicYear: "2025", totalAmount: 2500, paidAmount: 2500, dueAmount: 0,    paymentStatus: "PAID",    lastPaymentDate: "2025-01-14" },
  { id: "f3", studentId: "WHS-2025-0003", studentName: "Fathima Rizka",   gradeClass: "11-B", term: "Term 1", academicYear: "2025", totalAmount: 2500, paidAmount: 1500, dueAmount: 1000, paymentStatus: "PARTIAL", lastPaymentDate: "2025-02-08" },
  { id: "f4", studentId: "WHS-2025-0004", studentName: "Thuvaragan K.",   gradeClass: "11-B", term: "Term 1", academicYear: "2025", totalAmount: 2500, paidAmount: 0,    dueAmount: 2500, paymentStatus: "PENDING" },
  { id: "f5", studentId: "WHS-2025-0005", studentName: "Mihira Perera",   gradeClass: "12-A", term: "Term 1", academicYear: "2025", totalAmount: 3000, paidAmount: 0,    dueAmount: 3000, paymentStatus: "OVERDUE", remarks: "3rd reminder sent" },
  { id: "f6", studentId: "WHS-2025-0006", studentName: "Dilakshi Gamage", gradeClass: "12-A", term: "Term 1", academicYear: "2025", totalAmount: 3000, paidAmount: 3000, dueAmount: 0,    paymentStatus: "PAID",    lastPaymentDate: "2025-01-10" },
  { id: "f7", studentId: "WHS-2025-0007", studentName: "Thilaksha Nair",  gradeClass: "9-C",  term: "Term 1", academicYear: "2025", totalAmount: 2000, paidAmount: 2000, dueAmount: 0,    paymentStatus: "PAID",    lastPaymentDate: "2025-01-18" },
  { id: "f8", studentId: "WHS-2025-0008", studentName: "Janani Balaram",  gradeClass: "9-C",  term: "Term 1", academicYear: "2025", totalAmount: 2000, paidAmount: 500,  dueAmount: 1500, paymentStatus: "PARTIAL", lastPaymentDate: "2025-02-01" },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; icon: React.ReactNode }> = {
  PAID:    { label: "Paid",    bg: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> },
  PARTIAL: { label: "Partial", bg: "bg-amber-100 text-amber-800 border-amber-200",      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> },
  PENDING: { label: "Pending", bg: "bg-slate-100 text-slate-700 border-slate-200",      icon: <Clock className="w-3.5 h-3.5 text-slate-500" /> },
  OVERDUE: { label: "Overdue", bg: "bg-red-100 text-red-700 border-red-200",            icon: <XCircle className="w-3.5 h-3.5 text-red-600" /> },
};

const BLANK_RECORD: FeeRecord = {
  studentId: "", studentName: "", gradeClass: "", term: "Term 1",
  academicYear: "2025", totalAmount: 0, paidAmount: 0, remarks: "",
};

export default function FeeManagementPage() {
  const [records, setRecords]         = useState<FeeRecord[]>(MOCK_FEES);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterClass, setFilterClass] = useState("All");
  const [showForm, setShowForm]       = useState(false);
  const [editRecord, setEditRecord]   = useState<FeeRecord | null>(null);
  const [formData, setFormData]       = useState<FeeRecord>(BLANK_RECORD);
  const [saving, setSaving]           = useState(false);
  const [deleteId, setDeleteId]       = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/fees");
        if (res.ok) {
          const data: FeeRecord[] = await res.json();
          if (data.length > 0) setRecords(data);
        }
      } catch { /* use mock */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const classes = [...new Set(records.map(r => r.gradeClass))].sort();

  const filtered = records.filter(r => {
    const matchStatus = filterStatus === "All" || r.paymentStatus === filterStatus;
    const matchClass  = filterClass === "All"  || r.gradeClass === filterClass;
    const matchSearch = !searchQuery ||
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchClass && matchSearch;
  });

  // Summary stats
  const totalCollected = records.reduce((s, r) => s + r.paidAmount, 0);
  const totalDue       = records.reduce((s, r) => s + (r.dueAmount ?? 0), 0);
  const paidCount      = records.filter(r => r.paymentStatus === "PAID").length;
  const overdueCount   = records.filter(r => r.paymentStatus === "OVERDUE").length;

  const openAddForm  = () => { setEditRecord(null); setFormData(BLANK_RECORD); setShowForm(true); };
  const openEditForm = (r: FeeRecord) => { setEditRecord(r); setFormData(r); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    const due = formData.totalAmount - formData.paidAmount;
    const status = due <= 0 ? "PAID" : formData.paidAmount > 0 ? "PARTIAL" : "PENDING";
    const record = { ...formData, dueAmount: Math.max(due, 0), paymentStatus: status };

    try {
      if (editRecord?.id) {
        const res = await fetch(`http://localhost:8080/api/v1/fees/${editRecord.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record),
        });
        const updated = res.ok ? await res.json() : record;
        setRecords(prev => prev.map(r => r.id === editRecord.id ? { ...updated, id: editRecord.id } : r));
      } else {
        const tempId = `local-${Date.now()}`;
        try {
          const res = await fetch("http://localhost:8080/api/v1/fees", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record),
          });
          const created = res.ok ? await res.json() : { ...record, id: tempId };
          setRecords(prev => [created, ...prev]);
        } catch {
          setRecords(prev => [{ ...record, id: tempId }, ...prev]);
        }
      }
    } catch {
      setRecords(prev =>
        editRecord?.id ? prev.map(r => r.id === editRecord.id ? record : r)
                       : [{ ...record, id: `local-${Date.now()}` }, ...prev]
      );
    } finally { setSaving(false); setShowForm(false); }
  };

  const handleDelete = async (id: string) => {
    try { await fetch(`http://localhost:8080/api/v1/fees/${id}`, { method: "DELETE" }); } catch {}
    setRecords(prev => prev.filter(r => r.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-[#071526] text-white py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
                <DollarSign className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-crest">Fee & Payment Management</h1>
                <p className="text-slate-300 text-sm">Track and update student fee payment records</p>
              </div>
            </div>
            <button
              onClick={openAddForm}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Fee Record
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Collected", value: `LKR ${totalCollected.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50 border-emerald-200" },
            { label: "Total Outstanding", value: `LKR ${totalDue.toLocaleString()}`, icon: <AlertTriangle className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50 border-amber-200" },
            { label: "Fully Paid Students", value: paidCount.toString(), icon: <CheckCircle2 className="w-5 h-5 text-sky-600" />, bg: "bg-sky-50 border-sky-200" },
            { label: "Overdue Accounts", value: overdueCount.toString(), icon: <XCircle className="w-5 h-5 text-red-600" />, bg: "bg-red-50 border-red-200" },
          ].map(stat => (
            <div key={stat.label} className={`p-5 rounded-2xl border shadow-sm ${stat.bg} bg-white`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/70">{stat.icon}</div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student name or ID..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="All">All Statuses</option>
            {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
          </select>

          <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="All">All Classes</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading records...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="text-left px-4 py-3">Student</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Class</th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">Term</th>
                    <th className="text-right px-4 py-3 hidden sm:table-cell">Total</th>
                    <th className="text-right px-4 py-3 hidden sm:table-cell">Paid</th>
                    <th className="text-right px-4 py-3">Due</th>
                    <th className="text-center px-4 py-3">Status</th>
                    <th className="text-center px-4 py-3 hidden md:table-cell">Last Paid</th>
                    <th className="text-center px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-12 text-slate-400">No records found.</td></tr>
                  ) : filtered.map(record => {
                    const st = STATUS_CONFIG[record.paymentStatus ?? "PENDING"];
                    return (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{record.studentName}</p>
                          <p className="text-xs text-slate-400">{record.studentId}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{record.gradeClass}</td>
                        <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{record.term} · {record.academicYear}</td>
                        <td className="px-4 py-3 text-right text-slate-700 hidden sm:table-cell">LKR {record.totalAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-emerald-600 font-semibold hidden sm:table-cell">LKR {record.paidAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold text-red-600">
                          {(record.dueAmount ?? 0) > 0 ? `LKR ${record.dueAmount!.toLocaleString()}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold border ${st.bg}`}>
                            {st.icon} {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-slate-500 hidden md:table-cell">
                          {record.lastPaymentDate ? new Date(record.lastPaymentDate).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => openEditForm(record)} className="p-1.5 text-slate-400 hover:text-amber-600 rounded transition-colors" title="Edit record">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteId(record.id!)} className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors" title="Delete record">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-[#071526] px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-crest">
                {editRecord ? "Edit Fee Record" : "Add New Fee Record"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Student ID</label>
                  <input type="text" value={formData.studentId} onChange={e => setFormData(p => ({ ...p, studentId: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="WHS-2025-XXXX" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Student Name</label>
                  <input type="text" value={formData.studentName} onChange={e => setFormData(p => ({ ...p, studentName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Grade/Class</label>
                  <input type="text" value={formData.gradeClass} onChange={e => setFormData(p => ({ ...p, gradeClass: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. 10-A" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Term</label>
                  <select value={formData.term} onChange={e => setFormData(p => ({ ...p, term: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option>Term 1</option><option>Term 2</option><option>Term 3</option><option>Annual</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Academic Year</label>
                  <input type="text" value={formData.academicYear} onChange={e => setFormData(p => ({ ...p, academicYear: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Total Fee (LKR)</label>
                  <input type="number" value={formData.totalAmount} onChange={e => setFormData(p => ({ ...p, totalAmount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Amount Paid (LKR)</label>
                  <input type="number" value={formData.paidAmount} onChange={e => setFormData(p => ({ ...p, paidAmount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Last Payment Date</label>
                  <input type="date" value={formData.lastPaymentDate ?? ""} onChange={e => setFormData(p => ({ ...p, lastPaymentDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Remarks (optional)</label>
                <input type="text" value={formData.remarks ?? ""} onChange={e => setFormData(p => ({ ...p, remarks: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. Waiver applied, 2nd reminder..." />
              </div>

              {/* Live Due Preview */}
              {formData.totalAmount > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
                  <span>Due Amount:</span>
                  <span className="font-bold text-red-600">
                    LKR {Math.max(formData.totalAmount - formData.paidAmount, 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {editRecord ? "Update Record" : "Save Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Fee Record?</h3>
            <p className="text-sm text-slate-500">This action cannot be undone. The record will be permanently removed.</p>
            <div className="flex gap-3 justify-center pt-2">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId!)} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
