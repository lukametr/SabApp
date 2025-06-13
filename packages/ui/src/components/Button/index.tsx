import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends MuiButtonProps {
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <MuiButton
        ref={ref}
        className={twMerge('font-sans', className)}
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button'; 