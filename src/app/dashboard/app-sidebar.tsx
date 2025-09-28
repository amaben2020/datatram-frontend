'use client';

import { useState } from 'react';
import {
  LogOut,
  ChevronRight,
  CableIcon,
  Database,
  Target,
  Moon,
  Sun,
} from 'lucide-react';
import { SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import { useOnboarding } from '../context/OnboardingContext';

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { resetOnboarding } = useOnboarding();

  const navigationItems = [
    { name: 'Connections', icon: CableIcon, href: '/dashboard', className: 'onboarding-connections' },
    { name: 'Sources', icon: Database, href: '/dashboard/sources', className: 'onboarding-sources' },
    { name: 'Destinations', icon: Target, href: '/dashboard/destinations', className: 'onboarding-destinations' },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen lg:bg-white lg:dark:bg-gray-900 lg:border-r lg:border-purple-100 lg:dark:border-purple-600 lg:shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-purple-50 dark:border-purple-600">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Datatram</h2>
            {user?.fullName?.length && user.fullName.length > 0 ? (
              <p className="text-sm text-purple-600 dark:text-white">
                {user?.fullName + `'s` ||
                  user?.emailAddresses[0].emailAddress ||
                  user?.username ||
                  'Default'}{' '}
                Workspace
              </p>
            ) : (
              <p className="text-sm text-purple-600 dark:text-white">
                {user?.emailAddresses[0].emailAddress ||
                  user?.username ||
                  'Default'}{' '}
                Workspace
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {/* Navigation Group */}
        <div className="mb-6">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              return (
                <Link
                  href={item.href}
                  key={item.name}
                  onClick={() => setActiveItem(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${item.className} ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-white hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-purple-700 dark:hover:text-purple-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-white' : 'text-purple-500 dark:text-purple-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive
                        ? 'text-white opacity-100'
                        : 'opacity-0 group-hover:opacity-100 text-purple-400'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-purple-50 dark:border-purple-600">
        <div className="flex items-center justify-between mb-3 gap-3.5">
    
          <button
            onClick={resetOnboarding}
            className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
            title="Restart onboarding tour"
          >
            Restart Tour
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-purple-600"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-gray-700 dark:text-white" />
            ) : (
              <Sun className="w-4 h-4 text-gray-700 dark:text-white" />
            )}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('datatram-onboarding-completed');
              window.location.reload();
            }}
            className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
            title="Reset onboarding and reload"
          >
            Reset & Reload
          </button>
        </div>
        
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-purple-200 dark:border-purple-600">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
            {user?.imageUrl.length ? (
              <Image
                src={user?.imageUrl || ''}
                alt=""
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <span className="text-white text-sm font-medium">
                {user?.firstName?.split('')[0]}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-purple-600 dark:text-white truncate">
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>
          <SignOutButton>
            <LogOut className="w-4 h-4 text-purple-500 dark:text-white" />
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
