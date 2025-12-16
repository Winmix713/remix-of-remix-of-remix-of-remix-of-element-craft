import { useEffects } from '@/contexts/ThemeContext';
import { Slider } from './ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { useState, useCallback, memo } from 'react';

// ==================== TÍPUSDEFINÍCIÓK ====================
type NeomorphShape = 'flat' | 'concave' | 'convex' | 'pressed';

interface ShapeOption {
  value: NeomorphShape;
  label: string;
  icon: string;
  description?: string;
}

interface SliderConfig {
  id: string;
  label: string;
  valueKey: keyof NeomorphSettings;
  min: number;
  max: number;
  step: number;
  unit: string;
  gradient?: string;
}

interface ShapeSelectorProps {
  shapes: readonly ShapeOption[];
  selectedShape: NeomorphShape;
  onShapeSelect: (shape: NeomorphShape) => void;
}

interface ColorPickerSectionProps {
  label: string;
  color: string;
  colorInput: string;
  onColorChange: (color: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SliderControlProps {
  config: SliderConfig;
  value: number;
  onChange: (value: number) => void;
}

type NeomorphSettings = {
  shape: NeomorphShape;
  lightSource: number;
  distance: number;
  blur: number;
  intensity: number;
  surfaceColor: string;
};

// ==================== KONSTANSOK ====================
const SHAPE_OPTIONS: readonly ShapeOption[] = [
  { 
    value: 'flat', 
    label: 'Flat', 
    icon: '▬',
    description: 'No depth, subtle shadows'
  },
  { 
    value: 'concave', 
    label: 'Concave', 
    icon: '◠',
    description: 'Inward curve effect'
  },
  { 
    value: 'convex', 
    label: 'Convex', 
    icon: '◡',
    description: 'Outward curve effect'
  },
  { 
    value: 'pressed', 
    label: 'Pressed', 
    icon: '▼',
    description: 'Button pressed state'
  },
] as const;

const SLIDER_CONFIGS: readonly SliderConfig[] = [
  {
    id: 'distance',
    label: 'Shadow Distance',
    valueKey: 'distance',
    min: 5,
    max: 30,
    step: 1,
    unit: 'px',
  },
  {
    id: 'blur',
    label: 'Shadow Blur',
    valueKey: 'blur',
    min: 10,
    max: 60,
    step: 1,
    unit: 'px',
  },
  {
    id: 'intensity',
    label: 'Shadow Intensity',
    valueKey: 'intensity',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
] as const;

const LIGHT_SOURCE_GRADIENT = 'conic-gradient(from 0deg, #fbbf24, #f59e0b, #d97706, #92400e, #d97706, #f59e0b, #fbbf24)';

// ==================== HELPER FUNKCIÓK ====================
const isValidHexColor = (color: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(color);

const formatValue = (value: number, unit: string): string => `${value}${unit}`;

const getShapeButtonClasses = (isSelected: boolean): string => {
  return cn(
    "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
    "hover:scale-105 active:scale-95",
    isSelected
      ? "border-purple-500/50 bg-purple-500/10 text-purple-300 shadow-lg shadow-purple-500/20"
      : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50"
  );
};

// ==================== ALKOMPONENSEK ====================
const ShapeButton = memo<{
  shape: ShapeOption;
  isSelected: boolean;
  onSelect: () => void;
}>(({ shape, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={getShapeButtonClasses(isSelected)}
    aria-label={`Select ${shape.label} shape`}
    aria-pressed={isSelected}
    title={shape.description}
  >
    <span className="text-lg" aria-hidden="true">{shape.icon}</span>
    <span className="text-[10px] font-medium">{shape.label}</span>
  </button>
));

ShapeButton.displayName = 'ShapeButton';

const ShapeSelector = memo<ShapeSelectorProps>(({ 
  shapes, 
  selectedShape, 
  onShapeSelect 
}) => (
  <div className="space-y-2">
    <span className="text-xs text-zinc-500 font-medium">Shape</span>
    <div className="grid grid-cols-4 gap-2">
      {shapes.map((shape) => (
        <ShapeButton
          key={shape.value}
          shape={shape}
          isSelected={selectedShape === shape.value}
          onSelect={() => onShapeSelect(shape.value)}
        />
      ))}
    </div>
  </div>
));

ShapeSelector.displayName = 'ShapeSelector';

const LightSourceSlider = memo<{
  value: number;
  onChange: (value: number) => void;
}>(({ value, onChange }) => {
  const handleChange = useCallback(([val]: number[]) => {
    onChange(val);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-zinc-500">
        <span>Light Source</span>
        <span>{value}°</span>
      </div>
      <div className="relative h-4 w-full">
        <div className="absolute inset-0 rounded-full bg-zinc-900 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-50"
            style={{ background: LIGHT_SOURCE_GRADIENT }}
            aria-hidden="true"
          />
        </div>
        <Slider
          value={[value]}
          onValueChange={handleChange}
          min={0}
          max={360}
          step={1}
          className="absolute inset-0 [&_[data-slot=slider-track]]:bg-transparent [&_[data-slot=slider-range]]:bg-transparent"
          aria-label="Light source angle"
        />
      </div>
    </div>
  );
});

LightSourceSlider.displayName = 'LightSourceSlider';

const SliderControl = memo<SliderControlProps>(({ 
  config, 
  value, 
  onChange 
}) => {
  const displayValue = formatValue(value, config.unit);

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

const ColorPickerSection = memo<ColorPickerSectionProps>(({ 
  label, 
  color, 
  colorInput, 
  onColorChange,
  onInputChange
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500 font-medium">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
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
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
          <HexColorPicker color={color} onChange={onColorChange} />
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <input
              type="text"
              value={colorInput}
              onChange={onInputChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs font-mono uppercase text-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
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
export const NeomorphEditor = memo(() => {
  const { state, updateNeomorphSettings } = useEffects();
  const { neomorphSettings } = state;
  
  // Lokális state a color input kezeléséhez
  const [colorInput, setColorInput] = useState(neomorphSettings.surfaceColor);

  // Shape handler
  const handleShapeSelect = useCallback((shape: NeomorphShape) => {
    updateNeomorphSettings({ shape });
  }, [updateNeomorphSettings]);

  // Light source handler
  const handleLightSourceChange = useCallback((value: number) => {
    updateNeomorphSettings({ lightSource: value });
  }, [updateNeomorphSettings]);

  // Color handlers
  const handleColorChange = useCallback((color: string) => {
    setColorInput(color);
    updateNeomorphSettings({ surfaceColor: color });
  }, [updateNeomorphSettings]);

  const handleColorInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColorInput(value);
    
    if (isValidHexColor(value)) {
      updateNeomorphSettings({ surfaceColor: value });
    }
  }, [updateNeomorphSettings]);

  // Slider handler
  const handleSliderChange = useCallback((key: keyof NeomorphSettings, value: number) => {
    updateNeomorphSettings({ [key]: value });
  }, [updateNeomorphSettings]);

  return (
    <div className="space-y-6">
      {/* Shape Selector */}
      <ShapeSelector
        shapes={SHAPE_OPTIONS}
        selectedShape={neomorphSettings.shape}
        onShapeSelect={handleShapeSelect}
      />

      {/* Light Source Angle */}
      <LightSourceSlider
        value={neomorphSettings.lightSource}
        onChange={handleLightSourceChange}
      />

      {/* Sliders */}
      {SLIDER_CONFIGS.map((config) => (
        <SliderControl
          key={config.id}
          config={config}
          value={neomorphSettings[config.valueKey] as number}
          onChange={(value) => handleSliderChange(config.valueKey, value)}
        />
      ))}

      {/* Surface Color */}
      <ColorPickerSection
        label="Surface Color"
        color={neomorphSettings.surfaceColor}
        colorInput={colorInput}
        onColorChange={handleColorChange}
        onInputChange={handleColorInputChange}
      />
    </div>
  );
});

NeomorphEditor.displayName = 'NeomorphEditor';
