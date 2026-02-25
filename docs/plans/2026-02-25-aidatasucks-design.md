# aidatasucks.com -- Design Document

## Purpose

A static, single-page comparison site that grades AI vendors on their cost and usage API transparency. Aimed at FinOps practitioners who need to know which vendors actually let you track spend programmatically.

## Architecture

- **Framework:** Next.js 15 (App Router), static export (`output: 'export'`)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Data:** Single `data/vendors.json` file, imported at build time
- **Deployment:** Static HTML (Vercel, Cloudflare Pages, GitHub Pages, etc.)
- **Pages:** One page (`/`)

## Page Layout

### 1. Header/Nav

Site name "aidatasucks.com" left-aligned. Dark mode toggle right-aligned. Minimal.

### 2. Hero Section

Large heading with site name. Subheading: one-liner explaining purpose (e.g. "Which AI vendors actually let you track what you spend?"). No images.

### 3. Comparison Table (core)

shadcn DataTable (TanStack Table) with the following columns:

| Column          | Type                          |
|-----------------|-------------------------------|
| Vendor          | Text (vendor name)            |
| Cost API        | Badge: Yes / No / Partial     |
| Usage API       | Badge: Yes / No / Partial     |
| Billing Export  | Badge: Yes / No / Partial     |
| Granularity     | Text (e.g. "Per-model, per-token") |
| Data Delay      | Text (e.g. "Real-time", "~24h")   |
| FinOps Grade    | Letter grade A-F, color-coded |

Features:
- Column header sorting
- Text search filtering by vendor name
- Horizontal scroll on mobile

### 4. Methodology Section

Short paragraph explaining how grades are assigned. Transparent criteria.

### 5. Footer

"Data wrong? Open a PR." with GitHub repo link. Last updated date.

## Data Schema

File: `data/vendors.json`

```json
[
  {
    "name": "string",
    "slug": "string",
    "costApi": "yes | no | partial",
    "usageApi": "yes | no | partial",
    "billingExport": "yes | no | partial",
    "granularity": "string",
    "dataDelay": "string",
    "grade": "A | B | C | D | F",
    "notes": "string (optional)"
  }
]
```

## Components

| Component               | Purpose                                    |
|-------------------------|--------------------------------------------|
| `app/page.tsx`          | Main page, imports data, renders sections  |
| `vendor-table.tsx`      | DataTable with columns, sorting, filtering |
| `grade-badge.tsx`       | Letter grade badge with color mapping      |
| `status-badge.tsx`      | Yes/No/Partial badge                       |
| `site-header.tsx`       | Nav with dark mode toggle                  |
| `site-footer.tsx`       | Footer with GitHub link                    |

## Visual Direction

- Dark-first theme with light mode toggle
- Clean, high-contrast table
- No decorative elements
- Opinionated tone -- grades and color coding do the shaming

## Decisions

- Single JSON file over MDX or hardcoded data: easiest to contribute to via PRs
- Table over card grid: comparison is the primary use case, tables win for side-by-side
- Single page over multi-page: no need for vendor detail pages at MVP
- Static export: no server needed, deploy anywhere
