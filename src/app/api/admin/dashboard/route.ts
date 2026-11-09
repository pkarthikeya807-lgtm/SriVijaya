import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export async function GET() {
  try {
    const stats = dataStore.getAdminStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
