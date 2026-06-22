import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { useAccentPalette } from '@/components/providers/accent-palette-provider';
import { ACCENT_PALETTES } from '@/lib/accent-palette';
import { cn } from '@/lib/utils';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', description: 'Bright and clean interface', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Easy on the eyes in low light', icon: Moon },
  { value: 'system', label: 'System', description: 'Follow your device preference', icon: Monitor },
] as const;

export function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();
  const { paletteId, setPaletteId, mounted } = useAccentPalette();
  const [themeMounted, setThemeMounted] = React.useState(false);

  React.useEffect(() => {
    setThemeMounted(true);
  }, []);

  if (!mounted || !themeMounted) {
    return null;
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Theme</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose light, dark, or system mode. Saved in your browser only.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = theme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={cn(
                  'rounded-xl border p-4 text-left transition-all hover:border-primary/40',
                  isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/15' : 'border-border',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  {isSelected ? (
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3.5" />
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Accent Color</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a color palette for buttons, links, and highlights. Saved in your browser only.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACCENT_PALETTES.map((palette) => {
            const isSelected = paletteId === palette.id;

            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => setPaletteId(palette.id)}
                className={cn(
                  'rounded-xl border p-4 text-left transition-all hover:border-primary/40',
                  isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/15' : 'border-border',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="size-10 shrink-0 rounded-full border shadow-inner"
                      style={{ backgroundColor: palette.swatch }}
                      aria-hidden
                    />
                    <div>
                      <p className="text-sm font-medium">{palette.name}</p>
                      <p className="text-xs text-muted-foreground">Accent palette</p>
                    </div>
                  </div>
                  {isSelected ? (
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3.5" />
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
