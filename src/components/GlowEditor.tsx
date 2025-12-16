import { useState, useCallback, useMemo, memo } from 'react';
import { useEffects, GlowAnimationType } from '@/contexts/ThemeContext';
import { ChevronDown, Code, RotateCcw, Sparkles, LucideIcon } from 'lucide-react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

// ==================== TÍPUSDEFINÍCIÓK ====================
interface SliderConfig {
  id: string;
  label: string;
  valueKey: keyof GlowSettings;
  min: number;
  max: number;
  step: number;
  unit?: string;
  gradient?: string;
  formatValue?: (value: number) => string;
}

interface CollapsibleSectionProps {
  title: string;
  icon?: LucideIcon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface ColorPickerProps {
  color: string;
  hexInput: string;
  onColorChange: (color: string) => void;
  onHexInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface AnimationControlsProps {
  animation: GlowAnimationType;
  animationSpeed: number;
  animationIntensity: number;
  onAnimationChange: (value: GlowAnimationType) => void;
  onSpeedChange: (value: number) => void;
  onIntensityChange: (value: number) => void;
}

type GlowSettings = {
  baseColor: string;
  lightness: number;
  chroma: number;
  hue: number;
  animation: GlowAnimationType;
  animationSpeed: number;
  animationIntensity: number;
};

type BlurSettings = {
  x: number;
  y: number;
};

// ==================== KONSTANSOK ====================
const SLIDER_CONFIGS: readonly SliderConfig[] = [
  {
    id: 'lightness',
    label: 'Lightness',
    valueKey: 'lightness',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    gradient: 'linear-gradient(to right, black, white)',
  },
  {
    id: 'chroma',
    label: 'Chroma',
    valueKey: 'chroma',
    min: 0,
    max: 400,
    step: 1,
    unit: '',
    gradient: 'linear-gradient(to right, gray, #fbbf24)',
    formatValue: (value: number) => (value / 1000).toFixed(3),
  },
  {
    id: 'hue',
    label: 'Hue',
    valueKey: 'hue',
    min: 0,
    max: 360,
    step: 1,
    unit: '°',
    gradient: 'linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)',
  },
] as const;

const ANIMATION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'breathe', label: 'Breathe' },
  { value: 'wave', label: 'Wave' },
] as const;

const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark Mode' },
  { value: 'light', label: 'Light Mode' },
  { value: 'auto', label: 'Auto' },
] as const;

const BLUR_SLIDERS = [
  { id: 'x', label: 'Horizontal (X)', min: -800, max: -350, step: 10, unit: 'px' },
  { id: 'y', label: 'Vertical (Y)', min: -1400, max: -600, step: 10, unit: 'px' },
] as const;

