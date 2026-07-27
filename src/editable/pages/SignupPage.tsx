import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

const steps = [
  'Create your account in under a minute',
  'Add your business details, photos and contact routes',
  'Publish, then update whenever anything changes',
]

export default function SignupPage() {
  const copy = pagesContent.auth.signup
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1fr] lg:px-8">
          <div className="eg-zoom eg-delay-1 order-2 rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[0_24px_60px_rgba(11,75,196,0.14)] sm:p-9 lg:order-1">
            <h1 className="editable-display text-2xl font-extrabold tracking-[-0.025em]">{copy.formTitle}</h1>
            <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Join {SITE_CONFIG.name} and get your business listed.</p>
            <EditableLocalSignupForm />
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                {copy.loginCta}
              </Link>
            </p>
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            <p className="eg-rise inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
              <Sparkles className="h-3.5 w-3.5" /> {copy.badge}
            </p>
            <h2 className="editable-display eg-rise eg-delay-1 mt-6 max-w-xl text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
              {copy.title}
            </h2>
            <p className="eg-rise eg-delay-2 mt-5 max-w-lg text-base leading-8 text-[var(--slot4-muted-text)]">{copy.description}</p>

            <ol className="eg-rise eg-delay-3 mt-8 grid gap-4">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3.5 rounded-2xl border border-[var(--editable-border)] bg-white p-4">
                  <span className="editable-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-sm font-bold text-[var(--slot4-accent)]">
                    {index + 1}
                  </span>
                  <span className="flex items-center gap-2 text-sm leading-7 text-[var(--slot4-muted-text)]">
                    <CheckCircle2 className="hidden h-4 w-4 shrink-0 text-[var(--slot4-accent)] sm:block" />
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
