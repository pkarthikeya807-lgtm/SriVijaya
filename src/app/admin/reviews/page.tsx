"use client";

import React, { useState, useEffect } from "react";
import { dataStore } from "@/lib/data/store";
import { Review } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { Star, Trash2, Search, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setReviews(dataStore.getAllReviewsForAdmin());
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete and unpublish this review?")) return;
    dataStore.deleteReview(id);
    refreshData();
  };

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.review_text.toLowerCase().includes(q) ||
      r.customer?.full_name?.toLowerCase().includes(q) ||
      r.customer?.phone?.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Customer Reviews Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit customer feedback, star ratings, and remove spam or inappropriate submissions.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, phone, or comment text..."
          className="w-full text-xs outline-none bg-transparent"
        />
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Customer &amp; Phone</th>
                <th className="py-3 px-6">Rating</th>
                <th className="py-3 px-6">Review Content</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-6">
                    <span className="font-bold text-slate-900 block">{rev.customer?.full_name || "Customer"}</span>
                    <span className="text-[11px] text-slate-400 font-mono">+91 {rev.customer?.phone || "-"}</span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-6 max-w-md">
                    <p className="line-clamp-2 text-slate-600">{rev.review_text}</p>
                  </td>
                  <td className="py-3 px-6 text-slate-500 whitespace-nowrap">
                    {formatDate(rev.created_at)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-[10px] inline-flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete Review
                    </button>
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
