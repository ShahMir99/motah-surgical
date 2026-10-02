import type {
  BlogDTO,
  BlogListResponse,
  BlogPayload,
  BlogStatus,
} from "@/types/blog";
import type {
  ProductDTO,
  ProductListResponse,
  ProductPayload,
  ProductStatus,
} from "@/types/product";
import type { HomeContent, HomeContentResponse } from "@/types/home";
import type { AboutContentMap, AboutContentResponse, AboutSlug } from "@/types/about";
import {
  ACCEPTED_CATALOG_TYPES,
  ACCEPTED_IMAGE_TYPES,
  MAX_CATALOG_BYTES,
  MAX_CATALOG_MB,
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

export type ProductListParams = {
  page?: number;
  limit?: number;
  q?: string;
  status?: ProductStatus | "all";
  sort?: "order" | "recent" | "name";
};

export const productsApi = {
  list(params: ProductListParams) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "" && v !== "all") qs.set(k, String(v));
    }
    return request<ProductListResponse>(`/api/admin/products?${qs}`);
  },
  get: (id: string) => request<ProductDTO>(`/api/admin/products/${id}`),
  create: (data: ProductPayload) =>
    request<ProductDTO>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: ProductPayload) =>
    request<ProductDTO>(`/api/admin/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<{ deleted: number }>(`/api/admin/products/${id}`, {
      method: "DELETE",
    }),
  removeMany: (ids: string[]) =>
    request<{ deleted: number }>("/api/admin/products", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    }),
};

export const homeApi = {
  get: () => request<HomeContentResponse>("/api/admin/home"),
  save: (data: HomeContent) =>
    request<HomeContentResponse>("/api/admin/home", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const aboutApi = {
  get: <S extends AboutSlug>(slug: S) => request<AboutContentResponse<S>>(`/api/admin/about/${slug}`),
  save: <S extends AboutSlug>(slug: S, data: AboutContentMap[S]) =>
    request<AboutContentResponse<S>>(`/api/admin/about/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

/** Asks the server for a presigned URL, then PUTs the file straight to S3. */
async function uploadToS3(
  file: File,
  kind: "image" | "catalog",
  onProgress?: (percent: number) => void,
) {
  const { uploadUrl, key, publicUrl } = await request<{
    uploadUrl: string;
    key: string;
    publicUrl: string;
  }>("/api/admin/uploads", {
    method: "POST",
    body: JSON.stringify({ contentType: file.type, size: file.size, kind }),
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

export async function uploadImage(
  file: File,
  onProgress?: (percent: number) => void,
) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
    throw new Error("Use a JPG, PNG, WebP, GIF or AVIF image.");
  if (file.size > MAX_IMAGE_BYTES)
    throw new Error(`Images must be ${MAX_IMAGE_MB} MB or smaller.`);
  return uploadToS3(file, "image", onProgress);
}

export async function uploadCatalog(
  file: File,
  onProgress?: (percent: number) => void,
) {
  if (!ACCEPTED_CATALOG_TYPES.includes(file.type))
    throw new Error("Catalogues must be PDF files.");
  if (file.size > MAX_CATALOG_BYTES)
    throw new Error(`Catalogues must be ${MAX_CATALOG_MB} MB or smaller.`);
  return uploadToS3(file, "catalog", onProgress);
}
