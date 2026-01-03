'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthProvider';

interface OnboardingData {
  birthday?: string;
  gender?: string;
  heardAboutUs?: string;
  profilePictureId?: number;
}

interface OnboardingContextType {
  isOnboardingOpen: boolean;
  isOnboardingComplete: boolean;
  currentStep: number;
  totalSteps: number;
  onboardingData: OnboardingData;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  dismissForToday: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => void;
  isLoading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const DISMISS_STORAGE_KEY = 'onboarding_dismissed_date';
const TOTAL_INTRO_SLIDES = 3;
const TOTAL_FORM_STEPS = 4; // Birthday, Gender, HeardAboutUs, ProfilePicture
const TOTAL_STEPS = TOTAL_INTRO_SLIDES + TOTAL_FORM_STEPS;

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, refreshUser } = useAuth();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  // Check if user needs onboarding
  const isOnboardingComplete = user?.onboardingCompleted === true;

  // Check if dismissed today
  const isDismissedToday = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const dismissedDate = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (!dismissedDate) return false;
    
    const today = new Date().toDateString();
    return dismissedDate === today;
  }, []);

  // Auto-open onboarding for users who haven't completed it
  useEffect(() => {
    if (user && !isOnboardingComplete && !hasCheckedOnboarding) {
      setHasCheckedOnboarding(true);
      
      // Only open if not dismissed today
      if (!isDismissedToday()) {
        // Small delay to ensure UI is ready
        const timer = setTimeout(() => {
          setIsOnboardingOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
    
    // Reset check when user changes
    if (!user) {
      setHasCheckedOnboarding(false);
    }
  }, [user, isOnboardingComplete, hasCheckedOnboarding, isDismissedToday]);

  const openOnboarding = useCallback(() => {
    setCurrentStep(0);
    setIsOnboardingOpen(true);
  }, []);

  // Expose showOnboarding to browser console for dev/demo purposes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.showOnboarding = () => {
        console.log('🚀 Opening onboarding modal for dev/demo purposes...');
        setCurrentStep(0);
        setIsOnboardingOpen(true);
      };

      // Cleanup on unmount
      return () => {
        delete window.showOnboarding;
      };
    }
  }, []);

  const closeOnboarding = useCallback(() => {
    setIsOnboardingOpen(false);
    setCurrentStep(0);
    setOnboardingData({});
  }, []);

  const dismissForToday = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISMISS_STORAGE_KEY, new Date().toDateString());
    }
    closeOnboarding();
  }, [closeOnboarding]);

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_STEPS) {
      setCurrentStep(step);
    }
  }, []);

  const updateOnboardingData = useCallback((data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  }, []);

  const completeOnboarding = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updateData: Record<string, unknown> = {
        onboardingCompleted: true,
      };

      if (onboardingData.birthday) {
        updateData.birthday = onboardingData.birthday;
      }
      if (onboardingData.gender) {
        updateData.gender = onboardingData.gender;
      }
      if (onboardingData.heardAboutUs) {
        updateData.heardAboutUs = onboardingData.heardAboutUs;
      }
      if (onboardingData.profilePictureId) {
        updateData.profilePicture = onboardingData.profilePictureId;
      }

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await refreshUser();
        // Clear dismissed date on successful completion
        if (typeof window !== 'undefined') {
          localStorage.removeItem(DISMISS_STORAGE_KEY);
        }
        closeOnboarding();
      } else {
        console.error('Failed to update user profile');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, onboardingData, refreshUser, closeOnboarding]);

  const skipOnboarding = useCallback(() => {
    dismissForToday();
  }, [dismissForToday]);

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingOpen,
        isOnboardingComplete,
        currentStep,
        totalSteps: TOTAL_STEPS,
        onboardingData,
        openOnboarding,
        closeOnboarding,
        dismissForToday,
        nextStep,
        prevStep,
        goToStep,
        updateOnboardingData,
        completeOnboarding,
        skipOnboarding,
        isLoading,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

// Helper constants for components
export const INTRO_SLIDES_COUNT = TOTAL_INTRO_SLIDES;
export const FORM_STEPS_COUNT = TOTAL_FORM_STEPS;
