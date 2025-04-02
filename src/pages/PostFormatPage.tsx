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
      icon: <AlignLeft size={32} className="text-blue-500" />,
      description: "Multi-tweet threads with a clear storyline",
      example: "1/ We've analyzed 1,000+ viral threads...\n2/ Here's what works consistently...\n3/ Starting with hook + promise...",
      stats: { engagement: 85, reach: 78, effort: 70 }
    },
    {
      id: "concise",
      title: "Concise",
      icon: <MessageSquareText size={32} className="text-cyan-500" />,
      description: "Short, impactful tweets within character limits",
      example: "Just discovered the most effective way to grow your audience without spending hours on content creation.",
      stats: { engagement: 70, reach: 65, effort: 30 }
    },
    {
      id: "hashtag",
      title: "Hashtag",
      icon: <Hash size={32} className="text-green-500" />,
      description: "Strategic hashtags to increase tweet visibility",
      example: "This writing technique doubled my engagement rate overnight #WritingCommunity #ContentCreation #GrowthHacking",
      stats: { engagement: 60, reach: 90, effort: 40 }
    },
    {
      id: "visual",
      title: "Visual",
      icon: <Image size={32} className="text-yellow-500" />,
      description: "Image-focused tweets for better engagement",
      example: "[Image] + Caption: The before/after results speak for themselves. Swipe to see the difference.",
      stats: { engagement: 88, reach: 75, effort: 55 }
    },
    {
      id: "viral",
      title: "Viral",
      icon: <Sparkles size={32} className="text-pink-500" />,
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-cyan-900 blur-[120px]"></div>
      </div>
      
      {/* Twitter-like floating elements for decoration */}
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
          className="mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ScripeIconRounded className="w-20 h-20" />
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Choose your Twitter content style
        </motion.h1>
        
        <motion.div 
          className="flex items-center justify-center gap-2 mb-8"
          variants={fadeIn}
          transition={{ delay: 0.25 }}
        >
          <Twitter size={20} className="text-blue-400" />
          <span className="text-blue-400 font-medium">Twitter Optimization</span>
        </motion.div>
        
        <motion.p 
          className="text-xl text-gray-300 mb-10 text-center max-w-2xl mx-auto"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Scripe analyzes thousands of high-performing tweets to optimize your content strategy.
          Select the tweet style that resonates with your audience.
        </motion.p>
        
        <motion.div 
          className="mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            {formatOptions.map((format, index) => (
              <motion.div 
                key={format.id}
                className={`
                  bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 flex flex-col cursor-pointer 
                  transition-all hover:bg-gray-800/70 hover-lift group
                  ${postFormat === format.id ? 'ring-2 ring-blue-600 shadow-glow' : 'opacity-90'}
                `}
                onClick={() => setPostFormat(format.id as any)}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="w-full aspect-square rounded-lg bg-gray-800/80 mb-4 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/90 z-0"></div>
                  <div className="relative z-10 p-3">
                    {format.icon}
                    {postFormat === format.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <motion.div 
                    className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                    animate={postFormat === format.id ? { opacity: 0.2 } : { opacity: 0 }}
                  />
                </div>
                
                <div className="mb-3">
                  <h3 className="text-sm font-medium flex items-center gap-1.5">
                    {format.title}
                    {format.id === "thread" && <span className="text-xs text-blue-400 font-normal">(Popular)</span>}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{format.description}</p>
                </div>
                
                <div className="mt-auto">
                  <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">Effectiveness</div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>Engagement</span>
                        <span className="text-blue-400">{format.stats.engagement}%</span>
                      </div>
                      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-500 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${format.stats.engagement}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`
                  mt-3 p-2 rounded-md text-[10px] leading-tight
                  ${postFormat === format.id ? 'bg-blue-900/30 text-gray-300' : 'bg-gray-800/50 text-gray-500'}
                  transition-colors duration-300
                `}>
                  <div className="font-medium mb-1 text-[9px] uppercase tracking-wide text-gray-400">Example:</div>
                  {format.example}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-6"
            variants={fadeIn}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-medium mb-1">Tweet length preference</h3>
                <span className="text-xs text-gray-400">Customize your ideal tweet length</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm text-blue-400 font-medium">
                  {postLength < 30 ? "Short tweets" : 
                   postLength < 70 ? "Medium length" : 
                   "Long-form/Threads"}
                </span>
                <span className="text-xs text-gray-400">{calculateCharacterCount()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
              <Slider 
                defaultValue={[postLength]} 
                max={100} 
                step={1}
                onValueChange={(values) => setPostLength(values[0])}
                className="py-5"
              />
              
              <div className="text-center rounded-full border border-blue-600/30 px-4 py-2 bg-blue-600/10">
                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-blue-400" /> 
                  <span className="text-xs text-blue-400 whitespace-nowrap">Twitter optimized</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-5">
              <div className="flex-1 min-w-[100px] p-3 rounded-md bg-gray-800/50 text-center">
                <span className="text-xs text-gray-400 block mb-1">Short</span>
                <span className="text-sm font-medium text-blue-400">High Impact</span>
              </div>
              <div className="flex-1 min-w-[100px] p-3 rounded-md bg-gray-800/50 text-center">
                <span className="text-xs text-gray-400 block mb-1">Medium</span>
                <span className="text-sm font-medium text-blue-400">Good Balance</span>
              </div>
              <div className="flex-1 min-w-[100px] p-3 rounded-md bg-gray-800/50 text-center">
                <span className="text-xs text-gray-400 block mb-1">Thread</span>
                <span className="text-sm font-medium text-blue-400">In-depth</span>
              </div>
            </div>
          </motion.div>
          
          <motion.p 
            className="text-sm text-gray-400 text-center max-w-xl mx-auto"
            variants={fadeIn}
            transition={{ delay: 0.7 }}
          >
            As you use Scripe, the AI will learn from your engagement patterns and continuously refine your Twitter content strategy for optimal results.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeIn}
          transition={{ delay: 0.8 }}
        >
          <ContinueButton 
            onClick={nextStep}
            disabled={!postFormat}
            variant="twitter"
          >
            Continue to next step
          </ContinueButton>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center"
        >
          <ProgressDots total={total} current={current} color="blue" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
