'use client';

import Link from 'next/link';
import { CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { useLogout } from '@/lib/hooks/useLogout';

export interface NavbarProps {
  userName?: string;
  userEmail?: string;
}

export default function Navbar({ userName, userEmail }: NavbarProps) {
  const logout = useLogout();

  return (
    <nav
      className={cn(
        'sticky top-0 z-40 w-full',
        'glass backdrop-blur-lg',
        'border-b border-slate-200 dark:border-slate-700',
        'shadow-soft'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/tasks"
            className="flex items-center gap-2 group transition-transform duration-200 hover:scale-105"
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-primary">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Hackathon Todo
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {userName && (
              <UserMenu
                userName={userName}
                userEmail={userEmail}
                onLogout={logout}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
