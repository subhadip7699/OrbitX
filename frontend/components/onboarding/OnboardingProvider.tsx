"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import WelcomeModal from "@/components/onboarding/WelcomeModal";
import ProductTour from "@/components/onboarding/ProductTour";

const STORAGE_KEY = "OrbitX_onboarding_completed";

interface OnboardingContextType {
  openGuide: () => void;
  startTour: () => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourSession, setTourSession] = useState(0);

  const completeOnboarding = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
    setWelcomeOpen(false);
    setTourOpen(false);
  }, []);

  const openGuide = useCallback(() => {
    setTourOpen(false);
    setWelcomeOpen(true);
  }, []);

  const startTour = useCallback(() => {
    setWelcomeOpen(false);
    setTourSession((value) => value + 1);
    setTourOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY) !== "true") {
      const id = window.setTimeout(() => setWelcomeOpen(true), 550);
      return () => window.clearTimeout(id);
    }
  }, []);

  const value = useMemo(
    () => ({ openGuide, startTour, completeOnboarding }),
    [openGuide, startTour, completeOnboarding]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      <WelcomeModal
        open={welcomeOpen}
        onStart={startTour}
        onSkip={completeOnboarding}
        onClose={completeOnboarding}
      />
      <ProductTour
        key={tourSession}
        open={tourOpen}
        onFinish={completeOnboarding}
        onClose={completeOnboarding}
      />
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
