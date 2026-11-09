"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { dataStore } from "@/lib/data/store";
import { Vehicle, Brand } from "@/types/database";
import { formatINR } from "@/lib/utils";
import { 
  Bike, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  X, 
  Check, 
  Sparkles, 
  Battery, 
  Gauge, 
  AlertCircle 
} from "lucide-react";

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [brandId, setBrandId] = useState("");
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(130000);
  const [batteryCapacity, setBatteryCapacity] = useState("");
  const [claimedRange, setClaimedRange] = useState("");
  const [chargingTime, setChargingTime] = useState("");
  const [motorPower, setMotorPower] = useState("");
  const [topSpeed, setTopSpeed] = useState("");
  const [colorsText, setColorsText] = useState("");
  const [warranty, setWarranty] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [availability, setAvailability] = useState<Vehicle["availability"]>("In Stock");
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setVehicles(dataStore.getVehicles());
    const bList = dataStore.getBrands();
    setBrands(bList);
    if (bList.length > 0 && !brandId) setBrandId(bList[0].id);
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setModelName("");
    setDescription("");
    setPrice(135000);
    setBatteryCapacity("3.5 kWh Lithium-ion");
    setClaimedRange("130 km per charge");
    setChargingTime("4 hrs 30 mins");
    setMotorPower("5.0 kW Peak");
    setTopSpeed("85 km/h");
    setColorsText("Matte Black, Cosmic Blue, Glacier White");
    setWarranty("3 Years or 40,000 km Warranty");
    setImageUrl("https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000&auto=format&fit=crop&q=80");
    setAvailability("In Stock");
    setFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setBrandId(v.brand_id);
    setModelName(v.model_name);
    setDescription(v.description);
    setPrice(v.price);
    setBatteryCapacity(v.battery_capacity);
    setClaimedRange(v.claimed_range);
    setChargingTime(v.charging_time);
    setMotorPower(v.motor_power);
    setTopSpeed(v.top_speed);
    setColorsText(v.colors.join(", "));
    setWarranty(v.warranty);
    setImageUrl(v.image_urls[0] || "");
    setAvailability(v.availability);
    setFeatured(!!v.featured);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const colorsArray = colorsText.split(",").map((c) => c.trim()).filter(Boolean);

    if (editingVehicle) {
      dataStore.updateVehicle(editingVehicle.id, {
        brand_id: brandId,
        model_name: modelName,
        description,
        price,
        battery_capacity: batteryCapacity,
        claimed_range: claimedRange,
        charging_time: chargingTime,
        motor_power: motorPower,
        top_speed: topSpeed,
        colors: colorsArray,
        warranty,
        image_urls: [imageUrl],
        availability,
        featured,
      });
    } else {
      dataStore.addVehicle({
        brand_id: brandId,
        model_name: modelName,
        description,
        price,
        battery_capacity: batteryCapacity,
        claimed_range: claimedRange,
        charging_time: chargingTime,
        motor_power: motorPower,
        top_speed: topSpeed,
        colors: colorsArray,
        warranty,
        image_urls: [imageUrl],
        availability,
        featured,
      });
    }

    setModalOpen(false);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this vehicle from the showroom catalog?")) return;
    dataStore.deleteVehicle(id);
    refreshData();
  };

  const filtered = vehicles.filter(
    (v) =>
      v.model_name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            EV Fleet &amp; Showroom Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage showroom electric bikes, technical specs, pricing, and availability.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all"
          id="add-new-vehicle-btn"
        >
          <Plus className="w-4 h-4" />
          Add EV Vehicle
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search models, brands..."
          className="w-full text-xs outline-none bg-transparent"
        />
      </div>

      {/* Vehicles Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 bg-slate-100">
              <Image
                src={v.image_urls[0] || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80"}
                alt={v.model_name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-bold text-slate-900">
                {v.brand?.name}
              </div>
              <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {v.availability}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{v.model_name}</h3>
                <p className="text-lg font-black text-emerald-700 mt-1">{formatINR(v.price)}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Range:</span>
                    <span className="font-semibold text-slate-800">{v.claimed_range}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Battery:</span>
                    <span className="font-semibold text-slate-800 truncate block">{v.battery_capacity}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(v)}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="p-2 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Add / Edit Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingVehicle ? "Edit EV Bike Specifications" : "Add New EV Bike to Catalog"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand *</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model Name *</label>
                  <input
                    type="text"
                    required
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="e.g. Ather 450X Apex"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Availability *</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as Vehicle["availability"])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Battery Capacity *</label>
                  <input
                    type="text"
                    required
                    value={batteryCapacity}
                    onChange={(e) => setBatteryCapacity(e.target.value)}
                    placeholder="e.g. 3.7 kWh Lithium-ion"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Claimed Range *</label>
                  <input
                    type="text"
                    required
                    value={claimedRange}
                    onChange={(e) => setClaimedRange(e.target.value)}
                    placeholder="e.g. 150 km per charge"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Charging Time *</label>
                  <input
                    type="text"
                    required
                    value={chargingTime}
                    onChange={(e) => setChargingTime(e.target.value)}
                    placeholder="e.g. 5 hrs 45 mins"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Motor Power *</label>
                  <input
                    type="text"
                    required
                    value={motorPower}
                    onChange={(e) => setMotorPower(e.target.value)}
                    placeholder="e.g. 6.2 kW Peak PMSM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Top Speed *</label>
                  <input
                    type="text"
                    required
                    value={topSpeed}
                    onChange={(e) => setTopSpeed(e.target.value)}
                    placeholder="e.g. 90 km/h"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Warranty *</label>
                  <input
                    type="text"
                    required
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="e.g. 3 Years or 30,000 km"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Available Colors (Comma separated)</label>
                <input
                  type="text"
                  value={colorsText}
                  onChange={(e) => setColorsText(e.target.value)}
                  placeholder="Space Grey, Lunar Grey, True Red"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL (Supabase Storage / Remote CDN)</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe key technology, ride modes, digital dash..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="featured-checkbox" className="font-semibold text-slate-700">
                  Feature on Homepage Showcase
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
