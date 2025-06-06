import React, { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <div className="social-auth-options">
          <button 
            className="social-auth-button google"
            onClick={() => {
              setLoading(true);
              // Get the base API URL and normalize it
              let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
              
              // Remove trailing slashes and /api suffix to get the clean base URL
              baseUrl = baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
              
              // Construct the clean Google auth URL
              const loginUrl = `${baseUrl}/api/auth/google`;
              
              console.log('Google OAuth URL:', loginUrl);
              window.location.href = loginUrl;
            }}
            disabled={loading}
          >
            <svg className="social-icon" viewBox="0 0 24 24">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            Continue with Google
          </button>
          
          {/* Original LinkedIn Login */}
          <button 
            className="social-auth-button linkedin"
            onClick={() => {
              setLoading(true);
              // Get the base API URL and normalize it
              let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
              
              // Remove trailing slashes and /api suffix to get the clean base URL
              baseUrl = baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
              
              // Construct the clean LinkedIn auth URL
              const loginUrl = `${baseUrl}/api/auth/linkedin`;
              
              console.log('LinkedIn OAuth URL (original):', loginUrl);
              window.location.href = loginUrl;
            }}
            disabled={loading}
          >
            <svg className="social-icon" viewBox="0 0 24 24">
              <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9 V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977 C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"/>
            </svg>
            Continue with LinkedIn
          </button>
          
          {/* New Direct LinkedIn Login */}
          <button 
            className="social-auth-button linkedin"
            onClick={() => {
              setLoading(true);
              // Get the base API URL and normalize it
              let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
              
              // Remove trailing slashes and /api suffix to get the clean base URL
              baseUrl = baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
              
              // Construct the clean LinkedIn auth URL
              const loginUrl = `${baseUrl}/api/auth/linkedin-direct`;
              
              console.log('LinkedIn OAuth URL:', loginUrl);
              window.location.href = loginUrl;
            }}
            disabled={loading}
          >
            <svg className="social-icon" viewBox="0 0 24 24">
              <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9 V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977 C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"/>
            </svg>
            Try Direct LinkedIn Login
          </button>
        </div>
      </div>
    </div>
  );
} 