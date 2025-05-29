"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomerInfoSchema } from "@/lib/schema";
import { EmploymentStatus } from "@/store/store";

type CustomerInfoFormValues = z.infer<typeof CustomerInfoSchema>;

const CustomerInfoForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInfoFormValues>({
    resolver: zodResolver(CustomerInfoSchema),
  });

  const onSubmit: SubmitHandler<CustomerInfoFormValues> = (data) => {
    console.log(data);
    // Handle form submission logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          {...register("firstName")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          {...register("lastName")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          {...register("phoneNumber")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
      </div>

      <div>
        <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700">
          Employment Status
        </label>
        <select
          id="employmentStatus"
          {...register("employmentStatus")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {Object.values(EmploymentStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.employmentStatus && <p className="mt-1 text-sm text-red-600">{errors.employmentStatus.message}</p>}
      </div>

      <div>
        <label htmlFor="employerName" className="block text-sm font-medium text-gray-700">
          Employer Name
        </label>
        <input
          id="employerName"
          type="text"
          {...register("employerName")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.employerName && <p className="mt-1 text-sm text-red-600">{errors.employerName.message}</p>}
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CustomerInfoForm;