import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Sri Vijaya EV Bike Services | Authorized Electric Bike Showroom & Service Center",
  description: "Explore cutting-edge electric bikes, book diagnostic service appointments online, check service history, and pay bills at Sri Vijaya EV Bike Services.",
  keywords: ["EV Bikes", "Electric Scooters", "EV Bike Service", "Battery Diagnostics", "Sri Vijaya EV", "Visakhapatnam EV"],
  openGraph: {
    title: "Sri Vijaya EV Bike Services",
    description: "Premium Electric Bike Showroom & Diagnostic Service Center",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="flex flex-col min-h-screen text-slate-900 bg-slate-50 antialiased selection:bg-emerald-500 selection:text-white">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
