import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

const perks = [
  'Update your listing details whenever they change',
  'Publish guides that link back to your profile',
  'Keep contact routes accurate across the directory',
]

export default function LoginPage() {
  const copy = pagesContent.auth.login
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="min-w-0">
            <p className="eg-rise inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
              <ShieldCheck className="h-3.5 w-3.5" /> {copy.badge}
            </p>
            <h1 className="editable-display eg-rise eg-delay-1 mt-6 max-w-xl text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
              {copy.title}
            </h1>
            <p className="eg-rise eg-delay-2 mt-5 max-w-lg text-base leading-8 text-[var(--slot4-muted-text)]">{copy.description}</p>

            <ul className="eg-rise eg-delay-3 mt-8 grid gap-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-sm leading-7 text-[var(--slot4-muted-text)]">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="eg-zoom eg-delay-2 rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[0_24px_60px_rgba(11,75,196,0.14)] sm:p-9">
            <h2 className="editable-display text-2xl font-extrabold tracking-[-0.025em]">{copy.formTitle}</h2>
            <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Access your {SITE_CONFIG.name} workspace.</p>
            <EditableLocalLoginForm />
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
              New here?{' '}
              <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                {copy.createCta}
              </Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
