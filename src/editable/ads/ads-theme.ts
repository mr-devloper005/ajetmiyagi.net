// ✏️ EDITABLE — theme the ads to match this site. Devs own this file.
// You control the LOOK here (radius, border, shadow, background, label color).
// You CANNOT change the ad's shape/fit from here — that stays locked in
// src/lib/ad-slots.ts, so the ad always displays correctly no matter what.

import type { AdSkin } from '@/lib/ads/ad-frame'

// Site-wide default skin — tune to your brand.
export const adSkin: AdSkin = {
  radius: '24px',
  border: '1px solid #dfe8f5',
  shadow: '0 12px 34px rgba(11,75,196,0.08)',
  background: '#ffffff',
  labelClassName: 'bg-[#0b4bc4] text-white',
}

// Optional per-slot overrides — adjust only where you need to.
export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '20px', shadow: 'none', border: '1px solid #dfe8f5' },
  popup: { radius: '28px' },
  header: { radius: '24px', background: '#eef5fd' },
  rail: { radius: '20px' },
  feature: { radius: '24px' },
  interstitial: { radius: '28px', shadow: '0 24px 60px rgba(6,20,45,0.45)' },
  anchor: { radius: '18px', shadow: '0 8px 26px rgba(11,75,196,0.22)' },
}

/** Merge site default + per-slot override for a slot. */
export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
// junior tweak


