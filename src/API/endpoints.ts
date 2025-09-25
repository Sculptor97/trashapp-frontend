export const endpoints = {
  auth: {
    basic: {
      login: '/auth/login',
      logout: '/auth/logout',
      register: '/auth/register',
    },
    google: {
      init: '/auth/google/init',
      callback: '/auth/google/callback',
      exchange: '/auth/google/token',
    },
    email: {
      verify: '/auth/email/verify',
      resend: '/auth/email/resend',
      confirm: '/auth/email/confirm',
    },
    password: {
      change: '/auth/password/change',
      reset: '/auth/password/reset',
      confirm: '/auth/password/reset/confirm',
    },
    phone: {
      verify: '/auth/phone/verify',
      resend: '/auth/phone/resend',
      confirm: '/auth/phone/confirm',
    },
    profile: '/auth/profile',
    token: {
      refresh: '/auth/token/refresh',
      verify: '/auth/token/verify',
    },
    account: {
      delete: '/auth/account/delete',
      confirm: '/auth/account/delete/confirm',
      request: '/auth/account/delete/request',
    },
  },

  admin: {
    pickups: {
      all: '/admin/pickups',
      assign: '/admin/pickups/assign',
      detail: (pickupId: string) => `/admin/pickups/${pickupId}`,
    },
    drivers: {
      all: '/admin/drivers',
      detail: (driverId: string) => `/admin/drivers/${driverId}`,
    },
    dashboard: {
      stats: '/admin/dashboard/stats',
    },
    users: {
      all: '/admin/users',
    },
  },
  customer: {
    pickups: {
      all: '/customer/pickups',
      request: '/customer/pickups/request',
      my: '/customer/pickups/my',
      myWithFilters: (params: string) => `/customer/pickups/my/?${params}`,
      detail: (pickupId: string) => `/customer/pickups/${pickupId}`,
      cancel: (pickupId: string) => `/customer/pickups/${pickupId}/cancel`,
      photos: (pickupId: string) => `/customer/pickups/${pickupId}/photos`,
      tracking: (pickupId: string) => `/customer/pickups/${pickupId}/tracking`,
      rate: (pickupId: string) => `/customer/pickups/${pickupId}/rate`,
      contactDriver: (pickupId: string) =>
        `/customer/pickups/${pickupId}/contact-driver`,
      stats: '/customer/pickups/stats',
      recurring: {
        all: '/customer/pickups/recurring',
        create: '/customer/pickups/recurring/create',
        detail: (scheduleId: string) =>
          `/customer/pickups/recurring/${scheduleId}`,
        toggle: (scheduleId: string) =>
          `/customer/pickups/recurring/${scheduleId}/toggle`,
      },
    },
  },
};
