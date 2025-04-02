
import { useContext } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowRight, Twitter, Check } from "lucide-react";

interface CustomWelcomePageProps {
  onLogin: () => void;
}

const CustomWelcomePage = ({ onLogin }: CustomWelcomePageProps) => {
  const { isAuthenticated } = useAuth();

  const features = [
    "Algorithm-optimized content generation",
    "Personalized Twitter posts in minutes",
    "Increased engagement and reach",
    "AI-powered content that drives results",
    "Simple workflow for fast content creation"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white to-brand-light dark:from-gray-900 dark:to-brand-dark">
      <div className="absolute inset-0 bg-hero-pattern bg-no-repeat bg-center opacity-30 dark:opacity-10" />
      
      <div className="container px-4 py-12 lg:py-24 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Twitter className="h-16 w-16 text-brand-purple mb-4" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Create <span className="text-gradient">Twitter</span> content<br />with high reach
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Receive tailored, algorithm-optimized Twitter posts in less than 5 minutes with our AI-powered platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto"
          >
            {isAuthenticated ? (
              <Link to="/dashboard" className="w-full">
                <Button size="lg" className="w-full primary-button">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/registration" className="w-full">
                  <Button size="lg" className="w-full primary-button">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full" onClick={onLogin}>
                  Sign In
                </Button>
              </>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20"
        >
          <Card className="glass-card overflow-hidden max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gradient-blue">Why choose Scripe?</h2>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 bg-brand-teal/10 dark:bg-brand-teal/20 rounded-full p-0.5">
                        <Check className="h-4 w-4 text-brand-teal" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-brand-purple/10 to-brand-pink/10 dark:from-brand-purple/20 dark:to-brand-pink/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Ready to grow your Twitter presence?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Join thousands of content creators who are leveraging AI to create engaging Twitter content that gets noticed.
                </p>
                <Link to={isAuthenticated ? "/dashboard" : "/registration"}>
                  <Button className="w-full primary-button">
                    {isAuthenticated ? "Go to Dashboard" : "Start Creating Content"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomWelcomePage;
