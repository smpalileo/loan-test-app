"use client";

import { useState } from "react";
import {
  CustomerInfoForm,
  CustomerInfoFormData,
} from "@/components/CustomerInfoForm";
import {
  LoanDetailsForm,
  LoanDetailsFormData,
} from "@/components/LoanDetailsForm";

type FormStep = "customerInfo" | "loanDetails" | "summary"; // Added summary for potential next step

export default function LoanApplicationPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>("customerInfo");
  const [customerInfoData, setCustomerInfoData] = useState<
    Partial<CustomerInfoFormData>
  >({});
  const [loanDetailsData, setLoanDetailsData] = useState<
    Partial<LoanDetailsFormData>
  >({});

  const handleCustomerInfoSubmit = (data: CustomerInfoFormData) => {
    console.log("Customer Info:", data);
    setCustomerInfoData(data);
    setCurrentStep("loanDetails");
  };

  const handleLoanDetailsSubmit = (data: LoanDetailsFormData) => {
    console.log("Loan Details:", data);
    setLoanDetailsData(data);
    // Here you would typically proceed to a summary, API submission, etc.
    // For now, let's just log and maybe go to a 'summary' step if you add one.
    setCurrentStep("summary");
    alert("Application data collected! Check console for details.");
  };

  const handleBackToCustomerInfo = () => {
    setCurrentStep("customerInfo");
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Loan Application</h1>

      {currentStep === "customerInfo" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Step 1: Your Information
          </h2>
          <CustomerInfoForm
            onSubmit={handleCustomerInfoSubmit}
            defaultValues={customerInfoData}
          />
        </div>
      )}

      {currentStep === "loanDetails" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Step 2: Loan Details</h2>
          <LoanDetailsForm
            onSubmit={handleLoanDetailsSubmit}
            defaultValues={loanDetailsData}
          />
          <button
            onClick={handleBackToCustomerInfo}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            &larr; Back to Customer Information
          </button>
        </div>
      )}

      {currentStep === "summary" && (
        <div className="text-center p-6 bg-green-50 border border-green-200 rounded-md">
          <h2 className="text-2xl font-semibold text-green-700">
            Application Submitted!
          </h2>
          <p className="mt-2 text-gray-600">
            Thank you. We have received your information.
          </p>
          <p className="mt-1 text-xs text-gray-500">(Data logged to console)</p>
        </div>
      )}
    </div>
  );
}
