import { useEffects } from '@/contexts/EffectContext';
import { Copy, Download, Code, FileJson, Palette, Check, LucideIcon } from 'lucide-react';
import { useState, useMemo, useCallback, memo } from 'react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ==================== TÍPUSDEFINÍCIÓK ====================
type ExportFormat = 'css' | 'tailwind' | 'json';

interface TabConfig {
  value: ExportFormat;
  label: string;
  icon: LucideIcon;
}

interface CodePreviewProps {
  code: string;
  format: ExportFormat;
  copiedFormat: ExportFormat | null;
  onCopy: (format: ExportFormat) => void;
  onDownload: (format: ExportFormat) => void;
}

interface QuickActionButton {
  label: string;
  format: ExportFormat;
  action: 'copy' | 'download';
  variant: 'default' | 'primary';
}

interface GradientConfig {
  glossy: string;
  matte: string;
  default: string;
}

// ==================== KONSTANSOK ====================
const TAB_CONFIG: readonly TabConfig[] = [
  { value: 'css', label: 'CSS', icon: Palette },
  { value: 'tailwind', label: 'Tailwind', icon: Code },
  { value: 'json', label: 'JSON', icon: FileJson },
] as const;

const QUICK_ACTIONS: readonly QuickActionButton[] = [
  { label: 'Copy CSS', format: 'css', action: 'copy', variant: 'default' },
  { label: 'Save Settings', format: 'json', action: 'download', variant: 'primary' },
] as const;

const FILE_CONFIG: Record<ExportFormat, { filename: string; mimeType: string }> = {
  css: { filename: 'effect-styles.css', mimeType: 'text/css' },
  tailwind: { filename: 'tailwind-effects.ts', mimeType: 'text/typescript' },
  json: { filename: 'effect-settings.json', mimeType: 'application/json' },
};

// ==================== HELPER FUNKCIÓK ====================
class EffectCodeGenerator {
  static generateGlowCSS(glowSettings: any, oklch: string): string {
    return `/* Glow Effect */
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
}

`;
  }

  static generateGlassCSS(glassSettings: any): string {
    const hexOpacity = Math.round(glassSettings.opacity * 2.55)
      .toString(16)
      .padStart(2, '0');
    
    return `/* Glass Effect */
.glass-effect {
  backdrop-filter: blur(${glassSettings.blur}px) saturate(${glassSettings.saturation}%);
  -webkit-backdrop-filter: blur(${glassSettings.blur}px) saturate(${glassSettings.saturation}%);
  background-color: ${glassSettings.tint}${hexOpacity};
  border: ${glassSettings.borderWidth}px solid rgba(255, 255, 255, ${glassSettings.borderOpacity / 100});
}

`;
  }

  static generateNeomorphCSS(neomorphSettings: any): string {
    const { distance, blur, intensity, lightSource, surfaceColor, shape } = neomorphSettings;
    const angle = (lightSource * Math.PI) / 180;
    const lightX = Math.round(Math.cos(angle) * distance);
    const lightY = Math.round(Math.sin(angle) * distance);
    const darkX = -lightX;
    const darkY = -lightY;
    const lightOpacity = (intensity / 100 * 0.5).toFixed(2);
    const darkOpacity = (intensity / 100).toFixed(2);
    const inset = shape === 'pressed' || shape === 'concave' ? 'inset ' : '';

    return `/* Neomorphism Effect */
.neomorph-effect {
  background-color: ${surfaceColor};
  box-shadow: ${inset}${lightX}px ${lightY}px ${blur}px rgba(255, 255, 255, ${lightOpacity}),
              ${inset}${darkX}px ${darkY}px ${blur}px rgba(0, 0, 0, ${darkOpacity});
  border-radius: 16px;
}

`;
  }

