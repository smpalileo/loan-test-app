import { EmploymentStatus, LoanType } from "@/store/store";
import { z } from "zod";

export const CustomerInfoSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name is required." })
      .max(50, { message: "First name must be 50 characters or less." }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required." })
      .max(50, { message: "Last name must be 50 characters or less." }),
    email: z.string().email({ message: "Invalid email address." }),
    phoneNumber: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number." }),
    employmentStatus: z.enum(
      [
        EmploymentStatus.Employed,
        EmploymentStatus.SelfEmployed,
        EmploymentStatus.Unemployed,
      ],
      {
        required_error: "Please select an employment status.",
        invalid_type_error: "Please select a valid employment status.",
      },
    ),
    employerName: z
      .string()
      .max(100, { message: "Employer name must be 100 characters or less." })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.employmentStatus === EmploymentStatus.Employed &&
      (!data.employerName || data.employerName.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Employer name is required if you are employed.",
        path: ["employerName"],
      });
    }
  });

export const LoanDetailsSchema = z
  .object({
    loanAmount: z.coerce
      .number()
      .min(2000, { message: "Loan amount must be at least $2,000." })
      .max(1000000, { message: "Loan amount cannot exceed $1,000,000." }),
    loanType: z.enum(
      [
        LoanType.Vehicle,
        LoanType.HomeImprovement,
        LoanType.DebtConsolidation,
        LoanType.Business,
        LoanType.Personal,
      ],
      {
        required_error: "Please select a loan purpose.",
      },
    ),
    loanTerm: z.coerce
      .number()
      .min(1, { message: "Loan term must be at 1 year." })
      .max(7, { message: "Loan term cannot exceed 7 years." }),
    deposit: z.coerce
      .number()
      .nonnegative({ message: "Deposit amount cannot be negative." })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.loanType === LoanType.Vehicle) {
      // Ensure loanAmount is positive for this calculation; schema already enforces min 2000
      const loanAmount = data.loanAmount > 0 ? data.loanAmount : 0;
      const minDeposit = loanAmount * 0.2;
      if (
        data.deposit === undefined ||
        data.deposit === null ||
        data.deposit < minDeposit
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `For a car purchase, the deposit must be at least 20% of the loan amount (min. $${minDeposit.toFixed(
            2,
          )}).`,
          path: ["deposit"],
        });
      }
    }
  });

export const LoanOfferDto = z.object({
  id: z.coerce.number().min(1, { message: "id must be at least 1." }),
});
