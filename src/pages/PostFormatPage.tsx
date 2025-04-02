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
  const userInitials = "YN"; // User initials placeholder

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
      icon: <MessageSquareText size={28} className="text-blue-500" />,
      description: "Short, impactful tweets within character limits",
      example: "Just discovered the most effective way to grow your audience without spending hours on content creation.",
      stats: { engagement: 70, reach: 65, effort: 30 }
    },
    {
      id: "hashtag",
      title: "Hashtag",
      icon: <Hash size={28} className="text-blue-500" />,
      description: "Strategic hashtags to increase tweet visibility",
      example: "This writing technique doubled my engagement rate overnight #WritingCommunity #ContentCreation #GrowthHacking",
      stats: { engagement: 60, reach: 90, effort: 40 }
    },
    {
      id: "visual",
      title: "Visual",
      icon: <Image size={28} className="text-blue-500" />,
      description: "Image-focused tweets for better engagement",
      example: "[Image] + Caption: The before/after results speak for themselves. Swipe to see the difference.",
      stats: { engagement: 88, reach: 75, effort: 55 }
    },
    {
      id: "viral",
      title: "Viral",
      icon: <Sparkles size={28} className="text-blue-500" />,
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
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-10 bg-background text-foreground relative overflow-hidden">
      {/* Twitter-inspired background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-100 dark:bg-blue-900/30 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-800/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5"></div>
      </div>
      
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
          <Twitter size={80} className="text-blue-500" />
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
          <HeartHandshake size={60} className="text-blue-500" />
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
          <TrendingUp size={50} className="text-blue-500" />
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
          <Reply size={45} className="text-blue-500" />
        </motion.div>
      </div>
      
      {/* Back button */}
      <motion.div
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          rounded="full"
          className="flex items-center justify-center w-10 h-10 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400"
          onClick={prevStep}
        >
          <ArrowLeft size={18} />
        </Button>
      </motion.div>
      
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
          <div className="relative">
            <ScripeIconRounded className="w-14 h-14 sm:w-20 sm:h-20 text-blue-500" />
            <Twitter className="absolute bottom-0 right-0 text-blue-500 bg-white dark:bg-gray-900 p-1 rounded-full w-6 h-6 sm:w-7 sm:h-7 shadow-md" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Choose your tweet style
        </motion.h1>
        
        <motion.p 
          className="text-sm sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 text-center max-w-2xl mx-auto"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          TweetSphere analyzes thousands of high-performing tweets to optimize your content strategy.
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
                  bg-white dark:bg-gray-800 border 
                  ${postFormat === format.id 
                    ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700'} 
                  rounded-xl p-3 sm:p-5 flex flex-col cursor-pointer 
                  transition-all duration-300 hover:shadow-md
                `}
                onClick={() => setPostFormat(format.id as any)}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                variants={itemVariants}
              >
                <div className={`
                  w-12 h-12 rounded-full mb-3 sm:mb-4 flex items-center justify-center
                  ${postFormat === format.id 
                    ? 'bg-blue-100 dark:bg-blue-900/50' 
                    : 'bg-gray-100 dark:bg-gray-800/60'}
                `}>
                  {format.icon}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {format.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-1 mb-2">
                  {format.description}
                </p>
                {postFormat === format.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 shadow-sm">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
          
          {postFormat && (
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-10 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Tweet Preview</h3>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Post Length</h4>
                <div className="flex items-center gap-4">
                  <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    value={[postLength]}
                    onValueChange={(value) => setPostLength(value[0])}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    {calculateCharacterCount()}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3 text-xs">
                    {userInitials}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-bold text-gray-900 dark:text-gray-100 mr-1">Your Name</p>
                      <span className="text-blue-500">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                        </svg>
                      </span>
                      <span className="text-gray-500 text-sm ml-1">@yourhandle</span>
                    </div>
                    <div className="whitespace-pre-line text-gray-800 dark:text-gray-200 mt-1 mb-3 text-sm sm:text-base">
                      {postFormat && formatOptions.find(f => f.id === postFormat)?.example}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between text-gray-500 text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
                    <Reply size={16} />
                    <span>21</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-green-500 transition-colors cursor-pointer">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z" />
                    </svg>
                    <span>126</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z" />
                    </svg>
                    <span>382</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z" />
                      <path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {postFormat && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Engagement Rate</h4>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${formatOptions.find(f => f.id === postFormat)?.stats.engagement}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[36px]">
                          {formatOptions.find(f => f.id === postFormat)?.stats.engagement}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Reach Potential</h4>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${formatOptions.find(f => f.id === postFormat)?.stats.reach}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[36px]">
                          {formatOptions.find(f => f.id === postFormat)?.stats.reach}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Creation Effort</h4>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${formatOptions.find(f => f.id === postFormat)?.stats.effort}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[36px]">
                          {formatOptions.find(f => f.id === postFormat)?.stats.effort}%
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          variants={fadeIn}
          transition={{ delay: 0.7 }}
        >
          <Button
            variant="twitter"
            rounded="full"
            className="w-64 py-3 text-white font-bold"
            disabled={!postFormat}
            onClick={nextStep}
          >
            Continue
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center mt-4"
        >
          <ProgressDots total={total} current={current} color="cyan" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
