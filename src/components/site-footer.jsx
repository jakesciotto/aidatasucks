export function SiteFooter() {
  return (
    <footer className="animate-in-up delay-6 border-t border-border/50 bg-background/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="font-mono text-xs text-muted-foreground">
          Data wrong? Vendor missing? What are you going to do about it?{" "}
          <a
            href="https://github.com/jakesciotto/aidatasucks"
            className="text-foreground underline decoration-muted-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open a PR
          </a>
          .
        </p>
        <p className="font-mono text-xs text-muted-foreground/60">
          Built for FinOps teams tired of flying blind.
        </p>
      </div>
    </footer>
  );
}
