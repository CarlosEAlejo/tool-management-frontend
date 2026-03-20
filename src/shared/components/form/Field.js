import React from 'react';

const fieldClasses =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';

export const TextField = ({ label, name, ...props }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor={name}>
      {label}
    </label>
    <input id={name} name={name} className={fieldClasses} {...props} />
  </div>
);

export const SelectField = ({ label, name, options, ...props }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor={name}>
      {label}
    </label>
    <select id={name} name={name} className={fieldClasses} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export const TextareaField = ({ label, name, ...props }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor={name}>
      {label}
    </label>
    <textarea id={name} name={name} className={fieldClasses} {...props} />
  </div>
);

export const CheckboxField = ({ label, name, checked, onChange }) => (
  <label className="mt-3 flex items-center gap-3 text-sm font-medium text-slate-700" htmlFor={name}>
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
    />
    {label}
  </label>
);
