# Digital Field. (DF.) — Corporate Website

Multi-page web application for **Digital Field. (DF.)**, a Digital Performance & Intelligence Consultancy founded in 2021 by Islam Helal in Dubai, United Arab Emirates.

## Stack
- React + TypeScript (`strict: true`) + Vite + Tailwind CSS v4
- `react-router-dom` (configured with `HashRouter` for preview compatibility; includes a one-line commented switch to `BrowserRouter` in `src/app/App.tsx`)
- `lucide-react` for UI affordance icons

## Development
```bash
npm install
npm run dev
```

Build and typecheck:
```bash
npm run lint
npm run build
```

## Replacing Brand Placeholders

All asset placeholders are centralized in `src/config/site.ts`:

1. **Logos (`<Logo />`)**:
   - Place official SVGs under `/src/assets/brand/` (`logo-wordmark-light.svg`, `logo-wordmark-dark.svg`, `logo-icon-light.svg`, `logo-icon-dark.svg`, `logo-lockup-standard-*.svg`, `logo-lockup-italic-*.svg`) and assign their imported URLs in `SITE_CONFIG.assets.logos`.
   - Review `brand-guidelines.md` for clear-space (`1X` = magenta dot size) and minimum-legibility rules.
2. **3D DF. Icon (`<Hero3DSlot />`)**:
   - Assign your rendered `.png` or `.webm` path to `SITE_CONFIG.assets.hero3dSrc`.
3. **Pattern & Tridi Mark (`<BrandPattern />`, `<TridiMark />`)**:
   - Replace the placeholder SVGs inside `src/components/brand/BrandPattern.tsx` and `src/components/brand/TridiMark.tsx` with official vector artwork.
4. **Photography (`<ImageSlot />`)**:
   - Pass approved image URLs, `srcSet`, `sizes`, and `alt` text where `<ImageSlot />` is rendered (or connect to a media manifest).
5. **Brand Characters (`<CharacterSlot name="Di" | "Fi" />`)**:
   - Assign verified character assets in `SITE_CONFIG.assets.characters`. Until configured, `<CharacterSlot />` renders nothing visible. Keep AI-generated imagery disclosure labels active wherever required.

## Connecting the Contact Form & Verified Contact Details

Edit `src/config/site.ts`:
- **Option A (API / Serverless Endpoint)**: Set `SITE_CONFIG.contact.contactEndpoint` to your HTTPS form handler URL. The form will `POST` JSON and handle success/failure cleanly.
- **Option B (`mailto:` Fallback)**: Set `SITE_CONFIG.contact.email` to the verified company email address.
- **Default Honest Fallback**: When neither is configured, the form validates input and renders a clear panel allowing visitors to copy the formatted inquiry or download it as a `.txt` file.
- **Privacy Consent**: Once approved privacy wording is supplied, update `SITE_CONFIG.contact.privacyWordingPlaceholder` and flip `SITE_CONFIG.contact.requirePrivacyConsent` to `true`.

## Deployment & SEO Notes

- **Router Switch**: Before deploying to a production host with SPA fallback rewrites (`/* -> /index.html`), switch `HashRouter` to `BrowserRouter` in `src/app/App.tsx`.
- **Production Domain**: Replace the placeholder domain in `public/robots.txt`, `public/sitemap.xml`, and `SITE_CONFIG.baseUrl` in `src/config/site.ts`.
- **Prerendering / SSR Recommendation**: Client-side SPAs rely on JavaScript execution for route-level meta tags and JSON-LD updates. For maximum search engine and AI-crawler indexability (including AEO, AIO, GEO, GAIO, and AXO discoverability), pair this codebase with Vite SSG / prerendering or an SSR framework before production launch.
