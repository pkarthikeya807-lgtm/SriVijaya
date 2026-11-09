"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { 
  Zap, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ShieldCheck, 
  Bike, 
  Wrench, 
  History, 
  CreditCard, 
  Star 
} from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { label: "EV Bikes", href: "/vehicles", icon: Bike },
    { label: "Services", href: "/services", icon: Wrench },
    { label: "History", href: "/history", icon: History },
    { label: "Payment", href: "/payment", icon: CreditCard },
    { label: "Reviews", href: "/reviews", icon: Star },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
          id="nav-brand-logo"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight group-hover:text-emerald-600 transition-colors">
              Sri Vijaya
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 block">
              EV Bike Services
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-emerald-50 text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-emerald-600" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                pathname.startsWith("/admin")
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Right side: User Profile or Login + Hamburger Menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/60 rounded-full py-1.5 px-3">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                {user.full_name?.charAt(0) || "U"}
              </div>
              <span className="text-xs font-semibold text-emerald-900 max-w-[120px] truncate">
                {user.full_name || user.phone}
              </span>
              <button
                onClick={logout}
                title="Logout"
                className="text-slate-400 hover:text-rose-600 transition-colors ml-1 p-1"
                id="header-logout-button"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all"
              id="header-login-button"
            >
              <User className="w-4 h-4" />
              Login
            </Link>
          )}

          {/* Hamburger Menu Icon (Always visible and responsive) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Toggle Navigation Menu"
            id="hamburger-menu-button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Vertical Navigation Panel (Drawer / Dropdown) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between z-50 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Sri Vijaya</h3>
                    <p className="text-xs text-emerald-600 font-medium">EV Bike Services</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card in Panel */}
              {user && (
                <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    {user.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.full_name}</p>
                    <p className="text-xs text-slate-500 font-mono">+91 {user.phone}</p>
                    {user.role === "admin" && (
                      <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Admin Role
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Vertical Navigation Links */}
              <nav className="mt-6 flex flex-col gap-1.5">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        active
                          ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-500"}`} />
                      {item.label}
                    </Link>
                  );
                })}

                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold bg-slate-900 text-white shadow-md hover:bg-slate-800 transition-all mt-2"
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Admin Dashboard
                  </Link>
                )}
              </nav>
            </div>

            {/* Bottom Actions: Login or Logout */}
            <div className="pt-6 border-t border-slate-100">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-sm transition-all"
                  id="panel-logout-button"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all"
                  id="panel-login-button"
                >
                  <User className="w-4 h-4" />
                  Login with Mobile OTP
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
