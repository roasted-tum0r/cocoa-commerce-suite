import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthStep = 'LoginOrRegister' | 'Registration' | 'OtpVerification' | 'Success';

interface AuthModalContextType {
  isOpen: boolean;
  currentStep: AuthStep;
  openAuthModal: (initialStep?: AuthStep) => void;
  closeAuthModal: () => void;
  setStep: (step: AuthStep) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<AuthStep>('LoginOrRegister');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAuthModal = (initialStep: AuthStep = 'LoginOrRegister') => {
    setCurrentStep(initialStep);
    setIsOpen(true);
    setError(null);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    // Reset state after a short delay to avoid flickering during close animation
    setTimeout(() => {
      setCurrentStep('LoginOrRegister');
      setIsLoading(false);
      setError(null);
    }, 300);
  };

  const setStep = (step: AuthStep) => {
    setCurrentStep(step);
    setError(null);
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        currentStep,
        openAuthModal,
        closeAuthModal,
        setStep,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
