import React, { useState } from "react";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Youtube, ArrowRight, Sparkles, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { onboardingApi } from "@/services/api";

export default function ContentGenerationPage() {
  const { prevStep, getStepProgress, firstName, saveOnboardingProgress, setOnboardingCompleted } = useOnboarding();
  const { current, total } = getStepProgress();
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const contentOptions = [
    {
      title: "Upload Files",
      description: "Import PDFs, Docs, or other files to create content",
      icon: <Upload className="w-8 h-8 text-blue-500" />,
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-500"
    },
    {
      title: "YouTube Videos",
      description: "Convert YouTube videos into blog posts or articles",
      icon: <Youtube className="w-8 h-8 text-red-500" />,
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      textColor: "text-red-500"
    },
    {
      title: "Draft Content",
      description: "Create content from scratch with AI assistance",
      icon: <FileText className="w-8 h-8 text-green-500" />,
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      textColor: "text-green-500"
    }
  ];

  const completeOnboarding = async () => {
    try {
      // Use the dedicated API endpoint to complete onboarding
      await onboardingApi.completeOnboarding();
      
      // Update local context state
      setOnboardingCompleted();
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      
      // Fallback to updateUser if the API call fails
      if (updateUser) {
        await updateUser({ 
          onboardingCompleted: true,
          lastOnboardingStep: 'dashboard'
        });
        
        // Update local context
        setOnboardingCompleted();
      }
      
      // Still navigate to dashboard even if there's an error
      navigate('/dashboard', { replace: true });
    }
  };

  const handleSkip = () => {
    setSkipDialogOpen(false);
    completeOnboarding();
  };

  const handleOptionClick = (option: string) => {
    completeOnboarding();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Welcome, {firstName || 'there'}!</h1>
          <p className="text-xl font-medium mb-2">Let's generate your first content</p>
          <p className="text-gray-400 max-w-xl mx-auto">
            Choose one of these options to create your first piece of content. Our AI will help you make it amazing.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            This is the final step of your onboarding. You can go back to modify your preferences, 
            but once you select "Skip for now" or create content, you'll complete the onboarding process 
            and be directed to the dashboard.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contentOptions.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleOptionClick(option.title)}
              className={`p-6 rounded-xl border ${option.borderColor} ${option.bgColor} flex flex-col hover:scale-105 transition-transform cursor-pointer shadow-lg`}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-gray-900 flex items-center justify-center">
                  {option.icon}
                </div>
              </div>
              <h3 className={`font-semibold text-lg text-center mb-2 ${option.textColor}`}>{option.title}</h3>
              <p className="text-gray-400 text-center text-sm">{option.description}</p>
              <Button 
                className={`mt-4 bg-gray-800 hover:bg-gray-700 flex items-center justify-center gap-2`}
                variant="outline"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Started</span>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mb-12">
          {/* Allow user to go back to previous onboarding steps until they complete the process */}
          <Button 
            onClick={prevStep}
            variant="outline"
            className="text-gray-400 hover:text-white border-gray-700 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => setSkipDialogOpen(true)}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            Skip for now
          </Button>
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
      
      {/* Skip confirmation dialog */}
      <Dialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Go to dashboard?</DialogTitle>
            <DialogDescription className="text-gray-400">
              This will complete your onboarding process and take you to the dashboard. You won't be able to return to the onboarding process later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between sm:space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setSkipDialogOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Go back
            </Button>
            <Button 
              onClick={handleSkip}
              className="bg-purple-600 hover:bg-purple-700 flex items-center"
            >
              Go to dashboard
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 