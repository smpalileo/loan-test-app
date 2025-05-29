import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface FormSelectProps {
  label: string;
  name: string;
  options: string[];
  register: UseFormRegister<any>;
}

const FormSelect: React.FC<FormSelectProps> = ({ label, name, options, register }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        {...register(name)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;