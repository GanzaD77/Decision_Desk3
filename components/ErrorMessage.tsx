
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg relative flex items-center" role="alert">
      <ErrorIcon />
      <div>
        <strong className="font-bold">Oops! </strong>
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  );
};
