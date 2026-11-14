# Digital Field. (DF.) — Corporate Website

Multi-page web application for **Digital Field. (DF.)**, a Digital Performance & Intelligence Consultancy founded in 2021 by Islam Helal in Dubai, United Arab Emirates.

## Stack
- React 19 + TypeScript (`strict: true`) + Vite + Tailwind CSS v4
- Three.js (`SVGLoader` + `ExtrudeGeometry` + `RoomEnvironment`) for the interactive 3D DF hero centerpiece
- `react-router-dom` (configured with `HashRouter` for preview compatibility; includes a one-line switch comment to `BrowserRouter` in `src/app/App.tsx`)
- `lucide-react` & `motion` (with `MotionConfig reducedMotion="user"`)

## Brand System & Architecture
- **Day / Night Theme (`data-theme`)**: Defaults strictly to **Day mode** (`#F4F1EA` Off-White / `#010102` Near-Black / `#0057FF` Electric Blue accents) on first visit regardless of OS preference, applied before first paint in `index.html`, toggled cleanly via header controls with `localStorage` persistence (`df-theme`).
- **Official Vector Marks (`/src/assets/brand/*.svg`)**: Official DF icon, wordmark, standard lockup, italic lockup, and Tridi mark extracted verbatim from the Digital Field Phase 01 brand guidelines, wired via `src/config/site.ts`.
- **Interactive 3D Hero (`Hero3DSlot` / `Hero3DCanvas`)**: Extrudes the official `df-mark-3d.svg` mark into glossy black-chrome geometry with Violet/Magenta rim lighting, Day/Night reactive illumination, pointer parallax, scroll drift, off-screen `IntersectionObserver` pause, DPR capping, and a compact DF-mark loader + static SVG fallback.

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

## Replacing Pending Media & Contact Details

All asset paths and contact details are centralized in `src/config/site.ts`:

1. **Photography (`<ImageSlot />`)**:
   - Supply founder portrait, DF. Studio production photos, and hospitality imagery URLs (avoiding generic stock imagery).
2. **Brand Characters (`<CharacterSlot name="Di" | "Fi" />`)**:
   - Assign verified character assets in `SITE_CONFIG.assets.characters`. Until configured, `<CharacterSlot />` renders nothing visible.
3. **Contact Form & Direct Details**:
   - Configure `SITE_CONFIG.contact.contactEndpoint` (HTTPS POST handler) or `SITE_CONFIG.contact.email` in `src/config/site.ts`, along with verified phone number, Dubai office street address, and social links.
   - Until configured, the Contact page validates input client-side and provides an honest copy-to-clipboard and `.txt` download fallback.
   - Update `SITE_CONFIG.contact.privacyWordingPlaceholder` and set `requirePrivacyConsent: true` when approved privacy notice text is ready.
