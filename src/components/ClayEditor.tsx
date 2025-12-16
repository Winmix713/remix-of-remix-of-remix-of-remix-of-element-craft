import { useEffects } from '@/contexts/EffectContext';
import { Slider } from './ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

type SurfaceTexture = 'smooth' | 'matte' | 'glossy';
type ShadowDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ClayPreset {
  depth: number;
  spread: number;
  borderRadius: number;
  opacity: number;
  blur: number;
  bendAngle: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CLAY_LIMITS = {
  depth: { min: 5, max: 20, step: 1, default: 10 },
  spread: { min: 0, max: 30, step: 1, default: 15 },
  borderRadius: { min: 8, max: 40, step: 1, default: 24 },
  bendAngle: { min: -15, max: 15, step: 1, default: 0 },
  opacity: { min: 0, max: 1, step: 0.1, default: 1 },
  blur: { min: 0, max: 10, step: 1, default: 5 },
} as const;

const TEXTURES: { value: SurfaceTexture; label: string }[] = [
  { value: 'smooth', label: 'Smooth' },
  { value: 'matte', label: 'Matte' },
  { value: 'glossy', label: 'Glossy' },
];

const SHADOW_DIRECTIONS: { value: ShadowDirection; icon: string; label: string }[] = [
  { value: 'top-left', icon: '↖', label: 'Top Left' },
  { value: 'top-right', icon: '↗', label: 'Top Right' },
  { value: 'bottom-left', icon: '↙', label: 'Bottom Left' },
  { value: 'bottom-right', icon: '↘', label: 'Bottom Right' },
];

const CLAY_PRESETS: Record<string, ClayPreset> = {
  soft: { 
    depth: 8, 
    spread: 20, 
    borderRadius: 28, 
    opacity: 1, 
    blur: 6,
    bendAngle: 0 
  },
  sharp: { 
    depth: 15, 
    spread: 8, 
    borderRadius: 12, 
    opacity: 0.95, 
    blur: 3,
    bendAngle: -5 
  },
  glass: { 
    depth: 6, 
    spread: 25, 
    borderRadius: 32, 
    opacity: 0.75, 
    blur: 8,
    bendAngle: 2 
  },
  bold: {
    depth: 18,
    spread: 12,
    borderRadius: 20,
    opacity: 1,
    blur: 4,
    bendAngle: -8
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getShadowOffsets = (direction: ShadowDirection, depth: number) => {
  const offsets = {
    'top-left': { x: -depth * 3.5, y: -depth * 3.5 },
    'top-right': { x: depth * 3.5, y: -depth * 3.5 },
    'bottom-left': { x: -depth * 3.5, y: depth * 3.5 },
    'bottom-right': { x: depth * 3.5, y: depth * 3.5 },
  };
  return offsets[direction];
};

const generateClayCSS = (settings: any) => {
  const { depth, borderRadius, highlightColor, shadowColor, blur, opacity, shadowDirection = 'bottom-right' } = settings;
  const offset = getShadowOffsets(shadowDirection, depth);
  
  return `backdrop-filter: blur(${blur}px);
background-color: rgba(255, 255, 255, ${opacity});
border-radius: ${borderRadius}px;
box-shadow: ${offset.x}px ${offset.y}px ${depth * 8.5}px 0px ${shadowColor}80,
  inset -8px -8px 16px 0px ${shadowColor}99,
  inset 0px 11px 28px 0px ${highlightColor};`;
};

// ============================================================================
// COMPONENT
// ============================================================================

export const ClayEditor = memo(() => {
  const { state, updateClaySettings } = useEffects();
  const { claySettings } = state;
  
  const [highlightInput, setHighlightInput] = useState(claySettings.highlightColor);
  const [shadowInput, setShadowInput] = useState(claySettings.shadowColor);
  const [copied, setCopied] = useState(false);

  // Sync local state with global state
  useEffect(() => {
    setHighlightInput(claySettings.highlightColor);
  }, [claySettings.highlightColor]);

  useEffect(() => {
    setShadowInput(claySettings.shadowColor);
  }, [claySettings.shadowColor]);

  // Memoized handlers
  const handleDepthChange = useCallback(
    ([val]: number[]) => updateClaySettings({ depth: val }),
    [updateClaySettings]
  );

  const handleSpreadChange = useCallback(
    ([val]: number[]) => updateClaySettings({ spread: val }),
    [updateClaySettings]
  );

  const handleBorderRadiusChange = useCallback(
    ([val]: number[]) => updateClaySettings({ borderRadius: val }),
    [updateClaySettings]
  );

  const handleBendAngleChange = useCallback(
    ([val]: number[]) => updateClaySettings({ bendAngle: val }),
    [updateClaySettings]
  );

  const handleOpacityChange = useCallback(
    ([val]: number[]) => updateClaySettings({ opacity: val }),
    [updateClaySettings]
  );

  const handleBlurChange = useCallback(
    ([val]: number[]) => updateClaySettings({ blur: val }),
    [updateClaySettings]
  );

  const handleTextureChange = useCallback(
    (texture: SurfaceTexture) => updateClaySettings({ surfaceTexture: texture }),
    [updateClaySettings]
  );

  const handleShadowDirectionChange = useCallback(
    (direction: ShadowDirection) => updateClaySettings({ shadowDirection: direction }),
    [updateClaySettings]
  );

  const handleHighlightColorChange = useCallback(
    (color: string) => {
      setHighlightInput(color);
      updateClaySettings({ highlightColor: color });
    },
    [updateClaySettings]
  );

  const handleShadowColorChange = useCallback(
    (color: string) => {
      setShadowInput(color);
      updateClaySettings({ shadowColor: color });
    },
    [updateClaySettings]
  );

  const handlePresetChange = useCallback(
    (preset: ClayPreset) => updateClaySettings(preset),
    [updateClaySettings]
  );

  const cssCode = useMemo(() => generateClayCSS(claySettings), [claySettings]);

  const copyCSS = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy CSS:', err);
    }
  }, [cssCode]);

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="space-y-2">
        <span className="text-xs text-zinc-500 font-medium">Presets</span>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(CLAY_PRESETS).map(([name, preset]) => (
            <button
              key={name}
              onClick={() => handlePresetChange(preset)}
              className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all capitalize"
              aria-label={`Apply ${name} preset`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Depth */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Depth</span>
          <span className="font-mono">{claySettings.depth}px</span>
        </div>
        <Slider
          value={[claySettings.depth]}
          onValueChange={handleDepthChange}
          min={CLAY_LIMITS.depth.min}
          max={CLAY_LIMITS.depth.max}
          step={CLAY_LIMITS.depth.step}
          aria-label="Clay depth control"
          className="w-full"
        />
      </div>

      {/* Spread */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Spread</span>
          <span className="font-mono">{claySettings.spread}px</span>
        </div>
        <Slider
          value={[claySettings.spread]}
          onValueChange={handleSpreadChange}
          min={CLAY_LIMITS.spread.min}
          max={CLAY_LIMITS.spread.max}
          step={CLAY_LIMITS.spread.step}
          aria-label="Clay spread control"
          className="w-full"
        />
      </div>

      {/* Border Radius */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Border Radius</span>
          <span className="font-mono">{claySettings.borderRadius}px</span>
        </div>
        <Slider
          value={[claySettings.borderRadius]}
          onValueChange={handleBorderRadiusChange}
          min={CLAY_LIMITS.borderRadius.min}
          max={CLAY_LIMITS.borderRadius.max}
          step={CLAY_LIMITS.borderRadius.step}
          aria-label="Border radius control"
          className="w-full"
        />
      </div>

      {/* Opacity */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Opacity</span>
          <span className="font-mono">{claySettings.opacity?.toFixed(1) ?? '1.0'}</span>
        </div>
        <Slider
          value={[claySettings.opacity ?? 1]}
          onValueChange={handleOpacityChange}
          min={CLAY_LIMITS.opacity.min}
          max={CLAY_LIMITS.opacity.max}
          step={CLAY_LIMITS.opacity.step}
          aria-label="Opacity control"
          className="w-full"
        />
      </div>

      {/* Background Blur */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Background Blur</span>
          <span className="font-mono">{claySettings.blur ?? 0}px</span>
        </div>
        <Slider
          value={[claySettings.blur ?? 0]}
          onValueChange={handleBlurChange}
          min={CLAY_LIMITS.blur.min}
          max={CLAY_LIMITS.blur.max}
          step={CLAY_LIMITS.blur.step}
          aria-label="Background blur control"
          className="w-full"
        />
      </div>

      {/* Surface Texture */}
      <div className="space-y-2">
        <span className="text-xs text-zinc-500 font-medium">Surface Texture</span>
        <div className="grid grid-cols-3 gap-2">
          {TEXTURES.map((texture) => (
            <button
              key={texture.value}
              onClick={() => handleTextureChange(texture.value)}
              className={cn(
                "flex items-center justify-center p-2.5 rounded-xl border transition-all text-xs font-medium",
                claySettings.surfaceTexture === texture.value
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50"
              )}
              aria-label={`Select ${texture.label} texture`}
              aria-pressed={claySettings.surfaceTexture === texture.value}
            >
              {texture.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shadow Direction */}
      <div className="space-y-2">
        <span className="text-xs text-zinc-500 font-medium">Shadow Direction</span>
        <div className="grid grid-cols-4 gap-2">
          {SHADOW_DIRECTIONS.map((dir) => (
            <button
              key={dir.value}
              onClick={() => handleShadowDirectionChange(dir.value)}
              className={cn(
                "flex items-center justify-center p-3 rounded-xl border transition-all",
                (claySettings.shadowDirection ?? 'bottom-right') === dir.value
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50"
              )}
              aria-label={dir.label}
              aria-pressed={(claySettings.shadowDirection ?? 'bottom-right') === dir.value}
            >
              <span className="text-xl">{dir.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Highlight Color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="highlight-color" className="text-xs text-zinc-500 font-medium">
            Highlight Color
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button 
                id="highlight-color"
                className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-3 h-8 cursor-pointer hover:border-zinc-700 transition-colors"
                aria-label="Select highlight color"
              >
                <div 
                  className="w-6 h-6 rounded-md border border-white/20"
                  style={{ backgroundColor: claySettings.highlightColor }}
                />
                <span className="text-xs text-zinc-300 font-mono uppercase">{highlightInput}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
              <HexColorPicker 
                color={claySettings.highlightColor} 
                onChange={handleHighlightColorChange} 
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Shadow Color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="shadow-color" className="text-xs text-zinc-500 font-medium">
            Shadow Color
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button 
                id="shadow-color"
                className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-3 h-8 cursor-pointer hover:border-zinc-700 transition-colors"
                aria-label="Select shadow color"
              >
                <div 
                  className="w-6 h-6 rounded-md border border-white/20"
                  style={{ backgroundColor: claySettings.shadowColor }}
                />
                <span className="text-xs text-zinc-300 font-mono uppercase">{shadowInput}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
              <HexColorPicker 
                color={claySettings.shadowColor} 
                onChange={handleShadowColorChange} 
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Bend Angle */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Bend Angle</span>
          <span className="font-mono">{claySettings.bendAngle}°</span>
        </div>
        <Slider
          value={[claySettings.bendAngle]}
          onValueChange={handleBendAngleChange}
          min={CLAY_LIMITS.bendAngle.min}
          max={CLAY_LIMITS.bendAngle.max}
          step={CLAY_LIMITS.bendAngle.step}
          aria-label="Bend angle control"
          className="w-full"
        />
      </div>

      {/* CSS Output */}
      <div className="space-y-3 pt-4 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">Generated CSS</span>
          <span className="text-xs text-zinc-600">{cssCode.split('\n').length} lines</span>
        </div>
        <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap break-all">
          {cssCode}
        </pre>
        <button
          onClick={copyCSS}
          className={cn(
            "w-full flex items-center justify-center gap-2 font-medium py-2.5 px-4 rounded-xl transition-all",
            copied
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-amber-500 hover:bg-amber-600 text-zinc-900"
          )}
          aria-label="Copy CSS to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied to clipboard!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy CSS
            </>
          )}
        </button>
      </div>
    </div>
  );
});

ClayEditor.displayName = 'ClayEditor';
