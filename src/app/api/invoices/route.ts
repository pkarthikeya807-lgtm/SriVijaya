import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customer_id = searchParams.get("customer_id") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const invoices = dataStore.getInvoices({ customer_id, status, search });
    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { booking_id, ...charges } = body;
    if (!booking_id) {
      return NextResponse.json({ success: false, message: "booking_id is required" }, { status: 400 });
    }

    const created = dataStore.generateInvoiceForBooking(booking_id, charges);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
