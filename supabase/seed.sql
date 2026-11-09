-- ==========================================================
-- SRI VIJAYA EV BIKE SERVICES - SEED DATA
-- Default Business Settings, Brands, Vehicles, Service Types
-- ==========================================================

-- 1. Default Business Settings
INSERT INTO public.business_settings (id, business_name, address, phone, email, whatsapp_number, logo_url, opening_hours)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Sri Vijaya EV Bike Services',
    'D.No 48-14-3, Main Road, Beside RTC Complex, Visakhapatnam, Andhra Pradesh, India - 530016',
    '+91 98765 43210',
    'support@srivijayaevbikes.com',
    '+919876543210',
    '/images/logo.png',
    'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 2:00 PM'
) ON CONFLICT (id) DO UPDATE SET 
    business_name = EXCLUDED.business_name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone;

-- 2. Brands
INSERT INTO public.brands (id, name, logo_url, description) VALUES
('b0000000-0000-0000-0000-000000000001', 'Ather Energy', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&auto=format&fit=crop&q=80', 'Pioneering intelligent electric scooters with cutting-edge warp mode.'),
('b0000000-0000-0000-0000-000000000002', 'TVS Electric', 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=100&auto=format&fit=crop&q=80', 'Trusted Indian engineering crafted for everyday silent urban mobility.'),
('b0000000-0000-0000-0000-000000000003', 'Ola Electric', 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=100&auto=format&fit=crop&q=80', 'High-speed performance EV scooters with hypercharger ecosystem.'),
('b0000000-0000-0000-0000-000000000004', 'Bajaj Chetak', 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=100&auto=format&fit=crop&q=80', 'The iconic classic reimagined with seamless steel body and electric heart.'),
('b0000000-0000-0000-0000-000000000005', 'Hero Vida', 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=100&auto=format&fit=crop&q=80', 'Next-gen mobility with removable dual batteries and quick swap support.')
ON CONFLICT (name) DO NOTHING;

-- 3. Vehicles
INSERT INTO public.vehicles (
    id, brand_id, model_name, description, price, battery_capacity, 
    claimed_range, charging_time, motor_power, top_speed, 
    colors, warranty, image_urls, availability, featured
) VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Ather 450X Gen 3',
    'The pinnacle of performance electric commuting with Google Maps navigation, auto-hold, and Warp mode acceleration.',
    145000.00,
    '3.7 kWh Lithium-ion',
    '150 km per charge',
    '5 hrs 45 mins (Home) / 80% in 50 min (Fast)',
    '6.2 kW Peak PMSM Motor',
    '90 km/h',
    ARRAY['Space Grey', 'Lunar Grey', 'True Red', 'Salt Green'],
    '3 Years or 30,000 km on Battery & Vehicle',
    ARRAY[
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=1000&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    true
),
(
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000002',
    'TVS iQube S',
    'Comfortable, family-oriented electric scooter featuring a 7-inch TFT screen, flip key with torch, and silent ride.',
    132000.00,
    '3.4 kWh Lithium-ion IP67',
    '100 km per charge',
    '4 hrs 30 mins (650W Portable Charger)',
    '4.4 kW BLDC Hub Motor',
    '78 km/h',
    ARRAY['Mint Blue', 'Lucid Yellow', 'Mercury Grey', 'Copper Bronze'],
    '3 Years or 50,000 km Comprehensive Warranty',
    ARRAY[
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1000&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    true
),
(
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000003',
    'Ola S1 Pro Gen 2',
    'Ultra-fast futuristic electric scooter with 11 kW motor, cruise control, proximity unlock, and Party Mode audio.',
    139999.00,
    '4.0 kWh Lithium-ion',
    '195 km claimed (180 km TrueRange)',
    '6 hrs 30 mins (Home Standard)',
    '11 kW Mid-Drive IPM Motor',
    '120 km/h',
    ARRAY['Jet Black', 'Matt White', 'Stellar Blue', 'Amethyst'],
    '3 Years Unlimited km Battery Warranty',
    ARRAY[
        'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    true
),
(
    'c0000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000004',
    'Bajaj Chetak Premium',
    'Full metal body build with retro-modern aesthetic, seamless Bluetooth connectivity, and soft-touch switches.',
    124000.00,
    '3.2 kWh Lithium-ion IP67',
    '126 km per charge',
    '4 hrs 30 mins (800W Onboard Charger)',
    '4.2 kW Permanent Magnet Motor',
    '73 km/h',
    ARRAY['Indigo Metallic', 'Brooklyn Black', 'Hazelnut'],
    '3 Years or 50,000 km Warranty',
    ARRAY[
        'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1000&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false
),
(
    'c0000000-0000-0000-0000-000000000005',
    'b0000000-0000-0000-0000-000000000005',
    'Hero Vida V1 Pro',
    'Modular electric scooter with removable dual batteries for easy home charging in high-rise apartments.',
    128500.00,
    '3.94 kWh (Removable Dual Pack)',
    '165 km claimed',
    '5 hrs 15 mins (Dual Charger Home Pack)',
    '6.0 kW Peak Motor',
    '80 km/h',
    ARRAY['Matte White', 'Matte Sports Red', 'Matte Abrax Orange'],
    '5 Years or 50,000 km Vehicle Warranty',
    ARRAY[
        'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=1000&auto=format&fit=crop&q=80'
    ],
    'Limited Stock',
    true
)
ON CONFLICT (id) DO NOTHING;

-- 4. Service Types
INSERT INTO public.service_types (id, name, description, estimated_cost, is_active) VALUES
('d0000000-0000-0000-0000-000000000001', 'General Service', 'Comprehensive 36-point vehicle inspection, brake tuning, suspension check, and lubrication.', 699.00, true),
('d0000000-0000-0000-0000-000000000002', 'Battery Check & Diagnostics', 'Full battery health diagnostics, cell balancing, voltage test, and thermal management inspection.', 499.00, true),
('d0000000-0000-0000-0000-000000000003', 'Motor & Controller Check', 'Motor hub bearing test, BLDC/PMSM controller sensor calibration, and wiring verification.', 799.00, true),
('d0000000-0000-0000-0000-000000000004', 'Brake & Tire Service', 'Brake pad replacement, disc realignment, hydraulic fluid bleed, and tire pressure check.', 399.00, true),
('d0000000-0000-0000-0000-000000000005', 'Electrical Repair', 'Headlamp, indicator, digital console, throttle wiring, and 12V DC-DC converter diagnostics.', 549.00, true),
('d0000000-0000-0000-0000-000000000006', 'Vehicle Inspection & Certification', 'Pre-purchase or periodic EV safety health certification and range test.', 349.00, true)
ON CONFLICT (name) DO NOTHING;
