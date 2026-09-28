export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const ACCEPTED_IMAGE_TYPES = Object.keys(IMAGE_TYPES);
export const MAX_IMAGE_MB = 5;
export const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

// Product catalogues (PDF only).
export const CATALOG_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
};

export const ACCEPTED_CATALOG_TYPES = Object.keys(CATALOG_TYPES);
export const MAX_CATALOG_MB = 25;
export const MAX_CATALOG_BYTES = MAX_CATALOG_MB * 1024 * 1024;
