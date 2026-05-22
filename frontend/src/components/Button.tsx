import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
};

export function Button({ icon, variant = 'primary', children, ...props }: ButtonProps) {
  return (
    <button className={`button button-${variant}`} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
