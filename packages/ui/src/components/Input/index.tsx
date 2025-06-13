import { TextField, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends TextFieldProps {
  className?: string;
}

export const Input = forwardRef<HTMLDivElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        className={twMerge('w-full', className)}
        variant="outlined"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input'; 