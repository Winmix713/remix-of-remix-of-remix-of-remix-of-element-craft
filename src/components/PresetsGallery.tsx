import { useEffects, GlassSettings, NeomorphSettings, ClaySettings, GlowSettings } from '@/contexts/ThemeContext';
import { Sparkles, Check, Save, Upload, Trash2, Download, LucideIcon } from 'lucide-react';
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

// ==================== TÍPUSDEFINÍCIÓK ====================
interface PresetSettings {
  glow: GlowSettings;
  glass: GlassSettings;
  neomorph: NeomorphSettings;
  clay: ClaySettings;
  activeEffects: ActiveEffects;
}

interface ActiveEffects {
  glow: boolean;
  glass: boolean;
  neomorph: boolean;
  clay: boolean;
}

interface Preset {
  id: string;
  name: string;
  description: string;
  isCustom?: boolean;
  preview: PreviewConfig;
  settings: PresetSettings;
}

interface PreviewConfig {
  gradient: string;
  borderColor: string;
}

interface PresetCardProps {
  preset: Preset;
  isSelected: boolean;
  onApply: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

interface ActionButtonConfig {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline';
}

interface SaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, description: string) => void;
}

// ==================== KONSTANSOK ====================
const CUSTOM_PRESETS_KEY = 'effect-editor-custom-presets';

const DEFAULT_PRESETS: readonly Preset[] = [
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
] as const;

// ==================== HELPER FUNKCIÓK ====================
class StorageManager {
  static loadCustomPresets(): Preset[] {
    try {
      const stored = localStorage.getItem(CUSTOM_PRESETS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load custom presets:', error);
      return [];
    }
  }

  static saveCustomPresets(presets: Preset[]): void {
    try {
      localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(presets));
    } catch (error) {
      console.error('Failed to save custom presets:', error);
      toast({
        title: "Tárolási hiba",
        description: "Nem sikerült menteni a presetet a helyi tárolóba.",
        variant: "destructive",
      });
    }
  }
}

class PresetGenerator {
  static createPreviewGradient(glowColor: string, tintColor: string): string {
    return `linear-gradient(135deg, ${glowColor}, ${tintColor})`;
  }

  static createCustomPreset(
    name: string,
    description: string,
    settings: PresetSettings
  ): Preset {
    return {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom preset',
      isCustom: true,
      preview: {
        gradient: this.createPreviewGradient(settings.glow.baseColor, settings.glass.tint),
        borderColor: settings.glow.baseColor,
      },
      settings: {
        glow: { ...settings.glow },
        glass: { ...settings.glass },
        neomorph: { ...settings.neomorph },
        clay: { ...settings.clay },
        activeEffects: { ...settings.activeEffects },
      },
    };
  }
}

class FileExporter {
  static exportAsJSON(data: PresetSettings, filename: string = 'effect-settings.json'): void {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({ 
        title: "Exportálva", 
        description: `Beállítások exportálva: ${filename}` 
      });
    } catch (error) {
      toast({ 
        title: "Export sikertelen", 
        description: "Nem sikerült exportálni a beállításokat.", 
        variant: "destructive" 
      });
    }
  }

  static async importFromJSON(file: File): Promise<Partial<PresetSettings> | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          resolve(data);
        } catch (error) {
          toast({ 
            title: "Import sikertelen", 
            description: "Érvénytelen JSON fájl.", 
            variant: "destructive" 
          });
          resolve(null);
        }
      };
      reader.onerror = () => {
        toast({ 
          title: "Import sikertelen", 
          description: "Nem sikerült beolvasni a fájlt.", 
          variant: "destructive" 
        });
        resolve(null);
      };
      reader.readAsText(file);
    });
  }
}

