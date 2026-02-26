export function VerifiedBadge() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="inline-block shrink-0"
      aria-label="Verified connector"
    >
      <title>Verified — we&apos;ve built a connector for this provider</title>
      <polygon
        points="8,1 15,8 8,15 1,8"
        fill="rgba(45, 212, 191, 0.12)"
        stroke="rgb(45, 212, 191)"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 8.5L7.25 10.25L10.75 6"
        stroke="rgb(45, 212, 191)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
