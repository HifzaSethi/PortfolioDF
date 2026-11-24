import type { CSSProperties } from 'react';
import {
  FaAmazon,
  FaApple,
  FaLinkedinIn,
  FaMeta,
  FaMicrosoft,
  FaPinterestP,
  FaSnapchat,
  FaSpotify,
  FaTiktok,
  FaXTwitter,
} from 'react-icons/fa6';
import {
  Link2,
  Layers,
  Monitor,
  ShoppingBag,
  Store,
  Tv,
  Users,
} from 'lucide-react';

export type BrandLogoId =
  | 'meta'
  | 'tiktok'
  | 'snapchat'
  | 'x'
  | 'linkedin'
  | 'pinterest'
  | 'microsoft'
  | 'amazon'
  | 'apple'
  | 'native-taboola-outbrain'
  | 'spotify'
  | 'channel-influencer'
  | 'channel-programmatic'
  | 'channel-ctv'
  | 'channel-dooh'
  | 'channel-affiliate'
  | 'channel-retail-media'
  | 'channel-marketplace';

interface BrandVisualSpec {
  kind: 'brand' | 'monogram-pair' | 'lucide';
  fgDay: string;
  fgNight: string;
  bgDay?: string;
  bgNight?: string;
  borderDay?: string;
  borderNight?: string;
  monograms?: [string, string];
}

const BRAND_SPECS: Record<BrandLogoId, BrandVisualSpec> = {
  meta: {
    kind: 'brand',
    fgDay: '#0467DF',
    fgNight: '#4DA3FF',
    borderDay: '#0467DF',
    borderNight: '#4DA3FF',
  },
  tiktok: {
    kind: 'brand',
    fgDay: '#D61E4A',
    fgNight: '#FE2C55',
    borderDay: '#D61E4A',
    borderNight: '#FE2C55',
  },
  snapchat: {
    kind: 'brand',
    fgDay: '#010102',
    fgNight: '#010102',
    bgDay: '#FFFC00',
    bgNight: '#FFFC00',
    borderDay: '#C7B800',
    borderNight: '#FFFC00',
  },
  x: {
    kind: 'brand',
    fgDay: '#F4F1EA',
    fgNight: '#010102',
    bgDay: '#010102',
    bgNight: '#F4F1EA',
    borderDay: '#010102',
    borderNight: '#F4F1EA',
  },
  linkedin: {
    kind: 'brand',
    fgDay: '#0A66C2',
    fgNight: '#4DA3FF',
    borderDay: '#0A66C2',
    borderNight: '#4DA3FF',
  },
  pinterest: {
    kind: 'brand',
    fgDay: '#BD081C',
    fgNight: '#FF3B53',
    borderDay: '#BD081C',
    borderNight: '#FF3B53',
  },
  microsoft: {
    kind: 'brand',
    fgDay: '#0078D4',
    fgNight: '#3AA0F3',
    borderDay: '#0078D4',
    borderNight: '#3AA0F3',
  },
  amazon: {
    kind: 'brand',
    fgDay: '#FF9900',
    fgNight: '#FF9900',
    bgDay: '#232F3E',
    bgNight: '#161F2B',
    borderDay: '#232F3E',
    borderNight: '#FF9900',
  },
  apple: {
    kind: 'brand',
    fgDay: '#F4F1EA',
    fgNight: '#010102',
    bgDay: '#010102',
    bgNight: '#F4F1EA',
    borderDay: '#010102',
    borderNight: '#F4F1EA',
  },
  'native-taboola-outbrain': {
    kind: 'monogram-pair',
    fgDay: '#0057FF',
    fgNight: '#B34FFF',
    borderDay: '#0057FF',
    borderNight: '#B34FFF',
    monograms: ['TB', 'OB'],
  },
  spotify: {
    kind: 'brand',
    fgDay: '#1ED760',
    fgNight: '#1ED760',
    bgDay: '#191414',
    bgNight: '#121212',
    borderDay: '#191414',
    borderNight: '#1ED760',
  },
  'channel-influencer': {
    kind: 'lucide',
    fgDay: '#0057FF',
    fgNight: '#B34FFF',
    borderDay: '#0057FF',
    borderNight: '#B34FFF',
  },
  'channel-programmatic': {
    kind: 'lucide',
    fgDay: '#0057FF',
    fgNight: '#B34FFF',
    borderDay: '#0057FF',
    borderNight: '#B34FFF',
  },
  'channel-ctv': {
    kind: 'lucide',
    fgDay: '#0057FF',
    fgNight: '#B34FFF',
    borderDay: '#0057FF',
    borderNight: '#B34FFF',
  },
  'channel-dooh': {
    kind: 'lucide',
    fgDay: '#0057FF',
    fgNight: '#B34FFF',
    borderDay: '#0057FF',
    borderNight: '#B34FFF',
  },
  'channel-affiliate': {
    kind: 'lucide',
    fgDay: '#0057FF',
    fgNight: '#B34FFF',
    borderDay: '#0057FF',
    borderNight: '#B34FFF',
  },
  'channel-retail-media': {
    kind: 'lucide',
    fgDay: '#0057FF',
    fgNight: '#B34FFF',
    borderDay: '#0057FF',
    borderNight: '#B34FFF',
  },
  'channel-marketplace': {
    kind: 'lucide',
    fgDay: '#0057FF',
    fgNight: '#B34FFF',
    borderDay: '#0057FF',
    borderNight: '#B34FFF',
  },
};

