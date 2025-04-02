import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  AlignLeft, AlignCenter, ListChecks, 
  FileText, MessageSquareText, Check, 
  ArrowLeft, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";

export default function PostFormatPage() {
  const { postFormat, setPostFormat, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();
  const [postLength, setPostLength] = React.useState(50);

  const formatOptions = [
    {
      id: "standard",
      title: "Standard",
      icon: <AlignLeft size={32} className="text-purple-500" />,
      description: "Clean formatting with paragraphs and bullets for Twitter"
    },
    {
      id: "formatted",
      title: "Formatted",
      icon: <FileText size={32} className="text-blue-500" />,
      description: "Well-formatted text with visually distinct sections"
    },
    {
      id: "chunky",
      title: "Chunky",
      icon: <AlignCenter size={32} className="text-green-500" />,
      description: "Shorter paragraphs with one idea per paragraph"
    },
    {
      id: "short",
      title: "Short",
      icon: <MessageSquareText size={32} className="text-yellow-500" />,
      description: "Concise Twitter posts with minimal text"
    },
    {
      id: "emojis",
      title: "Emojis",
      icon: <span className="text-3xl">😀</span>,
      description: "Twitter posts with emojis to increase engagement"
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
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
        className="max-w-3xl w-full"
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
          Pick your preferred Twitter posting style
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-10 text-center"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Scripe is trained on millions of viral Twitter posts. When you create posts,
          the best performing posts about the same topics will be used as a reference.
        </motion.p>
        
        <motion.div 
          className="mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            {formatOptions.map((format, index) => (
              <motion.div 
                key={format.id}
                className={`
                  bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex flex-col items-center cursor-pointer 
                  transition-all hover:bg-gray-800/70 hover-lift
                  ${postFormat === format.id ? 'ring-2 ring-indigo-600 shadow-glow' : 'opacity-80'}
                `}
                onClick={() => setPostFormat(format.id as any)}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="w-full aspect-square rounded-lg bg-gray-800/80 mb-3 relative flex items-center justify-center">
                  {format.icon}
                  {postFormat === format.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">{format.title}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-6"
            variants={fadeIn}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Post length</span>
              <span className="text-sm text-gray-400">Super long</span>
            </div>
            <Slider 
              defaultValue={[postLength]} 
              max={100} 
              step={1}
              onValueChange={(values) => setPostLength(values[0])}
              className="py-5"
            />
          </motion.div>
          
          <motion.p 
            className="text-sm text-gray-400 text-center"
            variants={fadeIn}
            transition={{ delay: 0.7 }}
          >
            Scripe will learn your individual Twitter preferences over time.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeIn}
          transition={{ delay: 0.8 }}
        >
          <Button 
            onClick={nextStep}
            disabled={!postFormat}
            variant="gradient"
            animation="pulse"
            rounded="full"
            className="group px-8 py-3 flex items-center gap-2 transition-all duration-300"
          >
            <span>Continue</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.9 }}
        >
          <ProgressDots total={total} current={current} />
        </motion.div>
      </motion.div>
    </div>
  );
}
