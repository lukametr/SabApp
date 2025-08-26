import React, { useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { Document, Hazard } from '../types/document';

interface DocumentListProps {
  documents: Document[];
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  onSelect?: (document: Document) => void;
  showMyDocuments?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = React.memo(({ 
  documents, 
  onEdit, 
  onDelete,
  onSelect 
}) => {
  const handleEdit = useCallback((e: React.MouseEvent, doc: Document) => {
    e.stopPropagation();
    onEdit?.(doc);
  }, [onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent, doc: Document) => {
    e.stopPropagation();
    onDelete?.(doc);
  }, [onDelete]);

  const handleSelect = useCallback((doc: Document) => {
    onSelect?.(doc);
  }, [onSelect]);

  const getRiskColor = useCallback((risk: number): string => {
    if (risk <= 3) return 'success';
    if (risk <= 7) return 'warning';
    return 'error';
  }, []);

  const formatDate = useCallback((date: Date | string): string => {
    if (!date) return 'არ არის მითითებული';
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'არავალიდური თარიღი';
    }
    return dateObj.toLocaleDateString('ka-GE');
  }, []);

  const getMaxRisk = useCallback((hazards: Hazard[]): number => {
    if (!hazards || hazards.length === 0) return 0;
    return Math.max(...hazards.map(h => h.residualRisk?.total || 0));
  }, []);

  const getEarliestReviewDate = useCallback((doc: Document): Date | null => {
    if ((doc as any).reviewDate) {
      const d = new Date((doc as any).reviewDate as any);
      if (!isNaN(d.getTime())) return d;
    }
    const hazards = doc.hazards || [];
    if (!hazards || hazards.length === 0) return null;
    const dates = hazards
      .map(h => (h?.reviewDate ? new Date(h.reviewDate as any) : null))
      .filter((d): d is Date => !!d && !isNaN(d.getTime()));
    if (dates.length === 0) return null;
    return new Date(Math.min(...dates.map(d => d.getTime())));
  }, []);

  const getReviewStatus = useCallback((doc: Document): 'overdue' | 'dueSoon' | null => {
    const earliest = getEarliestReviewDate(doc);
    if (!earliest) return null;
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((earliest.getTime() - now.getTime()) / msPerDay);
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 2) return 'dueSoon';
    return null;
  }, [getEarliestReviewDate]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ობიექტის სახელი</TableCell>
            <TableCell>შემფასებელი</TableCell>
            <TableCell>თარიღი</TableCell>
            <TableCell>საფრთხეების რაოდენობა</TableCell>
            <TableCell>მაქსიმალური რისკი</TableCell>
            <TableCell>მოქმედებები</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => (
            <TableRow 
              key={doc.id}
              onClick={() => handleSelect(doc)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <TableCell>
                <Box>
                  <Typography variant="body1">{doc.objectName}</Typography>
                  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography variant="caption" color="textSecondary">
                      {doc.workDescription}
                    </Typography>
                    {(() => {
                      const status = getReviewStatus(doc);
                      if (status === 'overdue') {
                        return <Chip label="ვადაგასული" color="error" size="small" />;
                      }
                      if (status === 'dueSoon') {
                        return <Chip label="მიახლოებული ვადა" color="warning" size="small" />;
                      }
                      return null;
                    })()}
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">
                    {doc.evaluatorName} {doc.evaluatorLastName}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{formatDate(doc.date)}</TableCell>
              <TableCell>
                <Chip 
                  label={doc.hazards?.length || 0}
                  color="primary"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={getMaxRisk(doc.hazards)}
                  color={getRiskColor(getMaxRisk(doc.hazards)) as 'success' | 'warning' | 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <Tooltip title="ნახვა">
                    <IconButton 
                      key={`view-${doc.id}`}
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(doc);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="რედაქტირება">
                    <IconButton 
                      key={`edit-${doc.id}`}
                      size="small" 
                      onClick={(e) => handleEdit(e, doc)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="წაშლა">
                    <IconButton 
                      key={`delete-${doc.id}`}
                      size="small" 
                      onClick={(e) => handleDelete(e, doc)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

DocumentList.displayName = 'DocumentList';

export default DocumentList;