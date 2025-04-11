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
  ArrowLeft, ChevronRight, Linkedin,
  Hash, Sparkles, Image, HeartHandshake,
  TrendingUp, Reply, Layers, BarChart3, Users,
  ThumbsUp, Star
} from "lucide-react";
import { motion } from "framer-motion";
import { LovableLogo } from "@/components/LovableLogo";

export default function PostFormatPage() {
  const { postFormat, setPostFormat, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();
  const [postLength, setPostLength] = React.useState(50);
  const userInitials = "YN"; // User initials placeholder

  const formatOptions = [
    {
      id: "text",
      title: "Text",
      icon: <AlignLeft size={28} className="text-primary" />,
      description: "Professional text posts with clear value",
      example: "Just launched our new product feature that increased customer engagement by 47%. Here are the 3 key insights we learned:",
      stats: { engagement: 70, reach: 65, effort: 30 }
    },
    {
      id: "carousel",
      title: "Carousel",
      icon: <Layers size={28} className="text-primary" />,
      description: "Multi-slide posts telling a complete story",
      example: "5 Proven Strategies to Grow Your Professional Network\n1. Consistent engagement\n2. Value-first approach\n3. Strategic content sharing\n4. Industry events\n5. Thoughtful outreach",
      stats: { engagement: 85, reach: 78, effort: 70 }
    },
    {
      id: "document",
      title: "Document",
      icon: <FileText size={28} className="text-primary" />,
      description: "PDF documents for in-depth content",
      example: "I've compiled our research findings into a 5-page guide on effective leadership strategies. Download to learn the key insights from our study of 500+ executives.",
      stats: { engagement: 75, reach: 80, effort: 65 }
    },
    {
      id: "visual",
      title: "Visual",
      icon: <Image size={28} className="text-primary" />,
      description: "Image-focused posts for better engagement",
      example: "[Image] + Caption: The data speaks for itself. Our latest research shows a 32% increase in productivity when implementing these three strategies.",
      stats: { engagement: 88, reach: 75, effort: 55 }
    },
    {
      id: "poll",
      title: "Poll",
      icon: <BarChart3 size={28} className="text-primary" />,
      description: "Interactive polls to drive engagement",
      example: "What's the most effective strategy you've used to grow your professional network?\n• Creating valuable content\n• Engaging with others' posts\n• Direct outreach\n• Attending events",
      stats: { engagement: 90, reach: 60, effort: 40 }
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
    if (postLength < 30) return "~300 characters";
    if (postLength < 70) return "~1,000 characters";
    return "3,000+ characters";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-10 bg-background text-foreground relative overflow-hidden">
      {/* LinkedIn-inspired background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-primary-100 dark:bg-primary/30 blur-[120px]"></div>
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
          <Linkedin size={80} className="text-primary" />
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
          <HeartHandshake size={60} className="text-primary" />
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
          <TrendingUp size={50} className="text-primary" />
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
          <Users size={45} className="text-primary" />
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
          className="flex items-center justify-center w-10 h-10 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary rounded-full"
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
            <img 
              src="/brandout-logo-new.svg" 
              alt="Logo" 
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain mx-auto mb-6" 
            />
            <Linkedin className="absolute bottom-0 right-0 text-primary bg-white dark:bg-gray-900 p-1 rounded-full w-6 h-6 sm:w-7 sm:h-7 shadow-md" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Choose your LinkedIn content type
        </motion.h1>
        
        <motion.p 
          className="text-sm sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 text-center max-w-2xl mx-auto"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          BrandOut analyzes thousands of high-performing LinkedIn posts to optimize your content strategy.
          Select the content type that best aligns with your professional goals.
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
                  flex flex-col items-center justify-between p-4 sm:p-5 rounded-xl border 
                  transition-all duration-300 cursor-pointer h-full
                  ${postFormat === format.id 
                    ? 'border-primary bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary-50/40 dark:hover:bg-primary-900/10'
                  }
                `}
                variants={itemVariants}
                onClick={() => setPostFormat(format.id as any)}
              >
                <div className="flex flex-col items-center text-center mb-3">
                  <div className={`
                    w-12 h-12 flex items-center justify-center rounded-full 
                    ${postFormat === format.id 
                      ? 'bg-primary-100 dark:bg-primary-900/50' 
                      : 'bg-gray-100 dark:bg-gray-800'
                    } mb-3
                  `}>
                    {format.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{format.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{format.description}</p>
                </div>
                <div className={`
                  w-5 h-5 flex items-center justify-center rounded-full border-2
                  ${postFormat === format.id 
                    ? 'border-primary bg-primary text-white' 
                    : 'border-gray-300 dark:border-gray-600'
                  } 
                `}>
                  {postFormat === format.id && <Check size={12} />}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Content preview based on selected format */}
          {postFormat && (
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-2xl mx-auto mb-8"
              variants={fadeIn}
              transition={{ delay: 0.6 }}
            >
              <div className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                    {userInitials}
                  </div>
                  <div className="ml-2">
                    <div className="text-sm font-medium">Your Name</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Professional title</div>
                  </div>
                </div>
                <Linkedin size={18} className="text-primary" />
                  </div>
              <div className="p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {formatOptions.find(f => f.id === postFormat)?.example || ""}
                </p>
              </div>
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={14} /> 42
                        </span>
                  <span className="flex items-center gap-1">
                    <MessageSquareText size={14} /> 8
                        </span>
                      </div>
                <span className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                  <Star size={12} className="text-primary" />
                  <span>Content powered by BrandOut AI</span>
                </span>
              </div>
            </motion.div>
          )}
          
          {/* Post length slider */}
          <motion.div 
            className="mb-10 max-w-lg mx-auto"
            variants={fadeIn}
            transition={{ delay: 0.7 }}
          >
            <div className="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Content Length</span>
              <span>{calculateCharacterCount()}</span>
            </div>
            <Slider
              value={[postLength]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setPostLength(value[0])}
              className="mb-1"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
              <span>Concise</span>
              <span>Detailed</span>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={fadeIn}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={nextStep} 
            disabled={!postFormat}
            className="w-full sm:w-auto bg-primary hover:bg-primary-600 text-white px-8"
          >
            <span>Continue</span>
            <ChevronRight size={16} className="ml-2" />
          </Button>
        </motion.div>
        
        <motion.div
          className="mt-8 flex justify-center" 
          variants={fadeIn}
          transition={{ delay: 0.9 }}
        >
          <ProgressDots current={current} total={total} />
        </motion.div>
      </motion.div>
    </div>
  );
}
