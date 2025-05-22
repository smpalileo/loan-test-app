import { NextRequest, NextResponse } from "next/server";
import { db } from "@/store/store";
import { LoanDetailsSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const loanDetailsData = await req.json();
    const validation = LoanDetailsSchema.safeParse(loanDetailsData);
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.errors },
        { status: 400 },
      );
    }
    db.loans.insert(loanDetailsData);
    return NextResponse.json(
      { message: "Loan offer info saved", loan: loanDetailsData },
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

/**
 * {
  "loanAmount": 20000,
  "loanType": "Vehicle",
  "loanTerm": 48,
  "depositAmount": 4500
}
 */
