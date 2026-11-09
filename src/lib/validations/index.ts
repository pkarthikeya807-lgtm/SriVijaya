import { z } from "zod";

// Phone number regex for 10-digit Indian numbers (optionally starting with +91 or 0)
const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;

export const PhoneLoginSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid 10-digit Indian mobile number"),
});

export const OtpVerifySchema = z.object({
  phone: z.string().trim().min(10, "Phone number is required"),
  token: z
    .string()
    .trim()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain digits only"),
});

export const ServiceBookingSchema = z.object({
  customer_name: z.string().trim().min(2, "Customer name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid 10-digit mobile number"),
  vehicle_model: z.string().trim().min(2, "Vehicle model is required"),
  registration_number: z.string().trim().optional().or(z.literal("")),
  service_type_id: z.string().uuid("Please select a valid service type"),
  specifications: z.string().trim().min(5, "Please describe the issues or requirements in detail"),
  preferred_date: z.string().min(10, "Preferred service date is required"),
  vehicle_id: z.string().uuid().optional().nullable(),
  customer_vehicle_id: z.string().uuid().optional().nullable(),
});

export const VehicleSchema = z.object({
  brand_id: z.string().uuid("Please select a valid brand"),
  model_name: z.string().trim().min(2, "Model name is required"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  battery_capacity: z.string().trim().min(1, "Battery capacity is required"),
  claimed_range: z.string().trim().min(1, "Claimed range is required"),
  charging_time: z.string().trim().min(1, "Charging time is required"),
  motor_power: z.string().trim().min(1, "Motor power is required"),
  top_speed: z.string().trim().min(1, "Top speed is required"),
  colors: z.array(z.string()).min(1, "Provide at least one color option"),
  warranty: z.string().trim().min(1, "Warranty information is required"),
  image_urls: z.array(z.string().url()).min(1, "At least one image URL is required"),
  availability: z.enum(["In Stock", "Limited Stock", "Out of Stock", "Upcoming"]),
  featured: z.boolean().default(false),
});

export const ReviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5 stars"),
  review_text: z.string().trim().min(10, "Review must be at least 10 characters long").max(1000, "Review is too long"),
});

export const ServiceJobCardSchema = z.object({
  booking_id: z.string().uuid(),
  service_description: z.string().optional(),
  technician_notes: z.string().optional(),
  labor_charges: z.coerce.number().min(0, "Labor charge cannot be negative"),
  parts_charges: z.coerce.number().min(0, "Parts charge cannot be negative"),
  additional_charges: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
});

export const PaymentRecordSchema = z.object({
  invoice_id: z.string().uuid(),
  amount: z.coerce.number().positive("Payment amount must be greater than zero"),
  payment_method: z.enum(["Cash", "PhonePe", "Paytm", "Google Pay", "Razorpay", "Other"]),
  payment_provider: z.string().optional(),
  transaction_reference: z.string().optional(),
  notes: z.string().optional(),
});
