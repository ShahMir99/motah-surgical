"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/admin/ui";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "danger",
  loading,
  onConfirm,
  onCancel,
}: Props) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const latest = useRef({ loading, onCancel });
  useEffect(() => {
    latest.current = { loading, onCancel };
  });

  // Runs only when the dialog opens or closes, so parent re-renders don't move focus.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !latest.current.loading) latest.current.onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
    >
      <div className="absolute inset-0 bg-[#10261F]/45" onClick={() => !loading && onCancel()} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl shadow-[#10261F]/20">
        <h2 id={titleId} className="text-lg font-semibold text-[#10261F]">
          {title}
        </h2>
        {description && (
          <p id={descId} className="mt-2 text-sm leading-relaxed text-[#5E716B]">
            {description}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex h-10 items-center rounded-md border border-[#CBD6D2] bg-white px-4 text-sm font-medium text-[#10261F] hover:bg-[#F2F5F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/60 focus-visible:ring-offset-2 disabled:opacity-55"
          >
            {cancelLabel}
          </button>
          <Button variant={tone} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
