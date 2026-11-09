import React from "react";
import Link from "next/link";
import { Zap, Phone, Mail, MapPin, Clock, MessageSquare, ArrowUpRight } from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";

export function Footer() {
  const whatsappUrl = getWhatsAppLink(
    "+919876543210",
    "Hello Sri Vijaya EV Bike Services, I would like to enquire about your showroom EV bikes and service center."
  );

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">
                  Sri Vijaya
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">
                  EV Bike Services
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted authorized electric vehicle showroom & state-of-the-art diagnostic service center. Driving clean, green, and reliable urban mobility.
            </p>
            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Quick Chat
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-wide">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/vehicles" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  Explore EV Bikes
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  Book a Service
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  Track Service History
                </Link>
              </li>
              <li>
                <Link href="/payment" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  Bills & Payment Options
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  Customer Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-wide">Contact Details</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>
                  <strong className="text-slate-200 block">Support Hotline</strong>
                  <a href="tel:+919876543210" className="hover:text-emerald-400 transition-colors">
                    +91 98765 43210
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>
                  <strong className="text-slate-200 block">Official Email</strong>
                  <a href="mailto:support@srivijayaevbikes.com" className="hover:text-emerald-400 transition-colors">
                    support@srivijayaevbikes.com
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>
                  <strong className="text-slate-200 block">Showroom Address</strong>
                  D.No 48-14-3, Main Road, Beside RTC Complex, Visakhapatnam, AP - 530016
                </span>
              </li>
            </ul>
          </div>

          {/* Opening Hours & Maps */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-wide">Service Center Timings</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-slate-200 font-medium">Monday - Saturday</p>
                  <p>9:00 AM – 8:00 PM</p>
                  <p className="text-slate-200 font-medium mt-2">Sunday</p>
                  <p>10:00 AM – 2:00 PM (Emergency Only)</p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Visakhapatnam+RTC+Complex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium text-xs border border-emerald-500/30 rounded-lg px-3 py-1.5 hover:bg-emerald-500/10 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  View on Google Maps
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Sri Vijaya EV Bike Services. All rights reserved.</p>
          <p className="text-slate-400">
            Certified Electric Vehicle Multi-Brand Service Specialist
          </p>
        </div>
      </div>
    </footer>
  );
}
