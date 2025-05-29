import { db, LenderOffer } from "@/store/store";

const calculateMonthlyPayment = (
  loanAmount: number,
  interestRate: number,
  loanTerm: number,
): number => {
  const monthlyInterestRate = interestRate / 12 / 100; // Convert annual rate to monthly and percentage to decimal
  const numberOfPayments = loanTerm * 12; // Convert term in years to number of monthly payments
  // Calculate monthly payment using the formula
  const monthlyPayment =
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
  return monthlyPayment;
};

export async function getLoanOffers(
  id: number,
): Promise<
  | { success: true; data: LenderOffer[] }
  | { success: false; error: string; data: never[] }
> {
  const loan = db.loans.findById(id);

  if (!loan) {
    return { success: false, error: "Loan not found", data: [] };
  } else {
    const { loanAmount, loanType, loanTerm } = loan;
    const simulatedOffers: LenderOffer[] = [];

    const lenders = db.lenders.findAll({ loanAmount, loanType, loanTerm });

    lenders.forEach((lender) => {
      let currentRate = lender.interestRate;

      if (loanAmount > 50000) currentRate -= 0.2;
      if (loanAmount < 10000) currentRate += 0.1;
      if (loanTerm >= 48) currentRate += 0.15;
      if (loanTerm <= 24) currentRate -= 0.1;

      const percentFees = ((lender.percentFees ?? 0) * loanAmount) / 100;
      const fixedFees = lender.fixedFees ?? 0;
      const totalFees = percentFees + fixedFees;
      const monthlyRepayment = calculateMonthlyPayment(
        loanAmount,
        currentRate,
        loanTerm,
      );
      const apr =
        currentRate +
        (((totalFees / loanAmount) * 100) / (loanTerm / 12)) * 0.5;
      console.log("apr:", apr);

      simulatedOffers.push({
        id: lender.id + "_" + Date.now(),
        lenderName: lender.lenderName,
        interestRate: parseFloat(currentRate.toFixed(2)),
        apr: parseFloat(apr.toFixed(2)),
        monthlyRepayment: parseFloat(monthlyRepayment.toFixed(2)),
        totalFees: parseFloat(totalFees.toFixed(2)),
        loanAmount: loanAmount,
        loanTerm: loanTerm,
      });
    });

    console.table(simulatedOffers);

    return { success: true, data: simulatedOffers };
  }
}
