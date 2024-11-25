import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react';


export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  jobTitle: string;
  createdAt: Date;
  token: string;
};

type AppContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const contextValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('AppContextProvider not found!');
  }
  return context;
};
