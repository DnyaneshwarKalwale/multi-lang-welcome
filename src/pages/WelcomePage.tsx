
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { WelcomeCard } from "@/components/WelcomeCard";
import { ArrowRight, TwitterIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-light/50 dark:from-gray-900 dark:to-brand-dark/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern bg-no-repeat bg-center opacity-30 dark:opacity-10" />
      
      <div className="container px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto text-center mb-12"
        >
          <TwitterIcon className="h-12 w-12 mx-auto text-brand-purple mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to <span className="text-gradient">Scripe</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let's create algorithm-optimized Twitter content that helps you grow your audience.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <Card className="glass-card border border-gray-100 dark:border-gray-800">
            <div className="p-6">
              <WelcomeCard 
                title="Grow Your Twitter Audience"
                description="Our AI-powered tools help you create engaging content that resonates with your audience."
                icon={<TwitterIcon className="h-5 w-5 text-indigo-400" />}
              />
              
              <div className="mt-8">
                <Link to="/language-selection">
                  <Button className="w-full primary-button group">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
