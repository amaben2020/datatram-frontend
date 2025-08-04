'use client';

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarHeader,
// } from '@/components/ui/sidebar';

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarHeader />
//       <SidebarContent>
//         <SidebarGroup />
//         <SidebarGroup />
//       </SidebarContent>
//       <SidebarFooter />
//     </Sidebar>
//   );
// }

import { useState } from 'react';
import {
  Home,
  Settings,
  Users,
  FileText,
  BarChart3,
  Mail,
  Calendar,
  Search,
  Bell,
  User,
  LogOut,
  ChevronRight,
  CableIcon,
} from 'lucide-react';

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const navigationItems = [
    { name: 'Connections', icon: CableIcon, href: '#' },
    { name: 'Analytics', icon: BarChart3, href: '#' },
    { name: 'Projects', icon: FileText, href: '#' },
    { name: 'Team', icon: Users, href: '#' },
    { name: 'Calendar', icon: Calendar, href: '#' },
    { name: 'Messages', icon: Mail, href: '#' },
  ];

  const settingsItems = [
    { name: 'Settings', icon: Settings, href: '#' },
    { name: 'Notifications', icon: Bell, href: '#' },
    { name: 'Profile', icon: User, href: '#' },
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
            <p className="text-sm text-purple-600">Workspace</p>
          </div>
        </div>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-purple-50 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-purple-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {/* Navigation Group */}
        <div className="mb-6">
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              Navigation
            </h3>
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              return (
                <button
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
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Group */}
        <div>
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              Account
            </h3>
          </div>
          <nav className="space-y-1">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              return (
                <button
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
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-purple-50">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              John Doe
            </p>
            <p className="text-xs text-purple-600 truncate">
              john.doe@example.com
            </p>
          </div>
          <LogOut className="w-4 h-4 text-purple-500" />
        </div>
      </div>
    </div>
  );
}
