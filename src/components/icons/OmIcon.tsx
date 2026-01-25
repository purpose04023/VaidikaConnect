import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function OmIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M9.5 7.5a4.5 4.5 0 014.5 4.5V13h-1.5a3 3 0 100 6h1a4.5 4.5 0 100-9V12a3 3 0 10-3 3" />
      <path d="M14.5 7.5c.333.333.5.5.5 1" />
    </svg>
  );
}
