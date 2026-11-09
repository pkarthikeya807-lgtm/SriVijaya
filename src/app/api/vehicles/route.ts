import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { VehicleSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brand_id = searchParams.get("brand_id") || undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const search = searchParams.get("search") || undefined;

    const vehicles = dataStore.getVehicles({ brand_id, maxPrice, search });
    return NextResponse.json({ success: true, data: vehicles });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = VehicleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const created = dataStore.addVehicle(parsed.data);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
