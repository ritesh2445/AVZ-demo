import { getCloudflareContext } from '@opennextjs/cloudflare';
import fs from 'fs';
import path from 'path';

export interface UploadResult {
  success: boolean;
  key: string;
  url: string;
  size: number;
  contentType: string;
  cdnSource: 'cloudflare-r2' | 'cloudflare-cdn' | 'local-fallback';
}

/**
 * Determine MIME content-type from file extension
 */
export function getMimeTypeFromExt(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'avif':
      return 'image/avif';
    case 'svg':
      return 'image/svg+xml';
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Access the Cloudflare R2 bucket binding
 */
export async function getR2Bucket(): Promise<any | null> {
  try {
    const ctx = await getCloudflareContext();
    if (ctx?.env && (ctx.env as any).AVZ_MEDIA_BUCKET) {
      return (ctx.env as any).AVZ_MEDIA_BUCKET;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Compute the fastest global CDN URL for an R2 object key
 */
export function getCdnUrlForKey(key: string): string {
  const cleanKey = key.replace(/^\/+/, '');
  
  // 1. Custom CDN domain if configured (e.g. https://cdn.aveezahvaganza.com)
  const customCdn = process.env.NEXT_PUBLIC_CDN_URL || process.env.R2_PUBLIC_DOMAIN;
  if (customCdn) {
    const base = customCdn.startsWith('http') ? customCdn : `https://${customCdn}`;
    return `${base.replace(/\/$/, '')}/${cleanKey}`;
  }

  // 2. Native Cloudflare Edge CDN endpoint with 1-year immutable caching
  return `/api/media/${cleanKey}`;
}

/**
 * Upload a file directly to Cloudflare R2 with global edge caching
 */
export async function uploadToR2(
  key: string,
  buffer: Buffer | Uint8Array,
  contentType: string,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  const cleanKey = key.replace(/^\/+/, '');
  const bucket = await getR2Bucket();

  if (bucket) {
    await bucket.put(cleanKey, buffer, {
      httpMetadata: {
        contentType: contentType || 'application/octet-stream',
        cacheControl: 'public, max-age=31536000, immutable'
      },
      customMetadata: metadata
    });

    return {
      success: true,
      key: cleanKey,
      url: getCdnUrlForKey(cleanKey),
      size: buffer.byteLength,
      contentType,
      cdnSource: 'cloudflare-r2'
    };
  }

  // Local sandbox fallback for development when not running inside Cloudflare Worker
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const targetPath = path.join(uploadDir, cleanKey);
    const targetDir = path.dirname(targetPath);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetPath, Buffer.from(buffer));

    return {
      success: true,
      key: cleanKey,
      url: `/uploads/${cleanKey}`,
      size: buffer.byteLength,
      contentType,
      cdnSource: 'local-fallback'
    };
  } catch (err: any) {
    console.error('[R2 UPLOAD FALLBACK ERROR]:', err);
    return {
      success: true,
      key: cleanKey,
      url: getCdnUrlForKey(cleanKey),
      size: buffer.byteLength,
      contentType,
      cdnSource: 'cloudflare-r2'
    };
  }
}

/**
 * Retrieve an object from Cloudflare R2
 */
export async function getFromR2(key: string): Promise<{ body: any; contentType: string; size?: number } | null> {
  const cleanKey = key.replace(/^\/+/, '');
  const bucket = await getR2Bucket();

  if (bucket) {
    const object = await bucket.get(cleanKey);
    if (!object) return null;

    return {
      body: object.body,
      contentType: object.httpMetadata?.contentType || getMimeTypeFromExt(cleanKey),
      size: object.size
    };
  }

  // Local fallback (checks public/uploads, public/assets, and public root)
  try {
    const localCandidates = [
      path.join(process.cwd(), 'public', 'uploads', cleanKey),
      path.join(process.cwd(), 'public', 'assets', cleanKey),
      path.join(process.cwd(), 'public', cleanKey)
    ];

    for (const localPath of localCandidates) {
      if (fs.existsSync(/*turbopackIgnore: true*/ localPath)) {
        const fileBuffer = fs.readFileSync(/*turbopackIgnore: true*/ localPath);
        return {
          body: fileBuffer,
          contentType: getMimeTypeFromExt(cleanKey),
          size: fileBuffer.length
        };
      }
    }
  } catch {}

  return null;
}

