import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { VendorTable } from "@/components/vendor-table";

const SCORE = { yes: 2, partial: 1, no: 0 };

function calcGrade(vendor) {
  const base = SCORE[vendor.costApi] + SCORE[vendor.usageApi] + SCORE[vendor.billingExport];
  const hasVisibility = vendor.costApi !== "no" || vendor.usageApi !== "no";
  const score = base + (hasVisibility ? 1 : 0);
  if (score >= 6) return "A";
  if (score >= 4) return "B";
  if (score >= 3) return "C";
  if (score >= 1) return "D";
  return "F";
}

function getVendors() {
  const filePath = path.join(process.cwd(), "src/data/vendors.yaml");
  const file = fs.readFileSync(filePath, "utf8");
  const raw = yaml.load(file);
  return raw.map((v) => ({ ...v, grade: calcGrade(v) }));
}

export default function Home() {
  const vendors = getVendors();

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="space-y-4 pt-8 sm:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1 font-mono text-xs text-red-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
          Tracking AI vendor transparency
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Which AI vendors actually
          <br />
          <span className="text-muted-foreground">let you track what you spend?</span>
        </h1>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground">
          A comparison of cost APIs, usage endpoints, and billing exports across
          AI providers. Built for FinOps teams who need programmatic access to
          their AI spend data -- not a dashboard you have to screenshot.
        </p>
      </section>

      {/* Table */}
      <section>
        <VendorTable vendors={vendors} />
      </section>

      {/* Methodology */}
      <section className="space-y-4 border-t border-border/50 pt-8">
        <h2 className="text-lg font-semibold tracking-tight">Methodology</h2>
        <div className="max-w-2xl space-y-3 font-mono text-sm leading-relaxed text-muted-foreground">
          <p>
            Grades are based on whether a vendor provides programmatic access to
            cost data, usage metrics, and billing exports.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-card/50 px-3 py-2">
              <span className="text-indigo-400 font-semibold">A</span>
              <span className="ml-2">Full API coverage, real-time, granular data</span>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/50 px-3 py-2">
              <span className="text-blue-300 font-semibold">B</span>
              <span className="ml-2">Good coverage, minor gaps or delays</span>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/50 px-3 py-2">
              <span className="text-violet-300 font-semibold">C</span>
              <span className="ml-2">Partial coverage, significant limitations</span>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/50 px-3 py-2">
              <span className="text-pink-400 font-semibold">D</span>
              <span className="ml-2">Minimal data, painful to use</span>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/50 px-3 py-2 sm:col-span-2">
              <span className="text-rose-400 font-semibold">F</span>
              <span className="ml-2">Flying blind. No programmatic cost visibility.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
