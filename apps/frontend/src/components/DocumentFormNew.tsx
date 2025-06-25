import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Box, Button, TextField, Typography, Grid, Checkbox, FormControlLabel, Alert, Chip, Dialog, DialogTitle, DialogContent, IconButton, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm, Controller } from 'react-hook-form';
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
  reviewDate: Date;
  photos: File[];
  previewUrls: string[];
}

interface HazardSectionProps {
  hazards: HazardData[];
  onHazardsChange: (hazards: HazardData[]) => void;
}

function HazardSection({ hazards, onHazardsChange }: HazardSectionProps) {
  const [expandedHazard, setExpandedHazard] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addHazard = () => {
    const newHazard: HazardData = {
      id: Date.now().toString(),
      hazardIdentification: '',
      affectedPersons: [],
      injuryDescription: '',
      existingControlMeasures: '',
      initialRisk: { probability: 0, severity: 0, total: 0 },
      additionalControlMeasures: '',
      residualRisk: { probability: 0, severity: 0, total: 0 },
      requiredMeasures: '',
      responsiblePerson: '',
      reviewDate: new Date(),
      photos: [],
      previewUrls: []
    };
    onHazardsChange([...hazards, newHazard]);
    setExpandedHazard(newHazard.id);
  };

  const removeHazard = (id: string) => {
    onHazardsChange(hazards.filter(h => h.id !== id));
  };

  const updateHazard = (id: string, updates: Partial<HazardData>) => {
    onHazardsChange(hazards.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const handleCamera = async (hazardId: string) => {
    if (cameraActive !== hazardId) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        setCameraActive(hazardId);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch {
        alert('კამერასთან წვდომა ვერ მოხერხდა');
      }
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setCameraActive(null);
    }
  };

  const handleCapture = (hazardId: string) => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob(blob => {
        if (blob) {
          const capturedFile = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
          const hazard = hazards.find(h => h.id === hazardId);
          if (hazard) {
            updateHazard(hazardId, {
              mediaFile: capturedFile,
              mediaPreview: URL.createObjectURL(blob)
            });
          }
        }
      }, 'image/jpeg');
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(null);
  };

  const handleFileChange = (hazardId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const hazard = hazards.find(h => h.id === hazardId);
      if (hazard) {
        updateHazard(hazardId, {
          mediaFile: f,
          mediaPreview: URL.createObjectURL(f)
        });
      }
    }
  };

  const handlePersonChange = (hazardId: string, person: string) => {
    const hazard = hazards.find(h => h.id === hazardId);
    if (hazard) {
      let updated: string[] = [];
      if (person === 'ყველა') {
        updated = ['ყველა'];
      } else {
        updated = hazard.affectedPersons.includes(person)
          ? hazard.affectedPersons.filter(p => p !== person)
          : [...hazard.affectedPersons.filter(p => p !== 'ყველა'), person];
      }
      updateHazard(hazardId, { affectedPersons: updated });
    }
  };

  const handlePhotoChange = (hazardId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos = Array.from(event.target.files);
      const hazard = hazards.find(h => h.id === hazardId);
      if (hazard) {
        const updatedPhotos = [...hazard.photos, ...newPhotos];
        const newPreviewUrls = newPhotos.map(file => URL.createObjectURL(file));
        const updatedPreviewUrls = [...hazard.previewUrls, ...newPreviewUrls];
        updateHazard(hazardId, {
          photos: updatedPhotos,
          previewUrls: updatedPreviewUrls
        });
      }
    }
  };

  const handleRemovePhoto = (hazardId: string, index: number) => {
    const hazard = hazards.find(h => h.id === hazardId);
    if (hazard) {
      const newPhotos = [...hazard.photos];
      const newPreviewUrls = [...hazard.previewUrls];
      newPhotos.splice(index, 1);
      newPreviewUrls.splice(index, 1);
      updateHazard(hazardId, {
        photos: newPhotos,
        previewUrls: newPreviewUrls
      });
    }
  };

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
                  onChange={(e) => updateHazard(hazard.id, { hazardIdentification: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography fontWeight={500} mb={1}>ამსახველი ფოტო/ვიდეო მასალა</Typography>
                <Box display="flex" gap={2} alignItems="center">
                  <Button 
                    variant="outlined" 
                    onClick={() => handleCamera(hazard.id)} 
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
                {cameraActive === hazard.id && (
                  <Box mt={2}>
                    <video ref={videoRef} autoPlay width={300} height={200} style={{ borderRadius: 8 }} />
                    <Button onClick={() => handleCapture(hazard.id)} variant="contained" sx={{ mt: 1 }}>
                      გადაღება
                    </Button>
                  </Box>
                )}
                {hazard.mediaPreview && cameraActive !== hazard.id && (
                  <Box mt={2}>
                    <Image 
                      src={hazard.mediaPreview} 
                      alt="preview" 
                      width={200}
                      height={150}
                      style={{ maxWidth: 200, borderRadius: 8, objectFit: 'cover' }}
                    />
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
                  onChange={(e) => updateHazard(hazard.id, { injuryDescription: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="არსებული კონტროლის ზომები"
                  fullWidth
                  multiline
                  rows={2}
                  value={hazard.existingControlMeasures}
                  onChange={(e) => updateHazard(hazard.id, { existingControlMeasures: e.target.value })}
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
                      const total = prob + hazard.initialRisk.severity;
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
                      const total = hazard.initialRisk.probability + sev;
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
                  onChange={(e) => updateHazard(hazard.id, { additionalControlMeasures: e.target.value })}
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
                      const total = prob + hazard.residualRisk.severity;
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
                      const total = hazard.residualRisk.probability + sev;
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
                  onChange={(e) => updateHazard(hazard.id, { requiredMeasures: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="შესრულებაზე პასუხისმგებელი"
                  fullWidth
                  value={hazard.responsiblePerson}
                  onChange={(e) => updateHazard(hazard.id, { responsiblePerson: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ka}>
                  <DatePicker
                    label="გადახედვის სავარაუდო დრო"
                    value={hazard.reviewDate}
                    onChange={(date) => date && updateHazard(hazard.id, { reviewDate: date })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  ფოტოები
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                  {hazard.previewUrls.map((url, index) => (
                    <Paper
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 150,
                        height: 150,
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        width={150}
                        height={150}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          bgcolor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                        }}
                        onClick={() => handleRemovePhoto(hazard.id, index)}
                      >
                        <Delete />
                      </IconButton>
                    </Paper>
                  ))}
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  ფოტოების ატვირთვა
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(hazard.id, e)}
                  />
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

interface Props {
  onSubmit: (data: CreateDocumentDto, file?: File) => void;
  onCancel?: () => void;
  defaultValues?: Partial<CreateDocumentDto>;
  open: boolean;
  onClose: () => void;
}

export function DocumentForm({ onSubmit: handleFormSubmit, onCancel, defaultValues, open, onClose }: Props) {
  const [hazards, setHazards] = useState<HazardData[]>([]);

  const { control, handleSubmit: submitForm, formState: { errors } } = useForm<CreateDocumentDto>({
    defaultValues: defaultValues || {
      evaluatorName: '',
      evaluatorLastName: '',
      objectName: '',
      workDescription: '',
      date: new Date(),
      time: new Date(),
      hazardIdentification: '',
      affectedPersons: [],
      injuryDescription: '',
      existingControlMeasures: '',
      initialRisk: { probability: 0, severity: 0, total: 0 },
      additionalControlMeasures: '',
      residualRisk: { probability: 0, severity: 0, total: 0 },
      requiredMeasures: '',
      responsiblePerson: '',
      reviewDate: new Date(),
    },
  });

  const handleSubmit = async (data: CreateDocumentDto) => {
    console.log('ფორმის მონაცემები:', data);
    console.log('საფრთხეები:', hazards);

    // Convert hazards to the format expected by backend
    const formattedHazards = hazards.map(hazard => ({
      hazardIdentification: hazard.hazardIdentification,
      affectedPersons: hazard.affectedPersons,
      injuryDescription: hazard.injuryDescription,
      existingControlMeasures: hazard.existingControlMeasures,
      initialRisk: hazard.initialRisk,
      additionalControlMeasures: hazard.additionalControlMeasures,
      residualRisk: hazard.residualRisk,
      requiredMeasures: hazard.requiredMeasures,
      responsiblePerson: hazard.responsiblePerson,
      reviewDate: hazard.reviewDate,
      photos: hazard.photos
    }));

    // Combine form data with hazards
    const formattedData = {
      ...data,
      date: data.date,
      time: data.time,
      hazards: formattedHazards
    };

    console.log('ფორმატირებული მონაცემები:', formattedData);

    try {
      await handleFormSubmit(formattedData);
      onClose();
    } catch (error) {
      console.error('ფორმის გაგზავნის შეცდომა:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="document-form-dialog"
    >
      <DialogTitle id="document-form-dialog">
        {defaultValues ? 'დოკუმენტის რედაქტირება' : 'ახალი დოკუმენტი'}
      </DialogTitle>
      <DialogContent>
        <Box 
          component="form" 
          onSubmit={submitForm(handleSubmit)} 
          noValidate 
          sx={{ mt: 2 }}
          role="form"
          tabIndex={-1}
        >
          <Typography variant="h5" mb={2} fontWeight={600}>ახალი დოკუმენტი</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller name="evaluatorName" control={control} rules={{ required: true }} render={({ field }) => (
                <TextField {...field} label="შემფასებლის სახელი" fullWidth required error={!!errors.evaluatorName} />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="evaluatorLastName" control={control} rules={{ required: true }} render={({ field }) => (
                <TextField {...field} label="შემფასებლის გვარი" fullWidth required error={!!errors.evaluatorLastName} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="objectName" control={control} rules={{ required: true }} render={({ field }) => (
                <TextField {...field} label="ობიექტის დასახელება" fullWidth required error={!!errors.objectName} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="workDescription" control={control} rules={{ required: true }} render={({ field }) => (
                <TextField {...field} label="სამუშაოს მოკლე აღწერა" fullWidth required multiline rows={2} error={!!errors.workDescription} />
              )} />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ka}>
                <Controller name="date" control={control} rules={{ required: true }} render={({ field }) => (
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
                <Controller name="time" control={control} rules={{ required: true }} render={({ field }) => (
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
            
            {/* Hazard Section */}
            <Grid item xs={12}>
              <HazardSection 
                hazards={hazards}
                onHazardsChange={setHazards}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={onCancel}>
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