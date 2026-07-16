import { gradeClass } from "@/lib/grades";

export function GradeBadge({ grade }) {
  return (
    <span
      className={`${gradeClass[grade] ?? ""} inline-flex h-8 min-w-8 px-1.5 items-center justify-center rounded-lg font-mono text-sm font-bold ring-1`}
      style={{
        backgroundColor: "var(--grade-bg)",
        color: "var(--grade-text)",
        "--tw-ring-color": "var(--grade-border)",
      }}
    >
      {grade}
    </span>
  );
}
