'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { DocumentList, DocumentForm } from '../../components';
import { useDocumentStore } from '../../store/documentStore';
import { Document } from '../../types/document';

export default function DocumentsPage() {
  const { documents, fetchDocuments, createDocument, updateDocument, deleteDocument } = useDocumentStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleCreate = async (data: any) => {
    await createDocument(data);
    setIsFormOpen(false);
  };

  const handleUpdate = async (data: any) => {
    if (selectedDocument) {
      await updateDocument({ ...data, id: selectedDocument.id });
      setSelectedDocument(null);
      setIsFormOpen(false);
    }
  };

  const handleDelete = async () => {
    if (documentToDelete) {
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
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
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
        defaultValues={selectedDocument || undefined}
        onSubmit={selectedDocument ? handleUpdate : handleCreate}
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