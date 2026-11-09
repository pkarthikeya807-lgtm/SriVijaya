"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { dataStore } from "@/lib/data/store";
import { Invoice, PaymentMethod } from "@/types/database";
import { formatINR, formatDate, formatDateTime } from "@/lib/utils";
import { 
  CreditCard, 
  QrCode, 
  Store, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  FileText, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Building
} from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const invoiceParam = searchParams.get("invoice");

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("PhonePe");
  const [utrNumber, setUtrNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const list = dataStore.getInvoices();
    setInvoices(list);
    if (invoiceParam) {
      const match = list.find((inv) => inv.id === invoiceParam || inv.invoice_number === invoiceParam);
      if (match) setSelectedInvoice(match);
      else if (list.length > 0) setSelectedInvoice(list[0]);
    } else if (list.length > 0) {
      setSelectedInvoice(list[0]);
    }
  }, [invoiceParam]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setError(null);

    setSubmitting(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_id: selectedInvoice.id,
          amount: selectedInvoice.total_amount,
          payment_method: selectedMethod,
          payment_provider: selectedMethod === "Cash" ? "Store Counter" : `${selectedMethod} UPI`,
          transaction_reference: selectedMethod === "Cash" ? "CASH-COUNTER" : (utrNumber || `UPI-${Date.now()}`),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPaymentSuccess(true);
        setSelectedInvoice(data.data);
      } else {
        setError(data.error || "Failed to record payment");
      }
    } catch {
      setError("Network error while recording payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="border-b border-slate-200/80 pb-6">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
          Billing &amp; Settlement
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Payments &amp; Digital Invoices
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review transparent service itemization and settle your dues securely via UPI or cash counter.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bill / Invoice Selector & Overview */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            Your Invoices ({invoices.length})
          </h3>

          <div className="space-y-3">
            {invoices.map((inv) => (
              <button
                key={inv.id}
                onClick={() => {
                  setSelectedInvoice(inv);
                  setPaymentSuccess(false);
                  setError(null);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedInvoice?.id === inv.id
                    ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-white/80 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {inv.invoice_number}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      inv.payment_status === "Paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {inv.payment_status}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">
                    Issued: {formatDate(inv.issue_date)}
                  </span>
                  <span className="text-base font-extrabold text-slate-900">
                    {formatINR(inv.total_amount)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Bill Breakdown & Payment Gateway */}
        <div className="lg:col-span-7">
          {selectedInvoice ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-6">
              {/* Bill Header */}
              <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Official Tax Invoice
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                    {selectedInvoice.invoice_number}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Due</span>
                  <span className="text-2xl font-black text-slate-950">
                    {formatINR(selectedInvoice.total_amount)}
                  </span>
                </div>
              </div>

              {/* Status Alert */}
              {selectedInvoice.payment_status === "Paid" ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold">This bill has been paid in full.</p>
                    <p className="text-slate-600 mt-0.5">
                      Settled via {selectedInvoice.payments?.[0]?.payment_method || "UPI"} &bull; Ref:{" "}
                      <span className="font-mono">{selectedInvoice.payments?.[0]?.transaction_reference || "REC-PAID"}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-900 text-xs">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Payment Pending</p>
                    <p className="text-slate-600 mt-0.5">
                      Please settle before {formatDate(selectedInvoice.due_date)} via one of the options below.
                    </p>
                  </div>
                </div>
              )}

              {/* Itemized Charges Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Cost Breakdown
                </h3>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Labor &amp; Inspection Charges:</span>
                    <span className="font-semibold text-slate-900">
                      {formatINR(selectedInvoice.service_record?.labor_charges || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Parts &amp; Components:</span>
                    <span className="font-semibold text-slate-900">
                      {formatINR(selectedInvoice.service_record?.parts_charges || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Additional Consumables / Sanitization:</span>
                    <span className="font-semibold text-slate-900">
                      {formatINR(selectedInvoice.service_record?.additional_charges || 0)}
                    </span>
                  </div>
                  {selectedInvoice.service_record?.discount ? (
                    <div className="flex justify-between text-emerald-700">
                      <span>Showroom Discount:</span>
                      <span className="font-semibold">
                        -{formatINR(selectedInvoice.service_record.discount)}
                      </span>
                    </div>
                  ) : null}
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                    <span>Final Amount:</span>
                    <span className="text-emerald-700 text-base">
                      {formatINR(selectedInvoice.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Section (Visible when bill is pending) */}
              {selectedInvoice.payment_status !== "Paid" && (
                <form onSubmit={handleRecordPayment} className="space-y-5 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Choose Payment Method
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(["PhonePe", "Google Pay", "Paytm", "Cash"] as PaymentMethod[]).map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setSelectedMethod(method)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          selectedMethod === method
                            ? "bg-emerald-50 border-emerald-600 text-emerald-800 shadow-sm ring-1 ring-emerald-500"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {method === "Cash" ? "Cash at Store" : method}
                      </button>
                    ))}
                  </div>

                  {/* Payment Instructions based on method */}
                  {selectedMethod === "Cash" ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Store className="w-4 h-4 text-emerald-600" />
                        <span>Cash Payment at Showroom Counter</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        Please visit our service center counter at{" "}
                        <strong className="text-slate-800">Beside RTC Complex, Visakhapatnam</strong>{" "}
                        with your Invoice number <strong className="font-mono">{selectedInvoice.invoice_number}</strong>. The admin will verify and provide a printed receipt.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <QrCode className="w-4 h-4 text-emerald-600" />
                          <span>Instant UPI Scan &amp; Pay</span>
                        </div>
                        <span className="font-mono text-[11px] bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-800">
                          UPI ID: srivijayaev@upi
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                        <p className="text-slate-500 text-[11px]">Pay directly from {selectedMethod} App</p>
                        <p className="text-lg font-black text-slate-900 font-mono">
                          {formatINR(selectedInvoice.total_amount)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          UPI Transaction Reference / UTR Number
                        </label>
                        <input
                          type="text"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="e.g. 530291084201"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Entered UTR will be verified and recorded on our server.
                        </span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium border border-rose-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3.5 px-6 rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    id="submit-payment-button"
                  >
                    {submitting ? (
                      "Recording Payment..."
                    ) : selectedMethod === "Cash" ? (
                      "Record Cash Counter Request"
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Confirm &amp; Record {selectedMethod} Payment
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Select an invoice to view billing details</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto p-12 text-center text-sm text-slate-500">Loading bills...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
