import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const classNames = [
    styles.badge,
    styles[variant],
    styles[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
