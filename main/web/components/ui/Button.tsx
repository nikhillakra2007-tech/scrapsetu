import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', fullWidth = false, icon, className = '', disabled, ...props }, ref) => {
    const classNames = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classNames} disabled={disabled} {...props}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {children && <span>{children}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
