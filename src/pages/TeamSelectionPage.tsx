import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, User, UserPlus, UserCircle, Check } from "lucide-react";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";

export default function TeamSelectionPage() {
  const { workspaceType, setWorkspaceType, nextStep, getStepProgress } = useOnboarding();
  const { t } = useLanguage();
  const { current, total } = getStepProgress();

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background text-foreground relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-teal-200 dark:bg-teal-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-cyan-200 dark:bg-cyan-900 blur-[120px]"></div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5 -z-10"></div>
      
      <motion.div 
        className="max-w-3xl w-full text-center"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ScripeIconRounded className="w-20 h-20" />
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-4 text-center text-gradient"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          {t('choosePlan')}
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-center"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          {t('setupWorkspace')}
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className={`bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm border ${workspaceType === "team" ? "border-teal-400 ring-2 ring-teal-400/30" : "border-gray-200 dark:border-gray-800"} rounded-xl p-8 flex flex-col items-center cursor-pointer hover:shadow-lg transition-all`}
            onClick={() => setWorkspaceType("team")}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className={`p-6 rounded-full mb-6 ${workspaceType === "team" ? "bg-gradient-to-r from-teal-400/20 to-cyan-500/20" : "bg-gray-100 dark:bg-gray-800"}`}>
              <Users className={`w-16 h-16 ${workspaceType === "team" ? "text-teal-500 dark:text-teal-400" : "text-gray-500 dark:text-gray-400"}`} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{t('forTeam')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-base mb-6">
              {t('teamDescription')}
            </p>
            {workspaceType === "team" && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-teal-600 dark:text-teal-400">Selected</span>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            className={`bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm border ${workspaceType === "personal" ? "border-cyan-400 ring-2 ring-cyan-400/30" : "border-gray-200 dark:border-gray-800"} rounded-xl p-8 flex flex-col items-center cursor-pointer hover:shadow-lg transition-all`}
            onClick={() => setWorkspaceType("personal")}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className={`p-6 rounded-full mb-6 ${workspaceType === "personal" ? "bg-gradient-to-r from-cyan-400/20 to-teal-500/20" : "bg-gray-100 dark:bg-gray-800"}`}>
              <UserCircle className={`w-16 h-16 ${workspaceType === "personal" ? "text-cyan-500 dark:text-cyan-400" : "text-gray-500 dark:text-gray-400"}`} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{t('forPersonal')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-base mb-6">
              {t('personalDescription')}
            </p>
            {workspaceType === "personal" && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-cyan-600 dark:text-cyan-400">Selected</span>
              </div>
            )}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton 
            onClick={nextStep}
            disabled={!workspaceType}
            variant="cyan"
          >
            {t('continue')}
          </ContinueButton>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <ProgressDots total={total} current={current} color="novus" />
        </motion.div>
      </motion.div>
    </div>
  );
}
