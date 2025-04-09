
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Plus, Trash2, Search, Linkedin, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

type InspirationProfile = {
  id: string;
  name: string;
  url: string;
  avatar?: string;
};

const exampleProfiles: InspirationProfile[] = [
  {
    id: "1",
    name: "Brené Brown",
    url: "linkedin.com/in/brenebrown",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "2",
    name: "Simon Sinek",
    url: "linkedin.com/in/simonsinek",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "3",
    name: "Adam Grant",
    url: "linkedin.com/in/adamgrant",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  }
];

export default function LinkedInspirationPage() {
  const { nextStep, prevStep } = useOnboarding();
  const [inspirationProfiles, setInspirationProfiles] = useState<InspirationProfile[]>([]);
  const [newProfileUrl, setNewProfileUrl] = useState("");
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddProfile = () => {
    if (!newProfileUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a LinkedIn profile URL",
        variant: "destructive",
      });
      return;
    }

    // Generate an ID for the new profile
    const newId = `profile-${Date.now()}`;
    
    // Extract name from URL (in a real app, this would be handled by scraping or API)
    const urlParts = newProfileUrl.split('/');
    const username = urlParts[urlParts.length - 1].replace(/[^a-zA-Z0-9]/g, '');
    const displayName = username
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const newProfile: InspirationProfile = {
      id: newId,
      name: displayName,
      url: newProfileUrl,
      avatar: `https://avatars.dicebear.com/api/initials/${displayName}.svg`,
    };

    setInspirationProfiles([...inspirationProfiles, newProfile]);
    setNewProfileUrl("");
    setIsAddingProfile(false);
    
    toast({
      title: "Profile added",
      description: `${displayName} has been added to your inspiration profiles.`,
    });
  };

  const handleAddExampleProfile = (profile: InspirationProfile) => {
    if (!inspirationProfiles.some(p => p.id === profile.id)) {
      setInspirationProfiles([...inspirationProfiles, profile]);
      toast({
        title: "Profile added",
        description: `${profile.name} has been added to your inspiration profiles.`,
      });
    }
  };

  const removeProfile = (id: string) => {
    setInspirationProfiles(inspirationProfiles.filter(profile => profile.id !== id));
  };

  const handleNext = () => {
    if (inspirationProfiles.length === 0) {
      toast({
        title: "No profiles selected",
        description: "Please add at least one inspiration profile before continuing.",
        variant: "destructive",
      });
      return;
    }
    
    // Save profiles to context (you'd need to add this to your context)
    nextStep();
  };

  const filteredExampleProfiles = exampleProfiles.filter(profile => 
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <div className="container mx-auto max-w-4xl flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
          >
            Content Inspiration
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300"
          >
            Select LinkedIn profiles whose content style you admire
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="bg-white dark:bg-gray-900 shadow-md h-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Linkedin className="w-5 h-5 mr-2 text-linkedin-blue" />
                  Your Inspiration Profiles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inspirationProfiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No inspiration profiles added yet.</p>
                    <p className="text-sm mt-2">Add profiles you'd like to emulate.</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {inspirationProfiles.map((profile) => (
                        <motion.div
                          key={profile.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={profile.avatar} />
                              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200">{profile.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{profile.url}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeProfile(profile.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {isAddingProfile ? (
                  <div className="mt-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        value={newProfileUrl}
                        onChange={(e) => setNewProfileUrl(e.target.value)}
                        placeholder="LinkedIn profile URL"
                        className="flex-1"
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleAddProfile} className="bg-linkedin-blue hover:bg-linkedin-darkBlue">
                          Add
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddingProfile(false)}
                          className="border-gray-300 dark:border-gray-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsAddingProfile(true)}
                    className="mt-6 bg-linkedin-blue hover:bg-linkedin-darkBlue flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Profile URL
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white dark:bg-gray-900 shadow-md h-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Popular Examples</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search examples..."
                    className="pl-9"
                  />
                  {searchQuery && (
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {filteredExampleProfiles.map((profile) => (
                      <motion.div
                        key={profile.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={profile.avatar} />
                            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{profile.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{profile.url}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddExampleProfile(profile)}
                          className="text-linkedin-blue hover:text-linkedin-darkBlue"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                    
                    {searchQuery && filteredExampleProfiles.length === 0 && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        <p>No matching profiles found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
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
