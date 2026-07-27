import Link from 'next/link'
import { ArrowRight, ArrowUpRight, ImageIcon, MapPin, Tag } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

// The posting API repeats the same asset across `media[]`, `content.images[]`,
// `content.image`, `content.featuredImage` and `content.logo`. Any surface that
// collects several of those fields must de-duplicate, otherwise one picture is
// rendered as a gallery of identical copies (profile logos shown five times,
// image posts shown four times).
export function dedupeUrls(urls: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      urls
        .map((url) => (typeof url === 'string' ? url.trim() : ''))
        .filter((url) => url.length > 0),
    ),
  )
}

export const POST_IMAGE_FALLBACK = '/placeholder.svg?height=900&width=1400'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || POST_IMAGE_FALLBACK
}

/** True when the post has no real artwork and we are falling back to the placeholder. */
export function hasRealImage(post?: SitePost | null) {
  return getEditablePostImage(post) !== POST_IMAGE_FALLBACK
}

// Reduce any content payload — rich HTML, entity-encoded HTML, or already-plain text — to
// a clean plain-text card summary. Card excerpts must never show raw markup regardless of
// what the content API sends. Two tag-strip passes (before + after entity decode) also catch
// entity-encoded markup like &lt;p&gt;.
export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
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
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

/** First non-empty value across a set of content keys — used for location/meta rows. */
export function getEditableField(post: SitePost | null | undefined, keys: string[]) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  for (const key of keys) {
    const value = content[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* ── Shared atoms ─────────────────────────────────────────────────────────── */

export function PostBadge({ children, tone = 'soft' }: { children: React.ReactNode; tone?: 'soft' | 'solid' | 'glass' }) {
  const tones = {
    soft: 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]',
    solid: 'bg-[var(--slot4-accent)] text-white',
    glass: 'bg-white/90 text-[var(--slot4-accent)] backdrop-blur-sm',
  } as const
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${tones[tone]}`}>
      {children}
    </span>
  )
}

function CardImage({ post, className = '' }: { post: SitePost; className?: string }) {
  return (
    <img
      src={getEditablePostImage(post)}
      alt={post.title || ''}
      loading="lazy"
      className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.06] ${className}`}
    />
  )
}

function MetaRow({ post }: { post: SitePost }) {
  const location = getEditableField(post, ['location', 'address', 'city'])
  const category = getEditableCategory(post)
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-[var(--slot4-soft-muted-text)]">
      {category ? (
        <span className="inline-flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-[var(--slot4-accent-light)]" /> {category}
        </span>
      ) : null}
      {location ? (
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[var(--slot4-accent-light)]" /> {location}
        </span>
      ) : null}
    </div>
  )
}

/* ── Card variants ────────────────────────────────────────────────────────── */

/** Full-bleed hero card: large image, dark scrim, headline over the artwork. */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden rounded-3xl ${pal.shadowStrong} ${dc.motion.lift}`}>
      <div className="relative min-h-[420px] p-7 sm:min-h-[500px] sm:p-9 lg:min-h-[560px]">
        <CardImage post={post} className="absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,20,45,0.15)_0%,rgba(6,20,45,0.55)_55%,rgba(6,20,45,0.92)_100%)]" />
        <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-end sm:min-h-[440px] lg:min-h-[500px]">
          <PostBadge tone="glass">{label}</PostBadge>
          <h3 className="editable-display mt-5 max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">{getEditableExcerpt(post, 180)}</p>
          <span className={`mt-7 w-fit ${dc.button.accent}`}>
            Read more <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/** Compact vertical card used inside horizontal rails and auto-scrolling tracks. */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        <CardImage post={post} />
        <span className="absolute left-4 top-4">
          <PostBadge tone="glass">No. {String(index + 1).padStart(2, '0')}</PostBadge>
        </span>
      </div>
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent-light)]">{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-2.5 line-clamp-2 text-lg font-bold leading-snug text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h3>
        <p className={`mt-2.5 line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 110)}</p>
      </div>
    </Link>
  )
}

