type LogoProps = {
  size?: number;
  color?: string;
  textColor?: string;
  variant?: "mark" | "horizontal" | "favicon";
  className?: string;
};

export function Logo({
  size = 32,
  color = "#534AB7",
  textColor = "#111827",
  variant = "mark",
  className,
}: LogoProps) {
  if (variant === "favicon") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-label="UTM Rápido">
        <rect width="64" height="64" rx="14" fill={color} />
        <path
          d="M14 14 L14 36 C14 47 22 54 32 54 C42 54 50 47 50 36 L50 22 L58 22 L50 10 L42 22 L50 22"
          stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"
        />
      </svg>
    );
  }

  const Mark = (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M14 14 L14 36 C14 47 22 54 32 54 C42 54 50 47 50 36 L50 22 L58 22 L50 10 L42 22 L50 22"
        stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  );

  if (variant === "mark") return Mark;

  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: size * 0.32 }}
      className={className}
      aria-label="UTM Rápido"
    >
      {Mark}
      <span style={{
        fontFamily: "'Sora', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: size * 0.72,
        letterSpacing: "-0.025em",
        color: textColor,
        lineHeight: 1,
      }}>
        utm<span style={{ color }}>.</span>rápido
      </span>
    </span>
  );
}
