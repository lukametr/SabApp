import React from 'react';
import { Document } from '../types/document';
import { Card, CardContent, Typography, Grid, Box, IconButton, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder, Download, Edit, Delete } from '@mui/icons-material';
import { useDocumentStore } from '../store/documentStore';
import { format } from 'date-fns';
import { ka } from 'date-fns/locale';

interface DocumentViewProps {
  document: Document;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const DocumentView: React.FC<DocumentViewProps> = ({ document, onEdit, onDelete }) => {
  const { toggleFavorite, downloadDocument } = useDocumentStore();

  const handleFavoriteClick = async () => {
    await toggleFavorite(document.id);
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadDocument(document.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.filePath || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            {document.objectName}
          </Typography>
          <Box>
            <Tooltip title={document.isFavorite ? 'ფავორიტებიდან ამოშლა' : 'ფავორიტებში დამატება'}>
              <IconButton onClick={handleFavoriteClick}>
                {document.isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title="ჩამოტვირთვა">
              <IconButton onClick={handleDownload}>
                <Download />
              </IconButton>
            </Tooltip>
            {onEdit && (
              <Tooltip title="რედაქტირება">
                <IconButton onClick={onEdit}>
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="წაშლა">
                <IconButton onClick={onDelete}>
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              შემფასებელი
            </Typography>
            <Typography variant="body1">
              {document.evaluatorName} {document.evaluatorLastName}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              თარიღი და დრო
            </Typography>
            <Typography variant="body1">
              {format(new Date(document.date), 'dd MMMM yyyy', { locale: ka })} {document.time}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              სამუშაოს აღწერა
            </Typography>
            <Typography variant="body1">{document.workDescription}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              საფრთხის იდენტიფიკაცია
            </Typography>
            <Typography variant="body1">{document.hazardIdentification}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              დაზარალებული პირები
            </Typography>
            <Typography variant="body1">{document.affectedPersons.join(', ')}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              დაზიანების აღწერა
            </Typography>
            <Typography variant="body1">{document.injuryDescription}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              არსებული კონტროლის ზომები
            </Typography>
            <Typography variant="body1">{document.existingControlMeasures}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">საწყისი რისკი</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  ალბათობა
                </Typography>
                <Typography variant="body1">{document.initialRisk.probability}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  სიმძიმე
                </Typography>
                <Typography variant="body1">{document.initialRisk.severity}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  ჯამი
                </Typography>
                <Typography variant="body1">{document.initialRisk.total}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              დამატებითი კონტროლის ზომები
            </Typography>
            <Typography variant="body1">{document.additionalControlMeasures}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">დარჩენილი რისკი</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  ალბათობა
                </Typography>
                <Typography variant="body1">{document.residualRisk.probability}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  სიმძიმე
                </Typography>
                <Typography variant="body1">{document.residualRisk.severity}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  ჯამი
                </Typography>
                <Typography variant="body1">{document.residualRisk.total}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              საჭირო ზომები
            </Typography>
            <Typography variant="body1">{document.requiredMeasures}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              პასუხისმგებელი პირი
            </Typography>
            <Typography variant="body1">{document.responsiblePerson}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              განხილვის თარიღი
            </Typography>
            <Typography variant="body1">
              {format(new Date(document.reviewDate), 'dd MMMM yyyy', { locale: ka })}
            </Typography>
          </Grid>

          {document.filePath && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                დოკუმენტი
              </Typography>
              <Typography variant="body1">{document.filePath}</Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}; 