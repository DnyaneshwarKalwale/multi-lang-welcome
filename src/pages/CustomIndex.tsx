
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import CustomWelcomePage from './CustomWelcomePage';
import LoginSheet from '@/components/LoginSheet';
import { useLocation, Navigate } from 'react-router-dom';

export default function CustomIndex() {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (isAuthenticated && location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <CustomWelcomePage />
      <LoginSheet />
    </>
  );
}
