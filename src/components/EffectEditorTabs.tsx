import { useEffects } from '@/contexts/EffectContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { GlowEditor } from './GlowEditor';
import { GlassEditor } from './GlassEditor';
import { NeomorphEditor } from './NeomorphEditor';
import { ClayEditor } from './ClayEditor';
import { HistoryTimeline } from './HistoryTimeline';
import { Sparkles, Square, Layers, Box, LucideIcon } from 'lucide-react';
import { useState, useMemo, memo } from 'react';

// Típusdefiníciók
type EffectType = 'glow' | 'glass' | 'neomorph' | 'clay';

interface TabConfig {
  id: EffectType;
  label: string;
  icon: LucideIcon;
  colorClass: string;
  activeColorClass: string;
  Component: React.ComponentType;
}

// Konfiguráció
const TAB_CONFIG: readonly TabConfig[] = [
  {
    id: 'glow',
    label: 'Glow',
    icon: Sparkles,
    colorClass: 'amber',
    activeColorClass: 'data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-200',
    Component: GlowEditor
  },
  {
    id: 'glass',
    label: 'Glass',
    icon: Square,
    colorClass: 'sky',
    activeColorClass: 'data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-200',
    Component: GlassEditor
  },
  {
    id: 'neomorph',
    label: 'Neomorph',
    icon: Layers,
    colorClass: 'purple',
    activeColorClass: 'data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-200',
    Component: NeomorphEditor
  },
  {
    id: 'clay',
    label: 'Clay',
    icon: Box,
    colorClass: 'rose',
    activeColorClass: 'data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-200',
    Component: ClayEditor
  }
] as const;

// Alkomponens a TabsContent wrapper-hez
const TabsContentWrapper = memo(({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
    {children}
  </div>
));

TabsContentWrapper.displayName = 'TabsContentWrapper';

// Fő komponens
export const EffectEditorTabs = memo(() => {
  const { state } = useEffects();
  const [activeTab, setActiveTab] = useState<EffectType>('glow');

  // Memoizált aktív editor komponens - csak akkor renderelődik újra, ha az activeTab változik
  const ActiveEditorComponent = useMemo(() => {
    const activeConfig = TAB_CONFIG.find(tab => tab.id === activeTab);
    return activeConfig ? activeConfig.Component : null;
  }, [activeTab]);

  // Tab trigger renderelés
  const renderTabTrigger = (config: TabConfig) => {
    const { id, label, icon: Icon, activeColorClass } = config;
    const isDisabled = !state.activeEffects[id];

    return (
      <TabsTrigger
        key={id}
        value={id}
        className={`gap-1.5 text-xs ${activeColorClass}`}
        disabled={isDisabled}
        aria-label={`${label} effect editor${isDisabled ? ' (disabled)' : ''}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {label}
      </TabsTrigger>
    );
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EffectType)} className="w-full">
        <TabsList 
          className="w-full grid grid-cols-4 bg-zinc-900/50 border border-zinc-800/80 h-11"
          aria-label="Effect editor tabs"
        >
          {TAB_CONFIG.map(renderTabTrigger)}
        </TabsList>

        <TabsContentWrapper>
          <TabsContent value={activeTab} className="mt-0">
            {ActiveEditorComponent && <ActiveEditorComponent />}
          </TabsContent>
        </TabsContentWrapper>
      </Tabs>

      <HistoryTimeline />
    </div>
  );
});

EffectEditorTabs.displayName = 'EffectEditorTabs';
