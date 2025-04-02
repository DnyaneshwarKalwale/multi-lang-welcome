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
      icon: <AlignLeft size={24} className="text-blue-500" />,
      description: "Multi-tweet threads with a clear storyline",
      example: "1/ We've analyzed 1,000+ viral threads...\n2/ Here's what works consistently...\n3/ Starting with hook + promise...",
      stats: { engagement: 85, reach: 78, effort: 70 }
    },
    {
      id: "concise",
      title: "Concise",
      icon: <MessageSquareText size={24} className="text-cyan-500" />,
      description: "Short, impactful tweets within character limits",
      example: "Just discovered the most effective way to grow your audience without spending hours on content creation.",
      stats: { engagement: 70, reach: 65, effort: 30 }
    },
    {
      id: "hashtag",
      title: "Hashtag",
      icon: <Hash size={24} className="text-green-500" />,
      description: "Strategic hashtags to increase tweet visibility",
      example: "This writing technique doubled my engagement rate overnight #WritingCommunity #ContentCreation #GrowthHacking",
      stats: { engagement: 60, reach: 90, effort: 40 }
    },
    {
      id: "visual",
      title: "Visual",
      icon: <Image size={24} className="text-yellow-500" />,
      description: "Image-focused tweets for better engagement",
      example: "[Image] + Caption: The before/after results speak for themselves. Swipe to see the difference.",
      stats: { engagement: 88, reach: 75, effort: 55 }
    },
    {
      id: "viral",
      title: "Viral",
      icon: <Sparkles size={24} className="text-pink-500" />,
      description: "Trend-focused tweets optimized for sharing",
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
    <div className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 py-6 sm:py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-cyan-900 blur-[120px]"></div>
      </div>
      
      {/* Twitter-like floating elements for decoration */}
      <motion.div 
        className="absolute opacity-10 pointer-events-none hidden sm:block"
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
        <Twitter size={80} className="text-blue-400" />
      </motion.div>
      
      <motion.div 
        className="absolute opacity-10 pointer-events-none hidden sm:block"
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
        <HeartHandshake size={60} className="text-pink-400" />
      </motion.div>
      
      <motion.div 
        className="absolute opacity-10 pointer-events-none hidden sm:block"
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
        <TrendingUp size={50} className="text-green-400" />
      </motion.div>
      
      <motion.div 
        className="absolute opacity-10 pointer-events-none hidden sm:block"
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
        <Reply size={45} className="text-cyan-400" />
      </motion.div>
      
      {/* Back button */}
      <BackButton 
        onClick={prevStep} 
        absolute 
        variant="twitter" 
      />
      
      <motion.div 
        className="max-w-4xl w-full px-2 sm:px-4" 
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
          <ScripeIconRounded className="w-16 h-16 sm:w-20 sm:h-20" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Choose your Twitter content style
        </motion.h1>
        
        <motion.div 
          className="flex items-center justify-center gap-2 mb-4 sm:mb-8"
          variants={fadeIn}
          transition={{ delay: 0.25 }}
        >
          <Twitter size={18} className="text-blue-400" />
          <span className="text-blue-400 font-medium text-sm sm:text-base">Twitter Optimization</span>
        </motion.div>
        
        <motion.p 
          className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-10 text-center max-w-2xl mx-auto px-2"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Scripe analyzes thousands of high-performing tweets to optimize your content strategy.
          Select the tweet style that resonates with your audience.
        </motion.p>
        
        <motion.div 
          className="mb-6 sm:mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            {formatOptions.map((format, index) => (
              <motion.div 
                key={format.id}
                className={`
                  bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-2 sm:p-3 flex flex-col cursor-pointer 
                  transition-all hover:bg-gray-800/70 hover-lift group
                  ${postFormat === format.id ? 'ring-2 ring-blue-600 shadow-glow' : 'opacity-90'}
                `}
                onClick={() => setPostFormat(format.id as any)}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="w-full aspect-square rounded-md bg-gray-800/80 mb-2 sm:mb-3 relative flex items-center justify-center overflow-hidden">
                  {format.icon}
                    </div>
                <h3 className="text-sm sm:text-base font-semibold mb-1">{format.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-2 flex-grow">{format.description}</p>
                <div className="text-[10px] sm:text-xs text-gray-500 bg-gray-800/50 rounded-md p-1.5">
                  <p className="font-mono whitespace-pre-line">{format.example}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-800">
                  <div className="flex justify-between text-[10px] sm:text-xs">
                    <span className="text-gray-400">Engagement</span>
                    <span className="text-blue-400">{format.stats.engagement}%</span>
                  </div>
              </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center gap-4 sm:gap-6"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <div className="w-full max-w-md">
            <div className="flex justify-between mb-2">
              <span className="text-sm sm:text-base text-gray-400">Post Length</span>
              <span className="text-sm sm:text-base text-blue-400">{calculateCharacterCount()}</span>
            </div>
            <Slider 
              value={[postLength]}
              onValueChange={(value) => setPostLength(value[0])}
              max={100} 
              step={1}
              className="w-full"
            />
          </div>
          
          <ContinueButton 
            onClick={nextStep}
            disabled={!postFormat} 
            className="w-full sm:w-auto"
          />
        </motion.div>
      </motion.div>
      
      <ProgressDots 
        current={current} 
        total={total} 
        variant="twitter"
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
      />
    </div>
  );
}
