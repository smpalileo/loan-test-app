import { LoanOfferDto } from "@/lib/schema";
import { getLoanOffers } from "../../services/offers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    const validation = LoanOfferDto.safeParse({ id });
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.errors },
        { status: 400 },
      );
    }
    const offers = await getLoanOffers(validation.data.id);
    return NextResponse.json({ offers });
  } catch (error) {
    console.error("Error fetching loan offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch loan offers" },
      { status: 500 },
    );
  }
}
