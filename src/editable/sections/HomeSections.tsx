import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Bookmark, Building2, CheckCircle2, ClipboardList,
  Compass, FileText, Image as ImageIcon, Layers, MapPin, Megaphone, MousePointerClick,
  Search, ShieldCheck, Sparkles, UserRound, Zap,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import {
  EditorialFeatureCard, EditorialTextCard, HorizontalPostCard, ImageFirstCard,
  RailPostCard, StandardPostCard, getEditableExcerpt, getEditablePostImage, hasRealImage, postHref,
} from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: FileText,
  profile: UserRound,
}

const stepIcon = [Compass, ClipboardList, Zap, ShieldCheck]
const benefitIcon = [Sparkles, MousePointerClick, Layers, FileText, MapPin, Zap]

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

// Merge every available feed and drop repeats so the home page always has
// enough material even when one source returns empty for this site.
function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function pool({ posts, timeSections }: Pick<HomeSectionProps, 'posts' | 'timeSections'>) {
  return dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
}

// Latest posts' real images (newest first, deduped, placeholders dropped).
function latestPostImages(posts: SitePost[], max = 8) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    if (!hasRealImage(post)) continue
    const img = getEditablePostImage(post)
    if (seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

/* ── Decorative pieces ────────────────────────────────────────────────────── */

/** Dotted grid + route lines: an abstract "coverage map" behind the blue bands. */
function MapBackdrop({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <pattern id="eg-dots" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="currentColor" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="1200" height="520" fill="url(#eg-dots)" opacity="0.5" />
      <g fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.55" strokeDasharray="7 9">
        <path d="M90 400 C 300 300, 420 470, 640 330 S 980 190, 1130 250" />
        <path d="M60 180 C 260 90, 470 240, 700 150 S 1020 60, 1160 130" />
      </g>
      <g fill="currentColor" opacity="0.8">
        {[
          [90, 400],
          [640, 330],
          [1130, 250],
          [60, 180],
          [700, 150],
          [1160, 130],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />
        ))}
      </g>
    </svg>
  )
}

/** Layered wave that carries the white hero down into the blue band. */
function WaveDivider() {
  return (
    <div aria-hidden="true" className="relative -mb-px block w-full overflow-hidden leading-[0]">
      <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="block h-[70px] w-full sm:h-[100px] lg:h-[130px]">
        <path fill="var(--slot4-accent)" fillOpacity="0.16" d="M0,58 C240,124 470,6 720,44 C960,80 1200,126 1440,68 L1440,150 L0,150 Z" />
        <path fill="var(--slot4-accent)" fillOpacity="0.34" d="M0,86 C260,146 520,32 780,66 C1020,98 1250,138 1440,94 L1440,150 L0,150 Z" />
        <path fill="var(--slot4-accent)" d="M0,112 C280,156 560,64 840,92 C1080,116 1270,146 1440,120 L1440,150 L0,150 Z" />
      </svg>
    </div>
  )
}

/** Browser-chrome frame used for the hero and showcase mockups. */
function DeviceFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[1.75rem] border border-white/25 bg-[#0d1a30] shadow-[0_36px_90px_rgba(6,20,45,0.42)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.06] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 hidden h-5 flex-1 items-center rounded-full bg-white/10 px-3 text-[10px] font-medium text-white/60 sm:flex">
          {SITE_CONFIG.domain}
        </span>
      </div>
      {children}
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'left'
  light?: boolean
}) {
  const alignment = align === 'center' ? 'mx-auto text-center' : 'text-left'
  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow ? (
        <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${light ? 'text-white/75' : 'text-[var(--slot4-accent-light)]'}`}>{eyebrow}</p>
      ) : null}
      <h2
        className={`editable-display mt-3 text-3xl font-extrabold leading-[1.14] tracking-[-0.03em] sm:text-4xl lg:text-[2.6rem] ${
          light ? 'text-white' : 'text-[var(--slot4-page-text)]'
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 text-base leading-8 ${light ? 'text-white/80' : 'text-[var(--slot4-muted-text)]'} ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      ) : null}
    </div>
  )
}

