export const APP_CONFIG = {
  // App Information
  name: 'EcoCollect',
  tagline: 'Smart Waste Management for a Cleaner Cameroon',
  description:
    'Schedule waste pickups, track your environmental impact, and contribute to a cleaner, greener Cameroon with our innovative web-based waste management platform.',

  // Branding
  logo: {
    icon: 'Recycle',
    text: 'EcoCollect',
  },

  // Contact Information
  contact: {
    phone: '+237 6XX XXX XXX',
    email: 'info@ecocollect.cm',
    addresses: ['Douala, Cameroon', 'Yaoundé, Cameroon'],
  },

  // Social Media Links
  social: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
  },

  // Currency Configuration
  currency: {
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Central African CFA franc',
    format: (amount: number) => `${amount.toLocaleString()} FCFA`,
  },

  // Mapbox Configuration
  mapbox: {
    accessToken:
      import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
      'pk.eyJ1IjoiZWNvY29sbGVjdCIsImEiOiJjbHFkNXB0ZjcwMDVjMmptdWR1YmVldjFsIn0.example',
    defaultCenter: [9.7043, 4.0483] as [number, number], // Douala, Cameroon
    defaultZoom: 12,
    style: 'mapbox://styles/mapbox/streets-v12',
  },

  // App Statistics
  stats: {
    users: '10,000+',
    pickups: '50,000+',
    recycled: '500+',
    cities: '5',
    rating: '4.8/5',
    satisfaction: '98%',
  },

  // Navigation Links
  navigation: {
    main: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Contact', href: '#contact' },
    ],
    footer: {
      quickLinks: [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'About Us', href: '#about' },
      ],
      services: [
        { label: 'Residential Pickup', href: '#residential' },
        { label: 'Commercial Services', href: '#commercial' },
        { label: 'Recycling Programs', href: '#recycling' },
        { label: 'Bulk Waste Removal', href: '#bulk' },
      ],
      legal: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
      ],
    },
  },

  // Pricing Plans
  pricing: {
    plans: [
      {
        name: 'Basic',
        price: '2,500',
        currency: 'FCFA',
        period: 'per pickup',
        features: ['Weekly pickup', 'Basic waste types', 'Web platform access'],
        popular: false,
      },
      {
        name: 'Standard',
        price: '8,000',
        currency: 'FCFA',
        period: 'per month',
        features: [
          'Bi-weekly pickup',
          'All waste types',
          'Priority support',
          'Environmental reports',
        ],
        popular: true,
      },
      {
        name: 'Premium',
        price: '15,000',
        currency: 'FCFA',
        period: 'per month',
        features: [
          'Weekly pickup',
          'Recycling programs',
          '24/7 support',
          'Bulk waste removal',
        ],
        popular: false,
      },
    ],
  },

  // Features
  features: [
    {
      icon: 'Calendar',
      title: 'Easy Scheduling',
      description:
        'Schedule pickups in seconds with our intuitive web platform. Set recurring pickups and never miss collection day.',
    },
    {
      icon: 'Truck',
      title: 'Real-time Tracking',
      description:
        'Track your waste collection truck in real-time. Get notifications when your pickup is on the way.',
    },
    {
      icon: 'Leaf',
      title: 'Environmental Impact',
      description:
        'Track your environmental contribution with detailed reports on waste diverted from landfills.',
    },
    {
      icon: 'Shield',
      title: 'Secure Payments',
      description:
        'Pay securely through mobile money, bank transfers, or cash. Multiple payment options available directly on our platform.',
    },
    {
      icon: 'Users',
      title: 'Community Features',
      description:
        'Connect with neighbors, share tips, and participate in community clean-up initiatives.',
    },
    {
      icon: 'Recycle',
      title: 'Recycling Programs',
      description:
        'Access specialized recycling programs for electronics, plastics, and organic waste.',
    },
  ],

  // How It Works Steps
  howItWorks: [
    {
      step: 1,
      title: 'Sign Up',
      description:
        'Create your account on our web platform in under 2 minutes. No downloads required.',
    },
    {
      step: 2,
      title: 'Schedule Pickup',
      description:
        'Choose your preferred pickup date and time. Set up recurring schedules for regular waste collection.',
    },
    {
      step: 3,
      title: 'Track & Pay',
      description:
        'Track your collection in real-time through our web dashboard and pay securely through your preferred payment method.',
    },
  ],

  // Call to Action
  cta: {
    primary: {
      text: 'Start Your Journey',
      href: '/auth/register',
    },
    secondary: {
      text: 'Watch Demo',
      href: '#',
    },
  },

  // Newsletter Section
  newsletter: {
    title: 'Stay Updated with EcoCollect',
    description:
      'Get the latest news, tips, and updates about waste management and environmental initiatives in Cameroon. Join our community of eco-conscious citizens.',
    placeholder: 'Enter your email address',
    buttonText: 'Subscribe',
    benefits: [
      'Weekly waste management tips',
      'Environmental impact updates',
      'Community clean-up events',
      'Exclusive offers and promotions',
    ],
  },

  // Images
  images: {
    hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },

  // Copyright
  copyright: `© ${new Date().getFullYear()} EcoCollect. All rights reserved.`,
} as const;
