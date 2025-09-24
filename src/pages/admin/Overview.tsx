import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/config/app';
import { 
  Users, 
  Truck, 
  Package, 
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your waste management operations and system performance.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">1,247</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-secondary">45</div>
            <p className="text-xs text-muted-foreground">
              3 drivers offline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pickups Today</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-accent">127</div>
            <p className="text-xs text-muted-foreground">
              89% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{APP_CONFIG.currency.format(2400000)}</div>
            <p className="text-xs text-muted-foreground">
              This month
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
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Organic Waste - Zone A</p>
                  <p className="text-xs text-muted-foreground">Completed by Driver John • 2 min ago</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Recyclable Materials - Zone B</p>
                  <p className="text-xs text-muted-foreground">In progress by Driver Sarah • 15 min ago</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Electronic Waste - Zone C</p>
                  <p className="text-xs text-muted-foreground">Scheduled for 3:00 PM</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Mixed Waste - Zone D</p>
                  <p className="text-xs text-muted-foreground">Delayed - Driver Mike</p>
                </div>
                <Badge className="bg-red-100 text-red-800">Delayed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">High Pickup Volume</p>
                  <p className="text-xs text-muted-foreground">Zone A experiencing 40% increase</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Driver Performance</p>
                  <p className="text-xs text-muted-foreground">All drivers meeting targets</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Clock className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Maintenance Due</p>
                  <p className="text-xs text-muted-foreground">Truck #3 needs service</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pickup Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">On-time Rate</span>
                <span className="text-sm font-medium">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '94%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Rating</span>
                <span className="text-sm font-medium">4.8/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-brand-primary h-2 rounded-full" style={{width: '96%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Monthly Growth</span>
                <span className="text-sm font-medium">+18%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-brand-secondary h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
