# aidatasucks.com

A static comparison site grading AI vendors on cost and usage API transparency. Built for FinOps teams who need programmatic access to their AI spend data.

## What this is

A single-page site with a sortable, filterable comparison table. Each vendor is graded A-F based on whether they provide a cost API, usage API, and billing export -- and how usable those APIs actually are.

## Stack

- Next.js (static export)
- Tailwind CSS + shadcn/ui
- Vendor data lives in `src/data/vendors.json`

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Static output goes to `out/`.

## Contributing

Edit `src/data/vendors.json` to add or update vendors. Open a PR.
