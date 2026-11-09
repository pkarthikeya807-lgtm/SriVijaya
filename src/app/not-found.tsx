import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
        <Zap className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">404 - Page Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested EV vehicle, service record, or page could not be located in our system.
        </p>
      </div>
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sri Vijaya EV Home
        </Link>
      </div>
    </div>
  );
}
