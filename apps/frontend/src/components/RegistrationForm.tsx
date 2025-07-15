'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box } from '@mui/material';

interface RegistrationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function RegistrationForm({ open, onClose, onSubmit, loading = false }: RegistrationFormProps) {
  // Removed personalNumber, phoneNumber, and errors state

  // Removed validateForm

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleClose = () => {
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
            {/* Removed personalNumber and phoneNumber fields */}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose} disabled={loading}>
            გაუქმება
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'რეგისტრაცია...' : 'რეგისტრაცია'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 