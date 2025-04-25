
import React, { createContext, useContext, useEffect } from 'react';
import { useAuthProvider } from './auth/useAuthProvider';
import { AuthContextType } from './auth/authTypes';

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component as explicit React function
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const auth = useAuthProvider();
  
  useEffect(() => {
    console.log('AuthProvider rendered with auth state:', { 
      isLoggedIn: !!auth.user, 
      isAdmin: auth.isAdmin,
      isLoading: auth.isLoading
    });
  }, [auth.user, auth.isAdmin, auth.isLoading]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
