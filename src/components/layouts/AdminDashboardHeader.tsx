import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, Settings } from 'lucide-react';

export function AdminDashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />

      {/* Header Content */}
      <div className="flex flex-1 items-center justify-end">
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-brand-primary/10 text-brand-primary mr-4"
          >
            Admin
          </Badge>
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <div className="h-8 w-8 rounded-full bg-brand-secondary flex items-center justify-center">
            <span className="text-sm font-medium text-white">AD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
