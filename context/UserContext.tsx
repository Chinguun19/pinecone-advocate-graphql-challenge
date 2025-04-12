import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userId: string | null;
  userName: string | null;
  setUser: (userId: string, userName: string) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const setUser = (id: string, name: string) => {
    setUserId(id);
    setUserName(name);
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinecone-user-id', id);
      localStorage.setItem('pinecone-user-name', name);
    }
  };

  const clearUser = () => {
    setUserId(null);
    setUserName(null);
    
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pinecone-user-id');
      localStorage.removeItem('pinecone-user-name');
    }
  };

  // Initialize from localStorage if available
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('pinecone-user-id');
      const storedName = localStorage.getItem('pinecone-user-name');
      
      if (storedId && storedName) {
        setUserId(storedId);
        setUserName(storedName);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, userName, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 