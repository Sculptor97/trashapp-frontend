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
import { AdminDashboardHeader } from '@/components/layouts/AdminDashboardHeader';
import {
  Home,
  Users,
  Truck,
  Package,
  BarChart3,
  LogOut,
  Recycle,
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Overview',
    href: '/admin',
    icon: Home,
  },
  {
    name: 'Manage Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Manage Drivers',
    href: '/admin/drivers',
    icon: Truck,
  },
  {
    name: 'Pickup Requests',
    href: '/admin/requests',
    icon: Package,
  },
  {
    name: 'Reports & Analytics',
    href: '/admin/reports',
    icon: BarChart3,
  },
];

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/auth/login');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <Recycle className="h-6 w-6 text-brand-primary" />
          <span className="text-lg font-bold text-brand-primary group-data-[collapsible=icon]:hidden">
            TrashTrack Admin
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

export function AdminDashboardLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminDashboardHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
