"use client";

import { Fragment, useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import posthog from "posthog-js";
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
import { VerifiedBadge } from "@/components/verified-badge";
import { gradeOrder } from "@/lib/grades";

function SortIcon({ field, sortField, sortDir }) {
  const isActive = sortField === field;
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={`ml-1 inline-block transition-all ${isActive ? "text-foreground" : "text-muted-foreground/40"}`}
    >
      <path
        d="M6 2L9 5H3L6 2Z"
        fill={isActive && sortDir === "asc" ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M6 10L3 7H9L6 10Z"
        fill={isActive && sortDir === "desc" ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function Chevron({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VendorName({ vendor, className = "" }) {
  const handleClick = (e) => {
    e.stopPropagation();
    posthog.capture("vendor_link_clicked", {
      vendor_name: vendor.name,
      vendor_slug: vendor.slug,
      vendor_grade: vendor.grade,
      destination_url: vendor.website,
    });
  };

  return (
    <a
      href={vendor.website}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      onClick={handleClick}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-white/90 p-0.5">
        <Image
          src={`/logos/${vendor.slug}.png`}
          alt={`${vendor.name} logo`}
          width={20}
          height={20}
          className="rounded-sm"
        />
      </span>
      <span className="font-medium transition-colors group-hover:text-foreground">
        {vendor.name}
      </span>
      {vendor.verified && <VerifiedBadge />}
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        className="text-muted-foreground/0 transition-all group-hover:text-muted-foreground group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3.5 2.5H9.5V8.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 2.5L2.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

function NotesPanel({ vendor }) {
  return (
    <div className="max-w-3xl space-y-1.5 font-mono text-xs leading-relaxed text-muted-foreground">
      <span className="block text-[10px] uppercase tracking-wider text-foreground">
        Notes
      </span>
      <p>{vendor.notes}</p>
    </div>
  );
}

function VendorCard({ vendor, expanded, onToggle }) {
  const canExpand = Boolean(vendor.notes);
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <VendorName vendor={vendor} className="font-semibold" />
        <GradeBadge grade={vendor.grade} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Cost API
          </span>
          <StatusBadge status={vendor.costApi} />
        </div>
        <div className="space-y-1">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Usage API
          </span>
          <StatusBadge status={vendor.usageApi} />
        </div>
        <div className="space-y-1">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground leading-tight">
            Billing Export
          </span>
          <StatusBadge status={vendor.billingExport} />
        </div>
      </div>
      <div className="border-t border-border/50 pt-3 font-mono text-xs text-muted-foreground">
        <span className="text-[10px] uppercase tracking-wider">Granularity</span>
        <p className="text-foreground">{vendor.granularity}</p>
      </div>
      {canExpand && (
        <>
          <button
            onClick={onToggle}
            aria-expanded={expanded}
            className="flex w-full items-center justify-between border-t border-border/50 pt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            {expanded ? "Hide notes" : "Show notes"}
            <Chevron open={expanded} />
          </button>
          {expanded && <NotesPanel vendor={vendor} />}
        </>
      )}
    </div>
  );
}

const DOMAIN_LABELS = {
  hyperscaler: "Hyperscaler",
  independent: "Independent",
  inference: "Inference",
  generative: "Generative",
  infrastructure: "Infrastructure",
};

function DomainDropdown({ domainFilter, setDomainFilter }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggle = (domain) => {
    setDomainFilter((prev) => {
      const next = new Set(prev);
      next.has(domain) ? next.delete(domain) : next.add(domain);
      posthog.capture("vendor_domain_filtered", {
        active_domains: [...next],
      });
      return next;
    });
  };

  const activeCount = domainFilter.size;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Domain{activeCount > 0 ? ` (${activeCount})` : ""}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 min-w-[160px] rounded-md border border-border bg-card p-1 shadow-md">
          {Object.entries(DOMAIN_LABELS).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <input
                type="checkbox"
                checked={domainFilter.has(value)}
                onChange={() => toggle(value)}
                className="accent-foreground"
              />
              {label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function VendorTable({ vendors }) {
  const [filter, setFilter] = useState("");
  const [domainFilter, setDomainFilter] = useState(new Set());
  const [sortField, setSortField] = useState("grade");
  const [sortDir, setSortDir] = useState("asc");
  const [expanded, setExpanded] = useState(new Set());

  const toggleSort = (field) => {
    const newDir = sortField === field ? (sortDir === "asc" ? "desc" : "asc") : "asc";
    if (sortField === field) {
      setSortDir(newDir);
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    posthog.capture("vendor_sorted", {
      sort_field: field,
      sort_direction: newDir,
    });
  };

  const toggleExpand = (vendor) => {
    if (!vendor.notes) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(vendor.slug)) {
        next.delete(vendor.slug);
      } else {
        next.add(vendor.slug);
        posthog.capture("vendor_expanded", {
          vendor_name: vendor.name,
          vendor_slug: vendor.slug,
          vendor_grade: vendor.grade,
        });
      }
      return next;
    });
  };

  const sorted = useMemo(() => {
    const filtered = vendors.filter((v) => {
      const matchesText = v.name.toLowerCase().includes(filter.toLowerCase());
      const matchesDomain = domainFilter.size === 0 || domainFilter.has(v.domain);
      return matchesText && matchesDomain;
    });
    return [...filtered].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return mul * a.name.localeCompare(b.name);
      return mul * (gradeOrder[a.grade] - gradeOrder[b.grade]);
    });
  }, [vendors, filter, domainFilter, sortField, sortDir]);

  const sortAria = (field) =>
    sortField === field ? (sortDir === "asc" ? "ascending" : "descending") : "none";

  const onHeaderKeyDown = (e, field) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSort(field);
    }
  };

  const onRowKeyDown = (e, vendor) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleExpand(vendor);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <Input
            placeholder="Filter vendors..."
            value={filter}
            onChange={(e) => {
              const value = e.target.value;
              setFilter(value);
              if (value.length > 0) {
                posthog.capture("vendor_searched", {
                  search_query: value,
                });
              }
            }}
            className="pl-9 font-mono text-sm"
          />
        </div>
        <DomainDropdown domainFilter={domainFilter} setDomainFilter={setDomainFilter} />
        <span className="font-mono text-xs text-muted-foreground">
          {sorted.length} vendor{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Desktop: Table */}
      <div className="hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm md:block">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead
                aria-sort={sortAria("name")}
                className="h-12 w-[18%] px-4 font-mono text-xs uppercase tracking-wider text-muted-foreground"
              >
                <button
                  onClick={() => toggleSort("name")}
                  onKeyDown={(e) => onHeaderKeyDown(e, "name")}
                  className="inline-flex select-none items-center uppercase transition-colors hover:text-foreground"
                >
                  Vendor
                  <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="h-12 w-[12%] px-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Cost API
              </TableHead>
              <TableHead className="h-12 w-[12%] px-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Usage API
              </TableHead>
              <TableHead className="h-12 w-[14%] px-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Billing Export
              </TableHead>
              <TableHead className="h-12 w-[34%] px-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Granularity
              </TableHead>
              <TableHead
                aria-sort={sortAria("grade")}
                className="h-12 w-[10%] px-4 font-mono text-xs uppercase tracking-wider text-muted-foreground"
              >
                <button
                  onClick={() => toggleSort("grade")}
                  onKeyDown={(e) => onHeaderKeyDown(e, "grade")}
                  className="inline-flex select-none items-center uppercase transition-colors hover:text-foreground"
                >
                  Grade
                  <SortIcon field="grade" sortField={sortField} sortDir={sortDir} />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((vendor, i) => {
              const isOpen = expanded.has(vendor.slug);
              const canExpand = Boolean(vendor.notes);
              return (
                <Fragment key={vendor.slug}>
                  <TableRow
                    className={`animate-in-fade border-border/50 transition-colors hover:bg-muted/30 ${canExpand ? "cursor-pointer" : ""}`}
                    style={{ animationDelay: `${i * 30}ms` }}
                    onClick={() => toggleExpand(vendor)}
                    role={canExpand ? "button" : undefined}
                    tabIndex={canExpand ? 0 : undefined}
                    aria-expanded={canExpand ? isOpen : undefined}
                    onKeyDown={canExpand ? (e) => onRowKeyDown(e, vendor) : undefined}
                  >
                    <TableCell className="px-4 py-3">
                      <VendorName vendor={vendor} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge status={vendor.costApi} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge status={vendor.usageApi} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge status={vendor.billingExport} />
                    </TableCell>
                    <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {vendor.granularity}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <GradeBadge grade={vendor.grade} />
                        {canExpand && <Chevron open={isOpen} />}
                      </div>
                    </TableCell>
                  </TableRow>
                  {canExpand && isOpen && (
                    <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                      <TableCell colSpan={6} className="px-4 pb-4 pt-0">
                        <NotesPanel vendor={vendor} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: Cards */}
      <div className="grid gap-3 md:hidden">
        {sorted.map((vendor, i) => (
          <div
            key={vendor.slug}
            className="animate-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <VendorCard
              vendor={vendor}
              expanded={expanded.has(vendor.slug)}
              onToggle={() => toggleExpand(vendor)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
