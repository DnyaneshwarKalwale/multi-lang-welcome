import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  ThumbsUp
} from "lucide-react";
import { motion } from "framer-motion";
import { BrandOutIcon } from "@/components/BrandOutIcon";

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
      shortExample: "Just launched our new product feature that increased customer engagement by 47%.",
      mediumExample: "Just launched our new product feature that increased customer engagement by 47%. Here are the 3 key insights we learned:",
      longExample: "Just launched our new product feature that increased customer engagement by 47%. Here are the 3 key insights we learned:\n\n1. Customer feedback is crucial during development stages\n2. Regular A/B testing helps refine the solution\n3. Small incremental changes have a compound effect\n\nWe're excited to continue building and improving. Follow along for more updates on our journey!",
      stats: { engagement: 70, reach: 65, effort: 30 }
    },
    {
      id: "carousel",
      title: "Carousel",
      icon: <Layers size={28} className="text-primary" />,
      description: "Multi-slide posts telling a complete story",
      shortExample: "5 Proven Strategies to Grow Your Professional Network",
      mediumExample: "5 Proven Strategies to Grow Your Professional Network\n1. Consistent engagement\n2. Value-first approach\n3. Strategic content sharing",
      longExample: "5 Proven Strategies to Grow Your Professional Network\n\n1. Consistent engagement: Be active daily, comment thoughtfully on industry posts\n\n2. Value-first approach: Share insights before asking for anything in return\n\n3. Strategic content sharing: Post original content that demonstrates your expertise\n\n4. Industry events: Attend both virtual and in-person networking opportunities\n\n5. Thoughtful outreach: Connect with personalized messages explaining why you'd like to connect",
      stats: { engagement: 85, reach: 78, effort: 70 }
    },
    {
      id: "document",
      title: "Document",
      icon: <FileText size={28} className="text-primary" />,
      description: "PDF documents for in-depth content",
      shortExample: "I've compiled our research findings into a guide on effective leadership strategies.",
      mediumExample: "I've compiled our research findings into a 5-page guide on effective leadership strategies. Download to learn the key insights from our study.",
      longExample: "I've compiled our research findings into a 5-page guide on effective leadership strategies. Download to learn the key insights from our study of 500+ executives.\n\nIn this document, you'll discover:\n• The top 3 traits of high-performing leaders\n• Communication frameworks that drive team engagement\n• Decision-making processes that improve outcomes by 27%\n• Practical tools for immediate implementation\n\nComment 'interested' below and I'll send you a copy directly.",
      stats: { engagement: 75, reach: 80, effort: 65 }
    },
    {
      id: "visual",
      title: "Visual",
      icon: <Image size={28} className="text-primary" />,
      description: "Image-focused posts for better engagement",
      shortExample: "[Image] + Caption: The data speaks for itself.",
      mediumExample: "[Image] + Caption: The data speaks for itself. Our latest research shows a 32% increase in productivity.",
      longExample: "[Image] + Caption: The data speaks for itself. Our latest research shows a 32% increase in productivity when implementing these three strategies.\n\nWhat we found surprising was how simple changes in daily routines led to such significant improvements. The key factors were:\n\n1. Structured deep work sessions\n2. Cross-functional collaboration\n3. Purpose-driven goal setting\n\nI'd love to hear which of these you've tried and what your experience has been. Share in the comments below!",
      stats: { engagement: 88, reach: 75, effort: 55 }
    },
    {
      id: "poll",
      title: "Poll",
      icon: <BarChart3 size={28} className="text-primary" />,
      description: "Interactive polls to drive engagement",
      shortExample: "What's the most effective strategy you've used to grow your professional network?",
      mediumExample: "What's the most effective strategy you've used to grow your professional network?\n• Creating valuable content\n• Engaging with others' posts",
      longExample: "What's the most effective strategy you've used to grow your professional network?\n\n• Creating valuable content\n• Engaging with others' posts\n• Direct outreach\n• Attending events\n\nI'm conducting research for my upcoming article on networking strategies in the digital age. Would love to hear your experiences in the comments as well!",
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

  // Function to get the appropriate example text based on post length
  const getExampleText = (format: any) => {
    if (!format) return "";
    
    if (postLength < 30) {
      return format.shortExample || "";
    } else if (postLength < 70) {
      return format.mediumExample || "";
    } else {
      return format.longExample || "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-10 bg-white text-foreground relative overflow-hidden">
      {/* LinkedIn-inspired background - simplified and brightened */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-50 blur-[120px] opacity-70"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-50 blur-[120px] opacity-70"></div>
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
          className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-100 hover:text-primary rounded-full"
          onClick={prevStep}
        >
          <ArrowLeft size={18} />
        </Button>
      </motion.div>
      
      <motion.div 
        className="max-w-6xl w-full" 
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="mb-6 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <BrandOutIcon className="w-14 h-14 sm:w-16 sm:h-16" />
            <Linkedin className="absolute bottom-0 right-0 text-[#0077B5] bg-white p-1 rounded-full shadow-md" size={22} />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-center text-gray-800"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Pick your preferred post formatting style
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 mb-6 text-center max-w-md mx-auto text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Scripe is trained on millions of viral posts. When you create posts, the best performing posts about the same topics will be used as a reference.
        </motion.p>
        
        {/* Two-column layout with post preview on left and options on right */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Preview column - left side on desktop */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            {postFormat ? (
              <motion.div 
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full"
                variants={fadeIn}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="border-b border-gray-200 p-3 flex items-center justify-between bg-white">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#0077B5] flex items-center justify-center text-white">
                      {userInitials}
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium">Your Name</div>
                      <div className="text-xs text-gray-500">Professional title</div>
                    </div>
                  </div>
                  <Linkedin size={18} className="text-[#0077B5]" />
                </div>
                <div className="p-4 min-h-[300px]">
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {getExampleText(formatOptions.find(f => f.id === postFormat))}
                  </p>
                </div>
                <div className="p-3 border-t border-gray-200 bg-white flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={14} /> {postLength > 50 ? "87" : "42"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquareText size={14} /> {postLength > 50 ? "16" : "8"}
                    </span>
                  </div>
                  <span>Content powered by Scripe AI</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center justify-center h-full min-h-[300px] rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4"
                variants={fadeIn}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center text-gray-500">
                  <FileText size={40} className="mx-auto mb-3 text-gray-400" />
                  <p>Select a format to preview your LinkedIn content</p>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Options column - right side on desktop */}
          <div className="lg:w-1/2 order-1 lg:order-2">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Format options */}
              <motion.div 
                className="grid grid-cols-5 gap-3 mb-8"
                variants={fadeIn}
                transition={{ delay: 0.4 }}
              >
                {formatOptions.map((format, index) => (
                  <motion.div 
                    key={format.id}
                    className={`
                      flex flex-col items-center justify-between p-3 rounded-xl border 
                      transition-all duration-300 cursor-pointer h-full
                      ${postFormat === format.id 
                        ? 'border-[#0077B5] bg-blue-50' 
                        : 'border-gray-200 hover:border-[#0077B5] hover:bg-blue-50/40'
                      }
                    `}
                    variants={itemVariants}
                    onClick={() => setPostFormat(format.id as any)}
                  >
                    <div className="flex flex-col items-center text-center mb-2">
                      <div className={`
                        w-12 h-12 flex items-center justify-center rounded-xl 
                        ${postFormat === format.id 
                          ? 'bg-white shadow-sm' 
                          : 'bg-gray-50'
                        } mb-2
                      `}>
                        {format.icon}
                      </div>
                      <h3 className="font-medium text-sm mb-0">{format.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Post length slider with 3 checkpoints */}
              <motion.div 
                className="mb-10"
                variants={fadeIn}
                transition={{ delay: 0.7 }}
              >
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>Post length</span>
                  <span>{calculateCharacterCount()}</span>
                </div>
                
                {/* Custom slider with checkpoint marks */}
                <div className="relative mb-6">
                  <Slider
                    value={[postLength]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setPostLength(value[0])}
                    className="mb-3"
                  />
                  
                  {/* Checkpoints */}
                  <div className="flex justify-between mt-1 relative">
                    {/* Checkpoint 1 */}
                    <div 
                      className={`checkpoint flex flex-col items-center cursor-pointer`}
                      onClick={() => setPostLength(15)}
                    >
                      <div className={`w-3 h-3 rounded-full ${postLength <= 30 ? 'bg-[#0077B5]' : 'bg-gray-300'} mb-1`}></div>
                      <span className={`text-xs ${postLength <= 30 ? 'text-[#0077B5] font-medium' : 'text-gray-500'}`}>
                        Short
                      </span>
                    </div>
                    
                    {/* Checkpoint 2 */}
                    <div 
                      className={`checkpoint flex flex-col items-center cursor-pointer`}
                      onClick={() => setPostLength(50)}
                    >
                      <div className={`w-3 h-3 rounded-full ${postLength > 30 && postLength < 70 ? 'bg-[#0077B5]' : 'bg-gray-300'} mb-1`}></div>
                      <span className={`text-xs ${postLength > 30 && postLength < 70 ? 'text-[#0077B5] font-medium' : 'text-gray-500'}`}>
                        Medium
                      </span>
                    </div>
                    
                    {/* Checkpoint 3 */}
                    <div 
                      className={`checkpoint flex flex-col items-center cursor-pointer`}
                      onClick={() => setPostLength(85)}
                    >
                      <div className={`w-3 h-3 rounded-full ${postLength >= 70 ? 'bg-[#0077B5]' : 'bg-gray-300'} mb-1`}></div>
                      <span className={`text-xs ${postLength >= 70 ? 'text-[#0077B5] font-medium' : 'text-gray-500'}`}>
                        Long
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-xs text-gray-400">
                  Scripe will learn your individual preferences over time.
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Continue button moved outside of the two-column layout for center alignment */}
        <motion.div 
          className="flex justify-center mb-8"
          variants={fadeIn}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={nextStep} 
            disabled={!postFormat}
            className="w-full sm:w-auto bg-[#0077B5] hover:bg-[#005885] text-white px-8"
          >
            <span>Continue</span>
            <ChevronRight size={16} className="ml-2" />
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="flex justify-center" 
        variants={fadeIn}
        transition={{ delay: 0.9 }}
      >
        <ProgressDots current={current} total={total} />
      </motion.div>
    </div>
  );
}
