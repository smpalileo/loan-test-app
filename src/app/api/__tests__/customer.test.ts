import { POST as customerPostHandler } from "../customer/route";
import { NextRequest } from "next/server";
import { db } from "@/store/store";
import { EmploymentStatus } from "@/store/store";

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
  const url = new URL("http://localhost:3000/api/customer");
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("POST /api/customer", () => {
  beforeEach(() => {
    (db.customers.insert as jest.Mock).mockReset();
  });

  it("should save valid customer info and return 201", async () => {
    const validCustomerData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "+11234567890",
      employmentStatus: EmploymentStatus.Employed,
      employerName: "Example Corp",
    };
    const mockInsertedCustomer = { ...validCustomerData, id: 1 };
    (db.customers.insert as jest.Mock).mockReturnValue(mockInsertedCustomer);

    const req = createMockRequest("POST", validCustomerData);
    const response = await customerPostHandler(req);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(db.customers.insert).toHaveBeenCalledWith(validCustomerData);
    expect(responseBody).toEqual({
      message: "Customer info saved",
      customer: mockInsertedCustomer,
    });
  });

  it("should return 400 for invalid customer info (e.g., missing email)", async () => {
    const invalidCustomerData = {
      firstName: "Jane",
      lastName: "Doe",
      // email is missing
      phoneNumber: "+19876543210",
      employmentStatus: EmploymentStatus.SelfEmployed,
    };

    const req = createMockRequest("POST", invalidCustomerData);
    const response = await customerPostHandler(req);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.errors).toBeDefined();
    expect(db.customers.insert).not.toHaveBeenCalled();
  });

  it("should return 500 if database insertion fails", async () => {
    const validCustomerData = {
      firstName: "Jim",
      lastName: "Beam",
      email: "jim.beam@example.com",
      phoneNumber: "+11234567891",
      employmentStatus: EmploymentStatus.Unemployed,
    };
    (db.customers.insert as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });

    const req = createMockRequest("POST", validCustomerData);
    const response = await customerPostHandler(req);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toEqual("Failed to process customer info");
  });
});
