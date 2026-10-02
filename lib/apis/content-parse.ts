import "server-only";
import { ValidationError } from "@/lib/apis/blog-server";

/** Helpers shared by the editable-page parsers (home, about). */

export const str = (v: unknown, max: number, fallback = "") =>
  typeof v === "string" ? v.trim().slice(0, max) : fallback;

/** Like `str` but keeps line breaks inside the text. */
export const text = (v: unknown, max: number, fallback = "") =>
  typeof v === "string" ? v.replace(/\r\n/g, "\n").trim().slice(0, max) : fallback;

export const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

export const arr = (v: unknown, max: number): unknown[] => (Array.isArray(v) ? v.slice(0, max) : []);

/** Internal paths and http(s) links only, so a link can never run script. */
export function href(v: unknown, label: string) {
  const value = str(v, 300);
  if (value && !/^(\/(?!\/)|https?:\/\/|#)/.test(value)) {
    throw new ValidationError(`${label}: use a path like /products or a full https:// link.`);
  }
  return value;
}

export function image(v: unknown, label: string) {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const url = str(o.url, 1000);
  const key = str(o.key, 500);
  if (!url || !key || !/^https:\/\//.test(url)) {
    throw new ValidationError(`${label}: the image is invalid. Upload it again.`);
  }
  return { url, key, alt: str(o.alt, 200) };
}

/** Every S3 key in a content tree: any object that has a string `url` and `key`. */
export function collectKeys(node: unknown, out: string[] = []): string[] {
  if (Array.isArray(node)) {
    node.forEach((n) => collectKeys(n, out));
  } else if (node && typeof node === "object") {
    const o = node as Record<string, unknown>;
    if (typeof o.url === "string" && typeof o.key === "string" && o.key) out.push(o.key);
    Object.values(o).forEach((v) => collectKeys(v, out));
  }
  return out;
}

/**
 * Saved values win; anything missing falls back to the defaults.
 * Lists use the saved list when it has entries.
 */
export function mergeWithDefaults<T>(defaults: T, saved: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(saved) && saved.length ? saved : defaults) as T;
  }
  if (defaults && typeof defaults === "object") {
    const s = obj(saved);
    const out: Record<string, unknown> = {};
    for (const [k, d] of Object.entries(defaults as Record<string, unknown>)) {
      out[k] = mergeWithDefaults(d, s[k]);
    }
    return out as T;
  }
  if (defaults === null) return (saved && typeof saved === "object" ? saved : null) as T;
  return (typeof saved === typeof defaults ? saved : defaults) as T;
}
