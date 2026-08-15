type Point = { label: string; value: number };

/** Lightweight SVG area chart — deterministic sizing, no measurement pass. */
export function AreaTrend({ data }: { data: Point[] }) {
  const w = 700;
  const h = 200;
  const pad = 12;
  const max = Math.max(...data.map((d) => d.value)) * 1.15;
  const min = Math.min(...data.map((d) => d.value)) * 0.85;
  const x = (i: number) => pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1);
  const y = (v: number) => h - pad - ((v - min) / Math.max(1, max - min)) * (h - pad * 2);
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${h} L${x(0)},${h} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-52 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={pad}
            x2={w - pad}
            y1={pad + t * (h - pad * 2)}
            y2={pad + t * (h - pad * 2)}
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}
        <path d={area} fill="url(#revGrad)" />
        <path
          d={line}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
        {data.map((d, i) => (
          <circle key={d.label} cx={x(i)} cy={y(d.value)} r="3" fill="var(--chart-1)" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between px-1 text-[11px] text-muted-foreground">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

/** Lightweight SVG donut using stroke-dasharray segments. */
export function Donut({
  data,
  colors,
}: {
  data: { category: string; value: number }[];
  colors: string[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 54;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 140 140" className="mx-auto h-40 w-40">
      <g transform="rotate(-90 70 70)">
        {data.map((d, i) => {
          const len = (d.value / total) * c;
          const seg = (
            <circle
              key={d.category}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth="16"
              strokeDasharray={`${Math.max(0, len - 3)} ${c - Math.max(0, len - 3)}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return seg;
        })}
      </g>
      <text
        x="70"
        y="66"
        textAnchor="middle"
        className="fill-muted-foreground"
        style={{ fontSize: 10 }}
      >
        Top share
      </text>
      <text
        x="70"
        y="84"
        textAnchor="middle"
        className="fill-foreground"
        style={{ fontSize: 18, fontWeight: 600 }}
      >
        {data[0]?.value ?? 0}%
      </text>
    </svg>
  );
}
