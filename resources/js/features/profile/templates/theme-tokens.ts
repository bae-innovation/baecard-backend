export type ProfileThemeId = 1 | 2 | 3 | 4;

export type ProfileThemeTokens = {
  id: ProfileThemeId;
  label: string;
  mode: 'light' | 'dark';
  avatarShape: 'circle' | 'rounded';
  avatarAlign: 'start' | 'center';
  waveBody: boolean;
  grayscaleCover: boolean;
  shell: string;
  coverFallback: string;
  avatarBorder: string;
  title: string;
  subtitle: string;
  bio: string;
  socialBar: string;
  contactStack: string;
  contactCard: string;
  contactDivider: string;
  contactText: string;
  contactMuted: string;
  contactIcon: string;
  actionOutline: string;
  actionSolid: string;
  accentSwitch: string;
  footer: string;
  bodySurface: string;
};

export const PROFILE_THEMES: Record<ProfileThemeId, ProfileThemeTokens> = {
  1: {
    id: 1,
    label: 'Theme 1 Dark',
    mode: 'dark',
    avatarShape: 'circle',
    avatarAlign: 'start',
    waveBody: false,
    grayscaleCover: true,
    shell: 'bg-[#181818] text-white',
    coverFallback: 'bg-gradient-to-br from-zinc-600 via-stone-700 to-neutral-900',
    avatarBorder: 'border-[#181818] shadow-[0_8px_28px_rgba(0,0,0,0.45)]',
    title: 'text-white',
    subtitle: 'text-white/55',
    bio: 'text-white/70',
    socialBar: 'bg-[#111111] border-y border-white/5',
    contactStack: '',
    contactCard: 'bg-[#232323]',
    contactDivider: 'border-white/10',
    contactText: 'text-white',
    contactMuted: 'text-white/45',
    contactIcon: 'text-white/60 hover:text-sky-300',
    actionOutline: 'border border-white/80 bg-transparent text-white hover:bg-white hover:text-stone-900',
    actionSolid: 'bg-[#2f2f2f] text-white hover:bg-[#3a3a3a]',
    accentSwitch: 'data-[state=checked]:bg-sky-500',
    footer: 'text-white/35',
    bodySurface: 'bg-[#181818]',
  },
  2: {
    id: 2,
    label: 'Theme 1 Light',
    mode: 'light',
    avatarShape: 'circle',
    avatarAlign: 'start',
    waveBody: false,
    grayscaleCover: true,
    shell: 'bg-white text-stone-900',
    coverFallback: 'bg-gradient-to-br from-stone-300 via-zinc-200 to-stone-400',
    avatarBorder: 'border-white shadow-[0_8px_24px_rgba(28,25,23,0.18)]',
    title: 'text-stone-900',
    subtitle: 'text-stone-500',
    bio: 'text-stone-600',
    socialBar: 'bg-stone-100 border-y border-stone-200',
    contactStack: '',
    contactCard: 'bg-stone-100',
    contactDivider: 'border-stone-200/80',
    contactText: 'text-stone-800',
    contactMuted: 'text-stone-400',
    contactIcon: 'text-stone-500 hover:text-sky-600',
    actionOutline: 'border border-stone-900 bg-transparent text-stone-900 hover:bg-stone-900 hover:text-white',
    actionSolid: 'bg-stone-200 text-stone-900 hover:bg-stone-300',
    accentSwitch: 'data-[state=checked]:bg-sky-500',
    footer: 'text-stone-400',
    bodySurface: 'bg-white',
  },
  3: {
    id: 3,
    label: 'Theme 2 Dark',
    mode: 'dark',
    avatarShape: 'rounded',
    avatarAlign: 'center',
    waveBody: true,
    grayscaleCover: false,
    shell: 'bg-[#111111] text-white',
    coverFallback: 'bg-gradient-to-br from-zinc-700 via-neutral-800 to-black',
    avatarBorder: 'border-white shadow-[0_8px_28px_rgba(0,0,0,0.5)]',
    title: 'text-white',
    subtitle: 'text-white/55',
    bio: 'text-white/70',
    socialBar: 'bg-transparent',
    contactStack: 'rounded-[1.75rem] bg-[#1a1a1a] p-3 shadow-lg',
    contactCard: 'bg-[#232323]',
    contactDivider: 'border-white/10',
    contactText: 'text-white',
    contactMuted: 'text-white/40',
    contactIcon: 'text-white/55 hover:text-sky-300',
    actionOutline: 'border border-white/80 bg-transparent text-white hover:bg-white hover:text-stone-900',
    actionSolid: 'bg-[#2f2f2f] text-white hover:bg-[#3a3a3a]',
    accentSwitch: 'data-[state=checked]:bg-sky-500',
    footer: 'text-white/40',
    bodySurface: 'bg-[#111111]',
  },
  4: {
    id: 4,
    label: 'Theme 2 Light',
    mode: 'light',
    avatarShape: 'rounded',
    avatarAlign: 'center',
    waveBody: true,
    grayscaleCover: false,
    shell: 'bg-[#f3f3f3] text-stone-900',
    coverFallback: 'bg-gradient-to-br from-stone-300 via-zinc-200 to-stone-400',
    avatarBorder: 'border-white shadow-[0_8px_24px_rgba(28,25,23,0.18)]',
    title: 'text-stone-900',
    subtitle: 'text-stone-500',
    bio: 'text-stone-600',
    socialBar: 'bg-transparent',
    contactStack: 'rounded-[1.75rem] bg-white p-3 shadow-md',
    contactCard: 'bg-stone-100',
    contactDivider: 'border-stone-200/80',
    contactText: 'text-stone-800',
    contactMuted: 'text-stone-400',
    contactIcon: 'text-stone-500 hover:text-sky-600',
    actionOutline: 'border border-stone-900 bg-transparent text-stone-900 hover:bg-stone-900 hover:text-white',
    actionSolid: 'bg-stone-200 text-stone-900 hover:bg-stone-300',
    accentSwitch: 'data-[state=checked]:bg-sky-500',
    footer: 'text-stone-400',
    bodySurface: 'bg-white',
  },
};

export function getProfileTheme(id?: number | null): ProfileThemeTokens {
  const safe = (id === 2 || id === 3 || id === 4 ? id : 1) as ProfileThemeId;
  return PROFILE_THEMES[safe];
}
