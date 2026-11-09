"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { dataStore } from "@/lib/data/store";
import { formatINR, formatDate } from "@/lib/utils";
import { 
  Bike, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ArrowRight, 
  PlusCircle, 
  Calendar 
} from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(() => dataStore.getAdminStats());

  useEffect(() => {
    setStats(dataStore.getAdminStats());
  }, []);

  const summaryCards = [
    { title: "Total EV Inventory", value: stats.totalVehicles, icon: Bike, color: "text-emerald-600", bg: "bg-emerald-50", link: "/admin/vehicles" },
    { title: "Total Bookings", value: stats.totalBookings, icon: Wrench, color: "text-blue-600", bg: "bg-blue-50", link: "/admin/services" },
    { title: "Active Workshop Intake", value: stats.pendingServices, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", link: "/admin/services?status=Pending" },
    { title: "Completed Services", value: stats.completedServices, icon: CheckCircle2, color: "text-teal-600", bg: "bg-teal-50", link: "/admin/services?status=Completed" },
    { title: "Registered Customers", value: stats.totalCustomers, icon: Users, color: "text-purple-600", bg: "bg-purple-50", link: "/admin/services" },
    { title: "Pending Invoices", value: stats.pendingPayments, icon: CreditCard, color: "text-rose-600", bg: "bg-rose-50", link: "/admin/payments" },
    { title: "Realized Revenue", value: formatINR(stats.totalRevenue), icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-100/60", link: "/admin/payments" },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Showroom &amp; Service Center Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time workshop bay metrics, billing reconciliation, and vehicle availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/vehicles?action=new"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add New Vehicle
          </Link>
          <Link
            href="/admin/services?action=offline"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all"
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            Record Offline Job Card
          </Link>
        </div>
      </div>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.link}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 line-clamp-1">
                  {card.title}
                </span>
                <div className={`w-7 h-7 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {card.value}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Service Intake Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Service Bookings</h3>
            <p className="text-xs text-slate-500">Live feed of incoming customer requests &amp; job cards</p>
          </div>
          <Link
            href="/admin/services"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
          >
            View all bookings
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Booking #</th>
                <th className="py-3 px-6">Customer &amp; Phone</th>
                <th className="py-3 px-6">Vehicle Model</th>
                <th className="py-3 px-6">Source</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {stats.recentBookings.map((bk) => (
                <tr key={bk.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-6 font-mono font-bold text-emerald-800">
                    {bk.booking_number}
                  </td>
                  <td className="py-3 px-6">
                    <div className="font-bold text-slate-900">{bk.customer_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">+91 {bk.phone}</div>
                  </td>
                  <td className="py-3 px-6 font-medium text-slate-900">
                    {bk.vehicle_model}
                  </td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      bk.booking_source === "Online" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                    }`}>
                      {bk.booking_source}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-slate-500">
                    {formatDate(bk.preferred_date)}
                  </td>
                  <td className="py-3 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      bk.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : bk.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {bk.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right">
                    <Link
                      href={`/admin/services?id=${bk.id}`}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      Manage &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