function renderMark(id: BrandLogoId, monograms?: [string, string]) {
  switch (id) {
    case 'meta':
      return <FaMeta className="h-[18px] w-[18px]" aria-hidden="true" />;
    case 'tiktok':
      return <FaTiktok className="h-[18px] w-[18px]" aria-hidden="true" />;
    case 'snapchat':
      return <FaSnapchat className="h-[18px] w-[18px]" aria-hidden="true" />;
    case 'x':
      return <FaXTwitter className="h-[17px] w-[17px]" aria-hidden="true" />;
    case 'linkedin':
      return <FaLinkedinIn className="h-[17px] w-[17px]" aria-hidden="true" />;
    case 'pinterest':
      return <FaPinterestP className="h-[17px] w-[17px]" aria-hidden="true" />;
    case 'microsoft':
      return <FaMicrosoft className="h-[17px] w-[17px]" aria-hidden="true" />;
    case 'amazon':
      return <FaAmazon className="h-[18px] w-[18px]" aria-hidden="true" />;
    case 'apple':
      return <FaApple className="h-[19px] w-[19px]" aria-hidden="true" />;
    case 'spotify':
      return <FaSpotify className="h-[18px] w-[18px]" aria-hidden="true" />;
    case 'native-taboola-outbrain': {
      const [first, second] = monograms ?? ['TB', 'OB'];
      return (
        <span className="grid h-full w-full grid-cols-2 divide-x divide-current/25 text-[9px] font-extrabold leading-none tracking-tighter">
          <span className="flex items-center justify-center">{first}</span>
          <span className="flex items-center justify-center">{second}</span>
        </span>
      );
    }
    case 'channel-influencer':
      return <Users className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />;
    case 'channel-programmatic':
      return <Layers className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />;
    case 'channel-ctv':
      return <Tv className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />;
    case 'channel-dooh':
      return <Monitor className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />;
    case 'channel-affiliate':
      return <Link2 className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />;
    case 'channel-retail-media':
      return <Store className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />;
    case 'channel-marketplace':
      return <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />;
  }
}

interface BrandLogoProps {
  logoId: BrandLogoId;
  className?: string;
}

export function BrandLogo({ logoId, className = '' }: BrandLogoProps) {
  const spec = BRAND_SPECS[logoId];
  const tileVars = {
    '--brand-fg-day': spec.fgDay,
    '--brand-fg-night': spec.fgNight,
    '--brand-bg-day': spec.bgDay ?? 'var(--bg-page)',
    '--brand-bg-night': spec.bgNight ?? 'var(--bg-page)',
    '--brand-border-day': spec.borderDay ?? 'var(--border-strong)',
    '--brand-border-night': spec.borderNight ?? 'var(--border-strong)',
  } as CSSProperties;

  return (
    <span
      aria-hidden="true"
      data-brand-id={logoId}
      style={tileVars}
      className={`df-brand-tile inline-flex h-10 w-10 shrink-0 items-center justify-center ${className}`}
    >
      {renderMark(logoId, spec.monograms)}
    </span>
  );
}
