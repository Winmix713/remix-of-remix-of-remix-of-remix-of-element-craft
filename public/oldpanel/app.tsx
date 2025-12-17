import { useState } from 'react';
import { Moon, Sun, Copy, Check } from 'lucide-react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Slider } from './components/ui/slider';
import { Label } from './components/ui/label';
import { Card } from './components/ui/card';

type EffectType = 'glow' | 'glassmorphism' | 'neumorphism' | 'claymorphism' | 'glass';

interface GlowSettings {
  lightness: number;
  chroma: number;
  hue: number;
  blur: number;
  spread: number;
  x: number;
  y: number;
}

interface GlassmorphismSettings {
  blur: number;
  opacity: number;
  saturation: number;
  borderOpacity: number;
  lightness: number;
  chroma: number;
  hue: number;
}

interface NeumorphismSettings {
  lightness: number;
  distance: number;
  intensity: number;
  blur: number;
  shape: 'flat' | 'concave' | 'convex' | 'pressed';
}

interface ClaymorphismSettings {
  lightness: number;
  chroma: number;
  hue: number;
  blur: number;
  borderRadius: number;
  borderWidth: number;
}

interface GlassSettings {
  blur: number;
  opacity: number;
  borderOpacity: number;
  lightness: number;
  chroma: number;
  hue: number;
  shadowBlur: number;
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeEffect, setActiveEffect] = useState<EffectType>('glow');
  const [copied, setCopied] = useState(false);

  // Glow settings
  const [glowSettings, setGlowSettings] = useState<GlowSettings>({
    lightness: 70,
    chroma: 0.3,
    hue: 280,
    blur: 50,
    spread: 0,
    x: 0,
    y: 0,
  });

  // Glassmorphism settings
  const [glassSettings, setGlassSettings] = useState<GlassmorphismSettings>({
    blur: 10,
    opacity: 20,
    saturation: 180,
    borderOpacity: 20,
    lightness: 100,
    chroma: 0,
    hue: 0,
  });

  // Neumorphism settings
  const [neumoSettings, setNeumoSettings] = useState<NeumorphismSettings>({
    lightness: 90,
    distance: 10,
    intensity: 15,
    blur: 20,
    shape: 'flat',
  });

  // Claymorphism settings
  const [claySettings, setClaySettings] = useState<ClaymorphismSettings>({
    lightness: 70,
    chroma: 0.15,
    hue: 200,
    blur: 30,
    borderRadius: 50,
    borderWidth: 2,
  });

  // Glass effect settings
  const [glassEffectSettings, setGlassEffectSettings] = useState<GlassSettings>({
    blur: 16,
    opacity: 10,
    borderOpacity: 30,
    lightness: 100,
    chroma: 0,
    hue: 0,
    shadowBlur: 40,
  });

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const generateGlowCSS = () => {
    const color = `oklch(${glowSettings.lightness}% ${glowSettings.chroma} ${glowSettings.hue})`;
    return `.glow-effect {
  box-shadow: ${glowSettings.x}px ${glowSettings.y}px ${glowSettings.blur}px ${glowSettings.spread}px ${color};
}`;
  };

  const generateGlassmorphismCSS = () => {
    const bgColor = `oklch(${glassSettings.lightness}% ${glassSettings.chroma} ${glassSettings.hue} / ${glassSettings.opacity}%)`;
    const borderColor = `oklch(${glassSettings.lightness}% ${glassSettings.chroma} ${glassSettings.hue} / ${glassSettings.borderOpacity}%)`;
    return `.glassmorphism {
  background: ${bgColor};
  backdrop-filter: blur(${glassSettings.blur}px) saturate(${glassSettings.saturation}%);
  -webkit-backdrop-filter: blur(${glassSettings.blur}px) saturate(${glassSettings.saturation}%);
  border: 1px solid ${borderColor};
  border-radius: 12px;
}`;
  };

  const generateNeumorphismCSS = () => {
    const baseColor = `oklch(${neumoSettings.lightness}% 0 0)`;
    const distance = neumoSettings.distance;
    const intensity = neumoSettings.intensity;
    const blur = neumoSettings.blur;
    
    const lightShadow = `oklch(${Math.min(100, neumoSettings.lightness + intensity)}% 0 0)`;
    const darkShadow = `oklch(${Math.max(0, neumoSettings.lightness - intensity)}% 0 0)`;
    
    let boxShadow = '';
    switch (neumoSettings.shape) {
      case 'flat':
        boxShadow = `${distance}px ${distance}px ${blur}px ${darkShadow}, -${distance}px -${distance}px ${blur}px ${lightShadow}`;
        break;
      case 'concave':
        boxShadow = `inset ${distance}px ${distance}px ${blur}px ${darkShadow}, inset -${distance}px -${distance}px ${blur}px ${lightShadow}`;
        break;
      case 'convex':
        boxShadow = `-${distance}px -${distance}px ${blur}px ${darkShadow}, ${distance}px ${distance}px ${blur}px ${lightShadow}`;
        break;
      case 'pressed':
        boxShadow = `inset -${distance}px -${distance}px ${blur}px ${darkShadow}, inset ${distance}px ${distance}px ${blur}px ${lightShadow}`;
        break;
    }
    
    return `.neumorphism {
  background: ${baseColor};
  box-shadow: ${boxShadow};
  border-radius: 20px;
}`;
  };

  const generateClaymorphismCSS = () => {
    const bgColor = `oklch(${claySettings.lightness}% ${claySettings.chroma} ${claySettings.hue})`;
    const borderColor = `oklch(${Math.min(100, claySettings.lightness + 10)}% ${claySettings.chroma} ${claySettings.hue} / 50%)`;
    return `.claymorphism {
  background: ${bgColor};
  backdrop-filter: blur(${claySettings.blur}px);
  -webkit-backdrop-filter: blur(${claySettings.blur}px);
  border: ${claySettings.borderWidth}px solid ${borderColor};
  border-radius: ${claySettings.borderRadius}px;
  box-shadow: 0 8px 32px 0 oklch(0% 0 0 / 10%);
}`;
  };

  const generateGlassEffectCSS = () => {
    const bgColor = `oklch(${glassEffectSettings.lightness}% ${glassEffectSettings.chroma} ${glassEffectSettings.hue} / ${glassEffectSettings.opacity}%)`;
    const borderColor = `oklch(${glassEffectSettings.lightness}% ${glassEffectSettings.chroma} ${glassEffectSettings.hue} / ${glassEffectSettings.borderOpacity}%)`;
    return `.glass-effect {
  background: ${bgColor};
  backdrop-filter: blur(${glassEffectSettings.blur}px);
  -webkit-backdrop-filter: blur(${glassEffectSettings.blur}px);
  border: 1px solid ${borderColor};
  border-radius: 16px;
  box-shadow: 0 8px ${glassEffectSettings.shadowBlur}px oklch(0% 0 0 / 20%);
}`;
  };

  const getActiveCSS = () => {
    switch (activeEffect) {
      case 'glow':
        return generateGlowCSS();
      case 'glassmorphism':
        return generateGlassmorphismCSS();
      case 'neumorphism':
        return generateNeumorphismCSS();
      case 'claymorphism':
        return generateClaymorphismCSS();
      case 'glass':
        return generateGlassEffectCSS();
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(getActiveCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPreviewStyle = (): React.CSSProperties => {
    switch (activeEffect) {
      case 'glow': {
        const color = `oklch(${glowSettings.lightness}% ${glowSettings.chroma} ${glowSettings.hue})`;
        return {
          boxShadow: `${glowSettings.x}px ${glowSettings.y}px ${glowSettings.blur}px ${glowSettings.spread}px ${color}`,
        };
      }
      case 'glassmorphism': {
        const bgColor = `oklch(${glassSettings.lightness}% ${glassSettings.chroma} ${glassSettings.hue} / ${glassSettings.opacity}%)`;
        const borderColor = `oklch(${glassSettings.lightness}% ${glassSettings.chroma} ${glassSettings.hue} / ${glassSettings.borderOpacity}%)`;
        return {
          background: bgColor,
          backdropFilter: `blur(${glassSettings.blur}px) saturate(${glassSettings.saturation}%)`,
          WebkitBackdropFilter: `blur(${glassSettings.blur}px) saturate(${glassSettings.saturation}%)`,
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
        };
      }
      case 'neumorphism': {
        const baseColor = `oklch(${neumoSettings.lightness}% 0 0)`;
        const distance = neumoSettings.distance;
        const intensity = neumoSettings.intensity;
        const blur = neumoSettings.blur;
        
        const lightShadow = `oklch(${Math.min(100, neumoSettings.lightness + intensity)}% 0 0)`;
        const darkShadow = `oklch(${Math.max(0, neumoSettings.lightness - intensity)}% 0 0)`;
        
        let boxShadow = '';
        switch (neumoSettings.shape) {
          case 'flat':
            boxShadow = `${distance}px ${distance}px ${blur}px ${darkShadow}, -${distance}px -${distance}px ${blur}px ${lightShadow}`;
            break;
          case 'concave':
            boxShadow = `inset ${distance}px ${distance}px ${blur}px ${darkShadow}, inset -${distance}px -${distance}px ${blur}px ${lightShadow}`;
            break;
          case 'convex':
            boxShadow = `-${distance}px -${distance}px ${blur}px ${darkShadow}, ${distance}px ${distance}px ${blur}px ${lightShadow}`;
            break;
          case 'pressed':
            boxShadow = `inset -${distance}px -${distance}px ${blur}px ${darkShadow}, inset ${distance}px ${distance}px ${blur}px ${lightShadow}`;
            break;
        }
        
        return {
          background: baseColor,
          boxShadow: boxShadow,
          borderRadius: '20px',
        };
      }
      case 'claymorphism': {
        const bgColor = `oklch(${claySettings.lightness}% ${claySettings.chroma} ${claySettings.hue})`;
        const borderColor = `oklch(${Math.min(100, claySettings.lightness + 10)}% ${claySettings.chroma} ${claySettings.hue} / 50%)`;
        return {
          background: bgColor,
          backdropFilter: `blur(${claySettings.blur}px)`,
          WebkitBackdropFilter: `blur(${claySettings.blur}px)`,
          border: `${claySettings.borderWidth}px solid ${borderColor}`,
          borderRadius: `${claySettings.borderRadius}px`,
          boxShadow: '0 8px 32px 0 oklch(0% 0 0 / 10%)',
        };
      }
      case 'glass': {
        const bgColor = `oklch(${glassEffectSettings.lightness}% ${glassEffectSettings.chroma} ${glassEffectSettings.hue} / ${glassEffectSettings.opacity}%)`;
        const borderColor = `oklch(${glassEffectSettings.lightness}% ${glassEffectSettings.chroma} ${glassEffectSettings.hue} / ${glassEffectSettings.borderOpacity}%)`;
        return {
          background: bgColor,
          backdropFilter: `blur(${glassEffectSettings.blur}px)`,
          WebkitBackdropFilter: `blur(${glassEffectSettings.blur}px)`,
          border: `1px solid ${borderColor}`,
          borderRadius: '16px',
          boxShadow: `0 8px ${glassEffectSettings.shadowBlur}px oklch(0% 0 0 / 20%)`,
        };
      }
    }
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-slate-900 dark:text-white">CSS Effect Editor</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Create stunning visual effects with live preview
              </p>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Controls */}
            <div className="space-y-6">
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <Tabs value={activeEffect} onValueChange={(v) => setActiveEffect(v as EffectType)}>
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="glow">Glow</TabsTrigger>
                    <TabsTrigger value="glassmorphism">Glass</TabsTrigger>
                    <TabsTrigger value="neumorphism">Neumo</TabsTrigger>
                    <TabsTrigger value="claymorphism">Clay</TabsTrigger>
                    <TabsTrigger value="glass">Effect</TabsTrigger>
                  </TabsList>

                  {/* Glow Controls */}
                  <TabsContent value="glow" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Lightness: {glowSettings.lightness}%
                        </Label>
                        <Slider
                          value={[glowSettings.lightness]}
                          onValueChange={([v]) => setGlowSettings({ ...glowSettings, lightness: v })}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Chroma: {glowSettings.chroma.toFixed(2)}
                        </Label>
                        <Slider
                          value={[glowSettings.chroma * 100]}
                          onValueChange={([v]) => setGlowSettings({ ...glowSettings, chroma: v / 100 })}
                          min={0}
                          max={40}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Hue: {glowSettings.hue}°
                        </Label>
                        <Slider
                          value={[glowSettings.hue]}
                          onValueChange={([v]) => setGlowSettings({ ...glowSettings, hue: v })}
                          min={0}
                          max={360}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Blur: {glowSettings.blur}px
                        </Label>
                        <Slider
                          value={[glowSettings.blur]}
                          onValueChange={([v]) => setGlowSettings({ ...glowSettings, blur: v })}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Spread: {glowSettings.spread}px
                        </Label>
                        <Slider
                          value={[glowSettings.spread]}
                          onValueChange={([v]) => setGlowSettings({ ...glowSettings, spread: v })}
                          min={-50}
                          max={50}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          X Position: {glowSettings.x}px
                        </Label>
                        <Slider
                          value={[glowSettings.x]}
                          onValueChange={([v]) => setGlowSettings({ ...glowSettings, x: v })}
                          min={-50}
                          max={50}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Y Position: {glowSettings.y}px
                        </Label>
                        <Slider
                          value={[glowSettings.y]}
                          onValueChange={([v]) => setGlowSettings({ ...glowSettings, y: v })}
                          min={-50}
                          max={50}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Glassmorphism Controls */}
                  <TabsContent value="glassmorphism" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Blur: {glassSettings.blur}px
                        </Label>
                        <Slider
                          value={[glassSettings.blur]}
                          onValueChange={([v]) => setGlassSettings({ ...glassSettings, blur: v })}
                          min={0}
                          max={40}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Opacity: {glassSettings.opacity}%
                        </Label>
                        <Slider
                          value={[glassSettings.opacity]}
                          onValueChange={([v]) => setGlassSettings({ ...glassSettings, opacity: v })}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Saturation: {glassSettings.saturation}%
                        </Label>
                        <Slider
                          value={[glassSettings.saturation]}
                          onValueChange={([v]) => setGlassSettings({ ...glassSettings, saturation: v })}
                          min={100}
                          max={200}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Border Opacity: {glassSettings.borderOpacity}%
                        </Label>
                        <Slider
                          value={[glassSettings.borderOpacity]}
                          onValueChange={([v]) => setGlassSettings({ ...glassSettings, borderOpacity: v })}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Lightness: {glassSettings.lightness}%
                        </Label>
                        <Slider
                          value={[glassSettings.lightness]}
                          onValueChange={([v]) => setGlassSettings({ ...glassSettings, lightness: v })}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Chroma: {glassSettings.chroma.toFixed(2)}
                        </Label>
                        <Slider
                          value={[glassSettings.chroma * 100]}
                          onValueChange={([v]) => setGlassSettings({ ...glassSettings, chroma: v / 100 })}
                          min={0}
                          max={40}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Hue: {glassSettings.hue}°
                        </Label>
                        <Slider
                          value={[glassSettings.hue]}
                          onValueChange={([v]) => setGlassSettings({ ...glassSettings, hue: v })}
                          min={0}
                          max={360}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Neumorphism Controls */}
                  <TabsContent value="neumorphism" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">Shape</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {(['flat', 'concave', 'convex', 'pressed'] as const).map((shape) => (
                            <Button
                              key={shape}
                              variant={neumoSettings.shape === shape ? 'default' : 'outline'}
                              onClick={() => setNeumoSettings({ ...neumoSettings, shape })}
                              className="capitalize"
                            >
                              {shape}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Lightness: {neumoSettings.lightness}%
                        </Label>
                        <Slider
                          value={[neumoSettings.lightness]}
                          onValueChange={([v]) => setNeumoSettings({ ...neumoSettings, lightness: v })}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Distance: {neumoSettings.distance}px
                        </Label>
                        <Slider
                          value={[neumoSettings.distance]}
                          onValueChange={([v]) => setNeumoSettings({ ...neumoSettings, distance: v })}
                          min={1}
                          max={50}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Intensity: {neumoSettings.intensity}%
                        </Label>
                        <Slider
                          value={[neumoSettings.intensity]}
                          onValueChange={([v]) => setNeumoSettings({ ...neumoSettings, intensity: v })}
                          min={1}
                          max={30}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Blur: {neumoSettings.blur}px
                        </Label>
                        <Slider
                          value={[neumoSettings.blur]}
                          onValueChange={([v]) => setNeumoSettings({ ...neumoSettings, blur: v })}
                          min={0}
                          max={60}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Claymorphism Controls */}
                  <TabsContent value="claymorphism" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Lightness: {claySettings.lightness}%
                        </Label>
                        <Slider
                          value={[claySettings.lightness]}
                          onValueChange={([v]) => setClaySettings({ ...claySettings, lightness: v })}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Chroma: {claySettings.chroma.toFixed(2)}
                        </Label>
                        <Slider
                          value={[claySettings.chroma * 100]}
                          onValueChange={([v]) => setClaySettings({ ...claySettings, chroma: v / 100 })}
                          min={0}
                          max={40}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Hue: {claySettings.hue}°
                        </Label>
                        <Slider
                          value={[claySettings.hue]}
                          onValueChange={([v]) => setClaySettings({ ...claySettings, hue: v })}
                          min={0}
                          max={360}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Blur: {claySettings.blur}px
                        </Label>
                        <Slider
                          value={[claySettings.blur]}
                          onValueChange={([v]) => setClaySettings({ ...claySettings, blur: v })}
                          min={0}
                          max={60}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Border Radius: {claySettings.borderRadius}px
                        </Label>
                        <Slider
                          value={[claySettings.borderRadius]}
                          onValueChange={([v]) => setClaySettings({ ...claySettings, borderRadius: v })}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Border Width: {claySettings.borderWidth}px
                        </Label>
                        <Slider
                          value={[claySettings.borderWidth]}
                          onValueChange={([v]) => setClaySettings({ ...claySettings, borderWidth: v })}
                          min={0}
                          max={10}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Glass Effect Controls */}
                  <TabsContent value="glass" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Blur: {glassEffectSettings.blur}px
                        </Label>
                        <Slider
                          value={[glassEffectSettings.blur]}
                          onValueChange={([v]) => setGlassEffectSettings({ ...glassEffectSettings, blur: v })}
                          min={0}
                          max={40}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Opacity: {glassEffectSettings.opacity}%
                        </Label>
                        <Slider
                          value={[glassEffectSettings.opacity]}
                          onValueChange={([v]) => setGlassEffectSettings({ ...glassEffectSettings, opacity: v })}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Border Opacity: {glassEffectSettings.borderOpacity}%
                        </Label>
                        <Slider
                          value={[glassEffectSettings.borderOpacity]}
                          onValueChange={([v]) => setGlassEffectSettings({ ...glassEffectSettings, borderOpacity: v })}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Shadow Blur: {glassEffectSettings.shadowBlur}px
                        </Label>
                        <Slider
                          value={[glassEffectSettings.shadowBlur]}
                          onValueChange={([v]) => setGlassEffectSettings({ ...glassEffectSettings, shadowBlur: v })}
                          min={0}
                          max={80}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Lightness: {glassEffectSettings.lightness}%
                        </Label>
                        <Slider
                          value={[glassEffectSettings.lightness]}
                          onValueChange={([v]) => setGlassEffectSettings({ ...glassEffectSettings, lightness: v })}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Chroma: {glassEffectSettings.chroma.toFixed(2)}
                        </Label>
                        <Slider
                          value={[glassEffectSettings.chroma * 100]}
                          onValueChange={([v]) => setGlassEffectSettings({ ...glassEffectSettings, chroma: v / 100 })}
                          min={0}
                          max={40}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">
                          Hue: {glassEffectSettings.hue}°
                        </Label>
                        <Slider
                          value={[glassEffectSettings.hue]}
                          onValueChange={([v]) => setGlassEffectSettings({ ...glassEffectSettings, hue: v })}
                          min={0}
                          max={360}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* CSS Code Output */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-slate-700 dark:text-slate-300">CSS Code</Label>
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="bg-slate-100 dark:bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-slate-800 dark:text-slate-200">{getActiveCSS()}</code>
                </pre>
              </Card>
            </div>

            {/* Right Panel - Preview */}
            <div className="space-y-6">
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <Label className="text-slate-700 dark:text-slate-300 mb-4 block">
                  Live Preview
                </Label>
                <div className="relative aspect-[9/16] max-w-sm mx-auto bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-3xl p-1 shadow-2xl">
                  {/* Phone mockup */}
                  <div className="h-full w-full bg-slate-100 dark:bg-slate-800 rounded-[22px] p-8 flex items-center justify-center relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500 rounded-full blur-3xl"></div>
                    </div>

                    {/* Effect preview */}
                    <div
                      className="relative w-48 h-48 flex items-center justify-center"
                      style={getPreviewStyle()}
                    >
                      <div className="text-center z-10">
                        <div className="w-16 h-16 bg-slate-300 dark:bg-slate-600 rounded-2xl mx-auto mb-3"></div>
                        <div className="h-3 w-24 bg-slate-300 dark:bg-slate-600 rounded mx-auto mb-2"></div>
                        <div className="h-2 w-16 bg-slate-300 dark:bg-slate-600 rounded mx-auto"></div>
                      </div>
                    </div>
                  </div>

                  {/* Phone notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 dark:bg-slate-950 rounded-full"></div>
                </div>
              </Card>

              {/* Effect Info */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                  About {activeEffect.charAt(0).toUpperCase() + activeEffect.slice(1)}
                </Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {activeEffect === 'glow' && 'Create beautiful glow effects with customizable color, blur, and spread. Perfect for highlighting elements and creating ambient lighting effects.'}
                  {activeEffect === 'glassmorphism' && 'Frosted glass effect with background blur and semi-transparent backgrounds. Popular in modern UI design for cards and panels.'}
                  {activeEffect === 'neumorphism' && 'Soft, extruded UI elements that appear to rise from or sink into the background. Creates a tactile, 3D appearance.'}
                  {activeEffect === 'claymorphism' && 'Clay-like 3D effects combining background blur with subtle borders and shadows for a unique, modern aesthetic.'}
                  {activeEffect === 'glass' && 'Advanced glass effect with backdrop blur, transparency, and elegant shadows for sophisticated UI components.'}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
