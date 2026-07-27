import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Guides and insights',
    headline: 'Practical guides for choosing, comparing and hiring.',
    description:
      'Long-form articles that explain the trade-offs — what to check before you commit, which details matter, and how to compare providers without guesswork.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Written to be useful before a decision, not after it.',
    chips: ['Buying guides', 'Comparisons', 'How-to'],
  },
  classified: {
    eyebrow: 'Marketplace',
    headline: 'Live offers from the local business community.',
    description:
      'Equipment, services and short-term opportunities posted by businesses in the directory. Quick to scan, quick to act on.',
    filterLabel: 'Filter offers',
    secondaryNote: 'Time-sensitive listings move fast — check the date before you call.',
    chips: ['Live offers', 'Equipment', 'Services'],
  },
  sbm: {
    eyebrow: 'Toolkit',
    headline: 'Bookmarked tools and references worth keeping.',
    description:
      'A curated shelf of links, calculators, registries and reference material that owners actually use when running a business.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Every link is checked before it earns a place here.',
    chips: ['Tools', 'References', 'Registries'],
  },
  profile: {
    eyebrow: 'People behind the business',
    headline: 'The owners, specialists and teams you will actually speak to.',
    description:
      'Profiles that put names, roles and credentials up front, so you know who is answering before you make contact.',
    filterLabel: 'Filter profiles',
    secondaryNote: 'Identity and credentials come before the grid.',
    chips: ['Owners', 'Specialists', 'Teams'],
  },
  pdf: {
    eyebrow: 'Resource library',
    headline: 'Checklists, templates and reports you can download.',
    description:
      'Practical documents to take away — supplier checklists, pricing templates, and reports that back up the guides.',
    filterLabel: 'Filter documents',
    secondaryNote: 'Every file opens in your browser or downloads in one click.',
    chips: ['Checklists', 'Templates', 'Reports'],
  },
  listing: {
    eyebrow: 'Business directory',
    headline: 'Verified businesses, built for comparison.',
    description:
      'Browse local businesses with the details that matter — location, contact routes, categories and services — all in one consistent format.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Compare on location, services and contact routes before you call.',
    chips: ['Verified details', 'Direct contact', 'Compare easily'],
  },
  image: {
    eyebrow: 'Showcase',
    headline: 'See the storefronts, workspaces and finished work.',
    description:
      'A gallery-first view of the businesses in the directory — premises, projects and portfolios, before you visit in person.',
    filterLabel: 'Filter gallery',
    secondaryNote: 'Images first; the details follow on each profile.',
    chips: ['Storefronts', 'Projects', 'Portfolios'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
