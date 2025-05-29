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
import { OffersDisplay } from "@/components/OffersDisplay";
import axios from "axios";
import { LenderOffer } from "@/store/store";

type FormStep = "customerInfo" | "loanDetails" | "offers" | "submissionError";

export default function LoanApplicationPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>("customerInfo");
  const [customerInfoData, setCustomerInfoData] = useState<
    Partial<CustomerInfoFormData>
  >({});
  const [loanDetailsData, setLoanDetailsData] = useState<
    Partial<LoanDetailsFormData>
  >({});
  const [offers, setOffers] = useState<LenderOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCustomerInfoSubmit = async (data: CustomerInfoFormData) => {
    console.log("Customer Info:", data);
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${window.location.href}api/customer`,
        data,
      );
      console.log("API Response (Customer Info):", response.data);
      setCustomerInfoData(data);
      setCurrentStep("loanDetails");
    } catch (err) {
      console.error("API Error (Customer Info):", err);
      setError("API Error");
      setCurrentStep("submissionError");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoanDetailsSubmit = async (data: LoanDetailsFormData) => {
    console.log("Loan Details:", data);
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${window.location.href}api/loan`,
        data,
      );
      console.log("API Response (Loan Application):", response.data.loan);
      const loanId = response.data.loan.id;

      if (!loanId) {
        throw new Error("Application ID not received from the server.");
      }

      setLoanDetailsData(data);
      const result = await axios.get<{ success: boolean; data: LenderOffer[] }>(
        `/api/offer/${loanId}`,
      );
      console.log("API Response (Offers):", result.data);
      setOffers(result.data.data);
    } catch (err) {
      console.error("API Error (Loan Application):", err);
      setError("API Error");
      setCurrentStep("submissionError");
    } finally {
      console.log("Offers:", offers);
      setCurrentStep("offers");
      setIsLoading(false);
    }
  };

  const handleBackToCustomerInfo = () => {
    setError(null);
    setCurrentStep("customerInfo");
  };

  const handleBackToLoanDetails = () => {
    setError(null);
    setCurrentStep("loanDetails");
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Loan Application</h1>

      {error && currentStep !== "submissionError" && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {currentStep === "customerInfo" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Step 1: Your Information
          </h2>
          <CustomerInfoForm
            onSubmit={handleCustomerInfoSubmit}
            defaultValues={customerInfoData}
            isLoading={isLoading}
          />
        </div>
      )}

      {currentStep === "loanDetails" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Step 2: Loan Details</h2>
          <LoanDetailsForm
            onSubmit={handleLoanDetailsSubmit}
            defaultValues={loanDetailsData}
            isLoading={isLoading}
          />
          <button
            onClick={handleBackToCustomerInfo}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            &larr; Back to Customer Information
          </button>
        </div>
      )}

      {currentStep === "offers" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Step 3: Your Loan Offers
          </h2>
          {isLoading && <p className="text-gray-600">Loading offers...</p>}
          {!isLoading && offers.length > 0 && (
            <OffersDisplay
              offers={offers}
              isLoading={isLoading}
            />
          )}
          <button
            onClick={handleBackToLoanDetails}
            className="mt-6 text-sm text-blue-600 hover:underline"
          >
            &larr; Back to Loan Details
          </button>
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <p className="text-lg font-medium">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}
