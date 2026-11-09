import React from "react";
import Link from "next/link";
import Image from "next/image";
import { dataStore } from "@/lib/data/store";
import { formatINR, getWhatsAppLink } from "@/lib/utils";
import { 
  Zap, 
  Wrench, 
  BatteryCharging, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  PhoneCall, 
  Sparkles,
  MapPin,
  Clock
} from "lucide-react";

export default function HomePage() {
  const settings = dataStore.getBusinessSettings();
  const featuredVehicles = dataStore.getVehicles().filter((v) => v.featured).slice(0, 3);
  const reviews = dataStore.getReviews().slice(0, 3);

  const whatsappInquiryUrl = getWhatsAppLink(
    settings.whatsapp_number,
    "Hello Sri Vijaya EV Bike Services, I would like to inquire about your EV bikes and service center."
  );

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white pt-10 pb-16 md:py-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Authorized Multi-Brand EV Showroom & Diagnostic Hub</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Switch to Smart Electric Mobility with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Sri Vijaya EV
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Discover the latest high-performance electric bikes & scooters from leading Indian manufacturers. Experience certified high-voltage battery health diagnostics, computerized motor tuning, and fast transparent servicing.
              </p>

              {/* Call-to-action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/vehicles"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all text-sm sm:text-base group"
                  id="hero-cta-explore"
                >
                  Explore EV Bikes
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md transition-all text-sm sm:text-base"
                  id="hero-cta-book-service"
                >
                  <Wrench className="w-4 h-4 text-emerald-400" />
                  Book a Service
                </Link>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold px-5 py-3.5 rounded-xl transition-all text-sm sm:text-base"
                  id="hero-cta-contact"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  Contact Us
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80">
                <div>
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500">Certified OEM Spares</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">36-Point</p>
                  <p className="text-xs text-slate-500">EV Diagnostics</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">2,500+</p>
                  <p className="text-xs text-slate-500">Happy Riders</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl blur-2xl opacity-20 transform -rotate-1"></div>
                <div className="relative bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
                  <div className="relative h-72 sm:h-80 w-full bg-slate-100">
                    <Image
                      src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000&auto=format&fit=crop&q=80"
                      alt="Sri Vijaya EV Smart Scooter Showcase"
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      Featured Model
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                        Ather Energy
                      </span>
                      <span className="text-lg font-bold text-slate-900">₹1,45,000</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Ather 450X Gen 3</h3>
                    <p className="text-xs text-slate-600">
                      Warp mode acceleration • 150 km claimed range • Fast charge 80% in 50 min
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/vehicles/c0000000-0000-0000-0000-000000000001"
                        className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        View Vehicle Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED EV VEHICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
              Top Picks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Electric Vehicles
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              High mileage, instant torque, and premium smart dashboards.
            </p>
          </div>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
          >
            Browse all EV models
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden group"
            >
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <Image
                  src={vehicle.image_urls[0] || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80"}
                  alt={vehicle.model_name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {vehicle.availability}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">
                    {vehicle.brand?.name}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 group-hover:text-emerald-600 transition-colors">
                    {vehicle.model_name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {vehicle.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Range</span>
                    <span className="font-semibold text-slate-800">{vehicle.claimed_range}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Charging</span>
                    <span className="font-semibold text-slate-800">{vehicle.charging_time.split("(")[0]}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Ex-Showroom</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      {formatINR(vehicle.price)}
                    </span>
                  </div>
                  <Link
                    href={`/vehicles/${vehicle.id}`}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SERVICE CENTER FACILITIES OVERVIEW */}
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">
              Next-Gen Workshop
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              State-of-the-Art EV Diagnostic Center
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Unlike traditional mechanical garages, electric two-wheelers require specialized computerized diagnostic instruments and high-voltage safety certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">BMS Cell Balancing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computerized cell voltage leveling, health analytics (SOH/SOC), and thermal paste refreshment to extend battery longevity.
              </p>
            </div>

            <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Controller Diagnostics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                PMSM and BLDC throttle wave analysis, hall sensor calibration, and firmware telemetry updates for smooth power delivery.
              </p>
            </div>

            <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">36-Point Safety Inspection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                IP67 water ingress checks, regenerative braking checks, steering head bearings, and tire pressure adjustments.
              </p>
            </div>

            <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Express Turnaround</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prioritized online appointments with real-time digital job cards, transparent SMS updates, and fast delivery.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-md transition-colors text-sm"
            >
              Book Service Appointment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
              The Sri Vijaya Advantage
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why EV Riders Count on Sri Vijaya EV Services
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We bring over five years of dedicated electric vehicle engineering and customer satisfaction. From purchase to routine maintenance, you get unmatched peace of mind.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Certified EV Mechanics</h4>
                  <p className="text-xs text-slate-500">Trained on high-voltage 48V-72V lithium pack safety and electronic motor controllers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">100% Genuine Spare Parts</h4>
                  <p className="text-xs text-slate-500">Direct sourcing of OEM brake pads, belts, digital clusters, and lithium battery modules.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Digital Invoicing & Online Tracking</h4>
                  <p className="text-xs text-slate-500">Track complete service history, itemized parts bills, and verify payments in one tap.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-emerald-50 rounded-3xl p-8 border border-emerald-200">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Need Immediate EV Assistance?</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Whether you want to test ride the latest Ather 450X or need an urgent battery checkup before a long commute, our technicians are on standby.
              </p>

              <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-slate-500">Service Center Location</p>
                    <p className="text-sm font-semibold text-slate-900">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-slate-500">Working Hours</p>
                    <p className="text-sm font-semibold text-slate-900">{settings.opening_hours}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl text-center text-sm transition-colors shadow-sm"
                >
                  Call {settings.phone}
                </a>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold py-3 px-4 rounded-xl text-center text-sm transition-colors"
                >
                  WhatsApp Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER REVIEWS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
              Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Verified Customer Experiences
            </h2>
          </div>
          <Link
            href="/reviews"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
          >
            Read all reviews &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;{rev.review_text}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rev.customer?.full_name}</h4>
                  <p className="text-[11px] text-slate-400">Verified EV Owner</p>
                </div>
                <span className="text-[11px] text-slate-400">5-Star Experience</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
