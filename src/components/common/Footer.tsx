"use client";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Left — Brand mark */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-primary font-semibold text-base leading-none select-none" aria-hidden="true">ॐ</span>
          <span className="font-semibold text-foreground/70">VaidikaConnect</span>
        </div>

        {/* Centre — Copyright */}
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          © {year}{" "}
          <span className="font-medium text-foreground/80">
            Soppa Sudheendra Sripada&nbsp;/&nbsp;VaidikaConnect
          </span>
          . All rights reserved.
        </p>

        {/* Right — decorative divider */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground/60">
          <span className="h-px w-8 bg-border/60 inline-block" />
          <span className="italic">Vaidika Dharma</span>
          <span className="h-px w-8 bg-border/60 inline-block" />
        </div>

      </div>
    </footer>
  );
}
