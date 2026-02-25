const statusConfig = {
  yes: {
    label: "Yes",
    className: "status-yes",
  },
  no: {
    label: "No",
    className: "status-no",
  },
  partial: {
    label: "Partial",
    className: "status-partial",
  },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status];
  return (
    <span
      className={`${config.className} inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium`}
      style={{
        backgroundColor: "var(--status-bg)",
        color: "var(--status-text)",
        borderColor: "var(--status-border)",
      }}
    >
      {config.label}
    </span>
  );
}
