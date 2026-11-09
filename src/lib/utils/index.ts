import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return "-";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(dateString: string | Date): string {
  if (!dateString) return "-";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function generateBookingNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SV-BK-${Date.now().toString().slice(-4)}${randomSuffix}`;
}

export function generateInvoiceNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SV-INV-${Date.now().toString().slice(-4)}${randomSuffix}`;
}

export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
