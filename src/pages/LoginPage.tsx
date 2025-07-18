import React from 'react';

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = () => {
  const handleGoogleLogin = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
    const loginUrl = baseUrl.endsWith('/api')
      ? `${baseUrl}/auth/google`
      : `${baseUrl}/api/auth/google`;
    window.location.href = loginUrl;
  };

  const handleLinkedInLogin = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
    const loginUrl = baseUrl.endsWith('/api')
      ? `${baseUrl}/auth/linkedin`
      : `${baseUrl}/api/auth/linkedin`;
    window.location.href = loginUrl;
  };

  const handleLinkedInDirectLogin = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
    const loginUrl = baseUrl.endsWith('/api')
      ? `${baseUrl}/auth/linkedin-direct`
      : `${baseUrl}/api/auth/linkedin-direct`;
    window.location.href = loginUrl;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <div className="space-y-4">
          <div className="social-auth-options space-y-3">
            <button 
              className="social-auth-button google w-full flex items-center justify-center gap-3 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={handleGoogleLogin}
            >
              <svg className="social-icon h-5 w-5" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              Continue with Google
            </button>
            
            <button 
              className="social-auth-button linkedin w-full flex items-center justify-center gap-3 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={handleLinkedInLogin}
            >
              <svg className="social-icon h-5 w-5" viewBox="0 0 24 24">
                <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9 V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977 C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"/>
              </svg>
              Continue with LinkedIn
            </button>
            
            <button 
              className="social-auth-button linkedin w-full flex items-center justify-center gap-3 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={handleLinkedInDirectLogin}
            >
              <svg className="social-icon h-5 w-5" viewBox="0 0 24 24">
                <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9 V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977 C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"/>
              </svg>
              Try Direct LinkedIn Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 