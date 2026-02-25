const gradeClass = {
  A: "grade-a",
  B: "grade-b",
  C: "grade-c",
  D: "grade-d",
  F: "grade-f",
};

export function GradeBadge({ grade }) {
  return (
    <span
      className={`${gradeClass[grade]} inline-flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold ring-1`}
      style={{
        backgroundColor: "var(--grade-bg)",
        color: "var(--grade-text)",
        ringColor: "var(--grade-border)",
        "--tw-ring-color": "var(--grade-border)",
      }}
    >
      {grade}
    </span>
  );
}
