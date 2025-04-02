import React, { useState, useEffect } from "react";
import { X, User, AlertCircle, Upload, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { userApi } from "@/services/api";

interface ProfileSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProfileSettingsSheet({ open, onOpenChange, onSuccess }: ProfileSettingsSheetProps) {
  const isMobile = useIsMobile();
  const { user, fetchUser } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setProfilePicture(user.profilePicture || null);
      setPreviewUrl(user.profilePicture || null);
    }
  }, [user, open]);
  
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    // Basic validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      setLoading(false);
      return;
    }
    
    try {
      // Prepare data for the update
      const updateData: {
        firstName: string;
        lastName: string;
        profilePicture?: string;
      } = {
        firstName: firstName.trim(),
        lastName: lastName.trim()
      };
      
      // If there's a new profile picture file, upload it first
      if (profilePictureFile) {
        try {
          const uploadResult = await userApi.uploadProfilePicture(profilePictureFile);
          if (uploadResult && uploadResult.fileUrl) {
            updateData.profilePicture = uploadResult.fileUrl;
          }
        } catch (uploadErr: any) {
          console.error("Error uploading profile picture:", uploadErr);
          // Continue with profile update even if image upload fails
          setError("Failed to upload profile picture, but will continue updating profile");
        }
      }
      
      // Make the API call to update the profile
      const response = await userApi.updateProfile(updateData);
      
      // Update user data in context
      await fetchUser();
      
      setSuccess("Profile updated successfully!");
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Automatically close the sheet after a short delay
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
      
    } catch (err: any) {
      console.error("Error updating profile:", err);
      
      let errorMessage = "Failed to update your profile. Please try again.";
      
      // Check for different error scenarios
      if (err.response) {
        // Server responded with an error status
        if (err.response.status === 400) {
          errorMessage = err.response.data?.error || "Invalid profile information. Please check your inputs.";
        } else if (err.response.status === 401) {
          errorMessage = "Your session has expired. Please log in again.";
          // Optionally redirect to login
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (err.request) {
        // Request was made but no response received (network error)
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setError(null);
    setSuccess(null);
    onOpenChange(false);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? "bottom" : "right"} className="bg-black border-gray-800 p-0 w-full sm:max-w-md">
        <motion.div 
          className="bg-gradient-to-b from-gray-900 to-black p-6 sm:p-8 rounded-xl w-full h-full overflow-y-auto overflow-x-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-6">
            <motion.div 
              className="flex items-center gap-3"
              variants={itemVariants}
            >
              <User className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">
                Edit Profile
              </h2>
            </motion.div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="text-gray-400 hover:text-white rounded-full"
            >
              <X size={18} />
            </Button>
          </div>
          
          {error && (
            <motion.div variants={itemVariants}>
              <Alert variant="destructive" className="mb-6 bg-red-900/30 border-red-900 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          {success && (
            <motion.div variants={itemVariants}>
              <Alert className="mb-6 bg-green-900/30 border-green-900 text-green-200">
                <AlertCircle className="h-4 w-4 text-green-400" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          <motion.form 
            className="space-y-6" 
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Profile Picture */}
            <motion.div className="flex flex-col items-center mb-4" variants={itemVariants}>
              <div className="relative mb-4">
                <div 
                  className="w-24 h-24 rounded-full bg-gray-800 overflow-hidden border-2 border-indigo-500/30 flex items-center justify-center"
                >
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label 
                  htmlFor="profile-picture-upload" 
                  className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer border-2 border-gray-900 hover:bg-indigo-500 transition-colors"
                >
                  <Camera className="w-4 h-4 text-white" />
                  <input 
                    id="profile-picture-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleProfilePictureChange}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-400">Click the camera icon to upload a new photo</p>
            </motion.div>
            
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div variants={itemVariants}>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1.5">First name</label>
                <div className="relative">
                  <Input 
                    id="firstName" 
                    placeholder="Enter your first name" 
                    className="bg-gray-900/50 border-gray-800 h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1.5">Last name</label>
                <div className="relative">
                  <Input 
                    id="lastName" 
                    placeholder="Enter your last name" 
                    className="bg-gray-900/50 border-gray-800 h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
            </div>
            
            <motion.div variants={itemVariants}>
              <Button 
                type="submit" 
                variant="gradient"
                className="w-full text-white font-medium h-12 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Updating profile...
                  </div>
                ) : 'Save changes'}
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
} 