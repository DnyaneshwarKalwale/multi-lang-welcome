
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Download, CheckCircle, Chrome, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LinkedPulseIconRounded } from "@/components/LinkedPulseIcon";

export default function LinkedExtensionPage() {
  const { nextStep, prevStep } = useOnboarding();
  const [status, setStatus] = useState<"initial" | "downloading" | "installed">("initial");
  const [progress, setProgress] = useState(0);

  const simulateDownload = () => {
    setStatus("downloading");
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setStatus("installed");
      }
    }, 150);
  };

  const handleNext = () => {
    nextStep();
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <div className="container mx-auto max-w-3xl flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-10"
        >
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
          >
            Install LinkedPulse Extension
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Our browser extension helps you post to LinkedIn directly and gather analytics
          </motion.p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <Card className="bg-white dark:bg-gray-900 shadow-md h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="text-center mb-6">
                  <LinkedPulseIconRounded className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">LinkedPulse Extension</h2>
                  <div className="flex items-center justify-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <Chrome className="h-4 w-4 mr-1" />
                    <span>Chrome Extension</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="bg-linkedin-blue/10 rounded-full p-1.5 mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-linkedin-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">One-Click Posting</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Post to LinkedIn without leaving the app</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-linkedin-blue/10 rounded-full p-1.5 mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-linkedin-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">Profile Integration</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Connect directly with your LinkedIn profile</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-linkedin-blue/10 rounded-full p-1.5 mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-linkedin-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">Performance Analytics</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Track engagement metrics and insights</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto text-center">
                  {status === "initial" && (
                    <Button
                      onClick={simulateDownload}
                      className="bg-linkedin-blue hover:bg-linkedin-darkBlue text-white w-full flex items-center justify-center"
                    >
                      <Download className="mr-2 h-4 w-4" /> Download Extension
                    </Button>
                  )}
                  
                  {status === "downloading" && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Downloading...</p>
                      <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                    </div>
                  )}
                  
                  {status === "installed" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center text-green-500 gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Installation Complete</span>
                      </div>
                      
                      <Button
                        variant="outline"
                        className="text-linkedin-blue border-linkedin-blue/30 hover:bg-linkedin-blue/5 flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Open Extension</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1"
          >
            <Card className="bg-white dark:bg-gray-900 shadow-md h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">Installation Instructions</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="bg-linkedin-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-2">1</div>
                      <h4 className="font-medium">Download the extension</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">Click the download button to get the extension file.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="bg-linkedin-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-2">2</div>
                      <h4 className="font-medium">Open Chrome Extensions</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">Go to chrome://extensions/ in your browser.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="bg-linkedin-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-2">3</div>
                      <h4 className="font-medium">Enable Developer Mode</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">Toggle "Developer mode" on in the top right.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="bg-linkedin-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-2">4</div>
                      <h4 className="font-medium">Load Unpacked</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">Click "Load unpacked" and select the extracted folder.</p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Don't have Chrome? The extension also works with Edge, Brave, and other Chromium-based browsers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-between mt-8"
        >
          <Button 
            variant="outline" 
            onClick={prevStep}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          
          <Button 
            onClick={handleNext}
            className="bg-linkedin-blue hover:bg-linkedin-darkBlue text-white flex items-center gap-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
