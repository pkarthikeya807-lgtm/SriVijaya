"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { dataStore } from "@/lib/data/store";
import { ServiceBooking, ServiceBookingStatus } from "@/types/database";
import { formatDate, formatINR } from "@/lib/utils";
import { 
  Wrench, 
  Search, 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  X, 
  User, 
  Bike, 
  Plus, 
  Trash2, 
  Receipt 
} from "lucide-react";

function AdminServicesContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");
  const initialAction = searchParams.get("action");

  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);

  // Billing modal states
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [laborCharge, setLaborCharge] = useState<number>(699);
  const [notes, setNotes] = useState("");
  const [parts, setParts] = useState<Array<{ part_name: string; quantity: number; unit_price: number }>>([
    { part_name: "Brake Pad Set", quantity: 1, unit_price: 499 }
  ]);

  // Offline booking intake modal
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [offlineName, setOfflineName] = useState("");
  const [offlinePhone, setOfflinePhone] = useState("");
  const [offlineModel, setOfflineModel] = useState("");
  const [offlineReg, setOfflineReg] = useState("");
  const [offlineNotes, setOfflineNotes] = useState("");

  useEffect(() => {
    refreshData();
    if (initialAction === "offline") {
      setOfflineModalOpen(true);
    }
  }, [initialAction]);

  const refreshData = () => {
    const list = dataStore.getServiceBookings();
    setBookings(list);
    if (initialId) {
      const match = list.find((b) => b.id === initialId || b.booking_number === initialId);
      if (match) setSelectedBooking(match);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: ServiceBookingStatus) => {
    dataStore.updateBookingStatus(id, newStatus);
    refreshData();
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };

  const handleCreateOfflineBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineName || !offlinePhone || !offlineModel) return;

    dataStore.createServiceBooking({
      customer_name: offlineName,
      phone: offlinePhone,
      vehicle_model: offlineModel,
      registration_number: offlineReg || null,
      service_type_id: "d0000000-0000-0000-0000-000000000001",
      specifications: offlineNotes || "Counter walk-in vehicle inspection",
      preferred_date: new Date().toISOString().split("T")[0],
      booking_source: "Offline",
    });

    setOfflineModalOpen(false);
    setOfflineName("");
    setOfflinePhone("");
    setOfflineModel("");
    setOfflineReg("");
    setOfflineNotes("");
    refreshData();
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    const partsTotal = parts.reduce((acc, p) => acc + p.quantity * p.unit_price, 0);

    dataStore.generateInvoiceForBooking(selectedBooking.id, {
      service_description: `Service completed for ${selectedBooking.vehicle_model}`,
      technician_notes: notes,
      labor_charges: Number(laborCharge),
      parts_charges: partsTotal,
      additional_charges: 0,
      discount: 0,
      parts,
    });

    setBillingModalOpen(false);
    refreshData();
    // Update selected booking view
    const updated = dataStore.getServiceBookingById(selectedBooking.id);
    if (updated) setSelectedBooking(updated);
  };

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      b.booking_number.toLowerCase().includes(q) ||
      b.customer_name.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.vehicle_model.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Workshop Bay &amp; Service Job Cards
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Intake customer bookings, update workshop progression, and generate itemized digital tax invoices.
          </p>
        </div>

        <button
          onClick={() => setOfflineModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all"
          id="record-offline-booking-btn"
        >
          <PlusCircle className="w-4 h-4" />
          Intake Offline Walk-in
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone number, vehicle, or booking ID..."
            className="w-full text-xs outline-none bg-transparent"
          />
        </div>
        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 font-medium"
          >
            <option value="all">All Statuses ({bookings.length})</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Booking ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Vehicle</th>
                <th className="py-3 px-6">Source</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-6 font-mono font-bold text-emerald-800">
                    {b.booking_number}
                  </td>
                  <td className="py-3 px-6">
                    <span className="font-bold text-slate-900 block">{b.customer_name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">+91 {b.phone}</span>
                  </td>
                  <td className="py-3 px-6 font-medium text-slate-900">
                    <div>{b.vehicle_model}</div>
                    {b.registration_number && (
                      <span className="text-[10px] font-mono font-bold text-emerald-700">
                        {b.registration_number}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {b.booking_source}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <select
                      value={b.status}
                      onChange={(e) => handleUpdateStatus(b.id, e.target.value as ServiceBookingStatus)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                        b.status === "Completed"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : b.status === "In Progress"
                          ? "bg-blue-50 text-blue-800 border-blue-300"
                          : b.status === "Confirmed"
                          ? "bg-purple-50 text-purple-800 border-purple-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-6 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        setNotes(b.service_record?.technician_notes || "");
                        setBillingModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[11px] inline-flex items-center gap-1 shadow-sm"
                    >
                      <Receipt className="w-3 h-3 text-emerald-400" />
                      {b.service_record ? "View / Edit Bill" : "Generate Invoice"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice / Job Card Modal */}
      {billingModalOpen && selectedBooking && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setBillingModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Job Card &amp; Invoice Billing
                </h3>
                <p className="text-xs text-emerald-600 font-mono font-bold">
                  {selectedBooking.booking_number} &bull; {selectedBooking.vehicle_model}
                </p>
              </div>
              <button
                onClick={() => setBillingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleGenerateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Technician Observations &amp; Work Report
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Battery pack cell balancing completed. Replaced front brake pads. Software updated."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Labor &amp; Inspection Charge (₹)
                </label>
                <input
                  type="number"
                  value={laborCharge}
                  onChange={(e) => setLaborCharge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* Spare Parts Itemizer */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900">Replacement Spares &amp; Parts</label>
                  <button
                    type="button"
                    onClick={() => setParts([...parts, { part_name: "Consumable", quantity: 1, unit_price: 250 }])}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3 h-3" />
                    Add Part Item
                  </button>
                </div>

                {parts.map((part, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Part Name"
                      value={part.part_name}
                      onChange={(e) => {
                        const next = [...parts];
                        next[idx].part_name = e.target.value;
                        setParts(next);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={part.quantity}
                      onChange={(e) => {
                        const next = [...parts];
                        next[idx].quantity = Number(e.target.value);
                        setParts(next);
                      }}
                      className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-center"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={part.unit_price}
                      onChange={(e) => {
                        const next = [...parts];
                        next[idx].unit_price = Number(e.target.value);
                        setParts(next);
                      }}
                      className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-right"
                    />
                    <button
                      type="button"
                      onClick={() => setParts(parts.filter((_, i) => i !== idx))}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Computed Total Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-700">Calculated Invoice Total:</span>
                <span className="text-lg font-black text-emerald-700">
                  {formatINR(
                    Number(laborCharge) +
                    parts.reduce((acc, p) => acc + p.quantity * p.unit_price, 0)
                  )}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBillingModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                >
                  Save &amp; Generate Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Intake Offline Booking Modal */}
      {offlineModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOfflineModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Record Offline Walk-in Service
              </h3>
              <button
                onClick={() => setOfflineModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateOfflineBooking} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={offlineName}
                  onChange={(e) => setOfflineName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={offlinePhone}
                  onChange={(e) => setOfflinePhone(e.target.value)}
                  placeholder="10-digit phone"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle Model *</label>
                <input
                  type="text"
                  required
                  value={offlineModel}
                  onChange={(e) => setOfflineModel(e.target.value)}
                  placeholder="e.g. Ola S1 Pro"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registration # (Optional)</label>
                <input
                  type="text"
                  value={offlineReg}
                  onChange={(e) => setOfflineReg(e.target.value.toUpperCase())}
                  placeholder="e.g. AP31-EV-8899"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reported Issue / Symptoms</label>
                <textarea
                  rows={2}
                  value={offlineNotes}
                  onChange={(e) => setOfflineNotes(e.target.value)}
                  placeholder="e.g. Urgent battery charging port issue"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOfflineModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                >
                  Create Job Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminServicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading service management...</div>}>
      <AdminServicesContent />
    </Suspense>
  );
}
