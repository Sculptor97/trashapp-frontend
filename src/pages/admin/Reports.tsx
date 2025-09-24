import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/config/app';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  Users,
  Truck,
  Package,
  DollarSign
} from 'lucide-react';

const mockMetrics = [
  {
    title: 'Total Revenue',
    value: APP_CONFIG.currency.format(2400000),
    change: '+18%',
    trend: 'up',
    period: 'This month'
  },
  {
    title: 'Active Users',
    value: '1,156',
    change: '+12%',
    trend: 'up',
    period: 'This month'
  },
  {
    title: 'Pickups Completed',
    value: '3,247',
    change: '+25%',
    trend: 'up',
    period: 'This month'
  },
  {
    title: 'Driver Efficiency',
    value: '94%',
    change: '+3%',
    trend: 'up',
    period: 'This month'
  }
];

const mockTopDrivers = [
  { name: 'Sarah Johnson', pickups: 203, rating: 4.9, revenue: APP_CONFIG.currency.format(45600) },
  { name: 'John Smith', pickups: 156, rating: 4.8, revenue: APP_CONFIG.currency.format(38400) },
  { name: 'Emma Brown', pickups: 134, rating: 4.7, revenue: APP_CONFIG.currency.format(32200) },
  { name: 'Mike Wilson', pickups: 98, rating: 4.6, revenue: APP_CONFIG.currency.format(23500) },
  { name: 'David Lee', pickups: 87, rating: 4.5, revenue: APP_CONFIG.currency.format(20900) }
];

const mockTopZones = [
  { zone: 'Douala Zone A', pickups: 456, revenue: APP_CONFIG.currency.format(89200), growth: '+15%' },
  { zone: 'Yaoundé Zone B', pickups: 389, revenue: APP_CONFIG.currency.format(76100), growth: '+22%' },
  { zone: 'Limbe Zone C', pickups: 234, revenue: APP_CONFIG.currency.format(45800), growth: '+8%' },
  { zone: 'Buea Zone D', pickups: 198, revenue: APP_CONFIG.currency.format(38700), growth: '+12%' },
  { zone: 'Douala Zone E', pickups: 156, revenue: APP_CONFIG.currency.format(30500), growth: '+5%' }
];

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into your waste management operations.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-brand-primary hover:bg-brand-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-primary">{metric.value}</div>
              <div className="flex items-center space-x-1">
                <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </span>
                <span className="text-xs text-muted-foreground">{metric.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopDrivers.map((driver, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-light rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-brand-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {driver.pickups} pickups • ⭐ {driver.rating}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{driver.revenue}</div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zone Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopZones.map((zone, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-light rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-brand-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{zone.zone}</div>
                      <div className="text-sm text-muted-foreground">
                        {zone.pickups} pickups
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{zone.revenue}</div>
                    <div className="text-sm text-green-600">{zone.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Waste Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Organic Waste</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-brand-primary h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Recyclable Materials</span>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-brand-secondary h-2 rounded-full" style={{width: '30%'}}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Electronic Waste</span>
                <span className="text-sm font-medium">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-brand-accent h-2 rounded-full" style={{width: '15%'}}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Mixed Waste</span>
                <span className="text-sm font-medium">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-500 h-2 rounded-full" style={{width: '10%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Revenue Growth</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+18%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">User Growth</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+12%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Pickup Efficiency</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+3%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Customer Satisfaction</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-brand-primary" />
                <div>
                  <div className="font-medium">1,156 Active Users</div>
                  <div className="text-sm text-muted-foreground">92.7% engagement</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-brand-secondary" />
                <div>
                  <div className="font-medium">45 Active Drivers</div>
                  <div className="text-sm text-muted-foreground">71% online rate</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-brand-accent" />
                <div>
                  <div className="font-medium">3,247 Pickups</div>
                  <div className="text-sm text-muted-foreground">This month</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">{APP_CONFIG.currency.format(2400000)} Revenue</div>
                  <div className="text-sm text-muted-foreground">+18% growth</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
