import { Helmet } from 'react-helmet-async'

interface FAQ { question: string; answer: string }

interface SEOHeadProps {
  title: string
  description: string
  canonical: string
  faqs?: FAQ[]
}

// ── UPDATE THESE WHEN YOU BUY YOUR DOMAIN ──────────────────────
const SITE = 'Calculator'
const BASE = 'https://www.yourcalculator.com'   // ← replace with your real domain
// ───────────────────────────────────────────────────────────────

export function SEOHead({ title, description, canonical, faqs }: SEOHeadProps) {
  const full = `${title} | ${SITE}`
  const url  = `${BASE}${canonical}`

  const faqSchema = faqs ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  )
}
