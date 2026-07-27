import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Business directory',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Business directory',
    primaryLinks: [
      { label: 'Home', href: '/' },
      { label: 'Listings', href: '/listing' },
      { label: 'Guides', href: '/article' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'List your business', href: '/create' },
      secondary: { label: 'Contact us', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Verified businesses, practical guides',
    description:
      'A business directory built for real decisions — detailed listings, honest guides, and direct contact routes to the people behind each business.',
    newsletter: {
      title: 'Stay in the loop',
      description: 'Get new listings and practical guides in your inbox. No noise, unsubscribe anytime.',
      placeholder: 'Your email here…',
      buttonLabel: 'Join',
      consent: 'By subscribing you agree to receive occasional updates from us.',
    },
    columns: [
      {
        title: 'Quick links',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Listings', href: '/listing' },
          { label: 'Guides', href: '/article' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About us', href: '/about' },
          { label: 'Contact us', href: '/contact' },
          { label: 'Comments', href: '/comments' },
        ],
      },
    ],
    social: [
      { label: 'Facebook', href: '/contact' },
      { label: 'Instagram', href: '/contact' },
      { label: 'LinkedIn', href: '/contact' },
      { label: 'YouTube', href: '/contact' },
    ],
    bottomNote: 'Built for clear discovery and businesses worth finding.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
