import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { VendorTable } from "@/components/vendor-table";
import { GradeBadge } from "@/components/grade-badge";
import { VerifiedBadge } from "@/components/verified-badge";

const SCORE = { yes: 2, partial: 1, no: 0 };

function calcGrade(vendor) {
  const { costApi, usageApi, billingExport } = vendor;

  if (costApi === "yes" && usageApi === "yes" && billingExport === "yes")
    return "A+";
  if (costApi === "yes" && usageApi === "yes" && billingExport === "partial")
    return "A-";
  if (costApi !== "no" && usageApi !== "no" && billingExport === "no")
    return "B-";

  const base = SCORE[costApi] + SCORE[usageApi] + SCORE[billingExport];
  const hasVisibility = costApi !== "no" || usageApi !== "no";
  const score = base + (hasVisibility ? 1 : 0);
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
        <div className="animate-in-up delay-1 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1 font-mono text-xs text-red-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
          Tracking AI vendor transparency
        </div>
        <h1 className="animate-in-up delay-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Which AI vendors actually
          <br />
          <span className="text-muted-foreground">
            let you track what you spend?
          </span>
        </h1>
        <p className="animate-in-up delay-3 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground">
          Nobody should make the two admins at your company doing a second job
          cobble together usage reports downloaded from a wonky dashboard.
          Non-aggregated atomic units of spend should be programmatically
          available to integrate into major cloud cost optimization tools.
          <br></br>
          <br></br>This leads us here -- a comparison of cost APIs, usage
          endpoints, and billing exports across AI providers.
        </p>
      </section>

      {/* Table */}
      <section className="animate-in-up delay-4">
        <VendorTable vendors={vendors} />
      </section>

      {/* Methodology */}
      <section className="animate-in-up delay-5 space-y-5 border-t border-border/50 pt-8">
        <h2 className="text-lg font-semibold tracking-tight">Methodology</h2>

        <div className="max-w-2xl space-y-3 font-mono text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-s uppercase tracking-wider text-foreground">
            Grades
          </h3>
          <p>
            Grades are based on whether a vendor provides programmatic access to
            cost data, usage metrics, and billing exports.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-3 py-2">
              <GradeBadge grade="A+" />
              <span>
                Full coverage — cost API, usage API, and billing export
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-3 py-2">
              <GradeBadge grade="A-" />
              <span>Full cost and usage APIs, partial billing export</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-3 py-2">
              <GradeBadge grade="B" />
              <span>Good visibility, partial billing export</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-3 py-2">
              <GradeBadge grade="B-" />
              <span>Good cost/usage visibility, no billing export</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-3 py-2">
              <GradeBadge grade="C" />
              <span>Partial coverage, significant limitations</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-3 py-2">
              <GradeBadge grade="D" />
              <span>Minimal data, painful to use</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-3 py-2 sm:col-span-2">
              <GradeBadge grade="F" />
              <span>Flying blind. No programmatic cost visibility.</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl space-y-3 font-mono text-sm leading-relaxed text-muted-foreground">
          <h3 className="text- uppercase tracking-wider text-foreground">
            Key
          </h3>
          <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-3 py-2">
            <VerifiedBadge />
            <span>Verified</span>
          </div>
        </div>
      </section>
    </div>
  );
}
