type StampBadgeProps = {
  label: string;
  sublabel?: string;
  tone?: "gold" | "teal";
  animate?: boolean;
  size?: number;
};

export default function StampBadge({
  label,
  sublabel,
  tone = "gold",
  animate = false,
  size = 176,
}: StampBadgeProps) {
  const ring = tone === "gold" ? "#C89B3C" : "#1D8A82";
  const inner = tone === "gold" ? "#9C7527" : "#146862";

  return (
    <div
      className={`relative inline-flex select-none items-center justify-center ${
        animate ? "animate-stamp" : ""
      }`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}${sublabel ? `, ${sublabel}` : ""}`}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="-rotate-6 drop-shadow-[0_10px_20px_rgba(16,27,45,0.25)]"
      >
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke={ring}
          strokeWidth="3"
          strokeDasharray="2 6"
        />
        <circle cx="100" cy="100" r="80" fill="none" stroke={ring} strokeWidth="2" />
        <circle cx="100" cy="100" r="72" fill="none" stroke={inner} strokeWidth="1" />
        <path
          id="stampCurveTop"
          d="M 32 100 A 68 68 0 0 1 168 100"
          fill="none"
        />
        <path
          id="stampCurveBottom"
          d="M 168 108 A 68 68 0 0 1 32 108"
          fill="none"
        />
        <text fill={ring} fontSize="12.5" fontWeight={600} letterSpacing="2.5">
          <textPath href="#stampCurveTop" startOffset="50%" textAnchor="middle">
            {label.toUpperCase()}
          </textPath>
        </text>
        {sublabel && (
          <text fill={inner} fontSize="10" fontWeight={500} letterSpacing="2">
            <textPath href="#stampCurveBottom" startOffset="50%" textAnchor="middle">
              {sublabel.toUpperCase()}
            </textPath>
          </text>
        )}
        <g transform="translate(100,100)">
          <path
            d="M -20 4 L -7 17 L 22 -14"
            fill="none"
            stroke={inner}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
