import type { CSSProperties } from 'react'

/*
  ── Ajetmiyagi visual identity ────────────────────────────────────────────────
  A modern SaaS-directory system: crisp white surfaces, one confident royal
  blue, a soft sky-blue support tone, pale blue section bands, generous radii
  and pill-shaped actions. Every editable surface consumes these variables, so
  changing the palette here re-skins the entire site.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#ffffff',
  '--slot4-page-text': '#0c1526',
  '--slot4-panel-bg': '#eef5fd',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#4d6076',
  '--slot4-soft-muted-text': '#7b8ca3',
  '--slot4-accent': '#0b4bc4',
  '--slot4-accent-fill': '#0b4bc4',
  '--slot4-accent-soft': '#e6f0fd',
  '--slot4-accent-light': '#57a6e0',
  '--slot4-accent-deep': '#08379a',
  '--slot4-on-accent': '#ffffff',
  '--slot4-dark-bg': '#0b4bc4',
  '--slot4-dark-text': '#ffffff',
  '--slot4-ink': '#0c1526',
  '--slot4-media-bg': '#e6eef8',
  '--slot4-cream': '#ffffff',
  '--slot4-warm': '#eef5fd',
  '--slot4-lavender': '#f5f9ff',
  '--slot4-gray': '#f4f8fd',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#ffffff',
  '--editable-page-text': '#0c1526',
  '--editable-container': '1280px',
  '--editable-border': '#dfe8f5',
  '--editable-nav-bg': '#ffffff',
  '--editable-nav-text': '#0c1526',
  '--editable-nav-active': '#0b4bc4',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#0b4bc4',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#0b4bc4',
  '--editable-footer-text': '#ffffff',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentLightText: 'text-[var(--slot4-accent-light)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-light)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-accent)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  inkBg: 'bg-[var(--slot4-ink)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/20',
  shadow: 'shadow-[0_2px_14px_rgba(11,75,196,0.07)]',
  shadowStrong: 'shadow-[0_18px_50px_rgba(11,75,196,0.16)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(6,20,45,0.05),rgba(6,20,45,0.78))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-18 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[268px] shrink-0 snap-start sm:w-[300px]',
  },
  type: {
    eyebrow: 'text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-light)]',
    heroTitle: 'text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-[3.4rem]',
    sectionTitle: 'text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-4xl lg:text-[2.6rem]',
    body: 'text-base leading-[1.85]',
  },
  surface: {
    card: `rounded-3xl border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-3xl border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-3xl ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
    glass: 'rounded-3xl border border-white/25 bg-white/10 backdrop-blur-md',
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] shadow-[0_10px_26px_rgba(11,75,196,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-deep)] hover:shadow-[0_16px_34px_rgba(11,75,196,0.34)] active:translate-y-0',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]',
    ghostLight:
      'inline-flex items-center justify-center gap-2 rounded-full border border-white/45 px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--slot4-accent)]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--slot4-accent)] shadow-[0_10px_26px_rgba(6,20,45,0.18)] transition duration-300 hover:-translate-y-0.5',
  },
  media: {
    frame: `relative overflow-hidden rounded-3xl ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(11,75,196,0.18)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; every editable surface consumes those CSS variables.',
  'Keep home page structure in src/editable/sections/HomeSections.tsx so the whole home experience can be redesigned in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Reuse the card variants exported from src/editable/cards/PostCards.tsx instead of inventing one-off card markup.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
