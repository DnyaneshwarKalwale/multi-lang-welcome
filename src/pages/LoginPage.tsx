import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Lock,
  Twitter,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-brand-gray-900 text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-brand-primary/10 via-brand-secondary/10 to-brand-accent/10" />
      
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-brand-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
        <motion.div
          className="w-full max-w-md mx-auto"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          {/* Header */}
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-primary/20 flex items-center justify-center"
            variants={itemVariants}
          >
            <Twitter className="w-12 h-12 text-brand-primary" />
          </motion.div>

          <motion.h1 
            className="text-3xl sm:text-4xl font-bold text-white text-center mb-4"
            variants={itemVariants}
          >
            {t('welcomeBack')}
          </motion.h1>
          <motion.p 
            className="text-brand-gray-300 text-lg text-center mb-8"
            variants={itemVariants}
          >
            {t('loginDescription')}
          </motion.p>

          {/* Login form */}
          <motion.form
            onSubmit={handleSubmit}
            className="card-modern p-6"
            variants={itemVariants}
          >
            {error && (
              <div className="mb-4 p-3 bg-brand-error/10 border border-brand-error/20 rounded-lg flex items-center space-x-2 text-brand-error">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-brand-gray-300">
                  {t('email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-brand-gray-800 border-brand-gray-700 text-white"
                    placeholder={t('enterEmail')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-brand-gray-300">
                  {t('password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-brand-gray-800 border-brand-gray-700 text-white"
                    placeholder={t('enterPassword')}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-gray-400 hover:text-brand-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-brand-primary hover:bg-brand-primary/90 text-white"
            >
              {isLoading ? t('loggingIn') : t('login')}
            </Button>
          </motion.form>

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-6 text-center"
          >
            <Button
              onClick={() => navigate("/register")}
              variant="ghost"
              className="text-brand-gray-300 hover:text-white"
            >
              {t('dontHaveAccount')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 