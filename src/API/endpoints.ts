export const endpoints = {
    auth: {
        basic: {
          login: '/auth/login/',
          logout: '/auth/logout/',
          register: '/auth/register/',
        },
        google: {
          init: '/auth/google/init/',
          callback: '/auth/google/callback/',
          exchange: '/auth/google/token/',
        },
        email: {
          verify: '/auth/email/verify/',
          resend: '/auth/email/resend/',
          confirm: '/auth/email/confirm/',
        },
        password: {
          change: '/auth/password/change/',
          reset: '/auth/password/reset/',
          confirm: '/auth/password/reset/confirm/',
        },
        phone: {
          verify: '/auth/phone/verify/',
          resend: '/auth/phone/resend/',
          confirm: '/auth/phone/confirm/',
        },
        profile: '/auth/profile/',
        token: {
          refresh: '/auth/token/refresh/',
          verify: '/auth/token/verify/',
        },
        account: {
          delete: '/auth/account/delete/',
          confirm: '/auth/account/delete/confirm/',
          request: '/auth/account/delete/request/',
        },
      },
}
