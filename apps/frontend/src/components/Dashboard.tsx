'use client';

import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { 
  Add,
  GetApp,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import DocumentList from './DocumentList';
import DocumentForm from './DocumentForm';
import DocumentView from './DocumentView';
import SubscriptionBanner from './subscription/SubscriptionBanner';
import { useDocumentStore } from '../store/documentStore';
import { useAuthStore } from '../store/authStore';
import { CreateDocumentDto, Document, UpdateDocumentDto } from '../types/document';
import { useIdleTimeout } from '../hooks/useIdleTimeout';

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
  const { user, logout } = useAuthStore();
  
  // Use auth store user if available, otherwise use prop user
  const currentUser = user || propUser;
  const [open, setOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<Document | null>(null);
  const [viewDoc, setViewDoc] = useState<Document | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [openForm, setOpenForm] = useState(false);

  // Idle timeout - 24 hours
  useIdleTimeout({
    timeoutDuration: 24 * 60 * 60 * 1000, // 24 hours
    onTimeout: () => {
      console.log('🕐 User idle for 24 hours - logging out and clearing cache');
      localStorage.clear();
      sessionStorage.clear();
      logout();
      router.push('/');
      window.location.reload();
    }
  });

  // No need to call loadFromStorage here - handled by AuthProvider

  // Debug: Log user data when it changes
  React.useEffect(() => {
    console.log('🔍 Dashboard - Current User:', currentUser);
    console.log('🔍 Dashboard - User Role:', currentUser?.role);
    console.log('🔍 Dashboard - Is Admin?:', currentUser?.role === 'admin');
  }, [currentUser]);

  React.useEffect(() => { 
    fetchDocuments(); 
  }, [fetchDocuments]);

  const handleCreateDocument = useCallback(async (data: CreateDocumentDto, actualHazards?: any[]) => {
    try {
      // Use actualHazards if provided, otherwise use data.hazards
      const hazardsToUse = actualHazards || data.hazards;
      
      const createData = {
        ...data,
        hazards: hazardsToUse
      };
      
      console.log('📋 Creating document with hazards:', hazardsToUse?.length || 0);
      await createDocument(createData);
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

  const convertDocumentToCreateDto = useCallback((doc: Document): Partial<CreateDocumentDto> => {
    console.log('🔄 Converting document to DTO:', { id: doc.id, hazardsCount: doc.hazards?.length || 0 });
    
    return {
      evaluatorName: doc.evaluatorName,
      evaluatorLastName: doc.evaluatorLastName,
      objectName: doc.objectName,
      workDescription: doc.workDescription,
      date: doc.date,
      time: doc.time,
      hazards: (doc.hazards || []).map(hazard => {
        console.log('🔄 Converting hazard with risks:', {
          id: hazard.id,
          initialRisk: hazard.initialRisk,
          residualRisk: hazard.residualRisk
        });
        return {
          ...hazard,
          id: hazard.id || `hazard_${Date.now()}_${Math.random()}`, // Ensure ID exists
          reviewDate: hazard.reviewDate ? new Date(hazard.reviewDate) : new Date(),
          photos: hazard.photos || [], // Keep existing photos
          // Preserve risk values exactly as they are
          initialRisk: hazard.initialRisk ? { ...hazard.initialRisk } : { probability: 0, severity: 0, total: 0 },
          residualRisk: hazard.residualRisk ? { ...hazard.residualRisk } : { probability: 0, severity: 0, total: 0 }
        };
      }),
      // photos: doc.photos || [] // TODO: Fix type mismatch between string[] and File[]
    };
  }, []);

  const handleSubmit = useCallback(async (data: CreateDocumentDto, actualHazards?: any[]) => {
    console.log('📋 Dashboard handleSubmit called:', {
      isEdit: !!editDoc,
      dataHazards: data.hazards?.length || 0,
      actualHazards: actualHazards?.length || 0
    });

    if (editDoc) {
      // Use actualHazards if provided, otherwise fall back to data.hazards
      const hazardsToUse = actualHazards || data.hazards;
      
      const updateData: UpdateDocumentDto = {
        id: editDoc.id,
        evaluatorName: data.evaluatorName,
        evaluatorLastName: data.evaluatorLastName,
        objectName: data.objectName,
        workDescription: data.workDescription,
        date: data.date,
        time: data.time,
        hazards: hazardsToUse,
        photos: [], // Base64 data URLs - empty for now
        // Preserve metadata from original document
        authorId: editDoc.authorId,
        createdAt: editDoc.createdAt,
        updatedAt: new Date(), // Update timestamp
        isFavorite: editDoc.isFavorite,
        assessmentA: editDoc.assessmentA,
        assessmentSh: editDoc.assessmentSh,
        assessmentR: editDoc.assessmentR,
      };
      
      console.log('📋 Updating document with preserved metadata:', {
        id: updateData.id,
        authorId: updateData.authorId,
        createdAt: updateData.createdAt,
        hazards: hazardsToUse?.length || 0
      });
      await updateDocument(updateData);
    } else {
      // For new documents, pass actualHazards as well
      await handleCreateDocument(data, actualHazards);
    }
    fetchDocuments();
  }, [editDoc, updateDocument, handleCreateDocument, fetchDocuments]);

  // Stats calculation
  const totalDocuments = documents.length;
  const totalHazards = documents.reduce((sum, doc) => sum + (doc.hazards?.length || 0), 0);
  const recentDocuments = documents.filter(doc => {
    const dateValue = doc.createdAt || doc.date;
    if (!dateValue) return false;
    const docDate = new Date(dateValue);
    if (isNaN(docDate.getTime())) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return docDate > weekAgo;
  }).length;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', pt: 2 }}>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Subscription Banner */}
        <SubscriptionBanner />
        
        {/* Admin Panel Access - Prominent Card for Admin Users */}
        {currentUser?.role === 'admin' && (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Grid container alignItems="center" spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AdminPanelSettings sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      Admin Panel
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                    მომხმარებლების მართვა და გამოწერების კონტროლი
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    დაამატეთ, ჩაშალეთ ან განაახლეთ მომხმარებლების გამოწერები, ნახეთ სისტემის სტატისტიკა
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push('/admin')}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                      },
                      fontSize: '1.1rem',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2
                    }}
                    startIcon={<AdminPanelSettings />}
                  >
                    Admin Panel-ში გადასვლა
                  </Button>
                </Grid>
              </Grid>
            </Box>
            {/* Decorative background elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                zIndex: 0
              }}
            />
          </Paper>
        )}
        
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
