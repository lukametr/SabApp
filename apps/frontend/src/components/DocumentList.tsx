import React, { useCallback } from 'react';
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
import { Document } from '../types/document';

interface DocumentListProps {
  documents: Document[];
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  onSelect?: (document: Document) => void;
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
    return new Date(date).toLocaleDateString('ka-GE');
  }, []);

  const getMaxRisk = useCallback((hazards: any[]): number => {
    if (!hazards || hazards.length === 0) return 0;
    return Math.max(...hazards.map(h => h.residualRisk?.total || 0));
  }, []);

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
              key={doc._id || doc.id}
              onClick={() => handleSelect(doc)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <TableCell>
                <Box>
                  <Typography variant="body1">{doc.objectName}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {doc.workDescription}
                  </Typography>
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

export { DocumentList }; 