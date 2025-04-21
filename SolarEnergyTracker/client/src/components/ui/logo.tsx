import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

export function Logo({ className, size = "md", variant = "dark" }: LogoProps) {
  const sizes = {
    sm: { container: "w-8 h-8", logo: "w-6 h-6", text: "text-lg" },
    md: { container: "w-10 h-10", logo: "w-8 h-8", text: "text-xl" },
    lg: { container: "w-12 h-12", logo: "w-10 h-10", text: "text-2xl" },
  };

  const variants = {
    dark: { bg: "bg-primary", text: "text-primary" },
    light: { bg: "bg-white", text: "text-white" },
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div
        className={cn(
          sizes[size].container,
          variants[variant].bg,
          "rounded-md flex items-center justify-center"
        )}
      >
        <SolarLogoIcon
          className={cn(sizes[size].logo, {
            "text-white": variant === "dark",
            "text-primary": variant === "light",
          })}
        />
      </div>
      <h1 className={cn("font-heading font-bold", sizes[size].text, variants[variant].text)}>
        SolarConnect
      </h1>
    </div>
  );
}

function SolarLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 8V19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 5V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13 5V19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 5V12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
