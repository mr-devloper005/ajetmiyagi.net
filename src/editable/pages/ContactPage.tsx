'use client'

import { Building2, Clock, FileText, Image as ImageIcon, Mail, MapPin, MessageSquare, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { SITE_CONFIG } from '@/lib/site-config'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Add or claim a listing', body: 'Send your business details and we will get the profile live with the right categories and contact routes.' },
      { icon: MapPin, title: 'Correct a detail', body: 'Moved, changed hours, or a number out of date? Tell us what needs fixing and we will update it.' },
      { icon: MessageSquare, title: 'Everything else', body: 'Partnerships, coverage requests, or a question the directory does not answer yet — send it over.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Pitch a guide', body: 'Suggest a topic or send a draft. We publish guides that help people make a clearer decision.' },
      { icon: Mail, title: 'Corrections', body: 'Spotted something out of date in an article? Point us at it and we will review and revise.' },
      { icon: MessageSquare, title: 'General enquiries', body: 'Anything else about the publication, our sources, or how we work.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Submit photos', body: 'Share storefront, workspace or project images to add to your business showcase.' },
      { icon: Mail, title: 'Usage and rights', body: 'Questions about how images are displayed, credited, or removed.' },
      { icon: MessageSquare, title: 'General enquiries', body: 'Anything else about the showcase or your gallery.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Suggest a resource', body: 'Know a tool or reference that belongs in the library? Send the link and why it is useful.' },
    { icon: Mail, title: 'Report a broken link', body: 'Resources move and disappear. Flag anything that no longer works and we will replace it.' },
    { icon: MessageSquare, title: 'General enquiries', body: 'Anything else about the collections or how we curate them.' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)
  const copy = pagesContent.contact

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="eg-on-blue relative overflow-hidden bg-[var(--slot4-accent)] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(55%_70%_at_15%_0%,rgba(255,255,255,0.3),transparent_60%),radial-gradient(45%_60%_at_85%_15%,rgba(255,255,255,0.18),transparent_65%)]"
          />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <p className="eg-rise inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
              {copy.eyebrow}
            </p>
            <h1 className="editable-display eg-rise eg-delay-1 mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
              {copy.title}
            </h1>
            <p className="eg-rise eg-delay-2 mt-5 max-w-2xl text-base leading-8 text-white/85">{copy.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="min-w-0">
              <h2 className="editable-display text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">How can we help?</h2>
              <p className="mt-4 max-w-lg text-base leading-8 text-[var(--slot4-muted-text)]">
                Pick the lane that fits your message and we will route it to the right place.
              </p>

              <div className="mt-8 space-y-4">
                {lanes.map((lane) => (
                  <div
                    key={lane.title}
                    className="group flex items-start gap-4 rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)] hover:bg-white hover:shadow-[0_18px_44px_rgba(11,75,196,0.12)]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)] transition duration-500 group-hover:bg-[var(--slot4-accent)] group-hover:text-white">
                      <lane.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="editable-display text-lg font-bold">{lane.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{lane.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--editable-border)] bg-white p-5">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent-light)]">
                    <Clock className="h-4 w-4" /> Response time
                  </span>
                  <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">
                    Most messages get a reply within two working days.
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--editable-border)] bg-white p-5">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent-light)]">
                    <MapPin className="h-4 w-4" /> Coverage
                  </span>
                  <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">
                    {SITE_CONFIG.name} lists businesses across every category we support.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[0_24px_60px_rgba(11,75,196,0.12)] sm:p-9">
              <h2 className="editable-display text-2xl font-extrabold tracking-[-0.025em]">{copy.formTitle}</h2>
              <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Fill in the details and we will come back to you.</p>
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
