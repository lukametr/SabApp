'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Fade,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  GetApp, 
  Close, 
  PhoneIphone, 
  PhoneAndroid,
  MoreVert,
  Share,
  Add
} from '@mui/icons-material';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Check if it's iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Check if app is already installed (running in standalone mode)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                                (window.navigator as any).standalone === true;
    setIsStandalone(isInStandaloneMode);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA: App was installed');
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt for supported browsers
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA: User response to install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS && !isStandalone) {
      // Show iOS instructions
      setShowInstallInstructions(true);
    } else {
      // Show general instructions for other devices
      setShowInstallInstructions(true);
    }
  };

  // Don't show the button if already installed/standalone
  if (isStandalone || isInstalled) {
    return null;
  }

  return (
    <>
      <Card 
        sx={{ 
          backgroundColor: 'primary.main',
          color: 'white',
          boxShadow: 3,
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Box sx={{ mb: 2 }}>
            <GetApp sx={{ fontSize: 48, mb: 1 }} />
          </Box>
          
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            აპლიკაციის დაყენება
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            დააყენეთ SabApp თქვენს {isMobile ? 'ტელეფონზე' : 'კომპიუტერზე'} სწრაფი წვდომისთვის
          </Typography>
          
          <Button
            variant="contained"
            color="secondary"
            onClick={handleInstallClick}
            startIcon={<Add />}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
          >
            მთავარ ეკრანზე დამატება
          </Button>
        </CardContent>
      </Card>

      {/* Installation Instructions Dialog */}
      <Dialog
        open={showInstallInstructions}
        onClose={() => setShowInstallInstructions(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            აპლიკაციის დაყენება
          </Typography>
          <IconButton onClick={() => setShowInstallInstructions(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {isIOS ? (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIphone sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">iOS (iPhone/iPad)</Typography>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                SabApp-ის მთავარ ეკრანზე დასამატებლად:
              </Typography>
              
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 24, 
                    height: 24, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 2,
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    1
                  </Box>
                  <Typography>
                    Safari ბრაუზერში ქვედა ნაწილში დააჭირეთ <Share sx={{ fontSize: 18, mx: 0.5 }} /> ღილაკს
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 24, 
                    height: 24, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 2,
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    2
                  </Box>
                  <Typography>
                    აირჩიეთ "მთავარ ეკრანზე დამატება" <Add sx={{ fontSize: 18, mx: 0.5 }} />
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 24, 
                    height: 24, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 2,
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    3
                  </Box>
                  <Typography>
                    დააჭირეთ "დამატება" ღილაკს
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneAndroid sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Android</Typography>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                SabApp-ის მთავარ ეკრანზე დასამატებლად:
              </Typography>
              
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 24, 
                    height: 24, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 2,
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    1
                  </Box>
                  <Typography>
                    Chrome ბრაუზერში ზედა ნაწილში დააჭირეთ <MoreVert sx={{ fontSize: 18, mx: 0.5 }} /> მენიუს
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 24, 
                    height: 24, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 2,
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    2
                  </Box>
                  <Typography>
                    აირჩიეთ "მთავარ ეკრანზე დამატება" ან "Install app"
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 24, 
                    height: 24, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 2,
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    3
                  </Box>
                  <Typography>
                    დაადასტურეთ დაყენება
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          )}
          
          <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              💡 დაყენების შემდეგ SabApp გამოჩნდება თქვენს მთავარ ეკრანზე და იმუშავებს ჩვეულებრივი აპლიკაციის მსგავსად!
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PWAInstallButton;
