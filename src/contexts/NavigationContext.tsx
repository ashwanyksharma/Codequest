import { createContext, useContext, useState, ReactNode } from 'react';
import { NavigationState, Page } from '../types';

interface NavigationContextType {
  nav: NavigationState;
  navigate: (page: Page, params?: Partial<Omit<NavigationState, 'page'>>) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [nav, setNav] = useState<NavigationState>({ page: 'landing' });

  const navigate = (page: Page, params?: Partial<Omit<NavigationState, 'page'>>) => {
    setNav({ page, ...params });
    window.scrollTo(0, 0);
  };

  return (
    <NavigationContext.Provider value={{ nav, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}