/* ── 1. Hero ──────────────────────────────────────────────────────────────── */

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const all = pool({ posts, timeSections })
  const heroImages = latestPostImages(all)
  const hero = pagesContent.home.hero
  const spotlight = all[0]
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled).slice(0, 6)

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
      {/* Soft blue glow behind the artwork side. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-[var(--slot4-accent)]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-40 h-[380px] w-[380px] rounded-full bg-[var(--slot4-accent-light)]/10 blur-3xl"
      />

      <div className={`relative grid items-center gap-12 py-14 sm:py-18 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24 ${container}`}>
        <div className="min-w-0">
          <p className="eg-rise inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
            <Sparkles className="h-3.5 w-3.5" /> {hero.badge}
          </p>

          <h1 className="editable-display eg-rise eg-delay-1 mt-6 text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-[var(--slot4-page-text)] sm:text-5xl lg:text-[3.5rem]">
            {hero.title.map((line, index) => (
              <span key={line} className="block">
                {index === hero.title.length - 1 ? <span className="text-[var(--slot4-accent)]">{line}</span> : line}
              </span>
            ))}
          </h1>

          <p className="eg-rise eg-delay-2 mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)] sm:text-lg">{hero.description}</p>

          <form action="/search" className="eg-rise eg-delay-3 mt-8 flex w-full max-w-xl overflow-hidden rounded-full border border-[var(--editable-border)] bg-white shadow-[0_16px_44px_rgba(11,75,196,0.12)]">
            <div className="flex min-w-0 flex-1 items-center gap-2.5 px-5">
              <Search className="h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
              <input
                name="q"
                placeholder={hero.searchPlaceholder}
                aria-label="Search the directory"
                className="w-full min-w-0 bg-transparent py-4 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
              />
            </div>
            <button className="shrink-0 bg-[var(--slot4-accent)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--slot4-accent-deep)] sm:px-8">
              Search
            </button>
          </form>

          <div className="eg-rise eg-delay-4 mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={hero.primaryCta.href || primaryRoute}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,75,196,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-deep)]"
            >
              {hero.primaryCta.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>

          {categories.length ? (
            <div className="eg-rise eg-delay-5 mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">{hero.focusLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {categories.map((task) => (
                  <Link
                    key={task.key}
                    href={task.route}
                    className="rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--slot4-muted-text)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                  >
                    {task.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Artwork: live post imagery inside a browser frame, with a floating card. */}
        <div className="relative min-w-0">
          <div className="eg-zoom eg-delay-2 eg-float-slow">
            <DeviceFrame>
              <div className="relative aspect-[16/11] w-full">
                <EditableHeroCollage images={heroImages} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,20,45,0.05),rgba(6,20,45,0.5))]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">{hero.featureCardBadge}</p>
                  <p className="editable-display mt-1.5 line-clamp-2 text-lg font-bold text-white">
                    {spotlight?.title || hero.featureCardTitle}
                  </p>
                </div>
              </div>
            </DeviceFrame>
          </div>

          {spotlight ? (
            <Link
              href={postHref(primaryTask, spotlight, primaryRoute)}
              className="eg-rise eg-delay-4 absolute -bottom-6 left-2 hidden max-w-[280px] items-center gap-3 rounded-2xl border border-[var(--editable-border)] bg-white p-3.5 shadow-[0_20px_44px_rgba(11,75,196,0.18)] transition duration-500 hover:-translate-y-1 sm:flex"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">
                  Newest {taskLabel(primaryTask).toLowerCase()}
                </span>
                <span className="mt-0.5 block truncate text-sm font-semibold text-[var(--slot4-page-text)]">{spotlight.title}</span>
              </span>
            </Link>
          ) : null}
        </div>
      </div>

      <WaveDivider />
    </section>
  )
}