  static generateClayCSS(claySettings: any): string {
    const { depth, spread, borderRadius, highlightColor, shadowColor, surfaceTexture, bendAngle } = claySettings;
    
    const gradientMap: GradientConfig = {
      glossy: `linear-gradient(${135 + bendAngle}deg, ${highlightColor}40 0%, transparent 50%, ${shadowColor}20 100%)`,
      matte: `linear-gradient(${135 + bendAngle}deg, ${highlightColor}20 0%, transparent 100%)`,
      default: `linear-gradient(${135 + bendAngle}deg, ${highlightColor}30 0%, transparent 60%, ${shadowColor}10 100%)`,
    };

    const gradient = gradientMap[surfaceTexture as keyof GradientConfig] || gradientMap.default;

    return `/* Clay Effect */
.clay-effect {
  border-radius: ${borderRadius}px;
  box-shadow: 0 ${depth}px ${spread}px ${shadowColor}99,
              0 ${Math.round(depth * 0.5)}px ${Math.round(spread * 0.5)}px ${shadowColor}66;
  background: ${gradient};
}

`;
  }

  static generateNeomorphShadow(neomorphSettings: any): string {
    const { distance, blur, intensity, lightSource, shape } = neomorphSettings;
    const angle = (lightSource * Math.PI) / 180;
    const lightX = Math.round(Math.cos(angle) * distance);
    const lightY = Math.round(Math.sin(angle) * distance);
    const inset = shape === 'pressed' || shape === 'concave' ? 'inset ' : '';
    
    return `${inset}${lightX}px ${lightY}px ${blur}px rgba(255,255,255,${(intensity / 200).toFixed(2)}), ${inset}${-lightX}px ${-lightY}px ${blur}px rgba(0,0,0,${(intensity / 100).toFixed(2)})`;
  }

  static generateClayShadow(claySettings: any): string {
    const { depth, spread, shadowColor } = claySettings;
    return `0 ${depth}px ${spread}px ${shadowColor}99, 0 ${Math.round(depth * 0.5)}px ${Math.round(spread * 0.5)}px ${shadowColor}66`;
  }
}

