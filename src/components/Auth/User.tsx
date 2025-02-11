"use client"
import { useEffect, useState } from "react";
import { useUser as useAuth0User } from "@auth0/nextjs-auth0/client";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  [key: string]: any; // Allow additional properties
}

const userCache = new Map<string, User>();

const useUser = () => {
  const { user: auth0User, isLoading, error: authError } = useAuth0User();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        if (!auth0User || isLoading) return;
        
        if (auth0User.email && userCache.has(auth0User.email)) {
          setUser(userCache.get(auth0User.email) || null);
          setLoading(false);
          return;
        }
        
        const response = await fetch(`/api/user/${auth0User.email}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        
        const userData: User = await response.json();
        const extendedUser = { ...auth0User, ...userData };
        if (auth0User.email) {
          userCache.set(auth0User.email, extendedUser);
        }
        setUser(extendedUser);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (auth0User) {
      fetchUser();
    }
  }, [auth0User, isLoading]);

  return { user, isLoading: isLoading || loading, error: authError || error };
};

export default useUser;
