"use client"
import { useEffect, useRef, useState } from "react";

export function Counter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        const duration = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center md:text-left">
      <div className="text-5xl font-semibold text-primary lg:text-6xl">
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
