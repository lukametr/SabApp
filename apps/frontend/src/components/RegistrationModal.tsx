'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';

interface RegistrationFormData {
  personalNumber: string;
  phoneNumber: string;
}

interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  userInfo?: {
    name: string;
    email: string;
    picture?: string;
  };
  loading?: boolean;
  error?: string;
}

export default function RegistrationModal({
  open,
  onClose,
  onSubmit,
  userInfo,
  loading = false,
  error,
}: RegistrationModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>();

  const handleFormSubmit = async (data: RegistrationFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (err) {
      // Error handled by parent component
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="h2">
          რეგისტრაციის დასრულება
        </Typography>
        {userInfo && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            გამარჯობა, {userInfo.name}! რეგისტრაციის დასასრულებლად გთხოვთ შეიყვანოთ დამატებითი ინფორმაცია.
          </Typography>
        )}
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          // Removed personalNumber TextField
          
          // Removed phoneNumber TextField
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={handleClose} disabled={loading}>
              გაუქმება
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'რეგისტრაცია...' : 'რეგისტრაცია'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
