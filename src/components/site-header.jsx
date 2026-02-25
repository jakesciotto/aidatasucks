export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl animate-in-down delay-0">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="group flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 font-mono text-sm font-semibold text-red-400 ring-1 ring-red-500/20 transition-all group-hover:bg-red-500/20 group-hover:ring-red-500/40">
            ai
          </span>
          <span className="text-base font-bold tracking-tight">
            aidatasucks<span className="text-muted-foreground">.com</span>
          </span>
        </a>
        <span className="text-[11px] text-muted-foreground/50 font-mono">
          updated 2026-02-25
        </span>
      </div>
    </header>
  );
}
