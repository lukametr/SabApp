import { getSession, useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Box, Container, Paper, Typography, Button, TextField, CircularProgress, Alert } from '@mui/material';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [organization, setOrganization] = useState(session?.user?.organization || '');
  const [position, setPosition] = useState(session?.user?.position || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  if (status === 'loading') {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }
  if (!session) {
    router.push('/auth/login');
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Call your backend API to update user profile
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organization, position }),
      });
      if (!res.ok) throw new Error('პროფილის განახლება ვერ მოხერხდა');
      setSuccess('პროფილი წარმატებით განახლდა!');
    } catch (err: any) {
      setError(err.message || 'შეცდომა პროფილის განახლებისას');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>პროფილი</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>ელ. ფოსტა: {session.user?.email}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>სახელი: {session.user?.name}</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSave} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="ორგანიზაცია"
              value={organization}
              onChange={e => setOrganization(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="პოზიცია"
              value={position}
              onChange={e => setPosition(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>{loading ? <CircularProgress size={24} /> : 'შენახვა'}</Button>
          </Box>
          <Button variant="outlined" color="error" fullWidth onClick={() => signOut({ callbackUrl: '/auth/login' })}>გასვლა</Button>
        </Paper>
      </Container>
    </Box>
  );
}
