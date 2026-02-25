# aidatasucks.com Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a static single-page comparison site that grades AI vendors on cost/usage API transparency for FinOps.

**Architecture:** Next.js 15 App Router with static export. shadcn/ui components over Tailwind CSS. Vendor data lives in a single JSON file imported at build time. Dark-first theme.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Table

**Design doc:** `docs/plans/2026-02-25-aidatasucks-design.md`

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: entire project scaffold via `create-next-app`

**Step 1: Initialize the project**

The working directory already has a git repo and a `docs/` folder. Scaffold Next.js into the current directory.

```bash
cd /Users/jakesciotto/github/aidatasucks
npx --yes create-next-app@latest . --ts --tailwind --eslint --app --src-dir --use-npm --turbopack
```

If prompted about existing files, accept. The `docs/` folder should survive.

**Step 2: Verify it runs**

```bash
npm run dev &
sleep 5
curl -s http://localhost:3000 | head -20
kill %1
```

Expected: HTML output from the default Next.js page.

**Step 3: Configure static export**

Edit `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
```

**Step 4: Verify static build**

```bash
npm run build
ls out/
```

Expected: `out/` directory with `index.html` and static assets.

**Step 5: Commit**

```bash
git add -A
git commit -m "scaffold: Next.js 15 with static export, Tailwind, TypeScript"
```

---

### Task 2: Install and Initialize shadcn/ui

**Files:**
- Modify: `package.json` (dependencies)
- Create: `src/lib/utils.ts`
- Create: `components.json`

**Step 1: Initialize shadcn**

```bash
npx --yes shadcn@latest init -d
```

Accept defaults (New York style, Zinc base color). This creates `components.json` and `src/lib/utils.ts`.

**Step 2: Install required shadcn components**

```bash
npx shadcn@latest add badge table input
```

**Step 3: Verify the components exist**

```bash
ls src/components/ui/
```

Expected: `badge.tsx`, `table.tsx`, `input.tsx` (and any dependencies like `button.tsx`).

**Step 4: Commit**

```bash
git add -A
git commit -m "deps: initialize shadcn/ui with badge, table, input components"
```

---

### Task 3: Create Vendor Data and Types

**Files:**
- Create: `src/data/vendors.json`
- Create: `src/types/vendor.ts`

**Step 1: Define the TypeScript type**

Create `src/types/vendor.ts`:

```ts
export type ApiStatus = "yes" | "no" | "partial";

export type Grade = "A" | "B" | "C" | "D" | "F";

export interface Vendor {
  name: string;
  slug: string;
  costApi: ApiStatus;
  usageApi: ApiStatus;
  billingExport: ApiStatus;
  granularity: string;
  dataDelay: string;
  grade: Grade;
  notes?: string;
}
```

**Step 2: Create placeholder vendor data**

Create `src/data/vendors.json` with 4-5 placeholder entries so the table has something to render. Use realistic-looking but clearly placeholder data:

```json
[
  {
    "name": "Placeholder Corp",
    "slug": "placeholder-corp",
    "costApi": "yes",
    "usageApi": "partial",
    "billingExport": "no",
    "granularity": "Per-model",
    "dataDelay": "~24h",
    "grade": "C",
    "notes": "Placeholder entry"
  },
  {
    "name": "Example AI",
    "slug": "example-ai",
    "costApi": "no",
    "usageApi": "no",
    "billingExport": "no",
    "granularity": "None",
    "dataDelay": "N/A",
    "grade": "F",
    "notes": "Placeholder entry"
  },
  {
    "name": "Acme Models",
    "slug": "acme-models",
    "costApi": "yes",
    "usageApi": "yes",
    "billingExport": "yes",
    "granularity": "Per-model, per-token",
    "dataDelay": "Real-time",
    "grade": "A",
    "notes": "Placeholder entry"
  },
  {
    "name": "FooBar ML",
    "slug": "foobar-ml",
    "costApi": "partial",
    "usageApi": "yes",
    "billingExport": "partial",
    "granularity": "Aggregate only",
    "dataDelay": "~48h",
    "grade": "D",
    "notes": "Placeholder entry"
  }
]
```

**Step 3: Commit**

```bash
git add src/types/vendor.ts src/data/vendors.json
git commit -m "data: add vendor type definition and placeholder data"
```

---

### Task 4: Build Badge Components

**Files:**
- Create: `src/components/status-badge.tsx`
- Create: `src/components/grade-badge.tsx`

