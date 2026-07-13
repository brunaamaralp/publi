import { cn } from "@/lib/utils";

type PubliLogoProps = {
  /** `light` = texto escuro (fundo claro); `dark` = texto branco (fundo escuro) */
  variant?: "light" | "dark";
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: { mark: "size-8", text: "text-lg", gap: "gap-2" },
  md: { mark: "size-10", text: "text-xl", gap: "gap-2.5" },
  lg: { mark: "size-12", text: "text-2xl", gap: "gap-3" },
} as const;

export function PubliLogo({
  variant = "light",
  showWordmark = true,
  size = "md",
  className,
}: PubliLogoProps) {
  const s = SIZES[size];
  const wordmarkClass =
    variant === "dark" ? "text-white" : "text-foreground";

  return (
    <span
      className={cn("inline-flex items-center", s.gap, className)}
      aria-label="Publi"
    >
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-[10px] bg-verde-carvao",
          s.mark,
        )}
        aria-hidden
      >
        <svg
          viewBox="0 0 32 32"
          className="size-[55%]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 22V10h5.2c3.2 0 5.3 1.8 5.3 4.5 0 2.1-1.2 3.6-3.1 4.1L20 22h-3.4l-4.2-6.8H11.2V22H8zm3.2-9.4h1.8c1.5 0 2.4.7 2.4 1.9s-.9 1.9-2.4 1.9h-1.8v-3.8z"
            fill="white"
          />
          <circle cx="23.5" cy="10.5" r="2.5" className="fill-verde-neon" />
        </svg>
      </span>
      {showWordmark ? (
        <span className={cn("font-display font-bold tracking-tight", s.text, wordmarkClass)}>
          Publi
        </span>
      ) : null}
    </span>
  );
}
