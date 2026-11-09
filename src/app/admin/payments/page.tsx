"use client";

import React, { useState, useEffect } from "react";
import { dataStore } from "@/lib/data/store";
import { Invoice } from "@/types/database";
import { formatINR, formatDate, formatDateTime } from "@/lib/utils";
import { 
  CreditCard, 
  Search, 
  Printer, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText, 
  Receipt,
  Store,
  ShieldCheck
} from "lucide-react";

export default function AdminPaymentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const list = dataStore.getInvoices();
    setInvoices(list);
  };

  const handleRecordCash = (invoiceId: string, amount: number) => {
    if (!confirm(`Confirm receiving cash payment of ${formatINR(amount)} at the showroom counter?`)) return;
    dataStore.recordPayment(invoiceId, {
      amount,
      payment_method: "Cash",
      payment_provider: "Cash Counter (Showroom Manager)",
      transaction_reference: `CASH-REC-${Date.now().toString().slice(-6)}`,
    });
    refreshData();
  };

  const filtered = invoices.filter((inv) => {
    const matchesStatus = statusFilter === "all" || inv.payment_status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      inv.invoice_number.toLowerCase().includes(q) ||
      inv.service_record?.technician_notes?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Billing &amp; Revenue Reconciliation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile UPI settlement reports, record counter cash payments, and print customer tax invoices.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice number..."
            className="w-full text-xs outline-none bg-transparent"
          />
        </div>
        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 font-medium"
          >
            <option value="all">All Invoices ({invoices.length})</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Invoice #</th>
                <th className="py-3 px-6">Issue Date</th>
                <th className="py-3 px-6">Labor + Parts</th>
                <th className="py-3 px-6">Total Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Settlement Details</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-6 font-mono font-bold text-slate-900">
                    {inv.invoice_number}
                  </td>
                  <td className="py-3 px-6 text-slate-500">
                    {formatDate(inv.issue_date)}
                  </td>
                  <td className="py-3 px-6">
                    <span className="text-slate-500 block">
                      Labor: {formatINR(inv.service_record?.labor_charges || 0)}
                    </span>
                    <span className="text-slate-500 block">
                      Parts: {formatINR(inv.service_record?.parts_charges || 0)}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-black text-slate-950 text-sm">
                    {formatINR(inv.total_amount)}
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inv.payment_status === "Paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {inv.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-slate-600">
                    {inv.payments && inv.payments.length > 0 ? (
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {inv.payments[0].payment_method}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {inv.payments[0].transaction_reference}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No payments logged</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-right space-x-2">
                    {inv.payment_status !== "Paid" && (
                      <button
                        onClick={() => handleRecordCash(inv.id, inv.total_amount)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] shadow-sm inline-flex items-center gap-1"
                      >
                        <Store className="w-3 h-3" />
                        Record Cash
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px] inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedInvoice(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            id="printable-tax-invoice"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-black text-slate-900">Sri Vijaya EV Bike Services</h2>
                <p className="text-xs text-slate-500">Official GST Service Center Tax Invoice</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <p className="font-bold text-slate-900">Invoice Number:</p>
                <p className="font-mono">{selectedInvoice.invoice_number}</p>
                <p className="font-bold text-slate-900 mt-2">Date of Issue:</p>
                <p>{formatDate(selectedInvoice.issue_date)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">Payment Status:</p>
                <p className="font-bold text-emerald-700">{selectedInvoice.payment_status}</p>
                <p className="font-bold text-slate-900 mt-2">Due Date:</p>
                <p>{formatDate(selectedInvoice.due_date)}</p>
              </div>
            </div>

            {/* Spares and Labor Table */}
            <table className="w-full text-xs border-t border-b border-slate-200 py-2">
              <thead>
                <tr className="text-slate-400 text-left border-b border-slate-100">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 font-medium">Labor &amp; 36-Point Computer Diagnostics</td>
                  <td className="py-2 text-right font-bold">{formatINR(selectedInvoice.service_record?.labor_charges || 0)}</td>
                </tr>
                {selectedInvoice.service_record?.parts?.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2">{p.part_name} (x{p.quantity})</td>
                    <td className="py-2 text-right font-bold">{formatINR(p.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center text-sm font-black text-slate-950 pt-1">
              <span>Grand Total Amount:</span>
              <span className="text-lg text-emerald-700">{formatINR(selectedInvoice.total_amount)}</span>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
