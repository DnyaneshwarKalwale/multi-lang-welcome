import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Define the global state structure
interface GlobalState {
  [key: string]: any;
}

// Define the context type
interface StateContextType {
  // Get state with automatic type conversion
  getState: <T>(key: string, defaultValue?: T) => T | undefined;
  
  // Set state with automatic persistence
  setState: <T>(key: string, value: T, options?: { 
    persist?: boolean;    // Whether to persist to localStorage (default: true)
    toast?: boolean;      // Whether to show a toast (default: false)
    expiry?: number;      // Expiry time in minutes (optional)
  }) => void;
  
  // Clear specific state or all state
  clearState: (key?: string) => void;
  
  // Get all state (for debugging)
  getAllState: () => GlobalState;
}

// Create context
const StateContext = createContext<StateContextType | undefined>(undefined);

// Provider component
export function StateProvider({ children }: { children: ReactNode }) {
  // In-memory state
  const [state, setState] = useState<GlobalState>({});
  
  // Load persisted state on component mount
  useEffect(() => {
    try {
      // Get all state from localStorage
      const keys = Object.keys(localStorage);
      const persistedState: GlobalState = {};
      
      // Process each key that starts with 'state:'
      keys.forEach(key => {
        if (key.startsWith('state:')) {
          try {
            const rawValue = localStorage.getItem(key);
            if (rawValue) {
              const { value, expiry } = JSON.parse(rawValue);
              
              // Check if the state has expired
              if (expiry && new Date().getTime() > expiry) {
                localStorage.removeItem(key);
              } else {
                const stateKey = key.substring(6); // Remove 'state:' prefix
                persistedState[stateKey] = value;
              }
            }
          } catch (e) {
            console.error(`Error parsing stored state for ${key}:`, e);
            // Remove corrupted state
            localStorage.removeItem(key);
          }
        }
      });
      
      // Update state with persisted values
      setState(prev => ({ ...prev, ...persistedState }));
      console.log("State loaded from localStorage:", persistedState);
    } catch (error) {
      console.error("Failed to load persisted state:", error);
    }
  }, []);
  
  // Get state with type conversion
  const getState = <T,>(key: string, defaultValue?: T): T | undefined => {
    // First check in-memory state
    if (state[key] !== undefined) {
      return state[key] as T;
    }
    
    // If not in memory, try localStorage
    try {
      const rawValue = localStorage.getItem(`state:${key}`);
      if (rawValue) {
        const parsed = JSON.parse(rawValue);
        
        // Check if parsed value is null or doesn't have the expected structure
        if (!parsed || typeof parsed !== 'object') {
          console.warn(`Invalid state format for ${key}, removing item`);
          localStorage.removeItem(`state:${key}`);
          return defaultValue;
        }
        
        const { value, expiry } = parsed;
        
        // Check if expired
        if (expiry && new Date().getTime() > expiry) {
          localStorage.removeItem(`state:${key}`);
          return defaultValue;
        }
        
        // Update in-memory state for faster access next time
        setState(prev => ({ ...prev, [key]: value }));
        return value as T;
      }
    } catch (e) {
      console.error(`Error reading state for ${key}:`, e);
      // If there was an error, clean up the problematic value
      localStorage.removeItem(`state:${key}`);
    }
    
    return defaultValue;
  };
  
  // Set state with persistence
  const setStateValue = <T,>(
    key: string, 
    value: T, 
    options: { persist?: boolean; toast?: boolean; expiry?: number } = {}
  ) => {
    const { persist = true, toast: showToast = false, expiry } = options;
    
    // Update in-memory state
    setState(prev => ({ ...prev, [key]: value }));
    
    // Persist to localStorage if requested
    if (persist) {
      try {
        const storageValue = {
          value,
          expiry: expiry ? new Date().getTime() + (expiry * 60 * 1000) : null
        };
        
        localStorage.setItem(`state:${key}`, JSON.stringify(storageValue));
      } catch (e) {
        console.error(`Error persisting state for ${key}:`, e);
      }
    }
    
    // Show toast if requested
    if (showToast) {
      toast.success("Progress saved");
    }
  };
  
  // Clear state
  const clearState = (key?: string) => {
    if (key) {
      // Clear specific key
      setState(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
      
      // Remove from localStorage
      localStorage.removeItem(`state:${key}`);
    } else {
      // Clear all state
      setState({});
      
      // Clear all keys starting with 'state:' from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('state:')) {
          localStorage.removeItem(key);
        }
      });
    }
  };
  
  // Get all state (for debugging)
  const getAllState = () => {
    return { ...state };
  };
  
  return (
    <StateContext.Provider
      value={{
        getState,
        setState: setStateValue,
        clearState,
        getAllState
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

// Custom hook to use the state context
export function useAppState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
}

// Utility hook for component state persistence
export function usePersistentState<T>(
  key: string, 
  initialValue: T,
  options: { 
    persist?: boolean; 
    toast?: boolean;
    expiry?: number;
  } = {}
): [T, (value: T | ((prev: T) => T)) => void] {
  const { getState, setState } = useAppState();
  
  // Get initial state, preferring persisted value
  const [value, setValue] = useState<T>(() => {
    const persistedValue = getState<T>(key);
    return persistedValue !== undefined ? persistedValue : initialValue;
  });
  
  // Update state and persist changes
  const setPersistedValue = (newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const nextValue = typeof newValue === 'function' 
        ? (newValue as ((prev: T) => T))(prev) 
        : newValue;
      
      setState(key, nextValue, options);
      return nextValue;
    });
  };
  
  return [value, setPersistedValue];
} 