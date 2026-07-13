# aidatasucks.com

yeah yeah whatever who am i to decide who gets what grade? what are you going to do about it? anyway, it's
a static comparison site grading AI vendors on cost and usage API transparency. if it's helpful to you, great. if not,
i don't know man

## what this is

can i get cost from your api? great. can i get usage from your api? cool. can i get both? do you have some sort of
billing export? sick

## running it locally

```bash
npm install
cp .env.example .env.local   # fill in your PostHog key
npm run dev
```

env vars (see `.env.example`):

- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` - reverse-proxy path (`/ingest`, wired in `next.config.js`) or a PostHog host

vendor data lives in `src/data/vendors.yaml`. grades are computed from it in `src/lib/grades.js`.

## what am i doing next

- improvement of the dataset by addition of fields: `scope`, `auth type`, `unit`
- in a more fun & perfect world, some CSMs at these vendors reach out to me to confirm and I slap a `verification` badge on their line item
- more fun filtering

## what have i done

##### 7.13.26

- Click a row (or card) to expand the `notes` for that vendor
- Fixed PostHog config: debug now only in dev, `person_profiles` set to `identified_only`
- Single source of truth for grades (`src/lib/grades.js`) and the last-updated date (`src/lib/site.js`)
- SEO: OpenGraph image, `robots.txt`, `sitemap.xml`, Twitter card
- Accessibility: sort headers and expandable rows are now keyboard-operable

##### 2.26.26

- Added `domain` metadata and filter
- New `verified` badge for Runway
- Changes to `costApi` field based on new criteria

## what to do to contribute

something wrong? don't know what to tell you dog. open a PR. go tell the mayor
