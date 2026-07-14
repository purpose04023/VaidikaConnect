"use client";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Left — Brand mark */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <img src="/logo.jpg" alt="" className="w-5 h-5 rounded-full object-cover shrink-0" aria-hidden="true" />
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

        {/* Right — Legal Links */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
          <a href="/privacy" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
          <span className="h-3 w-px bg-border" />
          <a href="/terms" className="hover:text-amber-500 transition-colors">Terms of Service</a>
        </div>

      </div>
    </footer>
  );
}
