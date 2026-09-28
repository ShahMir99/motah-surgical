"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, FileText, Upload } from "lucide-react";
import type { ProductCatalog } from "@/types/product";
import { uploadCatalog } from "@/lib/apis/admin-api";
import { ACCEPTED_CATALOG_TYPES, MAX_CATALOG_MB } from "@/lib/apis/upload-config";
import { Button, Field, inputClass } from "@/components/admin/ui";

function formatSize(bytes: number) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Progress({ value }: { value: number }) {
  return (
    <div className="w-full" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
      <div className="h-1.5 overflow-hidden rounded-full bg-[#DCE3E0]">
        <div className="h-full rounded-full bg-[#18B27F] transition-[width] duration-150" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-2 text-xs tabular-nums text-[#3E534C]">Uploading {value}%</p>
    </div>
  );
}

export function CatalogField({
  value,
  onChange,
  defaultTitle,
}: {
  value: ProductCatalog | null;
  onChange: (value: ProductCatalog | null) => void;
  /** Suggested label, e.g. "General Surgery Catalogue". */
  defaultTitle: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const uploading = progress !== null;

  async function handleFile(file?: File | null) {
    if (!file || uploading) return;
    setProgress(0);
    try {
      const { url, key } = await uploadCatalog(file, setProgress);
      onChange({ url, key, fileName: file.name, size: file.size, title: value?.title || defaultTitle });
      toast.success(value ? "Catalogue replaced" : "Catalogue uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The catalogue couldn't be uploaded.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const picker = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPTED_CATALOG_TYPES.join(",")}
      className="sr-only"
      tabIndex={-1}
      aria-hidden
      onChange={(e) => handleFile(e.target.files?.[0])}
    />
  );

  if (value) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-md border border-[#E6ECEA] bg-[#F6F8F7] p-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded bg-[#FDECEA] text-[#B42318]">
            <FileText className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            {uploading ? (
              <Progress value={progress} />
            ) : (
              <>
                <p className="truncate text-sm font-medium text-[#10261F]" title={value.fileName}>
                  {value.fileName}
                </p>
                <p className="text-xs text-[#5E716B]">PDF {value.size ? `· ${formatSize(value.size)}` : ""}</p>
              </>
            )}
          </div>
          <a
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open catalogue in a new tab"
            title="Open"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[#5E716B] hover:bg-[#E9EFED] hover:text-[#10261F]"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
            Replace
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onChange(null)} disabled={uploading}>
            Remove
          </Button>
        </div>
        <Field label="Title on the website" htmlFor="catalog-title" hint="Shown on the download card and used as the file name.">
          <input
            id="catalog-title"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder={defaultTitle}
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
        className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed px-4 py-7 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/60 ${
          dragging ? "border-[#18B27F] bg-[#F0FAF6]" : "border-[#CBD6D2] hover:border-[#18B27F] hover:bg-[#F8FAF9]"
        }`}
      >
        {uploading ? (
          <div className="w-full max-w-[12rem]">
            <Progress value={progress} />
          </div>
        ) : (
          <>
            <Upload className="h-5 w-5 text-[#5E716B]" aria-hidden />
            <span className="text-sm font-medium text-[#10261F]">Upload catalogue PDF</span>
            <span className="text-xs text-[#5E716B]">Drop a file or click to browse. Up to {MAX_CATALOG_MB} MB.</span>
          </>
        )}
      </button>
      {picker}
    </div>
  );
}
