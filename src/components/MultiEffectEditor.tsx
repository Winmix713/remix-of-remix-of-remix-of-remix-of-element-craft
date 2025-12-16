import { useEffects, EffectType } from '@/contexts/ThemeContext';
import { Sparkles, GlassWater, Layers, Palette, Sun, Moon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useCallback } from 'react';

interface EffectConfig {
  type: EffectType;
  label: string;
  description: string;
  icon: typeof Sparkles;
  color: string;
}

const effectConfig: EffectConfig[] = [
  { 
    type: 'glow', 
    label: 'Glow', 
    description: 'Meleg fókuszpont, puha peremekkel.', 
    icon: Sparkles, 
    color: 'amber' 
  },
  { 
    type: 'glass', 
    label: 'Glass', 
    description: 'Lágy üveg hatás, háttér-elmosással.', 
    icon: GlassWater, 
    color: 'sky' 
  },
  { 
    type: 'neomorph', 
    label: 'Neomorph', 
    description: 'Minimál domborítás, extra mélységgel.', 
    icon: Layers, 
    color: 'purple' 
  },
  { 
    type: 'clay', 
    label: 'Clay', 
    description: 'Meleg, plasztikus komponensek.', 
    icon: Palette, 
    color: 'rose' 
  },
];

const colorClasses: Record<string, { bg: string; text: string; glow: string; gradient: string; border: string }> = {
  amber: { 
    bg: 'bg-amber-400/15', 
    text: 'text-amber-300', 
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.6)]',
    gradient: 'from-amber-500/80 via-amber-400/80 to-amber-300/80',
    border: 'border-amber-500/50'
  },
  sky: { 
    bg: 'bg-sky-400/15', 
    text: 'text-sky-300', 
    glow: 'shadow-[0_0_30px_rgba(56,189,248,0.6)]',
    gradient: 'from-sky-500/80 via-sky-400/80 to-sky-300/80',
    border: 'border-sky-500/50'
  },
  purple: { 
    bg: 'bg-purple-400/15', 
    text: 'text-purple-300', 
    glow: 'shadow-[0_0_30px_rgba(192,132,252,0.6)]',
    gradient: 'from-purple-500/80 via-purple-400/80 to-purple-300/80',
    border: 'border-purple-500/50'
  },
  rose: { 
    bg: 'bg-rose-400/15', 
    text: 'text-rose-300', 
    glow: 'shadow-[0_0_30px_rgba(251,113,133,0.6)]',
    gradient: 'from-rose-500/80 via-rose-400/80 to-rose-300/80',
    border: 'border-rose-500/50'
  },
};

