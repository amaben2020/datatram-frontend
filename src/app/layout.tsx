'use client';

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { shadesOfPurple } from '@clerk/themes';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TokenProvider } from './context/TokenContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { usePathname } from 'next/navigation';
import { ReactQueryClientProvider } from '@/components/providers/react-query';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import { Home, Moon, Sun } from 'lucide-react';

// Auto-redirect component
function AutoRedirect() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isSignedIn && pathname === '/') {
      router.push('/dashboard');
    }
  }, [isSignedIn, pathname, router]);

  return null;
}

// Header component with theme toggle
function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-purple-600">
      <div className="flex items-center gap-4">
        <SignedIn>
          <Link
            href={'/dashboard'}
            className="text-gray-700 dark:text-white bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-all ease-in-out duration-300 font-bold flex gap-2 items-center"
          >
            <Home />
            Dashboard
          </Link>
        </SignedIn>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-purple-600"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-700 dark:text-white" />
          ) : (
            <Sun className="w-5 h-5 text-gray-700 dark:text-white" />
          )}
        </button>
        
        <SignedOut>
          <SignInButton>
            <button className="px-6 py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 border border-purple-600 dark:border-purple-600">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
              Sign up
            </button>
          </SignUpButton>
        </SignedOut>
        
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideNav = [
    '/dashboard',
    '/dashboard/sources',
    '/dashboard/new-connection',
    '/dashboard/destinations',
  ].includes(pathname);

  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple,
        variables: {
          colorBackground: '#ffffff',
          colorText: '#6c47ff',
          colorPrimary: '#6c47ff',
        },
        elements: {
          card: 'bg-white shadow-md',
          headerTitle: 'text-purple-700 font-bold',
          formButtonPrimary: 'bg-[#6c47ff] text-white hover:bg-[#5a3ddd]',
        },
      }}
    >
      <html lang="en" className="light">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 transition-colors`}
        >
          <ThemeProvider>
            <OnboardingProvider>
              <AutoRedirect />
              {!hideNav && <AppHeader />}
              <TokenProvider>
                <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
              </TokenProvider>
            </OnboardingProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
