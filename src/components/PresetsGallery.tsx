import { useEffects, GlassSettings, NeomorphSettings, ClaySettings, GlowSettings } from '@/contexts/EffectContext';
import { Sparkles, Check, Save, Upload, Trash2, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface Preset {
  id: string;
  name: string;
  description: string;
  isCustom?: boolean;
  preview: {
    gradient: string;
    borderColor: string;
  };
  settings: {
    glow: GlowSettings;
    glass: GlassSettings;
    neomorph: NeomorphSettings;
    clay: ClaySettings;
    activeEffects: {
      glow: boolean;
      glass: boolean;
      neomorph: boolean;
      clay: boolean;
    };
  };
}

const defaultPresets: Preset[] = [
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Ethereal northern lights glow',
    preview: {
      gradient: 'linear-gradient(135deg, #10B981, #06B6D4, #8B5CF6)',
      borderColor: '#10B981',
    },
    settings: {
      glow: { lightness: 72, chroma: 0.22, hue: 160, baseColor: '#10B981', animation: 'breathe', animationSpeed: 3, animationIntensity: 60 },
      glass: { blur: 16, opacity: 15, saturation: 140, borderWidth: 1, borderOpacity: 25, tint: '#10B981', tintStrength: 15 },
      neomorph: { distance: 8, blur: 24, intensity: 40, shape: 'convex', lightSource: 145, surfaceColor: '#0F172A' },
      clay: { depth: 8, spread: 12, borderRadius: 20, highlightColor: '#34D399', shadowColor: '#064E3B', surfaceTexture: 'glossy', bendAngle: 5 },
      activeEffects: { glow: true, glass: true, neomorph: false, clay: false },
    },
  },
  {
    id: 'sunset',
    name: 'Golden Sunset',
    description: 'Warm amber and rose tones',
    preview: {
      gradient: 'linear-gradient(135deg, #F59E0B, #EF4444, #EC4899)',
      borderColor: '#F59E0B',
    },
    settings: {
      glow: { lightness: 78, chroma: 0.24, hue: 35, baseColor: '#F59E0B', animation: 'pulse', animationSpeed: 2, animationIntensity: 50 },
      glass: { blur: 20, opacity: 25, saturation: 130, borderWidth: 1, borderOpacity: 30, tint: '#FEF3C7', tintStrength: 20 },
      neomorph: { distance: 12, blur: 28, intensity: 55, shape: 'flat', lightSource: 135, surfaceColor: '#1F1F1F' },
      clay: { depth: 12, spread: 15, borderRadius: 28, highlightColor: '#FDE68A', shadowColor: '#78350F', surfaceTexture: 'smooth', bendAngle: 0 },
      activeEffects: { glow: true, glass: false, neomorph: false, clay: true },
    },
  },
  {
    id: 'neon-purple',
    name: 'Neon Nights',
    description: 'Electric purple cyberpunk vibes',
    preview: {
      gradient: 'linear-gradient(135deg, #8B5CF6, #A855F7, #EC4899)',
      borderColor: '#8B5CF6',
    },
    settings: {
      glow: { lightness: 68, chroma: 0.28, hue: 280, baseColor: '#A855F7', animation: 'wave', animationSpeed: 2.5, animationIntensity: 70 },
      glass: { blur: 12, opacity: 20, saturation: 160, borderWidth: 2, borderOpacity: 40, tint: '#C084FC', tintStrength: 25 },
      neomorph: { distance: 10, blur: 35, intensity: 60, shape: 'convex', lightSource: 120, surfaceColor: '#1E1B4B' },
      clay: { depth: 15, spread: 18, borderRadius: 32, highlightColor: '#E9D5FF', shadowColor: '#4C1D95', surfaceTexture: 'glossy', bendAngle: -5 },
      activeEffects: { glow: true, glass: true, neomorph: true, clay: false },
    },
  },
  {
    id: 'ocean-depth',
    name: 'Ocean Depth',
    description: 'Deep sea blues and teals',
    preview: {
      gradient: 'linear-gradient(135deg, #0EA5E9, #06B6D4, #14B8A6)',
      borderColor: '#06B6D4',
    },
    settings: {
      glow: { lightness: 65, chroma: 0.2, hue: 195, baseColor: '#06B6D4', animation: 'breathe', animationSpeed: 4, animationIntensity: 40 },
      glass: { blur: 18, opacity: 18, saturation: 150, borderWidth: 1, borderOpacity: 20, tint: '#0891B2', tintStrength: 12 },
      neomorph: { distance: 6, blur: 20, intensity: 35, shape: 'pressed', lightSource: 160, surfaceColor: '#0F172A' },
      clay: { depth: 6, spread: 10, borderRadius: 16, highlightColor: '#67E8F9', shadowColor: '#164E63', surfaceTexture: 'matte', bendAngle: 3 },
      activeEffects: { glow: true, glass: true, neomorph: false, clay: false },
    },
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    description: 'Elegant rose and gold tones',
    preview: {
      gradient: 'linear-gradient(135deg, #FB7185, #F472B6, #FBBF24)',
      borderColor: '#F472B6',
    },
    settings: {
      glow: { lightness: 75, chroma: 0.18, hue: 350, baseColor: '#FB7185', animation: 'none', animationSpeed: 2, animationIntensity: 50 },
      glass: { blur: 14, opacity: 22, saturation: 125, borderWidth: 1, borderOpacity: 35, tint: '#FDF2F8', tintStrength: 18 },
      neomorph: { distance: 8, blur: 22, intensity: 45, shape: 'convex', lightSource: 130, surfaceColor: '#2D2D2D' },
      clay: { depth: 10, spread: 14, borderRadius: 24, highlightColor: '#FBCFE8', shadowColor: '#831843', surfaceTexture: 'smooth', bendAngle: 2 },
      activeEffects: { glow: true, glass: false, neomorph: true, clay: false },
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark mode with subtle blue glow',
    preview: {
      gradient: 'linear-gradient(135deg, #1E293B, #334155, #3B82F6)',
      borderColor: '#3B82F6',
    },
    settings: {
      glow: { lightness: 55, chroma: 0.15, hue: 220, baseColor: '#3B82F6', animation: 'pulse', animationSpeed: 3, animationIntensity: 30 },
      glass: { blur: 10, opacity: 12, saturation: 110, borderWidth: 1, borderOpacity: 15, tint: '#1E40AF', tintStrength: 8 },
      neomorph: { distance: 12, blur: 32, intensity: 50, shape: 'flat', lightSource: 145, surfaceColor: '#0F172A' },
      clay: { depth: 8, spread: 10, borderRadius: 20, highlightColor: '#93C5FD', shadowColor: '#1E3A8A', surfaceTexture: 'matte', bendAngle: 0 },
      activeEffects: { glow: true, glass: false, neomorph: true, clay: false },
    },
  },
];

const CUSTOM_PRESETS_KEY = 'effect-editor-custom-presets';

export const PresetsGallery = () => {
  const { updateGlowSettings, updateGlassSettings, updateNeomorphSettings, updateClaySettings, state, toggleEffect } = useEffects();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customPresets, setCustomPresets] = useState<Preset[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom presets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CUSTOM_PRESETS_KEY);
    if (stored) {
      try {
        setCustomPresets(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load custom presets:', e);
      }
    }
  }, []);

  // Save custom presets to localStorage
  const saveCustomPresetsToStorage = (presets: Preset[]) => {
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(presets));
    setCustomPresets(presets);
  };

  const applyPreset = (preset: Preset) => {
    updateGlowSettings(preset.settings.glow);
    updateGlassSettings(preset.settings.glass);
    updateNeomorphSettings(preset.settings.neomorph);
    updateClaySettings(preset.settings.clay);
    
    Object.entries(preset.settings.activeEffects).forEach(([effect, isActive]) => {
      const effectKey = effect as keyof typeof state.activeEffects;
      if (state.activeEffects[effectKey] !== isActive) {
        toggleEffect(effectKey);
      }
    });
    
    setSelectedPreset(preset.id);
    
    toast({
      title: "Preset Applied",
      description: `"${preset.name}" has been applied to your design.`,
    });
  };

  const saveCurrentAsPreset = () => {
    if (!presetName.trim()) {
      toast({ title: "Error", description: "Please enter a preset name.", variant: "destructive" });
      return;
    }

    const newPreset: Preset = {
      id: `custom-${Date.now()}`,
      name: presetName.trim(),
      description: presetDescription.trim() || 'Custom preset',
      isCustom: true,
      preview: {
        gradient: `linear-gradient(135deg, ${state.glowSettings.baseColor}, ${state.glassSettings.tint})`,
        borderColor: state.glowSettings.baseColor,
      },
      settings: {
        glow: { ...state.glowSettings },
        glass: { ...state.glassSettings },
        neomorph: { ...state.neomorphSettings },
        clay: { ...state.claySettings },
        activeEffects: { ...state.activeEffects },
      },
    };

    saveCustomPresetsToStorage([...customPresets, newPreset]);
    setPresetName('');
    setPresetDescription('');
    setSaveDialogOpen(false);

    toast({
      title: "Preset Saved",
      description: `"${newPreset.name}" has been saved to your presets.`,
    });
  };

  const deleteCustomPreset = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPresets.filter(p => p.id !== presetId);
    saveCustomPresetsToStorage(updated);
    if (selectedPreset === presetId) setSelectedPreset(null);
    toast({ title: "Preset Deleted", description: "Custom preset has been removed." });
  };

  const exportSettings = () => {
    const exportData = {
      glow: state.glowSettings,
      glass: state.glassSettings,
      neomorph: state.neomorphSettings,
      clay: state.claySettings,
      activeEffects: state.activeEffects,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'effect-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Exported", description: "Settings exported as JSON file." });
  };

  const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        if (data.glow) updateGlowSettings(data.glow);
        if (data.glass) updateGlassSettings(data.glass);
        if (data.neomorph) updateNeomorphSettings(data.neomorph);
        if (data.clay) updateClaySettings(data.clay);
        if (data.activeEffects) {
          Object.entries(data.activeEffects).forEach(([effect, isActive]) => {
            const effectKey = effect as keyof typeof state.activeEffects;
            if (state.activeEffects[effectKey] !== isActive) {
              toggleEffect(effectKey);
            }
          });
        }
        
        toast({ title: "Imported", description: "Settings imported successfully." });
      } catch (err) {
        toast({ title: "Import Failed", description: "Invalid JSON file.", variant: "destructive" });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const allPresets = [...defaultPresets, ...customPresets];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Effect Presets</h3>
            <p className="text-xs text-muted-foreground">One-click theme combinations</p>
          </div>
        </div>
      </div>

      {/* Save & Import Controls */}
      <div className="flex gap-2 mb-4">
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Save className="w-3 h-3 mr-1.5" />
              Save Current
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save Custom Preset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  placeholder="My awesome preset"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (optional)</label>
                <Input
                  placeholder="A brief description..."
                  value={presetDescription}
                  onChange={(e) => setPresetDescription(e.target.value)}
                />
              </div>
              <Button onClick={saveCurrentAsPreset} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Preset
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="sm" className="text-xs" onClick={exportSettings}>
          <Download className="w-3 h-3 mr-1.5" />
          Export
        </Button>

        <Button variant="outline" size="sm" className="text-xs" onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-3 h-3 mr-1.5" />
          Import
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importSettings}
          className="hidden"
        />
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-2 gap-3">
        {allPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset)}
            className="preset-card group p-3 text-left relative"
          >
            {/* Delete button for custom presets */}
            {preset.isCustom && (
              <button
                onClick={(e) => deleteCustomPreset(preset.id, e)}
                className="absolute top-2 right-2 p-1 rounded bg-destructive/80 hover:bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            
            {/* Preview gradient */}
            <div 
              className="h-16 rounded-lg mb-2 relative overflow-hidden"
              style={{ background: preset.preview.gradient }}
            >
              <div className="absolute inset-0 bg-black/20" />
              {selectedPreset === preset.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="p-1.5 rounded-full bg-primary">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                </div>
              )}
              {preset.isCustom && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 text-[8px] rounded bg-primary/80 text-primary-foreground">
                  Custom
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: preset.preview.borderColor }}
                />
                <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                  {preset.name}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {preset.description}
              </p>
            </div>
            
            {/* Active effects indicators */}
            <div className="flex gap-1 mt-2 flex-wrap">
              {Object.entries(preset.settings.activeEffects).map(([effect, isActive]) => (
                isActive && (
                  <span 
                    key={effect}
                    className="px-1.5 py-0.5 text-[9px] rounded bg-secondary text-muted-foreground capitalize"
                  >
                    {effect}
                  </span>
                )
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};