import React, { useRef, useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Checkbox, FormControlLabel, Alert, Chip, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, IconButton, Paper } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ka } from 'date-fns/locale';
import { CreateDocumentDto } from '../types/document';
import { Delete } from '@mui/icons-material';

const PERSONS = [
  'დასაქმებული',
  'ვიზიტორი',
  'კონტრაქტორი',
  'სხვა პირი',
  'ყველა',
];

interface Props {
  onSubmit: (data: CreateDocumentDto, file?: File) => void;
  onCancel?: () => void;
  defaultValues?: Partial<CreateDocumentDto>;
  open: boolean;
  onClose: () => void;
}

const riskOptions = [0, 1, 2, 3, 4, 5];

export function DocumentForm({ onSubmit: handleFormSubmit, onCancel, defaultValues, open, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [riskWarning, setRiskWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(defaultValues?.photos || []);

  const { control, handleSubmit: submitForm, setValue, watch, formState: { errors } } = useForm<CreateDocumentDto>({
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

  // Risk calculation
  React.useEffect(() => {
    const initialProb = Number(watch('initialRisk.probability')) || 0;
    const initialSev = Number(watch('initialRisk.severity')) || 0;
    setValue('initialRisk.total', initialProb + initialSev);
  }, [watch('initialRisk.probability'), watch('initialRisk.severity'), setValue]);

  React.useEffect(() => {
    const residualProb = Number(watch('residualRisk.probability')) || 0;
    const residualSev = Number(watch('residualRisk.severity')) || 0;
    setValue('residualRisk.total', residualProb + residualSev);
    setRiskWarning(residualProb + residualSev >= 9);
  }, [watch('residualRisk.probability'), watch('residualRisk.severity'), setValue]);

  // Camera logic
  const handleCamera = async () => {
    if (!cameraActive) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        setCameraActive(true);
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
      setCameraActive(false);
    }
  };
  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob(blob => {
        if (blob) {
          const capturedFile = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
          setFile(capturedFile);
          setMediaPreview(URL.createObjectURL(blob));
        }
      }, 'image/jpeg');
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // File upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setMediaPreview(URL.createObjectURL(f));
    }
  };

  // Persons logic
  const affectedPersons = watch('affectedPersons');
  const handlePersonChange = (person: string) => {
    let updated: string[] = [];
    if (person === 'ყველა') {
      updated = ['ყველა'];
    } else {
      updated = affectedPersons.includes(person)
        ? affectedPersons.filter(p => p !== person)
        : [...affectedPersons.filter(p => p !== 'ყველა'), person];
    }
    setValue('affectedPersons', updated);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos = Array.from(event.target.files);
      setPhotos([...photos, ...newPhotos]);

      // შევქმნათ preview URLs
      const newPreviewUrls = newPhotos.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    const newPreviewUrls = [...previewUrls];
    newPhotos.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    setPhotos(newPhotos);
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (data: CreateDocumentDto) => {
    console.log('ფორმის მონაცემები:', data);
    console.log('ფოტოები:', photos);
    console.log('მთავარი ფოტო:', file);

    const formattedData = {
      ...data,
      date: data.date.toISOString(),
      time: data.time.toISOString(),
      reviewDate: data.reviewDate.toISOString(),
      photos: photos.filter(photo => photo instanceof File),
    };

    console.log('ფორმატირებული მონაცემები:', formattedData);

    try {
      if (file) {
        await handleFormSubmit(formattedData, file);
      } else {
        await handleFormSubmit(formattedData);
      }
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
            <Grid item xs={12}>
              <Controller name="hazardIdentification" control={control} rules={{ required: true }} render={({ field }) => (
                <TextField {...field} label="საფრთხეთა იდენტიფიკაცია" fullWidth required multiline rows={2} error={!!errors.hazardIdentification} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight={500} mb={1}>ამსახველი ფოტო/ვიდეო მასალა</Typography>
              <Box display="flex" gap={2} alignItems="center">
                <Button variant="outlined" onClick={handleCamera} startIcon={<PhotoCamera />} sx={{ minWidth: 0 }}>
                  კამერა
                </Button>
                <Button variant="outlined" onClick={() => fileInputRef.current?.click()} sx={{ minWidth: 0 }}>
                  ატვირთვა
                </Button>
                <input type="file" ref={fileInputRef} accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileChange} />
                {mediaPreview && <Chip label="ფაილი დამატებულია" color="success" onDelete={() => { setFile(null); setMediaPreview(null); }} />}
              </Box>
              {cameraActive && (
                <Box mt={2}>
                  <video ref={videoRef} autoPlay width={300} height={200} style={{ borderRadius: 8 }} />
                  <Button onClick={handleCapture} variant="contained" sx={{ mt: 1 }}>გადაღება</Button>
                </Box>
              )}
              {mediaPreview && !cameraActive && (
                <Box mt={2}><img src={mediaPreview} alt="preview" style={{ maxWidth: 200, borderRadius: 8 }} /></Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight={500} mb={1}>პირთა წრე</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {PERSONS.map(person => (
                  <FormControlLabel
                    key={person}
                    control={<Checkbox checked={affectedPersons.includes(person)} onChange={() => handlePersonChange(person)} />}
                    label={person}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Controller name="injuryDescription" control={control} rules={{ required: true }} render={({ field }) => (
                <TextField {...field} label="დაშავებულის დაზიანება" fullWidth required multiline rows={2} error={!!errors.injuryDescription} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="existingControlMeasures" control={control} rules={{ required: true }} render={({ field }) => (
                <TextField {...field} label="არსებული კონტროლის ზომები" fullWidth required multiline rows={2} error={!!errors.existingControlMeasures} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight={500} mb={1}>საწყისი რისკი</Typography>
              <Box display="flex" gap={2}>
                <Controller name="initialRisk.probability" control={control} render={({ field }) => (
                  <TextField {...field} select label="ალბათობა" SelectProps={{ native: true }} sx={{ minWidth: 100 }}>
                    {riskOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </TextField>
                )} />
                <Controller name="initialRisk.severity" control={control} render={({ field }) => (
                  <TextField {...field} select label="სიმძიმე" SelectProps={{ native: true }} sx={{ minWidth: 100 }}>
                    {riskOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </TextField>
                )} />
                <TextField label="ჯამი" value={watch('initialRisk.total')} InputProps={{ readOnly: true }} sx={{ minWidth: 100 }} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Controller name="additionalControlMeasures" control={control} rules={{ required: true }} render={({ field }) => (
                <TextField {...field} label="დამატებითი კონტროლის ზომები" fullWidth required multiline rows={2} error={!!errors.additionalControlMeasures} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight={500} mb={1}>ნარჩენი რისკი</Typography>
              <Box display="flex" gap={2}>
                <Controller name="residualRisk.probability" control={control} render={({ field }) => (
                  <TextField {...field} select label="ალბათობა" SelectProps={{ native: true }} sx={{ minWidth: 100 }}>
                    {riskOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </TextField>
                )} />
                <Controller name="residualRisk.severity" control={control} render={({ field }) => (
                  <TextField {...field} select label="სიმძიმე" SelectProps={{ native: true }} sx={{ minWidth: 100 }}>
                    {riskOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </TextField>
                )} />
                <TextField label="ჯამი" value={watch('residualRisk.total')} InputProps={{ readOnly: true }} sx={{ minWidth: 100 }} />
              </Box>
              {riskWarning && <Alert severity="warning" sx={{ mt: 1 }}>საჭიროა დამატებითი კონტროლის ზომები</Alert>}
            </Grid>
            <Grid item xs={12}>
              <Controller name="requiredMeasures" control={control} rules={{ required: true }} render={({ field }) => (
                <TextField {...field} label="გასატარებელი ზომები/რეაგირება" fullWidth required multiline rows={2} error={!!errors.requiredMeasures} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="responsiblePerson" control={control} rules={{ required: true }} render={({ field }) => (
                <TextField {...field} label="შესრულებაზე პასუხისმგებელი" fullWidth required error={!!errors.responsiblePerson} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ka}>
                <Controller name="reviewDate" control={control} rules={{ required: true }} render={({ field }) => (
                  <DatePicker 
                    label="გადახედვის სავარაუდო დრო" 
                    {...field} 
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.reviewDate
                      }
                    }}
                  />
                )} />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                ფოტოები
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                {previewUrls.map((url, index) => (
                  <Paper
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 150,
                      height: 150,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
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
                      onClick={() => handleRemovePhoto(index)}
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
                  onChange={handlePhotoChange}
                />
              </Button>
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