import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Linkedin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  // Function to handle LinkedIn connection
  const handleConnectLinkedIn = () => {
    // Get the backend URL from environment variable or fallback to Render deployed URL
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    
    // Store current URL in localStorage to redirect back after LinkedIn connection
    localStorage.setItem('redirectAfterAuth', '/analytics');
    
    // Redirect to LinkedIn OAuth endpoint
    window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-black">LinkedIn Analytics</h1>
      </div>
      
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          LinkedIn Analytics are not available through the API due to LinkedIn's restrictions.
          LinkedIn only allows analytics access through their Marketing Developer Platform with 
          special permissions that are not available to most applications.
        </AlertDescription>
      </Alert>
      
      <Card className="border border-gray-200 p-6 text-center">
        <CardContent className="pt-6">
          <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center">
            <Linkedin className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">LinkedIn Analytics Unavailable</h3>
            <p className="text-gray-500 mb-6 max-w-lg mx-auto">
              LinkedIn restricts access to analytics data through their API. To view your post analytics, 
              please visit LinkedIn's native analytics dashboard on their website.
            </p>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open('https://www.linkedin.com/analytics/creator/content', '_blank')}
            >
              <Linkedin className="h-4 w-4" />
              Visit LinkedIn Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage; 