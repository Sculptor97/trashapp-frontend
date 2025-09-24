import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Truck,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  UserPlus,
  MapPin,
  Star,
} from 'lucide-react';

const mockDrivers = [
  {
    id: 'DRV-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+237 123 456 789',
    license: 'DL-123456',
    status: 'Online',
    location: 'Douala Zone A',
    rating: 4.8,
    totalPickups: 156,
    todayPickups: 8,
    lastActivity: '2024-01-15 14:30',
  },
  {
    id: 'DRV-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+237 987 654 321',
    license: 'DL-789012',
    status: 'Online',
    location: 'Yaoundé Zone B',
    rating: 4.9,
    totalPickups: 203,
    todayPickups: 12,
    lastActivity: '2024-01-15 14:25',
  },
  {
    id: 'DRV-003',
    name: 'Mike Wilson',
    email: 'mike.w@example.com',
    phone: '+237 555 123 456',
    license: 'DL-345678',
    status: 'Offline',
    location: 'Limbe Zone C',
    rating: 4.6,
    totalPickups: 98,
    todayPickups: 0,
    lastActivity: '2024-01-15 12:00',
  },
  {
    id: 'DRV-004',
    name: 'Emma Brown',
    email: 'emma.b@example.com',
    phone: '+237 444 777 888',
    license: 'DL-901234',
    status: 'Online',
    location: 'Buea Zone D',
    rating: 4.7,
    totalPickups: 134,
    todayPickups: 6,
    lastActivity: '2024-01-15 14:20',
  },
  {
    id: 'DRV-005',
    name: 'David Lee',
    email: 'david.l@example.com',
    phone: '+237 333 666 999',
    license: 'DL-567890',
    status: 'On Break',
    location: 'Douala Zone E',
    rating: 4.5,
    totalPickups: 87,
    todayPickups: 4,
    lastActivity: '2024-01-15 13:45',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Online':
      return 'bg-green-100 text-green-800';
    case 'Offline':
      return 'bg-gray-100 text-gray-800';
    case 'On Break':
      return 'bg-yellow-100 text-yellow-800';
    case 'Busy':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminDrivers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">
            Manage Drivers
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage your driver fleet and their performance.
          </p>
        </div>
        <Button className="bg-brand-primary hover:bg-brand-secondary">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">45</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Now</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">32</div>
            <p className="text-xs text-muted-foreground">
              71% of total drivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Pickups
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-secondary">127</div>
            <p className="text-xs text-muted-foreground">+15% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">4.7</div>
            <p className="text-xs text-muted-foreground">
              Customer satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Driver Management</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drivers by name, email, or license..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Drivers Table */}
          <div className="space-y-4">
            {mockDrivers.map(driver => (
              <div
                key={driver.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{driver.name}</h3>
                      <Badge className={getStatusColor(driver.status)}>
                        {driver.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{driver.email}</span>
                      <span>•</span>
                      <span>{driver.phone}</span>
                      <span>•</span>
                      <span>License: {driver.license}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{driver.location}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{driver.rating}/5</span>
                      </div>
                      <span>•</span>
                      <span>Today: {driver.todayPickups} pickups</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-muted-foreground">
              Showing 1-5 of 45 drivers
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
