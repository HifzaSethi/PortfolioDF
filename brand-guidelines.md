# Digital Field. (DF.) — Brand & Asset Guidelines

## Logo Usage & Clear Space Rules

The official Digital Field. identity uses two core marks:
- **Wordmark (`Digital Field.`)**: Stacked, heavy forward-leaning italic custom artwork.
- **Icon (`DF.`)**: Integrated italic numeral `1`, sharp forward-leaning `D` sharing its top stroke with `F`, and the magenta block dot at the foot of the `F`.
- **Lockups**:
  - `lockup-standard`: Upright divider between icon and wordmark.
  - `lockup-italic`: Slanted divider matching `--slant` (`-12deg`).

### Mandatory Rules
1. **Clear Space**: Minimum clear space on all sides equals `1X`, where `X` = the size of the magenta dot.
2. **Minimum Legibility**: Below legible width, switch from `wordmark` to `icon`.
3. **Never Alter the Mark**:
   - Never stretch or squash.
   - Never recolor outside the approved brand palette (`#F4F1EA`, `#010102`, `#B34FFF`, `#E23389`, `#0057FF`).
   - Never add or remove elements.
   - Never fade opacity, add drop shadows, outlines, strokes, or glows.
   - Never tilt or rotate beyond the artwork's built-in slant.
4. **Never Type the Logo in Sora**: The logo is custom artwork. While official SVGs are pending, `<Logo />` renders a clearly labeled `LOGO PLACEHOLDER` box pointing to `src/config/site.ts`.

## Single Directional Axis
Every angled divider, clip-path, underline, and pattern module uses `--slant: -12deg`.

## Brand Characters (Di & Fi)
`<CharacterSlot name="Di" | "Fi" />` renders nothing visible in production until official character assets are configured in `src/config/site.ts`. Whenever AI-generated imagery is published, label it with disclosure: *"AI-generated imagery is labeled where disclosure is required."*
