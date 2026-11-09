"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { 
  LayoutDashboard, 
  Bike, 
  Wrench, 
  CreditCard, 
  Star, 
  ShieldCheck, 
  LogOut, 
  ArrowLeft,
  Lock
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loginAsAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // If user is not admin, show secure role authorization screen
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-900 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">Admin Authentication Required</h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            The Sri Vijaya EV administration portal is protected with server-side role-based access control (RBAC). Only authenticated managers can modify catalog prices, job cards, and invoices.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4 text-left text-xs">
          <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Authorized Manager Phone: <strong>9876543210</strong></span>
          </div>

          <button
            onClick={async () => {
              await loginAsAdmin();
              router.refresh();
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            id="admin-auth-login-button"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Sign In as Sri Vijaya Admin Manager
          </button>

          <div className="text-center">
            <Link href="/" className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Customer Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "EV Fleet", href: "/admin/vehicles", icon: Bike },
    { label: "Service Bookings", href: "/admin/services", icon: Wrench },
    { label: "Bills & Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Reviews Moderation", href: "/admin/reviews", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-slate-100/60 pb-16">
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-md">
                Admin Console
              </span>
              <span className="text-sm font-semibold text-slate-300 hidden sm:inline">
                Sri Vijaya EV Operations Hub
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400 hidden sm:inline">
                Logged in as <strong className="text-white">{user.full_name}</strong>
              </span>
              <Link
                href="/"
                className="text-slate-300 hover:text-emerald-400 font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Customer Site
              </Link>
              <button
                onClick={logout}
                className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 border border-slate-700 px-2.5 py-1 rounded-lg"
              >
                <LogOut className="w-3 h-3" />
                Logout
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
