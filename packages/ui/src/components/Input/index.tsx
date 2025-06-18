import { TextField, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type InputProps = TextFieldProps & {
  className?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        className={twMerge('w-full', className)}
        variant="outlined"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input'; 