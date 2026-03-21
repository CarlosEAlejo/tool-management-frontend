import React from 'react';

const fieldClasses = 'ui-input';

export const TextField = ({ label, name, ...props }) => (
  <div>
    <label className="ui-label" htmlFor={name}>
      {label}
    </label>
    <input id={name} name={name} className={fieldClasses} {...props} />
  </div>
);

export const SelectField = ({ label, name, options, ...props }) => (
  <div>
    <label className="ui-label" htmlFor={name}>
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
    <label className="ui-label" htmlFor={name}>
      {label}
    </label>
    <textarea id={name} name={name} className={fieldClasses} {...props} />
  </div>
);

export const CheckboxField = ({ label, name, checked, onChange }) => (
  <label className="mt-2 flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]" htmlFor={name}>
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-[var(--border-subtle)] bg-[var(--surface-base)] text-emerald-600 focus:ring-emerald-500"
    />
    {label}
  </label>
);
