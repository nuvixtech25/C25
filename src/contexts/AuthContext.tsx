import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthProvider } from "./auth/useAuthProvider";
import { AuthContextType } from "./auth/authTypes";

// Create the context with default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuthProvider();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!auth.isLoading) {
      setIsInitialized(true);
    }

    console.log("AuthProvider state updated:", {
      isLoggedIn: !!auth.user,
      isAdmin: auth.isAdmin,
      isLoading: auth.isLoading,
      userId: auth.user?.id || "none",
    });
  }, [auth.user, auth.isAdmin, auth.isLoading]);

  // Only render children when auth is initialized or after a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isInitialized) {
        console.log("Auth initialization timeout reached, continuing anyway");
        setIsInitialized(true);
      }
    }, 3000); // 3 second timeout as fallback

    return () => clearTimeout(timer);
  }, [isInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Inicializando autenticação...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
