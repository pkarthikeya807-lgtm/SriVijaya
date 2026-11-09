import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { ReviewSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forAdmin = searchParams.get("admin") === "true";

    const reviews = forAdmin ? dataStore.getAllReviewsForAdmin() : dataStore.getReviews();
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const review = dataStore.addReview({
      customer_name: body.customer_name || "Customer",
      phone: body.phone || "9876543210",
      rating: parsed.data.rating,
      review_text: parsed.data.review_text,
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Review ID required" }, { status: 400 });
    }

    const deleted = dataStore.deleteReview(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
