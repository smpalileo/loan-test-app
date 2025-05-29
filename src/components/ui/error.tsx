import React from 'react';
import { FieldError } from 'react-hook-form';

interface ErrorMessageProps {
  error?: FieldError;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error || !error.message) {
    return null;
  }

  return (
    <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
      {error.message}
    </div>
  );
};

export default ErrorMessage;