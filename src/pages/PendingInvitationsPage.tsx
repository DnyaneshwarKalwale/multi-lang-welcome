import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Sparkles, 
  Zap,
  Globe2,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  Twitter
} from "lucide-react";

export default function PendingInvitationsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isResponding, setIsResponding] = useState(false);

  // Mock data for pending invitations
  const pendingInvitations = [
    {
      id: 1,
      workspace: "Marketing Team",
      inviter: "John Doe",
      role: "Content Creator",
      status: "pending",
      date: "2024-03-20"
    },
    {
      id: 2,
      workspace: "Product Team",
      inviter: "Jane Smith",
      role: "Social Media Manager",
      status: "pending",
      date: "2024-03-19"
    }
  ];

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

  const handleAcceptInvitation = (id: number) => {
    setIsResponding(true);
    // Simulate API call
    setTimeout(() => {
      setIsResponding(false);
      navigate("/dashboard");
    }, 2000);
  };

  const handleDeclineInvitation = (id: number) => {
    setIsResponding(true);
    // Simulate API call
    setTimeout(() => {
      setIsResponding(false);
    }, 2000);
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
          className="w-full max-w-2xl mx-auto text-center"
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
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            variants={itemVariants}
          >
            {t('pendingInvitations')}
          </motion.h1>
          <motion.p 
            className="text-brand-gray-300 text-lg mb-8"
            variants={itemVariants}
          >
            {t('pendingInvitationsDescription')}
          </motion.p>

          {/* Invitations list */}
          <motion.div 
            className="space-y-4 mb-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {pendingInvitations.map((invitation) => (
              <motion.div
                key={invitation.id}
                className="card-modern p-6"
                variants={itemVariants}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">{invitation.workspace}</h3>
                      <p className="text-brand-gray-300">
                        {t('invitedBy')} {invitation.inviter}
                      </p>
                      <p className="text-brand-gray-400 text-sm">
                        {t('role')}: {invitation.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleAcceptInvitation(invitation.id)}
                      disabled={isResponding}
                      className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                    >
                      {isResponding ? t('responding') : t('accept')}
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      onClick={() => handleDeclineInvitation(invitation.id)}
                      disabled={isResponding}
                      variant="outline"
                      className="text-brand-gray-300 border-brand-gray-700 hover:bg-brand-gray-800"
                    >
                      {t('decline')}
                      <XCircle className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="card-modern p-4 sm:p-6"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white">{t('teamCollaboration')}</h3>
              </div>
              <p className="text-brand-gray-300">{t('teamCollaborationDescription')}</p>
            </motion.div>

            <motion.div 
              className="card-modern p-4 sm:p-6"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-secondary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-white">{t('sharedResources')}</h3>
              </div>
              <p className="text-brand-gray-300">{t('sharedResourcesDescription')}</p>
            </motion.div>

            <motion.div 
              className="card-modern p-4 sm:p-6"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center">
                  <Globe2 className="w-5 h-5 text-brand-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white">{t('multiLanguage')}</h3>
              </div>
              <p className="text-brand-gray-300">{t('multiLanguageDescription')}</p>
            </motion.div>

            <motion.div 
              className="card-modern p-4 sm:p-6"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-pink/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-brand-pink" />
                </div>
                <h3 className="text-lg font-semibold text-white">{t('contentStrategy')}</h3>
              </div>
              <p className="text-brand-gray-300">{t('contentStrategyDescription')}</p>
            </motion.div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white"
            >
              {t('goToDashboard')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              className="text-brand-gray-300 border-brand-gray-700 hover:bg-brand-gray-800"
            >
              {t('manageInvitations')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 