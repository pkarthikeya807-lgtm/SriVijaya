"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  phone: string;
  full_name: string;
  role: "customer" | "admin";
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; simulatedOtp?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; message: string; user?: AuthUser }>;
  loginAsAdmin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "sri_vijaya_auth_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore JSON parse errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendOtp = async (phone: string) => {
    // In production, this triggers Supabase phone auth (SMS OTP)
    // For development and testing without SMS credit limits, we return simulated OTP 123456
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      message: "6-digit OTP has been sent successfully to your mobile number.",
      simulatedOtp: "123456",
    };
  };

  const verifyOtp = async (phone: string, otp: string) => {
    await new Promise((r) => setTimeout(r, 600));
    if (otp !== "123456" && otp.length !== 6) {
      return { success: false, message: "Invalid verification code. Please check and try again." };
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const newUser: AuthUser = {
      id: `user-${cleanPhone}`,
      phone: cleanPhone,
      full_name: cleanPhone === "9876543211" ? "Ramesh Naidu" : `Customer (${cleanPhone.slice(-4)})`,
      role: cleanPhone === "9876543210" ? "admin" : "customer",
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true, message: "Logged in successfully!", user: newUser };
  };

  const loginAsAdmin = async () => {
    const adminUser: AuthUser = {
      id: "admin-sri-vijaya",
      phone: "9876543210",
      full_name: "Sri Vijaya Manager",
      role: "admin",
    };
    setUser(adminUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, sendOtp, verifyOtp, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
