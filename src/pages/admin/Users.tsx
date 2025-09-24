import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  UserPlus,
} from 'lucide-react';

const mockUsers = [
  {
    id: 'USR-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+237 123 456 789',
    location: 'Douala',
    status: 'Active',
    joinDate: '2023-01-15',
    totalPickups: 45,
    lastActivity: '2024-01-15',
  },
  {
    id: 'USR-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+237 987 654 321',
    location: 'Yaoundé',
    status: 'Active',
    joinDate: '2023-03-22',
    totalPickups: 32,
    lastActivity: '2024-01-14',
  },
  {
    id: 'USR-003',
    name: 'Mike Wilson',
    email: 'mike.w@example.com',
    phone: '+237 555 123 456',
    location: 'Limbe',
    status: 'Inactive',
    joinDate: '2023-02-10',
    totalPickups: 18,
    lastActivity: '2023-12-20',
  },
  {
    id: 'USR-004',
    name: 'Emma Brown',
    email: 'emma.b@example.com',
    phone: '+237 444 777 888',
    location: 'Buea',
    status: 'Active',
    joinDate: '2023-05-08',
    totalPickups: 67,
    lastActivity: '2024-01-15',
  },
  {
    id: 'USR-005',
    name: 'David Lee',
    email: 'david.l@example.com',
    phone: '+237 333 666 999',
    location: 'Douala',
    status: 'Suspended',
    joinDate: '2023-04-12',
    totalPickups: 12,
    lastActivity: '2024-01-10',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Inactive':
      return 'bg-gray-100 text-gray-800';
    case 'Suspended':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">
            Manage Users
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all registered users in the system.
          </p>
        </div>
        <Button className="bg-brand-primary hover:bg-brand-secondary">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,156</div>
            <p className="text-xs text-muted-foreground">
              92.7% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New This Month
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-secondary">89</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">91</div>
            <p className="text-xs text-muted-foreground">7.3% of total users</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Management</CardTitle>
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
                  placeholder="Search users by name, email, or phone..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="space-y-4">
            {mockUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{user.name}</h3>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{user.email}</span>
                      <span>•</span>
                      <span>{user.phone}</span>
                      <span>•</span>
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Joined: {user.joinDate}</span>
                      <span>•</span>
                      <span>Pickups: {user.totalPickups}</span>
                      <span>•</span>
                      <span>Last active: {user.lastActivity}</span>
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
              Showing 1-5 of 1,247 users
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
