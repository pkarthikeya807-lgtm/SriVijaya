import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { ServiceBookingSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const phone = searchParams.get("phone") || undefined;
    const search = searchParams.get("search") || undefined;

    const bookings = dataStore.getServiceBookings({ status, phone, search });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ServiceBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const created = dataStore.createServiceBooking(parsed.data);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
