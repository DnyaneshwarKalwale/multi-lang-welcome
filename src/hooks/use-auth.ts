import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// This hook is a simple forwarder for the AuthContext
// It allows component code to import from hooks/use-auth instead of directly from the context
export const useAuth = useAuthContext; 