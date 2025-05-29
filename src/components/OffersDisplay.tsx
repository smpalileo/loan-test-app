"use client";

import React from "react";
import { LenderOffer } from "@/store/store";

interface OffersDisplayProps {
  offers: LenderOffer[];
  isLoading: boolean;
  className?: string;
}

interface TableHeaderConfig {
  key: string; // Unique key for React list rendering
  label: string;
  headerClassName?: string;
  cellClassName: string;
  renderCell: (offer: LenderOffer) => React.ReactNode;
}

const tableHeaders: TableHeaderConfig[] = [
  {
    key: "lenderName",
    label: "Lender",
    cellClassName:
      "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
    renderCell: (offer) => offer.lenderName,
  },
  {
    key: "aprAndInterestRate",
    label: "APR% (Base Interest Rate)",
    cellClassName: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
    renderCell: (offer) =>
      `${offer.apr.toFixed(2)}% (${offer.interestRate.toFixed(2)}% per annum)`,
  },
  {
    key: "totalFees",
    label: "Total Fees",
    cellClassName: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
    renderCell: (offer) => `$${offer.totalFees.toFixed(2)}`,
  },
  {
    key: "term",
    label: "Term",
    cellClassName: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
    renderCell: (offer) =>
      `${offer.loanTerm} years or ${offer.loanTerm * 12} months`,
  },
  {
    key: "monthlyPayment",
    label: "Monthly Payment",
    cellClassName: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
    renderCell: (offer) => `$${offer.monthlyRepayment.toFixed(2)}`,
  },
  {
    key: "totalRepayment",
    label: "Total Repayment",
    cellClassName: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
    renderCell: (offer) =>
      `$${(offer.monthlyRepayment * 12 * offer.loanTerm).toFixed(2)}`,
  },
];

export const OffersDisplay: React.FC<OffersDisplayProps> = ({
  offers,
  isLoading,
  className,
}) => {
  return (
    <div className={className}>
      {isLoading ? (
        <p className="text-gray-600">Loading offers...</p>
      ) : offers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header.key}
                    scope="col"
                    className={
                      header.headerClassName ||
                      "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    }
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr key={offer.id}>
                  {tableHeaders.map((header) => (
                    <td
                      key={`${offer.id}-${header.key}`}
                      className={header.cellClassName}
                    >
                      {header.renderCell(offer)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No offers available at this time.</p>
      )}
    </div>
  );
};