// ==================== HELPER FUNKCIÓK ====================
const isValidHexColor = (color: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(color);

const normalizeChromaValue = (value: number, isInput: boolean): number => {
  return isInput ? value * 1000 : value / 1000;
};

// ==================== ALKOMPONENSEK ====================
const CollapsibleSection = memo<CollapsibleSectionProps>(({ 
  title, 
  icon: Icon, 
  open, 
  onOpenChange, 
  children 
}) => (
  <Collapsible open={open} onOpenChange={onOpenChange}>
    <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-zinc-400 hover:text-zinc-300 transition-colors group">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{title}</span>
      </div>
      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", open && "rotate-180")} />
    </CollapsibleTrigger>
    <CollapsibleContent className="mt-4 space-y-4">
      {children}
    </CollapsibleContent>
  </Collapsible>
));

CollapsibleSection.displayName = 'CollapsibleSection';

const ColorPicker = memo<ColorPickerProps>(({ 
  color, 
  hexInput, 
  onColorChange, 
  onHexInputChange 
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-3 h-8 cursor-pointer hover:border-zinc-700 transition-colors">
        <div 
          className="w-6 h-6 rounded-md border border-white/20 shadow-inner"
          style={{ backgroundColor: color }}
          aria-label="Selected color"
        />
        <input 
          type="text" 
          className="bg-transparent border-none outline-none text-xs text-zinc-300 w-16 uppercase font-mono"
          value={hexInput}
          onChange={onHexInputChange}
          onClick={(e) => e.stopPropagation()}
          aria-label="Hex color input"
        />
      </div>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
      <HexColorPicker color={color} onChange={onColorChange} />
    </PopoverContent>
  </Popover>
));

ColorPicker.displayName = 'ColorPicker';

const GradientSlider = memo<{
  config: SliderConfig;
  value: number;
  onChange: (value: number) => void;
}>(({ config, value, onChange }) => {
  const displayValue = config.formatValue 
    ? config.formatValue(value)
    : `${value}${config.unit || ''}`;

  const sliderValue = config.id === 'chroma' 
    ? normalizeChromaValue(value, true)
    : value;

  const handleChange = useCallback(([val]: number[]) => {
    const finalValue = config.id === 'chroma' 
      ? normalizeChromaValue(val, false)
      : val;
    onChange(finalValue);
  }, [config.id, onChange]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-zinc-500">
        <span>{config.label}</span>
        <span>{displayValue}</span>
      </div>
      <div className="relative h-4 w-full">
        <div className="absolute inset-0 rounded-full bg-zinc-900 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-80"
            style={{ background: config.gradient }}
          />
        </div>
        <Slider
          value={[sliderValue]}
          onValueChange={handleChange}
          min={config.min}
          max={config.max}
          step={config.step}
          className="absolute inset-0 [&_[data-slot=slider-track]]:bg-transparent [&_[data-slot=slider-range]]:bg-transparent"
          aria-label={`${config.label} slider`}
        />
      </div>
    </div>
  );
});

GradientSlider.displayName = 'GradientSlider';

const AnimationControls = memo<AnimationControlsProps>(({
  animation,
  animationSpeed,
  animationIntensity,
  onAnimationChange,
  onSpeedChange,
  onIntensityChange,
}) => (
  <>
    <div className="space-y-2">
      <label className="text-xs text-zinc-500">Animation Type</label>
      <Select value={animation} onValueChange={onAnimationChange}>
        <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-zinc-300 h-9 rounded-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ANIMATION_OPTIONS.map(({ value, label }) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {animation !== 'none' && (
      <>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Speed</span>
            <span>{animationSpeed.toFixed(1)}s</span>
          </div>
          <Slider
            value={[animationSpeed]}
            onValueChange={([val]) => onSpeedChange(val)}
            min={0.5}
            max={5}
            step={0.1}
            className="w-full"
            aria-label="Animation speed"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Intensity</span>
            <span>{animationIntensity}%</span>
          </div>
          <Slider
            value={[animationIntensity]}
            onValueChange={([val]) => onIntensityChange(val)}
            min={10}
            max={100}
            step={5}
            className="w-full"
            aria-label="Animation intensity"
          />
        </div>
      </>
    )}
  </>
));

AnimationControls.displayName = 'AnimationControls';

const BlurControls = memo<{
  blurSettings: BlurSettings;
  onUpdate: (settings: Partial<BlurSettings>) => void;
  onReset: () => void;
}>(({ blurSettings, onUpdate, onReset }) => (
  <>
    {BLUR_SLIDERS.map(({ id, label, min, max, step, unit }) => (
      <div key={id} className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{label}</span>
          <span>{blurSettings[id as keyof BlurSettings]}{unit}</span>
        </div>
        <Slider
          value={[blurSettings[id as keyof BlurSettings]]}
          onValueChange={([val]) => onUpdate({ [id]: val })}
          min={min}
          max={max}
          step={step}
          className="w-full"
          aria-label={`${label} slider`}
        />
      </div>
    ))}

    <Button
      variant="outline"
      size="sm"
      onClick={onReset}
      className="w-full mt-2 text-xs"
      aria-label="Reset blur position"
    >
      <RotateCcw className="w-3 h-3 mr-1.5" />
      Reset Position
    </Button>
  </>
));

BlurControls.displayName = 'BlurControls';

// ==================== FŐ KOMPONENS ====================
export const GlowEditor = memo(() => {
  const { 
    state, 
    togglePower, 
    updateGlowSettings, 
    updateBlurSettings, 
    resetBlurPosition, 
    generateCSS 
  } = useEffects();

  // Lokális state
  const [shapeOpen, setShapeOpen] = useState(false);
  const [blurOpen, setBlurOpen] = useState(true);
  const [codeOpen, setCodeOpen] = useState(false);
  const [animationOpen, setAnimationOpen] = useState(true);
  const [hexInput, setHexInput] = useState(state.glowSettings.baseColor);

  // Memoizált CSS generálás
  const generatedCSS = useMemo(() => generateCSS(), [generateCSS]);

  // Color handlers
  const handleColorChange = useCallback((color: string) => {
    setHexInput(color);
    updateGlowSettings({ baseColor: color });
  }, [updateGlowSettings]);

  const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);
    if (isValidHexColor(value)) {
      updateGlowSettings({ baseColor: value });
    }
  }, [updateGlowSettings]);

  // Animation handlers
  const handleAnimationChange = useCallback((value: string) => {
    updateGlowSettings({ animation: value as GlowAnimationType });
  }, [updateGlowSettings]);

  const handleAnimationSpeedChange = useCallback((value: number) => {
    updateGlowSettings({ animationSpeed: value });
  }, [updateGlowSettings]);

  const handleAnimationIntensityChange = useCallback((value: number) => {
    updateGlowSettings({ animationIntensity: value });
  }, [updateGlowSettings]);

  // Slider handler
  const handleSliderChange = useCallback((key: keyof GlowSettings, value: number) => {
    updateGlowSettings({ [key]: value });
  }, [updateGlowSettings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Glow Settings</h2>
          <p className="text-xs text-zinc-500">CSS Progressive Blur</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Power</span>
          <Switch
            checked={state.powerOn}
            onCheckedChange={togglePower}
            className={cn(
              "data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500",
              "border border-white/10"
            )}
            aria-label="Toggle glow effect power"
          />
        </div>
      </div>

      {/* Theme Mode */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400">Theme Mode</label>
        <Select defaultValue="dark">
          <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-zinc-300 h-9 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {THEME_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Base Color */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-400">Base Color</label>
          <ColorPicker
            color={state.glowSettings.baseColor}
            hexInput={hexInput}
            onColorChange={handleColorChange}
            onHexInputChange={handleHexInputChange}
          />
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          {SLIDER_CONFIGS.map((config) => (
            <GradientSlider
              key={config.id}
              config={config}
              value={state.glowSettings[config.valueKey] as number}
              onChange={(value) => handleSliderChange(config.valueKey, value)}
            />
          ))}
        </div>
      </div>

      {/* Animation Controls */}
      <div className="pt-4 border-t border-white/5">
        <CollapsibleSection
          title="Animation"
          icon={Sparkles}
          open={animationOpen}
          onOpenChange={setAnimationOpen}
        >
          <AnimationControls
            animation={state.glowSettings.animation}
            animationSpeed={state.glowSettings.animationSpeed}
            animationIntensity={state.glowSettings.animationIntensity}
            onAnimationChange={handleAnimationChange}
            onSpeedChange={handleAnimationSpeedChange}
            onIntensityChange={handleAnimationIntensityChange}
          />
        </CollapsibleSection>
      </div>

      {/* Shape Configuration */}
      <CollapsibleSection
        title="Shape configuration"
        open={shapeOpen}
        onOpenChange={setShapeOpen}
      >
        <p className="text-xs text-zinc-500">Shape controls coming soon...</p>
      </CollapsibleSection>

      {/* Background blur */}
      <div className="pt-4 border-t border-white/5">
        <CollapsibleSection
          title="Background blur"
          open={blurOpen}
          onOpenChange={setBlurOpen}
        >
          <BlurControls
            blurSettings={state.blurSettings}
            onUpdate={updateBlurSettings}
            onReset={resetBlurPosition}
          />
        </CollapsibleSection>
      </div>

      {/* Footer */}
      <div className="pt-2 flex flex-col gap-4">
        <div className="text-xs text-zinc-600 flex justify-center gap-4">
          <span>
            Simulating CSS{' '}
            <code className="bg-zinc-950 px-1 py-0.5 rounded text-zinc-500">backdrop-filter</code>
            {' '}&{' '}
            <code className="bg-zinc-950 px-1 py-0.5 rounded text-zinc-500">mask-image</code>
          </span>
        </div>
        
        <CollapsibleSection
          title="View CSS Code"
          icon={Code}
          open={codeOpen}
          onOpenChange={setCodeOpen}
        >
          <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-400 overflow-x-auto">
            {generatedCSS}
          </pre>
        </CollapsibleSection>
      </div>
    </div>
  );
});

GlowEditor.displayName = 'GlowEditor';
