import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_CONFIG } from '@/config/app';
import {
  Package,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Clock,
  MapPin,
  User,
  Truck,
} from 'lucide-react';

const mockRequests = [
  {
    id: 'REQ-001',
    customer: 'John Doe',
    type: 'Organic Waste',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'Scheduled',
    address: '123 Main Street, Douala',
    driver: 'John Smith',
    weight: '15kg',
    price: APP_CONFIG.currency.format(2500),
    priority: 'Normal',
  },
  {
    id: 'REQ-002',
    customer: 'Sarah Johnson',
    type: 'Recyclable Materials',
    date: '2024-01-15',
    time: '2:00 PM',
    status: 'In Progress',
    address: '456 Avenue, Yaoundé',
    driver: 'Sarah Wilson',
    weight: '8kg',
    price: APP_CONFIG.currency.format(1800),
    priority: 'High',
  },
  {
    id: 'REQ-003',
    customer: 'Mike Wilson',
    type: 'Electronic Waste',
    date: '2024-01-15',
    time: '9:30 AM',
    status: 'Completed',
    address: '789 Boulevard, Limbe',
    driver: 'Mike Brown',
    weight: '3kg',
    price: APP_CONFIG.currency.format(3200),
    priority: 'Normal',
  },
  {
    id: 'REQ-004',
    customer: 'Emma Brown',
    type: 'Mixed Waste',
    date: '2024-01-15',
    time: '11:00 AM',
    status: 'Delayed',
    address: '321 Street, Buea',
    driver: 'Emma Lee',
    weight: '12kg',
    price: APP_CONFIG.currency.format(2100),
    priority: 'Low',
  },
  {
    id: 'REQ-005',
    customer: 'David Lee',
    type: 'Hazardous Waste',
    date: '2024-01-15',
    time: '3:00 PM',
    status: 'Pending',
    address: '654 Road, Douala',
    driver: 'Not Assigned',
    weight: '5kg',
    price: APP_CONFIG.currency.format(4500),
    priority: 'High',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Delayed':
      return 'bg-red-100 text-red-800';
    case 'Pending':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800';
    case 'Normal':
      return 'bg-blue-100 text-blue-800';
    case 'Low':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminRequests() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">
            Pickup Requests
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage all pickup requests across the system.
          </p>
        </div>
        <Button className="bg-brand-primary hover:bg-brand-secondary">
          <Package className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">1,247</div>
            <p className="text-xs text-muted-foreground">+18% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">23</div>
            <p className="text-xs text-muted-foreground">Need assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">45</div>
            <p className="text-xs text-muted-foreground">
              Currently being processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Today
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">127</div>
            <p className="text-xs text-muted-foreground">89% completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Request Management</CardTitle>
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
                  placeholder="Search requests by ID, customer, or type..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="space-y-4">
            {mockRequests.map(request => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{request.type}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{request.customer}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {request.date} at {request.time}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Truck className="h-3 w-3" />
                        <span>{request.driver}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{request.address}</span>
                      </div>
                      <span>•</span>
                      <span>Weight: {request.weight}</span>
                      <span>•</span>
                      <span>Price: {request.price}</span>
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
              Showing 1-5 of 1,247 requests
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