**Step 1: Build the StatusBadge component**

Create `src/components/status-badge.tsx`:

```tsx
import { Badge } from "@/components/ui/badge";
import { type ApiStatus } from "@/types/vendor";

const statusConfig: Record<ApiStatus, { label: string; className: string }> = {
  yes: { label: "Yes", className: "bg-green-600 hover:bg-green-600 text-white" },
  no: { label: "No", className: "bg-red-600 hover:bg-red-600 text-white" },
  partial: { label: "Partial", className: "bg-yellow-600 hover:bg-yellow-600 text-white" },
};

export function StatusBadge({ status }: { status: ApiStatus }) {
  const config = statusConfig[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}
```

**Step 2: Build the GradeBadge component**

Create `src/components/grade-badge.tsx`:

```tsx
import { Badge } from "@/components/ui/badge";
import { type Grade } from "@/types/vendor";

const gradeConfig: Record<Grade, string> = {
  A: "bg-green-600 hover:bg-green-600 text-white",
  B: "bg-lime-600 hover:bg-lime-600 text-white",
  C: "bg-yellow-600 hover:bg-yellow-600 text-white",
  D: "bg-orange-600 hover:bg-orange-600 text-white",
  F: "bg-red-600 hover:bg-red-600 text-white",
};

export function GradeBadge({ grade }: { grade: Grade }) {
  return <Badge className={gradeConfig[grade]}>{grade}</Badge>;
}
```

**Step 3: Commit**

```bash
git add src/components/status-badge.tsx src/components/grade-badge.tsx
git commit -m "feat: add StatusBadge and GradeBadge components"
```

---

### Task 5: Build the Vendor Comparison Table

**Files:**
- Create: `src/components/vendor-table.tsx`

This is the core component. Uses shadcn Table (not DataTable -- we keep it simpler since we only need basic sort + filter, no need for TanStack Table's full complexity at this stage).

**Step 1: Build the VendorTable component**

Create `src/components/vendor-table.tsx`. This component should:

- Accept `vendors: Vendor[]` as props
- Render a shadcn `Table` with all columns from the design
- Include a text `Input` above the table for filtering by vendor name
- Include sortable column headers (click to toggle asc/desc) for Vendor name and Grade
- Use `StatusBadge` for Cost API, Usage API, Billing Export columns
- Use `GradeBadge` for Grade column
- Wrap the table in `overflow-x-auto` for mobile horizontal scrolling
- Manage filter text and sort state with `useState`

The sorting/filtering logic is simple enough to do inline with `Array.filter()` and `Array.sort()` -- no external library needed.

```tsx
"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { GradeBadge } from "@/components/grade-badge";
import { type Vendor, type Grade } from "@/types/vendor";

type SortField = "name" | "grade";
type SortDir = "asc" | "desc";

const gradeOrder: Record<Grade, number> = { A: 1, B: 2, C: 3, D: 4, F: 5 };

export function VendorTable({ vendors }: { vendors: Vendor[] }) {
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("grade");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    const filtered = vendors.filter((v) =>
      v.name.toLowerCase().includes(filter.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return mul * a.name.localeCompare(b.name);
      return mul * (gradeOrder[a.grade] - gradeOrder[b.grade]);
    });
  }, [vendors, filter, sortField, sortDir]);

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filter vendors..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-sm"
      />
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("name")}
              >
                Vendor{sortIndicator("name")}
              </TableHead>
              <TableHead>Cost API</TableHead>
              <TableHead>Usage API</TableHead>
              <TableHead>Billing Export</TableHead>
              <TableHead>Granularity</TableHead>
              <TableHead>Data Delay</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("grade")}
              >
                FinOps Grade{sortIndicator("grade")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((vendor) => (
              <TableRow key={vendor.slug}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell><StatusBadge status={vendor.costApi} /></TableCell>
                <TableCell><StatusBadge status={vendor.usageApi} /></TableCell>
                <TableCell><StatusBadge status={vendor.billingExport} /></TableCell>
                <TableCell>{vendor.granularity}</TableCell>
                <TableCell>{vendor.dataDelay}</TableCell>
                <TableCell><GradeBadge grade={vendor.grade} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

**Step 2: Verify it compiles**

```bash
npm run build
```

Expected: Build succeeds (even though it is not yet used in a page, the module should compile).

**Step 3: Commit**

```bash
git add src/components/vendor-table.tsx
git commit -m "feat: add VendorTable component with sort and filter"
```

---

### Task 6: Build Header and Footer

**Files:**
- Create: `src/components/site-header.tsx`
- Create: `src/components/site-footer.tsx`

**Step 1: Build the SiteHeader**

Create `src/components/site-header.tsx`. Simple: site name on the left. Dark mode toggle can be deferred -- for now just the header layout.

```tsx
export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-14 items-center px-4">
        <span className="text-lg font-bold tracking-tight">aidatasucks.com</span>
      </div>
    </header>
  );
}
```

**Step 2: Build the SiteFooter**

Create `src/components/site-footer.tsx`:

```tsx
export function SiteFooter() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <p>
        Data wrong?{" "}
        <a
          href="https://github.com/jakesciotto/aidatasucks"
          className="underline hover:text-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open a PR
        </a>
        .
      </p>
    </footer>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/site-header.tsx src/components/site-footer.tsx
