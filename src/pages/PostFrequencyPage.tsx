import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle } from "lucide-react";

export default function PostFrequencyPage() {
  const { postFrequency, setPostFrequency, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();

  const frequencyOptions = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">How often do you want to post per week?</h1>
        <p className="text-lg text-gray-400 mb-10">
          We recommend posting at least 1-2 times per week.
        </p>
        
        <div className="flex justify-center gap-2 mb-12">
          {frequencyOptions.map((frequency) => (
            <Button
              key={frequency}
              variant={postFrequency === frequency ? "default" : "outline"}
              onClick={() => setPostFrequency(frequency as any)}
              className={`
                w-16 h-16 rounded-xl text-xl font-semibold p-0
                ${postFrequency === frequency 
                  ? 'bg-purple-600 hover:bg-purple-700 border-none text-white' 
                  : 'border-gray-700 text-gray-400 hover:border-purple-500 hover:text-purple-500'}
              `}
            >
              {frequency}
            </Button>
          ))}
        </div>
        
        <div className="mb-24 relative">
          <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl border border-gray-800">
            <div className="flex items-center mb-6">
              <Calendar className="text-purple-500 mr-3" size={28} />
              <h3 className="text-xl font-medium">Posting Schedule</h3>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-6">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div 
                  key={day + i} 
                  className={`
                    h-12 flex items-center justify-center rounded 
                    ${i < (postFrequency || 0) ? 'bg-purple-600/20 border border-purple-600/50' : 'bg-gray-800 border border-gray-700'}
                  `}
                >
                  <span className="text-sm font-medium">{day}</span>
                  {i < (postFrequency || 0) && (
                    <CheckCircle className="ml-1 text-purple-500" size={12} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-800 pt-4">
              <div className="flex items-center text-gray-400">
                <Clock size={16} className="mr-2" />
                <span className="text-sm">Optimal posting time</span>
              </div>
              <span className="text-sm text-white bg-purple-600/20 px-3 py-1 rounded border border-purple-600/50">
                9:00 - 11:00 AM
              </span>
            </div>
          </div>
          
          {postFrequency && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-8 py-3 px-5 bg-purple-600/20 border border-purple-600 rounded-lg text-white text-sm">
              <strong className="mr-1">AI will suggest:</strong> 
              {postFrequency === 1 ? 'One post per week' : `${postFrequency} posts per week`}
            </div>
          )}
        </div>
        
        <div className="flex justify-between mb-12">
          <Button 
            variant="outline" 
            onClick={prevStep}
            className="border-gray-700 text-gray-400"
          >
            Back
          </Button>
          <ContinueButton 
            onClick={nextStep}
            disabled={!postFrequency} 
            className="bg-purple-600 hover:bg-purple-700"
          />
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
    </div>
  );
}
