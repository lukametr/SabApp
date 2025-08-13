import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Box, Button, TextField, Typography, Grid, Checkbox, FormControlLabel, Alert, Chip, Dialog, DialogTitle, DialogContent, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ka } from 'date-fns/locale';
import { CreateDocumentDto } from '../types/document';
import { Delete, Add } from '@mui/icons-material';

const PERSONS = [
  'დასაქმებული',
  'ვიზიტორი',
  'კონტრაქტორი',
  'სხვა პირი',
  'ყველა',
];

interface Props {
  onSubmit: (data: CreateDocumentDto) => void;
  onCancel?: () => void;
  defaultValues?: Partial<CreateDocumentDto>;
  open: boolean;
  onClose: () => void;
}

const riskOptions = [0, 1, 2, 3, 4, 5];

// Hazard Section Component
interface HazardData {
  id: string;
  hazardIdentification: string;
  mediaFile?: File;
  mediaPreview?: string;
  affectedPersons: string[];
  injuryDescription: string;
  existingControlMeasures: string;
  initialRisk: { probability: number; severity: number; total: number };
  additionalControlMeasures: string;
  residualRisk: { probability: number; severity: number; total: number };
  requiredMeasures: string;
  responsiblePerson: string;
  reviewDate: Date | null; // Allow null for DatePicker compatibility
  photos: string[]; // Base64 data URLs
}

interface HazardSectionProps {
  hazards: HazardData[];
  onHazardsChange: (hazards: HazardData[]) => void;
}

