# aidatasucks.com

A static comparison site grading AI vendors on cost and usage API transparency. Built for FinOps teams who need programmatic access to their AI spend data.

## What this is

A single-page site with a sortable, filterable comparison table. Each vendor is graded A-F based on whether they provide a cost API, usage API, and billing export -- and how usable those APIs actually are. There's a slight weight for certain conditions.

## Stack

- Next.js (static export)
- Tailwind CSS + shadcn/ui
- Vendor data lives in `src/data/vendors.yaml`

## Next Up

- Improvement of the dataset by addition of fields: `scope`, `auth type`, `unit`
- In a more fun & perfect world, some CSMs at these vendors reach out to me to confirm and I slap a `verification` badge on their line item
- More fun filtering
- Click on the provider, card expands with more information

## Contributing

Something wrong? Don't know what to tell you dog. Open a PR.
