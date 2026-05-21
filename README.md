# Calculator

Free online calculator platform — Finance, Real Estate, Math, Business.

## Stack
- React 18 + Vite 5 + TypeScript (strict)
- React Router 6 (client-side SPA)
- Recharts (charts)
- react-helmet-async (SEO + JSON-LD)
- CSS Modules (scoped styling)
- Vercel free tier (hosting)
- Zero backend, zero database

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

## Deploy to Vercel

1. Push repo to GitHub
2. vercel.com → New Project → import from GitHub
3. Framework: Vite → Deploy
4. Add custom domain in Vercel dashboard

## Activate Google AdSense

1. Get approved at adsense.google.com
2. In `index.html`, uncomment the AdSense script and replace `ca-pub-XXXXXXXXXXXXXXXX`
3. In `src/components/AdUnit.tsx`, replace `ca-pub-XXXXXXXXXXXXXXXX` with your publisher ID
4. Replace all slot IDs (e.g. `"2000000001"`) with your real ad unit slot IDs
5. `npm run build` and redeploy

## Adding a New Calculator

```
src/calculators/{category}/{Name}/
├── {name}Engine.ts      ← pure TS math logic, zero side effects
├── {Name}.tsx           ← React page component
└── {Name}.module.css    ← scoped styles
```

Then:
1. Add `lazy()` import in `App.tsx`
2. Add `<Route>` in `App.tsx`
3. Add to category list in `HomePage.tsx`

## Page Structure (every calculator must follow this)

1. `<SEOHead>` with title, description, canonical, and faqSchema
2. Hero section (breadcrumb + h1 + subtitle)
3. `<AdBanner>` — top
4. Interactive calculator inputs (live onChange, no button needed for simple calcs)
5. Results section with chart
6. `<AdRectangle>` — middle
7. 800–1,200 word article with:
   - Dynamic example using user's actual numbers
   - Explanation of the math
   - FAQ section (matching faqSchema passed to SEOHead)
8. `<AdBanner>` — bottom

## Live Calculators

| Calculator | Path | Status |
|---|---|---|
| Income Tax | /finance/income-tax-calculator | ✅ Live |
| Compound Interest | /finance/compound-interest-calculator | ✅ Live |
| Mortgage Calculator | /real-estate/mortgage-calculator | ✅ Live |
| Percentage Calculator | /math/percentage-calculator | ✅ Live |
| All others | various | 🔜 Coming Soon |

## Tax Rate Updates

Edit `src/calculators/finance/TaxCalc/taxRates.ts` each tax year.
Run `npm run build` and redeploy — everything updates automatically.
