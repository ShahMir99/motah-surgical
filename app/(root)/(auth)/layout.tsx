import type { ReactNode } from "react";
import { Brand } from "@/components/admin/Brand";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#10261F] p-12 text-white lg:flex">
        <GridBackdrop />
        <div className="relative">
          <Brand tone="light" />
        </div>
        <InstrumentDrawing />
        <p className="font-editorial relative max-w-md text-[1.75rem] leading-snug text-white/90">
          Publish news, product guides and company updates to the Motah Surgical website.
        </p>
      </aside>
      <main className="flex items-center justify-center px-6 py-12 sm:px-12">{children}</main>
    </div>
  );
}

/** Engineering-drawing grid, a nod to precision instrument manufacturing. */
function GridBackdrop() {
  return (
    <svg className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id="auth-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#auth-grid)" />
    </svg>
  );
}

/** Line drawing of a scalpel with dimension lines, in the brand green. */
function InstrumentDrawing() {
  const grip = Array.from({ length: 9 }, (_, i) => 64 + i * 11);
  return (
    <svg viewBox="0 0 540 220" className="relative w-full max-w-xl" fill="none" aria-hidden>
      {/* dimension: overall length */}
      <g stroke="rgba(255,255,255,0.3)" strokeWidth="1">
        <line x1="30" y1="46" x2="510" y2="46" />
        <line x1="30" y1="38" x2="30" y2="54" />
        <line x1="510" y1="38" x2="510" y2="54" />
        <line x1="30" y1="58" x2="30" y2="100" strokeDasharray="3 4" />
        <line x1="510" y1="58" x2="510" y2="104" strokeDasharray="3 4" />
        <path d="M30 46l8-4v8zM510 46l-8-4v8z" fill="rgba(255,255,255,0.3)" />
      </g>
      {/* dimension: blade */}
      <g stroke="rgba(255,255,255,0.3)" strokeWidth="1">
        <line x1="336" y1="178" x2="510" y2="178" />
        <line x1="336" y1="170" x2="336" y2="186" />
        <line x1="510" y1="170" x2="510" y2="186" />
        <line x1="336" y1="140" x2="336" y2="166" strokeDasharray="3 4" />
        <line x1="510" y1="108" x2="510" y2="166" strokeDasharray="3 4" />
        <path d="M336 178l8-4v8zM510 178l-8-4v8z" fill="rgba(255,255,255,0.3)" />
      </g>
      {/* handle */}
      <g stroke="#18B27F" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <rect x="30" y="110" width="280" height="26" rx="6" />
        {grip.map((x) => (
          <line key={x} x1={x} y1="115" x2={x} y2="131" />
        ))}
        <path d="M310 116h26v14h-26" />
        {/* blade: straight spine, curved cutting edge */}
        <path d="M336 114h120l54-10c-14 28-48 42-96 38l-78-6z" />
        <line x1="352" y1="122" x2="420" y2="122" strokeOpacity="0.5" />
      </g>
    </svg>
  );
}
