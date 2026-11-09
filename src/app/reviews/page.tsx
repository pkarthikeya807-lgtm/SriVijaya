"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { Review } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { 
  Star, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Send, 
  User, 
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setReviews(dataStore.getReviews());
    if (user) {
      setCustomerName(user.full_name || "");
    }
  }, [user]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!user) {
      setErrorMsg("Please login to submit a verified customer review.");
      return;
    }

    if (reviewText.trim().length < 10) {
      setErrorMsg("Review text must be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName || user.full_name || "Customer",
          phone: user.phone,
          rating,
          review_text: reviewText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviews(dataStore.getReviews());
        setReviewText("");
        setSuccessMsg("Thank you! Your review has been published.");
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(data.error || "Failed to submit review");
      }
    } catch {
      setErrorMsg("Network error submitting review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReviews(dataStore.getReviews());
      }
    } catch {
      alert("Failed to delete review.");
    }
  };

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Heading & Ratings Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
            Testimonials
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Reviews &amp; Ratings
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real feedback from verified electric bike owners and service center patrons.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-3xl font-black text-slate-900">{averageRating}</div>
          <div>
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(Number(averageRating)) ? "fill-amber-400" : "text-slate-200"}`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Based on {reviews.length} verified reviews
            </span>
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            Share Your Experience
          </h3>
          {!user && (
            <Link
              href="/login"
              className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Sign in to write review
            </Link>
          )}
        </div>

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Display Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Naidu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                id="review-author-name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                    aria-label={`${star} star rating`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Review / Feedback
            </label>
            <textarea
              rows={3}
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell others about your bike purchase, service quality, battery diagnostics, or staff hospitality..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              id="review-text-input"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md transition-all"
              id="submit-review-btn"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Publishing..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          All Reviews ({reviews.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => {
            const isOwner = user && (user.phone === rev.customer?.phone || user.id === rev.customer_id);
            const isAdmin = user?.role === "admin";
            return (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(rev.created_at)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;{rev.review_text}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {rev.customer?.full_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {rev.customer?.full_name || "Verified Customer"}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {rev.customer?.phone ? `+91 ${rev.customer.phone.slice(0, 5)}*****` : "Verified Owner"}
                      </p>
                    </div>
                  </div>

                  {/* Edit/Delete options for owner or admin */}
                  {(isOwner || isAdmin) && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Review"
                        id={`delete-review-${rev.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
