"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { ServiceBooking } from "@/types/database";
import { formatDate, formatINR } from "@/lib/utils";
import { 
  History, 
  Bike, 
  Calendar, 
  Wrench, 
  FileText, 
  CreditCard, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";

export default function HistoryPage() {
  const { user, isLoading } = useAuth();
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);

  useEffect(() => {
    // If logged in, fetch customer's bookings; if demo or unauthenticated, retrieve associated bookings
    const phoneFilter = user?.phone || "9876543211";
    const userBookings = dataStore.getServiceBookings({ phone: phoneFilter });
    setBookings(userBookings);
  }, [user]);

  const getStatusBadge = (status: ServiceBooking["status"]) => {
    switch (status) {
      case "Completed":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case "In Progress":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1"><Wrench className="w-3 h-3 animate-spin" /> In Progress</span>;
      case "Confirmed":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1"><Calendar className="w-3 h-3" /> Confirmed</span>;
      case "Cancelled":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1"><X className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
            Service Records
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Service History &amp; Records
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            View job cards, diagnostic notes, itemized bills, and track active workshop statuses.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-all"
        >
          <Wrench className="w-4 h-4" />
          Book New Service
        </Link>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No service history available</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don&apos;t have any previous service bookings associated with this account. Book an appointment today for complete diagnostics.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
          >
            Book Your First Service
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const invoice = dataStore.getInvoices().find((inv) => inv.service_record?.booking_id === booking.id);
            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card transition-all p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left: Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md">
                      {booking.booking_number}
                    </span>
                    {getStatusBadge(booking.status)}
                    <span className="text-xs text-slate-400">
                      Booked on {formatDate(booking.created_at)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Bike className="w-5 h-5 text-emerald-600" />
                      {booking.vehicle_model}
                      {booking.registration_number && (
                        <span className="text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          {booking.registration_number}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong className="text-slate-800">Type:</strong> {booking.service_type?.name || "General Service"} &bull;{" "}
                      <span className="italic">&ldquo;{booking.specifications}&rdquo;</span>
                    </p>
                  </div>
                </div>

                {/* Right: Bill & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                      Service Bill
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      {invoice ? formatINR(invoice.total_amount) : "₹" + (booking.service_type?.estimated_cost || "699")}
                    </span>
                    <span className={`block text-[11px] font-bold ${
                      invoice?.payment_status === "Paid" ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      {invoice?.payment_status || "Pending Intake"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="px-4 py-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-800 font-semibold text-xs transition-colors flex items-center gap-1.5"
                      id={`view-booking-${booking.booking_number}`}
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      View Details
                    </button>

                    {invoice && invoice.payment_status !== "Paid" && (
                      <Link
                        href={`/payment?invoice=${invoice.id}`}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Pay Bill
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Job Card &amp; Service Details</h3>
                <p className="text-xs text-emerald-600 font-mono font-bold">
                  {selectedBooking.booking_number}
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 text-xs block">Vehicle</span>
                  <span className="font-bold text-slate-800">{selectedBooking.vehicle_model}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Registration</span>
                  <span className="font-mono font-bold text-slate-800">{selectedBooking.registration_number || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Service Category</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.service_type?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Appointment Date</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.preferred_date}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Reported Customer Issues:</h4>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-700 italic border border-slate-100">
                  &ldquo;{selectedBooking.specifications}&rdquo;
                </p>
              </div>

              {selectedBooking.service_record ? (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900">Technician Observations &amp; Work Done:</h4>
                  <p className="text-slate-700 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                    {selectedBooking.service_record.technician_notes || "All diagnostic steps and routine servicing concluded."}
                  </p>

                  {/* Replaced Parts Breakdown */}
                  {selectedBooking.service_record.parts && selectedBooking.service_record.parts.length > 0 && (
                    <div className="pt-2">
                      <h4 className="font-bold text-slate-900 mb-2">Itemized Spares &amp; Consumables:</h4>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 text-left">
                            <th className="py-1.5">Part Description</th>
                            <th className="py-1.5 text-center">Qty</th>
                            <th className="py-1.5 text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedBooking.service_record.parts.map((p) => (
                            <tr key={p.id} className="border-b border-slate-100">
                              <td className="py-1.5 font-medium text-slate-800">{p.part_name}</td>
                              <td className="py-1.5 text-center text-slate-600">{p.quantity}</td>
                              <td className="py-1.5 text-right font-bold text-slate-900">{formatINR(p.total_price)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Charges Summary */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Labor &amp; Diagnostic Charges:</span>
                      <span>{formatINR(selectedBooking.service_record.labor_charges)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Parts Charges:</span>
                      <span>{formatINR(selectedBooking.service_record.parts_charges)}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-slate-950 pt-1 border-t border-slate-200">
                      <span>Total Bill Amount:</span>
                      <span className="text-emerald-700">{formatINR(selectedBooking.service_record.total_amount)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Vehicle is currently awaiting diagnostic bay entry. Itemized job card and final bill will appear here once service is underway.
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Close Job Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
