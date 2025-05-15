import React, { createContext, useContext, useState } from 'react';

// Types flexibles
type User = Record<string, any>;
type Prestation = Record<string, any>;
type PlannedPrestation = Record<string, any>;
type Conversation = Record<string, any>; // Tu peux remplacer par un vrai type plus tard si tu veux


// Interfaces de contextes
interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

interface CurrentWorkerPrestationContextType {
  currentWorkerPrestation: Prestation | null;
  setCurrentWorkerPrestation: (prestation: Prestation) => void;
}

interface AllWorkerPrestationContextType {
  allWorkerPrestation: Prestation | null;
  setAllWorkerPrestation: (prestation: Prestation) => void;
}

interface PlannedPrestationContextType {
  newPlannedPrestation: PlannedPrestation | null;
  setNewPlannedPrestation: (prestation: PlannedPrestation) => void;
}

interface UserConversationContextType {
  userConversations: Conversation[] | null;
  setUserConversations: (conversations: Conversation[]) => void;
}

interface WorkerConversationsContextType {
  workerConversations: Conversation[] | null;
  setWorkerConversations: (conversations: Conversation[]) => void;
}

// Contexts
const UserContext = createContext<UserContextType | undefined>(undefined);
const CurrentWorkerPrestationContext = createContext<CurrentWorkerPrestationContextType | undefined>(undefined);
const AllWorkerPrestationContext = createContext<AllWorkerPrestationContextType | undefined>(undefined);
const PlannedPrestationContext = createContext<PlannedPrestationContextType | undefined>(undefined);
const UserConversationContext = createContext<UserConversationContextType | undefined>(undefined);
const WorkerConversationsContext = createContext<WorkerConversationsContextType | undefined>(undefined);


// Providers
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const CurrentWorkerPrestationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWorkerPrestation, setCurrentWorkerPrestation] = useState<Prestation | null>(null);
  return (
    <CurrentWorkerPrestationContext.Provider value={{ currentWorkerPrestation, setCurrentWorkerPrestation }}>
      {children}
    </CurrentWorkerPrestationContext.Provider>
  );
};

export const AllWorkerPrestationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allWorkerPrestation, setAllWorkerPrestation] = useState<Prestation | null>(null);
  return (
    <AllWorkerPrestationContext.Provider value={{ allWorkerPrestation, setAllWorkerPrestation }}>
      {children}
    </AllWorkerPrestationContext.Provider>
  );
};

export const PlannedPrestationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [newPlannedPrestation, setNewPlannedPrestation] = useState<PlannedPrestation | null>(null);
  return (
    <PlannedPrestationContext.Provider value={{ newPlannedPrestation, setNewPlannedPrestation }}>
      {children}
    </PlannedPrestationContext.Provider>
  );
};

export const UserConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userConversations, setUserConversations] = useState<Conversation[] | null>(null);
  return (
    <UserConversationContext.Provider value={{ userConversations, setUserConversations }}>
      {children}
    </UserConversationContext.Provider>
  );
};

export const WorkerConversationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workerConversations, setWorkerConversations] = useState<Conversation[] | null>(null);
  return (
    <WorkerConversationsContext.Provider value={{ workerConversations, setWorkerConversations }}>
      {children}
    </WorkerConversationsContext.Provider>
  );
};

// Hooks pour utiliser les contextes
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé à l’intérieur de UserProvider');
  }
  return context;
};

export const useCurrentWorkerPrestation = () => {
  const context = useContext(CurrentWorkerPrestationContext);
  if (!context) {
    throw new Error('useWorkerPrestation doit être utilisé à l’intérieur de WorkerPrestationProvider');
  }
  return context;
};

export const useAllWorkerPrestation = () => {
  const context = useContext(AllWorkerPrestationContext);
  if (!context) {
    throw new Error('useAllWorkerPrestation doit être utilisé à l’intérieur de AllWorkerPrestationProvider');
  }
  return context;
};

export const usePlannedPrestation = () => {
  const context = useContext(PlannedPrestationContext);
  if (!context) {
    throw new Error('usePlannedPrestation doit être utilisé à l’intérieur de PlannedPrestationProvider');
  }
  return context;
};

export const useUserConversations = () => {
  const context = useContext(UserConversationContext);
  if (!context) {
    throw new Error('useUserConversations doit être utilisé à l’intérieur de UserConversationProvider');
  }
  return context;
};

export const useWorkerConversations = () => {
  const context = useContext(WorkerConversationsContext);
  if (!context) {
    throw new Error('useWorkerConversations doit être utilisé à l’intérieur de WorkerConversationsProvider');
  }
  return context;
};
