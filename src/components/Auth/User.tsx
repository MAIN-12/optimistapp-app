"use client"
import { useAuth } from "@/providers/AuthProvider";

// Re-export useAuth as useUser for backward compatibility
const useUser = () => {
  const { user, isLoading, error } = useAuth();
  
  return { 
    user, 
    isLoading, 
    error: error ? new Error(error) : null 
  };
};

export default useUser;