/* ── 2. Blue band: why + showcase + auto-scrolling rail ───────────────────── */

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const all = pool({ posts, timeSections })
  const rail = all.slice(0, 10)
  const why = pagesContent.home.why
  const showcase = all.find((post) => hasRealImage(post)) || all[0]

  return (
    <section className="eg-on-blue relative overflow-hidden bg-[var(--slot4-accent)] pb-16 pt-4 text-white sm:pb-20">
      <MapBackdrop className="text-white/25" />

      <div className={`relative ${container}`}>
        <SectionHeading eyebrow={why.eyebrow} title={why.title} description={why.description} light />

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="eg-float-slow">
            <DeviceFrame>
              <div className="relative aspect-[16/9] w-full bg-[#0d1a30]">
                {showcase ? (
                  <img
                    src={getEditablePostImage(showcase)}
                    alt={showcase.title || ''}
                    className="h-full w-full object-cover opacity-90"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/50">
                    <Compass className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(6,20,45,0.85))]" />
                {showcase ? (
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">{taskLabel(primaryTask)}</p>
                    <p className="editable-display mt-1.5 line-clamp-2 text-xl font-bold text-white sm:text-2xl">{showcase.title}</p>
                  </div>
                ) : null}
              </div>
            </DeviceFrame>
          </div>
          <p className="mt-5 text-center text-sm text-white/75">{why.caption}</p>
        </div>
      </div>

      {rail.length ? (
        <div className="relative mt-14">
          <div className={`mb-6 flex flex-wrap items-end justify-between gap-4 ${container}`}>
            <h3 className="editable-display text-xl font-bold text-white sm:text-2xl">Fresh on the directory</h3>
            <Link href={primaryRoute} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 transition hover:text-white">
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* CSS-only auto-scrolling rail: the track is duplicated, so the
              -50% translation loops seamlessly. Hovering pauses it. */}
          <div className="eg-marquee">
            <div className="eg-marquee-track gap-5 px-4">
              {[...rail, ...rail].map((post, index) => (
                <RailPostCard
                  key={`${post.id || post.slug}-${index}`}
                  post={post}
                  href={postHref(primaryTask, post, primaryRoute)}
                  index={index % rail.length}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

/* ── 3. Process steps + story / offer splits ──────────────────────────────── */

function SplitBlock({
  eyebrow,
  title,
  paragraphs,
  cta,
  image,
  alt,
  reverse = false,
}: {
  eyebrow: string
  title: string
  paragraphs: readonly string[]
  cta: { label: string; href: string }
  image: string
  alt: string
  reverse?: boolean
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={`relative min-w-0 ${reverse ? 'lg:order-2' : ''}`}>
        {/* Offset tint panel behind the artwork, echoing the reference framing. */}
        <span aria-hidden="true" className="absolute -left-4 -top-4 hidden h-full w-full rounded-3xl bg-[var(--slot4-accent-light)]/25 sm:block" />
        <div className="relative overflow-hidden rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-media-bg)] shadow-[0_24px_60px_rgba(11,75,196,0.16)]">
          <img src={image} alt={alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-[1.04]" />
        </div>
      </div>
      <div className={`min-w-0 ${reverse ? 'lg:order-1' : ''}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent-light)]">{eyebrow}</p>
        <h2 className="editable-display mt-3 text-3xl font-extrabold leading-[1.14] tracking-[-0.03em] sm:text-4xl">{title}</h2>
        <div className="mt-5 space-y-4">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-[var(--slot4-muted-text)]">
              {paragraph}
            </p>
          ))}
        </div>
        <Link
          href={cta.href}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,75,196,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-deep)]"
        >
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

export function EditableMagazineSplit({ posts, timeSections }: HomeSectionProps) {
  const all = pool({ posts, timeSections })
  const imaged = all.filter(hasRealImage)
  const steps = pagesContent.home.steps
  const story = pagesContent.home.story
  const offer = pagesContent.home.offer
  const storyImage = getEditablePostImage(imaged[1] || imaged[0] || all[0])
  const offerImage = getEditablePostImage(imaged[2] || imaged[0] || all[1] || all[0])

  return (
    <>
      <section className="bg-[var(--slot4-panel-bg)]">
        <div className={`py-16 sm:py-20 lg:py-24 ${container}`}>
          <SectionHeading title={steps.title} description={steps.description} />

          <div className="mt-14 grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-4">
            {steps.items.map((step, index) => {
              const Icon = stepIcon[index] || Compass
              return (
                <div key={step.label} className="group relative text-center">
                  {/* Connector arrow between steps on wide screens. */}
                  {index < steps.items.length - 1 ? (
                    <span aria-hidden="true" className="absolute right-[-14px] top-9 hidden h-px w-7 bg-[var(--slot4-accent)]/35 lg:block">
                      <ArrowRight className="absolute -right-1 -top-2 h-4 w-4 text-[var(--slot4-accent)]/45" />
                    </span>
                  ) : null}

                  <span className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--slot4-accent)] text-white shadow-[0_14px_32px_rgba(11,75,196,0.28)] transition duration-500 group-hover:-translate-y-1.5">
                    <Icon className="h-7 w-7" />
                  </span>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent-light)]">{step.label}</p>
                  <h3 className="editable-display mt-2 text-xl font-bold text-[var(--slot4-page-text)]">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-[var(--slot4-muted-text)]">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--slot4-page-bg)]">
        <div className={`grid gap-20 py-16 sm:py-20 lg:py-24 ${container}`}>
          <SplitBlock
            eyebrow={story.eyebrow}
            title={story.title}
            paragraphs={story.paragraphs}
            cta={story.cta}
            image={storyImage}
            alt={`${SITE_CONFIG.name} directory`}
          />
          <SplitBlock
            eyebrow={offer.eyebrow}
            title={offer.title}
            paragraphs={offer.paragraphs}
            cta={offer.cta}
            image={offerImage}
            alt={`${SITE_CONFIG.name} listings`}
            reverse
          />
        </div>
      </section>
    </>
  )
}

/* ── 4. Features + categories + time-window collections ───────────────────── */

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const all = pool({ posts, timeSections })
  const features = pagesContent.home.features
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const featureImages = all.filter(hasRealImage)
  const featured = all[0]
  const editorial = all.slice(1, 4)

  // Use the real time windows; fall back to slicing posts so the page stays full.
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: all.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: all.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: all.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)

  const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
    spotlight: { eyebrow: 'Fresh this week', title: 'Added in the last 7 days' },
    browse: { eyebrow: 'Popular now', title: 'Most viewed this month' },
    index: { eyebrow: 'Evergreen', title: 'From the archive' },
  }

  return (
    <>
      {/* Category shortcuts */}
      {categories.length ? (
        <section className="bg-[var(--slot4-panel-bg)]">
          <div className={`py-16 sm:py-20 ${container}`}>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <SectionHeading align="left" eyebrow="Browse" title="Start with a category" />
              <Link
                href={primaryRoute}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)] transition hover:gap-2.5"
              >
                View everything <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((task) => {
                const Icon = taskIcon[task.key] || FileText
                return (
                  <Link
                    key={task.key}
                    href={task.route}
                    className="group flex flex-col items-center gap-3.5 rounded-3xl border border-[var(--editable-border)] bg-white px-3 py-7 text-center transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-accent)] hover:shadow-[0_18px_40px_rgba(11,75,196,0.14)]"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)] transition duration-500 group-hover:scale-110 group-hover:bg-[var(--slot4-accent)] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-sm font-semibold text-[var(--slot4-page-text)]">{task.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Feature rows, alternating text / artwork */}
      <section className="bg-[var(--slot4-page-bg)]">
        <div className={`py-16 sm:py-20 lg:py-24 ${container}`}>
          <SectionHeading eyebrow={features.eyebrow} title={features.title} />

          <div className="mt-14 grid gap-14">
            {features.items.map((feature, index) => {
              const image = featureImages[index % Math.max(1, featureImages.length)]
              const reverse = index % 2 === 1
              return (
                <div key={feature.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                  <div className={`min-w-0 ${reverse ? 'lg:order-2' : ''}`}>
                    <span className="editable-display inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-sm font-bold text-[var(--slot4-accent)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="editable-display mt-4 text-2xl font-extrabold leading-tight tracking-[-0.025em] sm:text-3xl">{feature.title}</h3>
                    <p className="mt-4 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{feature.description}</p>
                  </div>
                  <div className={`min-w-0 ${reverse ? 'lg:order-1' : ''}`}>
                    <div className="overflow-hidden rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-media-bg)] shadow-[0_20px_50px_rgba(11,75,196,0.14)]">
                      <img
                        src={image ? getEditablePostImage(image) : '/placeholder.svg?height=800&width=1200'}
                        alt=""
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover transition duration-700 hover:scale-[1.04]"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Editorial spotlight: one hero card plus text cards */}
      {featured ? (
        <section className="bg-[var(--slot4-panel-bg)]">
          <div className={`py-16 sm:py-20 ${container}`}>
            <SectionHeading align="left" eyebrow="Spotlight" title="Worth your attention" />
            <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <EditorialFeatureCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} label="Featured" />
              <div className="grid gap-6">
                {editorial.map((post, index) => (
                  <EditorialTextCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Time-window collections */}
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        const items = section.posts.slice(0, 8)
        const useHorizontal = index === 1
        return (
          <section key={section.key} className={index % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-panel-bg)]'}>
            <div className={`py-16 sm:py-20 ${container}`}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading align="left" eyebrow={copy.eyebrow} title={copy.title} />
                <Link
                  href={section.href || primaryRoute}
                  className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)] transition hover:gap-2.5"
                >
                  See all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {useHorizontal ? (
                <div className="mt-10 grid gap-5 lg:grid-cols-2">
                  {items.map((post) => (
                    <HorizontalPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  ))}
                </div>
              ) : index === 2 ? (
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((post, cardIndex) => (
                    <ImageFirstCard
                      key={post.id || post.slug}
                      post={post}
                      href={postHref(primaryTask, post, primaryRoute)}
                      tall={cardIndex % 4 === 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((post) => (
                    <StandardPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ── 5. CTA banner + auto-scrolling benefits ──────────────────────────────── */

export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  const benefits = pagesContent.home.benefits

  return (
    <>
      <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-page-bg)]">
        <div className={`py-16 sm:py-20 ${container}`}>
          <div className="eg-on-blue relative overflow-hidden rounded-[2rem] bg-[var(--slot4-accent)] px-6 py-12 text-white shadow-[0_28px_70px_rgba(11,75,196,0.28)] sm:px-12 sm:py-14">
            <MapBackdrop className="text-white/25" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">{cta.badge}</p>
                <h2 className="editable-display mt-3 text-3xl font-extrabold leading-[1.14] tracking-[-0.03em] sm:text-4xl">{cta.title}</h2>
                <p className="mt-4 text-base leading-8 text-white/85">{cta.description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={cta.primaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--slot4-accent)] shadow-[0_12px_30px_rgba(6,20,45,0.2)] transition duration-300 hover:-translate-y-0.5"
                >
                  {cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href={cta.secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/50 px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--slot4-accent)]"
                >
                  {cta.secondaryCta.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[var(--slot4-panel-bg)] py-16 sm:py-20">
        <div className={container}>
          <SectionHeading title={benefits.title} description={benefits.description} />
        </div>

        {/* Auto-scrolling benefit cards; hovering pauses the track. */}
        <div className="eg-marquee mt-12">
          <div className="eg-marquee-track eg-marquee-track-fast gap-5 px-4">
            {[...benefits.items, ...benefits.items].map((item, index) => {
              const Icon = benefitIcon[index % benefitIcon.length] || CheckCircle2
              return (
                <article
                  key={`${item.title}-${index}`}
                  className="flex w-[300px] shrink-0 flex-col rounded-3xl border border-[var(--editable-border)] bg-white p-7 shadow-[0_12px_32px_rgba(11,75,196,0.08)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_46px_rgba(11,75,196,0.16)] sm:w-[340px]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="editable-display mt-5 text-lg font-bold text-[var(--slot4-page-text)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{item.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

/** Small helper kept for section reuse — renders a post excerpt safely. */
export function EditablePostExcerpt({ post, limit = 140 }: { post: SitePost; limit?: number }) {
  const text = getEditableExcerpt(post, limit)
  if (!text) return null
  return <p className="text-sm leading-7 text-[var(--slot4-muted-text)]">{text}</p>
}
