import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  AlignLeft, AlignCenter, Twitter,
  FileText, MessageSquareText, Check, 
  ArrowLeft, ChevronRight, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";

// Map Twitter formats to existing context formats
const formatMapping = {
  "standard": "standard",
  "threaded": "threaded", // Already added to context
  "engagement": "engagement", // Already added to context
  "concise": "concise", // Already added to context
  "emojis": "emojis"
};

export default function PostFormatPage() {
  const { postFormat, setPostFormat, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();
  const [postLength, setPostLength] = React.useState(50);
  const [hoveredFormat, setHoveredFormat] = React.useState<string | null>(null);
  const navigate = useNavigate();

  // Debug logging for postFormat
  useEffect(() => {
    console.log("Current postFormat:", postFormat);
  }, [postFormat]);

  const formatOptions = [
    {
      id: "standard",
      title: "Standard",
      icon: <AlignLeft size={32} className="text-purple-500" />,
      description: "Clean formatting with paragraphs and hashtags for Twitter",
      preview: "Our new product launch is coming next week! #excited\n\nWe've been working on this for months and can't wait to share it with you.\n\nStay tuned for more details! #innovation"
    },
    {
      id: "threaded",
      title: "Thread-style",
      icon: <FileText size={32} className="text-blue-500" />,
      description: "Twitter thread with numbered points (1/5, 2/5, etc.)",
      preview: "1/ Our new product launch is next week! Here's what you need to know 🧵\n\n2/ We've been developing this for 6 months\n\n3/ It solves the biggest problems our users face\n\n4/ Early beta testers loved it\n\n5/ Join our waitlist now! Link in bio"
    },
    {
      id: "engagement",
      title: "Engagement",
      icon: <AlignCenter size={32} className="text-green-500" />,
      description: "Posts with questions and calls to action for more replies",
      preview: "What's your biggest challenge with social media management?\n\nWe're building something special to help, and would love your input!\n\nReply with your thoughts or DM us 👇"
    },
    {
      id: "concise",
      title: "Concise",
      icon: <MessageSquareText size={32} className="text-yellow-500" />,
      description: "Short tweets optimized for maximum impact in 280 characters",
      preview: "Just launched our new social media management tool! Saves 5 hours/week, automates posting, and boosts engagement by 34%. Try it free: [link]"
    },
    {
      id: "emojis",
      title: "Emojis",
      icon: <span className="text-3xl">😀</span>,
      description: "Tweets with strategic emoji usage for higher engagement",
      preview: "✨ BIG NEWS! ✨\n\nOur new product is here! 🚀\n\n💯 Faster workflow\n⏱️ Saves 5 hours/week\n📈 34% more engagement\n\nTry it now! 👇\n[link]"
    }
  ];

  // Handle format selection with logging
  const handleFormatSelect = (formatId: string) => {
    console.log("Setting format to:", formatId);
    setPostFormat(formatId as any);
    // Log state after selection
    setTimeout(() => console.log("Updated postFormat:", formatId), 0);
  };

  // Handle continue button - use nextStep from context
  const handleContinue = () => {
    console.log("Continue button clicked, current format:", postFormat);
    if (postFormat) {
      // Save to localStorage as a backup
      localStorage.setItem('selectedPostFormat', postFormat);
      console.log("Calling nextStep with format:", postFormat);
      
      // Use the nextStep function from context
      nextStep();
    } else {
      console.log("Not calling nextStep because postFormat is empty");
    }
  };

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

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  };

  // Function to get a placeholder style preview based on format
  const getPreviewContent = (formatId: string) => {
    const option = formatOptions.find(opt => opt.id === formatId);
    return option?.preview || "";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Enhanced animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px] animate-pulse-slow-delay"></div>
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-900 blur-[100px] animate-float opacity-30"></div>
      </div>
      
      {/* Twitter icons floating in background */}
      <div className="absolute inset-0 overflow-hidden -z-5 opacity-10">
        <motion.div 
          className="absolute text-blue-400"
          initial={{ x: "-10%", y: "10%", opacity: 0.2 }}
          animate={{ 
            x: "110%", 
            y: "60%", 
            opacity: [0.2, 0.5, 0.2],
            rotate: 15
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Twitter size={50} />
        </motion.div>
        <motion.div 
          className="absolute text-blue-400"
          initial={{ x: "110%", y: "30%", opacity: 0.2 }}
          animate={{ 
            x: "-10%", 
            y: "80%", 
            opacity: [0.2, 0.4, 0.2],
            rotate: -15
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Twitter size={30} />
        </motion.div>
        <motion.div 
          className="absolute text-blue-300"
          initial={{ x: "50%", y: "-10%", opacity: 0.2 }}
          animate={{ 
            x: "30%", 
            y: "110%", 
            opacity: [0.2, 0.3, 0.2],
            rotate: 10
          }}
          transition={{ 
            duration: 35, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Twitter size={40} />
        </motion.div>
      </div>
      
      {/* Back button */}
      <motion.button
        className="absolute top-10 left-10 flex items-center text-gray-400 hover:text-white transition-colors"
        onClick={prevStep}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </motion.button>
      
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
          className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Choose your Twitter posting style
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-10 text-center max-w-2xl mx-auto"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Scripe analyzes millions of viral tweets to help you create content that resonates.
          Select the style that matches your Twitter voice and audience.
        </motion.p>
        
        <motion.div 
          className="mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            {formatOptions.map((format) => (
              <motion.div 
                key={format.id}
                className={`
                  bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex flex-col items-center cursor-pointer 
                  transition-all hover:bg-gray-800/70 hover:shadow-lg
                  ${postFormat === format.id ? 'ring-2 ring-indigo-600 shadow-glow' : 'opacity-80'}
                `}
                onClick={() => handleFormatSelect(format.id)}
                onMouseEnter={() => setHoveredFormat(format.id)}
                onMouseLeave={() => setHoveredFormat(null)}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                animate={postFormat === format.id ? pulseAnimation : {}}
              >
                <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-gray-800/80 to-gray-900/80 mb-3 relative flex flex-col items-center justify-center p-3">
                  <div className="mb-2">
                    {format.icon}
                  </div>
                  <p className="text-xs text-center text-gray-400 line-clamp-3 overflow-hidden">
                    {format.description}
                  </p>
                  {postFormat === format.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  {/* Shine effect on hover */}
                  {(hoveredFormat === format.id || postFormat === format.id) && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1, repeat: 0 }}
                    />
                  )}
                </div>
                <span className="text-sm font-medium">{format.title}</span>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Preview area */}
          {postFormat && (
            <motion.div
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center mb-3">
                <Twitter size={18} className="text-blue-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-300">Tweet Preview</h3>
                <span className="ml-auto flex items-center text-xs text-indigo-400 gap-1">
                  <Sparkles size={12} />
                  AI Generated Example
                </span>
              </div>
              <div className="border border-gray-800 rounded-lg p-4 bg-black/50 whitespace-pre-line text-sm text-gray-300">
                {getPreviewContent(postFormat)}
              </div>
            </motion.div>
          )}
          
          <motion.div 
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-6"
            variants={fadeIn}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Tweet length preference</span>
              <span className="text-sm text-gray-400">Max characters</span>
            </div>
            <Slider 
              defaultValue={[postLength]} 
              max={100} 
              step={1}
              onValueChange={(values) => setPostLength(values[0])}
              className="py-5"
            />
            <div className="flex justify-between text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
                <span className="text-gray-400">Short tweets</span>
              </div>
              <div className="text-center text-gray-500">{postLength}/100</div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
                <span className="text-gray-400">Full threads</span>
              </div>
            </div>
          </motion.div>
          
          <motion.p 
            className="text-sm text-gray-400 text-center"
            variants={fadeIn}
            transition={{ delay: 0.7 }}
          >
            Scripe will learn from your engagement metrics to optimize your Twitter content over time.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeIn}
          transition={{ delay: 0.8 }}
        >
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (postFormat) {
                handleFormatSelect(postFormat);
                handleContinue();
                window.location.href = "/onboarding/post-frequency";
              }
            }}
            className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-medium text-white transition-all duration-300 shadow-xl hover:shadow-indigo-500/25 ${!postFormat ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:from-indigo-700 hover:to-purple-700'}`}
          >
            <span>Continue</span>
            <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </motion.div>
        
        {/* Debug information */}
        <motion.div 
          className="text-xs text-gray-600 text-center mb-4"
          variants={fadeIn}
        >
          Selected format: {postFormat || "none"}
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.9 }}
          className="flex justify-center"
        >
          <ProgressDots total={total} current={current} />
        </motion.div>
      </motion.div>
    </div>
  );
}
