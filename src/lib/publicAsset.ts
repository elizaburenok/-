/** Paths to files in /public, prefixed with Vite `base` (required for GitHub Pages). */
export function publicAsset(relativePath: string): string {
  const p = relativePath.replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${p}`;
}
