import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  className = '',
  children,
  ...props
}) => {
  const id = props.id || props.name || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full p-1 border rounded-md text-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          dark:bg-gray-700 dark:text-white dark:border-gray-600
          ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
