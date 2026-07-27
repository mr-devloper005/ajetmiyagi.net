import { SITE_CONFIG } from '@/lib/site-config'

/*
  Brand mark for the site shell.

  The site's own favicon.png is the logo, rendered at full size with no chip or
  padding around it on light surfaces so the artwork reads as-is. On the blue
  footer band it sits on a white rounded plate, otherwise a blue mark on a blue
  background would disappear. The asset itself lives in public/ and is left
  untouched.
*/
export function EditableLogoMark({
  className = 'h-11 w-11',
  variant = 'brand',
}: {
  className?: string
  /** `brand` = bare logo on light surfaces, `light` = white plate for the blue bands. */
  variant?: 'brand' | 'light'
}) {
  const isLight = variant === 'light'

  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${isLight ? 'bg-white p-1.5' : ''} ${className}`}>
      <img
        src="/favicon.png?v=20260413"
        alt={`${SITE_CONFIG.name} logo`}
        className="h-full w-full object-contain"
        loading="eager"
        decoding="async"
      />
    </span>
  )
}

/**
 * Two-tone wordmark: the leading part in ink (or white), the tail in the
 * light-blue support accent — the same split the home page headline uses.
 */
export function EditableWordmark({
  name = SITE_CONFIG.name,
  className = 'text-[22px] sm:text-[26px]',
  variant = 'brand',
}: {
  name?: string
  className?: string
  variant?: 'brand' | 'light'
}) {
  const parts = name.trim().split(/\s+/)
  const head = parts.length > 1 ? parts.slice(0, -1).join(' ') : name.slice(0, Math.ceil(name.length * 0.6))
  const tail = parts.length > 1 ? ` ${parts[parts.length - 1]}` : name.slice(Math.ceil(name.length * 0.6))

  return (
    <span className={`editable-display font-extrabold leading-none tracking-[-0.03em] ${className}`}>
      <span className={variant === 'light' ? 'text-white' : 'text-[var(--slot4-ink)]'}>{head}</span>
      <span className={variant === 'light' ? 'text-white/70' : 'text-[var(--slot4-accent-light)]'}>{tail}</span>
    </span>
  )
}
