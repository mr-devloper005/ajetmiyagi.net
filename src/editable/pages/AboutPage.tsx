import Link from 'next/link'
import { ArrowRight, Compass, Layers, ShieldCheck } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const valueIcon = [ShieldCheck, Layers, Compass]

export default function AboutPage() {
  const about = pagesContent.about
  const tasks = SITE_CONFIG.tasks.filter((task) => task.enabled)

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
              {about.badge}
            </p>
            <h1 className="editable-display eg-rise eg-delay-1 mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
              {about.title}
            </h1>
            <p className="eg-rise eg-delay-2 mt-5 max-w-2xl text-base leading-8 text-white/85">{about.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="min-w-0">
              <h2 className="editable-display text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">About {SITE_CONFIG.name}</h2>
              <div className="mt-6 space-y-5">
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-[var(--slot4-muted-text)]">{paragraph}</p>
                ))}
              </div>

              {tasks.length ? (
                <div className="mt-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent-light)]">What you will find here</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {tasks.map((task) => (
                      <Link
                        key={task.key}
                        href={task.route}
                        className="group rounded-2xl border border-[var(--editable-border)] bg-white p-5 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)] hover:shadow-[0_18px_40px_rgba(11,75,196,0.14)]"
                      >
                        <h3 className="editable-display text-lg font-bold transition group-hover:text-[var(--slot4-accent)]">{task.label}</h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{task.description}</p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)]">
                          Explore <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>

            <aside className="space-y-5">
              {about.values.map((value, index) => {
                const Icon = valueIcon[index % valueIcon.length]
                return (
                  <div
                    key={value.title}
                    className="rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-7 transition duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_44px_rgba(11,75,196,0.12)]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="editable-display mt-5 text-xl font-bold">{value.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                  </div>
                )
              })}

              <div className="eg-on-blue rounded-3xl bg-[var(--slot4-accent)] p-7 text-white shadow-[0_20px_50px_rgba(11,75,196,0.24)]">
                <h2 className="editable-display text-xl font-bold">Ready to be listed?</h2>
                <p className="mt-3 text-sm leading-7 text-white/85">
                  Add your business and keep the details current — it takes a few minutes.
                </p>
                <Link
                  href="/create"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--slot4-accent)] transition duration-300 hover:-translate-y-0.5"
                >
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
