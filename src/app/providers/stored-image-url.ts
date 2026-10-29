/**
 * A resolved URL from the current API wins.
 * null means the current API could not resolve the file, so the legacy host is not substituted.
 * undefined means an older API omitted the field, so the previous Cloudinary address still applies.
 */
export function resolvedStoredImageUrl(
  resolved: string | null | undefined,
  storedKey: string | null | undefined,
  legacyBase: string
): string | null {
  if (resolved) {
    return resolved;
  }
  if (resolved === null) {
    return null;
  }
  if (storedKey) {
    return legacyBase + storedKey;
  }
  return null;
}
