export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  created_at: string;
}

export interface Vehicle {
  id: string;
  brand_id: string;
  model_name: string;
  description: string;
  price: number;
  battery_capacity: string;
  claimed_range: string;
  charging_time: string;
  motor_power: string;
  top_speed: string;
  colors: string[];
  warranty: string;
  image_urls: string[];
  availability: 'In Stock' | 'Limited Stock' | 'Out of Stock' | 'Upcoming';
  featured?: boolean;
  created_at: string;
  updated_at: string;
  brand?: Brand;
}

export interface CustomerVehicle {
  id: string;
  customer_id: string;
  vehicle_id: string | null;
  custom_model_name?: string | null;
  registration_number: string;
  purchase_date: string | null;
  created_at: string;
  vehicle?: Vehicle;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  estimated_cost: number;
  is_active: boolean;
  created_at: string;
}

export type ServiceBookingStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

export interface ServiceBooking {
  id: string;
  booking_number: string;
  customer_id: string | null;
  customer_name: string;
  phone: string;
  vehicle_id: string | null;
  customer_vehicle_id: string | null;
  vehicle_model: string;
  registration_number: string | null;
  service_type_id: string;
  specifications: string;
  booking_source: 'Online' | 'Offline';
  status: ServiceBookingStatus;
  preferred_date: string;
  created_at: string;
  updated_at: string;
  service_type?: ServiceType;
  service_record?: ServiceRecord;
}

export interface ServiceRecord {
  id: string;
  booking_id: string;
  service_description: string | null;
  technician_notes: string | null;
  service_date: string;
  labor_charges: number;
  parts_charges: number;
  additional_charges: number;
  discount: number;
  total_amount: number;
  created_at: string;
  parts?: ServicePart[];
  invoice?: Invoice;
}

export interface ServicePart {
  id: string;
  service_record_id: string;
  part_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type PaymentStatus = 'Pending' | 'Paid' | 'Partially Paid' | 'Cancelled';

export interface Invoice {
  id: string;
  public_url_id?: string;
  invoice_number: string;
  service_record_id: string;
  customer_id: string | null;
  total_amount: number;
  payment_status: PaymentStatus;
  issue_date: string;
  due_date: string;
  created_at: string;
  service_record?: ServiceRecord;
  payments?: Payment[];
}

export type PaymentMethod = 'Cash' | 'PhonePe' | 'Paytm' | 'Google Pay' | 'Razorpay' | 'Other';

export interface Payment {
  id: string;
  invoice_id: string;
  customer_id: string | null;
  amount: number;
  payment_method: PaymentMethod;
  payment_provider: string | null;
  transaction_reference: string | null;
  payment_status: 'Pending' | 'Success' | 'Failed' | 'Refunded';
  paid_at: string;
  created_at: string;
}

export interface Review {
  id: string;
  customer_id: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  customer?: {
    full_name: string;
    phone: string;
  };
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  address: string;
  phone: string;
  email: string;
  whatsapp_number: string;
  logo_url: string | null;
  opening_hours: string;
  updated_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}