// ==================== ALKOMPONENSEK ====================
const SaveDialog = memo<SaveDialogProps>(({ open, onOpenChange, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      toast({ 
        title: "Hiba", 
        description: "Kérlek add meg a preset nevét.", 
        variant: "destructive" 
      });
      return;
    }
    onSave(name, description);
    setName('');
    setDescription('');
  }, [name, description, onSave]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 text-xs" data-testid="button-save-preset">
          <Save className="w-3 h-3 mr-1.5" />
          Mentés
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Egyéni preset mentése</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Név</label>
            <Input
              placeholder="Az én preset-em"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              data-testid="input-preset-name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Leírás (opcionális)</label>
            <Input
              placeholder="Rövid leírás..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              data-testid="input-preset-description"
            />
          </div>
          <Button onClick={handleSave} className="w-full" data-testid="button-confirm-save-preset">
            <Save className="w-4 h-4 mr-2" />
            Preset mentése
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

SaveDialog.displayName = 'SaveDialog';

const PresetCard = memo<PresetCardProps>(({ 
  preset, 
  isSelected, 
  onApply, 
  onDelete 
}) => (
  <div
    onClick={onApply}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onApply()}
    className="preset-card group p-3 text-left relative transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
    aria-label={`${preset.name} preset alkalmazása`}
    data-testid={`preset-card-${preset.id}`}
  >
    {/* Törlés gomb egyéni preseteknél */}
    {preset.isCustom && onDelete && (
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 p-1 rounded bg-destructive/80 hover:bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label={`${preset.name} törlése`}
        data-testid={`button-delete-preset-${preset.id}`}
      >
        <Trash2 className="w-3 h-3" />
      </button>
    )}
    
    {/* Előnézet gradiens */}
    <div 
      className="h-16 rounded-lg mb-2 relative overflow-hidden"
      style={{ background: preset.preview.gradient }}
    >
      <div className="absolute inset-0 bg-black/20" />
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="p-1.5 rounded-full bg-primary">
            <Check className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>
      )}
      {preset.isCustom && (
        <div className="absolute top-1 left-1 px-1.5 py-0.5 text-[8px] rounded bg-primary/80 text-primary-foreground font-medium">
          Egyéni
        </div>
      )}
    </div>
    
    {/* Információ */}
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: preset.preview.borderColor }}
          aria-hidden="true"
        />
        <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
          {preset.name}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground line-clamp-1">
        {preset.description}
      </p>
    </div>
    
    {/* Aktív effekt jelzők */}
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
  </div>
));

PresetCard.displayName = 'PresetCard';

