import { useEffects } from '@/contexts/EffectContext';
import { Slider } from './ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type SurfaceTexture = 'smooth' | 'matte' | 'glossy';

const textures: { value: SurfaceTexture; label: string }[] = [
  { value: 'smooth', label: 'Smooth' },
  { value: 'matte', label: 'Matte' },
  { value: 'glossy', label: 'Glossy' },
];

export const ClayEditor = () => {
  const { state, updateClaySettings } = useEffects();
  const { claySettings } = state;
  const [highlightInput, setHighlightInput] = useState(claySettings.highlightColor);
  const [shadowInput, setShadowInput] = useState(claySettings.shadowColor);

  return (
    <div className="space-y-6">
      {/* Depth */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Depth</span>
          <span>{claySettings.depth}px</span>
        </div>
        <Slider
          value={[claySettings.depth]}
          onValueChange={([val]) => updateClaySettings({ depth: val })}
          min={5}
          max={20}
          step={1}
          className="w-full"
        />
      </div>

      {/* Spread */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Spread</span>
          <span>{claySettings.spread}px</span>
        </div>
        <Slider
          value={[claySettings.spread]}
          onValueChange={([val]) => updateClaySettings({ spread: val })}
          min={0}
          max={30}
          step={1}
          className="w-full"
        />
      </div>

      {/* Border Radius */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Border Radius</span>
          <span>{claySettings.borderRadius}px</span>
        </div>
        <Slider
          value={[claySettings.borderRadius]}
          onValueChange={([val]) => updateClaySettings({ borderRadius: val })}
          min={8}
          max={40}
          step={1}
          className="w-full"
        />
      </div>

      {/* Surface Texture */}
      <div className="space-y-2">
        <span className="text-xs text-zinc-500">Surface Texture</span>
        <div className="grid grid-cols-3 gap-2">
          {textures.map((texture) => (
            <button
              key={texture.value}
              onClick={() => updateClaySettings({ surfaceTexture: texture.value })}
              className={cn(
                "flex items-center justify-center p-2.5 rounded-xl border transition-all text-xs",
                claySettings.surfaceTexture === texture.value
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700"
              )}
            >
              {texture.label}
            </button>
          ))}
        </div>
      </div>

      {/* Highlight Color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Highlight Color</span>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-3 h-8 cursor-pointer hover:border-zinc-700 transition-colors">
                <div 
                  className="w-6 h-6 rounded-md border border-white/20"
                  style={{ backgroundColor: claySettings.highlightColor }}
                />
                <span className="text-xs text-zinc-300 font-mono uppercase">{highlightInput}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
              <HexColorPicker 
                color={claySettings.highlightColor} 
                onChange={(c) => { setHighlightInput(c); updateClaySettings({ highlightColor: c }); }} 
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Shadow Color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Shadow Color</span>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-3 h-8 cursor-pointer hover:border-zinc-700 transition-colors">
                <div 
                  className="w-6 h-6 rounded-md border border-white/20"
                  style={{ backgroundColor: claySettings.shadowColor }}
                />
                <span className="text-xs text-zinc-300 font-mono uppercase">{shadowInput}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
              <HexColorPicker 
                color={claySettings.shadowColor} 
                onChange={(c) => { setShadowInput(c); updateClaySettings({ shadowColor: c }); }} 
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Bend Angle */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Bend Angle</span>
          <span>{claySettings.bendAngle}°</span>
        </div>
        <Slider
          value={[claySettings.bendAngle]}
          onValueChange={([val]) => updateClaySettings({ bendAngle: val })}
          min={-15}
          max={15}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};
