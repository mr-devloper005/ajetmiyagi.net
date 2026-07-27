'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function EditableContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Unable to send your message.')
      setStatus('success')
      setMessage(data?.message || 'Thanks. Your message has been received.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="name" label="Full name" placeholder="Your name" required />
        <Field name="email" type="email" label="Email address" placeholder="you@example.com" required />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field name="phone" label="Phone number" placeholder="Optional" />
        <Field name="subject" label="Subject" placeholder="How can we help?" />
      </div>

      <label className="mt-4 grid gap-2 text-sm font-semibold text-[var(--slot4-muted-text)]">
        Message
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us what you need..."
          className="rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-4 text-sm font-medium leading-7 text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)] focus:bg-white"
        />
      </label>

      {/* Honeypot: real visitors never see or fill this. */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {message ? (
        <div
          role="status"
          className={`mt-5 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold ${
            status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
          }`}
        >
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{message}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 text-sm font-semibold text-[var(--slot4-on-accent)] shadow-[0_12px_28px_rgba(11,75,196,0.26)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-deep)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send message
      </button>
    </form>
  )
}

function Field({ name, label, type = 'text', placeholder, required = false }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--slot4-muted-text)]">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-12 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)] focus:bg-white"
      />
    </label>
  )
}
