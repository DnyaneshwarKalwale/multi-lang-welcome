
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ProgressDots } from '@/components/ProgressDots';
import { ContinueButton } from '@/components/ContinueButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, User } from 'lucide-react';
import { LinkedPulseIcon } from '@/components/ScripeIcon';

const TeamSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { nextStep, updateOnboardingData } = useOnboarding();
  const [selectedOption, setSelectedOption] = useState<'team' | 'individual' | null>(null);

  const handleContinue = () => {
    if (selectedOption) {
      updateOnboardingData({ teamType: selectedOption });
      
      if (selectedOption === 'team') {
        navigate('/onboarding/workspace-name');
      } else {
        // Skip workspace name for individual users
        navigate('/onboarding/personal-info');
      }
      
      nextStep();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent_30%,rgba(79,70,229,0.05))]"></div>
      
      <motion.div 
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex justify-center">
          <LinkedPulseIcon className="text-linkedin-blue w-16 h-16" />
        </div>
        
        <h1 className="text-3xl font-bold mb-3">How will you use LinkedPulse?</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          This will help us tailor your experience
        </p>
        
        <div className="space-y-4 mb-8">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedOption === 'team' ? 'border-linkedin-blue ring-2 ring-linkedin-blue/20' : ''
            }`}
            onClick={() => setSelectedOption('team')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-linkedin-blue/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-linkedin-blue" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Team</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  I'll be working with my team members
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedOption === 'individual' ? 'border-linkedin-blue ring-2 ring-linkedin-blue/20' : ''
            }`}
            onClick={() => setSelectedOption('individual')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-linkedin-blue/10 flex items-center justify-center">
                <User className="h-6 w-6 text-linkedin-blue" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Individual</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  I'll be using this just for myself
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <ContinueButton 
            onClick={handleContinue} 
            disabled={!selectedOption}
          >
            Continue
          </ContinueButton>
          
          <Button
            variant="ghost"
            className="w-full text-gray-500"
            onClick={() => navigate('/onboarding/welcome')}
          >
            Back
          </Button>
        </div>
        
        <div className="mt-8">
          <ProgressDots total={8} current={1} />
        </div>
      </motion.div>
    </div>
  );
};

export default TeamSelectionPage;
