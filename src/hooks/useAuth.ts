// Export the useAuth hook directly from the AuthContext
export { useAuth } from '@/contexts/AuthContext';

// Custom hook to wait for authentication to be ready
export const useAuthReady = () => {
  const { isAuthReady, loading, user, token } = useAuth();
  
  return {
    isAuthReady,
    loading,
    user,
    token,
    canFetchData: isAuthReady && !loading && !!user && !!token
  };
}; 