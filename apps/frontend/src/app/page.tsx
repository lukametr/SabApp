'use client';

import React, { useState, useCallback } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import DocumentList from '../components/DocumentList';
import DocumentForm from '../components/DocumentForm';
import DocumentView from '../components/DocumentView';
import { useDocumentStore } from '../store/documentStore';
import { CreateDocumentDto, Document } from '../types/document';

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

  // Convert Document to CreateDocumentDto format for form default values
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
        photos: [] // Convert string[] to File[] for form
      })),
      photos: [] // Convert string[] to File[] for form
    };
  }, []);

  const handleSubmit = useCallback(async (data: CreateDocumentDto) => {
    if (editDoc) {
      // Convert CreateDocumentDto to UpdateDocumentDto format
      const updateData = {
        id: editDoc.id,
        evaluatorName: data.evaluatorName,
        evaluatorLastName: data.evaluatorLastName,
        objectName: data.objectName,
        workDescription: data.workDescription,
        date: data.date,
        time: data.time,
        hazards: data.hazards,
        photos: [] // UpdateDocumentDto expects string[], not File[]
      };
      await updateDocument(updateData);
    } else {
      await handleCreateDocument(data);
    }
    fetchDocuments();
  }, [editDoc, updateDocument, handleCreateDocument, fetchDocuments]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
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
      
      {/* DocumentForm with built-in Dialog */}
      <DocumentForm
        defaultValues={editDoc ? convertDocumentToCreateDto(editDoc) : undefined}
        onSubmit={handleSubmit}
        onCancel={handleCloseDialog}
        open={open}
        onClose={handleCloseDialog}
      />
      
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