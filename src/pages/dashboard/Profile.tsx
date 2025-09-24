import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthQueries } from '@/hooks/useAuthQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const { profile } = useAuthQueries();

  // Parse user data for form fields
  const userData = profile.data;
  const [formData, setFormData] = useState({
    firstName: userData?.name?.split(' ')[0] || '',
    lastName: userData?.name?.split(' ').slice(1).join(' ') || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
  });

  const handleSave = () => {
    // TODO: Implement save logic with API call
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: userData?.name?.split(' ')[0] || '',
      lastName: userData?.name?.split(' ').slice(1).join(' ') || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: userData?.address || '',
    });
    setIsEditing(false);
  };

  // Show loading state while profile is being fetched
  if (profile.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if profile fetch failed
  if (profile.error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Failed to load profile data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information and preferences.
          </p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                className="bg-brand-primary hover:bg-brand-secondary"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={e =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={e =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={e =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={e =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-brand-primary" />
                </div>
                <div>
                  <div className="font-medium">Member Since</div>
                  <div className="text-sm text-muted-foreground">
                    {userData?.created_at
                      ? new Date(userData.created_at).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-brand-primary" />
                </div>
                <div>
                  <div className="font-medium">Account Type</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {userData?.role || 'Customer'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Email Status</div>
                  <div className="text-sm text-muted-foreground">
                    {userData?.email ? 'Verified' : 'Unverified'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Change Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Change Phone
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                Update Address
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
