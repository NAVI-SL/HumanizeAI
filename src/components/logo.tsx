import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    className={cn("h-8 w-auto text-primary", className)}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="ClarityFlow Logo"
  >
    <path
      d="M30 70C30 81.0457 38.9543 90 50 90C61.0457 90 70 81.0457 70 70L70 30C70 18.9543 61.0457 10 50 10C38.9543 10 30 18.9543 30 30"
      stroke="currentColor"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30 30C30 41.0457 38.9543 50 50 50C61.0457 50 70 41.0457 70 30"
      stroke="currentColor"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
