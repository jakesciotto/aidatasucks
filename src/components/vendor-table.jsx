"use client";

import { useState, useMemo } from "react";
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

const gradeOrder = { "A+": 1, "A-": 2, B: 3, "B-": 4, C: 5, D: 6, F: 7 };

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

function VendorName({ vendor, className = "" }) {
  const handleClick = () => {
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

function VendorCard({ vendor }) {
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
    </div>
  );
}

export function VendorTable({ vendors }) {
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("grade");
  const [sortDir, setSortDir] = useState("asc");

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

  const sorted = useMemo(() => {
    const filtered = vendors.filter((v) =>
      v.name.toLowerCase().includes(filter.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return mul * a.name.localeCompare(b.name);
      return mul * (gradeOrder[a.grade] - gradeOrder[b.grade]);
    });
  }, [vendors, filter, sortField, sortDir]);

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
                className="h-12 w-[18%] cursor-pointer select-none px-4 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => toggleSort("name")}
              >
                Vendor
                <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
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
                className="h-12 w-[10%] cursor-pointer select-none px-4 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => toggleSort("grade")}
              >
                Grade
                <SortIcon field="grade" sortField={sortField} sortDir={sortDir} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((vendor, i) => (
              <TableRow
                key={vendor.slug}
                className="animate-in-fade border-border/50 transition-colors hover:bg-muted/30"
                style={{ animationDelay: `${500 + i * 40}ms` }}
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
                  <GradeBadge grade={vendor.grade} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: Cards */}
      <div className="grid gap-3 md:hidden">
        {sorted.map((vendor, i) => (
          <div
            key={vendor.slug}
            className="animate-in-up"
            style={{ animationDelay: `${500 + i * 60}ms` }}
          >
            <VendorCard vendor={vendor} />
          </div>
        ))}
      </div>
    </div>
  );
}
