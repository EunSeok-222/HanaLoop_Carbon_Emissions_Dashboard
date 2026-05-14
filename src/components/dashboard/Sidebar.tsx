'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Factory,
  FileText,
  Settings,
  LogOut,
  Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/hooks/use-dashboard-store';
import { translations } from '@/lib/translations';

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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform">
      <div className="flex h-full flex-col px-3 py-4">
        {/* Logo */}
        <Link href="/" className="mb-10 flex items-center pl-2.5">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Leaf size={20} />
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
  );
}
