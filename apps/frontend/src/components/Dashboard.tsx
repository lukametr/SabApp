'use client';

import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { 
  Shield, 
  AccountCircle, 
  Logout, 
  Add,
  Assignment,
  GetApp,
  Security,
  AdminPanelSettings
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import DocumentList from './DocumentList';
import DocumentForm from './DocumentForm';
import DocumentView from './DocumentView';
import SubscriptionBanner from './subscription/SubscriptionBanner';
import { useDocumentStore } from '../store/documentStore';
import { useAuthStore } from '../store/authStore';
import { CreateDocumentDto, Document } from '../types/document';

interface DashboardProps {
  user?: {
    name: string;
    email: string;
    role?: string;
  };
}

export default function Dashboard({ user: propUser }: DashboardProps) {
  const router = useRouter();
  const { documents, createDocument, fetchDocuments, updateDocument, deleteDocument } = useDocumentStore();
  const { user, logout, loadFromStorage } = useAuthStore();
  
  // Use auth store user if available, otherwise use prop user
  const currentUser = user || propUser;
  const [open, setOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<Document | null>(null);
  const [viewDoc, setViewDoc] = useState<Document | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Load user from storage on mount
  React.useEffect(() => {
    loadFromStorage();
  }, []); // Only on mount

  // Debug: Log user data when it changes
  React.useEffect(() => {
    console.log('🔍 Dashboard - Current User:', currentUser);
    console.log('🔍 Dashboard - User Role:', currentUser?.role);
    console.log('🔍 Dashboard - Is Admin?:', currentUser?.role === 'admin');
  }, [currentUser]);

  React.useEffect(() => { 
    fetchDocuments(); 
  }, [fetchDocuments]);

  const handleCreateDocument = useCallback(async (data: CreateDocumentDto) => {
    try {
      await createDocument(data);
      setOpen(false);
    } catch (error) {
      console.error('დოკუმენტის შექმნის შეცდომა:', error);
    }
  }, [createDocument]);

  const handleEdit = useCallback((doc: Document) => {
    setEditDoc(doc);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(async (doc: Document) => {
    console.log('🗑️ Dashboard delete called for:', { id: doc.id, objectName: doc.objectName });
    await deleteDocument(doc.id);
    fetchDocuments();
  }, [deleteDocument, fetchDocuments]);

  const handleSelect = useCallback((doc: Document) => {
    setSelectedDocument(doc);
    setOpenForm(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpen(false);
    setEditDoc(null);
  }, []);

  const handleCloseForm = useCallback(() => {
    setOpenForm(false);
    setSelectedDocument(null);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleClearCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  const convertDocumentToCreateDto = useCallback((doc: Document): Partial<CreateDocumentDto> => {
    return {
      evaluatorName: doc.evaluatorName,
      evaluatorLastName: doc.evaluatorLastName,
      objectName: doc.objectName,
      workDescription: doc.workDescription,
      date: doc.date,
      time: doc.time,
      hazards: doc.hazards.map(hazard => ({
        ...hazard,
        photos: []
      })),
      photos: []
    };
  }, []);

  const handleSubmit = useCallback(async (data: CreateDocumentDto) => {
    if (editDoc) {
      const updateData = {
        id: editDoc.id,
        evaluatorName: data.evaluatorName,
        evaluatorLastName: data.evaluatorLastName,
        objectName: data.objectName,
        workDescription: data.workDescription,
        date: data.date,
        time: data.time,
        hazards: data.hazards,
        photos: []
      };
      await updateDocument(updateData);
    } else {
      await handleCreateDocument(data);
    }
    fetchDocuments();
  }, [editDoc, updateDocument, handleCreateDocument, fetchDocuments]);

  // Stats calculation
  const totalDocuments = documents.length;
  const totalHazards = documents.reduce((sum, doc) => sum + (doc.hazards?.length || 0), 0);
  const recentDocuments = documents.filter(doc => {
    const docDate = new Date(doc.createdAt || doc.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return docDate > weekAgo;
  }).length;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Shield sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              SabApp
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {currentUser?.name || 'მომხმარებელი'}
            </Typography>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {/* Debug: Show current user info */}
              <MenuItem disabled>
                <Typography variant="caption">
                  Role: {currentUser?.role || 'undefined'} | Admin: {currentUser?.role === 'admin' ? 'Yes' : 'No'}
                </Typography>
              </MenuItem>
              {currentUser?.role === 'admin' && (
                <MenuItem onClick={() => router.push('/admin')}>
                  <AdminPanelSettings sx={{ mr: 1 }} />
                  Admin Panel
                </MenuItem>
              )}
              <MenuItem onClick={handleClearCache}>
                <Security sx={{ mr: 1 }} />
                Clear Cache
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                გამოსვლა
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Subscription Banner */}
        <SubscriptionBanner />
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" color="primary">
                  {totalDocuments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  სულ დოკუმენტი
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Security sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" color="warning.main">
                  {totalHazards}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  გამოვლენილი საფრთხე
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <GetApp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" color="success.main">
                  {totalDocuments * 3}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ჩამოტვირთვა
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Add sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" color="info.main">
                  {recentDocuments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ბოლო კვირაში
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              თქვენი დოკუმენტები
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => { 
                setEditDoc(null); 
                setOpen(true); 
              }}
              size="large"
            >
              ახალი დოკუმენტი
            </Button>
          </Box>

          {documents.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Assignment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                ჯერ არ გაქვთ შექმნილი დოკუმენტები
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                დაიწყეთ პირველი უსაფრთხოების შეფასების შექმნა
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={() => { 
                  setEditDoc(null); 
                  setOpen(true); 
                }}
              >
                შექმენი პირველი დოკუმენტი
              </Button>
            </Box>
          ) : (
            <DocumentList
              documents={documents}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={handleSelect}
            />
          )}
        </Paper>
      </Container>
      
      {/* DocumentForm with built-in Dialog */}
      <DocumentForm
        defaultValues={editDoc ? convertDocumentToCreateDto(editDoc) : undefined}
        onSubmit={handleSubmit}
        onCancel={handleCloseDialog}
        open={open}
        onClose={handleCloseDialog}
      />
      
      {/* Document View Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="lg" fullWidth>
        <DialogTitle>დოკუმენტის დეტალები</DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <DocumentView
              document={selectedDocument}
              onEdit={() => {
                setEditDoc(selectedDocument);
                setOpenForm(false);
                setOpen(true);
              }}
              onDelete={() => {
                handleDelete(selectedDocument);
                setOpenForm(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