// ==================== FŐ KOMPONENS ====================
export const PresetsGallery = memo(() => {
  const { 
    updateGlowSettings, 
    updateGlassSettings, 
    updateNeomorphSettings, 
    updateClaySettings, 
    state, 
    toggleEffect 
  } = useEffects();

  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customPresets, setCustomPresets] = useState<Preset[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom presets from localStorage
  useEffect(() => {
    setCustomPresets(StorageManager.loadCustomPresets());
  }, []);

  // All presets memoized
  const allPresets = useMemo(() => 
    [...DEFAULT_PRESETS, ...customPresets], 
    [customPresets]
  );

  // Apply effect changes
  const applyEffectChanges = useCallback((activeEffects: ActiveEffects) => {
    Object.entries(activeEffects).forEach(([effect, isActive]) => {
      const effectKey = effect as keyof ActiveEffects;
      if (state.activeEffects[effectKey] !== isActive) {
        toggleEffect(effectKey);
      }
    });
  }, [state.activeEffects, toggleEffect]);

  // Apply preset
  const applyPreset = useCallback((preset: Preset) => {
    updateGlowSettings(preset.settings.glow);
    updateGlassSettings(preset.settings.glass);
    updateNeomorphSettings(preset.settings.neomorph);
    updateClaySettings(preset.settings.clay);
    applyEffectChanges(preset.settings.activeEffects);
    
    setSelectedPreset(preset.id);
    
    toast({
      title: "Preset alkalmazva",
      description: `"${preset.name}" sikeresen alkalmazva.`,
    });
  }, [
    updateGlowSettings, 
    updateGlassSettings, 
    updateNeomorphSettings, 
    updateClaySettings,
    applyEffectChanges
  ]);

  // Save current as preset
  const handleSavePreset = useCallback((name: string, description: string) => {
    const newPreset = PresetGenerator.createCustomPreset(name, description, {
      glow: state.glowSettings,
      glass: state.glassSettings,
      neomorph: state.neomorphSettings,
      clay: state.claySettings,
      activeEffects: state.activeEffects,
    });

    const updatedPresets = [...customPresets, newPreset];
    StorageManager.saveCustomPresets(updatedPresets);
    setCustomPresets(updatedPresets);
    setSaveDialogOpen(false);

    toast({
      title: "Preset elmentve",
      description: `"${newPreset.name}" sikeresen mentve.`,
    });
  }, [customPresets, state]);

  // Delete custom preset
  const deleteCustomPreset = useCallback((presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPresets.filter(p => p.id !== presetId);
    StorageManager.saveCustomPresets(updated);
    setCustomPresets(updated);
    if (selectedPreset === presetId) setSelectedPreset(null);
    
    toast({ 
      title: "Preset törölve", 
      description: "Az egyéni preset eltávolítva." 
    });
  }, [customPresets, selectedPreset]);

  // Export settings
  const exportSettings = useCallback(() => {
    const exportData: PresetSettings = {
      glow: state.glowSettings,
      glass: state.glassSettings,
      neomorph: state.neomorphSettings,
      clay: state.claySettings,
      activeEffects: state.activeEffects,
    };
    
    FileExporter.exportAsJSON(exportData);
  }, [state]);

  // Import settings
  const importSettings = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await FileExporter.importFromJSON(file);
    if (!data) return;

    if (data.glow) updateGlowSettings(data.glow);
    if (data.glass) updateGlassSettings(data.glass);
    if (data.neomorph) updateNeomorphSettings(data.neomorph);
    if (data.clay) updateClaySettings(data.clay);
    if (data.activeEffects) applyEffectChanges(data.activeEffects);
    
    toast({ 
      title: "Importálva", 
      description: "Beállítások sikeresen importálva." 
    });

    e.target.value = '';
  }, [
    updateGlowSettings, 
    updateGlassSettings, 
    updateNeomorphSettings, 
    updateClaySettings,
    applyEffectChanges
  ]);

  return (
    <div className="space-y-4">
      {/* Fejléc */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Effekt presetek</h3>
            <p className="text-xs text-muted-foreground">Egy kattintásos téma kombinációk</p>
          </div>
        </div>
      </div>

      {/* Mentés és import vezérlők */}
      <div className="flex gap-2 mb-4">
        <SaveDialog
          open={saveDialogOpen}
          onOpenChange={setSaveDialogOpen}
          onSave={handleSavePreset}
        />

        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs" 
          onClick={exportSettings}
          aria-label="Jelenlegi beállítások exportálása"
          data-testid="button-export-settings"
        >
          <Download className="w-3 h-3 mr-1.5" />
          Exportálás
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs" 
          onClick={() => fileInputRef.current?.click()}
          aria-label="Beállítások importálása fájlból"
          data-testid="button-import-settings"
        >
          <Upload className="w-3 h-3 mr-1.5" />
          Importálás
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importSettings}
          className="hidden"
          aria-label="File input for importing settings"
        />
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-2 gap-3">
        {allPresets.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            isSelected={selectedPreset === preset.id}
            onApply={() => applyPreset(preset)}
            onDelete={preset.isCustom ? (e) => deleteCustomPreset(preset.id, e) : undefined}
          />
        ))}
      </div>

      {allPresets.length === DEFAULT_PRESETS.length && (
        <p className="text-xs text-center text-muted-foreground pt-2">
          Mentsd el saját presetjeidet, hogy itt megjelenjenek
        </p>
      )}
    </div>
  );
});

PresetsGallery.displayName = 'PresetsGallery';
