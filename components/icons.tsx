export const SPARK = "M12 2.5l2.1 6.4 6.4 2.1-6.4 2.1L12 19.5l-2.1-6.4L3.5 11l6.4-2.1z";

export function Spark({ size = 14, color = "#0b0d10", className = "tw" }: { size?: number; color?: string; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d={SPARK} />
    </svg>
  );
}

export function PlayIcon({ size = 28 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#0b0d10">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function EqBars({ count = 3, height = 14 }: { count?: number; height?: number }) {
  const delays = [0, -0.3, -0.6, -0.2, -0.5, -0.7, -0.4];
  return (
    <span className="eq" aria-hidden="true" style={{ height }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ animationDelay: `${delays[i % delays.length]}s` }} />
      ))}
    </span>
  );
}

export function CodeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
    </svg>
  );
}
