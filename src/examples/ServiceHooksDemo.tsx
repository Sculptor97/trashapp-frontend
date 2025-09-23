import React, { useState } from 'react';
import { useAuthMutations } from '../hooks/useAuthMutations';
import { useAuthQueries } from '../hooks/useAuthQueries';
import { usePickupMutations } from '../hooks/usePickupMutations';
import { usePickupQueries } from '../hooks/usePickupQueries';
import { useAdminMutations } from '../hooks/useAdminMutations';
import { useAdminQueries } from '../hooks/useAdminQueries';
import type { LoginCredentials, RegisterData, PickupRequest, Pickup, PickupWithUser } from '../types';

const ServiceHooksDemo: React.FC = () => {
  // Auth state
  const [loginForm, setLoginForm] = useState<LoginCredentials>({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState<RegisterData>({ name: '', email: '', password: '' });
  const [pickupForm, setPickupForm] = useState<PickupRequest>({ address: '', notes: '' });

  // Auth hooks
  const { login, logout, register } = useAuthMutations();
  const { profile } = useAuthQueries();

  // Pickup hooks
  const { requestPickup } = usePickupMutations();
  const { myPickups } = usePickupQueries();

  // Admin hooks (these will show placeholder data since endpoints don't exist yet)
  const { assignDriver } = useAdminMutations();
  const { getAllPickups, getDashboardStats } = useAdminQueries();
  
  // Get data from queries
  const { data: allPickups, isLoading: allPickupsLoading } = getAllPickups();
  const stats = getDashboardStats;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(loginForm, {
      onSuccess: () => {
        console.log('Login successful!');
        setLoginForm({ email: '', password: '' });
      },
      onError: (error) => {
        console.error('Login failed:', error);
      },
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(registerForm, {
      onSuccess: () => {
        console.log('Registration successful!');
        setRegisterForm({ name: '', email: '', password: '' });
      },
      onError: (error) => {
        console.error('Registration failed:', error);
      },
    });
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        console.log('Logout successful!');
      },
      onError: (error) => {
        console.error('Logout failed:', error);
      },
    });
  };

  const handleRequestPickup = (e: React.FormEvent) => {
    e.preventDefault();
    requestPickup.mutate(pickupForm, {
      onSuccess: () => {
        console.log('Pickup requested successfully!');
        setPickupForm({ address: '', notes: '' });
      },
      onError: (error) => {
        console.error('Pickup request failed:', error);
      },
    });
  };

  const handleAssignDriver = (pickupId: string, driverId: string) => {
    assignDriver.mutate(
      { pickupId, driverId },
      {
        onSuccess: () => {
          console.log('Driver assigned successfully!');
        },
        onError: (error) => {
          console.error('Driver assignment failed:', error);
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">TrashTrack Service Hooks Demo</h1>

      {/* Auth Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
        
        {/* Login Form */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Login</h3>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {login.isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Register Form */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Register</h3>
          <form onSubmit={handleRegister} className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
            <button
              type="submit"
              disabled={register.isPending}
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {register.isPending ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>

        {/* Logout Button */}
        <div className="mb-6">
          <button
            onClick={handleLogout}
            disabled={logout.isPending}
            className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 disabled:opacity-50"
          >
            {logout.isPending ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {/* Profile Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">Profile</h3>
          {profile.isLoading && <p>Loading profile...</p>}
          {profile.isError && <p className="text-red-500">Error loading profile: {profile.error?.message}</p>}
          {profile.data && (
            <div className="bg-gray-100 p-4 rounded-md">
              <p><strong>Name:</strong> {profile.data.name}</p>
              <p><strong>Email:</strong> {profile.data.email}</p>
              <p><strong>Role:</strong> {profile.data.role}</p>
              <p><strong>ID:</strong> {profile.data.id}</p>
            </div>
          )}
        </div>
      </section>

      {/* Pickup Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Pickup Requests</h2>
        
        {/* Request Pickup Form */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Request Pickup</h3>
          <form onSubmit={handleRequestPickup} className="space-y-3">
            <input
              type="text"
              placeholder="Address"
              value={pickupForm.address}
              onChange={(e) => setPickupForm({ ...pickupForm, address: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
            <textarea
              placeholder="Notes (optional)"
              value={pickupForm.notes}
              onChange={(e) => setPickupForm({ ...pickupForm, notes: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
            <button
              type="submit"
              disabled={requestPickup.isPending}
              className="w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 disabled:opacity-50"
            >
              {requestPickup.isPending ? 'Requesting...' : 'Request Pickup'}
            </button>
          </form>
        </div>

        {/* My Pickups */}
        <div>
          <h3 className="text-lg font-medium mb-3">My Pickups</h3>
          {myPickups.isLoading && <p>Loading pickups...</p>}
          {myPickups.data && myPickups.data.length === 0 && <p>No pickups found.</p>}
          {myPickups.data && myPickups.data.length > 0 && (
            <div className="space-y-2">
              {myPickups.data.map((pickup: Pickup) => (
                <div key={pickup.id} className="bg-gray-100 p-3 rounded-md">
                  <p><strong>Address:</strong> {pickup.address}</p>
                  <p><strong>Status:</strong> {pickup.status}</p>
                  <p><strong>Date:</strong> {new Date(pickup.pickup_date).toLocaleDateString()}</p>
                  {pickup.notes && <p><strong>Notes:</strong> {pickup.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Admin Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
        
        {/* Dashboard Stats */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Statistics</h3>
          {stats.isLoading && <p>Loading stats...</p>}
          {stats.data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-100 p-3 rounded-md text-center">
                <p className="text-2xl font-bold">{stats.data.total_pickups}</p>
                <p className="text-sm">Total Pickups</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-md text-center">
                <p className="text-2xl font-bold">{stats.data.pending_pickups}</p>
                <p className="text-sm">Pending</p>
              </div>
              <div className="bg-green-100 p-3 rounded-md text-center">
                <p className="text-2xl font-bold">{stats.data.completed_pickups}</p>
                <p className="text-sm">Completed</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-md text-center">
                <p className="text-2xl font-bold">{stats.data.active_drivers}</p>
                <p className="text-sm">Active Drivers</p>
              </div>
            </div>
          )}
        </div>

        {/* All Pickups */}
        <div>
          <h3 className="text-lg font-medium mb-3">All Pickups</h3>
          {allPickupsLoading && <p>Loading all pickups...</p>}
          {allPickups && allPickups.pickups.length === 0 && <p>No pickups found.</p>}
          {allPickups && allPickups.pickups.length > 0 && (
            <div className="space-y-2">
              {allPickups.pickups.slice(0, 3).map((pickup: PickupWithUser) => (
                <div key={pickup.id} className="bg-gray-100 p-3 rounded-md">
                  <p><strong>User:</strong> {pickup.user.name}</p>
                  <p><strong>Address:</strong> {pickup.address}</p>
                  <p><strong>Status:</strong> {pickup.status}</p>
                  <button
                    onClick={() => handleAssignDriver(pickup.id, 'driver-1')}
                    disabled={assignDriver.isPending}
                    className="mt-2 bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 disabled:opacity-50"
                  >
                    Assign Driver
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Status Messages */}
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-2">Hook Status</h3>
        <div className="text-sm space-y-1">
          <p>Login: {login.isPending ? 'Loading...' : login.isError ? 'Error' : 'Ready'}</p>
          <p>Register: {register.isPending ? 'Loading...' : register.isError ? 'Error' : 'Ready'}</p>
          <p>Logout: {logout.isPending ? 'Loading...' : logout.isError ? 'Error' : 'Ready'}</p>
          <p>Profile: {profile.isLoading ? 'Loading...' : profile.isError ? 'Error' : 'Ready'}</p>
          <p>Request Pickup: {requestPickup.isPending ? 'Loading...' : requestPickup.isError ? 'Error' : 'Ready'}</p>
          <p>My Pickups: {myPickups.isLoading ? 'Loading...' : 'Ready'}</p>
          <p>All Pickups: {allPickupsLoading ? 'Loading...' : 'Ready'}</p>
          <p>Dashboard Stats: {stats.isLoading ? 'Loading...' : 'Ready'}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceHooksDemo;