// ==================== ALKOMPONENSEK ====================
const CodePreview = memo<CodePreviewProps>(({ 
  code, 
  format, 
  copiedFormat, 
  onCopy, 
  onDownload 
}) => (
  <div className="relative">
    <pre className="text-[10px] font-jetbrains bg-secondary/50 rounded-lg p-3 overflow-auto max-h-48 text-muted-foreground scrollbar-dark">
      <code>{code}</code>
    </pre>
    <div className="absolute top-2 right-2 flex gap-1.5">
      <button
        onClick={() => onCopy(format)}
        className="p-1.5 rounded-md bg-background/80 hover:bg-background border border-border/50 transition-colors"
        title="Copy to clipboard"
        aria-label={`Copy ${format} code to clipboard`}
      >
        {copiedFormat === format ? (
          <Check className="w-3 h-3 text-emerald" />
        ) : (
          <Copy className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
      <button
        onClick={() => onDownload(format)}
        className="p-1.5 rounded-md bg-background/80 hover:bg-background border border-border/50 transition-colors"
        title="Download file"
        aria-label={`Download ${format} file`}
      >
        <Download className="w-3 h-3 text-muted-foreground" />
      </button>
    </div>
  </div>
));

CodePreview.displayName = 'CodePreview';

// ==================== FŐ KOMPONENS ====================
export const ExportPanel = memo(() => {
  const { state, getOklchColor } = useEffects();
  const [copiedFormat, setCopiedFormat] = useState<ExportFormat | null>(null);

  // ==================== CSS GENERÁLÁS ====================
  const generateCSS = useCallback((): string => {
    const oklch = getOklchColor();
    const { glowSettings, glassSettings, neomorphSettings, claySettings, activeEffects } = state;

    let css = `/* Generated Effect Styles */\n\n`;

    if (activeEffects.glow) {
      css += EffectCodeGenerator.generateGlowCSS(glowSettings, oklch);
    }

    if (activeEffects.glass) {
      css += EffectCodeGenerator.generateGlassCSS(glassSettings);
    }

    if (activeEffects.neomorph) {
      css += EffectCodeGenerator.generateNeomorphCSS(neomorphSettings);
    }

    if (activeEffects.clay) {
      css += EffectCodeGenerator.generateClayCSS(claySettings);
    }

    return css;
  }, [state, getOklchColor]);

  // ==================== TAILWIND GENERÁLÁS ====================
  const generateTailwind = useCallback((): string => {
    const { glowSettings, glassSettings, neomorphSettings, claySettings, activeEffects } = state;

    let config = `// tailwind.config.ts extend section
{
  theme: {
    extend: {
      colors: {
        effect: {
          glow: '${glowSettings.baseColor}',
          tint: '${glassSettings.tint}',
          surface: '${neomorphSettings.surfaceColor}',
          highlight: '${claySettings.highlightColor}',
          shadow: '${claySettings.shadowColor}',
        },
      },
`;

    if (activeEffects.glass) {
      config += `      backdropBlur: {
        effect: '${glassSettings.blur}px',
      },
      backdropSaturate: {
        effect: '${glassSettings.saturation}%',
      },
`;
    }

    config += `      borderRadius: {
        clay: '${claySettings.borderRadius}px',
      },
      boxShadow: {
`;

    if (activeEffects.neomorph) {
      config += `        neomorph: '${EffectCodeGenerator.generateNeomorphShadow(neomorphSettings)}',
`;
    }

    if (activeEffects.clay) {
      config += `        clay: '${EffectCodeGenerator.generateClayShadow(claySettings)}',
`;
    }

    config += `      },
    },
  },
}`;

    return config;
  }, [state]);

  // ==================== JSON GENERÁLÁS ====================
  const generateJSON = useCallback((): string => {
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
  }, [state, getOklchColor]);

  // ==================== MEMOIZÁLT GENERÁLT KÓDOK ====================
  const generatedCode = useMemo(() => ({
    css: generateCSS(),
    tailwind: generateTailwind(),
    json: generateJSON(),
  }), [generateCSS, generateTailwind, generateJSON]);

  // ==================== CLIPBOARD MÁSOLÁS ====================
  const copyToClipboard = useCallback(async (format: ExportFormat) => {
    const content = generatedCode[format];

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
  }, [generatedCode]);

  // ==================== FÁJL LETÖLTÉS ====================
  const downloadFile = useCallback((format: ExportFormat) => {
    const content = generatedCode[format];
    const { filename, mimeType } = FILE_CONFIG[format];

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
  }, [generatedCode]);

  // ==================== QUICK ACTION HANDLER ====================
  const handleQuickAction = useCallback((button: QuickActionButton) => {
    if (button.action === 'copy') {
      copyToClipboard(button.format);
    } else {
      downloadFile(button.format);
    }
  }, [copyToClipboard, downloadFile]);

  // ==================== RENDER ====================
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-accent/10">
          <Code className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Export Code</h3>
          <p className="text-xs text-muted-foreground">CSS, Tailwind, or JSON</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="css" className="w-full">
        <TabsList 
          className="w-full bg-secondary/50 border border-border/50 mb-3"
          aria-label="Export format tabs"
        >
          {TAB_CONFIG.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex-1 gap-1.5 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              aria-label={`Export as ${label}`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_CONFIG.map(({ value }) => (
          <TabsContent key={value} value={value} className="mt-0">
            <CodePreview
              code={generatedCode[value]}
              format={value}
              copiedFormat={copiedFormat}
              onCopy={copyToClipboard}
              onDownload={downloadFile}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Actions */}
      <div className="flex gap-2">
        {QUICK_ACTIONS.map((button) => {
          const Icon = button.action === 'copy' ? Copy : Download;
          const isCopied = button.action === 'copy' && copiedFormat === button.format;
          const baseClass = "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors text-xs font-medium";
          const variantClass = button.variant === 'primary'
            ? "bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary"
            : "bg-secondary/50 hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground";

          return (
            <button
              key={`${button.action}-${button.format}`}
              onClick={() => handleQuickAction(button)}
              className={`${baseClass} ${variantClass}`}
              aria-label={button.label}
            >
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
              {button.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});

ExportPanel.displayName = 'ExportPanel';
