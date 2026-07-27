import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Task surfaces.

  Every task (archive + detail) shares one cohesive identity: white surfaces,
  pale blue section bands, the signature royal blue accent, soft hairline
  borders and the Poppins/DM Sans pairing. Per-task copy (kicker / note) still
  varies so each section keeps a little voice, but the visual language is
  unified. Tokens are delivered via CSS variables (`--tk-*`).
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  accentLight: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Poppins', 'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif"
const BODY_FONT = "'DM Sans', 'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif"

// Shared palette — every task inherits this; only kicker/note differ.
const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#ffffff',
  surface: '#ffffff',
  raised: '#eef5fd',
  text: '#0c1526',
  muted: '#4d6076',
  line: '#dfe8f5',
  accent: '#0b4bc4',
  accentSoft: '#e6f0fd',
  accentLight: '#57a6e0',
  onAccent: '#ffffff',
  glow: 'rgba(11,75,196,0.10)',
  radius: '1.5rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Insights', note: 'Practical guides and research for owners choosing where to list and how to grow.' },
  listing: { ...base, kicker: 'Directory', note: 'Verified businesses with the details that actually help people decide.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Live offers, equipment and services posted by the local business community.' },
  image: { ...base, kicker: 'Showcase', note: 'Storefronts, workspaces and projects, seen before you visit.' },
  sbm: { ...base, kicker: 'Toolkit', note: 'Handpicked links, tools and references worth keeping close.' },
  pdf: { ...base, kicker: 'Resources', note: 'Downloadable checklists, templates and reports for growing teams.' },
  profile: { ...base, kicker: 'People', note: 'The owners, specialists and teams behind the businesses you find here.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-accent-light': t.accentLight,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    // Re-point the shared article-body accent vars so post HTML (headings,
    // links) inherits this task's accent instead of the global site accent.
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
