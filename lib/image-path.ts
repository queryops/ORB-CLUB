/**
 * Prepends basePath (/ORB-CLUB) to image src so static-exported next/image
 * resolves correctly on GitHub Pages subdirectory deployments.
 *
 * next/image with unoptimized:true does NOT apply basePath to src — this util
 * fills that gap. Use it for every <img> or next/image src in the project.
 *
 * Rules:
 *  - data: URIs   → returned as-is (base64 flyer uploads)
 *  - http/https   → returned as-is (external CDN images)
 *  - Already has basePath prefix → returned as-is (idempotent)
 *  - Everything else → /ORB-CLUB + src
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '/ORB-CLUB'

export function imgSrc(src: string): string {
  if (!src) return src
  if (src.startsWith('data:')) return src
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  if (src.startsWith(BASE + '/') || src === BASE) return src
  // Ensure single leading slash
  const normalized = src.startsWith('/') ? src : `/${src}`
  return `${BASE}${normalized}`
}
