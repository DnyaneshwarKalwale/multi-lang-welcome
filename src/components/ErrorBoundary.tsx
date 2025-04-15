import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ 
      error, 
      errorInfo 
    });
    
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI with Twitter-inspired design
      return this.props.fallback || (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative overflow-hidden">
          {/* Animated gradient background with Twitter blue */}
          <div className="absolute inset-0 opacity-10 dark:opacity-20 -z-10">
            <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-900 blur-[120px]"></div>
            <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-900 blur-[120px]"></div>
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
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-500/20 flex items-center justify-center border border-blue-400/30 shadow-lg">
                <AlertCircle className="h-10 w-10 text-blue-500" strokeWidth={1.5} />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Something went wrong
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  {this.state.error?.message || "An unexpected error occurred"}
                </AlertDescription>
              </Alert>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                onClick={this.handleReload}
                variant="default"
                rounded="full"
                className="py-6 px-8 gap-2 w-full sm:w-auto"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Reload Page</span>
              </Button>
              
              <Button
                asChild
                variant="outline"
                rounded="full"
                className="py-6 px-8 gap-2 w-full sm:w-auto border-gray-200 dark:border-gray-800"
              >
                <Link to="/">
                  <Home className="w-5 h-5" />
                  <span>Back to Home</span>
                </Link>
              </Button>
            </motion.div>
            
            {this.state.errorInfo && (
              <motion.div 
                className="mt-8 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <details className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                  <summary className="font-medium cursor-pointer mb-2">Technical Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto max-h-64">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </motion.div>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 