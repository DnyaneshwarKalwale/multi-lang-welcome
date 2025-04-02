import { useContext, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CustomWelcomePage from './CustomWelcomePage';
import { LoginSheet } from '@/components/LoginSheet';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';

interface CustomWelcomePageProps {
  onLogin: () => void;
}

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
    <>
      <CustomWelcomePage onLogin={handleGetStarted} />
      <LoginSheet 
        open={loginSheetOpen} 
        onOpenChange={setLoginSheetOpen} 
      />
    </>
  );
}
