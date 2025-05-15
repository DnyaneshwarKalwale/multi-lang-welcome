import React, { useState } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BrandOutIcon, BrandOutLogotype } from "@/components/BrandOutIcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Globe, Phone, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PersonalInfoPage() {
  const navigate = useNavigate();
  const { 
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    website, setWebsite,
    mobileNumber, setMobileNumber,
    nextStep, prevStep,
    getStepProgress
  } = useOnboarding();
  
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    website: "",
    mobileNumber: ""
  });
  
  const { current, total } = getStepProgress();
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      website: "",
      mobileNumber: ""
    };
    
    // Validate firstName
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }
    
    // Validate lastName
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    // Validate website (optional)
    if (website.trim()) {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(website)) {
        newErrors.website = "Please enter a valid website URL";
        isValid = false;
      }
    }
    
    // Validate mobile number (optional)
    if (mobileNumber.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(mobileNumber)) {
        newErrors.mobileNumber = "Please enter a valid phone number";
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleContinue = () => {
    if (validateForm()) {
      nextStep();
    }
  };
  
  const handleBack = () => {
    prevStep();
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 50 } 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-b from-white via-blue-50/20 to-white text-gray-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-50 opacity-80 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-100 opacity-60 blur-[120px]"></div>
      </div>
      
      <motion.div 
        className="max-w-xl w-full mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <BrandOutLogotype className="h-20 w-auto" />
            <Linkedin className="absolute bottom-0 right-0 text-[#0088FF] bg-white p-1 rounded-full shadow-md" size={26} />
          </div>
        </div>
        
        <motion.h1 
          className="text-3xl font-bold text-center mb-3 text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Tell us about yourself
        </motion.h1>
        
        <motion.p 
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We'll personalize your experience based on this information
        </motion.p>
        
        <motion.div 
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div variants={item}>
              <Label htmlFor="firstName" className="text-gray-700 mb-2 block">
                First Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`pl-10 h-12 bg-white border-gray-200 focus:border-primary focus:ring-primary shadow-sm ${errors.firstName ? 'border-red-500' : ''}`}
                  onKeyPress={handleKeyPress}
                />
                <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                {errors.firstName && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.firstName}</span>
                )}
              </div>
            </motion.div>
            
            <motion.div variants={item}>
              <Label htmlFor="lastName" className="text-gray-700 mb-2 block">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`pl-10 h-12 bg-white border-gray-200 focus:border-primary focus:ring-primary shadow-sm ${errors.lastName ? 'border-red-500' : ''}`}
                  onKeyPress={handleKeyPress}
                />
                <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                {errors.lastName && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.lastName}</span>
                )}
              </div>
            </motion.div>
          </div>
          
          <motion.div variants={item} className="mb-6">
            <Label htmlFor="email" className="text-gray-700 mb-2 block">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 h-12 bg-white border-gray-200 focus:border-primary focus:ring-primary shadow-sm ${errors.email ? 'border-red-500' : ''}`}
                onKeyPress={handleKeyPress}
              />
              <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>
              )}
            </div>
          </motion.div>
          
          <motion.div variants={item} className="mb-6">
            <Label htmlFor="website" className="text-gray-700 mb-2 block">
              Website URL <span className="text-gray-400 text-sm">(optional)</span>
            </Label>
            <div className="relative">
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={`pl-10 h-12 bg-white border-gray-200 focus:border-primary focus:ring-primary shadow-sm ${errors.website ? 'border-red-500' : ''}`}
                onKeyPress={handleKeyPress}
              />
              <Globe size={18} className="absolute left-3 top-3.5 text-gray-400" />
              {errors.website && (
                <span className="text-red-500 text-sm mt-1 block">{errors.website}</span>
              )}
            </div>
          </motion.div>
          
          <motion.div variants={item} className="mb-6">
            <Label htmlFor="mobileNumber" className="text-gray-700 mb-2 block">
              Mobile Number <span className="text-gray-400 text-sm">(optional)</span>
            </Label>
            <div className="relative">
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="+1 (123) 456-7890"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className={`pl-10 h-12 bg-white border-gray-200 focus:border-primary focus:ring-primary shadow-sm ${errors.mobileNumber ? 'border-red-500' : ''}`}
                onKeyPress={handleKeyPress}
              />
              <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
              {errors.mobileNumber && (
                <span className="text-red-500 text-sm mt-1 block">{errors.mobileNumber}</span>
              )}
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <BackButton 
            onClick={handleBack} 
            variant="subtle" 
            className="px-8"
          />
          
          <Button 
            onClick={handleContinue} 
            className="bg-primary hover:bg-primary-600 text-white px-8 py-6 text-base rounded-full shadow-md"
          >
            Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col items-center mt-8"
        >
          <ProgressDots total={total} current={current} color="cyan" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
} 