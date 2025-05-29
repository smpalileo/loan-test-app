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
      const offers = await axios.get<LenderOffer[]>(`/api/offer/${loanId}`);
      console.log("API Response (Offers):", offers.data);
      setOffers(offers.data);
      setCurrentStep("offers");
    } catch (err) {
      console.error("API Error (Loan Application):", err);
      setError("API Error");
      setCurrentStep("submissionError");
    } finally {
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

      {error &&
        currentStep !== "submissionError" && ( // Show general errors unless it's a dedicated error step
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
          {isLoading ? (
            <p className="text-gray-600">Loading offers...</p>
          ) : offers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Lender
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Interest Rate - APR
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Term
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Monthly Payment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total Repayment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {offers.map((offer) => (
                    <tr key={offer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {offer.lenderName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {offer.interestRate.toFixed(2)}% -{" "}
                        {offer.apr.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {offer.loanTerm} years or {offer.loanTerm * 12} months
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${offer.monthlyRepayment.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        $
                        {(offer.monthlyRepayment * 12 * offer.loanTerm).toFixed(
                          2,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No offers available at this time.</p>
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
