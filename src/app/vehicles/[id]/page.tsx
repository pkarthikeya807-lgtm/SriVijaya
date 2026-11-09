"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dataStore } from "@/lib/data/store";
import { formatINR, getWhatsAppLink } from "@/lib/utils";
import { 
  Zap, 
  ArrowLeft, 
  Battery, 
  Gauge, 
  Clock, 
  Cpu, 
  ShieldCheck, 
  Palette, 
  Calendar, 
  MessageSquare, 
  Check, 
  Sparkles,
  PhoneCall
} from "lucide-react";

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const vehicle = dataStore.getVehicleById(id);
  const settings = dataStore.getBusinessSettings();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [testRideModalOpen, setTestRideModalOpen] = useState(false);
  const [testRideSuccess, setTestRideSuccess] = useState(false);
  const [testRideName, setTestRideName] = useState("");
  const [testRidePhone, setTestRidePhone] = useState("");
  const [testRideDate, setTestRideDate] = useState("");

  if (!vehicle) {
    notFound();
  }

  const whatsappMessage = `Hello Sri Vijaya EV Bike Services, I would like to enquire about ${vehicle.brand?.name} ${vehicle.model_name}. Please provide more details on pricing and test rides.`;
  const whatsappUrl = getWhatsAppLink(settings.whatsapp_number, whatsappMessage);

  const handleTestRideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRideName || !testRidePhone) return;
    setTestRideSuccess(true);
    setTimeout(() => {
      setTestRideModalOpen(false);
      setTestRideSuccess(false);
      setTestRideName("");
      setTestRidePhone("");
      setTestRideDate("");
    }, 2500);
  };

  const images = vehicle.image_urls.length > 0 ? vehicle.image_urls : [
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000&auto=format&fit=crop&q=80"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all EV Vehicles
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Multi-Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-80 sm:h-[420px] w-full rounded-3xl bg-slate-100 border border-slate-200/80 shadow-md overflow-hidden">
            <Image
              src={images[activeImageIndex] || images[0]}
              alt={`${vehicle.brand?.name} ${vehicle.model_name}`}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {vehicle.availability}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx ? "border-emerald-600 shadow-md scale-95" : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Detailed Vehicle Description */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Vehicle Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>
        </div>

        {/* Right Column: Pricing, Specs & CTA Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
                {vehicle.brand?.name}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
                {vehicle.model_name}
              </h1>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-950">
                  {formatINR(vehicle.price)}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Ex-showroom (Excluding RTO & Insurance)
                </span>
              </div>
            </div>

            {/* CTAs: Book a Test Ride & Enquire on WhatsApp */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => setTestRideModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all text-sm"
                id="book-test-ride-button"
              >
                <Calendar className="w-4 h-4" />
                Book a Test Ride
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold py-3.5 px-6 rounded-2xl transition-all text-sm"
                id="enquire-whatsapp-button"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Enquire on WhatsApp
              </a>
            </div>

            {/* Official Specifications List */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Official Technical Specifications
              </h3>

              <div className="space-y-2.5 text-xs">
                {vehicle.battery_capacity && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Battery className="w-4 h-4 text-emerald-600" />
                      Battery Capacity
                    </span>
                    <span className="font-bold text-slate-900">{vehicle.battery_capacity}</span>
                  </div>
                )}

                {vehicle.claimed_range && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      Claimed Range
                    </span>
                    <span className="font-bold text-slate-900">{vehicle.claimed_range}</span>
                  </div>
                )}

                {vehicle.charging_time && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-600" />
                      Charging Time
                    </span>
                    <span className="font-bold text-slate-900">{vehicle.charging_time}</span>
                  </div>
                )}

                {vehicle.motor_power && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-600" />
                      Motor Power
                    </span>
                    <span className="font-bold text-slate-900">{vehicle.motor_power}</span>
                  </div>
                )}

                {vehicle.top_speed && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-amber-600" />
                      Top Speed
                    </span>
                    <span className="font-bold text-slate-900">{vehicle.top_speed}</span>
                  </div>
                )}

                {vehicle.warranty && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Warranty
                    </span>
                    <span className="font-bold text-slate-900">{vehicle.warranty}</span>
                  </div>
                )}

                {vehicle.colors && vehicle.colors.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-purple-600" />
                      Available Color Schemes
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {vehicle.colors.map((color, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-medium text-slate-800"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Showroom Help Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Visit Showroom for Instant Subsidy Check</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Eligible for state green EV subsidies and fast paperless loan approvals at our Visakhapatnam showroom.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Book a Test Ride Modal */}
      {testRideModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setTestRideModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Book a Free Test Ride</h3>
                <p className="text-xs text-emerald-600 font-medium">
                  {vehicle.brand?.name} {vehicle.model_name}
                </p>
              </div>
              <button
                onClick={() => setTestRideModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            {testRideSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Test Ride Slot Confirmed!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Our team at Sri Vijaya EV Showroom will keep the vehicle charged and ready for you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTestRideSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={testRideName}
                    onChange={(e) => setTestRideName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={testRidePhone}
                    onChange={(e) => setTestRidePhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={testRideDate}
                    onChange={(e) => setTestRideDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all"
                  >
                    Confirm Test Ride Appointment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
