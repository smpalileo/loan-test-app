"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomerInfoSchema } from "@/lib/schema";
import { EmploymentStatus } from "@/store/store";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CustomerInfoFormData = z.infer<typeof CustomerInfoSchema>;

interface CustomerInfoFormProps {
  onSubmit: (data: CustomerInfoFormData) => void;
  defaultValues?: Partial<CustomerInfoFormData>;
  isLoading?: boolean;
  className?: string;
}

export const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  onSubmit,
  defaultValues,
  isLoading,
  className,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<CustomerInfoFormData>({
    resolver: zodResolver(CustomerInfoSchema),
    defaultValues: {
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
      email: defaultValues?.email || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      employmentStatus: defaultValues?.employmentStatus || undefined,
      employerName: defaultValues?.employerName || "",
    },
  });

  const handleFormSubmit: SubmitHandler<CustomerInfoFormData> = (data) => {
    onSubmit(data);
  };

  const employmentStatus = watch("employmentStatus");

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn("space-y-6", className)}
    >
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          {...register("firstName")}
          placeholder="John"
          className={cn(errors.firstName && "border-red-500")}
        />
        {errors.firstName && (
          <p
            style={{
              color: "magenta",
              border: "2px solid lime",
              fontSize: "16px",
              marginTop: "4px",
            }}
          >
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          {...register("lastName")}
          placeholder="Doe"
          className={cn(errors.lastName && "border-red-500")}
        />
        {errors.lastName && (
          <p
            style={{
              color: "magenta",
              border: "2px solid lime",
              fontSize: "16px",
              marginTop: "4px",
            }}
          >
            {errors.lastName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="john.doe@example.com"
          className={cn(errors.email && "border-red-500")}
        />
        {errors.email && (
          <p
            style={{
              color: "magenta",
              border: "2px solid lime",
              fontSize: "16px",
              marginTop: "4px",
            }}
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          {...register("phoneNumber")}
          placeholder="+1234567890"
          className={cn(errors.phoneNumber && "border-red-500")}
        />
        {errors.phoneNumber && (
          <p
            style={{
              color: "magenta",
              border: "2px solid lime",
              fontSize: "16px",
              marginTop: "4px",
            }}
          >
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="employmentStatus">Employment Status</Label>
        <Controller
          name="employmentStatus"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""} // Ensure value is a string, Radix Select might expect this
              // defaultValue={field.value} // Or use defaultValue from props if that's preferred for initial render
            >
              <SelectTrigger
                id="employmentStatus"
                className={cn(errors.employmentStatus && "border-red-500")}
              >
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EmploymentStatus).map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                  >
                    {status.replace(/([A-Z])/g, " $1").trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.employmentStatus && (
          <p
            style={{
              color: "magenta",
              border: "2px solid lime",
              fontSize: "16px",
              marginTop: "4px",
            }}
          >
            {errors.employmentStatus.message}
          </p>
        )}
      </div>

      {employmentStatus === EmploymentStatus.Employed && (
        <div>
          <Label htmlFor="employerName">Employer</Label>
          <Input
            id="employerName"
            {...register("employerName")}
            placeholder="Driva"
            className={cn(errors.employerName && "border-red-500")}
          />
          {errors.employerName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.employerName.message}
            </p>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Next: Loan Details"}
      </Button>
    </form>
  );
};
