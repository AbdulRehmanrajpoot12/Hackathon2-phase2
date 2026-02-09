'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UserMenuProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export default function UserMenu({ userName = 'User', userEmail, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { icon: User, label: 'Profile', onClick: () => console.log('Profile') },
    { icon: Settings, label: 'Settings', onClick: () => console.log('Settings') },
    { icon: HelpCircle, label: 'Help', onClick: () => console.log('Help') },
    { icon: LogOut, label: 'Sign Out', onClick: onLogout, danger: true },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg glass-card',
          'transition-all duration-200',
          'hover:scale-105 hover:shadow-glow-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold">
          {getInitials(userName)}
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-slate-600 dark:text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-2 w-56 rounded-lg glass-modal shadow-glass',
            'border border-slate-200 dark:border-slate-700',
            'animate-scale-in origin-top-right',
            'z-50'
          )}
        >
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {userName}
            </p>
            {userEmail && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {userEmail}
              </p>
            )}
          </div>
          <div className="p-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-md',
                  'text-sm transition-colors duration-150',
                  item.danger
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