function HazardSection({ hazards, onHazardsChange }: HazardSectionProps) {
  const [expandedHazard, setExpandedHazard] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const hazardIdRef = useRef<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addHazard = () => {
    const newHazard: HazardData = {
      id: `hazard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hazardIdentification: '',
      affectedPersons: [],
      injuryDescription: '',
      existingControlMeasures: '',
      initialRisk: { probability: 0, severity: 0, total: 0 },
      additionalControlMeasures: '',
      residualRisk: { probability: 0, severity: 0, total: 0 },
      requiredMeasures: '',
      responsiblePerson: '',
      reviewDate: null, // Start with null for DatePicker
      photos: []
    };
    console.log('✅ Added new hazard:', newHazard.id);
    onHazardsChange([...hazards, newHazard]);
    setExpandedHazard(newHazard.id);
  };

  const removeHazard = (id: string) => {
    onHazardsChange(hazards.filter(h => h.id !== id));
  };

  const updateHazard = (id: string, updates: Partial<HazardData>) => {
    const updatedHazards = hazards.map(h => h.id === id ? { ...h, ...updates } : h);
    console.log('[HazardSection] updateHazard', { id, updates, result: updatedHazards.find(h => h.id === id) });
    onHazardsChange(updatedHazards);
  };

  const handleCamera = async (hazardId: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (showCamera) {
      // Stop camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setShowCamera(false);
      setCameraError('');
      return;
    }
    
    // Start camera
    hazardIdRef.current = hazardId;
    setShowCamera(true);
    setCameraError('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment'
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error('Video play error:', err);
          });
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('კამერის ჩართვა ვერ მოხერხდა');
      setShowCamera(false);
    }
  };

  const handleCapturePhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    
    if (context) {
      context.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            handleFileUpload(hazardIdRef.current, base64data);
            // არ დახურო კამერა ავტომატურად
          };
          reader.readAsDataURL(blob);
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const handleFileUpload = (hazardId: string, base64data: string) => {
    const hazard = hazards.find(h => h.id === hazardId);
    if (hazard) {
      // Always add to photos array for persistence
      const newPhotos = [...(hazard.photos || []), base64data];
      updateHazard(hazardId, {
        photos: newPhotos
      });
      console.log('📸 Photo saved:', { hazardId, photoCount: newPhotos.length });
    }
  };

  const handleFileChange = (hazardId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const hazard = hazards.find(h => h.id === hazardId);
      if (hazard) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64DataUrl = reader.result as string;
          console.log('📁 File uploaded:', { fileName: f.name, base64DataUrl: base64DataUrl.substring(0, 50) + '...' });
          // Always add to photos array for persistence
          const newPhotos = [...(hazard.photos || []), base64DataUrl];
          updateHazard(hazardId, {
            mediaFile: f,
            mediaPreview: undefined, // remove preview after save
            photos: newPhotos
          });
        };
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };
        reader.readAsDataURL(f);
      }
    }
  };

  const handlePersonChange = (hazardId: string, person: string) => {
    const hazard = hazards.find(h => h.id === hazardId);
    if (hazard) {
      let updated: string[] = [];
      if (person === 'ყველა') {
        // თუ "ყველა" მონიშნულია/არ არის მონიშნული
        if (hazard.affectedPersons.includes('ყველა')) {
          // თუ "ყველა" უკვე მონიშნულია, მაშინ გავუქმოთ ყველაფერი
          updated = [];
        } else {
          // თუ "ყველა" არ არის მონიშნული, მაშინ დავამატოთ ყველა
          updated = [...PERSONS];
        }
      } else {
        // სხვა პუნქტების შემთხვევაში
        if (hazard.affectedPersons.includes('ყველა')) {
          // თუ "ყველა" მონიშნულია, მაშინ ამოვიღოთ "ყველა" და დავტოვოთ მხოლოდ ეს პუნქტი
          updated = [person];
        } else {
          // ჩვეულებრივი ლოგიკა
          updated = hazard.affectedPersons.includes(person)
            ? hazard.affectedPersons.filter(p => p !== person)
            : [...hazard.affectedPersons, person];
        }
      }
      updateHazard(hazardId, { affectedPersons: updated });
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          საფრთხეთა იდენტიფიკაცია
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addHazard}
        >
          ახალი საფრთხე
        </Button>
      </Box>

      {hazards.map((hazard, index) => (
        <Accordion
          key={hazard.id}
          expanded={expandedHazard === hazard.id}
          onChange={() => setExpandedHazard(expandedHazard === hazard.id ? null : hazard.id)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              <Typography>
                საფრთხე #{index + 1}: {hazard.hazardIdentification || 'შევსებული არ არის'}
              </Typography>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  removeHazard(hazard.id);
                }}
                color="error"
                size="small"
              >
                <Delete />
              </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="საფრთხის იდენტიფიკაცია"
                  fullWidth
                  multiline
                  rows={2}
                  value={hazard.hazardIdentification}
                  onChange={(e) => {
                    console.log('[HazardSection] hazardIdentification change', { id: hazard.id, value: e.target.value });
                    updateHazard(hazard.id, { hazardIdentification: e.target.value });
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography fontWeight={500} mb={1}>ამსახველი ფოტო/ვიდეო მასალა</Typography>
                <Box display="flex" gap={2} alignItems="center">
                  <Button 
                    variant="outlined" 
                    onClick={(e) => handleCamera(hazard.id, e)} 
                    startIcon={<PhotoCamera />} 
                    sx={{ minWidth: 0 }}
                  >
                    კამერა
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => fileInputRef.current?.click()} 
                    sx={{ minWidth: 0 }}
                  >
                    ატვირთვა
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*,video/*" 
                    style={{ display: 'none' }} 
                    onChange={(e) => handleFileChange(hazard.id, e)} 
                  />
                  {hazard.mediaPreview && (
                    <Chip 
                      label="ფაილი დამატებულია" 
                      color="success" 
                      onDelete={() => updateHazard(hazard.id, { mediaFile: undefined, mediaPreview: undefined })} 
                    />
                  )}
                </Box>
                {hazard.photos && hazard.photos.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="body2" mb={1}>შენახული ფოტოები:</Typography>
                    <Grid container spacing={1}>
                      {hazard.photos.map((base64Photo: string, index: number) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Box position="relative" sx={{ width: '100%' }}>
                            <Image 
                              src={base64Photo} // base64 data URL
                              alt={`ფოტო ${index + 1}`}
                              width={150}
                              height={120}
                              unoptimized
                              style={{ 
                                width: '100%', 
                                height: '120px',
                                borderRadius: 8, 
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => {
                                const updatedPhotos = hazard.photos.filter((_: string, i: number) => i !== index);
                                updateHazard(hazard.id, { photos: updatedPhotos } as any);
                              }}
                              sx={{
                                position: 'absolute',
                                top: 2,
                              right: 2,
                              bgcolor: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography fontWeight={500} mb={1}>პირთა წრე</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {PERSONS.map(person => (
                    <FormControlLabel
                      key={person}
                      control={
                        <Checkbox 
                          checked={hazard.affectedPersons.includes(person)}
                          onChange={() => handlePersonChange(hazard.id, person)} 
                        />
                      }
                      label={person}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="დაშავებულის დაზიანება"
                  fullWidth
                  multiline
                  rows={2}
                  value={hazard.injuryDescription}
                  onChange={(e) => {
                    console.log('[HazardSection] injuryDescription change', { id: hazard.id, value: e.target.value });
                    updateHazard(hazard.id, { injuryDescription: e.target.value });
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="არსებული კონტროლის ზომები"
                  fullWidth
                  multiline
                  rows={2}
                  value={hazard.existingControlMeasures}
                  onChange={(e) => {
                    console.log('[HazardSection] existingControlMeasures change', { id: hazard.id, value: e.target.value });
                    updateHazard(hazard.id, { existingControlMeasures: e.target.value });
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography fontWeight={500} mb={1}>საწყისი რისკი</Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    select
                    label="ალბათობა"
                    SelectProps={{ native: true }}
                    sx={{ minWidth: 100 }}
                    value={hazard.initialRisk.probability}
                    onChange={(e) => {
                      const prob = Number(e.target.value);
                      const total = prob * hazard.initialRisk.severity;
                      updateHazard(hazard.id, { 
                        initialRisk: { ...hazard.initialRisk, probability: prob, total } 
                      });
                    }}
                  >
                    {riskOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </TextField>
                  <TextField
                    select
                    label="სიმძიმე"
                    SelectProps={{ native: true }}
                    sx={{ minWidth: 100 }}
                    value={hazard.initialRisk.severity}
                    onChange={(e) => {
                      const sev = Number(e.target.value);
                      const total = hazard.initialRisk.probability * sev;
                      updateHazard(hazard.id, { 
                        initialRisk: { ...hazard.initialRisk, severity: sev, total } 
                      });
                    }}
                  >
                    {riskOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </TextField>
                  <TextField 
                    label="ჯამი" 
                    value={hazard.initialRisk.total} 
                    InputProps={{ readOnly: true }} 
                    sx={{ minWidth: 100 }} 
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="დამატებითი კონტროლის ზომები"
                  fullWidth
                  multiline
                  rows={2}
                  value={hazard.additionalControlMeasures}
                  onChange={(e) => {
                    console.log('[HazardSection] additionalControlMeasures change', { id: hazard.id, value: e.target.value });
                    updateHazard(hazard.id, { additionalControlMeasures: e.target.value });
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography fontWeight={500} mb={1}>ნარჩენი რისკი</Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    select
                    label="ალბათობა"
                    SelectProps={{ native: true }}
                    sx={{ minWidth: 100 }}
                    value={hazard.residualRisk.probability}
                    onChange={(e) => {
                      const prob = Number(e.target.value);
                      const total = prob * hazard.residualRisk.severity;
                      updateHazard(hazard.id, { 
                        residualRisk: { ...hazard.residualRisk, probability: prob, total } 
                      });
                    }}
                  >
                    {riskOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </TextField>
                  <TextField
                    select
                    label="სიმძიმე"
                    SelectProps={{ native: true }}
                    sx={{ minWidth: 100 }}
                    value={hazard.residualRisk.severity}
                    onChange={(e) => {
                      const sev = Number(e.target.value);
                      const total = hazard.residualRisk.probability * sev;
                      updateHazard(hazard.id, { 
                        residualRisk: { ...hazard.residualRisk, severity: sev, total } 
                      });
                    }}
                  >
                    {riskOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </TextField>
                  <TextField 
                    label="ჯამი" 
                    value={hazard.residualRisk.total} 
                    InputProps={{ readOnly: true }} 
                    sx={{ minWidth: 100 }} 
                  />
                </Box>
                {hazard.residualRisk.total >= 9 && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    საჭიროა დამატებითი კონტროლის ზომები
                  </Alert>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="გასატარებელი ზომები/რეაგირება"
                  fullWidth
                  multiline
                  rows={2}
                  value={hazard.requiredMeasures}
                  onChange={(e) => {
                    console.log('[HazardSection] requiredMeasures change', { id: hazard.id, value: e.target.value });
                    updateHazard(hazard.id, { requiredMeasures: e.target.value });
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ka}>
                  <DatePicker
                    label="გადახედვის სავარაუდო დრო"
                    value={hazard.reviewDate}
                    onChange={(date) => updateHazard(hazard.id, { reviewDate: date })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: false // Allow empty initially
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="შესრულებაზე პასუხისმგებელი"
                  fullWidth
                  value={hazard.responsiblePerson}
                  onChange={(e) => {
                    console.log('[HazardSection] responsiblePerson change', { id: hazard.id, value: e.target.value });
                    updateHazard(hazard.id, { responsiblePerson: e.target.value });
                  }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* ახალი საფრთხის დამატების ღილაკი ბოლოში */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={addHazard}
          sx={{ minWidth: 200 }}
        >
          ახალი საფრთხის დამატება
        </Button>
      </Box>

      {/* Camera Modal */}
      {showCamera && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          bgcolor: 'rgba(0,0,0,0.8)', 
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}>
          <Box sx={{ 
            bgcolor: 'white', 
            borderRadius: 2, 
            p: 3, 
            maxWidth: '500px', 
            width: '100%' 
          }}>
            <Typography variant="h6" gutterBottom>
              ფოტოს გადაღება
            </Typography>
            
            {cameraError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {cameraError}
              </Alert>
            )}
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: 'auto',
                backgroundColor: '#000',
                borderRadius: '8px',
                marginBottom: '16px'
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCapturePhoto}
                startIcon={<PhotoCamera />}
              >
                გადაღება
              </Button>
              <Button
                variant="outlined"
                onClick={(e) => handleCamera('', e)}
              >
                გაუქმება
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function DocumentForm({ onSubmit: handleFormSubmit, onCancel, defaultValues, open, onClose }: Props) {
  const [hazards, setHazards] = useState<HazardData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit: submitForm, formState: { errors }, reset, getValues } = useForm<CreateDocumentDto>({
    defaultValues: {
      evaluatorName: '',
      evaluatorLastName: '',
      objectName: '',
      workDescription: '',
      date: new Date(),
      time: new Date(),
      hazards: [],
      photos: []
    },
  });

  // Update form values when defaultValues change or when dialog opens
  useEffect(() => {
    if (open && !isInitialized) {
      setIsInitialized(true);
      
      if (defaultValues) {
        console.log('🔄 DocumentForm received defaultValues:', defaultValues);
        console.log('🔄 Hazards from defaultValues:', defaultValues.hazards);
        // Convert hazards to internal format
        const formattedHazards: HazardData[] = (defaultValues.hazards || []).map((hazard: any, index: number) => {
          console.log(`🔄 Processing hazard ${index}:`, hazard);
          console.log(`🔄 Initial risk:`, hazard.initialRisk);
          console.log(`🔄 Residual risk:`, hazard.residualRisk);
          
          return {
            id: hazard.id || `hazard_${Date.now()}_${Math.random()}`,
            hazardIdentification: hazard.hazardIdentification || '',
            affectedPersons: hazard.affectedPersons || [],
            injuryDescription: hazard.injuryDescription || '',
            existingControlMeasures: hazard.existingControlMeasures || '',
            // Preserve existing risk values exactly as they are, don't reset to 0
            initialRisk: hazard.initialRisk && typeof hazard.initialRisk === 'object' 
              ? { 
                  probability: hazard.initialRisk.probability || 0, 
                  severity: hazard.initialRisk.severity || 0, 
                  total: hazard.initialRisk.total || 0 
                }
              : { probability: 0, severity: 0, total: 0 },
            additionalControlMeasures: hazard.additionalControlMeasures || '',
            residualRisk: hazard.residualRisk && typeof hazard.residualRisk === 'object'
              ? { 
                  probability: hazard.residualRisk.probability || 0, 
                  severity: hazard.residualRisk.severity || 0, 
                  total: hazard.residualRisk.total || 0 
                }
              : { probability: 0, severity: 0, total: 0 },
            requiredMeasures: hazard.requiredMeasures || '',
            responsiblePerson: hazard.responsiblePerson || '',
            reviewDate: hazard.reviewDate ? new Date(hazard.reviewDate) : null, // Keep null if no date
            photos: hazard.photos || []
          };
        });
        setHazards(formattedHazards);
        // Reset form with new values, but do NOT set hazards in reset (let state manage it)
        reset({
          evaluatorName: defaultValues.evaluatorName || '',
          evaluatorLastName: defaultValues.evaluatorLastName || '',
          objectName: defaultValues.objectName || '',
          workDescription: defaultValues.workDescription || '',
          date: defaultValues.date ? new Date(defaultValues.date) : new Date(),
          time: defaultValues.time ? new Date(defaultValues.time) : new Date(),
          photos: defaultValues.photos || []
        });
        console.log('✅ Form reset with values:', {
          evaluatorName: defaultValues.evaluatorName,
          hazardsCount: formattedHazards.length,
          photosCount: defaultValues.photos?.length || 0
        });
      } else {
        // Reset to empty form for new document
        console.log('🆕 Creating new document - resetting form');
        setHazards([]);
        reset({
          evaluatorName: '',
          evaluatorLastName: '',
          objectName: '',
          workDescription: '',
          date: new Date(),
          time: new Date(),
          photos: []
        });
      }
    }
    
    // Reset initialization flag when dialog closes
    if (!open && isInitialized) {
      setIsInitialized(false);
    }
  }, [defaultValues, open, isInitialized]); // Add isInitialized to dependencies

  const handleFormSubmitInternal = async (data: CreateDocumentDto) => {
    // Prevent double submission
    if (isSubmitting) {
      console.log('⚠️ Form submission already in progress, ignoring...');
      return;
    }

    // ველების ვალიდაცია
    if (!data.evaluatorName?.trim() || !data.evaluatorLastName?.trim() || 
        !data.objectName?.trim() || !data.workDescription?.trim()) {
      alert('გთხოვთ შეავსოთ ყველა სავალდებულო ველი');
      return;
    }

    // Set submitting state
    setIsSubmitting(true);

    // საფრთხის გარეშეც შეიძლება დოკუმენტის შექმნა
    const formattedData: CreateDocumentDto = {
      ...data,
      hazards: hazards, // ცარიელიც შეიძლება იყოს
    };

    console.log('📊 Form submission data:', {
      formDataHazards: formattedData.hazards?.length || 0,
      actualHazardsCount: hazards.length,
      hasHazards: !!formattedData.hazards,
      hazardPhotos: hazards.map(h => ({
        id: h.id,
        hasMediaFile: !!(h as any).mediaFile,
        hasMediaPreview: !!(h as any).mediaPreview
      }))
    });

    try {
      // გამარტივება - გადაეცი formattedData რომელიც უკვე შეიცავს hazards-ს
      await handleFormSubmit(formattedData);
      // Don't clean state on successful submit - just close dialog
      handleDialogClose();
    } catch (error) {
      console.error('ფორმის გაგზავნის შეცდომა:', error);
      alert('დოკუმენტის შენახვისას მოხდა შეცდომა');
    } finally {
      // Reset submitting state
      setIsSubmitting(false);
    }
  };

  // Function to handle dialog close without cleanup (for successful submissions)
  const handleDialogClose = () => {
    setIsSubmitting(false);
    onClose();
  };

  // Function to handle dialog close and cleanup (for cancel/escape)
  const handleCloseWithCleanup = () => {
    setIsSubmitting(false);
    // შეამოწმე არის თუ არა ცვლილებები
    const hasChanges = hazards.length > 0 || isFormDirty();
    
    if (hasChanges) {
      const confirmed = window.confirm(
        'გსურთ ფაილის შენახვა? შენახვის გარეშე ყველა ცვლილება დაიკარგება.'
      );
      
      if (confirmed) {
        // სცადე შენახვა
        const formData = getFormData();
        if (formData.evaluatorName?.trim() && formData.evaluatorLastName?.trim() && 
            formData.objectName?.trim() && formData.workDescription?.trim()) {
          handleFormSubmitInternal(formData);
          return;
        } else {
          alert('შენახვისთვის საჭიროა ყველა სავალდებულო ველის შევსება');
          return;
        }
      }
    }
    
    // წაშალე მონაცემები მხოლოდ დასტურის შემდეგ
    setHazards([]);
    setIsInitialized(false);
    reset({
      evaluatorName: '',
      evaluatorLastName: '',
      objectName: '',
      workDescription: '',
      date: new Date(),
      time: new Date(),
      hazards: [],
      photos: []
    });
    onClose();
  };

  // დამხმარე ფუნქციები ცვლილებების შესამოწმებლად
  const isFormDirty = () => {
    const currentValues = getValues();
    return !!(currentValues.evaluatorName || currentValues.evaluatorLastName || 
              currentValues.objectName || currentValues.workDescription);
  };

  const getFormData = () => {
    return getValues();
  };

  // Function to handle cancel
  const handleCancel = () => {
    setHazards([]);
    setIsInitialized(false);
    if (onCancel) {
      onCancel();
    } else {
      handleCloseWithCleanup();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseWithCleanup}
      maxWidth="md"
      fullWidth
      aria-labelledby="document-form-dialog"
      disableRestoreFocus
    >
      <DialogTitle id="document-form-dialog">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={600}>
        {defaultValues ? 'დოკუმენტის რედაქტირება' : 'ახალი დოკუმენტი'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={handleCancel}>
              გაუქმება
            </Button>
            <Button 
              variant="contained" 
              disabled={isSubmitting}
              onClick={() => {
                const formData = getValues();
                handleFormSubmitInternal(formData);
              }}
            >
              {isSubmitting ? 'იშენახება...' : (defaultValues ? 'განახლება' : 'შენახვა')}
            </Button>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box 
          component="div" 
          noValidate 
          sx={{ mt: 2 }}
          role="form"
          tabIndex={-1}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller name="evaluatorName" control={control} rules={{ required: true }} render={({ field }: { field: ControllerRenderProps<CreateDocumentDto, 'evaluatorName'> }) => (
                <TextField {...field} label="შემფასებლის სახელი" fullWidth required error={!!errors.evaluatorName} />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="evaluatorLastName" control={control} rules={{ required: true }} render={({ field }: { field: ControllerRenderProps<CreateDocumentDto, 'evaluatorLastName'> }) => (
                <TextField {...field} label="შემფასებლის გვარი" fullWidth required error={!!errors.evaluatorLastName} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="objectName" control={control} rules={{ required: true }} render={({ field }: { field: ControllerRenderProps<CreateDocumentDto, 'objectName'> }) => (
                <TextField {...field} label="ობიექტის დასახელება" fullWidth required error={!!errors.objectName} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="workDescription" control={control} rules={{ required: true }} render={({ field }: { field: ControllerRenderProps<CreateDocumentDto, 'workDescription'> }) => (
                <TextField {...field} label="სამუშაოს მოკლე აღწერა" fullWidth required multiline rows={2} error={!!errors.workDescription} />
              )} />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ka}>
                <Controller name="date" control={control} rules={{ required: true }} render={({ field }: { field: ControllerRenderProps<CreateDocumentDto, 'date'> }) => (
                  <DatePicker 
                    label="თარიღი" 
                    {...field} 
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.date
                      }
                    }}
                  />
                )} />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ka}>
                <Controller name="time" control={control} rules={{ required: true }} render={({ field }: { field: ControllerRenderProps<CreateDocumentDto, 'time'> }) => (
                  <TimePicker 
                    label="დრო" 
                    {...field} 
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.time
                      }
                    }}
                  />
                )} />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <HazardSection hazards={hazards} onHazardsChange={setHazards} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={handleCancel}>
                  გაუქმება
                </Button>
                <Button type="submit" variant="contained">
                  {defaultValues ? 'განახლება' : 'შენახვა'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}