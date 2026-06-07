/**
 * Image URL helpers for Supabase Storage.
 *
 * Supabase Pro projects support on-the-fly image transforms via the
 * `/render/image/public/` endpoint. For projects on the free tier (or for
 * objects in non-public buckets) the transform endpoint may 404, so we
 * default to appending plain query params that Supabase will ignore safely
 * if transforms are off.
 *
 * Usage:
 *   <img src={thumbUrl(post.cover_image, 800)} />
 */

const STORAGE_PUBLIC_MARKER = "/storage/v1/object/public/";
const STORAGE_RENDER_MARKER = "/storage/v1/render/image/public/";

/** Default OG / fallback hero image. No cache-busting query string so the CDN can cache it. */
export const DEFAULT_OG_IMAGE =
  "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";

export interface ThumbOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  resize?: "cover" | "contain" | "fill";
}

/**
 * Returns a CDN-friendly thumbnail URL for a Supabase public storage object.
 * Non-Supabase URLs (or empty/falsy values) are returned unchanged.
 * Always strips any `?t=...` cache-busting query string before transforming.
 */
export function thumbUrl(url: string | null | undefined, _opts: ThumbOptions | number = {}): string {
  if (!url) return "";
  // Supabase image transformations are disabled to stay within the project's
  // monthly transformation quota. Return the original public URL with any
  // cache-busting query string stripped so the Supabase CDN can cache it.
  // The _opts argument is intentionally ignored — kept for API compatibility
  // with existing callers across the codebase.
  void STORAGE_RENDER_MARKER;
  return url.split("?")[0];
}
