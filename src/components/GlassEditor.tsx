import { useEffects } from '@/contexts/ThemeContext';
import { Slider } from './ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useState, useCallback, memo } from 'react';

// ==================== TÍPUSDEFINÍCIÓK ====================
interface SliderConfig {
  id: string;
  label: string;
  valueKey: keyof GlassSettings;
  min: number;
  max: number;
  step: number;
  unit: string;
  formatValue?: (value: number) => string;
}

interface ColorPickerTriggerProps {
  color: string;
  colorInput: string;
  label: string;
}

interface SliderControlProps {
  config: SliderConfig;
  value: number;
  onChange: (value: number) => void;
}

type GlassSettings = {
  blur: number;
  opacity: number;
  saturation: number;
  borderWidth: number;
  borderOpacity: number;
  tint: string;
  tintStrength: number;
};

// ==================== KONSTANSOK ====================
const SLIDER_CONFIGS: readonly SliderConfig[] = [
  {
    id: 'blur',
    label: 'Backdrop Blur',
    valueKey: 'blur',
    min: 0,
    max: 50,
    step: 1,
    unit: 'px',
  },
  {
    id: 'opacity',
    label: 'Background Opacity',
    valueKey: 'opacity',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  {
    id: 'saturation',
    label: 'Saturation Boost',
    valueKey: 'saturation',
    min: 0,
    max: 200,
    step: 1,
    unit: '%',
  },
  {
    id: 'borderWidth',
    label: 'Border Width',
    valueKey: 'borderWidth',
    min: 0,
    max: 4,
    step: 0.5,
    unit: 'px',
  },
  {
    id: 'borderOpacity',
    label: 'Border Opacity',
    valueKey: 'borderOpacity',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  {
    id: 'tintStrength',
    label: 'Tint Strength',
    valueKey: 'tintStrength',
    min: 0,
    max: 50,
    step: 1,
    unit: '%',
  },
] as const;

// ==================== HELPER FUNKCIÓK ====================
const isValidHexColor = (color: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(color);

const formatValue = (value: number, unit: string): string => {
  return `${value}${unit}`;
};

// ==================== ALKOMPONENSEK ====================
const ColorPickerTrigger = memo<ColorPickerTriggerProps>(({ 
  color, 
  colorInput, 
  label 
}) => (
  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-3 h-8 cursor-pointer hover:border-zinc-700 transition-colors">
    <div 
      className="w-6 h-6 rounded-md border border-white/20"
      style={{ backgroundColor: color }}
      aria-label={`${label} color preview`}
    />
    <span className="text-xs text-zinc-300 font-mono uppercase">
      {colorInput}
    </span>
  </div>
));

ColorPickerTrigger.displayName = 'ColorPickerTrigger';

const SliderControl = memo<SliderControlProps>(({ 
  config, 
  value, 
  onChange 
}) => {
  const displayValue = config.formatValue 
    ? config.formatValue(value)
    : formatValue(value, config.unit);

  const handleChange = useCallback(([val]: number[]) => {
    onChange(val);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-zinc-500">
        <span>{config.label}</span>
        <span>{displayValue}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={handleChange}
        min={config.min}
        max={config.max}
        step={config.step}
        className="w-full"
        aria-label={`${config.label} slider`}
      />
    </div>
  );
});

SliderControl.displayName = 'SliderControl';

const ColorPickerSection = memo<{
  label: string;
  color: string;
  colorInput: string;
  onColorChange: (color: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}>(({ label, color, colorInput, onColorChange, onInputChange }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <div>
            <ColorPickerTrigger 
              color={color} 
              colorInput={colorInput}
              label={label}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
          <HexColorPicker color={color} onChange={onColorChange} />
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <input
              type="text"
              value={colorInput}
              onChange={onInputChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs font-mono uppercase text-zinc-300 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
              placeholder="#000000"
              maxLength={7}
              aria-label={`${label} hex input`}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
));

ColorPickerSection.displayName = 'ColorPickerSection';

// ==================== FŐ KOMPONENS ====================
export const GlassEditor = memo(() => {
  const { state, updateGlassSettings } = useEffects();
  const { glassSettings } = state;
  
  // Lokális state a tint input kezeléséhez
  const [tintInput, setTintInput] = useState(glassSettings.tint);

  // Color handlers
  const handleTintChange = useCallback((color: string) => {
    setTintInput(color);
    updateGlassSettings({ tint: color });
  }, [updateGlassSettings]);

  const handleTintInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTintInput(value);
    
    if (isValidHexColor(value)) {
      updateGlassSettings({ tint: value });
    }
  }, [updateGlassSettings]);

  // Slider handler
  const handleSliderChange = useCallback((key: keyof GlassSettings, value: number) => {
    updateGlassSettings({ [key]: value });
  }, [updateGlassSettings]);

  // Slider configs szűrése (tintStrength kivételével az első 5)
  const mainSliders = SLIDER_CONFIGS.slice(0, 5);
  const tintStrengthSlider = SLIDER_CONFIGS[5];

  return (
    <div className="space-y-6">
      {/* Main Sliders */}
      {mainSliders.map((config) => (
        <SliderControl
          key={config.id}
          config={config}
          value={glassSettings[config.valueKey] as number}
          onChange={(value) => handleSliderChange(config.valueKey, value)}
        />
      ))}

      {/* Tint Color */}
      <ColorPickerSection
        label="Tint Color"
        color={glassSettings.tint}
        colorInput={tintInput}
        onColorChange={handleTintChange}
        onInputChange={handleTintInputChange}
      />

      {/* Tint Strength */}
      <SliderControl
        config={tintStrengthSlider}
        value={glassSettings.tintStrength}
        onChange={(value) => handleSliderChange('tintStrength', value)}
      />
    </div>
  );
});

GlassEditor.displayName = 'GlassEditor';
