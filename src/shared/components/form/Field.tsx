import React from "react";
import type { ChangeEventHandler, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { Option } from "../../../shared/types";

const fieldClasses = "ui-input";

interface BaseFieldProps {
  label: string;
  name: string;
}

type TextFieldProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement>;

type SelectFieldProps = BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: Option[];
  };

type TextareaFieldProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

interface CheckboxFieldProps extends BaseFieldProps {
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const TextField = ({ label, name, ...props }: TextFieldProps) => (
  <div>
    <label className="ui-label" htmlFor={name}>
      {label}
    </label>
    <input id={name} name={name} className={fieldClasses} {...props} />
  </div>
);

export const SelectField = ({ label, name, options, ...props }: SelectFieldProps) => (
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

export const TextareaField = ({ label, name, ...props }: TextareaFieldProps) => (
  <div>
    <label className="ui-label" htmlFor={name}>
      {label}
    </label>
    <textarea id={name} name={name} className={fieldClasses} {...props} />
  </div>
);

export const CheckboxField = ({ label, name, checked, onChange }: CheckboxFieldProps) => (
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
