import type { InputHTMLAttributes } from 'react';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label: string;
  onChange: (value: string) => void;
};

export function Input({ label, onChange, ...props }: InputProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
