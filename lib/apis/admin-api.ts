import type {
  BlogDTO,
  BlogListResponse,
  BlogPayload,
  BlogStatus,
} from "@/types/blog";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_MB,
} from "@/lib/apis/upload-config";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

export type ListParams = {
  page?: number;
  limit?: number;
  q?: string;
  status?: BlogStatus | "all";
  sort?: "recent" | "oldest" | "title";
};

export const blogsApi = {
  list(params: ListParams) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "" && v !== "all") qs.set(k, String(v));
    }
    return request<BlogListResponse>(`/api/admin/blogs?${qs}`);
  },
  get: (id: string) => request<BlogDTO>(`/api/admin/blogs/${id}`),
  create: (data: BlogPayload) =>
    request<BlogDTO>("/api/admin/blogs", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: BlogPayload) =>
    request<BlogDTO>(`/api/admin/blogs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<{ deleted: number }>(`/api/admin/blogs/${id}`, {
      method: "DELETE",
    }),
  removeMany: (ids: string[]) =>
    request<{ deleted: number }>("/api/admin/blogs", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    }),
};

export async function uploadImage(
  file: File,
  onProgress?: (percent: number) => void,
) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
    throw new Error("Use a JPG, PNG, WebP, GIF or AVIF image.");
  if (file.size > MAX_IMAGE_BYTES)
    throw new Error(`Images must be ${MAX_IMAGE_MB} MB or smaller.`);

  const { uploadUrl, key, publicUrl } = await request<{
    uploadUrl: string;
    key: string;
    publicUrl: string;
  }>("/api/admin/uploads", {
    method: "POST",
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  });

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(
            new Error(
              `S3 rejected the upload (${xhr.status}). Check the bucket's CORS settings.`,
            ),
          );
    xhr.onerror = () =>
      reject(
        new Error(
          "The upload didn't reach S3. Check your connection and the bucket's CORS settings.",
        ),
      );
    xhr.send(file);
  });

  return { url: publicUrl, key };
}
