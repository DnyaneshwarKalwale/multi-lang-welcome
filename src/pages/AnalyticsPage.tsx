import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Linkedin, AlertCircle, BarChart3, TrendingUp, Users, Eye, Heart, MessageSquare, Share2, Calendar, Zap } from 'lucide-react';
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
        <div>
          <h1 className="text-2xl font-bold text-neutral-black">LinkedIn Analytics</h1>
          <p className="text-neutral-medium mt-1">Track your content performance and engagement metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content - Main Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              LinkedIn Analytics are currently unavailable due to LinkedIn's API restrictions.
              We're working on alternative solutions to provide you with insights.
            </AlertDescription>
          </Alert>
          
          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Analytics Dashboard</h3>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto leading-relaxed">
                  Get insights into your LinkedIn content performance, including views, likes, 
                  comments, shares, and engagement rates. We're building comprehensive analytics 
                  to help you optimize your content strategy.
                </p>
                
                {/* Mockup Analytics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <Eye className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-400">---</div>
                    <div className="text-sm text-gray-500">Views</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <Heart className="h-5 w-5 text-red-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-400">---</div>
                    <div className="text-sm text-gray-500">Likes</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <MessageSquare className="h-5 w-5 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-400">---</div>
                    <div className="text-sm text-gray-500">Comments</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <Share2 className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-400">---</div>
                    <div className="text-sm text-gray-500">Shares</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="gap-2 mb-4"
                  onClick={() => window.open('https://www.linkedin.com/analytics/creator/content', '_blank')}
                >
                  <Linkedin className="h-4 w-4" />
                  View LinkedIn Analytics
                </Button>
                
                <p className="text-xs text-gray-500">
                  For now, you can access your analytics directly on LinkedIn's platform
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Coming Soon */}
        <div className="space-y-6">
          {/* Coming Soon - Advanced Analytics */}
          <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg text-primary">Advanced Analytics</CardTitle>
              <CardDescription className="text-sm">
                Comprehensive insights coming soon
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">Performance Tracking</div>
                    <div className="text-xs text-gray-500">Real-time metrics</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">Audience Insights</div>
                    <div className="text-xs text-gray-500">Demographics & behavior</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">Best Time to Post</div>
                    <div className="text-xs text-gray-500">Optimal scheduling</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-primary/20">
                <div className="text-primary font-semibold text-lg mb-1">Coming Soon</div>
                <div className="text-xs text-gray-600">Enhanced analytics dashboard</div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Analytics Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium">Track engagement rates</div>
                    <div className="text-gray-600 text-xs">Focus on likes, comments, and shares</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium">Monitor posting times</div>
                    <div className="text-gray-600 text-xs">Find when your audience is most active</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium">Analyze content types</div>
                    <div className="text-gray-600 text-xs">See which formats perform best</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* LinkedIn Analytics Access */}
          <Card className="border-dashed border-gray-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Linkedin className="h-6 w-6 text-gray-400" />
              </div>
              <CardTitle className="text-base text-gray-600">LinkedIn Native Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Access your current analytics on LinkedIn's platform
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://www.linkedin.com/analytics/creator/content', '_blank')}
                className="gap-2"
              >
                <Linkedin className="h-4 w-4" />
                Open LinkedIn Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 