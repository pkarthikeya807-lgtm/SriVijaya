-- ==========================================================
-- SRI VIJAYA EV BIKE SERVICES - DATABASE MIGRATION
-- Schema Definition with Row-Level Security (RLS) & Indexes
-- ==========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, role)
);

-- 3. BRANDS TABLE
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
    model_name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    battery_capacity TEXT NOT NULL,
    claimed_range TEXT NOT NULL,
    charging_time TEXT NOT NULL,
    motor_power TEXT NOT NULL,
    top_speed TEXT NOT NULL,
    colors TEXT[] DEFAULT '{}',
    warranty TEXT NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    availability TEXT NOT NULL DEFAULT 'In Stock' CHECK (availability IN ('In Stock', 'Limited Stock', 'Out of Stock', 'Upcoming')),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. CUSTOMER REGISTERED VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.customer_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    custom_model_name TEXT,
    registration_number TEXT NOT NULL,
    purchase_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. SERVICE TYPES TABLE
CREATE TABLE IF NOT EXISTS public.service_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. SERVICE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.service_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    customer_vehicle_id UUID REFERENCES public.customer_vehicles(id) ON DELETE SET NULL,
    vehicle_model TEXT NOT NULL,
    registration_number TEXT,
    service_type_id UUID REFERENCES public.service_types(id) ON DELETE RESTRICT,
    specifications TEXT NOT NULL,
    booking_source TEXT NOT NULL DEFAULT 'Online' CHECK (booking_source IN ('Online', 'Offline')),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled')),
    preferred_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_service_bookings_updated_at
BEFORE UPDATE ON public.service_bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. SERVICE RECORDS (JOB CARDS)
CREATE TABLE IF NOT EXISTS public.service_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.service_bookings(id) ON DELETE CASCADE,
    service_description TEXT,
    technician_notes TEXT,
    service_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    labor_charges NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    parts_charges NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    additional_charges NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    total_amount NUMERIC(10, 2) GENERATED ALWAYS AS (labor_charges + parts_charges + additional_charges - discount) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. SERVICE PARTS TABLE
CREATE TABLE IF NOT EXISTS public.service_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_record_id UUID NOT NULL REFERENCES public.service_records(id) ON DELETE CASCADE,
    part_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_price NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- 10. INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_url_id UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    invoice_number TEXT NOT NULL UNIQUE,
    service_record_id UUID NOT NULL REFERENCES public.service_records(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Partially Paid', 'Cancelled')),
    issue_date DATE DEFAULT CURRENT_DATE NOT NULL,
    due_date DATE DEFAULT (CURRENT_DATE + INTERVAL '7 days') NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'PhonePe', 'Paytm', 'Google Pay', 'Razorpay', 'Other')),
    payment_provider TEXT,
    transaction_reference TEXT,
    payment_status TEXT NOT NULL DEFAULT 'Success' CHECK (payment_status IN ('Pending', 'Success', 'Failed', 'Refunded')),
    paid_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL DEFAULT 'Sri Vijaya EV Bike Services',
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    logo_url TEXT,
    opening_hours TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 14. ADMIN ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view & update their own; Admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());

-- User Roles: Read own role; Admins manage roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.is_admin());

-- Brands & Vehicles & Service Types & Business Settings: Public Read; Admin Full Write
CREATE POLICY "Public read brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admin write brands" ON public.brands FOR ALL USING (public.is_admin());

CREATE POLICY "Public read vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Admin write vehicles" ON public.vehicles FOR ALL USING (public.is_admin());

CREATE POLICY "Public read service types" ON public.service_types FOR SELECT USING (true);
CREATE POLICY "Admin write service types" ON public.service_types FOR ALL USING (public.is_admin());

CREATE POLICY "Public read business settings" ON public.business_settings FOR SELECT USING (true);
CREATE POLICY "Admin write business settings" ON public.business_settings FOR ALL USING (public.is_admin());

-- Customer Vehicles: Customers manage own vehicles; Admins can view/manage
CREATE POLICY "Customer can view own vehicles" ON public.customer_vehicles FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Customer can insert own vehicles" ON public.customer_vehicles FOR INSERT WITH CHECK (auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Customer can update own vehicles" ON public.customer_vehicles FOR UPDATE USING (auth.uid() = customer_id OR public.is_admin());

-- Service Bookings: Customers can view/insert own bookings; Admins full control
CREATE POLICY "Customer can view own bookings" ON public.service_bookings FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Customer can create booking" ON public.service_bookings FOR INSERT WITH CHECK (auth.uid() = customer_id OR customer_id IS NULL OR public.is_admin());
CREATE POLICY "Admins manage bookings" ON public.service_bookings FOR ALL USING (public.is_admin());

-- Service Records & Parts & Invoices & Payments: Customers view own; Admins manage
CREATE POLICY "Customer view own service records" ON public.service_records FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.service_bookings sb WHERE sb.id = public.service_records.booking_id AND (sb.customer_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Admins manage service records" ON public.service_records FOR ALL USING (public.is_admin());

CREATE POLICY "Customer view own service parts" ON public.service_parts FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.service_records sr
        JOIN public.service_bookings sb ON sb.id = sr.booking_id
        WHERE sr.id = public.service_parts.service_record_id AND (sb.customer_id = auth.uid() OR public.is_admin())
    )
);
CREATE POLICY "Admins manage service parts" ON public.service_parts FOR ALL USING (public.is_admin());

CREATE POLICY "Customer view own invoices" ON public.invoices FOR SELECT USING (auth.uid() = customer_id OR public.is_admin() OR public_url_id IS NOT NULL);
CREATE POLICY "Admins manage invoices" ON public.invoices FOR ALL USING (public.is_admin());

CREATE POLICY "Customer view own payments" ON public.payments FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL USING (public.is_admin());

-- Reviews: Public view approved; Customer can insert/update/delete own; Admin can delete any
CREATE POLICY "Public can view approved reviews" ON public.reviews FOR SELECT USING (is_approved = true OR auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Authenticated customer insert review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customer edit own review" ON public.reviews FOR UPDATE USING (auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Customer delete own review" ON public.reviews FOR DELETE USING (auth.uid() = customer_id OR public.is_admin());

-- Admin Activity Logs: Only Admins
CREATE POLICY "Admins view and insert logs" ON public.admin_activity_logs FOR ALL USING (public.is_admin());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_brand_id ON public.vehicles(brand_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_customer_id ON public.service_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON public.service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_service_bookings_phone ON public.service_bookings(phone);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
