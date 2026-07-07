import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

import { getSourcePlatform, SOURCE_PLATFORM_LABELS } from '@/libs/recipeSource';

const PLATFORM_ICONS = {
  youtube: FaYoutube,
  instagram: FaInstagram,
  facebook: FaFacebook,
} as const;

interface SourceBadgeProps {
  refUrl: string | null | undefined;
  showLabel?: boolean;
}

// Small monochrome badge indicating where a recipe was imported from
export default function SourceBadge({ refUrl, showLabel = false }: SourceBadgeProps) {
  const platform = getSourcePlatform(refUrl);
  if (!platform) return null;

  const Icon = PLATFORM_ICONS[platform];
  const label = SOURCE_PLATFORM_LABELS[platform];

  return (
    <span className="inline-flex items-center gap-1.5 text-[#9E9E9E]" title={`來源：${label}`}>
      <Icon aria-label={label} className="h-3.5 w-3.5" />
      {showLabel && <span className="text-[11px] tracking-[0.5px]">{label}</span>}
    </span>
  );
}
