import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness, ChevronDown, Download,
  FileText, Globe, MapPin, Phone, Search, SlidersHorizontal, UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { dedupeUrls } from '@/editable/cards/PostCards'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  // Same de-duplication as the detail pages: the API repeats one asset across
  // media/images/image/logo, which otherwise fills a card gallery with copies.
  return dedupeUrls([...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])]).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
// Reduce any content payload — rich HTML, entity-encoded HTML, or plain text — to a clean
// plain-text card summary. Two tag-strip passes (before + after entity decode) also catch
// entity-encoded markup like &lt;p&gt; so category/archive cards never show raw markup.
const stripHtml = (value: string) => value
  .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#0?39;|&apos;/gi, "'")
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-5 xl:grid-cols-2',
  classified: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

// Shared surface: hairline border, generous radius, smooth lift on hover.
const cardBase =
  'group block rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--tk-accent)] hover:shadow-[0_22px_54px_rgba(11,75,196,0.16)]'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

/** Numbered pagination with edge arrows; windows around the current page. */
function Pagination({ pagination, basePath, category }: { pagination: SiteFeedPagination; basePath: string; category: string }) {
  const page = pagination.page || 1
  const total = Math.max(1, pagination.totalPages || 1)
  if (total <= 1 && !pagination.hasNextPage && !pagination.hasPrevPage) return null

  const window = 2
  const numbers: number[] = []
  for (let i = Math.max(1, page - window); i <= Math.min(total, page + window); i += 1) numbers.push(i)

  const pill = 'inline-flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition duration-300'

  return (
    <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center justify-center gap-2.5">
      {pagination.hasPrevPage ? (
        <Link href={pageHref(basePath, category, page - 1)} className={`${pill} border border-[var(--tk-line)] text-[var(--tk-text)] hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]`}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Previous
        </Link>
      ) : null}

      {numbers[0] > 1 ? (
        <>
          <Link href={pageHref(basePath, category, 1)} className={`${pill} border border-[var(--tk-line)] text-[var(--tk-muted)] hover:border-[var(--tk-accent)]`}>1</Link>
          {numbers[0] > 2 ? <span className="px-1 text-[var(--tk-muted)]">…</span> : null}
        </>
      ) : null}

      {numbers.map((number) => (
        <Link
          key={number}
          href={pageHref(basePath, category, number)}
          aria-current={number === page ? 'page' : undefined}
          className={
            number === page
              ? `${pill} bg-[var(--tk-accent)] text-[var(--tk-on-accent)] shadow-[0_10px_24px_rgba(11,75,196,0.28)]`
              : `${pill} border border-[var(--tk-line)] text-[var(--tk-muted)] hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]`
          }
        >
          {number}
        </Link>
      ))}

      {numbers[numbers.length - 1] < total ? (
        <>
          {numbers[numbers.length - 1] < total - 1 ? <span className="px-1 text-[var(--tk-muted)]">…</span> : null}
          <Link href={pageHref(basePath, category, total)} className={`${pill} border border-[var(--tk-line)] text-[var(--tk-muted)] hover:border-[var(--tk-accent)]`}>{total}</Link>
        </>
      ) : null}

      {pagination.hasNextPage ? (
        <Link href={pageHref(basePath, category, page + 1)} className={`${pill} bg-[var(--tk-accent)] text-[var(--tk-on-accent)] shadow-[0_10px_24px_rgba(11,75,196,0.28)] hover:-translate-y-0.5`}>
          Next <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      ) : null}
    </nav>
  )
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* Blue masthead, matching the marketing bands on the home page. */}
        <header className="eg-on-blue relative overflow-hidden bg-[var(--tk-accent)] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(55%_70%_at_15%_0%,rgba(255,255,255,0.3),transparent_60%),radial-gradient(45%_60%_at_85%_15%,rgba(255,255,255,0.18),transparent_65%)]"
          />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-white/70">
              <Link href="/" className="transition hover:text-white">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white">{label}</span>
            </nav>

            <p className="eg-rise mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              {theme.kicker}
            </p>
            <h1 className="editable-display eg-rise eg-delay-1 mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
              {voice?.headline || `Browse ${label}`}
            </h1>
            <p className="eg-rise eg-delay-2 mt-5 max-w-2xl text-base leading-8 text-white/85">{voice?.description || theme.note}</p>

            {voice?.chips?.length ? (
              <div className="eg-rise eg-delay-3 mt-7 flex flex-wrap gap-2.5">
                {voice.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-white/35 bg-white/10 px-4 py-1.5 text-xs font-medium text-white">
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        {/* Sticky-feeling filter bar */}
        <div className="border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
          <div className="mx-auto flex max-w-[var(--editable-container)] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p className="text-sm text-[var(--tk-muted)]">
              <span className="font-semibold text-[var(--tk-text)]">{posts.length}</span> {posts.length === 1 ? 'result' : 'results'}
              <span className="mx-2 text-[var(--tk-line)]">|</span>
              {categoryLabel}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <form action="/search" className="flex items-center gap-2">
                <input type="hidden" name="task" value={task} />
                <label className="flex min-w-0 items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-2.5 transition focus-within:border-[var(--tk-accent)]">
                  <Search className="h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                  <input
                    name="q"
                    type="search"
                    placeholder={`Search ${label.toLowerCase()}`}
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[var(--tk-muted)] sm:w-52"
                  />
                </label>
              </form>

              <form action={basePath} className="flex items-center gap-2">
                <div className="relative">
                  <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-accent)]" />
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 appearance-none rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)] pl-11 pr-10 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                    aria-label={voice?.filterLabel || 'Filter category'}
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                </div>
                <button className="inline-flex h-11 items-center rounded-full bg-[var(--tk-accent)] px-6 text-sm font-semibold text-[var(--tk-on-accent)] transition duration-300 hover:-translate-y-0.5">
                  Apply
                </button>
              </form>
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-raised)] px-8 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                <Search className="h-6 w-6" />
              </span>
              <h2 className="editable-display mt-5 text-2xl font-bold tracking-[-0.02em]">Nothing here yet</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--tk-muted)]">
                Try another category, or check back once new {label.toLowerCase()} are published on {SITE_CONFIG.name}.
              </p>
              <Link
                href={basePath}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:-translate-y-0.5"
              >
                Reset filters <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {posts.length ? <Pagination pagination={pagination} basePath={basePath} category={category} /> : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-accent)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tk-accent)]">
      {children}
    </span>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Guide')
  return (
    <Link href={href} className={`${cardBase} flex flex-col overflow-hidden`}>
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center gap-2.5">
          <Chip>{category}</Chip>
          <span className="text-[11px] font-medium text-[var(--tk-muted)]">No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-4 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.02em] transition group-hover:text-[var(--tk-accent)]">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <CardArrow label="Read guide" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  const category = getCategory(post, 'Business')
  return (
    <Link href={href} className={`${cardBase} flex items-center gap-5 p-5 sm:p-6`}>
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-raised)] sm:h-28 sm:w-28">
        {logo ? (
          <img src={logo} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <BriefcaseBusiness className="h-9 w-9 text-[var(--tk-muted)]" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Chip>{category}</Chip>
        <h2 className="editable-display mt-2.5 truncate text-xl font-bold tracking-[-0.02em] transition group-hover:text-[var(--tk-accent)]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[var(--tk-muted)]">
          {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}</span> : null}
          {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}</span> : null}
          {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {cleanDomain(website)}</span> : null}
        </div>
      </div>
      <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)] transition duration-500 group-hover:bg-[var(--tk-accent)] group-hover:text-white sm:flex">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-3xl font-extrabold tracking-[-0.03em] text-[var(--tk-accent)]">{price || 'Open offer'}</span>
        {condition ? <Chip>{condition}</Chip> : null}
      </div>
      <h2 className="editable-display mt-5 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.02em] transition group-hover:text-[var(--tk-accent)]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-xs font-medium text-[var(--tk-muted)]">
        <span className="inline-flex items-center gap-1.5">{location ? <><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}</> : 'Details inside'}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_54px_rgba(11,75,196,0.18)]">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(6,20,45,0.86))] opacity-85 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-lg font-bold leading-snug tracking-[-0.02em] text-white">{post.title}</h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
            View image <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-4 p-6`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)] transition duration-500 group-hover:bg-[var(--tk-accent)] group-hover:text-white">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--tk-muted)]">Saved · {String(index + 1).padStart(2, '0')}</span>
        <h2 className="editable-display mt-1.5 line-clamp-2 text-lg font-bold leading-snug tracking-[-0.02em] transition group-hover:text-[var(--tk-accent)]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        {website ? <p className="mt-3 truncate text-xs font-semibold text-[var(--tk-accent)]">{cleanDomain(website)}</p> : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Document')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)] transition duration-500 group-hover:bg-[var(--tk-accent)] group-hover:text-white">
          <FileText className="h-6 w-6" />
        </div>
        <Chip>{category}</Chip>
      </div>
      <h2 className="editable-display mt-6 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.02em] transition group-hover:text-[var(--tk-accent)]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-accent)]">
        Open document <Download className="h-4 w-4" />
      </span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" loading="lazy" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-5 text-lg font-bold tracking-[-0.02em] transition group-hover:text-[var(--tk-accent)]">{post.title}</h2>
      {role ? <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tk-accent-light)]">{role}</p> : null}
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
