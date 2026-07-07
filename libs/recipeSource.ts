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

// Extract the YouTube video id from watch / youtu.be / shorts / embed URLs
export function getYouTubeVideoId(refUrl: string | null | undefined): string | null {
  if (!refUrl) return null;
  let url: URL;
  try {
    url = new URL(refUrl);
  } catch {
    return null;
  }
  const hostname = url.hostname.toLowerCase();
  const isValidId = (id: string | null | undefined): id is string => !!id && /^[\w-]{11}$/.test(id);

  if (hostname.includes('youtu.be')) {
    const id = url.pathname.split('/')[1];
    return isValidId(id) ? id : null;
  }
  if (hostname.includes('youtube.com')) {
    const v = url.searchParams.get('v');
    if (isValidId(v)) return v;
    const match = url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})/);
    if (match) return match[1];
  }
  return null;
}

export const SOURCE_PLATFORM_LABELS: Record<SourcePlatform, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  facebook: 'Facebook',
};