/** Numbered list row — dense index of posts without artwork. */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 rounded-2xl border ${pal.border} ${pal.surfaceBg} p-5 transition duration-400 hover:border-[var(--slot4-accent)] hover:shadow-[0_14px_36px_rgba(11,75,196,0.12)]`}>
      <div className="flex items-start gap-4">
        <span className="editable-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-sm font-bold text-[var(--slot4-accent)] transition group-hover:bg-[var(--slot4-accent)] group-hover:text-white">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent-light)]">{getEditableCategory(post)}</p>
          <h3 className="editable-display mt-1.5 line-clamp-2 text-base font-bold leading-snug text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">
            {post.title}
          </h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 100)}</p>
        </div>
      </div>
    </Link>
  )
}

/** Horizontal split card: media left, copy right. Ideal for article archives. */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-0 overflow-hidden ${dc.surface.card} ${dc.motion.lift} sm:grid-cols-[260px_minmax(0,1fr)]`}
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-[var(--slot4-media-bg)] sm:aspect-auto sm:min-h-[220px]">
        <CardImage post={post} />
      </div>
      <div className="min-w-0 p-6 sm:p-8">
        <PostBadge>{getEditableCategory(post)}</PostBadge>
        <h2 className="editable-display mt-4 line-clamp-2 text-xl font-bold leading-snug text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)] sm:text-2xl">
          {post.title}
        </h2>
        <p className={`mt-3 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>{getEditableExcerpt(post, 190)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">
          Read more
          <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
        </span>
        <span className="sr-only">Result {index + 1}</span>
      </div>
    </Link>
  )
}

/** Standard grid card — the workhorse for listing and category grids. */
export function StandardPostCard({ post, href, label }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group flex min-w-0 flex-col overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        <CardImage post={post} />
        <span className="absolute left-4 top-4">
          <PostBadge tone="glass">{label || getEditableCategory(post)}</PostBadge>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="editable-display line-clamp-2 text-lg font-bold leading-snug text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-3 flex-1 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 130)}</p>
        <MetaRow post={post} />
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">
          View details
          <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}

/** Wide horizontal row with a square thumbnail — good for directory results. */
export function HorizontalPostCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link
      href={href}
      className={`group flex min-w-0 items-center gap-5 rounded-3xl border ${pal.border} ${pal.surfaceBg} p-4 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)] hover:shadow-[0_18px_44px_rgba(11,75,196,0.14)] sm:p-5`}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[var(--slot4-media-bg)] sm:h-28 sm:w-28">
        <CardImage post={post} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent-light)]">{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-1.5 truncate text-lg font-bold leading-snug text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h3>
        <p className={`mt-1.5 line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 120)}</p>
        <MetaRow post={post} />
      </div>
      <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)] transition group-hover:bg-[var(--slot4-accent)] group-hover:text-white sm:flex">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

/** Image-first tile: artwork carries the card, copy sits over the gradient. */
export function ImageFirstCard({ post, href, tall = false }: { post: SitePost; href: string; tall?: boolean }) {
  return (
    <Link href={href} className={`group relative block overflow-hidden rounded-3xl ${pal.shadow} ${dc.motion.lift}`}>
      <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <CardImage post={post} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(6,20,45,0.86)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <PostBadge tone="glass">{getEditableCategory(post)}</PostBadge>
          <h3 className="editable-display mt-3 line-clamp-2 text-lg font-bold leading-snug text-white">{post.title}</h3>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-white/85">
            View <ArrowUpRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/** Text-led editorial card with a rule and oversized index, no artwork needed. */
export function EditorialTextCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border ${pal.border} ${pal.panelBg} p-7 transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-accent)] hover:bg-white hover:shadow-[0_20px_46px_rgba(11,75,196,0.14)]`}
    >
      <span className="editable-display pointer-events-none absolute -right-2 -top-4 text-7xl font-extrabold text-[var(--slot4-accent)]/[0.07]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <PostBadge>{getEditableCategory(post)}</PostBadge>
      <h3 className="editable-display mt-4 line-clamp-3 text-xl font-bold leading-snug text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">
        {post.title}
      </h3>
      <p className={`mt-3 line-clamp-4 flex-1 text-sm leading-7 ${pal.mutedText}`}>{getEditableExcerpt(post, 175)}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">
        Continue reading
        <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

/** Minimal media-free fallback used when a feed has no artwork at all. */
export function QuietPostCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link
      href={href}
      className={`group flex min-w-0 items-start gap-4 rounded-2xl border ${pal.border} ${pal.surfaceBg} p-5 transition duration-400 hover:border-[var(--slot4-accent)] hover:shadow-[0_14px_36px_rgba(11,75,196,0.12)]`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
        <ImageIcon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="editable-display block line-clamp-2 text-base font-bold leading-snug text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </span>
        <span className={`mt-1.5 block line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 100)}</span>
      </span>
    </Link>
  )
}
