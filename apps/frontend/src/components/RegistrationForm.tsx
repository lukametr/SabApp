'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box } from '@mui/material';

interface RegistrationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (personalNumber: string, phoneNumber: string) => void;
  loading?: boolean;
}

export default function RegistrationForm({ open, onClose, onSubmit, loading = false }: RegistrationFormProps) {
  const [personalNumber, setPersonalNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ personalNumber?: string; phoneNumber?: string }>({});

  const validateForm = () => {
    const newErrors: { personalNumber?: string; phoneNumber?: string } = {};

    if (!personalNumber.trim()) {
      newErrors.personalNumber = 'პირადი ნომერი სავალდებულოა';
    } else if (personalNumber.length !== 11) {
      newErrors.personalNumber = 'პირადი ნომერი უნდა შეიცავდეს 11 ციფრს';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'ტელეფონის ნომერი სავალდებულოა';
    } else if (!/^5\d{8}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'ტელეფონის ნომერი უნდა იწყებოდეს 5-ით და შეიცავდეს 9 ციფრს';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(personalNumber.trim(), phoneNumber.trim());
    }
  };

  const handleClose = () => {
    setPersonalNumber('');
    setPhoneNumber('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          რეგისტრაციის დასრულება
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            გთხოვთ შეიყვანოთ დამატებითი ინფორმაცია თქვენი ანგარიშის დასასრულებლად
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="პირადი ნომერი"
              value={personalNumber}
              onChange={(e) => setPersonalNumber(e.target.value)}
              error={!!errors.personalNumber}
              helperText={errors.personalNumber}
              placeholder="00000000000"
              inputProps={{ maxLength: 11 }}
              fullWidth
              required
            />
            
            <TextField
              label="ტელეფონის ნომერი"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              placeholder="500000000"
              inputProps={{ maxLength: 9 }}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose} disabled={loading}>
            გაუქმება
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !personalNumber.trim() || !phoneNumber.trim()}
          >
            {loading ? 'რეგისტრაცია...' : 'რეგისტრაცია'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 