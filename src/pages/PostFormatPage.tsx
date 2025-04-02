import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  AlignLeft, AlignCenter, 
  FileText, MessageSquareText, Check, 
  ArrowLeft, ChevronRight, Twitter,
  Hash, Sparkles, Image, HeartHandshake,
  TrendingUp, Reply
} from "lucide-react";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";

export default function PostFormatPage() {
  const { postFormat, setPostFormat, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();
  const [postLength, setPostLength] = React.useState(50);

  const formatOptions = [
    {
      id: "thread",
      title: "Thread",
      icon: <AlignLeft size={28} className="text-teal-500 dark:text-teal-400" />,
      description: "Multi-post threads with a clear storyline",
      example: "1/ We've analyzed 1,000+ viral threads...\n2/ Here's what works consistently...\n3/ Starting with hook + promise...",
      stats: { engagement: 85, reach: 78, effort: 70 }
    },
    {
      id: "concise",
      title: "Concise",
      icon: <MessageSquareText size={28} className="text-cyan-500 dark:text-cyan-400" />,
      description: "Short, impactful posts within character limits",
      example: "Just discovered the most effective way to grow your audience without spending hours on content creation.",
      stats: { engagement: 70, reach: 65, effort: 30 }
    },
    {
      id: "hashtag",
      title: "Hashtag",
      icon: <Hash size={28} className="text-emerald-500 dark:text-emerald-400" />,
      description: "Strategic hashtags to increase post visibility",
      example: "This writing technique doubled my engagement rate overnight #WritingCommunity #ContentCreation #GrowthHacking",
      stats: { engagement: 60, reach: 90, effort: 40 }
    },
    {
      id: "visual",
      title: "Visual",
      icon: <Image size={28} className="text-blue-500 dark:text-blue-400" />,
      description: "Image-focused posts for better engagement",
      example: "[Image] + Caption: The before/after results speak for themselves. Swipe to see the difference.",
      stats: { engagement: 88, reach: 75, effort: 55 }
    },
    {
      id: "viral",
      title: "Viral",
      icon: <Sparkles size={28} className="text-cyan-500 dark:text-cyan-400" />,
      description: "Trend-focused posts optimized for sharing",
      example: "I tested this viral trend on 50 accounts. Only 3 techniques consistently got results. Here they are:",
      stats: { engagement: 95, reach: 85, effort: 65 }
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

  const calculateCharacterCount = () => {
    // Map slider value to character count range
    if (postLength < 30) return "~100 characters";
    if (postLength < 70) return "~200 characters";
    return "280+ characters";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-10 bg-background text-foreground relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-teal-200 dark:bg-teal-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-cyan-200 dark:bg-cyan-900 blur-[120px]"></div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5 -z-10"></div>
      
      {/* Social media floating elements for decoration - hidden on smallest screens */}
      <div className="hidden sm:block">
        <motion.div 
          className="absolute opacity-10 pointer-events-none"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8, 
            ease: "easeInOut" 
          }}
          style={{ top: '15%', right: '10%' }}
        >
          <Twitter size={80} className="text-cyan-500 dark:text-cyan-400" />
        </motion.div>
        
        <motion.div 
          className="absolute opacity-10 pointer-events-none"
          animate={{ 
            y: [0, 20, 0],
            x: [0, -15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10, 
            ease: "easeInOut",
            delay: 1 
          }}
          style={{ bottom: '20%', left: '8%' }}
        >
          <HeartHandshake size={60} className="text-teal-500 dark:text-teal-400" />
        </motion.div>
        
        <motion.div 
          className="absolute opacity-10 pointer-events-none"
          animate={{ 
            y: [0, -10, 0],
            x: [0, -10, 0],
            rotate: [0, 3, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 7, 
            ease: "easeInOut",
            delay: 0.5 
          }}
          style={{ top: '30%', left: '15%' }}
        >
          <TrendingUp size={50} className="text-emerald-500 dark:text-emerald-400" />
        </motion.div>
        
        <motion.div 
          className="absolute opacity-10 pointer-events-none"
          animate={{ 
            y: [0, 15, 0],
            x: [0, 5, 0],
            rotate: [0, -3, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 9, 
            ease: "easeInOut",
            delay: 1.5 
          }}
          style={{ bottom: '30%', right: '12%' }}
        >
          <Reply size={45} className="text-cyan-500 dark:text-cyan-400" />
        </motion.div>
      </div>
      
      {/* Back button */}
      <BackButton 
        onClick={prevStep} 
        absolute 
      />
      
      <motion.div 
        className="max-w-4xl w-full" 
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="mb-4 sm:mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ScripeIconRounded className="w-14 h-14 sm:w-20 sm:h-20" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-center text-gradient"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Choose your content style
        </motion.h1>
        
        <motion.div 
          className="flex items-center justify-center gap-2 mb-4 sm:mb-8"
          variants={fadeIn}
          transition={{ delay: 0.25 }}
        >
          <Twitter size={18} className="text-cyan-600 dark:text-cyan-400" />
          <span className="text-cyan-600 dark:text-cyan-400 font-medium text-sm sm:text-base">Social Media Optimization</span>
        </motion.div>
        
        <motion.p 
          className="text-sm sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 text-center max-w-2xl mx-auto"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Novus analyzes thousands of high-performing posts to optimize your content strategy.
          Select the content style that resonates with your audience.
        </motion.p>
        
        <motion.div 
          className="mb-6 sm:mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-10"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            {formatOptions.map((format, index) => (
              <motion.div 
                key={format.id}
                className={`
                  bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border 
                  ${postFormat === format.id 
                    ? 'border-teal-400/50 dark:border-teal-400/30 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-800 opacity-90'} 
                  rounded-xl p-3 sm:p-5 flex flex-col cursor-pointer 
                  transition-all hover:bg-gradient-to-br hover:from-cyan-50/80 hover:to-teal-50/80 
                  dark:hover:from-cyan-900/30 dark:hover:to-teal-900/30 hover:shadow-md group
                  ${postFormat === format.id ? 'ring-2 ring-teal-400/50 dark:ring-teal-500/40' : ''}
                `}
                onClick={() => setPostFormat(format.id as any)}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="mb-2 sm:mb-3 flex justify-between items-start">
                  <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30">
                    {format.icon}
                  </div>
                  {postFormat === format.id && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-5 h-5 bg-teal-500 dark:bg-teal-400 rounded-full flex items-center justify-center"
                    >
                      <Check size={12} className="text-white" />
                    </motion.div>
                  )}
                </div>
                <h3 className="font-medium text-sm sm:text-base mb-1 text-gray-900 dark:text-gray-100">{format.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow">{format.description}</p>
                <div className="text-[9px] sm:text-[10px] bg-gray-100 dark:bg-gray-800/60 p-1.5 rounded font-mono text-gray-500 dark:text-gray-400">
                  {format.example.substring(0, 42)}...
                </div>
                {postFormat === format.id && (
                  <motion.div 
                    className="flex justify-between mt-3 text-[10px] text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-teal-600 dark:text-teal-400 font-semibold">{format.stats.engagement}%</span>
                      <span>Engage</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{format.stats.reach}%</span>
                      <span>Reach</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">{format.stats.effort}%</span>
                      <span>Effort</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6 mb-8"
            variants={itemVariants}
          >
            <h3 className="font-medium mb-2 sm:mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>Post Length</span>
              <span className="text-xs py-0.5 px-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400">
                {calculateCharacterCount()}
              </span>
            </h3>
            <div className="mb-3">
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                value={[postLength]}
                onValueChange={(value) => setPostLength(value[0])}
                className="py-4"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <div>Concise</div>
              <div>Standard</div>
              <div>Detailed</div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton 
            onClick={nextStep} 
            disabled={!postFormat}
            variant="cyan"
          >
            Continue
          </ContinueButton>
          
          <Button
            variant="outline"
            rounded="full"
            onClick={() => setPostFormat(null)}
            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-cyan-600 dark:hover:text-cyan-400"
          >
            Reset Selection
          </Button>
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
