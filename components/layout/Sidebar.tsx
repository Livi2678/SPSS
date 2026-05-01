'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Search,
  BookOpen,
  BarChart3,
  Shield,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useApiKey } from '@/hooks/useApiKey';
import { clsx } from 'clsx';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/manuscript', label: 'Manuscript', icon: FileText },
  { href: '/search', label: 'Literature', icon: Search },
  { href: '/review', label: 'Systematic Review', icon: BookOpen },
  { href: '/analysis', label: 'Analysis', icon: BarChart3 },
  { href: '/guidelines', label: 'Guidelines', icon: Shield },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const statusConfig = {
  connected: { color: '#0d9e6e', label: 'Connected', pulse: true },
  demo: { color: '#c97d2a', label: 'Demo Mode', pulse: false },
  validating: { color: '#2d6be4', label: 'Validating...', pulse: true },
  invalid: { color: '#c94040', label: 'Invalid Key', pulse: false },
  idle: { color: '#5a6a80', label: 'Not Connected', pulse: false },
};

export function Sidebar() {
  const pathname = usePathname();
  const { status } = useApiKey();
  const statusInfo = statusConfig[status];

  return (
    <aside
      className="fixed left-0 top-0 h-full z-40 flex flex-col"
      style={{
        width: '240px',
        backgroundColor: '#0d1117',
        borderRight: '1px solid #1f2d45',
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1f2d45]">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #c9952a 0%, #e8b84b 100%)',
              boxShadow: '0 0 16px rgba(201, 149, 42, 0.3)',
            }}
          >
            <span className="text-[#07090f] font-playfair font-bold text-base">S</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-playfair text-[15px] font-semibold text-[#dde4ee] leading-none">
                ScholarAI
              </span>
              <span
                className="text-[9px] font-bold font-dm tracking-wider px-1.5 py-0.5 rounded uppercase"
                style={{
                  backgroundColor: '#c9952a',
                  color: '#07090f',
                }}
              >
                PRO
              </span>
            </div>
            <p className="text-[10px] text-[#5a6a80] font-dm mt-0.5">Research Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer group"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: '#c9952a10' }}
                    initial={false}
                    transition={{ duration: 0.2 }}
                  />
                )}

                {/* Left border for active */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full"
                    style={{ backgroundColor: '#c9952a' }}
                  />
                )}

                {/* Hover background */}
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
                    style={{ backgroundColor: '#1f2d4550' }}
                    transition={{ duration: 0.15 }}
                  />
                )}

                <Icon
                  className={clsx(
                    'w-4 h-4 relative z-10 flex-shrink-0 transition-colors',
                    isActive ? 'text-[#c9952a]' : 'text-[#5a6a80] group-hover:text-[#8b9ab0]'
                  )}
                />
                <span
                  className={clsx(
                    'text-sm font-dm relative z-10 transition-colors font-medium',
                    isActive ? 'text-[#c9952a]' : 'text-[#8b9ab0] group-hover:text-[#dde4ee]'
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-[#1f2d45] space-y-3">
        {/* API Status */}
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-[#111827] border border-[#1f2d45]">
          <div className="relative flex-shrink-0">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: statusInfo.color }}
            />
            {statusInfo.pulse && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: statusInfo.color, opacity: 0.4 }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-[#5a6a80] font-dm uppercase tracking-wider">Claude API</div>
            <div className="text-xs font-medium font-dm truncate" style={{ color: statusInfo.color }}>
              {statusInfo.label}
            </div>
          </div>
        </div>

        {/* Powered by */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          <Sparkles className="w-3 h-3 text-[#5a6a80]" />
          <span className="text-[10px] text-[#5a6a80] font-dm">Powered by Claude</span>
        </div>
      </div>
    </aside>
  );
}
