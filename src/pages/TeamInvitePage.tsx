import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Mail, 
  Plus, 
  X,
  Sparkles,
  Zap,
  Globe2,
  MessageSquare,
  Twitter
} from "lucide-react";

export default function TeamInvitePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [invites, setInvites] = useState([{ email: "", role: "member" }]);

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const addInvite = () => {
    setInvites([...invites, { email: "", role: "member" }]);
  };

  const removeInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const updateInvite = (index: number, field: "email" | "role", value: string) => {
    const newInvites = [...invites];
    newInvites[index] = { ...newInvites[index], [field]: value };
    setInvites(newInvites);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle invite submission
    navigate("/dashboard");
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
          className="w-full max-w-2xl mx-auto"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-primary/20 flex items-center justify-center"
              variants={itemVariants}
            >
              <Twitter className="w-12 h-12 text-brand-primary" />
            </motion.div>
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              variants={itemVariants}
            >
              {t('inviteTeamMembers')}
            </motion.h1>
            <motion.p 
              className="text-brand-gray-300 text-lg"
              variants={itemVariants}
            >
              {t('inviteTeamDescription')}
            </motion.p>
          </div>

          {/* Invite form */}
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {invites.map((invite, index) => (
              <motion.div
                key={index}
                className="card-modern p-4 sm:p-6"
                variants={itemVariants}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`email-${index}`} className="text-brand-gray-300">
                        {t('emailAddress')}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray-400" />
                        <Input
                          id={`email-${index}`}
                          type="email"
                          value={invite.email}
                          onChange={(e) => updateInvite(index, "email", e.target.value)}
                          className="pl-10 bg-brand-gray-800 border-brand-gray-700 text-white placeholder:text-brand-gray-400"
                          placeholder={t('enterEmail')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`role-${index}`} className="text-brand-gray-300">
                        {t('role')}
                      </Label>
                      <select
                        id={`role-${index}`}
                        value={invite.role}
                        onChange={(e) => updateInvite(index, "role", e.target.value)}
                        className="w-full px-3 py-2 bg-brand-gray-800 border border-brand-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      >
                        <option value="member">{t('member')}</option>
                        <option value="admin">{t('admin')}</option>
                        <option value="editor">{t('editor')}</option>
                      </select>
                    </div>
                  </div>

                  {invites.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInvite(index)}
                      className="ml-4 p-2 text-brand-gray-400 hover:text-brand-error transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div
              variants={itemVariants}
              className="flex justify-center"
            >
              <Button
                type="button"
                variant="outline"
                onClick={addInvite}
                className="text-brand-primary border-brand-primary hover:bg-brand-primary/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('addAnother')}
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex justify-center space-x-4"
            >
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="text-brand-gray-300 hover:text-white"
              >
                {t('skipForNow')}
              </Button>
              <Button
                type="submit"
                className="bg-brand-primary hover:bg-brand-primary/90 text-white"
              >
                {t('sendInvites')}
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
} 