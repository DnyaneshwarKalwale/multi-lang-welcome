
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, User, Mail, Phone, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function LinkedUserInfoPage() {
  const { firstName, setFirstName, lastName, setLastName, email, setEmail, nextStep, prevStep } = useOnboarding();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Valid email is required";
    
    if (phoneNumber && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }
    
    if (websiteUrl && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(websiteUrl)) {
      newErrors.websiteUrl = "Invalid website URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      toast({
        title: "Information saved",
        description: "Your profile information has been saved.",
      });
      nextStep();
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <div className="container mx-auto max-w-3xl flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Your Profile Information</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let's get to know you so we can personalize your LinkedIn content
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <Card className="bg-white dark:bg-gray-900 shadow-md border-gray-100 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4 mr-2 text-linkedin-blue" />
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className={`border-gray-300 dark:border-gray-700 ${errors.firstName ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4 mr-2 text-linkedin-blue" />
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className={`border-gray-300 dark:border-gray-700 ${errors.lastName ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="flex items-center text-gray-700 dark:text-gray-300">
                    <Mail className="w-4 h-4 mr-2 text-linkedin-blue" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    className={`border-gray-300 dark:border-gray-700 ${errors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="phoneNumber" className="flex items-center text-gray-700 dark:text-gray-300">
                    <Phone className="w-4 h-4 mr-2 text-linkedin-blue" />
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (123) 456-7890"
                    className={`border-gray-300 dark:border-gray-700 ${errors.phoneNumber ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="websiteUrl" className="flex items-center text-gray-700 dark:text-gray-300">
                    <Globe className="w-4 h-4 mr-2 text-linkedin-blue" />
                    Website URL (Optional)
                  </Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className={`border-gray-300 dark:border-gray-700 ${errors.websiteUrl ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.websiteUrl && (
                    <p className="text-red-500 text-sm mt-1">{errors.websiteUrl}</p>
                  )}
                </motion.div>
              </div>
            </CardContent>
          </Card>

          <motion.div variants={itemVariants} className="flex justify-between pt-4">
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
        </motion.div>
      </div>
    </div>
  );
}
