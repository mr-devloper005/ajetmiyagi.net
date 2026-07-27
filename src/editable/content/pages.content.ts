import { slot4BrandConfig } from '@/editable/theme/brand.config'

const siteName = slot4BrandConfig.siteName

export const pagesContent = {
  home: {
    metadata: {
      title: 'Find, compare and connect with local businesses',
      description:
        'Browse verified business listings, read practical guides, and connect directly with the services you need — all in one clean directory.',
      openGraphTitle: 'Find, compare and connect with local businesses',
      openGraphDescription:
        'A business directory built for real decisions: verified details, honest guides, and a browsing experience that respects your time.',
      keywords: ['business directory', 'local business listings', 'find services', 'company profiles', 'business guides'],
    },
    hero: {
      badge: 'Business directory',
      title: ['How can one directory', 'work for every business, if', 'every business is different?'],
      description:
        'Our goal is to give every business a listing that actually reflects how it works — and give visitors a faster, clearer way to find it.',
      primaryCta: { label: 'Browse the directory', href: '/listing' },
      secondaryCta: { label: 'Read the guides', href: '/article' },
      searchPlaceholder: 'Search businesses, services, categories…',
      focusLabel: 'Popular right now',
      featureCardBadge: 'Live from the directory',
      featureCardTitle: 'Every listing you publish shapes what visitors see first.',
      featureCardDescription:
        'The newest businesses and guides move to the front automatically, so the directory always shows what is current.',
    },
    why: {
      eyebrow: 'Why choose us for your business listing?',
      title: 'Which directory is the right one for you?',
      description:
        'After more than a decade of building discovery tools, one thing is clear: no two businesses need the same profile. A studio, a contractor and a clinic all sell differently — so they should be listed differently.',
      caption: 'A live look at how a complete business profile appears to visitors.',
    },
    steps: {
      title: 'How does it work?',
      description: 'Four straightforward steps between an empty page and a business profile people can actually find.',
      items: [
        {
          label: 'Step 01',
          title: 'Tell us about the business',
          description: 'Share what you do, where you operate, and who you want to reach. No long forms, no jargon.',
        },
        {
          label: 'Step 02',
          title: 'We build the profile',
          description: 'Details, photos, categories and contact routes are arranged into a listing built around how you actually work.',
        },
        {
          label: 'Step 03',
          title: 'Go live and stay current',
          description: 'Your listing publishes immediately and can be updated whenever hours, services or contact details change.',
        },
        {
          label: 'Step 04',
          title: 'Keep the traffic coming',
          description: 'Guides, related listings and category pages keep pointing people back to your profile long after launch.',
        },
      ],
    },
    story: {
      eyebrow: 'Our story',
      title: 'Our story',
      paragraphs: [
        `${siteName} started with a simple frustration: finding a trustworthy local business took far too many tabs. Directories were either thin listings with no substance, or walls of adverts hiding the details that mattered.`,
        'So we built the directory we wanted to use — one where a business profile carries real information, where guides explain the trade-offs, and where nothing gets in the way of contacting someone directly.',
      ],
      cta: { label: 'Explore listings', href: '/listing' },
    },
    offer: {
      eyebrow: 'What we offer',
      title: 'What we offer',
      paragraphs: [
        'We offer a tailored approach to publishing your business. Rather than forcing every company into the same template, the profile adapts to what you actually sell — services, locations, opening hours, portfolios or documents.',
        'Alongside the directory, our guides cover the practical side of being found: choosing categories, writing a description that converts, and keeping details accurate across the year.',
      ],
      cta: { label: 'Read the guides', href: '/article' },
    },
    features: {
      eyebrow: `Why people choose ${siteName}`,
      title: `${siteName} features`,
      items: [
        {
          title: 'Business profiles with real detail',
          description:
            'Location, contact routes, categories, opening context and photos in one place — everything a visitor needs before picking up the phone.',
        },
        {
          title: 'Search and category filters that work',
          description:
            'Narrow by category or keyword and get straight to relevant results. No endless scrolling through unrelated entries.',
        },
        {
          title: 'Guides written for decisions',
          description:
            'Practical articles that explain how to compare providers, what questions to ask, and which details are worth checking first.',
        },
        {
          title: 'Built to be found',
          description:
            'Clean structure, fast pages and connected sections mean listings stay discoverable in search long after they go live.',
        },
      ],
    },
    intro: {
      badge: 'About the platform',
      title: 'Built for finding, comparing, and contacting businesses without friction.',
      paragraphs: [
        'This site brings business listings and practical guides together, so visitors can move naturally from research to a shortlist to a phone call.',
        'Instead of scattering profiles, categories, and advice across disconnected pages, everything stays linked with consistent navigation and clear next steps.',
        'Whether someone starts with a category, a search, or an article, they can keep discovering related businesses without losing their place.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Verified listing details with direct contact routes.',
        'Category and keyword filtering across the whole directory.',
        'Guides that connect back to the businesses they discuss.',
        'Fast, lightweight pages that stay readable on any device.',
      ],
      primaryLink: { label: 'Browse listings', href: '/listing' },
      secondaryLink: { label: 'Read guides', href: '/article' },
    },
    benefits: {
      title: 'What a listing here gives you',
      description: 'The practical reasons owners keep their profile current on the directory.',
      items: [
        {
          title: 'Enquiries with context',
          description: 'Visitors arrive having already read your services, location and hours, so the first conversation starts further along.',
        },
        {
          title: 'Details you control',
          description: 'Opening hours, service areas and contact routes are yours to update the moment anything changes.',
        },
        {
          title: 'Category traffic that lasts',
          description: 'Category and search pages keep pointing people to your profile long after it first goes live.',
        },
        {
          title: 'Guides that do the explaining',
          description: 'Our articles answer the common questions up front, so you spend less time repeating the basics.',
        },
        {
          title: 'One clear contact route',
          description: 'Phone, email and website sit together at the top of the profile — no hunting, no dead links.',
        },
        {
          title: 'Fast on every device',
          description: 'Lightweight pages that load quickly, whether someone is at a desk or standing outside your door.',
        },
      ],
    },
    cta: {
      badge: 'Get listed',
      title: 'Want your business listed? Let us get you started.',
      description: 'Add your business, keep the details current, and reach people who are already searching for what you offer.',
      primaryCta: { label: 'List your business', href: '/create' },
      secondaryCta: { label: 'Talk to us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'Our story',
    title: 'A clearer way to find the businesses you need.',
    description: `${siteName} is built so business listings, categories, and practical guides work as one connected directory instead of scattered pages.`,
    paragraphs: [
      'We started because finding a reliable local business took far too long. Listings were thin, contact details were stale, and the useful context was buried under adverts.',
      'Today the directory pairs detailed business profiles with guides that explain how to compare providers — so visitors arrive informed and owners get better enquiries.',
      'Whether someone starts with a category, a search, or an article, they can keep exploring related businesses without losing context.',
    ],
    values: [
      {
        title: 'Accuracy before volume',
        description: 'A smaller directory with correct details beats a huge one full of dead numbers and closed doors.',
      },
      {
        title: 'Connected discovery',
        description: 'Listings, categories, and guides link to each other, so one useful page always leads to the next.',
      },
      {
        title: 'Clear and unhurried',
        description: 'Clean navigation, readable pages, and no interruptions between a visitor and the business they came for.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${siteName}`,
    title: 'Tell us what you need listed, fixed, or found.',
    description:
      'Whether you are adding a business, correcting a detail, or looking for something the directory does not cover yet, send it over and we will route it to the right place.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search businesses, categories, guides, and resources across the directory.',
    },
    hero: {
      badge: 'Search the directory',
      title: 'Find businesses, categories and guides faster.',
      description: 'Search by keyword, filter by category, or narrow to a single content type to get straight to what you need.',
      placeholder: 'Search by business name, service, category or keyword',
    },
    resultsTitle: 'Latest from the directory',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Add a business listing or publish a guide on the directory.',
    },
    locked: {
      badge: 'Member access',
      title: 'Sign in to add your business.',
      description: 'Use your account to open the publishing workspace and create listings or guides for the directory.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Add a business or publish a guide.',
      description: 'Choose what you are publishing, add the details, and prepare a clean profile with images, links, summary and full description.',
    },
    formTitle: 'Publication details',
    submitLabel: 'Submit for publishing',
    successTitle: 'Saved. Your draft is ready for review.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to manage your business listings and guides.',
      badge: 'Member access',
      title: 'Welcome back to your business workspace.',
      description: 'Sign in to update listings, manage submissions, and publish new guides from your account.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create an account first, then sign in.',
      success: 'Signed in. Taking you to the directory…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account to list your business on the directory.',
      badge: 'Get listed',
      title: 'Create your account and add your business.',
      description: 'An account gives you the publishing workspace, saved details, and the ability to keep your listing current.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Taking you to the directory…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related guides',
      fallbackTitle: 'Guide details',
    },
    listing: {
      relatedTitle: 'Similar businesses',
      fallbackTitle: 'Business details',
    },
    image: {
      relatedTitle: 'More from the showcase',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested guides',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
