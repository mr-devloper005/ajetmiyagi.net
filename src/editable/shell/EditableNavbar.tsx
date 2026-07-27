'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, LogOut, Menu, PlusCircle, Search, UserPlus, UserRound, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { EditableLogoMark, EditableWordmark } from '@/editable/shell/EditableLogo'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const navItems = useMemo(() => {
    const taskLinks = SITE_CONFIG.tasks
      .filter((task) => task.enabled)
      .slice(0, 4)
      .map((task) => ({ label: task.label, href: task.route }))
    return [{ label: 'Home', href: '/' }, ...taskLinks, { label: 'About', href: '/about' }, { label: 'Contact us', href: '/contact' }]
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setOpen(false)
    setSearchOpen(false)
  }, [pathname])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

  return (
    <header
      className={`sticky top-0 z-50 bg-[var(--editable-nav-bg)]/95 text-[var(--editable-nav-text)] backdrop-blur-md transition duration-500 ${
        scrolled ? 'shadow-[0_8px_30px_rgba(11,75,196,0.10)]' : 'shadow-none'
      }`}
    >
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label={`${SITE_CONFIG.name} home`} className="group flex shrink-0 items-center gap-3">
          <EditableLogoMark className="h-11 w-11 shrink-0 transition duration-500 group-hover:scale-105 sm:h-12 sm:w-12" />
          <span className="hidden min-w-0 sm:block">
            <EditableWordmark name={SITE_CONFIG.name} />
            <span className="mt-1 block max-w-[220px] truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                className={`eg-underline relative px-3.5 py-2 text-[15px] font-medium transition ${
                  active ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-4">
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            aria-label="Toggle search"
            aria-expanded={searchOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
          >
            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>

          {session ? (
            <>
              <span className="hidden items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3.5 py-2 text-sm font-semibold text-[var(--slot4-accent)] sm:inline-flex">
                <UserRound className="h-4 w-4" />
                <span className="max-w-[130px] truncate">{session.name || session.email}</span>
              </span>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--editable-cta-text)] shadow-[0_10px_24px_rgba(11,75,196,0.26)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-deep)] sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Create
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-2.5 text-sm font-semibold text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-2.5 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--editable-cta-text)] shadow-[0_10px_24px_rgba(11,75,196,0.26)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-deep)] sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Sign up
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {searchOpen ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
          <form action="/search" className="mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <label className="flex flex-1 items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3 transition focus-within:border-[var(--slot4-accent)]">
              <Search className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
              <input
                name="q"
                type="search"
                autoFocus
                placeholder="Search businesses, guides, categories…"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
              />
            </label>
            <button className="shrink-0 rounded-full bg-[var(--editable-cta-bg)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--slot4-accent-deep)]">
              Search
            </button>
          </form>
        </div>
      ) : null}

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-4 pb-6 pt-4 lg:hidden">
          <form action="/search" className="mb-4 flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-4 py-3">
            <Search className="h-4 w-4 text-[var(--slot4-accent)]" />
            <input
              name="q"
              type="search"
              placeholder="Search the directory"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
            />
          </form>

          <div className="grid gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
                      : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-accent)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="mt-5 grid gap-2.5">
            {session ? (
              <>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-4 py-3 text-sm font-semibold text-[var(--slot4-accent)]">
                  <UserRound className="h-4 w-4" />
                  <span className="truncate">{session.name || session.email}</span>
                </span>
                <Link
                  href="/create"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-5 py-3 text-sm font-semibold text-white"
                >
                  <PlusCircle className="h-4 w-4" /> Create
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-semibold text-[var(--slot4-muted-text)]"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-semibold text-[var(--slot4-page-text)]"
                >
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-5 py-3 text-sm font-semibold text-white"
                >
                  <UserPlus className="h-4 w-4" /> Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
