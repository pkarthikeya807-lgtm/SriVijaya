"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { dataStore } from "@/lib/data/store";
import { formatINR } from "@/lib/utils";
import { Search, SlidersHorizontal, ArrowRight, Zap, Battery, Gauge, RotateCcw } from "lucide-react";

export default function VehiclesPage() {
  const brands = useMemo(() => dataStore.getBrands(), []);
  const allVehicles = useMemo(() => dataStore.getVehicles(), []);

  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(160000);

  const filteredVehicles = useMemo(() => {
    return allVehicles.filter((v) => {
      const matchesBrand = selectedBrand === "all" || v.brand_id === selectedBrand;
      const matchesPrice = v.price <= maxPrice;
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        v.model_name.toLowerCase().includes(q) ||
        v.brand?.name.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q);
      return matchesBrand && matchesPrice && matchesSearch;
    });
  }, [allVehicles, selectedBrand, maxPrice, search]);

  const resetFilters = () => {
    setSearch("");
    setSelectedBrand("all");
    setMaxPrice(160000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Page Title */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
              Catalogue
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              EV Vehicles
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Compare verified electric scooters and motorcycles with genuine range and charging specifications.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              {filteredVehicles.length} Models Available
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by model, brand, or feature..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              id="vehicle-search-input"
            />
          </div>

          {/* Brand Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-700 font-medium"
              id="vehicle-brand-filter"
            >
              <option value="all">All Brands ({brands.length})</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="md:col-span-3 flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Max Budget:</span>
              <span className="text-emerald-700 font-bold">{formatINR(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="110000"
              max="160000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
              id="vehicle-price-range"
            />
          </div>
        </div>

        {/* Filter tags & Reset */}
        {(selectedBrand !== "all" || search !== "" || maxPrice < 160000) && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Filters active</span>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile Horizontal Carousel & Desktop Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <Zap className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No vehicles match your search criteria</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your brand selection, budget slider, or clear the search keywords.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div>
          {/* Mobile indicator for horizontal scroll */}
          <p className="md:hidden text-xs text-slate-400 font-medium flex items-center gap-1 mb-2">
            <span>👉 Swipe horizontally on mobile to browse all vehicles</span>
          </p>

          {/* Horizontally scrollable on mobile; responsive grid on md+ screens */}
          <div className="flex md:grid overflow-x-auto md:overflow-visible pb-4 md:pb-0 gap-6 no-scrollbar snap-x snap-mandatory md:snap-none md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Vehicle Image Banner */}
                <div className="relative h-56 sm:h-60 bg-slate-100 overflow-hidden">
                  <Image
                    src={vehicle.image_urls[0] || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80"}
                    alt={`${vehicle.brand?.name} ${vehicle.model_name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm">
                    {vehicle.brand?.name}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    {vehicle.availability}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {vehicle.model_name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {vehicle.description}
                    </p>
                  </div>

                  {/* Highlights Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Claimed Range</span>
                        <span className="font-bold text-slate-800 truncate block">{vehicle.claimed_range}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Top Speed</span>
                        <span className="font-bold text-slate-800 truncate block">{vehicle.top_speed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price and View Details Button */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                        Ex-Showroom Price
                      </span>
                      <span className="text-2xl font-extrabold text-slate-950">
                        {formatINR(vehicle.price)}
                      </span>
                    </div>

                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all"
                      id={`view-details-${vehicle.id}`}
                    >
                      View Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
