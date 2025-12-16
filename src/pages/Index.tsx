import { ThemeProvider } from "@/contexts/ThemeContext";
import { EffectProvider } from "@/contexts/EffectContext";
import { MultiEffectEditor } from "@/components/MultiEffectEditor";
import { EffectEditorTabs } from "@/components/EffectEditorTabs";
import { PhonePreview } from "@/components/PhonePreview";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { PropertyInspector } from "@/components/PropertyInspector";
import { PresetsGallery } from "@/components/PresetsGallery";
import { ExportPanel } from "@/components/ExportPanel";
import { useState } from "react";
import { Settings, Layers, Sparkles, Code } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

type RightPanel = 'theme' | 'inspector' | 'presets' | 'export';

const Index = () => {
  const [rightPanel, setRightPanel] = useState<RightPanel>('presets');

  return (
    <ThemeProvider>
      <EffectProvider>
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground antialiased font-outfit">
          {/* Background gradient */}
          <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-violet/5 pointer-events-none" />
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
            <div className="flex flex-col xl:flex-row gap-6 md:gap-8 xl:gap-10 items-start">
              {/* Left: Editor Panel */}
              <section className="w-full xl:w-[55%]">
                <div className="relative rounded-3xl border border-border/80 bg-card/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_22px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl overflow-hidden">
                  {/* Top bar */}
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
                          Fine-tune lights, shadows, and moods in real-time
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content grid */}
                  <div className="flex flex-col md:flex-row gap-5 sm:gap-6 px-5 sm:px-6 pb-5 sm:pb-6 pt-4 sm:pt-5">
                    {/* Left column: Active Effects */}
                    <div className="w-full md:w-[40%]">
                      <MultiEffectEditor />
                    </div>

                    {/* Right column: Tabbed Effect Editors */}
                    <div className="w-full md:w-[60%]">
                      <EffectEditorTabs />
                    </div>
                  </div>

                  {/* Bottom footer */}
                  <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-border/80 bg-card/90">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-secondary border border-border/80">
                        <Settings className="h-2.5 w-2.5 text-muted-foreground" />
                      </span>
                      <span className="tracking-tight">
                        Use Ctrl+Z / Ctrl+Y for undo/redo
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary">
                      <Sparkles className="w-3 h-3" />
                      <span className="font-medium">Effect Studio</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Middle: Phone Preview */}
              <section className="w-full xl:w-auto flex justify-center">
                <PhonePreview />
              </section>

              {/* Right: Theme Customizer / Property Inspector / Presets / Export */}
              <section className="w-full xl:w-80 flex flex-col gap-4">
                <Tabs value={rightPanel} onValueChange={(v) => setRightPanel(v as RightPanel)} className="w-full">
                  <TabsList className="w-full bg-secondary/50 border border-border/80 grid grid-cols-4">
                    <TabsTrigger value="presets" className="gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-xs">Presets</span>
                    </TabsTrigger>
                    <TabsTrigger value="theme" className="gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Settings className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-xs">Theme</span>
                    </TabsTrigger>
                    <TabsTrigger value="inspector" className="gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Layers className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-xs">Inspect</span>
                    </TabsTrigger>
                    <TabsTrigger value="export" className="gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Code className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-xs">Export</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl p-4 shadow-lg">
                  <ScrollArea className="h-[600px] pr-2">
                    {rightPanel === 'presets' && <PresetsGallery />}
                    {rightPanel === 'theme' && <ThemeCustomizer />}
                    {rightPanel === 'inspector' && <PropertyInspector />}
                    {rightPanel === 'export' && <ExportPanel />}
                  </ScrollArea>
                </div>
              </section>
            </div>
          </div>
        </div>
      </EffectProvider>
    </ThemeProvider>
  );
};

export default Index;