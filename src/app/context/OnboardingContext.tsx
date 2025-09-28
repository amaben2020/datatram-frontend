'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TourProvider, useTour } from '@reactour/tour';

interface OnboardingContextType {
  isOnboardingActive: boolean;
  startOnboarding: () => void;
  stopOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STORAGE_KEY = 'datatram-onboarding-completed';

const steps = [
  {
    selector: '.onboarding-welcome',
    content: (
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Welcome to Datatram! 🚀</h2>
        <p className="text-gray-600 mb-4">
          Let's take a quick tour to get you familiar with the platform and help you get started with your data connections.
        </p>
        <p className="text-sm text-gray-500">
          This tour will show you the key features and how to create your first data pipeline.
        </p>
      </div>
    ),
    position: 'center' as const,
  },
  {
    selector: '.onboarding-sources',
    content: (
      <div className="p-4">
        <h3 className="text-xl font-bold text-purple-700 mb-3">📊 Data Sources</h3>
        <p className="text-gray-600 mb-3">
          This is where you manage your data sources. You can upload files (CSV, Excel, JSON) or connect to databases.
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Upload CSV, Excel, PDF, or JSON files</li>
          <li>• Connect to databases and APIs</li>
          <li>• Organize and categorize your data</li>
        </ul>
      </div>
    ),
    position: 'bottom' as const,
  },
  {
    selector: '.onboarding-destinations',
    content: (
      <div className="p-4">
        <h3 className="text-xl font-bold text-purple-700 mb-3">🎯 Destinations</h3>
        <p className="text-gray-600 mb-3">
          Configure where you want to send your data. Datatram supports BigQuery, Snowflake, and Amazon S3.
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• BigQuery for analytics and ML</li>
          <li>• Snowflake for data warehousing</li>
          <li>• Amazon S3 for data lakes</li>
        </ul>
      </div>
    ),
    position: 'bottom' as const,
  },
  {
    selector: '.onboarding-connections',
    content: (
      <div className="p-4">
        <h3 className="text-xl font-bold text-purple-700 mb-3">🔗 Connections</h3>
        <p className="text-gray-600 mb-3">
          Create connections between your sources and destinations to build data pipelines.
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Link sources to destinations</li>
          <li>• Monitor connection status</li>
          <li>• View connection history</li>
        </ul>
      </div>
    ),
    position: 'bottom' as const,
  },
  {
    selector: '.onboarding-new-connection',
    content: (
      <div className="p-4">
        <h3 className="text-xl font-bold text-purple-700 mb-3">✨ Create Your First Connection</h3>
        <p className="text-gray-600 mb-3">
          Ready to get started? Click this button to create your first data connection!
        </p>
        <p className="text-sm text-gray-500">
          You'll be guided through selecting a source and destination, then we'll help you set up the connection.
        </p>
      </div>
    ),
    position: 'left' as const,
  },
  {
    selector: '.onboarding-complete',
    content: (
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 You're All Set!</h2>
        <p className="text-gray-600 mb-4">
          You now know the basics of Datatram. Start by creating your first connection to begin building data pipelines.
        </p>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-700 mb-2">Next Steps:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>1. Upload a data source or connect to a database</li>
            <li>2. Configure a destination (BigQuery, Snowflake, or S3)</li>
            <li>3. Create a connection between them</li>
            <li>4. Monitor your data pipeline!</li>
          </ul>
        </div>
      </div>
    ),
    position: 'center' as const,
  },
];

function OnboardingProviderInner({ children }: { children: ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { isOpen, setIsOpen, setCurrentStep } = useTour();

  // Check localStorage on mount
  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (completed === 'true') {
      setHasCompletedOnboarding(true);
    }
  }, []);

  // Auto-start onboarding for new users
  useEffect(() => {
    if (!hasCompletedOnboarding && !isOpen) {
      // Small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        console.log('Auto-starting onboarding for new user');
        setCurrentStep(0);
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding, isOpen, setCurrentStep, setIsOpen]);

  const startOnboarding = () => {
    console.log('Starting onboarding tour...');
    setCurrentStep(0);
    setIsOpen(true);
  };

  const stopOnboarding = () => {
    setIsOpen(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setHasCompletedOnboarding(false);
    startOnboarding();
  };

  // Handle tour completion
  useEffect(() => {
    if (!isOpen && hasCompletedOnboarding === false) {
      // Mark onboarding as completed when tour is closed
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      setHasCompletedOnboarding(true);
    }
  }, [isOpen, hasCompletedOnboarding]);

  const contextValue: OnboardingContextType = {
    isOnboardingActive: isOpen,
    startOnboarding,
    stopOnboarding,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '400px',
        }),
        maskArea: (base) => ({
          ...base,
          fill: 'rgba(0, 0, 0, 0.4)',
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: '#7c3aed',
          color: '#ffffff',
        }),
        controls: (base) => ({
          ...base,
          marginTop: '16px',
        }),
        close: (base) => ({
          ...base,
          color: '#6b7280',
        }),
      }}
      padding={10}
      showBadge={true}
      showCloseButton={true}
      showNavigation={true}
      showPrevNextButtons={true}
    >
      <OnboardingProviderInner>{children}</OnboardingProviderInner>
    </TourProvider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
