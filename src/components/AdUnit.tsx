import { useEffect, useRef } from 'react'

declare global {
  interface Window { adsbygoogle: unknown[] }
}

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'horizontal' | 'rectangle' | 'vertical'
  style?: React.CSSProperties
}

const IS_PROD =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'

export function AdUnit({ slot, format = 'auto', style }: AdUnitProps) {
  const pushed = useRef(false)

  useEffect(() => {
    if (!IS_PROD || pushed.current) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      pushed.current = true
    } catch (_) {}
  }, [])

  if (!IS_PROD) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)',
        borderRadius: '8px', color: 'rgba(255,255,255,0.15)', fontSize: '11px',
        fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase',
        minHeight: format === 'rectangle' ? '250px' : '90px', width: '100%',
        margin: '1.5rem 0', ...style,
      }}>
        ad · {slot} · {format}
      </div>
    )
  }

  return (
    <div style={{ margin: '1.5rem 0', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

export const AdBanner = ({ slot }: { slot: string }) =>
  <AdUnit slot={slot} format="horizontal" />

export const AdRectangle = ({ slot }: { slot: string }) =>
  <AdUnit slot={slot} format="rectangle" style={{ maxWidth: '336px', margin: '1.5rem auto' }} />
