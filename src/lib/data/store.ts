import { 
  Vehicle, Brand, ServiceType, ServiceBooking, 
  Invoice, Review, BusinessSettings, PaymentMethod 
} from "@/types/database";
import { generateBookingNumber, generateInvoiceNumber } from "@/lib/utils";

// Default In-Memory / Seed Database State for Immediate Demonstration and Resilient Fallback
let initialSettings: BusinessSettings = {
  id: "a0000000-0000-0000-0000-000000000001",
  business_name: "Sri Vijaya EV Bike Services",
  address: "D.No 48-14-3, Main Road, Beside RTC Complex, Visakhapatnam, Andhra Pradesh, India - 530016",
  phone: "+91 98765 43210",
  email: "support@srivijayaevbikes.com",
  whatsapp_number: "+919876543210",
  logo_url: "/images/logo.png",
  opening_hours: "Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 2:00 PM",
  updated_at: new Date().toISOString(),
};

let initialBrands: Brand[] = [
  { id: "b0000000-0000-0000-0000-000000000001", name: "Ather Energy", logo_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&auto=format&fit=crop&q=80", description: "Pioneering intelligent electric scooters with cutting-edge warp mode.", created_at: new Date().toISOString() },
  { id: "b0000000-0000-0000-0000-000000000002", name: "TVS Electric", logo_url: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=100&auto=format&fit=crop&q=80", description: "Trusted Indian engineering crafted for everyday silent urban mobility.", created_at: new Date().toISOString() },
  { id: "b0000000-0000-0000-0000-000000000003", name: "Ola Electric", logo_url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=100&auto=format&fit=crop&q=80", description: "High-speed performance EV scooters with hypercharger ecosystem.", created_at: new Date().toISOString() },
  { id: "b0000000-0000-0000-0000-000000000004", name: "Bajaj Chetak", logo_url: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=100&auto=format&fit=crop&q=80", description: "The iconic classic reimagined with seamless steel body and electric heart.", created_at: new Date().toISOString() },
  { id: "b0000000-0000-0000-0000-000000000005", name: "Hero Vida", logo_url: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=100&auto=format&fit=crop&q=80", description: "Next-gen mobility with removable dual batteries and quick swap support.", created_at: new Date().toISOString() }
];

let initialVehicles: Vehicle[] = [
  {
    id: "c0000000-0000-0000-0000-000000000001",
    brand_id: "b0000000-0000-0000-0000-000000000001",
    model_name: "Ather 450X Gen 3",
    description: "The pinnacle of performance electric commuting with Google Maps navigation, auto-hold, and Warp mode acceleration.",
    price: 145000,
    battery_capacity: "3.7 kWh Lithium-ion",
    claimed_range: "150 km per charge",
    charging_time: "5 hrs 45 mins (Home) / 80% in 50 min (Fast)",
    motor_power: "6.2 kW Peak PMSM Motor",
    top_speed: "90 km/h",
    colors: ["Space Grey", "Lunar Grey", "True Red", "Salt Green"],
    warranty: "3 Years or 30,000 km on Battery & Vehicle",
    image_urls: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=1000&auto=format&fit=crop&q=80"
    ],
    availability: "In Stock",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000002",
    brand_id: "b0000000-0000-0000-0000-000000000002",
    model_name: "TVS iQube S",
    description: "Comfortable, family-oriented electric scooter featuring a 7-inch TFT screen, flip key with torch, and silent ride.",
    price: 132000,
    battery_capacity: "3.4 kWh Lithium-ion IP67",
    claimed_range: "100 km per charge",
    charging_time: "4 hrs 30 mins (650W Portable Charger)",
    motor_power: "4.4 kW BLDC Hub Motor",
    top_speed: "78 km/h",
    colors: ["Mint Blue", "Lucid Yellow", "Mercury Grey", "Copper Bronze"],
    warranty: "3 Years or 50,000 km Comprehensive Warranty",
    image_urls: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1000&auto=format&fit=crop&q=80"
    ],
    availability: "In Stock",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000003",
    brand_id: "b0000000-0000-0000-0000-000000000003",
    model_name: "Ola S1 Pro Gen 2",
    description: "Ultra-fast futuristic electric scooter with 11 kW motor, cruise control, proximity unlock, and Party Mode audio.",
    price: 139999,
    battery_capacity: "4.0 kWh Lithium-ion",
    claimed_range: "195 km claimed (180 km TrueRange)",
    charging_time: "6 hrs 30 mins (Home Standard)",
    motor_power: "11 kW Mid-Drive IPM Motor",
    top_speed: "120 km/h",
    colors: ["Jet Black", "Matt White", "Stellar Blue", "Amethyst"],
    warranty: "3 Years Unlimited km Battery Warranty",
    image_urls: [
      "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000&auto=format&fit=crop&q=80"
    ],
    availability: "In Stock",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000004",
    brand_id: "b0000000-0000-0000-0000-000000000004",
    model_name: "Bajaj Chetak Premium",
    description: "Full metal body build with retro-modern aesthetic, seamless Bluetooth connectivity, and soft-touch switches.",
    price: 124000,
    battery_capacity: "3.2 kWh Lithium-ion IP67",
    claimed_range: "126 km per charge",
    charging_time: "4 hrs 30 mins (800W Onboard Charger)",
    motor_power: "4.2 kW Permanent Magnet Motor",
    top_speed: "73 km/h",
    colors: ["Indigo Metallic", "Brooklyn Black", "Hazelnut"],
    warranty: "3 Years or 50,000 km Warranty",
    image_urls: [
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1000&auto=format&fit=crop&q=80"
    ],
    availability: "In Stock",
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000005",
    brand_id: "b0000000-0000-0000-0000-000000000005",
    model_name: "Hero Vida V1 Pro",
    description: "Modular electric scooter with removable dual batteries for easy home charging in high-rise apartments.",
    price: 128500,
    battery_capacity: "3.94 kWh (Removable Dual Pack)",
    claimed_range: "165 km claimed",
    charging_time: "5 hrs 15 mins (Dual Charger Home Pack)",
    motor_power: "6.0 kW Peak Motor",
    top_speed: "80 km/h",
    colors: ["Matte White", "Matte Sports Red", "Matte Abrax Orange"],
    warranty: "5 Years or 50,000 km Vehicle Warranty",
    image_urls: [
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=1000&auto=format&fit=crop&q=80"
    ],
    availability: "Limited Stock",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let initialServiceTypes: ServiceType[] = [
  { id: "d0000000-0000-0000-0000-000000000001", name: "General Service", description: "Comprehensive 36-point vehicle inspection, brake tuning, suspension check, and lubrication.", estimated_cost: 699, is_active: true, created_at: new Date().toISOString() },
  { id: "d0000000-0000-0000-0000-000000000002", name: "Battery Check & Diagnostics", description: "Full battery health diagnostics, cell balancing, voltage test, and thermal management inspection.", estimated_cost: 499, is_active: true, created_at: new Date().toISOString() },
  { id: "d0000000-0000-0000-0000-000000000003", name: "Motor & Controller Check", description: "Motor hub bearing test, BLDC/PMSM controller sensor calibration, and wiring verification.", estimated_cost: 799, is_active: true, created_at: new Date().toISOString() },
  { id: "d0000000-0000-0000-0000-000000000004", name: "Brake & Tire Service", description: "Brake pad replacement, disc realignment, hydraulic fluid bleed, and tire pressure check.", estimated_cost: 399, is_active: true, created_at: new Date().toISOString() },
  { id: "d0000000-0000-0000-0000-000000000005", name: "Electrical Repair", description: "Headlamp, indicator, digital console, throttle wiring, and 12V DC-DC converter diagnostics.", estimated_cost: 549, is_active: true, created_at: new Date().toISOString() },
  { id: "d0000000-0000-0000-0000-000000000006", name: "Vehicle Inspection & Certification", description: "Pre-purchase or periodic EV safety health certification and range test.", estimated_cost: 349, is_active: true, created_at: new Date().toISOString() }
];

let initialBookings: ServiceBooking[] = [
  {
    id: "e0000000-0000-0000-0000-000000000001",
    booking_number: "SV-BK-9102",
    customer_id: "demo-customer-id",
    customer_name: "Ramesh Naidu",
    phone: "9876543211",
    vehicle_id: "c0000000-0000-0000-0000-000000000001",
    customer_vehicle_id: null,
    vehicle_model: "Ather 450X Gen 3",
    registration_number: "AP31-EV-1024",
    service_type_id: "d0000000-0000-0000-0000-000000000001",
    specifications: "Scheduled 10,000 km general service and brake lever squeaking noise check.",
    booking_source: "Online",
    status: "Completed",
    preferred_date: new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "e0000000-0000-0000-0000-000000000002",
    booking_number: "SV-BK-9103",
    customer_id: "demo-customer-id",
    customer_name: "Ramesh Naidu",
    phone: "9876543211",
    vehicle_id: "c0000000-0000-0000-0000-000000000002",
    customer_vehicle_id: null,
    vehicle_model: "TVS iQube S",
    registration_number: "AP31-EV-5582",
    service_type_id: "d0000000-0000-0000-0000-000000000002",
    specifications: "Battery range drops slightly faster on sports mode, requires diagnostics.",
    booking_source: "Online",
    status: "In Progress",
    preferred_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let initialInvoices: Invoice[] = [
  {
    id: "f0000000-0000-0000-0000-000000000001",
    invoice_number: "SV-INV-8021",
    service_record_id: "rec-001",
    customer_id: "demo-customer-id",
    total_amount: 1198,
    payment_status: "Paid",
    issue_date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    due_date: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    service_record: {
      id: "rec-001",
      booking_id: "e0000000-0000-0000-0000-000000000001",
      service_description: "General Service completed with brake pads cleaning and lubrication.",
      technician_notes: "Brake pads adjusted. Battery health is at 98%. Recommended tire pressure checked.",
      service_date: new Date(Date.now() - 3 * 86400000).toISOString(),
      labor_charges: 699,
      parts_charges: 499,
      additional_charges: 0,
      discount: 0,
      total_amount: 1198,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      parts: [
        { id: "part-1", service_record_id: "rec-001", part_name: "Ceramic Brake Pad Set", quantity: 1, unit_price: 499, total_price: 499 }
      ]
    },
    payments: [
      {
        id: "pay-1",
        invoice_id: "f0000000-0000-0000-0000-000000000001",
        customer_id: "demo-customer-id",
        amount: 1198,
        payment_method: "PhonePe",
        payment_provider: "PhonePe UPI",
        transaction_reference: "UPI/530291084201",
        payment_status: "Success",
        paid_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      }
    ]
  },
  {
    id: "f0000000-0000-0000-0000-000000000002",
    invoice_number: "SV-INV-8022",
    service_record_id: "rec-002",
    customer_id: "demo-customer-id",
    total_amount: 499,
    payment_status: "Pending",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    service_record: {
      id: "rec-002",
      booking_id: "e0000000-0000-0000-0000-000000000002",
      service_description: "Battery Diagnostics & Firmware Telemetry Scan",
      technician_notes: "Cell voltage balanced. BMS firmware updated to latest patch.",
      service_date: new Date().toISOString(),
      labor_charges: 499,
      parts_charges: 0,
      additional_charges: 0,
      discount: 0,
      total_amount: 499,
      created_at: new Date().toISOString(),
      parts: []
    },
    payments: []
  }
];

let initialReviews: Review[] = [
  {
    id: "rev-1",
    customer_id: "demo-customer-id",
    rating: 5,
    review_text: "Outstanding service at Sri Vijaya EV! They diagnosed my Ather 450X battery within 30 minutes and resolved the brake noise perfectly. Very transparent pricing.",
    is_approved: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    customer: { full_name: "Karthik Verma", phone: "9876543211" }
  },
  {
    id: "rev-2",
    customer_id: "demo-cust-2",
    rating: 5,
    review_text: "Purchased my TVS iQube from their showroom. The staff explained all the government subsidies and charging setups with genuine patience. Highly recommend!",
    is_approved: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    customer: { full_name: "Sneha Reddy", phone: "9876543222" }
  },
  {
    id: "rev-3",
    customer_id: "demo-cust-3",
    rating: 4,
    review_text: "Prompt service and honest mechanics. They don't push unnecessary part replacements. Clean lounge area while waiting as well.",
    is_approved: true,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    customer: { full_name: "Praveen Kumar", phone: "9876543233" }
  }
];

export const dataStore = {
  // Business Settings
  getBusinessSettings(): BusinessSettings {
    return initialSettings;
  },
  updateBusinessSettings(updates: Partial<BusinessSettings>): BusinessSettings {
    initialSettings = { ...initialSettings, ...updates, updated_at: new Date().toISOString() };
    return initialSettings;
  },

  // Brands
  getBrands(): Brand[] {
    return initialBrands;
  },

  // Vehicles
  getVehicles(filters?: { brand_id?: string; maxPrice?: number; search?: string }): Vehicle[] {
    let result = initialVehicles.map(v => ({
      ...v,
      brand: initialBrands.find(b => b.id === v.brand_id)
    }));

    if (filters?.brand_id) {
      result = result.filter(v => v.brand_id === filters.brand_id);
    }
    if (filters?.maxPrice) {
      result = result.filter(v => v.price <= filters.maxPrice!);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(v => 
        v.model_name.toLowerCase().includes(q) || 
        v.brand?.name.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
      );
    }
    return result;
  },

  getVehicleById(id: string): Vehicle | undefined {
    const v = initialVehicles.find(item => item.id === id);
    if (!v) return undefined;
    return {
      ...v,
      brand: initialBrands.find(b => b.id === v.brand_id)
    };
  },

  addVehicle(newVehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">): Vehicle {
    const vehicle: Vehicle = {
      ...newVehicle,
      id: `c0000000-0000-0000-0000-00000000000${initialVehicles.length + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    initialVehicles.unshift(vehicle);
    return vehicle;
  },

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | undefined {
    const index = initialVehicles.findIndex(v => v.id === id);
    if (index === -1) return undefined;
    initialVehicles[index] = {
      ...initialVehicles[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return initialVehicles[index];
  },

  deleteVehicle(id: string): boolean {
    const prevLen = initialVehicles.length;
    initialVehicles = initialVehicles.filter(v => v.id !== id);
    return initialVehicles.length < prevLen;
  },

  // Service Types
  getServiceTypes(): ServiceType[] {
    return initialServiceTypes.filter(s => s.is_active);
  },

  // Service Bookings
  getServiceBookings(filters?: { status?: string; phone?: string; search?: string }): ServiceBooking[] {
    let result = initialBookings.map(b => ({
      ...b,
      service_type: initialServiceTypes.find(st => st.id === b.service_type_id),
      service_record: initialInvoices.find(inv => inv.service_record?.booking_id === b.id)?.service_record
    }));

    if (filters?.status) {
      result = result.filter(b => b.status === filters.status);
    }
    if (filters?.phone) {
      result = result.filter(b => b.phone.includes(filters.phone!));
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(b => 
        b.booking_number.toLowerCase().includes(q) ||
        b.customer_name.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.vehicle_model.toLowerCase().includes(q)
      );
    }
    return result;
  },

  getServiceBookingById(id: string): ServiceBooking | undefined {
    const b = initialBookings.find(item => item.id === id || item.booking_number === id);
    if (!b) return undefined;
    return {
      ...b,
      service_type: initialServiceTypes.find(st => st.id === b.service_type_id),
      service_record: initialInvoices.find(inv => inv.service_record?.booking_id === b.id)?.service_record
    };
  },

  createServiceBooking(data: {
    customer_name: string;
    phone: string;
    vehicle_model: string;
    registration_number?: string | null;
    service_type_id: string;
    specifications: string;
    preferred_date: string;
    customer_id?: string | null;
    vehicle_id?: string | null;
    booking_source?: "Online" | "Offline";
  }): ServiceBooking {
    const newBooking: ServiceBooking = {
      id: `bk-${Date.now()}`,
      booking_number: generateBookingNumber(),
      customer_id: data.customer_id || "demo-customer-id",
      customer_name: data.customer_name,
      phone: data.phone,
      vehicle_id: data.vehicle_id || null,
      customer_vehicle_id: null,
      vehicle_model: data.vehicle_model,
      registration_number: data.registration_number || null,
      service_type_id: data.service_type_id,
      specifications: data.specifications,
      booking_source: data.booking_source || "Online",
      status: "Pending",
      preferred_date: data.preferred_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    initialBookings.unshift(newBooking);
    return newBooking;
  },

  updateBookingStatus(id: string, status: ServiceBooking["status"]): ServiceBooking | undefined {
    const booking = initialBookings.find(b => b.id === id || b.booking_number === id);
    if (!booking) return undefined;
    booking.status = status;
    booking.updated_at = new Date().toISOString();
    return booking;
  },

  // Invoices & Billing
  getInvoices(filters?: { customer_id?: string; status?: string; search?: string }): Invoice[] {
    let result = initialInvoices;
    if (filters?.customer_id) {
      result = result.filter(inv => inv.customer_id === filters.customer_id);
    }
    if (filters?.status) {
      result = result.filter(inv => inv.payment_status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(inv => inv.invoice_number.toLowerCase().includes(q));
    }
    return result;
  },

  getInvoiceById(id: string): Invoice | undefined {
    return initialInvoices.find(inv => inv.id === id || inv.invoice_number === id || inv.public_url_id === id);
  },

  generateInvoiceForBooking(bookingId: string, charges: {
    service_description: string;
    technician_notes?: string;
    labor_charges: number;
    parts_charges: number;
    additional_charges?: number;
    discount?: number;
    parts?: Array<{ part_name: string; quantity: number; unit_price: number }>;
  }): Invoice {
    const booking = initialBookings.find(b => b.id === bookingId || b.booking_number === bookingId);
    if (!booking) throw new Error("Booking not found");

    const recordId = `rec-${Date.now()}`;
    const invoiceId = `inv-${Date.now()}`;
    const totalAmount = charges.labor_charges + charges.parts_charges + (charges.additional_charges || 0) - (charges.discount || 0);

    const partsList = (charges.parts || []).map((p, idx) => ({
      id: `part-${Date.now()}-${idx}`,
      service_record_id: recordId,
      part_name: p.part_name,
      quantity: p.quantity,
      unit_price: p.unit_price,
      total_price: p.quantity * p.unit_price
    }));

    const newInvoice: Invoice = {
      id: invoiceId,
      public_url_id: `pub-${invoiceId}`,
      invoice_number: generateInvoiceNumber(),
      service_record_id: recordId,
      customer_id: booking.customer_id,
      total_amount: totalAmount,
      payment_status: "Pending",
      issue_date: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      service_record: {
        id: recordId,
        booking_id: booking.id,
        service_description: charges.service_description,
        technician_notes: charges.technician_notes || null,
        service_date: new Date().toISOString(),
        labor_charges: charges.labor_charges,
        parts_charges: charges.parts_charges,
        additional_charges: charges.additional_charges || 0,
        discount: charges.discount || 0,
        total_amount: totalAmount,
        created_at: new Date().toISOString(),
        parts: partsList
      },
      payments: []
    };

    initialInvoices.unshift(newInvoice);
    booking.status = "Completed";
    booking.updated_at = new Date().toISOString();
    return newInvoice;
  },

  recordPayment(invoiceId: string, paymentData: {
    amount: number;
    payment_method: PaymentMethod;
    payment_provider?: string;
    transaction_reference?: string;
  }): Invoice {
    const invoice = initialInvoices.find(inv => inv.id === invoiceId || inv.invoice_number === invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    const newPayment = {
      id: `pay-${Date.now()}`,
      invoice_id: invoice.id,
      customer_id: invoice.customer_id,
      amount: paymentData.amount,
      payment_method: paymentData.payment_method,
      payment_provider: paymentData.payment_provider || paymentData.payment_method,
      transaction_reference: paymentData.transaction_reference || `REC/${Date.now()}`,
      payment_status: "Success" as const,
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    if (!invoice.payments) invoice.payments = [];
    invoice.payments.push(newPayment);

    const totalPaid = invoice.payments.reduce((acc, p) => acc + p.amount, 0);
    if (totalPaid >= invoice.total_amount) {
      invoice.payment_status = "Paid";
    } else if (totalPaid > 0) {
      invoice.payment_status = "Partially Paid";
    }
    return invoice;
  },

  // Reviews
  getReviews(): Review[] {
    return initialReviews.filter(r => r.is_approved);
  },

  getAllReviewsForAdmin(): Review[] {
    return initialReviews;
  },

  addReview(data: { customer_name: string; phone: string; rating: number; review_text: string }): Review {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      customer_id: "demo-customer-id",
      rating: data.rating,
      review_text: data.review_text,
      is_approved: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer: {
        full_name: data.customer_name,
        phone: data.phone
      }
    };
    initialReviews.unshift(newReview);
    return newReview;
  },

  deleteReview(id: string): boolean {
    const prev = initialReviews.length;
    initialReviews = initialReviews.filter(r => r.id !== id);
    return initialReviews.length < prev;
  },

  // Admin Dashboard Overview Statistics
  getAdminStats() {
    const totalVehicles = initialVehicles.length;
    const totalBookings = initialBookings.length;
    const pendingServices = initialBookings.filter(b => b.status === "Pending" || b.status === "Confirmed" || b.status === "In Progress").length;
    const completedServices = initialBookings.filter(b => b.status === "Completed").length;
    const totalCustomers = new Set(initialBookings.map(b => b.phone)).size;
    const pendingPayments = initialInvoices.filter(i => i.payment_status !== "Paid").length;
    const totalRevenue = initialInvoices
      .filter(i => i.payment_status === "Paid")
      .reduce((sum, inv) => sum + inv.total_amount, 0);

    return {
      totalVehicles,
      totalBookings,
      pendingServices,
      completedServices,
      totalCustomers,
      pendingPayments,
      totalRevenue,
      recentBookings: initialBookings.slice(0, 5)
    };
  }
};
