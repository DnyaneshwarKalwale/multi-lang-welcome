
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CustomWelcomePage from './CustomWelcomePage';
import { LoginSheet } from '@/components/LoginSheet';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CustomIndex() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loginSheetOpen, setLoginSheetOpen] = useState(false);

  if (isAuthenticated && location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGetStarted = () => {
    setLoginSheetOpen(true);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-brand-purple/5 to-brand-pink/5 dark:from-brand-purple/20 dark:to-brand-pink/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CustomWelcomePage onLogin={handleGetStarted} />
      <LoginSheet 
        open={loginSheetOpen} 
        onOpenChange={setLoginSheetOpen} 
      />
    </motion.div>
  );
}
