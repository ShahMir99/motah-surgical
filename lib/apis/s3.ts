import "server-only";
import { randomUUID } from "crypto";
import { DeleteObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IMAGE_TYPES } from "@/lib/apis/upload-config";

const region = process.env.S3_REGION ?? "";
const bucket = process.env.S3_BUCKET ?? "";

let client: S3Client | null = null;
function s3() {
  if (!bucket || !region) throw new Error("S3_BUCKET and S3_REGION must be set");
  client ??= new S3Client({
    region,
    credentials:
      process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
        ? { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY }
        : undefined,
  });
  return client;
}

export function publicUrlFor(key: string) {
  const base = process.env.S3_PUBLIC_BASE_URL?.replace(/\/$/, "") || `https://${bucket}.s3.${region}.amazonaws.com`;
  return `${base}/${key}`;
}

export async function createImageUpload(contentType: string, size: number, folder = "blogs") {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const key = `${folder}/${now.getFullYear()}/${month}/${randomUUID()}.${IMAGE_TYPES[contentType]}`;

  const uploadUrl = await getSignedUrl(
    s3(),
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType, ContentLength: size }),
    { expiresIn: 120 }
  );

  return { key, uploadUrl, publicUrl: publicUrlFor(key) };
}

export async function deleteObjects(keys: (string | null | undefined)[]) {
  const valid = keys.filter((k): k is string => Boolean(k));
  if (!valid.length || !bucket) return;
  try {
    await s3().send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: { Objects: valid.map((Key) => ({ Key })), Quiet: true },
      })
    );
  } catch (err) {
    console.error("[s3] cleanup failed", err);
  }
}
