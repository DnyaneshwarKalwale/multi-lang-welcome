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
      icon: <AlignLeft size={28} className="text-blue-500" />,
      description: "Multi-tweet threads with a clear storyline",
      example: "1/ We've analyzed 1,000+ viral threads...\n2/ Here's what works consistently...\n3/ Starting with hook + promise...",
      stats: { engagement: 85, reach: 78, effort: 70 }
    },
    {
      id: "concise",
      title: "Concise",
      icon: <MessageSquareText size={28} className="text-cyan-500" />,
      description: "Short, impactful tweets within character limits",
      example: "Just discovered the most effective way to grow your audience without spending hours on content creation.",
      stats: { engagement: 70, reach: 65, effort: 30 }
    },
    {
      id: "hashtag",
      title: "Hashtag",
      icon: <Hash size={28} className="text-green-500" />,
      description: "Strategic hashtags to increase tweet visibility",
      example: "This writing technique doubled my engagement rate overnight #WritingCommunity #ContentCreation #GrowthHacking",
      stats: { engagement: 60, reach: 90, effort: 40 }
    },
    {
      id: "visual",
      title: "Visual",
      icon: <Image size={28} className="text-yellow-500" />,
      description: "Image-focused tweets for better engagement",
      example: "[Image] + Caption: The before/after results speak for themselves. Swipe to see the difference.",
      stats: { engagement: 88, reach: 75, effort: 55 }
    },
    {
      id: "viral",
      title: "Viral",
      icon: <Sparkles size={28} className="text-pink-500" />,
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
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-cyan-900 blur-[120px]"></div>
      </div>
      
      {/* Twitter-like floating elements for decoration - hidden on smallest screens */}
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
          <Twitter size={80} className="text-blue-400" />
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
          <HeartHandshake size={60} className="text-pink-400" />
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
          <TrendingUp size={50} className="text-green-400" />
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
          <Reply size={45} className="text-cyan-400" />
        </motion.div>
      </div>
      
      {/* Back button */}
      <BackButton 
        onClick={prevStep} 
        absolute 
        variant="twitter" 
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
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
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
          className="text-sm sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-10 text-center max-w-2xl mx-auto"
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
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-10"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            {formatOptions.map((format, index) => (
              <motion.div 
                key={format.id}
                className={`
                  bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-3 sm:p-5 flex flex-col cursor-pointer 
                  transition-all hover:bg-gray-800/70 hover-lift group
                  ${postFormat === format.id ? 'ring-2 ring-blue-600 shadow-glow' : 'opacity-90'}
                `}
                onClick={() => setPostFormat(format.id as any)}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="w-full aspect-square rounded-lg bg-gray-800/80 mb-2 sm:mb-4 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-transparent" />
                  <div className="z-10">{format.icon}</div>
                  
                  {postFormat === format.id && (
                    <div className="absolute bottom-2 right-2 bg-blue-600 rounded-full p-1">
                      <Check size={12} />
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">{format.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-2">{format.description}</p>
                
                <div className="mt-auto space-y-1">
                  {Object.entries(format.stats).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs capitalize text-gray-500">{key}</span>
                      <div className="flex-1 mx-2 bg-gray-800 h-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-blue-600" 
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-400">{value}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {postFormat && (
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 sm:p-6 max-w-3xl mx-auto"
              variants={fadeIn}
              transition={{ delay: 0.6 }}
            >
              <h3 className="font-medium text-lg mb-2">Example Tweet Format:</h3>
              <pre className="bg-gray-800/70 rounded-md p-3 text-xs sm:text-sm text-blue-100 overflow-auto max-h-24">
                {formatOptions.find(f => f.id === postFormat)?.example || "Select a format to see an example"}
              </pre>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm sm:text-base font-medium">Your preferred tweet length</h4>
                  <span className="text-xs text-blue-400">{calculateCharacterCount()}</span>
                </div>
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  value={[postLength]}
                  onValueChange={([value]) => setPostLength(value)}
                  className="my-6"
                />
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                  <span>Shorter</span>
                  <span>Medium</span>
                  <span>Longer</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          variants={fadeIn}
          transition={{ delay: 0.7 }}
        >
          <ContinueButton 
            onClick={nextStep}
            disabled={!postFormat}
            variant="twitter"
          >
            Continue
          </ContinueButton>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center"
        >
          <ProgressDots total={total} current={current} color="blue" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
