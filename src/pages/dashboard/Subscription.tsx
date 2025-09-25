import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/config/app';
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Plus,
  Settings,
  Download,
} from 'lucide-react';

const mockSubscriptions = [
  {
    id: 'SUB-001',
    name: 'Weekly Organic Collection',
    type: 'Organic Waste',
    frequency: 'Weekly',
    price: APP_CONFIG.currency.format(5000),
    status: 'Active',
    nextBilling: '2024-01-22',
    startDate: '2024-01-01',
  },
  {
    id: 'SUB-002',
    name: 'Monthly Recycling',
    type: 'Recyclable Materials',
    frequency: 'Monthly',
    price: APP_CONFIG.currency.format(8000),
    status: 'Active',
    nextBilling: '2024-02-01',
    startDate: '2023-12-01',
  },
  {
    id: 'SUB-003',
    name: 'Quarterly Electronics',
    type: 'Electronic Waste',
    frequency: 'Quarterly',
    price: APP_CONFIG.currency.format(15000),
    status: 'Paused',
    nextBilling: '2024-04-01',
    startDate: '2023-10-01',
  },
];

const mockBillingHistory = [
  {
    id: 'INV-001',
    date: '2024-01-01',
    amount: APP_CONFIG.currency.format(13000),
    status: 'Paid',
    subscriptions: ['Weekly Organic Collection', 'Monthly Recycling'],
  },
  {
    id: 'INV-002',
    date: '2023-12-01',
    amount: APP_CONFIG.currency.format(13000),
    status: 'Paid',
    subscriptions: ['Weekly Organic Collection', 'Monthly Recycling'],
  },
  {
    id: 'INV-003',
    date: '2023-11-01',
    amount: APP_CONFIG.currency.format(13000),
    status: 'Paid',
    subscriptions: ['Weekly Organic Collection', 'Monthly Recycling'],
  },
];

export default function DashboardSubscription() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary">
          Subscription & Billing
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscriptions and view billing history.
        </p>
      </div>

      {/* Active Subscriptions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <CardTitle>Active Subscriptions</CardTitle>
            <Button className="bg-brand-primary hover:bg-brand-secondary w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSubscriptions.map(subscription => (
              <div key={subscription.id} className="p-4 border rounded-lg">
                {/* Mobile Layout */}
                <div className="flex flex-col space-y-4 md:hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                        <CreditCard className="h-5 w-5 text-brand-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm">
                          {subscription.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            className={
                              subscription.status === 'Active'
                                ? 'bg-green-100 text-green-800 text-xs'
                                : 'bg-yellow-100 text-yellow-800 text-xs'
                            }
                          >
                            {subscription.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Type:</span>{' '}
                      {subscription.type}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Frequency:</span>{' '}
                      {subscription.frequency}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Next billing:</span>{' '}
                      {subscription.nextBilling}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-left">
                      <div className="font-medium text-lg">
                        {subscription.price}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        per {subscription.frequency.toLowerCase()}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 px-2">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-brand-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{subscription.name}</h3>
                        <Badge
                          className={
                            subscription.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {subscription.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{subscription.type}</span>
                        <span>•</span>
                        <span>{subscription.frequency}</span>
                        <span>•</span>
                        <span>Next billing: {subscription.nextBilling}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium text-lg">
                        {subscription.price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per {subscription.frequency.toLowerCase()}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">
              {APP_CONFIG.currency.format(13000)}
            </div>
            <p className="text-xs text-muted-foreground">
              Active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-secondary">
              Jan 22
            </div>
            <p className="text-xs text-muted-foreground">
              {APP_CONFIG.currency.format(5000)} due
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {APP_CONFIG.currency.format(24000)}
            </div>
            <p className="text-xs text-muted-foreground">
              vs traditional disposal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <CardTitle>Billing History</CardTitle>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBillingHistory.map(invoice => (
              <div key={invoice.id} className="p-4 border rounded-lg">
                {/* Mobile Layout */}
                <div className="flex flex-col space-y-4 md:hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm">
                          Invoice {invoice.id}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Date:</span> {invoice.date}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Services:</span>{' '}
                      {invoice.subscriptions.join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-left">
                      <div className="font-medium text-lg">
                        {invoice.amount}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 px-2">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">Invoice {invoice.id}</h3>
                        <Badge className="bg-green-100 text-green-800">
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {invoice.date} • {invoice.subscriptions.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">{invoice.amount}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
