"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoanDetailsSchema } from "@/lib/schema"; // Assuming schema.ts is in src/lib
import { LoanType } from "@/store/store"; // Assuming store.ts is in src/store
import { cn } from "@/lib/utils";

// UI Component Imports - Replace with your actual component paths
// These are placeholders based on common patterns with Radix/shadcn
import { Input } from "@/components/ui/input"; // Placeholder
import { Button } from "@/components/ui/button"; // Placeholder
import { Label } from "@/components/ui/label"; // Placeholder
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Placeholder

// Infer the type from the Zod schema
export type LoanDetailsFormData = z.infer<typeof LoanDetailsSchema>;

interface LoanDetailsFormProps {
  onSubmit: (data: LoanDetailsFormData) => void;
  defaultValues?: Partial<LoanDetailsFormData>;
  className?: string;
}

export const LoanDetailsForm: React.FC<LoanDetailsFormProps> = ({
  onSubmit,
  defaultValues,
  className,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control, // For controlled components like Radix Select
    watch, // To watch values for conditional logic if needed
  } = useForm<LoanDetailsFormData>({
    resolver: zodResolver(LoanDetailsSchema),
    defaultValues: {
      loanAmount: defaultValues?.loanAmount || undefined, // Or a sensible default like 2000
      loanType: defaultValues?.loanType || undefined,
      loanTerm: defaultValues?.loanTerm || undefined, // Or a sensible default like 1
      deposit: defaultValues?.deposit || undefined,
    },
  });

  const handleFormSubmit: SubmitHandler<LoanDetailsFormData> = (data) => {
    onSubmit(data);
  };

  // Watch loanType to conditionally show/hide or adjust deposit logic if needed in UI
  const loanType = watch("loanType");

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn("space-y-6", className)}
    >
      <div>
        <Label htmlFor="loanAmount">Loan Amount ($)</Label>
        <Input
          id="loanAmount"
          type="number"
          {...register("loanAmount")}
          placeholder="e.g., 10000"
          className={cn(errors.loanAmount && "border-red-500")}
        />
        {errors.loanAmount && (
          <p className="mt-1 text-xs text-red-500">
            {errors.loanAmount.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="loanType">Loan Purpose</Label>
        <Controller
          name="loanType"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""} // Ensure value is a string
              // defaultValue={field.value}
            >
              <SelectTrigger
                id="loanType"
                className={cn(errors.loanType && "border-red-500")}
              >
                <SelectValue placeholder="Select loan purpose" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LoanType).map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                  >
                    {type.replace(/([A-Z])/g, " $1").trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.loanType && (
          <p className="mt-1 text-xs text-red-500">{errors.loanType.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="loanTerm">Loan Term (Years)</Label>
        <Input
          id="loanTerm"
          type="number"
          {...register("loanTerm")}
          placeholder="e.g., 5"
          min="1"
          max="7"
          className={cn(errors.loanTerm && "border-red-500")}
        />
        {errors.loanTerm && (
          <p className="mt-1 text-xs text-red-500">{errors.loanTerm.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="deposit">Deposit Amount ($) (Optional)</Label>
        <Input
          id="deposit"
          type="number"
          {...register("deposit")}
          placeholder="e.g., 2000"
          className={cn(errors.deposit && "border-red-500")}
        />
        {errors.deposit && (
          <p className="mt-1 text-xs text-red-500">{errors.deposit.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
      >
        Get Loan Offers
      </Button>
    </form>
  );
};
