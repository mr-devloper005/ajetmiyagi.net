import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Layers, Search, SearchX } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  // compactRaw only trims — it does NOT strip HTML — so the raw payload could leak markup
  // into the card summary. Route every candidate through toPlainText so cards stay plain,
  // and fall back to the article body when there's no dedicated summary/description.
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
    compactRaw(content.description) ||
    compactRaw(content.excerpt) ||
    compactRaw(content.body) ||
    '',
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  // Route from the task config (e.g. /listing/<slug>); buildPostUrl can fall
  // back to /posts for tasks missing from the enabled taskViews map, which 404s.
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const wide = index % 5 === 0

  return (
    <Link
      href={href}
      className={`group flex flex-col overflow-hidden rounded-3xl border border-[var(--editable-border)] bg-white shadow-[0_2px_14px_rgba(11,75,196,0.07)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-accent)] hover:shadow-[0_22px_50px_rgba(11,75,196,0.16)] ${
        wide ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      {image ? (
        <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${wide ? 'aspect-[16/10] md:aspect-auto md:w-[45%]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--slot4-accent)] backdrop-blur-sm">
            {taskLabel}
          </span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        {!image ? (
          <span className="w-fit rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--slot4-accent)]">
            {taskLabel}
          </span>
        ) : null}
        <h2 className="editable-display mt-3 line-clamp-2 text-xl font-bold leading-snug text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h2>
        {summary ? <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">
          Open result <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)
  const fieldClass =
    'h-12 w-full rounded-full border border-[var(--editable-border)] bg-white px-5 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]'

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="eg-on-blue relative overflow-hidden bg-[var(--slot4-accent)] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(55%_70%_at_15%_0%,rgba(255,255,255,0.3),transparent_60%),radial-gradient(45%_60%_at_85%_15%,rgba(255,255,255,0.18),transparent_65%)]"
          />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <p className="eg-rise inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
              <Search className="h-3.5 w-3.5" /> {pagesContent.search.hero.badge}
            </p>
            <h1 className="editable-display eg-rise eg-delay-1 mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
              {pagesContent.search.hero.title}
            </h1>
            <p className="eg-rise eg-delay-2 mt-5 max-w-2xl text-base leading-8 text-white/85">{pagesContent.search.hero.description}</p>

            <form action="/search" className="eg-rise eg-delay-3 mt-9 rounded-3xl bg-white p-4 shadow-[0_24px_60px_rgba(6,20,45,0.24)] sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3.5 transition focus-within:border-[var(--slot4-accent)]">
                <Search className="h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <div className="relative">
                  <Filter className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--slot4-accent)]" />
                  <input name="category" defaultValue={category} placeholder="Category" className={`${fieldClass} pl-12`} />
                </div>
                <div className="relative">
                  <Layers className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--slot4-accent)]" />
                  <select name="task" defaultValue={task} className={`${fieldClass} appearance-none pl-12`}>
                    <option value="">All content types</option>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                </div>
                <button
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--slot4-accent)] px-8 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-deep)]"
                  type="submit"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent-light)]">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              <h2 className="editable-display mt-2 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link
              href={enabledTasks[0]?.route || '/'}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-6 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
            >
              Browse latest <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-dashed border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <SearchX className="h-6 w-6" />
              </span>
              <p className="editable-display mt-5 text-2xl font-bold tracking-[-0.02em]">No matching results</p>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">
                Try a different keyword, clear the category filter, or search across all content types.
              </p>
              <Link
                href="/search"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Reset search <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
