"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import type { BlogImage } from "@/types/blog";
import { uploadImage } from "@/lib/apis/admin-api";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_MB } from "@/lib/apis/upload-config";
import { Button, Field, inputClass } from "@/components/admin/ui";

function Progress({ value }: { value: number }) {

  return (
    <div className="w-full max-w-[12rem]" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
      <div className="h-1.5 overflow-hidden rounded-full bg-[#DCE3E0]">
        <div className="h-full rounded-full bg-[#18B27F] transition-[width] duration-150" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-2 text-center text-xs tabular-nums text-[#3E534C]">Uploading {value}%</p>
    </div>
  );
}

export function CoverImageField({ value, onChange }: { value: BlogImage | null; onChange: (value: BlogImage | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const uploading = progress !== null;

  async function handleFile(file?: File | null) {
    if (!file || uploading) return;
    setProgress(0);
    try {
      const { url, key } = await uploadImage(file, setProgress);
      onChange({ url, key, alt: value?.alt ?? "" });
      toast.success("Cover image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The image couldn't be uploaded.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const picker = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPTED_IMAGE_TYPES.join(",")}
      className="sr-only"
      tabIndex={-1}
      aria-hidden
      onChange={(e) => handleFile(e.target.files?.[0])}
    />
  );

  if (value) {
    return (
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-md border border-[#E6ECEA] bg-[#EEF1F0]">
          <img src={value.url} alt={value.alt || "Cover image preview"} className="aspect-[16/9] w-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 grid place-items-center bg-white/85 p-4">
              <Progress value={progress} />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
            Replace
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onChange(null)} disabled={uploading}>
            Remove
          </Button>
        </div>
        <Field label="Alt text" htmlFor="cover-alt" hint="Describe the image for screen readers and search engines.">
          <input
            id="cover-alt"
            value={value.alt ?? ""}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            placeholder="e.g. Stainless steel forceps on a sterile tray"
            className={inputClass}
          />
        </Field>
        {picker}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        disabled={uploading}
        className={`flex aspect-[16/9] w-full flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed px-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/60 ${
          dragging ? "border-[#18B27F] bg-[#F0FAF6]" : "border-[#CBD6D2] hover:border-[#18B27F] hover:bg-[#F8FAF9]"
        }`}
      >
        {uploading ? (
          <Progress value={progress} />
        ) : (
          <>
            <Upload className="h-5 w-5 text-[#5E716B]" aria-hidden />
            <span className="text-sm font-medium text-[#10261F]">Upload cover image</span>
            <span className="text-xs text-[#5E716B]">
              Drop a file or click to browse. Up to {MAX_IMAGE_MB} MB, 1600×900 works best.
            </span>
          </>
        )}
      </button>
      {picker}
    </div>
  );
}
