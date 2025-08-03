import React from 'react';
import { Document } from '../types/document';
import { Card, CardContent, Typography, Grid, Box, IconButton, Tooltip, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import { Download, Edit, Delete, ExpandMore } from '@mui/icons-material';
import { TableChart, PictureAsPdf } from '@mui/icons-material'; // Excel და PDF იკონები
import { useDocumentStore } from '../store/documentStore';
import { format } from 'date-fns';
import { ka } from 'date-fns/locale';
import Image from 'next/image';

interface DocumentViewProps {
  document: Document;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const DocumentView: React.FC<DocumentViewProps> = ({ document, onEdit, onDelete }) => {
  const { toggleFavorite, downloadDocument } = useDocumentStore();

  React.useEffect(() => {
    console.log('📋 Document view loaded:', {
      id: document.id,
      hazardsCount: document.hazards?.length || 0,
      photosCount: document.photos?.length || 0,
      hazardPhotos: document.hazards?.map((h, index) => ({
        index,
        id: h.id,
        photosCount: h.photos?.length || 0
      })) || []
    });
  }, [document]);

  const handleFavoriteClick = async () => {
    await toggleFavorite(document.id);
  };

  const handleDownload = async () => {
    try {
      console.log('📥 Starting download for document:', document.id);
      const blob = await downloadDocument(document.id);
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      
      // Create descriptive filename
      const sanitizedName = document.objectName 
        ? document.objectName.replace(/[^a-zA-Z0-9\u10A0-\u10FF\s-]/g, '') 
        : 'document';
      
      const filename = `${sanitizedName}_${document.evaluatorName || 'unknown'}_${new Date().toISOString().split('T')[0]}.zip`;
      
      a.download = filename;
      console.log('📦 Download filename:', filename);
      
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
      
      console.log('✅ Download completed');
    } catch (error) {
      console.error('❌ Error downloading document:', error);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      console.log('📊 Starting Excel download for document:', document.id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${document.id}/download/excel`);
      
      if (!response.ok) {
        throw new Error('Excel ფაილის ჩამოტვირთვა ვერ მოხერხდა');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      
      const sanitizedName = document.objectName 
        ? document.objectName.replace(/[^a-zA-Z0-9\u10A0-\u10FF\s-]/g, '') 
        : 'document';
      
      const filename = `უსაფრთხოების-შეფასება-${sanitizedName}-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      a.download = filename;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Excel download completed:', filename);
    } catch (error) {
      console.error('❌ Excel download failed:', error);
      alert('Excel რეპორტის ჩამოტვირთვა ვერ მოხერხდა');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      console.log('📄 Starting PDF download for document:', document.id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${document.id}/download/pdf`);
      
      if (!response.ok) {
        throw new Error('PDF ფაილის ჩამოტვირთვა ვერ მოხერხდა');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      
      const sanitizedName = document.objectName 
        ? document.objectName.replace(/[^a-zA-Z0-9\u10A0-\u10FF\s-]/g, '') 
        : 'document';
      
      const filename = `უსაფრთხოების-შეფასება-${sanitizedName}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      a.download = filename;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ PDF download completed:', filename);
    } catch (error) {
      console.error('❌ PDF download failed:', error);
      alert('PDF რეპორტის ჩამოტვირთვა ვერ მოხერხდა');
    }
  };

  const getRiskColor = (risk: number): string => {
    if (risk <= 3) return 'success';
    if (risk <= 7) return 'warning';
    return 'error';
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            {document.objectName}
          </Typography>
          <Box>
            {/* ფავორიტების ღილაკი დამალული */}
            {/* <Tooltip title={document.isFavorite ? 'ფავორიტებიდან ამოშლა' : 'ფავორიტებში დამატება'}>
              <IconButton onClick={handleFavoriteClick}>
                {document.isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip> */}
            
            {/* მასალების ჩამოტვირთვის ღილაკი დამალული */}
            {/* <Tooltip title="ჩამოტვირთვა (ZIP)">
              <IconButton onClick={handleDownload}>
                <Download />
              </IconButton>
            </Tooltip> */}
            
            <Tooltip title="Excel რეპორტი">
              <IconButton onClick={handleDownloadExcel} color="success">
                <TableChart />
              </IconButton>
            </Tooltip>
            <Tooltip title="PDF რეპორტი">
              <IconButton onClick={handleDownloadPDF} color="error">
                <PictureAsPdf />
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
              {document.date && !isNaN(new Date(document.date).getTime()) ? format(new Date(document.date), 'dd MMMM yyyy', { locale: ka }) : 'არავალიდური თარიღი'} {document.time && !isNaN(new Date(document.time).getTime()) ? format(new Date(document.time), 'HH:mm') : 'არავალიდური დრო'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              სამუშაოს აღწერა
            </Typography>
            <Typography variant="body1">{document.workDescription}</Typography>
          </Grid>

          {/* Display document photos if available */}
          {document.photos && document.photos.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                დოკუმენტის ფოტოები
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {document.photos.map((base64Photo, photoIndex) => (
                  <Image
                    key={photoIndex}
                    src={typeof base64Photo === 'string' ? base64Photo : ''}
                    alt={`დოკუმენტის ფოტო ${photoIndex + 1}`}
                    width={200}
                    height={150}
                    unoptimized
                    style={{ 
                      borderRadius: 8, 
                      objectFit: 'cover',
                      border: '1px solid #e0e0e0'
                    }}
                  />
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              საფრთხეთა იდენტიფიკაცია ({document.hazards?.length || 0} საფრთხე)
            </Typography>
            
            {document.hazards?.map((hazard, index) => {
              // Safe access to risk data with fallbacks
              const residualRisk = hazard.residualRisk || { probability: 0, severity: 0, total: 0 };
              const initialRisk = hazard.initialRisk || { probability: 0, severity: 0, total: 0 };
              
              // Calculate total if missing (fallback for old data)
              if (residualRisk.total === undefined || residualRisk.total === null) {
                residualRisk.total = (residualRisk.probability || 0) * (residualRisk.severity || 0);
              }
              if (initialRisk.total === undefined || initialRisk.total === null) {
                initialRisk.total = (initialRisk.probability || 0) * (initialRisk.severity || 0);
              }

              return (
              <Accordion key={hazard.id || index} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography>
                      საფრთხე #{index + 1}: {hazard.hazardIdentification}
                    </Typography>
                    <Chip 
                      label={`რისკი: ${residualRisk.total}`}
                      color={getRiskColor(residualRisk.total) as 'success' | 'warning' | 'error'}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        დაზარალებული პირები
                      </Typography>
                      <Typography variant="body1">{hazard.affectedPersons.join(', ')}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        დაზიანების აღწერა
                      </Typography>
                      <Typography variant="body1">{hazard.injuryDescription}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        არსებული კონტროლის ზომები
                      </Typography>
                      <Typography variant="body1">{hazard.existingControlMeasures}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6">საწყისი რისკი</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            ალბათობა
                          </Typography>
                          <Typography variant="body1">{initialRisk.probability}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            სიმძიმე
                          </Typography>
                          <Typography variant="body1">{initialRisk.severity}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            ჯამი
                          </Typography>
                          <Typography variant="body1">{initialRisk.total}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        დამატებითი კონტროლის ზომები
                      </Typography>
                      <Typography variant="body1">{hazard.additionalControlMeasures}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6">დარჩენილი რისკი</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            ალბათობა
                          </Typography>
                          <Typography variant="body1">{residualRisk.probability}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            სიმძიმე
                          </Typography>
                          <Typography variant="body1">{residualRisk.severity}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            ჯამი
                          </Typography>
                          <Typography variant="body1">{residualRisk.total}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        საჭირო ზომები
                      </Typography>
                      <Typography variant="body1">{hazard.requiredMeasures}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        პასუხისმგებელი პირი
                      </Typography>
                      <Typography variant="body1">{hazard.responsiblePerson}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        განხილვის თარიღი
                      </Typography>
                      <Typography variant="body1">
                        {hazard.reviewDate && !isNaN(new Date(hazard.reviewDate).getTime()) ? format(new Date(hazard.reviewDate), 'dd MMMM yyyy', { locale: ka }) : 'არ არის მითითებული'}
                      </Typography>
                    </Grid>

                    {/* Display base64 photos if available */}
                    {hazard.photos && hazard.photos.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                          ფოტოები ({hazard.photos.length})
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {hazard.photos.map((base64Photo, photoIndex) => {
                            console.log('📸 Rendering photo:', { 
                              hazardIndex: index, 
                              photoIndex, 
                              photoType: typeof base64Photo,
                              photoStart: typeof base64Photo === 'string' ? base64Photo.substring(0, 30) : 'not string'
                            });
                            return (
                              <Image
                                key={photoIndex}
                                src={typeof base64Photo === 'string' ? base64Photo : ''}
                                alt={`საფრთხე ${index + 1} ფოტო ${photoIndex + 1}`}
                                width={200}
                                height={150}
                                unoptimized
                                style={{ 
                                  borderRadius: 8, 
                                  objectFit: 'cover',
                                  border: '1px solid #e0e0e0'
                                }}
                                onLoad={() => console.log('✅ Hazard photo loaded:', { hazardIndex: index, photoIndex })}
                                onError={(e) => console.error('❌ Hazard photo failed to load:', { hazardIndex: index, photoIndex, error: e })}
                              />
                            );
                          })}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
            })}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DocumentView;