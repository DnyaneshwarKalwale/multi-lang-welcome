import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi = {
  register: (firstName, lastName, email, password) =>
    api.post('/auth/register', { firstName, lastName, email, password }).then(res => res.data),
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then(res => res.data),
  twitterAuth: (userData: { name: string; twitterId: string; email?: string; profileImage?: string }) =>
    api.post('/auth/twitter', userData).then(res => res.data),
  getCurrentUser: () =>
    api.get('/auth/me').then(res => res.data),
  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email?token=${token}`).then(res => res.data),
  resendVerificationEmail: (email: string) =>
    api.post('/auth/resend-verification-email', { email }).then(res => res.data),
};

export { authApi, api };
