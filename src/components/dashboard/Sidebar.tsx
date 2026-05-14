'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Factory,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/hooks/use-dashboard-store';
import { translations } from '@/lib/translations';
import hanaloopLogo from '../../../src/app/favicon.ico';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();
  const { language } = useDashboardStore();
  const t = translations[language];

  const menuItems = [
    { name: t.dashboard, href: '/dashboard', icon: LayoutDashboard },
    { name: t.companies, href: '/companies', icon: Factory },
    { name: t.reports, href: '/reports', icon: FileText },
    { name: t.settings, href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform hidden md:flex flex-col">
        <div className="flex h-full flex-col px-3 py-4">
          {/* Logo */}
          <Link href="/" className="mb-10 flex items-center pl-2.5">
            <div className="mr-3 flex h-8 w-8 items-center justify-center text-white">
              <Image src={hanaloopLogo} alt="favicon.ico" width={48} height={48} />
            </div>
            <span className="self-center whitespace-nowrap text-xl font-bold tracking-tight text-foreground">
              HanaLoop
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg p-3 text-sm font-medium transition-colors hover:bg-accent",
                    isActive
                      ? "bg-accent text-emerald-600"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("mr-3 h-5 w-5", isActive && "text-emerald-600")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User / Logout */}
          <div className="mt-auto border-t pt-4">
            <button className="flex w-full items-center rounded-lg p-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-destructive">
              <LogOut className="mr-3 h-5 w-5" />
              {t.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t bg-card px-2 md:hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors",
                isActive ? "text-emerald-600" : "text-muted-foreground hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
        <button className="flex flex-col items-center justify-center gap-1 min-w-[64px] text-muted-foreground hover:text-destructive transition-colors">
          <LogOut className="h-5 w-5" />
          <span className="text-[10px] font-medium">{t.logout}</span>
        </button>
      </nav>
    </>
  );
}