git commit -m "feat: add SiteHeader and SiteFooter components"
```

---

### Task 7: Assemble the Main Page

**Files:**
- Modify: `src/app/page.tsx` (replace default content)
- Modify: `src/app/layout.tsx` (add header/footer to layout, set metadata)

**Step 1: Update layout.tsx**

Modify `src/app/layout.tsx` to:
- Set metadata: title "aidatasucks.com", description about the comparison
- Add `SiteHeader` and `SiteFooter` wrapping `{children}`
- Keep the existing font and global CSS imports
- Set dark mode as default via `className="dark"` on the `<html>` element

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "aidatasucks.com",
  description: "Which AI vendors actually let you track what you spend? A FinOps comparison.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
```

**Step 2: Replace page.tsx**

Replace `src/app/page.tsx` entirely:

```tsx
import vendors from "@/data/vendors.json";
import { VendorTable } from "@/components/vendor-table";
import { type Vendor } from "@/types/vendor";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">aidatasucks.com</h1>
        <p className="text-lg text-muted-foreground">
          Which AI vendors actually let you track what you spend?
        </p>
      </section>

      <section>
        <VendorTable vendors={vendors as Vendor[]} />
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Methodology</h2>
        <p className="text-sm text-muted-foreground max-w-prose">
          Grades are based on whether a vendor provides programmatic access to cost
          data, usage metrics, and billing exports. An &quot;A&quot; means full API
          coverage with real-time, granular data. An &quot;F&quot; means you are
          flying blind. Partial credit for vendors that expose some data but make
          it painful to use.
        </p>
      </section>
    </div>
  );
}
```

**Step 3: Verify the full page renders**

```bash
npm run build
```

Expected: Static build succeeds with `out/index.html` containing the full page.

**Step 4: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat: assemble main page with hero, table, methodology, layout"
```

---

### Task 8: Dark Mode and Visual Polish

**Files:**
- Modify: `src/app/globals.css` (if needed for dark mode tweaks)
- Modify: `src/components/site-header.tsx` (add dark mode toggle, optional)

**Step 1: Verify dark mode works**

Since we set `className="dark"` on `<html>`, shadcn components should render in dark mode by default. Run the dev server and visually verify:

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. Confirm:
- Dark background
- Table is readable with good contrast
- Badges are visible and color-coded
- Filter input works
- Sort toggles work

**Step 2: Minor CSS adjustments if needed**

If the default dark theme needs tweaks, adjust `globals.css`. The goal is high-contrast, clean, readable.

**Step 3: Commit any adjustments**

```bash
git add -A
git commit -m "style: dark mode and visual polish"
```

---

### Task 9: Final Build Verification and Cleanup

**Files:**
- Modify: `.gitignore` (ensure `out/`, `.next/`, `node_modules/` are ignored)

**Step 1: Clean build**

```bash
rm -rf .next out
npm run build
```

Expected: Clean build, `out/` directory with static files.

**Step 2: Verify .gitignore**

Ensure `.gitignore` includes:
- `node_modules/`
- `.next/`
- `out/`
- `.env` (per global rules)

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final build verification and cleanup"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Scaffold Next.js project with static export |
| 2 | Install and init shadcn/ui with required components |
| 3 | Create vendor data JSON and TypeScript types |
| 4 | Build StatusBadge and GradeBadge components |
| 5 | Build VendorTable with sort and filter |
| 6 | Build SiteHeader and SiteFooter |
| 7 | Assemble main page and layout |
| 8 | Dark mode verification and visual polish |
| 9 | Final build verification and cleanup |
