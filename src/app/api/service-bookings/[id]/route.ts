import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = dataStore.getServiceBookingById(id);
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = dataStore.updateBookingStatus(id, body.status);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
