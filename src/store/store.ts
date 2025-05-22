export enum EmploymentStatus {
  Employed = "Employed",
  SelfEmployed = "Self-Employed",
  Unemployed = "Unemployed",
}

export enum LoanType {
  Vehicle = "Vehicle",
  HomeImprovement = "Home Improvement",
  DebtConsolidation = "Debt Consolidation",
  Business = "Business",
  Personal = "Personal",
}

export interface CustomerInfoRecord {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  employmentStatus: EmploymentStatus;
  employerName?: string; // Optional
}

export interface LoanDetailsRecord {
  id: number;
  customerId: number;
  loanType: LoanType;
  amount: number;
  deposit: number; // Will default to 0 if not provided on insert
  loanTerm: number; // Term in months
}

export interface LenderRecord {
  id: number;
  lenderName: string;
  interestRate: number;
  minLoanAmount?: number;
  maxLoanAmount?: number;
  minLoanTerm?: number;
  maxLoanTerm?: number;
  supportedLoanTypes?: LoanType[];
  fixedFees?: number;
  percentFees?: number;
}

export interface LenderOffer {
  id: string;
  lenderName: string;
  interestRate: number; // annual percentage
  apr: number; // annual percentage rate, including fees
  monthlyRepayment: number;
  totalFees: number;
  loanAmount: number;
  loanTerm: number; // in months
}

export interface LenderFilter {
  loanAmount?: number;
  loanType?: LoanType;
  loanTerm?: number;
}

const customerInfoTable: CustomerInfoRecord[] = [];
const loanDetailsTable: LoanDetailsRecord[] = [];
const lendersTable: LenderRecord[] = [];

let nextCustomerId = 1;
let nextLoanId = 1;
let nextLenderId = 1;

export const db = {
  customers: {
    insert: (
      customerData: Omit<CustomerInfoRecord, "id">,
    ): CustomerInfoRecord => {
      const newCustomer: CustomerInfoRecord = {
        ...customerData,
        id: nextCustomerId++,
      };
      customerInfoTable.push(newCustomer);
      return newCustomer;
    },
    findById: (id: number): CustomerInfoRecord | undefined => {
      return customerInfoTable.find((c) => c.id === id);
    },
    findAll: (): CustomerInfoRecord[] => {
      return [...customerInfoTable];
    },
  },
  loans: {
    insert: (
      loanData: Omit<LoanDetailsRecord, "id" | "deposit"> & {
        deposit?: number;
      },
    ): LoanDetailsRecord => {
      const newLoan: LoanDetailsRecord = {
        deposit: 0,
        ...loanData,
        id: nextLoanId++,
      };
      loanDetailsTable.push(newLoan);
      return newLoan;
    },
    findById: (id: number): LoanDetailsRecord | undefined => {
      return loanDetailsTable.find((l) => l.id === id);
    },
    findAll: (): LoanDetailsRecord[] => {
      return [...loanDetailsTable];
    },
  },
  lenders: {
    insert: (lenderData: Omit<LenderRecord, "id">): LenderRecord => {
      const newLender: LenderRecord = {
        ...lenderData,
        id: nextLenderId++,
      };
      lendersTable.push(newLender);
      return newLender;
    },
    findById: (id: number): LenderRecord | undefined => {
      return lendersTable.find((l) => l.id === id);
    },
    findAll: (filters?: LenderFilter): LenderRecord[] => {
      let filteredLenders = [...lendersTable];
      if (filters) {
        if (filters.loanAmount !== undefined) {
          filteredLenders = filteredLenders.filter(
            (lender) =>
              lender.maxLoanAmount !== undefined &&
              lender.maxLoanAmount >= filters.loanAmount! &&
              lender.minLoanAmount !== undefined &&
              lender.minLoanAmount <= filters.loanAmount!,
          );
        }
        if (filters.loanTerm !== undefined) {
          filteredLenders = filteredLenders.filter(
            (lender) =>
              lender.maxLoanTerm !== undefined &&
              lender.maxLoanTerm >= filters.loanTerm! &&
              lender.minLoanTerm !== undefined &&
              lender.minLoanTerm <= filters.loanTerm!,
          );
        }
        if (filters.loanType !== undefined) {
          filteredLenders = filteredLenders.filter(
            (lender) =>
              lender.supportedLoanTypes &&
              lender.supportedLoanTypes.includes(filters.loanType!),
          );
        }
      }
      return filteredLenders;
    },
  },
};

// default lenders for testing
// some data for min and max are intentionally out of our app's range, so we can simulate them possibly
// being able to offer those on their own platforms but still remain within our search filters
db.lenders.insert({
  lenderName: "Community Bank",
  interestRate: 0.02,
  supportedLoanTypes: [LoanType.DebtConsolidation, LoanType.HomeImprovement],
  minLoanAmount: 5000,
  maxLoanAmount: 250000,
  minLoanTerm: 12,
  maxLoanTerm: 72,
});
db.lenders.insert({
  lenderName: "Quick Loans Inc.",
  interestRate: 0.09,
  supportedLoanTypes: [LoanType.Personal, LoanType.Vehicle],
  minLoanAmount: 1000,
  maxLoanAmount: 60000,
  minLoanTerm: 6,
  maxLoanTerm: 48,
});
db.lenders.insert({
  lenderName: "National Credit",
  interestRate: 0.06,
  supportedLoanTypes: [LoanType.Personal, LoanType.Business, LoanType.Vehicle],
  minLoanAmount: 15000,
  maxLoanAmount: 750000,
  minLoanTerm: 24,
  maxLoanTerm: 96,
});
db.lenders.insert({
  lenderName: "Specialist Cars Finance",
  interestRate: 0.075,
  supportedLoanTypes: [LoanType.Vehicle],
  minLoanAmount: 3000,
  maxLoanAmount: 90000,
  minLoanTerm: 12,
  maxLoanTerm: 84,
});

db.lenders.insert({
  lenderName: "Affordable Finance Solutions",
  interestRate: 0.07,
  supportedLoanTypes: [LoanType.Personal, LoanType.DebtConsolidation],
  fixedFees: 50,
  percentFees: 0.01,
  minLoanAmount: 2000,
  maxLoanAmount: 40000,
  minLoanTerm: 12,
  maxLoanTerm: 60,
});

db.lenders.insert({
  lenderName: "Business Growth Partners",
  interestRate: 0.055,
  supportedLoanTypes: [LoanType.Business],
  fixedFees: 200,
  percentFees: 0.02,
  minLoanAmount: 25000,
  maxLoanAmount: 1000000,
  minLoanTerm: 18,
  maxLoanTerm: 120,
});

db.lenders.insert({
  lenderName: "Home Improvers United",
  interestRate: 0.04,
  supportedLoanTypes: [LoanType.HomeImprovement],
  fixedFees: 100,
  minLoanAmount: 7000,
  maxLoanAmount: 300000,
  minLoanTerm: 24,
  maxLoanTerm: 180,
});

db.lenders.insert({
  lenderName: "Flexible Auto Loans",
  interestRate: 0.085,
  supportedLoanTypes: [LoanType.Vehicle],
  fixedFees: 25,
  percentFees: 0.015,
  minLoanAmount: 2000,
  maxLoanAmount: 75000,
  minLoanTerm: 12,
  maxLoanTerm: 84,
});

console.log("Total lenders populated:", db.lenders.findAll().length);
