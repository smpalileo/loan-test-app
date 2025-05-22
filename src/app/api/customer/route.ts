import { NextRequest, NextResponse } from "next/server";
import { db } from "@/store/store";
import { CustomerInfoSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const customerInfoData = await req.json();
    const validation = CustomerInfoSchema.safeParse(customerInfoData);
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.errors },
        { status: 400 },
      );
    }
    db.customers.insert(customerInfoData);
    return NextResponse.json(
      { message: "Customer info saved" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error processing customer info:", error);
    return NextResponse.json(
      { error: "Failed to process customer info" },
      { status: 500 },
    );
  }
}
