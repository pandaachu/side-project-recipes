export type SourcePlatform = 'youtube' | 'instagram' | 'facebook';

// Derive the source platform from a recipe's reference URL
export function getSourcePlatform(refUrl: string | null | undefined): SourcePlatform | null {
  if (!refUrl) return null;
  let hostname: string;
  try {
    hostname = new URL(refUrl).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
  if (hostname.includes('instagram.com')) return 'instagram';
  if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) return 'facebook';
  return null;
}

export const SOURCE_PLATFORM_LABELS: Record<SourcePlatform, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  facebook: 'Facebook',
};
