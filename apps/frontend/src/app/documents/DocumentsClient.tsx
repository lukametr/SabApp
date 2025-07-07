'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DocumentList from '../../components/DocumentList';
import DocumentForm from '../../components/DocumentForm';
import { useDocumentStore } from '../../store/documentStore';
import { Document, CreateDocumentDto, UpdateDocumentDto } from '../../types/document';

export default function DocumentsClient() {
  const { documents, fetchDocuments, createDocument, updateDocument, deleteDocument } = useDocumentStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleCreate = async (data: CreateDocumentDto) => {
    await createDocument(data);
    setIsFormOpen(false);
  };

  const handleUpdate = async (data: UpdateDocumentDto) => {
    if (selectedDocument) {
      await updateDocument({ ...data, id: selectedDocument.id });
      setSelectedDocument(null);
      setIsFormOpen(false);
    }
  };

  const handleDelete = async () => {
    if (documentToDelete) {
      console.log('🗑️ About to delete document:', { id: documentToDelete.id, objectName: documentToDelete.objectName });
      await deleteDocument(documentToDelete.id);
      setDocumentToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (document: Document) => {
    console.log('🗑️ Delete clicked for document:', { id: document.id, objectName: document.objectName });
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  // ფუნქცია Document-ის CreateDocumentDto-ში გადასაყვანად
  const convertDocumentToCreateDto = (doc: Document): Partial<CreateDocumentDto> => {
    console.log('🔄 Converting document to DTO:', {
      id: doc.id,
      objectName: doc.objectName,
      hazardsCount: doc.hazards?.length || 0,
      photosCount: doc.photos?.length || 0
    });
    
    return {
      evaluatorName: doc.evaluatorName,
      evaluatorLastName: doc.evaluatorLastName,
      objectName: doc.objectName,
      workDescription: doc.workDescription,
      date: doc.date,
      time: doc.time,
      hazards: doc.hazards || [],
      photos: [] // Photos will be handled separately for editing
    };
  };

  // უნივერსალური onSubmit ფუნქცია
  const handleFormSubmit = async (data: CreateDocumentDto) => {
    if (selectedDocument) {
      // რედაქტირების რეჟიმი - გადავაკეთოთ UpdateDocumentDto-ში
      const updateData: UpdateDocumentDto = {
        id: selectedDocument.id,
        evaluatorName: data.evaluatorName,
        evaluatorLastName: data.evaluatorLastName,
        objectName: data.objectName,
        workDescription: data.workDescription,
        date: data.date,
        time: data.time,
        hazards: data.hazards,
        photos: [] // UpdateDocumentDto-ში photos არის string[]
      };
      await handleUpdate(updateData);
    } else {
      // შექმნის რეჟიმი
      await handleCreate(data);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <h1>დოკუმენტები</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedDocument(null);
            setIsFormOpen(true);
          }}
        >
          ახალი დოკუმენტი
        </Button>
      </Box>

      <DocumentList
        documents={documents}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <DocumentForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedDocument(null);
        }}
        defaultValues={selectedDocument ? convertDocumentToCreateDto(selectedDocument) : undefined}
        onSubmit={handleFormSubmit}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDocumentToDelete(null);
        }}
      >
        <DialogTitle>დოკუმენტის წაშლა</DialogTitle>
        <DialogContent>
          <p>დარწმუნებული ხართ, რომ გსურთ ამ დოკუმენტის წაშლა?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsDeleteDialogOpen(false);
              setDocumentToDelete(null);
            }}
          >
            გაუქმება
          </Button>
          <Button onClick={handleDelete} color="error">
            წაშლა
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 