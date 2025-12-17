import { ThemeProvider, EffectProvider } from "@/contexts/ThemeContext";
import { SelectionProvider } from "@/contexts/SelectionContext";
import { MultiEffectEditor } from "@/components/MultiEffectEditor";
import { EffectEditorTabs } from "@/components/EffectEditorTabs";
import { PhonePreview } from "@/components/PhonePreview";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { PropertyInspector } from "@/components/PropertyInspector";
import { PresetsGallery } from "@/components/PresetsGallery";
import { ExportPanel } from "@/components/ExportPanel";
import { QuickActionsPanel } from "@/components/QuickActionsPanel";
import { useState } from "react";
import { Settings, Layers, Sparkles, Code, Zap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

type RightPanel = 'actions' | 'theme' | 'inspector' | 'presets' | 'export';

const Index = () => {
  const [rightPanel, setRightPanel] = useState<RightPanel>('presets');

  return (
    <ThemeProvider>
      <EffectProvider>
        <SelectionProvider>
        <div className="min-h-screen w-full bg-background text-foreground antialiased font-outfit">
          {/* Background gradient */}
          <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-violet/5 pointer-events-none" />
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative w-full h-screen flex">
            {/* Left: Editor Panel */}
            <section className="w-1/2 h-full p-4 overflow-hidden flex flex-col">
              <div className="relative flex-1 rounded-3xl border border-border/80 bg-card/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_22px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl overflow-hidden flex flex-col">
                {/* Felső sáv */}
                <div className="flex items-center justify-between px-5 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-border/70">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald/80" />
                    </div>
                    <div className="h-4 w-px bg-border ml-2" />
                    <div>
                      <p className="text-sm font-semibold tracking-tight text-foreground">
                        Multi‑Effect Editor
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Fények, árnyékok és hangulatok valós idejű finomhangolása
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content grid */}
                <div className="flex-1 flex flex-col lg:flex-row gap-5 sm:gap-6 px-5 sm:px-6 pb-5 sm:pb-6 pt-4 sm:pt-5 overflow-auto">
                  {/* Left column: Active Effects */}
                  <div className="w-full lg:w-[40%]">
                    <MultiEffectEditor />
                  </div>

                  {/* Right column: Tabbed Effect Editors */}
                  <div className="w-full lg:w-[60%]">
                    <EffectEditorTabs />
                  </div>
                </div>

                {/* Alsó lábléc */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-border/80 bg-card/90">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-secondary border border-border/80">
                      <Settings className="h-2.5 w-2.5 text-muted-foreground" />
                    </span>
                    <span className="tracking-tight">
                      Ctrl+Z / Ctrl+Y a visszavonáshoz/újra
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-primary">
                    <Sparkles className="w-3 h-3" />
                    <span className="font-medium">Effect Studio</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Right: Presets & Preview Panel */}
            <section className="w-1/2 h-full p-4 overflow-hidden flex flex-col gap-4">
              {/* Fülek */}
              <Tabs value={rightPanel} onValueChange={(v) => setRightPanel(v as RightPanel)} className="w-full">
                <TabsList className="w-full bg-secondary/50 border border-border/80 grid grid-cols-5">
                  <TabsTrigger value="actions" className="gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary" data-testid="tab-actions">
                    <Zap className="w-3.5 h-3.5" />
                    <span className="text-xs">Műveletek</span>
                  </TabsTrigger>
                  <TabsTrigger value="presets" className="gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary" data-testid="tab-presets">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-xs">Presetek</span>
                  </TabsTrigger>
                  <TabsTrigger value="theme" className="gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary" data-testid="tab-theme">
                    <Settings className="w-3.5 h-3.5" />
                    <span className="text-xs">Téma</span>
                  </TabsTrigger>
                  <TabsTrigger value="inspector" className="gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary" data-testid="tab-inspector">
                    <Layers className="w-3.5 h-3.5" />
                    <span className="text-xs">Vizsgáló</span>
                  </TabsTrigger>
                  <TabsTrigger value="export" className="gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary" data-testid="tab-export">
                    <Code className="w-3.5 h-3.5" />
                    <span className="text-xs">Exportálás</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Content area with Phone Preview and Panel */}
              <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Phone Preview - centered */}
                <div className="flex items-center justify-center">
                  <PhonePreview />
                </div>

                {/* Panel content */}
                <div className="flex-1 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl p-4 shadow-lg overflow-hidden">
                  <ScrollArea className="h-full pr-2">
                    {rightPanel === 'actions' && <QuickActionsPanel />}
                    {rightPanel === 'presets' && <PresetsGallery />}
                    {rightPanel === 'theme' && <ThemeCustomizer />}
                    {rightPanel === 'inspector' && <PropertyInspector />}
                    {rightPanel === 'export' && <ExportPanel />}
                  </ScrollArea>
                </div>
              </div>
            </section>
          </div>
        </div>
        </SelectionProvider>
      </EffectProvider>
    </ThemeProvider>
  );
};

export default Index;