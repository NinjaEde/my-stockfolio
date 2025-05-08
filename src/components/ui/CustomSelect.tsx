import React from "react";

type Option = {
  label: string;
  value: string;
  color: string; // HEX or CSS color string
};

type CustomSelectProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  className = "",
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <button
        type="button"
        className="w-full flex items-center px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        onClick={() => setOpen((o) => !o)}
      >
        {selectedOption && (
          <span
            className="inline-block mr-2"
            style={{
              width: 0,
              height: 20,
              borderLeft: `6px solid ${selectedOption.color}`,
            }}
          />
        )}
        <span>{selectedOption ? selectedOption.label : "Select..."}</span>
        <svg
          className="ml-auto h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border rounded shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`flex items-center w-full px-3 py-2 text-left transition-colors 
                hover:bg-gray-100 dark:hover:bg-gray-700 
                ${opt.value === value ? "bg-gray-100 dark:bg-gray-700" : ""}`}
              onClick={() => handleSelect(opt.value)}
            >
              <span
                className="inline-block mr-2"
                style={{
                  width: 0,
                  height: 20,
                  borderLeft: `6px solid ${opt.color}`,
                }}
              />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
