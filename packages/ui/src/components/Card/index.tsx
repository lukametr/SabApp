import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends MuiCardProps {
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <MuiCard
        ref={ref}
        className={twMerge('shadow-md', className)}
        {...props}
      >
        {children}
      </MuiCard>
    );
  }
);

 