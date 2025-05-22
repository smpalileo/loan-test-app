import { NextRequest, NextResponse } from "next/server";
import { db } from "@/store/store";
import { LoanDetailsSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const loanOfferData = await req.json();
    const validation = LoanDetailsSchema.safeParse(loanOfferData);
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.errors },
        { status: 400 },
      );
    }
    db.loans.insert(loanOfferData);
    return NextResponse.json(
      { message: "Loan offer info saved" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error processing loan offer info:", error);
    return NextResponse.json(
      { error: "Failed to process loan offer info" },
      { status: 500 },
    );
  }
}
