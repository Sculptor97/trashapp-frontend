import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/config/app';
import {
  Package,
  Calendar,
  CreditCard,
  TrendingUp,
  Plus,
  Clock,
} from 'lucide-react';
import { useAuthQueries } from '@/hooks/useAuthQueries';

export default function DashboardOverview() {
  const { profile } = useAuthQueries();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-primary">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back
          {profile.data?.name ? `, ${profile.data.name.split(' ')[0]}` : ''}!
          Here's what's happening with your waste management.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">2</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Pickups
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-secondary">3</div>
            <p className="text-xs text-muted-foreground">
              Next pickup: Tomorrow
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-accent">8</div>
            <p className="text-xs text-muted-foreground">Pickups completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {APP_CONFIG.currency.format(2400)}
            </div>
            <p className="text-xs text-muted-foreground">
              vs traditional disposal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Organic Waste Pickup</p>
                  <p className="text-xs text-muted-foreground">
                    Completed 2 days ago
                  </p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Recyclable Materials</p>
                  <p className="text-xs text-muted-foreground">
                    Scheduled for tomorrow
                  </p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Electronic Waste</p>
                  <p className="text-xs text-muted-foreground">
                    Completed 1 week ago
                  </p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Pickup
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
