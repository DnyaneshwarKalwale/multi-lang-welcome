import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-teal-200 dark:bg-teal-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-cyan-200 dark:bg-cyan-900 blur-[120px]"></div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5 -z-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto text-center z-10"
      >
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-teal-400/20 to-cyan-500/20 flex items-center justify-center border border-teal-400/30 shadow-lg">
            <FileQuestion className="h-14 w-14 text-gradient" strokeWidth={1.5} />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-6xl font-bold mb-4 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          404
        </motion.h1>
        
        <motion.h2 
          className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 dark:text-gray-300 mb-10 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            asChild
            variant="novus"
            animation="lift"
            rounded="full"
            className="py-6 px-8 gap-2"
          >
            <Link to={isAuthenticated ? "/dashboard" : "/"}>
              {isAuthenticated ? (
                <>
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Dashboard</span>
                </>
              ) : (
                <>
                  <Home className="w-5 h-5" />
                  <span>Back to Home</span>
                </>
              )}
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
