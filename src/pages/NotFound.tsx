
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function NotFound() {
  const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-brand-light/50 dark:from-gray-900 dark:to-brand-dark/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 flex items-center justify-center">
            <FileQuestion className="h-12 w-12 text-brand-purple" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-gradient">404</h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            className="primary-button"
          >
            <Link to={isAuthenticated ? "/dashboard" : "/"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isAuthenticated ? "Back to Dashboard" : "Back to Home"}
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
