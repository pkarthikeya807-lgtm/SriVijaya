"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { ServiceType } from "@/types/database";
import { 
  Wrench, 
  CheckCircle2, 
  Calendar, 
  Bike, 
  ClipboardList, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Info
} from "lucide-react";

export default function ServicesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [preferredDate, setPreferredDate] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingNumber: string;
    model: string;
    date: string;
  } | null>(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    const types = dataStore.getServiceTypes();
    setServiceTypes(types);
    if (types.length > 0) {
      setServiceTypeId(types[0].id);
    }

    if (user) {
      setCustomerName(user.full_name || "");
      setPhone(user.phone || "");
      // Pre-fill demo vehicle if Ramesh Naidu
      if (user.phone === "9876543211") {
        setVehicleModel("Ather 450X Gen 3");
        setRegistrationNumber("AP31-EV-1024");
      }
    }

    // Default to tomorrow's date
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    setPreferredDate(tomorrow);
  }, [user]);

  const handleSelectSavedVehicle = (model: string, reg: string) => {
    setVehicleModel(model);
    setRegistrationNumber(reg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !phone.trim() || !vehicleModel.trim() || !serviceTypeId || !specifications.trim()) {
      setError("Please fill in all required fields marked with *");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/service-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          vehicle_model: vehicleModel,
          registration_number: registrationNumber || null,
          service_type_id: serviceTypeId,
          specifications,
          preferred_date: preferredDate,
          customer_id: user?.id || null,
          booking_source: "Online",
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setConfirmedBooking({
          bookingNumber: resData.data.booking_number,
          model: resData.data.vehicle_model,
          date: resData.data.preferred_date,
        });
      } else {
        setError(resData.errors ? Object.values(resData.errors).flat().join(", ") : "Could not complete booking");
      }
    } catch {
      setError("Network error while creating booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Heading */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Wrench className="w-3.5 h-3.5 text-emerald-600" />
          <span>Certified EV Diagnostics Bay</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Book an EV Service Appointment
        </h1>
        <p className="text-sm text-slate-600">
          Book online for priority garage intake, battery cell diagnosis, motor calibration, or periodic maintenance.
        </p>
      </div>

      {/* Confirmation Card after Booking */}
      {confirmedBooking ? (
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl p-8 sm:p-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Booking Confirmed
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Service Request Submitted!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your appointment has been registered at Sri Vijaya EV Services. Our service advisor will call you to confirm your intake bay.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 max-w-md mx-auto text-left space-y-3 text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Booking ID:</span>
              <span className="font-mono font-bold text-emerald-700 text-base">
                {confirmedBooking.bookingNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Vehicle Model:</span>
              <span className="font-semibold text-slate-900">{confirmedBooking.model}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Preferred Date:</span>
              <span className="font-semibold text-slate-900">{confirmedBooking.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                Pending Intake
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/history"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-sm shadow-md transition-all"
            >
              View in My Service History
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setConfirmedBooking(null);
                setSpecifications("");
              }}
              className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-6 rounded-xl text-sm transition-all"
            >
              Book Another Service
            </button>
          </div>
        </div>
      ) : (
        /* The Booking Form */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-10 space-y-8">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Logged in notification / quick saved vehicle picker */}
          {user ? (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.full_name?.charAt(0) || "U"}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Signed in as {user.full_name}</p>
                  <p className="text-slate-500">+91 {user.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Quick load vehicle:</span>
                <button
                  type="button"
                  onClick={() => handleSelectSavedVehicle("Ather 450X Gen 3", "AP31-EV-1024")}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  Ather 450X
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSavedVehicle("TVS iQube S", "AP31-EV-5582")}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  TVS iQube
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Have previous services with us? Login to auto-fill your profile.
              </span>
              <Link
                href="/login"
                className="text-emerald-700 font-bold hover:underline flex-shrink-0"
              >
                Login here
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Customer Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <ClipboardList className="w-4 h-4 text-emerald-600" />
                1. Customer Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Naidu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    id="booking-customer-name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    id="booking-phone"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Vehicle Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <Bike className="w-4 h-4 text-emerald-600" />
                2. Vehicle Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. Ather 450X, TVS iQube, Ola S1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    id="booking-vehicle-model"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Vehicle Registration Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. AP31-EV-1024"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase font-mono"
                    id="booking-registration-number"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Service Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <Wrench className="w-4 h-4 text-emerald-600" />
                3. Service Requirements
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Type of Service *
                  </label>
                  <select
                    value={serviceTypeId}
                    onChange={(e) => setServiceTypeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50 font-medium"
                    id="booking-service-type"
                  >
                    {serviceTypes.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} (Estimated: ₹{st.estimated_cost})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Service Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    id="booking-preferred-date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Service Specifications / Reported Issues *
                </label>
                <textarea
                  rows={3}
                  required
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder="Describe vehicle symptoms (e.g. range dropping quickly, front disc brake squeak, motor vibration, headlight flickering)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  id="booking-specifications"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 px-6 rounded-2xl text-base shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all cursor-pointer"
                id="book-now-submit-button"
              >
                {submitting ? (
                  "Registering Booking..."
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    Book Now
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
