import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`

  return (
    <main className={dc.shell.page}>
      <section className="eg-on-blue relative overflow-hidden bg-[var(--slot4-accent)] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(55%_70%_at_15%_0%,rgba(255,255,255,0.3),transparent_60%)]"
        />
        <div className={`relative py-16 sm:py-20 ${dc.shell.section}`}>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">{voice.eyebrow}</p>
          <h1 className={`editable-display mt-5 max-w-4xl ${dc.type.heroTitle}`}>{voice.headline}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/85">{voice.description}</p>

          <form action={basePath} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <select
              name="category"
              defaultValue={category || 'all'}
              aria-label={voice.filterLabel}
              className="min-w-0 flex-1 rounded-full border border-white/30 bg-white px-5 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] outline-none"
            >
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--slot4-accent)] transition duration-300 hover:-translate-y-0.5">
              Filter
            </button>
          </form>
        </div>
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {posts.length ? (
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <ArticleListCard key={post.id} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />
            ))}
          </div>
        ) : (
          <div className={`${dc.surface.soft} p-10 text-center`}>
            <h2 className="editable-display text-2xl font-extrabold tracking-[-0.03em]">No guides found</h2>
            <p className={`mt-3 text-sm leading-7 ${pal.mutedText}`}>Try another category, or return to all guides.</p>
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? (
            <Link href={pageHref(page - 1)} className={dc.button.secondary}>
              <ArrowLeft className="h-4 w-4" /> Previous
            </Link>
          ) : null}
          <span className="inline-flex h-12 items-center rounded-full bg-[var(--slot4-accent)] px-6 text-sm font-semibold text-white">
            Page {page} of {pagination.totalPages || 1}
          </span>
          {pagination.hasNextPage ? (
            <Link href={pageHref(page + 1)} className={dc.button.secondary}>
              Next <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-12 sm:pt-16`}>
        <div className={`grid gap-8 ${dc.surface.card} p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-10`}>
          <div className="min-w-0">
            <Link href="/article" className={dc.button.secondary}>
              <ArrowLeft className="h-4 w-4" /> Guides
            </Link>
            <p className={`${dc.type.eyebrow} mt-8`}>{voice.eyebrow}</p>
            <h1 className="editable-display mt-4 max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
              {post?.title || pagesContent.detailPages.article.fallbackTitle}
            </h1>
          </div>
          <aside className="eg-on-blue min-w-0 rounded-3xl bg-[var(--slot4-accent)] p-7 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">Reading note</p>
            <p className="mt-4 text-sm leading-7 text-white/85">{voice.secondaryNote}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--slot4-accent)] transition hover:-translate-y-0.5">
              Contact <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24">
        <div className={`${dc.surface.card} p-6 sm:p-9`}>
          <p className={`text-base leading-8 ${pal.mutedText}`}>
            {post?.summary || `Guide content for ${slug} renders through the editable detail page.`}
          </p>
        </div>
      </section>
    </main>
  )
}
