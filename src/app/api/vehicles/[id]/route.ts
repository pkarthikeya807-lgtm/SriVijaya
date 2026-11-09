import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicle = dataStore.getVehicleById(id);
    if (!vehicle) {
      return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: vehicle });
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
    const updated = dataStore.updateVehicle(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = dataStore.deleteVehicle(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Vehicle removed successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
