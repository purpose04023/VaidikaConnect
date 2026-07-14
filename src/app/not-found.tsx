"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center divine-bg px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-black text-foreground/10 select-none">404</h1>
        <div className="relative -mt-20">
          <h2 className="text-3xl font-bold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button asChild className="divine-button px-8 py-6 text-lg rounded-full shadow-xl">
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}