export const MultiEffectEditor = () => {
  const { state, toggleEffect, getActiveEffectsCount } = useEffects();
  const activeCount = getActiveEffectsCount();

  const handleToggle = useCallback((type: EffectType) => {
    toggleEffect(type);
  }, [toggleEffect]);

  const EffectButton = useMemo(() => {
    return ({ config }: { config: EffectConfig }) => {
      const { type, label, description, icon: Icon, color } = config;
      const isActive = state.activeEffects[type];
      const colors = colorClasses[color];
      
      return (
        <button
          onClick={() => handleToggle(type)}
          className={cn(
            "group w-full flex items-center justify-between rounded-xl transition-all duration-300",
            isActive 
              ? `bg-gradient-to-r ${colors.gradient} p-[1px] ${colors.glow}`
              : "border border-neutral-800/80 bg-neutral-900/80 hover:bg-neutral-800/70 hover:border-neutral-700"
          )}
          aria-pressed={isActive}
          aria-label={`${label} effekt ${isActive ? 'kikapcsolása' : 'bekapcsolása'}`}
        >
          <div className={cn(
            "flex-1 flex items-center justify-between px-3 py-2.5 transition-all",
            isActive && "rounded-[0.70rem] bg-neutral-950/95"
          )}>
            <div className="flex items-center gap-2.5">
              <span className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-300",
                colors.bg,
                colors.text,
                isActive && "scale-110"
              )}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="text-left">
                <p className="text-xs font-semibold tracking-tight text-slate-100">
                  {label}
                </p>
                <p className={cn(
                  "text-xs transition-colors",
                  isActive ? colors.text.replace('300', '100/90') : "text-slate-400"
                )}>
                  {description}
                </p>
              </div>
            </div>
            {/* Toggle Switch */}
            <div className={cn(
              "relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300",
              isActive ? colors.bg.replace('/15', '') : "bg-neutral-700"
            )}>
              <span className={cn(
                "inline-block h-4 w-4 rounded-full bg-neutral-950 shadow-lg transition-transform duration-300",
                isActive ? "translate-x-5" : "translate-x-0.5"
              )} />
            </div>
          </div>
        </button>
      );
    };
  }, [state.activeEffects, handleToggle]);

  const GridButton = useMemo(() => {
    return ({ config }: { config: EffectConfig }) => {
      const { type, label, icon: Icon, color } = config;
      const isActive = state.activeEffects[type];
      const colors = colorClasses[color];
      
      return (
        <button
          onClick={() => handleToggle(type)}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 active:scale-95",
            isActive
              ? `bg-gradient-to-br ${colors.gradient.replace(/\/(80|90)/g, '/20')} border ${colors.border} ${colors.text.replace('300', '100')} shadow-lg`
              : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900"
          )}
          aria-pressed={isActive}
          aria-label={`${label} mód ${isActive ? 'kikapcsolása' : 'bekapcsolása'}`}
        >
          <Icon className={cn("w-4 h-4 transition-transform", isActive && "scale-110")} />
          <span className="text-xs font-medium">{label}</span>
        </button>
      );
    };
  }, [state.activeEffects, handleToggle]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Active Effects Section */}
      <section 
        className="rounded-2xl bg-neutral-900/60 border border-neutral-800/80 p-4"
        aria-labelledby="active-effects-title"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 id="active-effects-title" className="text-sm font-semibold tracking-tight text-slate-100">
              Aktív effektek
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Kapcsold be a kívánt kombinációt.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-800/80 px-2.5 py-1">
            <Sun className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs text-amber-200 tracking-tight font-medium">
              {activeCount} aktív
            </span>
          </span>
        </div>

        <div className="space-y-1.5" role="group" aria-label="Effekt kapcsolók">
          {effectConfig.map((config) => (
            <EffectButton key={config.type} config={config} />
          ))}
        </div>
      </section>

      {/* Theme Mode Section */}
      <section 
        className="rounded-2xl bg-neutral-900/70 border border-neutral-800/80 p-4"
        aria-labelledby="theme-mode-title"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 id="theme-mode-title" className="text-sm font-semibold tracking-tight text-slate-100">
              Téma mód
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Szenáriók váltása egy kattintással.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-800/90 px-2 py-1">
            <Moon className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-xs text-slate-200 tracking-tight font-medium">
              Auto-adaptive
            </span>
          </span>
        </div>

        <div className="space-y-2.5">
          <button 
            className="flex w-full items-center justify-between rounded-xl border border-neutral-700/80 bg-neutral-950/80 px-3.5 py-2.5 hover:border-neutral-500/80 hover:bg-neutral-900/90 transition-all duration-300 active:scale-[0.98]"
            aria-label="Téma váltó megnyitása"
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-neutral-900">
                <Sun className="h-3.5 w-3.5" />
              </span>
              <div className="text-left">
                <p className="text-xs font-semibold tracking-tight text-slate-100">
                  Sötét mód · Glow fókusz
                </p>
                <p className="text-xs text-slate-400">
                  Ideális kontraszt prezentációkhoz.
                </p>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-y-0.5" />
          </button>

          <div className="flex gap-1.5" role="progressbar" aria-label="Téma előrehaladás">
            <span className="flex-1 h-1 rounded-full bg-amber-400" />
            <span className="flex-1 h-1 rounded-full bg-slate-600" />
            <span className="flex-1 h-1 rounded-full bg-slate-700" />
          </div>
        </div>
      </section>

      {/* Quick Toggle Grid */}
      <section 
        className="bg-neutral-900/70 border-neutral-800/80 border rounded-2xl p-4"
        aria-labelledby="quick-toggle-title"
      >
        <h2 id="quick-toggle-title" className="sr-only">Gyors effekt kapcsolók</h2>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Gyors effekt kapcsolók">
          {effectConfig.map((config) => (
            <GridButton key={config.type} config={config} />
          ))}
        </div>
      </section>
    </div>
  );
};
