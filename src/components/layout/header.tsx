import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MobileSidebar } from './sidebar';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/settings-context';
import {
  Bell,
  Search,
  LogOut,
  User,
  Moon,
  Sun,
  Settings,
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface HeaderProps {
  title?: string;
  description?: string;
}

export function Header({ title = 'Dashboard', description }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { updateSetting, getSetting } = useSettings();
  const router = useRouter();
  const [notifications] = useState(3); // Mock notification count

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleProfileClick = () => {
    if (!user) return;
    router.push('/dashboard/profile');
  };

  const handleSettingsClick = () => {
    if (!user) return;
    
    if (user.role === 'CUSTOMER') {
      router.push('/dashboard/profile');
    } else {
      router.push('/dashboard/settings');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Enhanced theme toggle that syncs with database
  const handleThemeToggle = async () => {
    // Get current default theme from settings
    const currentDefaultTheme = getSetting('default_theme', 'light');

    let newTheme: string;

    // Cycle through: light -> dark -> light
    if (currentDefaultTheme === 'light') {
      newTheme = 'dark';
    } else {
      newTheme = 'light';
    }

    try {
      // Update theme in next-themes
      setTheme(newTheme);

      // Also apply theme class to html element for immediate visual feedback
      if (typeof window !== 'undefined') {
        const htmlElement = document.documentElement;
        if (newTheme === 'dark') {
          htmlElement.classList.add('dark');
        } else {
          htmlElement.classList.remove('dark');
        }
      }

      // Update theme in database settings
      await updateSetting('default_theme', newTheme);

      // Emit custom event for theme change so other components can listen
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('themeChanged', {
          detail: { theme: newTheme }
        }));
      }

      console.log('🎨 Theme synced:', newTheme);
    } catch (error) {
      console.error('❌ Failed to sync theme:', error);
      // Fallback: just set theme without database update
      setTheme(newTheme);
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Search functionality
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
        setShowResults(true);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: any) => {
    setShowResults(false);
    setSearchQuery('');

    // Navigate based on result type
    switch (result.type) {
      case 'product':
        router.push(`/dashboard/products/${result.id}`);
        break;
      case 'user':
        router.push(`/dashboard/users/${result.id}`);
        break;
      case 'order':
        router.push(`/dashboard/orders/${result.id}`);
        break;
      default:
        break;
    }
  };

  // Handle clicks outside search to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <MobileSidebar />
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 relative search-container">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="pl-10 pr-4 py-2 w-64 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-4 py-2 text-left hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                              {result.type === 'product' ? 'P' :
                               result.type === 'user' ? 'U' :
                               result.type === 'order' ? 'O' : '?'}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{result.title || result.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {result.type} • {result.description || 'No description'}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="p-4 text-center">
                      <div className="text-muted-foreground mb-2">
                        No exact matches for "{searchQuery}"
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Showing all available results
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            title={`Current: ${getSetting('default_theme', 'light')} - Click to cycle`}
          >
            {getSetting('default_theme', 'light') === 'light' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {notifications}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-muted-foreground">
                    Order #1234 from John Doe
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Product out of stock</p>
                  <p className="text-xs text-muted-foreground">
                    Laptop Pro 14 inch is running low
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">
                    Jane Smith joined the platform
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

