import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import './Button.css';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isMagnetic?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isMagnetic = false, children, ...props }, ref) => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
    };

    const sizes = {
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
    };

    const baseStyles = 'btn-base';

    const content = (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );

    if (isMagnetic) {
      return (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          {content}
        </motion.div>
      );
    }

    return content;
  }
);

Button.displayName = 'Button';
