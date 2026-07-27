'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, MessageSquare, RefreshCw, Search } from 'lucide-react'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

type StoredComment = {
  id: string
  name: string
  email?: string
  comment: string
  createdAt: string
  articleTitle?: string
  articleSlug?: string
}

const COMMENTS_PER_PAGE = 8
// Both key shapes have been used by the comment form over time; read either so
// nothing a visitor wrote in this browser silently disappears from this page.
const COMMENT_KEY_PREFIXES = ['slot4:article-comments:', 'editable:article-comments:']

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return 'Just now'
  }
}

const initial = (name: string) => (name.trim()[0] || 'G').toUpperCase()

const readCommentsFromStorage = (): StoredComment[] => {
  const items: StoredComment[] = []
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    const prefix = COMMENT_KEY_PREFIXES.find((candidate) => key?.startsWith(candidate))
    if (!key || !prefix) continue
    const articleSlug = key.replace(prefix, '')
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) || '[]')
      if (!Array.isArray(parsed)) continue
      for (const item of parsed) {
        if (!item || typeof item !== 'object') continue
        if (typeof item.name !== 'string' || typeof item.comment !== 'string') continue
        items.push({
          id: typeof item.id === 'string' ? item.id : `${articleSlug}-${items.length}`,
          name: item.name,
          email: typeof item.email === 'string' ? item.email : undefined,
          comment: item.comment,
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
          articleTitle: typeof item.articleTitle === 'string' ? item.articleTitle : undefined,
          articleSlug: typeof item.articleSlug === 'string' ? item.articleSlug : articleSlug,
        })
      }
    } catch {
      // Ignore corrupted local comment records.
    }
  }

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export default function CommentsPage() {
  const [comments, setComments] = useState<StoredComment[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setComments(readCommentsFromStorage())
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return comments
    return comments.filter((item) => {
      return [item.name, item.email, item.comment, item.articleTitle, item.articleSlug]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    })
  }, [comments, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / COMMENTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visibleComments = filtered.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)

  function refreshComments() {
    setComments(readCommentsFromStorage())
    setPage(1)
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]">
        <section className="eg-on-blue relative overflow-hidden bg-[var(--slot4-accent)] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(55%_70%_at_15%_0%,rgba(255,255,255,0.3),transparent_60%)]"
          />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
              <MessageSquare className="h-3.5 w-3.5" /> Saved in this browser
            </p>
            <h1 className="editable-display mt-5 text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-4xl">Your comments</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">
              Every comment you leave on a guide is stored locally on this device. Review them here, or jump straight back to the discussion.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-[var(--editable-border)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3 transition focus-within:border-[var(--slot4-accent)] sm:max-w-md">
              <Search className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                placeholder="Search your comments…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
              />
            </label>
            <div className="flex items-center gap-3">
              <p className="text-sm text-[var(--slot4-muted-text)]">
                {filtered.length} comment{filtered.length === 1 ? '' : 's'}
              </p>
              <button
                type="button"
                onClick={refreshComments}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-2.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>
          </div>

          {visibleComments.length ? (
            <div className="mt-8 grid gap-4">
              {visibleComments.map((item) => (
                <article
                  key={`${item.articleSlug}-${item.id}`}
                  className="rounded-3xl border border-[var(--editable-border)] bg-white p-6 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)] hover:shadow-[0_18px_44px_rgba(11,75,196,0.12)]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="editable-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-sm font-bold text-[var(--slot4-accent)]">
                        {initial(item.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--slot4-page-text)]">{item.name}</p>
                        <p className="mt-0.5 text-xs text-[var(--slot4-soft-muted-text)]">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                    {item.articleSlug ? (
                      <Link
                        href={`/article/${item.articleSlug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)] transition hover:gap-2.5"
                      >
                        Open guide <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                  {item.articleTitle ? <p className="mt-4 text-sm font-semibold">{item.articleTitle}</p> : null}
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--slot4-muted-text)]">{item.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-dashed border-[var(--editable-border)] bg-white p-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <MessageSquare className="h-6 w-6" />
              </span>
              <h2 className="editable-display mt-5 text-2xl font-bold">No comments yet</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">
                Leave a comment on any guide and it will show up here on this device.
              </p>
              <Link
                href="/article"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Browse guides <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {filtered.length > COMMENTS_PER_PAGE ? (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-5 text-sm font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </button>
              <span className="inline-flex h-11 items-center rounded-full bg-[var(--slot4-accent)] px-5 text-sm font-semibold text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-5 text-sm font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}
