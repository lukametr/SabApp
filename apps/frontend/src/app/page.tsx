'use client';

import React, { useState, useCallback } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { DocumentList } from '../components/DocumentList';
import { DocumentForm } from '../components/DocumentForm';
import { useDocumentStore } from '../store/documentStore';
import { CreateDocumentDto, Document } from '../types/document.types';

export default function Home() {
  const { documents, createDocument, fetchDocuments, updateDocument, deleteDocument } = useDocumentStore();
  const [open, setOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<Document | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [openForm, setOpenForm] = useState(false);

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

  const handleSubmit = useCallback(async (data: CreateDocumentDto) => {
    if (editDoc) {
      await updateDocument({ id: editDoc.id, ...data });
    } else {
      await handleCreateDocument(data);
    }
    fetchDocuments();
  }, [editDoc, updateDocument, handleCreateDocument, fetchDocuments]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">დოკუმენტების მართვა</Typography>
        <Button 
          variant="contained" 
          onClick={() => { 
            setEditDoc(null); 
            setOpen(true); 
          }}
        >
          ახალი დოკუმენტი
        </Button>
      </Box>
      <DocumentList
        documents={documents}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={handleSelect}
      />
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editDoc ? 'დოკუმენტის რედაქტირება' : 'ახალი დოკუმენტი'}
        </DialogTitle>
        <DialogContent>
          <DocumentForm
            defaultValues={editDoc || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
            open={open}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>დოკუმენტის დეტალები</DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box>
              <Typography variant="h6">{selectedDocument.objectName}</Typography>
              <Typography>
                შემფასებელი: {selectedDocument.evaluatorName} {selectedDocument.evaluatorLastName}
              </Typography>
              <Typography>
                თარიღი: {new Date(selectedDocument.date).toLocaleDateString('ka-GE')}
              </Typography>
              <Typography>
                რისკი: {selectedDocument.residualRisk.total}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
} 