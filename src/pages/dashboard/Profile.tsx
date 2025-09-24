import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { APP_CONFIG } from '@/config/app';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useState } from 'react';

const mockProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+237 123 456 789',
  address: '123 Main Street, Douala, Cameroon',
  dateOfBirth: '1990-05-15',
  joinDate: '2023-01-15',
  totalPickups: 45,
  totalSavings: APP_CONFIG.currency.format(67500)
};

export default function DashboardProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfile);

  const handleSave = () => {
    // TODO: Implement save logic
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfile(mockProfile);
    setIsEditing(false);
  };

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
              <Button onClick={handleSave} className="bg-brand-primary hover:bg-brand-secondary">
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
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
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
                  <div className="text-sm text-muted-foreground">{profile.joinDate}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-brand-primary" />
                </div>
                <div>
                  <div className="font-medium">Total Pickups</div>
                  <div className="text-sm text-muted-foreground">{profile.totalPickups} completed</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Total Savings</div>
                  <div className="text-sm text-muted-foreground">{profile.totalSavings}</div>
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
