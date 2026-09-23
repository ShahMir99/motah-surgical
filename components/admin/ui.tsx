"use client";

import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/60 focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-55 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  // Dark text on the brand green keeps contrast above WCAG AA.
  primary: "bg-[#18B27F] font-semibold text-[#062319] hover:bg-[#15A073]",
  secondary: "border border-[#CBD6D2] bg-white font-medium text-[#10261F] hover:bg-[#F2F5F4]",
  ghost: "font-medium text-[#3E534C] hover:bg-[#E9EFED] hover:text-[#10261F]",
  danger: "bg-[#B42318] font-semibold text-white hover:bg-[#99201A]",
};

const sizes: Record<Size, string> = { sm: "h-8 px-3", md: "h-10 px-4", lg: "h-11 px-5" };

export function buttonClass(variant: Variant = "secondary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; loading?: boolean };

export function Button({ variant, size, loading, className, disabled, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, size, className)}
      {...rest}
    >
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export const fieldClass =
  "rounded-md border border-[#CBD6D2] bg-white px-3 py-2 text-sm text-[#10261F] placeholder:text-[#8A9A95] " +
  "transition-colors focus:border-[#18B27F] focus:outline-none focus:ring-2 focus:ring-[#18B27F]/25 " +
  "aria-[invalid=true]:border-[#B42318] aria-[invalid=true]:ring-[#B42318]/20";

export const inputClass = `w-full ${fieldClass}`;

export function Field({
  label,
  htmlFor,
  hint,
  aside,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium text-[#10261F]">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-[#5E716B]">{hint}</p>}
    </div>
  );
}

/** Counter that turns amber past the ideal length and red past the limit. */
export function CharCount({ value, ideal, max }: { value: string; ideal?: number; max: number }) {
  const n = value.length;
  const color = n > max ? "text-[#B42318]" : ideal && n > ideal ? "text-[#A15C07]" : "text-[#5E716B]";
  return <span className={`text-xs tabular-nums ${color}`}>{n}/{ideal ?? max}</span>;
}

export function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 cursor-pointer rounded border-[#B9C6C1] accent-[#18B27F] disabled:cursor-not-allowed"
    />
  );
}

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  invalid?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        className={`${inputClass} h-11 pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded text-[#5E716B] hover:bg-[#EEF1F0] hover:text-[#10261F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/60"
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
      </button>
    </div>
  );
}
