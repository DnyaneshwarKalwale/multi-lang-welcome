
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TwitterIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CustomWelcomePageProps {
  onLogin: () => void;
}

export default function CustomWelcomePage({ onLogin }: CustomWelcomePageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-hero-pattern bg-no-repeat bg-center opacity-20 dark:opacity-10" />
      
      <motion.div
        className="max-w-md w-full z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <TwitterIcon className="h-14 w-14 mx-auto text-brand-purple mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">Scripe</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Create algorithm-optimized Twitter content that grows your audience.
          </p>
        </div>
        
        <Card className="glass-card border border-gray-100 dark:border-gray-800 shadow-xl">
          <div className="p-8">
            <div className="space-y-4 mb-8">
              <Feature 
                title="AI-Driven Content" 
                description="Analyze viral tweets to create engaging posts" 
                icon="✨" 
              />
              <Feature 
                title="Personalized Voice" 
                description="Content that sounds authentically like you" 
                icon="🎯" 
              />
              <Feature 
                title="Performance Analytics" 
                description="Track engagement and optimize your strategy" 
                icon="📊" 
              />
            </div>
            
            <Button 
              onClick={onLogin}
              className="w-full py-6 bg-gradient-to-r from-brand-purple to-brand-pink hover:from-brand-purple/90 hover:to-brand-pink/90 text-white font-medium text-lg rounded-xl group transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Join thousands of creators and businesses growing their Twitter presence
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
}

function Feature({ title, description, icon }: FeatureProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-lg text-gray-800 dark:text-gray-100">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}
