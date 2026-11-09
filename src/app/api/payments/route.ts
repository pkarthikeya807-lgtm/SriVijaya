import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { PaymentRecordSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = PaymentRecordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const { invoice_id, amount, payment_method, payment_provider, transaction_reference } = parsed.data;
    const updatedInvoice = dataStore.recordPayment(invoice_id, {
      amount,
      payment_method,
      payment_provider,
      transaction_reference,
    });

    return NextResponse.json({ success: true, data: updatedInvoice });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
