import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { useAuthQueries } from '@/hooks/useAuthQueries';

export function CustomerDashboardHeader() {
  const { profile } = useAuthQueries();

  // Get user initials from profile data
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />

      {/* Header Content */}
      <div className="flex flex-1 items-center justify-end">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <NotificationDropdown />
          <div className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {profile.data ? getUserInitials(profile.data.name) : 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
