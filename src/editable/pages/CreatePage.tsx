'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronDown, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'w-full rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]'

const labelClass = 'grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-panel-bg)] px-4 py-16 text-[var(--slot4-page-text)] sm:px-6 lg:px-8">
          <section className="mx-auto grid max-w-5xl gap-10 rounded-[2rem] border border-[var(--editable-border)] bg-white p-7 shadow-[0_24px_60px_rgba(11,75,196,0.12)] md:grid-cols-[0.85fr_1.15fr] md:p-10">
            <div className="eg-on-blue flex min-h-64 items-center justify-center rounded-3xl bg-[var(--slot4-accent)] text-white">
              <Lock className="h-20 w-20 opacity-85" />
            </div>
            <div className="self-center">
              <p className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
                {pagesContent.create.locked.badge}
              </p>
              <h1 className="editable-display mt-5 text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-4xl">
                {pagesContent.create.locked.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-deep)]"
                >
                  Login <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-7 py-3.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]">
        {/* Blue masthead keeps the workspace on-brand without a second column. */}
        <section className="eg-on-blue relative overflow-hidden bg-[var(--slot4-accent)] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(55%_70%_at_15%_0%,rgba(255,255,255,0.3),transparent_60%)]"
          />
          <div className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
              {pagesContent.create.hero.badge}
            </p>
            <h1 className="editable-display mt-5 text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-4xl">
              {pagesContent.create.hero.title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/85">{pagesContent.create.hero.description}</p>
          </div>
        </section>

        {/* Single centred column: the form is the whole page now. */}
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <form
            onSubmit={submit}
            className="rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 shadow-[0_24px_60px_rgba(11,75,196,0.12)] sm:p-9"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--editable-border)] pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent-light)]">
                  New {activeTask?.label?.toLowerCase() || 'post'}
                </p>
                <h2 className="editable-display mt-1 text-2xl font-extrabold tracking-[-0.03em]">{pagesContent.create.formTitle}</h2>
              </div>
              <span className="rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-xs font-semibold text-[var(--slot4-accent)]">
                {session.name}
              </span>
            </div>

            <div className="mt-7 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Content type
                  <span className="relative">
                    <select
                      value={task}
                      onChange={(event) => setTask(event.target.value as TaskKey)}
                      className={`${fieldClass} appearance-none pr-11`}
                    >
                      {enabledTasks.map((item) => (
                        <option key={item.key} value={item.key}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--slot4-muted-text)]" />
                  </span>
                </label>

                <label className={labelClass}>
                  Category
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="e.g. Home improvement" />
                </label>
              </div>

              <label className={labelClass}>
                Title
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Business or guide title" required />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Website or source URL
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://" />
                </label>
                <label className={labelClass}>
                  Featured image URL
                  <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://" />
                </label>
              </div>

              <label className={labelClass}>
                Short summary
                <textarea
                  className={`${fieldClass} min-h-24 leading-7`}
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="One or two lines that describe it at a glance"
                  required
                />
              </label>

              <label className={labelClass}>
                Full description
                <textarea
                  className={`${fieldClass} min-h-52 leading-7`}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Services, opening details, location notes — everything a visitor should know"
                  required
                />
              </label>
            </div>

            {created ? (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">{pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm opacity-80">{created.title}</p>
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,75,196,0.26)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-deep)]"
            >
              <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
            </button>
          </form>
        </section>
      </main>
    </EditableSiteShell>
  )
}
