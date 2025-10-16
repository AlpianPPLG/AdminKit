'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/settings-context';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  Menu,
  ChevronDown,
  ChevronRight,
  User,
  CreditCard,
  History,
  Heart,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
  roles?: string[];
}

// Navigation items for different roles
const adminNavigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
    badge: '12',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: Package,
    badge: '8',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    title: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCart,
    badge: '5',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    title: 'Media Library',
    href: '/dashboard/media',
    icon: FileText,
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
];

const customerNavigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Browse Products',
    href: '/catalog',
    icon: Package,
  },
  {
    title: 'Shopping Cart',
    href: '/cart',
    icon: ShoppingCart,
  },
  {
    title: 'My Orders',
    href: '/dashboard/my-orders',
    icon: History,
  },
  {
    title: 'Wishlist',
    href: '/wishlist',
    icon: Heart,
  },
  {
    title: 'My Profile',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    title: 'Payment Methods',
    href: '/dashboard/payment-methods',
    icon: CreditCard,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { user } = useAuth();
  const { getSetting } = useSettings();
  const [counts, setCounts] = useState<{ users?: number; products?: number; orders?: number }>({});

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        const json = await res.json();
        if (json?.success) {
          setCounts({
            users: json.data?.overview?.totalUsers,
            products: json.data?.overview?.totalProducts,
            orders: json.data?.overview?.totalOrders,
          });
        }
      } catch (_) {
        // ignore
      }
    };
    loadCounts();
  }, []);

  const toggleExpanded = (itemTitle: string) => {
    setExpandedItems(prev =>
      prev.includes(itemTitle)
        ? prev.filter(item => item !== itemTitle)
        : [...prev, itemTitle]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  // Get navigation based on user role
  const getNavigation = () => {
    if (!user) return [];
    
    if (user.role === 'CUSTOMER') {
      return customerNavigation;
    } else {
      return adminNavigation;
    }
  };

  const navigation = getNavigation();

  const NavItem = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const active = isActive(item.href);

    const badgeText = (() => {
      if (item.title === 'Users' && counts.users != null) return String(counts.users);
      if (item.title === 'Products' && counts.products != null) return String(counts.products);
      if (item.title === 'Orders' && counts.orders != null) return String(counts.orders);
      return item.badge;
    })();

    return (
      <div>
        <div className="flex items-center">
          {hasChildren ? (
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start h-9 px-3 text-sm font-medium',
                level > 0 && 'ml-4',
                active && 'bg-accent text-accent-foreground'
              )}
              onClick={() => toggleExpanded(item.title)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.title}
              {badgeText && (
                <Badge variant="secondary" className="ml-auto">
                  {badgeText}
                </Badge>
              )}
              {isExpanded ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Button>
          ) : (
            <Link href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start h-9 px-3 text-sm font-medium',
                  level > 0 && 'ml-4',
                  active && 'bg-accent text-accent-foreground'
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.title}
                {badgeText && (
                  <Badge variant="secondary" className="ml-auto">
                    {badgeText}
                  </Badge>
                )}
              </Button>
            </Link>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <NavItem key={child.href} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const siteName = getSetting('site_name', 'AdminKit Pro');
  const logoUrl = getSetting('logo_url');
  const [logoError, setLogoError] = useState(false);

  // Reset logo error when logoUrl changes
  useEffect(() => {
    setLogoError(false);
  }, [logoUrl]);

  return (
    <div className={cn('flex h-full flex-col bg-card', className)}>
      <div className="flex h-16 items-center border-b px-6 gap-3">
        {logoUrl && !logoError && (
          <div className="relative h-10 w-10 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={siteName}
              className="h-full w-full object-contain"
              onError={() => {
                console.error('Failed to load logo:', logoUrl);
                setLogoError(true);
              }}
              onLoad={() => {
                console.log('Logo loaded successfully:', logoUrl);
              }}
            />
          </div>
        )}
        <h1 className="text-xl font-bold truncate">{siteName}</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}

