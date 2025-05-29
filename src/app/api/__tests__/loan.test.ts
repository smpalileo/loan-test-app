import { POST as loanPostHandler } from "../loan/route";
import { NextRequest } from "next/server";
import { db } from "@/store/store";
import { LoanType } from "@/store/store";

jest.mock("@/store/store", () => {
  const originalModule = jest.requireActual("@/store/store");
  return {
    EmploymentStatus: originalModule.EmploymentStatus,
    LoanType: originalModule.LoanType,
    db: {
      customers: {
        insert: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
      },
      loans: {
        insert: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
      },
      lenders: {
        insert: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
      },
    },
  };
});

function createMockRequest(method: string, body?: unknown): NextRequest {
  const url = new URL("http://localhost:3000//api/loan");
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("POST /api/loan", () => {
  beforeEach(() => {
    (db.loans.insert as jest.Mock).mockReset();
  });

  it("should save valid loan details and return 201", async () => {
    const validLoanData = {
      loanAmount: 25000,
      loanType: LoanType.Vehicle,
      loanTerm: 5,
      deposit: 5000,
    };
    const mockInsertedLoan = { ...validLoanData, id: 1, customerId: 123 };
    (db.loans.insert as jest.Mock).mockReturnValue(mockInsertedLoan);

    const req = createMockRequest("POST", validLoanData);
    const response = await loanPostHandler(req);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(db.loans.insert).toHaveBeenCalledWith(validLoanData);
    expect(responseBody).toEqual({
      message: "Loan offer info saved",
      loan: mockInsertedLoan,
    });
  });

  it("should return 400 for invalid loan details (e.g., loanAmount too small)", async () => {
    const invalidLoanData = {
      loanAmount: 1000, // Too small, min is 2000
      loanType: LoanType.Personal,
      loanTerm: 3,
    };

    const req = createMockRequest("POST", invalidLoanData);
    const response = await loanPostHandler(req);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.errors).toBeDefined();
    expect(db.loans.insert).not.toHaveBeenCalled();
  });

  it("should return 500 if database insertion fails", async () => {
    const validLoanData = {
      loanAmount: 30000,
      loanType: LoanType.Business,
      loanTerm: 4,
    };
    (db.loans.insert as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });

    const req = createMockRequest("POST", validLoanData);
    const response = await loanPostHandler(req);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toEqual("Failed to process loan offer info");
  });
});
