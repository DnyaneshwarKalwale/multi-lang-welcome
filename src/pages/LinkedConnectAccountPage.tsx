
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Linkedin, Check, Shield, Lock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { LinkedPulseIconRounded } from "@/components/LinkedPulseIcon";

export default function LinkedConnectAccountPage() {
  const { nextStep, prevStep } = useOnboarding();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissions, setPermissions] = useState({
    viewProfile: true,
    createPosts: true,
    readAnalytics: true,
    accessContacts: false
  });

  const simulateConnection = () => {
    setIsConnecting(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      toast({
        title: "LinkedIn Connected",
        description: "Your LinkedIn account has been successfully connected.",
      });
    }, 2000);
  };

  const handleNext = () => {
    if (!isConnected) {
      toast({
        title: "LinkedIn connection required",
        description: "Please connect your LinkedIn account before continuing.",
        variant: "destructive",
      });
      return;
    }
    
    nextStep();
  };

  const handlePermissionToggle = (permission: keyof typeof permissions) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
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
            Connect Your LinkedIn Account
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Link your LinkedIn account to enable automated posting and analytics
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-gray-900 shadow-md mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="text-center md:text-left">
                  <LinkedPulseIconRounded className="w-20 h-20 mx-auto md:mx-0" />
                </div>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                      <Linkedin className="w-5 h-5 mr-2 text-linkedin-blue" />
                      LinkedIn Integration
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                      Connect your LinkedIn account to automatically publish content, analyze performance, and grow your professional network.
                    </p>
                  </div>
                  
                  {!isConnected ? (
                    <div className="space-y-4">
                      <Button
                        onClick={() => setShowPermissions(true)}
                        disabled={isConnecting || showPermissions}
                        className="w-full md:w-auto bg-linkedin-blue hover:bg-linkedin-darkBlue text-white flex items-center justify-center gap-2"
                      >
                        <Linkedin className="h-4 w-4" />
                        {isConnecting ? "Connecting..." : "Connect LinkedIn Account"}
                      </Button>
                      
                      {showPermissions && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <h3 className="font-medium mb-3 flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-linkedin-blue" />
                            Permission Settings
                          </h3>
                          
                          <div className="space-y-4 mb-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm">View Profile Information</Label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Access your basic profile information</p>
                              </div>
                              <Switch
                                checked={permissions.viewProfile}
                                onCheckedChange={() => handlePermissionToggle("viewProfile")}
                                disabled={true} // Required permission
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm">Create and Edit Posts</Label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Publish content to your LinkedIn profile</p>
                              </div>
                              <Switch
                                checked={permissions.createPosts}
                                onCheckedChange={() => handlePermissionToggle("createPosts")}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm">Read Post Analytics</Label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Track engagement and performance metrics</p>
                              </div>
                              <Switch
                                checked={permissions.readAnalytics}
                                onCheckedChange={() => handlePermissionToggle("readAnalytics")}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-sm">Access Contacts</Label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">See your connections and messages</p>
                              </div>
                              <Switch
                                checked={permissions.accessContacts}
                                onCheckedChange={() => handlePermissionToggle("accessContacts")}
                              />
                            </div>
                          </div>
                          
                          <div className="flex flex-col xs:flex-row gap-2 justify-center">
                            <Button
                              variant="outline"
                              onClick={() => setShowPermissions(false)}
                              className="border-gray-300 dark:border-gray-700"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={simulateConnection}
                              disabled={isConnecting}
                              className="bg-linkedin-blue hover:bg-linkedin-darkBlue text-white"
                            >
                              {isConnecting ? "Connecting..." : "Authorize & Connect"}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Lock className="h-3 w-3" />
                        <span>Your credentials are secure and never stored</span>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg p-4"
                    >
                      <div className="flex items-center">
                        <div className="bg-green-100 dark:bg-green-800/30 rounded-full p-1.5 mr-3">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-green-800 dark:text-green-400">LinkedIn Account Connected</h3>
                          <p className="text-sm text-green-700 dark:text-green-500">You can now publish content directly to LinkedIn</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-start">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-1.5 mr-3 mt-0.5 flex-shrink-0">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p className="mb-2">
                      <strong>Why connect your LinkedIn account?</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                      <li>Publish content directly from LinkedPulse</li>
                      <li>Schedule posts for optimal engagement times</li>
                      <li>Track performance metrics and analytics</li>
                      <li>Analyze audience engagement and growth</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-between"
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
            className={`text-white flex items-center gap-2 ${
              isConnected 
                ? 'bg-linkedin-blue hover:bg-linkedin-darkBlue' 
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
          >
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
