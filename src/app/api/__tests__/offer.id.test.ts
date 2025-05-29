import { GET as offerGetHandler } from "../offer/[id]/route";
import { getLoanOffers } from "@/app/services/offers";
import { LenderOffer } from "@/store/store";

jest.mock("@/app/services/offers", () => ({
  getLoanOffers: jest.fn(),
}));

describe("GET /api/offer/:id", () => {
  beforeEach(() => {
    (getLoanOffers as jest.Mock).mockReset();
  });

  it("should return loan offers for a valid ID and return 200", async () => {
    const mockLoanId = 123;
    const mockOffers: LenderOffer[] = [
      {
        id: "offer-1",
        lenderName: "Test Lender A",
        interestRate: 5.5,
        apr: 5.75,
        monthlyRepayment: 500,
        totalFees: 200,
        loanAmount: 25000,
        loanTerm: 5,
      },
    ];
    (getLoanOffers as jest.Mock).mockResolvedValue(mockOffers);

    const mockRequest = new Request(
      `http://localhost:3000/api/offer/${mockLoanId}`,
    );
    const response = await offerGetHandler(mockRequest, {
      params: { id: mockLoanId.toString() },
    });
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(getLoanOffers).toHaveBeenCalledWith(mockLoanId);
    expect(responseBody).toEqual(mockOffers);
  });

  it("should return 400 for an invalid ID (non-numeric)", async () => {
    const invalidId = "abc";
    const mockRequest = new Request(
      `http://localhost:3000/api/offer/${invalidId}`,
    );
    const response = await offerGetHandler(mockRequest, {
      params: { id: invalidId },
    });
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.errors).toBeDefined();
    expect(getLoanOffers).not.toHaveBeenCalled();
  });

  it("should return 400 for an ID that is zero (fails min(1) validation)", async () => {
    const zeroId = "0";
    const mockRequest = new Request(
      `http://localhost:3000/api/offer/${zeroId}`,
    );
    const response = await offerGetHandler(mockRequest, {
      params: { id: zeroId },
    });
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.errors).toBeDefined();
    expect(getLoanOffers).not.toHaveBeenCalled();
  });

  it("should return 500 if getLoanOffers service fails", async () => {
    const mockLoanId = 456;
    (getLoanOffers as jest.Mock).mockRejectedValue(new Error("Service error"));

    const mockRequest = new Request(
      `http://localhost:3000/api/offer/${mockLoanId}`,
    );
    const response = await offerGetHandler(mockRequest, {
      params: { id: mockLoanId.toString() },
    });
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toEqual("Failed to fetch loan offers");
  });
});
