import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { VendorTable } from "@/components/vendor-table";
import { GradeBadge } from "@/components/grade-badge";
import { VerifiedBadge } from "@/components/verified-badge";
import { calcGrade, gradeLegend } from "@/lib/grades";

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
          <h3 className="text-sm uppercase tracking-wider text-foreground">
            Grades
          </h3>
          <p>
            Grades are based on whether a vendor provides programmatic access to
            cost data, usage metrics, and billing exports.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {gradeLegend.map(({ grade, desc, wide }) => (
              <div
                key={grade}
                className={`flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-3 py-2 ${wide ? "sm:col-span-2" : ""}`}
              >
                <GradeBadge grade={grade} />
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl space-y-3 font-mono text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-sm uppercase tracking-wider text-foreground">
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
