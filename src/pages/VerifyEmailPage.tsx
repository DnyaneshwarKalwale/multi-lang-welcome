import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, Typography, TextField, CircularProgress, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';

const VerifyEmailPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If user is already verified, redirect to dashboard
    if (user?.isEmailVerified) {
      navigate('/dashboard');
    }
    // If no user is logged in, redirect to login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.verifyOTP(user?.email || '', otp);

      setVerified(true);
      updateUser({
        ...user!,
        isEmailVerified: true,
      });
      
      toast.success(t('email_verified'));
      
      // Redirect to dashboard after successful verification
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Verification failed');
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await authApi.resendOTP(user?.email || '');
      toast.success(t('verification_code_sent'));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to resend verification code');
      toast.error(error.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect to login page from useEffect
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('verify_your_email')}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : verified ? (
          <Box textAlign="center" my={4}>
            <Typography variant="h6" color="success.main" gutterBottom>
              {t('email_verified_success')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('redirecting_to_dashboard')}
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleVerifyOTP} noValidate>
            <Typography variant="body1" paragraph align="center">
              {t('verification_code_sent_to')} <strong>{user?.email}</strong>
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label={t('verification_code')}
              name="otp"
              autoComplete="off"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{ maxLength: 6 }}
              placeholder="123456"
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={otp.length !== 6 || loading}
            >
              {t('verify_email')}
            </Button>

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                disabled={loading}
              >
                {t('back_to_login')}
              </Button>
              <Button
                variant="text"
                onClick={handleResendOTP}
                disabled={loading}
              >
                {t('resend_verification_code')}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default VerifyEmailPage; 