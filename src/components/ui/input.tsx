import React from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  register: UseFormRegister<FieldValues>;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, type, register, error }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;