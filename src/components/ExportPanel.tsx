import { useEffects } from '@/contexts/EffectContext';
import { Copy, Download, Code, FileJson, Palette, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ExportFormat = 'css' | 'tailwind' | 'json';

export const ExportPanel = () => {
  const { state, getOklchColor } = useEffects();
  const [copiedFormat, setCopiedFormat] = useState<ExportFormat | null>(null);

  const generateCSS = (): string => {
    const oklch = getOklchColor();
    const { glowSettings, glassSettings, neomorphSettings, claySettings, activeEffects } = state;

    let css = `/* Generated Effect Styles */\n\n`;

    if (activeEffects.glow) {
      css += `/* Glow Effect */
.glow-effect {
  background-color: ${oklch};
  filter: blur(180px);
  opacity: 0.6;
  mix-blend-mode: screen;
}

.glow-container {
  --glow-color: ${oklch};
  --glow-base: ${glowSettings.baseColor};
  position: relative;
}

.glow-container::before {
  content: '';
  position: absolute;
  inset: -40px;
  background: radial-gradient(circle, ${glowSettings.baseColor}80 0%, transparent 70%);
  filter: blur(60px);
  z-index: -1;
}\n\n`;
    }

    if (activeEffects.glass) {
      const hexOpacity = Math.round(glassSettings.opacity * 2.55).toString(16).padStart(2, '0');
      css += `/* Glass Effect */
.glass-effect {
  backdrop-filter: blur(${glassSettings.blur}px) saturate(${glassSettings.saturation}%);
  -webkit-backdrop-filter: blur(${glassSettings.blur}px) saturate(${glassSettings.saturation}%);
  background-color: ${glassSettings.tint}${hexOpacity};
  border: ${glassSettings.borderWidth}px solid rgba(255, 255, 255, ${glassSettings.borderOpacity / 100});
}\n\n`;
    }

    if (activeEffects.neomorph) {
      const { distance, blur, intensity, lightSource, surfaceColor, shape } = neomorphSettings;
      const angle = (lightSource * Math.PI) / 180;
      const lightX = Math.round(Math.cos(angle) * distance);
      const lightY = Math.round(Math.sin(angle) * distance);
      const darkX = -lightX;
      const darkY = -lightY;
      const lightOpacity = (intensity / 100 * 0.5).toFixed(2);
      const darkOpacity = (intensity / 100).toFixed(2);
      const inset = shape === 'pressed' || shape === 'concave' ? 'inset ' : '';

      css += `/* Neomorphism Effect */
.neomorph-effect {
  background-color: ${surfaceColor};
  box-shadow: ${inset}${lightX}px ${lightY}px ${blur}px rgba(255, 255, 255, ${lightOpacity}),
              ${inset}${darkX}px ${darkY}px ${blur}px rgba(0, 0, 0, ${darkOpacity});
  border-radius: 16px;
}\n\n`;
    }

    if (activeEffects.clay) {
      const { depth, spread, borderRadius, highlightColor, shadowColor, surfaceTexture, bendAngle } = claySettings;
      let gradient = '';
      switch (surfaceTexture) {
        case 'glossy':
          gradient = `linear-gradient(${135 + bendAngle}deg, ${highlightColor}40 0%, transparent 50%, ${shadowColor}20 100%)`;
          break;
        case 'matte':
          gradient = `linear-gradient(${135 + bendAngle}deg, ${highlightColor}20 0%, transparent 100%)`;
          break;
        default:
          gradient = `linear-gradient(${135 + bendAngle}deg, ${highlightColor}30 0%, transparent 60%, ${shadowColor}10 100%)`;
      }

      css += `/* Clay Effect */
.clay-effect {
  border-radius: ${borderRadius}px;
  box-shadow: 0 ${depth}px ${spread}px ${shadowColor}99,
              0 ${Math.round(depth * 0.5)}px ${Math.round(spread * 0.5)}px ${shadowColor}66;
  background: ${gradient};
}\n\n`;
    }

    return css;
  };

  const generateTailwind = (): string => {
    const { glowSettings, glassSettings, neomorphSettings, claySettings, activeEffects } = state;

    let config = `// tailwind.config.ts extend section
{
  theme: {
    extend: {\n`;

    config += `      colors: {
        effect: {
          glow: '${glowSettings.baseColor}',
          tint: '${glassSettings.tint}',
          surface: '${neomorphSettings.surfaceColor}',
          highlight: '${claySettings.highlightColor}',
          shadow: '${claySettings.shadowColor}',
        },
      },\n`;

    if (activeEffects.glass) {
      config += `      backdropBlur: {
        effect: '${glassSettings.blur}px',
      },
      backdropSaturate: {
        effect: '${glassSettings.saturation}%',
      },\n`;
    }

    config += `      borderRadius: {
        clay: '${claySettings.borderRadius}px',
      },
      boxShadow: {\n`;

    if (activeEffects.neomorph) {
      const { distance, blur, intensity, lightSource, shape } = neomorphSettings;
      const angle = (lightSource * Math.PI) / 180;
      const lightX = Math.round(Math.cos(angle) * distance);
      const lightY = Math.round(Math.sin(angle) * distance);
      const inset = shape === 'pressed' || shape === 'concave' ? 'inset ' : '';
      config += `        neomorph: '${inset}${lightX}px ${lightY}px ${blur}px rgba(255,255,255,${(intensity / 200).toFixed(2)}), ${inset}${-lightX}px ${-lightY}px ${blur}px rgba(0,0,0,${(intensity / 100).toFixed(2)})',\n`;
    }

    if (activeEffects.clay) {
      const { depth, spread, shadowColor } = claySettings;
      config += `        clay: '0 ${depth}px ${spread}px ${shadowColor}99, 0 ${Math.round(depth * 0.5)}px ${Math.round(spread * 0.5)}px ${shadowColor}66',\n`;
    }

    config += `      },
    },
  },
}`;

    return config;
  };

  const generateJSON = (): string => {
    const { glowSettings, glassSettings, neomorphSettings, claySettings, activeEffects, blurSettings } = state;

    const exportData = {
      version: '1.0',
      activeEffects,
      glow: {
        ...glowSettings,
        oklch: getOklchColor(),
      },
      glass: glassSettings,
      neomorph: neomorphSettings,
      clay: claySettings,
      blurPosition: blurSettings,
    };

    return JSON.stringify(exportData, null, 2);
  };

  const copyToClipboard = async (format: ExportFormat) => {
    let content = '';
    switch (format) {
      case 'css':
        content = generateCSS();
        break;
      case 'tailwind':
        content = generateTailwind();
        break;
      case 'json':
        content = generateJSON();
        break;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
      
      toast({
        title: "Copied!",
        description: `${format.toUpperCase()} code copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (format: ExportFormat) => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'css':
        content = generateCSS();
        filename = 'effect-styles.css';
        mimeType = 'text/css';
        break;
      case 'tailwind':
        content = generateTailwind();
        filename = 'tailwind-effects.ts';
        mimeType = 'text/typescript';
        break;
      case 'json':
        content = generateJSON();
        filename = 'effect-settings.json';
        mimeType = 'application/json';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: `${filename} has been downloaded.`,
    });
  };

  const CodePreview = ({ code, format }: { code: string; format: ExportFormat }) => (
    <div className="relative">
      <pre className="text-[10px] font-jetbrains bg-secondary/50 rounded-lg p-3 overflow-auto max-h-48 text-muted-foreground scrollbar-dark">
        <code>{code}</code>
      </pre>
      <div className="absolute top-2 right-2 flex gap-1.5">
        <button
          onClick={() => copyToClipboard(format)}
          className="p-1.5 rounded-md bg-background/80 hover:bg-background border border-border/50 transition-colors"
          title="Copy to clipboard"
        >
          {copiedFormat === format ? (
            <Check className="w-3 h-3 text-emerald" />
          ) : (
            <Copy className="w-3 h-3 text-muted-foreground" />
          )}
        </button>
        <button
          onClick={() => downloadFile(format)}
          className="p-1.5 rounded-md bg-background/80 hover:bg-background border border-border/50 transition-colors"
          title="Download file"
        >
          <Download className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-accent/10">
          <Code className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Export Code</h3>
          <p className="text-xs text-muted-foreground">CSS, Tailwind, or JSON</p>
        </div>
      </div>

      <Tabs defaultValue="css" className="w-full">
        <TabsList className="w-full bg-secondary/50 border border-border/50 mb-3">
          <TabsTrigger value="css" className="flex-1 gap-1.5 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Palette className="w-3 h-3" />
            CSS
          </TabsTrigger>
          <TabsTrigger value="tailwind" className="flex-1 gap-1.5 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Code className="w-3 h-3" />
            Tailwind
          </TabsTrigger>
          <TabsTrigger value="json" className="flex-1 gap-1.5 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <FileJson className="w-3 h-3" />
            JSON
          </TabsTrigger>
        </TabsList>

        <TabsContent value="css" className="mt-0">
          <CodePreview code={generateCSS()} format="css" />
        </TabsContent>

        <TabsContent value="tailwind" className="mt-0">
          <CodePreview code={generateTailwind()} format="tailwind" />
        </TabsContent>

        <TabsContent value="json" className="mt-0">
          <CodePreview code={generateJSON()} format="json" />
        </TabsContent>
      </Tabs>

      {/* Quick copy buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => copyToClipboard('css')}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-border/50 transition-colors text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {copiedFormat === 'css' ? <Check className="w-3.5 h-3.5 text-emerald" /> : <Copy className="w-3.5 h-3.5" />}
          Copy CSS
        </button>
        <button
          onClick={() => downloadFile('json')}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors text-xs font-medium text-primary"
        >
          <Download className="w-3.5 h-3.5" />
          Save Settings
        </button>
      </div>
    </div>
  );
};