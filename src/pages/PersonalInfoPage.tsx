import React, { useState, useEffect } from "react";
import { BrandOutLogotype } from "@/components/BrandOutIcon";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Globe, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialLoginData {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileUrl?: string;
}

export default function PersonalInfoPage() {
  const navigate = useNavigate();
  const { 
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    website, setWebsite,
    mobileNumber, setMobileNumber,
    nextStep,
    socialLoginData
  } = useOnboarding();
  
  const [countryCode, setCountryCode] = useState("+1");
  const [numberPlaceholder, setNumberPlaceholder] = useState("+1 (123) 456-7890");
  
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    website: "",
    mobileNumber: ""
  });
  
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        switch(data.country_code) {
          case 'IN':
            setCountryCode("+91");
            setNumberPlaceholder("+91 98765 43210");
            break;
          case 'GB':
            setCountryCode("+44");
            setNumberPlaceholder("+44 7911 123456");
            break;
          case 'AU':
            setCountryCode("+61");
            setNumberPlaceholder("+61 412 345 678");
            break;
          default:
            setCountryCode("+1");
            setNumberPlaceholder("+1 (123) 456-7890");
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    if (socialLoginData) {
      if (socialLoginData.firstName) setFirstName(socialLoginData.firstName);
      if (socialLoginData.lastName) setLastName(socialLoginData.lastName);
      if (socialLoginData.email) setEmail(socialLoginData.email);
      if (socialLoginData.profileUrl) setWebsite(socialLoginData.profileUrl);
    }
  }, [socialLoginData]);
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      website: "",
      mobileNumber: ""
    };
    
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    if (website.trim()) {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(website)) {
        newErrors.website = "Please enter a valid website URL";
        isValid = false;
      }
    }
    
    if (mobileNumber.trim()) {
      const phoneRegex = /^[+\s\d()-]+$/;
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
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    return countryCode + cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setMobileNumber(formattedNumber);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative overflow-hidden">
      {/* Background with simple blue gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-primary/5"></div>
      </div>
      
      <div className="max-w-xl w-full mb-8">
        <div className="mb-10 flex justify-center">
          <BrandOutLogotype className="h-12 w-auto" />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-3 text-gray-900">
          Tell us about yourself
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          We'll personalize your experience based on this information
        </p>
        
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
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
            </div>
            
            <div>
              <Label htmlFor="lastName" className="text-gray-700 mb-2 block">
                Last Name 
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
            </div>
          </div>
          
          <div className="mb-6">
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
          </div>
          
          <div className="mb-6">
            <Label htmlFor="website" className="text-gray-700 mb-2 block">
              Website URL 
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
          </div>
          
          <div className="mb-6">
            <Label htmlFor="mobileNumber" className="text-gray-700 mb-2 block">
              Mobile Number 
            </Label>
            <div className="relative">
              <Input
                id="mobileNumber"
                type="tel"
                placeholder={numberPlaceholder}
                value={mobileNumber}
                onChange={handlePhoneChange}
                className={`pl-10 h-12 bg-white border-gray-200 focus:border-primary focus:ring-primary shadow-sm ${errors.mobileNumber ? 'border-red-500' : ''}`}
                onKeyPress={handleKeyPress}
              />
              <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
              {errors.mobileNumber && (
                <span className="text-red-500 text-sm mt-1 block">{errors.mobileNumber}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={handleContinue} 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base rounded-full shadow-md w-full max-w-md flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 