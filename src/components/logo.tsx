import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    className={cn("h-8 w-auto text-primary", className)}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="HumanizeAI Logo"
  >
    <path d="M50 10 V 30" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M50 70 V 90" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M10 50 H 30" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M70 50 H 90" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>

    <rect x="30" y="30" width="40" height="40" rx="5" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round"/>

    <circle cx="50" cy="50" r="8" fill="currentColor" />
</svg>
);
