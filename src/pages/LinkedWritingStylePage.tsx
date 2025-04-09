
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type WritingStyle = {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  examples: string[];
};

const writingStyles: WritingStyle[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Formal, business-oriented content that establishes authority",
    icon: <span className="text-2xl">👔</span>,
    examples: [
      "Excited to announce our Q3 results showing 28% growth in user engagement across all platforms.",
      "Just published my latest industry analysis on emerging technologies in fintech. Key takeaway: AI integration is no longer optional."
    ]
  },
  {
    id: "conversational",
    name: "Conversational",
    description: "Friendly, approachable content that connects with readers",
    icon: <span className="text-2xl">💬</span>,
    examples: [
      "Hey everyone! Just got back from an amazing conference in Boston. Anyone else attend? Would love to hear your takeaways!",
      "I've been thinking a lot about work-life balance lately. What's one small change that's made a big difference for you?"
    ]
  },
  {
    id: "thoughtLeader",
    name: "Thought Leader",
    description: "Insightful, forward-thinking content that inspires and challenges",
    icon: <span className="text-2xl">💡</span>,
    examples: [
      "The most successful companies in 2025 won't be those with the best products, but those with the most adaptable cultures.",
      "Three questions every leader should ask before making strategic decisions: (1) Does this align with our values? (2) Are we solving the right problem? (3) What voices aren't we hearing?"
    ]
  },
  {
    id: "storytelling",
    name: "Storytelling",
    description: "Narrative-driven content that engages through personal experiences",
    icon: <span className="text-2xl">📚</span>,
    examples: [
      "When I started my career 15 years ago, my mentor told me something I'll never forget: "Success isn't about climbing the ladder; it's about building bridges."",
      "Yesterday I met a 19-year-old entrepreneur who built a $2M business from her dorm room. Her secret? Solving a problem no one else recognized."
    ]
  },
  {
    id: "educational",
    name: "Educational",
    description: "Informative content that teaches and provides value",
    icon: <span className="text-2xl">🎓</span>,
    examples: [
      "5 Excel formulas every data analyst should know:\n1. XLOOKUP\n2. SUMIFS\n3. INDEX/MATCH\n4. FILTER\n5. LAMBDA",
      "A quick guide to giving feedback: Be specific, focus on behavior not personality, offer solutions, and always follow up."
    ]
  },
  {
    id: "motivational",
    name: "Motivational",
    description: "Inspiring content that energizes and encourages action",
    icon: <span className="text-2xl">🔥</span>,
    examples: [
      "Don't wait for the perfect opportunity. Take the opportunity and make it perfect.",
      "Rejection is just redirection. Every 'no' I received last year led me to the biggest 'yes' of my career."
    ]
  }
];

export default function LinkedWritingStylePage() {
  const { nextStep, prevStep } = useOnboarding();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [viewingExample, setViewingExample] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedStyle) {
      // Here you would save the selected style to your context
      nextStep();
    }
  };

  const handleStyleSelect = (id: string) => {
    setSelectedStyle(id);
    setViewingExample(null);
  };

  const selectedStyleData = writingStyles.find(style => style.id === selectedStyle);

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <div className="container mx-auto max-w-4xl flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
          >
            Select Your Writing Style
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Choose how you'd like your LinkedIn content to sound. This helps us generate posts that match your personal brand.
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {writingStyles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card 
                className={`h-full cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedStyle === style.id 
                    ? 'border-linkedin-blue dark:border-linkedin-blue ring-2 ring-linkedin-blue/20' 
                    : 'border-gray-200 dark:border-gray-800'
                }`}
                onClick={() => handleStyleSelect(style.id)}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="mr-3">{style.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{style.name}</h3>
                    </div>
                    {selectedStyle === style.id && (
                      <CheckCircle className="h-5 w-5 text-linkedin-blue" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{style.description}</p>
                  
                  <div className="mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-linkedin-blue border-linkedin-blue/30 hover:bg-linkedin-blue/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingExample(viewingExample === style.id ? null : style.id);
                      }}
                    >
                      {viewingExample === style.id ? "Hide Examples" : "View Examples"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {viewingExample === style.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                  <div className="p-4">
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Example Posts:</h4>
                    <ul className="space-y-3">
                      {style.examples.map((example, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {selectedStyleData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-white dark:bg-gray-900 p-4 rounded-lg border border-linkedin-blue/30"
          >
            <div className="flex items-center">
              <div className="mr-3">{selectedStyleData.icon}</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  You've selected: <span className="text-linkedin-blue">{selectedStyleData.name}</span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStyleData.description}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-between mt-8"
        >
          <Button 
            variant="outline" 
            onClick={prevStep}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          
          <Button 
            onClick={handleNext} 
            disabled={!selectedStyle}
            className={`text-white flex items-center gap-2 ${
              selectedStyle 
                ? 'bg-linkedin-blue hover:bg-linkedin-darkBlue' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
