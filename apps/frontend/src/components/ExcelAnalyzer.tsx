'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CloudUpload,
  ExpandMore,
  TableChart,
  Assessment,
  GetApp,
  Visibility
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import api from '../lib/api';

interface ExcelAnalysisResult {
  fileName: string;
  sheetCount: number;
  sheets: Array<{
    name: string;
    rowCount: number;
    columnCount: number;
    data: any[][];
    headers: string[];
    summary: {
      totalCells: number;
      emptyCells: number;
      filledCells: number;
      dataTypes: {
        string: number;
        number: number;
        date: number;
        boolean: number;
        formula: number;
      };
    };
  }>;
  metadata: {
    creator?: string;
    created?: Date;
    modified?: Date;
    properties?: any;
  };
}

export default function ExcelAnalyzer() {
  const [analysisResult, setAnalysisResult] = useState<ExcelAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [extractOptions, setExtractOptions] = useState({
    startRow: 2,
    endRow: '',
    columns: ''
  });
  const [extractedData, setExtractedData] = useState<any[] | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('📊 Excel ფაილის ატვირთვა:', file.name);

      const response = await api.post('/excel/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setAnalysisResult(response.data.data);
        setSelectedSheet(response.data.data.sheets[0]?.name || '');
        console.log('✅ Excel ანალიზი დასრულდა:', response.data.data);
      }
    } catch (err: any) {
      console.error('❌ Excel ანალიზის შეცდომა:', err);
      setError(err.response?.data?.message || 'Excel ფაილის ანალიზი ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleExtractData = async () => {
    if (!analysisResult) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      // Re-create file for extraction (this is a limitation, in real app you'd store the file)
      // For now, we'll skip this feature and focus on the analysis
      
      console.log('📊 მონაცემების ექსტრაქტი:', {
        sheet: selectedSheet,
        options: extractOptions
      });

      // This would be the extraction call
      // const response = await api.post('/excel/extract', formData);
      
      alert('მონაცემების ექსტრაქტისთვის გთხოვთ ხელახლა ატვირთოთ ფაილი');
    } catch (err: any) {
      console.error('❌ ექსტრაქტის შეცდომა:', err);
      setError(err.response?.data?.message || 'მონაცემების ექსტრაქტი ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  };

  const renderDataTypeChip = (type: string, count: number) => {
    const colors: { [key: string]: any } = {
      string: 'primary',
      number: 'success',
      date: 'warning',
      boolean: 'info',
      formula: 'secondary'
    };

    return (
      <Chip
        key={type}
        label={`${type}: ${count}`}
        color={colors[type] || 'default'}
        size="small"
        sx={{ m: 0.5 }}
      />
    );
  };

  const renderSheetPreview = (sheet: ExcelAnalysisResult['sheets'][0]) => {
    const previewData = sheet.data.slice(0, 5); // First 5 rows
    const previewHeaders = sheet.headers.slice(0, 10); // First 10 columns

    return (
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {previewHeaders.map((header, index) => (
                <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                  {header || `Column ${index + 1}`}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {previewData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {previewHeaders.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    {row[colIndex] !== null && row[colIndex] !== undefined 
                      ? String(row[colIndex]).slice(0, 50) 
                      : ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Excel ანალიზატორი
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        ატვირთეთ Excel ფაილი მისი შიგთავსის ანალიზისთვის
      </Typography>

      {/* File Upload Area */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          bgcolor: isDragActive ? 'primary.50' : 'background.paper',
          cursor: 'pointer',
          mb: 3,
          transition: 'all 0.2s ease'
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'ფაილის ჩაგდება...' : 'Excel ფაილის ატვირთვა'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          მხარდაჭერილი ფორმატები: .xlsx, .xls (მაქს. 10MB)
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }}>
          ფაილის არჩევა
        </Button>
      </Paper>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Excel ფაილის ანალიზი...</Typography>
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <Box>
          <Typography variant="h5" gutterBottom>
            📋 ანალიზის შედეგები
          </Typography>

          {/* File Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">📄 ფაილის ინფორმაცია</Typography>
                  <Typography>ფაილის სახელი: {analysisResult.fileName}</Typography>
                  <Typography>Sheet-ების რაოდენობა: {analysisResult.sheetCount}</Typography>
                  {analysisResult.metadata.creator && (
                    <Typography>შემქმნელი: {analysisResult.metadata.creator}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">📊 სტატისტიკა</Typography>
                  <Typography>
                    სულ სტრიქონები: {analysisResult.sheets.reduce((sum, sheet) => sum + sheet.rowCount, 0)}
                  </Typography>
                  <Typography>
                    სულ უჯრები: {analysisResult.sheets.reduce((sum, sheet) => sum + sheet.summary.totalCells, 0)}
                  </Typography>
                  <Typography>
                    შევსებული უჯრები: {analysisResult.sheets.reduce((sum, sheet) => sum + sheet.summary.filledCells, 0)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Sheets Analysis */}
          {analysisResult.sheets.map((sheet, index) => (
            <Accordion key={index} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TableChart />
                  <Typography variant="h6">{sheet.name}</Typography>
                  <Chip label={`${sheet.rowCount} სტრიქონი`} size="small" />
                  <Chip label={`${sheet.columnCount} სვეტი`} size="small" />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {/* Sheet Statistics */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>📈 სტატისტიკა</Typography>
                    <Typography>სულ უჯრები: {sheet.summary.totalCells}</Typography>
                    <Typography>შევსებული: {sheet.summary.filledCells}</Typography>
                    <Typography>ცარიელი: {sheet.summary.emptyCells}</Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>მონაცემების ტიპები:</Typography>
                      {Object.entries(sheet.summary.dataTypes).map(([type, count]) => 
                        count > 0 && renderDataTypeChip(type, count)
                      )}
                    </Box>
                  </Grid>

                  {/* Headers */}
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>📋 სვეტების სათაურები</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {sheet.headers.slice(0, 20).map((header, i) => (
                        <Chip 
                          key={i} 
                          label={header || `Column ${i + 1}`} 
                          variant="outlined" 
                          size="small" 
                        />
                      ))}
                      {sheet.headers.length > 20 && (
                        <Typography variant="caption">
                          ... და კიდევ {sheet.headers.length - 20} სვეტი
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* Data Preview */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      <Visibility sx={{ mr: 1 }} />
                      მონაცემების ნიმუში (პირველი 5 სტრიქონი)
                    </Typography>
                    {renderSheetPreview(sheet)}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Data Extraction Options */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <GetApp sx={{ mr: 1 }} />
                მონაცემების ექსტრაქტი
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Sheet</InputLabel>
                    <Select
                      value={selectedSheet}
                      onChange={(e) => setSelectedSheet(e.target.value)}
                    >
                      {analysisResult.sheets.map((sheet) => (
                        <MenuItem key={sheet.name} value={sheet.name}>
                          {sheet.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="საწყისი სტრიქონი"
                    type="number"
                    value={extractOptions.startRow}
                    onChange={(e) => setExtractOptions({...extractOptions, startRow: parseInt(e.target.value)})}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="ბოლო სტრიქონი"
                    type="number"
                    value={extractOptions.endRow}
                    onChange={(e) => setExtractOptions({...extractOptions, endRow: e.target.value})}
                    fullWidth
                    placeholder="ავტომატური"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    onClick={handleExtractData}
                    disabled={loading}
                    fullWidth
                    sx={{ height: '56px' }}
                  >
                    ექსტრაქტი
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}
