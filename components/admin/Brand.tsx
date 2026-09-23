export function Brand({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#18B27F]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="#062319" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={`block text-sm font-semibold ${light ? "text-white" : "text-[#10261F]"}`}>Motah Surgical</span>
        <span className={`block text-xs ${light ? "text-white/60" : "text-[#5E716B]"}`}>Website admin</span>
      </span>
    </span>
  );
}
