'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Facebook, Instagram, Linkedin, LogOut, Mail, PlusCircle, Youtube } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { EditableLogoMark, EditableWordmark } from '@/editable/shell/EditableLogo'

const socialIcon = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
  YouTube: Youtube,
} as const

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const [subscribed, setSubscribed] = useState(false)
  const newsletter = globalContent.footer.newsletter

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubscribed(true)
    event.currentTarget.reset()
  }

  return (
    <footer className="eg-on-blue relative overflow-hidden bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* Soft light pools, echoing the map artwork on the marketing bands. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(60%_70%_at_12%_0%,rgba(255,255,255,0.22),transparent_60%),radial-gradient(50%_60%_at_88%_10%,rgba(255,255,255,0.14),transparent_65%)]"
      />

      <div className="relative mx-auto grid max-w-[var(--editable-container)] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.9fr] lg:px-8">
        <div>
          <Link href="/" aria-label={`${SITE_CONFIG.name} home`} className="group inline-flex items-center gap-3">
            <EditableLogoMark variant="light" className="h-12 w-12 shrink-0 transition duration-500 group-hover:scale-105" />
            <EditableWordmark name={SITE_CONFIG.name} variant="light" className="text-2xl" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">{globalContent.footer?.description || SITE_CONFIG.description}</p>

          <form onSubmit={subscribe} className="mt-7 max-w-sm">
            <p className="text-sm font-semibold text-white">{newsletter.title}</p>
            <div className="mt-3 flex gap-2">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-3 transition focus-within:border-white">
                <Mail className="h-4 w-4 shrink-0 text-white/70" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={newsletter.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/60"
                />
              </label>
              <button
                type="submit"
                className="shrink-0 rounded-xl border border-white/45 px-5 text-sm font-semibold text-white transition duration-300 hover:bg-white hover:text-[var(--slot4-accent)]"
              >
                {newsletter.buttonLabel}
              </button>
            </div>
            {subscribed ? (
              <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white">
                <CheckCircle2 className="h-4 w-4" /> Thanks — you are on the list.
              </p>
            ) : (
              <p className="mt-3 text-xs leading-6 text-white/70">{newsletter.consent}</p>
            )}
          </form>
        </div>

        <div>
          <h3 className="editable-display text-lg font-bold text-white">Quick links</h3>
          <div className="mt-5 grid gap-3">
            <Link href="/" className="w-fit text-sm text-white/80 transition hover:translate-x-1 hover:text-white">
              Home
            </Link>
            {taskLinks.map((task) => (
              <Link key={task.key} href={task.route} className="w-fit text-sm text-white/80 transition hover:translate-x-1 hover:text-white">
                {task.label}
              </Link>
            ))}
            <Link href="/search" className="w-fit text-sm text-white/80 transition hover:translate-x-1 hover:text-white">
              Search
            </Link>
          </div>
        </div>

        <div>
          <h3 className="editable-display text-lg font-bold text-white">Company</h3>
          <div className="mt-5 grid gap-3">
            <Link href="/about" className="w-fit text-sm text-white/80 transition hover:translate-x-1 hover:text-white">
              About us
            </Link>
            <Link href="/contact" className="w-fit text-sm text-white/80 transition hover:translate-x-1 hover:text-white">
              Contact us
            </Link>
            <Link href="/comments" className="w-fit text-sm text-white/80 transition hover:translate-x-1 hover:text-white">
              Comments
            </Link>
            {/* Only Login and Sign up disappear once a member is signed in —
                every other footer link stays exactly where it was. */}
            {session ? (
              <>
                <Link href="/create" className="inline-flex w-fit items-center gap-2 text-sm text-white/80 transition hover:translate-x-1 hover:text-white">
                  <PlusCircle className="h-4 w-4" /> Create
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex w-fit items-center gap-2 text-left text-sm text-white/80 transition hover:translate-x-1 hover:text-white"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="w-fit text-sm text-white/80 transition hover:translate-x-1 hover:text-white">
                  Login
                </Link>
                <Link href="/signup" className="w-fit text-sm text-white/80 transition hover:translate-x-1 hover:text-white">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="editable-display text-lg font-bold text-white">Connect with us</h3>
          <div className="mt-5 grid gap-3">
            {globalContent.footer.social.map((item) => {
              const Icon = socialIcon[item.label as keyof typeof socialIcon] || ArrowUpRight
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="inline-flex w-fit items-center gap-3 text-sm text-white/80 transition hover:translate-x-1 hover:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/20 px-4 py-5 text-center text-sm text-white/80">
        © {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
