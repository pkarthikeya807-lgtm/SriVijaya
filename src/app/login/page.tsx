"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { Zap, Phone, Lock, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, sendOtp, verifyOtp, loginAsAdmin } = useAuth();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // If already logged in
  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Already Signed In</h2>
          <p className="text-sm text-slate-600">
            Welcome back, <strong className="text-emerald-700">{user.full_name}</strong> ({user.phone})
          </p>
          <span className="inline-block mt-2 text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase">
            Role: {user.role}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {user.role === "admin" ? (
            <button
              onClick={() => router.push("/admin")}
              className="bg-slate-900 text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-slate-800 text-sm shadow-sm"
            >
              Go to Admin Dashboard
            </button>
          ) : (
            <button
              onClick={() => router.push("/services")}
              className="bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-emerald-700 text-sm shadow-sm"
            >
              Book a Service
            </button>
          )}
          <button
            onClick={() => router.push("/history")}
            className="border border-slate-200 text-slate-700 font-semibold py-2.5 px-6 rounded-xl hover:bg-slate-50 text-sm"
          >
            View History
          </button>
        </div>
      </div>
    );
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const clean = phone.replace(/[^0-9]/g, "");
    if (clean.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(clean);
      if (res.success) {
        setStep("otp");
        setInfoMessage(`Code sent to +91 ${clean}. Demo OTP is: ${res.simulatedOtp || "123456"}`);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Failed to request OTP. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length < 6) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(phone, otp);
      if (res.success && res.user) {
        if (res.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/services");
        }
      } else {
        setError(res.message);
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Login
          </h1>
          <p className="text-xs text-slate-500">
            Access your registered electric vehicles, service bookings, and digital bills.
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}
        {infoMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
            {infoMessage}
          </div>
        )}

        {/* Step 1: Phone Input */}
        {step === "phone" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium tracking-wide bg-slate-50/50"
                  id="login-phone-input"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                We will send a 6-digit one-time password (OTP) via SMS.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md shadow-emerald-600/20 transition-all"
              id="send-otp-button"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP Code
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Input */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Enter 6-Digit OTP
                </label>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-[11px] font-semibold text-emerald-600 hover:underline"
                >
                  Change Number
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  id="login-otp-input"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                Didn&apos;t receive it?{" "}
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md shadow-emerald-600/20 transition-all"
              id="verify-otp-button"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify &amp; Login
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Development & Demo Testing Helper */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <p className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider">
            Quick Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setPhone("9876543211");
                setStep("otp");
                setOtp("123456");
                setInfoMessage("Pre-filled Customer: Ramesh Naidu (Phone: 9876543211, OTP: 123456)");
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-700 text-left transition-colors"
            >
              <span className="font-bold block text-slate-900">Customer Demo</span>
              <span className="text-[10px] text-slate-500 font-mono">9876543211</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await loginAsAdmin();
                router.push("/admin");
              }}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white hover:bg-slate-800 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold block text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Demo
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Manager Role</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
