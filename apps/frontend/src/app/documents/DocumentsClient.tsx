'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Stack, Chip } from '@mui/material';
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
      setIsFormOpen(false); // Just close the form, don't clear selectedDocument yet
      // setSelectedDocument(null); // Don't clear here, let dialog close handle it
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
  ...(doc.reviewDate ? { reviewDate: doc.reviewDate } : {}),
      hazards: doc.hazards || [],
      // რედაქტირებისას არ ვაწვდით photos-ს CreateDocumentDto-ში რადგან ისინი string[] არიან, არა File[]
      // photos ცალკე იმუშავებენ UpdateDocumentDto-ში
    };
  };

  // უნივერსალური onSubmit ფუნქცია
  // hazardsFix: always get hazards from DocumentForm local state, not from data.hazards
  const handleFormSubmit = async (data: CreateDocumentDto, hazardsOverride?: any[]) => {
    const hazardsToSend = Array.isArray(hazardsOverride) ? hazardsOverride : data.hazards;
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
        hazards: hazardsToSend,
        reviewDate: data.reviewDate,
        photos: selectedDocument.photos || [] // Keep existing photos from selected document (string[])
      };
      await handleUpdate(updateData);
    } else {
      // შექმნის რეჟიმი
      await handleCreate({ ...data, hazards: hazardsToSend });
    }
  };

  return (
    <Box p={3}>
      {/* Review date alerts: overdue (red) and due soon (yellow) */}
      {(() => {
        const msPerDay = 24 * 60 * 60 * 1000;
        const now = new Date();

        // Helper: get earliest valid review date in a document (across hazards)
        const getDocumentReviewDate = (doc: Document): Date | null => {
          if (doc.reviewDate) {
            const d = new Date(doc.reviewDate as any);
            if (!isNaN(d.getTime())) return d;
          }
          const dates = (doc.hazards || [])
            .map(h => (h?.reviewDate ? new Date(h.reviewDate as any) : null))
            .filter((d): d is Date => !!d && !isNaN(d.getTime()));
          if (!dates.length) return null;
          return new Date(Math.min(...dates.map(d => d.getTime())));
        };

        const classified = documents.map(doc => {
          const earliest = getDocumentReviewDate(doc);
          if (!earliest) return { doc, status: null as 'overdue' | 'dueSoon' | null };
          const diffMs = earliest.getTime() - now.getTime();
          const diffDays = Math.floor(diffMs / msPerDay);
          if (diffDays < 0) return { doc, status: 'overdue' as 'overdue' };
          if (diffDays <= 2) return { doc, status: 'dueSoon' as 'dueSoon' };
          return { doc, status: null as null };
        });

        const overdueDocs = classified.filter(c => c.status === 'overdue').map(c => c.doc);
        const dueSoonDocs = classified.filter(c => c.status === 'dueSoon').map(c => c.doc);

        return (
          <Stack spacing={2} mb={2}>
            {overdueDocs.length > 0 && (
        <Alert severity="error">
                <Box display="flex" flexDirection="column" gap={1}>
          <strong>თქვენს ობიექტზე სავარაუდო გადახედვის დრო ვადაგასულია</strong>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {overdueDocs.slice(0, 6).map(d => (
                      <Chip key={d.id} label={d.objectName} color="error" size="small" />
                    ))}
                    {overdueDocs.length > 6 && (
                      <Chip label={`და კიდევ ${overdueDocs.length - 6}`} color="error" size="small" variant="outlined" />
                    )}
                  </Box>
                </Box>
              </Alert>
            )}
            {dueSoonDocs.length > 0 && (
        <Alert severity="warning">
                <Box display="flex" flexDirection="column" gap={1}>
          <strong>გაფრთხილება: თქვენს ობიექტზე სავარაუდო გადახედვის დრო 2 დღეზე ნაკლებია</strong>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {dueSoonDocs.slice(0, 6).map(d => (
                      <Chip key={d.id} label={d.objectName} color="warning" size="small" />
                    ))}
                    {dueSoonDocs.length > 6 && (
                      <Chip label={`და კიდევ ${dueSoonDocs.length - 6}`} color="warning" size="small" variant="outlined" />
                    )}
                  </Box>
                </Box>
              </Alert>
            )}
          </Stack>
        );
      })()}

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
          setSelectedDocument(null); // Now clear selectedDocument only when dialog is fully closed
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