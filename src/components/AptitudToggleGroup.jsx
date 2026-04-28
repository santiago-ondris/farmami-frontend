import React from 'react';

const OPTIONS = [
  { value: 'APTO', label: 'APTO', className: 'border-green-200 bg-green-50 text-green-700' },
  { value: 'NO_APTO', label: 'NO APTO', className: 'border-red-200 bg-red-50 text-red-700' }
];

const AptitudToggleGroup = ({ value, onChange, name }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {OPTIONS.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded border px-3 py-2 text-sm font-semibold transition-colors ${selected ? option.className : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'}`}
            aria-pressed={selected}
            name={name}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default AptitudToggleGroup;
