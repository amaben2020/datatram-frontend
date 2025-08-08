'use client';

import { useState } from 'react';
import {
  LogOut,
  ChevronRight,
  CableIcon,
  Database,
  Target,
} from 'lucide-react';
import { SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const { user } = useUser();

  const navigationItems = [
    { name: 'Connections', icon: CableIcon, href: '/dashboard' },
    { name: 'Sources', icon: Database, href: '/dashboard/sources' },
    { name: 'Destinations', icon: Target, href: '/dashboard/destinations' },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-purple-100 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-purple-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Datatram</h2>
            <p className="text-sm text-purple-600">
              {user?.fullName + `'s` || user?.username || 'Default'} Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {/* Navigation Group */}
        <div className="mb-6">
          {/* <div className="mb-3">
            <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              Navigation
            </h3>
          </div> */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              return (
                <Link
                  href={item.href}
                  key={item.name}
                  onClick={() => setActiveItem(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-white' : 'text-purple-500'
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
      <div className="p-4 border-t border-purple-50">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
            {/* */}

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
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-purple-600 truncate">
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>
          <SignOutButton>
            <LogOut className="w-4 h-4 text-purple-500" />
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
