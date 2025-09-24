import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { CustomerDashboardHeader } from '@/components/layouts/CustomerDashboardHeader';
import { Home, Package, CreditCard, User, LogOut, Recycle } from 'lucide-react';
import { useAuthMutations } from '@/hooks/useAuthMutations';

const navigationItems = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Pickup Requests',
    href: '/dashboard/requests',
    icon: Package,
  },
  {
    name: 'Subscription & Billing',
    href: '/dashboard/subscription',
    icon: CreditCard,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
];

function CustomerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthMutations();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate('/auth/login');
    } catch (error) {
      // Error is handled by the mutation
      console.error('Logout failed:', error);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <Recycle className="h-6 w-6 text-brand-primary" />
          <span className="text-lg font-bold text-brand-primary group-data-[collapsible=icon]:hidden">
            TrashTrack
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                    >
                      <button onClick={() => navigate(item.href)}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <button onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function CustomerDashboardLayout() {
  return (
    <SidebarProvider>
      <CustomerSidebar />
      <SidebarInset>
        <CustomerDashboardHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
