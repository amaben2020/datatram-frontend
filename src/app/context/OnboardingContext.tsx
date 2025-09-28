'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS, Step } from 'react-joyride';

interface OnboardingContextType {
  isOnboardingActive: boolean;
  startOnboarding: () => void;
  stopOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STORAGE_KEY = 'datatram-onboarding-completed';

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (completed === 'true') {
      setHasCompletedOnboarding(true);
    }
  }, []);

  // Debug logging for tour state
  useEffect(() => {
    console.log('Tour state changed:', { runTour, isOnboardingActive, hasCompletedOnboarding });
  }, [runTour, isOnboardingActive, hasCompletedOnboarding]);

  // Auto-start onboarding for new users
  useEffect(() => {
    if (!hasCompletedOnboarding && !isOnboardingActive && !runTour) {
      // Small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        console.log('Auto-starting onboarding for new user');
        startOnboarding();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding, isOnboardingActive, runTour]);

  const startOnboarding = () => {
    console.log('Starting onboarding tour...');
    setIsOnboardingActive(true);
    setRunTour(true);
  };

  const stopOnboarding = () => {
    setIsOnboardingActive(false);
    setRunTour(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setHasCompletedOnboarding(false);
    startOnboarding();
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, action, index } = data;
    
    console.log('Joyride callback:', { status, type, action, index });

    if (type === EVENTS.TARGET_NOT_FOUND) {
      // If target is not found, try to continue to next step
      console.log('Target not found, attempting to continue');
      // Don't stop the tour, let it try to find the next target
    } else if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      // Only stop the tour when it's finished or skipped
      console.log('Tour finished or skipped, marking as completed');
      setIsOnboardingActive(false);
      setRunTour(false);
      
      // Mark onboarding as completed
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      setHasCompletedOnboarding(true);
    }
  };

  const steps: Step[] = [
    {
      target: '.onboarding-welcome',
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Welcome to Datatram! 🚀</h2>
          <p className="text-gray-600 mb-4">
            Let's take a quick tour to get you familiar with the platform and help you get started with your data connections.
          </p>
          <p className="text-sm text-gray-500">
            This tour will show you the key features and how to create your first data pipeline.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      disableOverlay: false,
    },
    {
      target: '.onboarding-sources',
      content: (
        <div>
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
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.onboarding-destinations',
      content: (
        <div>
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
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.onboarding-connections',
      content: (
        <div>
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
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.onboarding-new-connection',
      content: (
        <div>
          <h3 className="text-xl font-bold text-purple-700 mb-3">✨ Create Your First Connection</h3>
          <p className="text-gray-600 mb-3">
            Ready to get started? Click this button to create your first data connection!
          </p>
          <p className="text-sm text-gray-500">
            You'll be guided through selecting a source and destination, then we'll help you set up the connection.
          </p>
        </div>
      ),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '.onboarding-complete',
      content: (
        <div className="text-center">
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
      placement: 'center',
      disableBeacon: true,
    },
  ];

  const joyrideProps = {
    steps,
    run: runTour,
    continuous: true,
    showProgress: true,
    showSkipButton: true,
    callback: handleJoyrideCallback,
    disableOverlayClose: true,
    disableCloseOnEsc: false,
    hideBackButton: false,
    debug: true,
    styles: {
      options: {
        primaryColor: '#7c3aed', // Purple color matching your theme
        textColor: '#374151',
        backgroundColor: '#ffffff',
        overlayColor: 'rgba(0, 0, 0, 0.4)',
        spotlightShadow: '0 0 15px rgba(124, 58, 237, 0.5)',
        width: 400,
        zIndex: 1000,
      },
      tooltip: {
        borderRadius: 8,
        fontSize: 14,
        padding: 20,
      },
      tooltipContainer: {
        textAlign: 'left' as const,
      },
      tooltipTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7c3aed',
      },
      buttonNext: {
        backgroundColor: '#7c3aed',
        borderRadius: 6,
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        padding: '8px 16px',
      },
      buttonBack: {
        color: '#7c3aed',
        fontSize: 14,
        marginRight: 10,
      },
      buttonSkip: {
        color: '#6b7280',
        fontSize: 14,
      },
      buttonClose: {
        color: '#6b7280',
        fontSize: 16,
      },
      beacon: {
        inner: '#7c3aed',
        outer: '#7c3aed',
      },
    },
    locale: {
      back: 'Back',
      close: 'Close',
      last: 'Finish',
      next: 'Next',
      skip: 'Skip Tour',
    },
  };

  const contextValue: OnboardingContextType = {
    isOnboardingActive,
    startOnboarding,
    stopOnboarding,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
      <Joyride {...joyrideProps} />
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
