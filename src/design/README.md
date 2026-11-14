# src/design

Owner: Dias.

The look and feel of the site, in one place.

- `tokens.css` — every color, corner, shadow, font and animation. Change a color here and it changes everywhere.
- `base.css` — page defaults: 18px text, focus ring, and no motion for people who ask for less.
- `font.ts`, `fonts/` — Nunito, stored in the repository (SIL Open Font License, see `fonts/LICENSE-nunito.txt`).
- `illustrations/` — abstract drawings: cloud, sprout, cradle, family. No stock photos.
- `contrast.ts`, `contrast.test.ts` — a test that every text and background pair keeps AA contrast (4.5 to 1).

Import from other folders: the classes the tokens create (`bg-cream`, `text-ink`, `rounded-soft`, ...),
`nunito` from `font.ts`, and drawings from `illustrations`.

Changes to the starter palette from the spec: the starter colors are all kept, and each got a `deep`
and a `soft` partner, because white text on the starter coral only reaches 3.2 to 1.
