import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  RotateCcw, MousePointer2, Save, MoreHorizontal, X, ChevronDown,
  Laptop, UnfoldHorizontal, UnfoldVertical, Scan, Square, Eye, Image, Move,
  Zap, RotateCw, Maximize, WandSparkles, Sparkles, Paperclip, Figma, Send,
  AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, Layers, Circle,
  Droplet, Sun, Contrast, FlipHorizontal, GripVertical, Hash, Link2, Copy, Check
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { useEffects } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';

type TabMode = 'EDIT' | 'PROMPT' | 'CODE';

export const PropertyInspector = () => {
  const { state, updateGlassSettings, updateGlowSettings, undo, canUndo, history } = useEffects();
  
  const [activeTab, setActiveTab] = useState<TabMode>('EDIT');
  const [syncWithEffects, setSyncWithEffects] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Local inspector state - synced with effects when enabled
  const [opacity, setOpacity] = useState(100);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(100);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [perspective, setPerspective] = useState(0);
  const [promptText, setPromptText] = useState('');
  const [codeText, setCodeText] = useState('<h2 class="text-[18px] md:text-[20px] font-semibold tracking-tight pr-2 pb-3 pl-2">Layers</h2>');
  
  // Colors & Effects - synced with effects context
  const [bgColor, setBgColor] = useState<string | null>(null);
  const [borderColor, setBorderColor] = useState<string | null>(null);
  const [ringColor, setRingColor] = useState<string | null>(null);
  const [textColor, setTextColor] = useState<string | null>(null);
  const [blur, setBlur] = useState(0);
  const [backdropBlur, setBackdropBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [invert, setInvert] = useState(0);
  const [borderRadius, setBorderRadius] = useState({ all: 0, t: 0, r: 0, b: 0, l: 0 });
  const [borderRadiusTab, setBorderRadiusTab] = useState<'all' | 't' | 'r' | 'b' | 'l'>('all');
  const [inlineCSS, setInlineCSS] = useState('');
  const [elementId, setElementId] = useState('');
  const [openAccordions, setOpenAccordions] = useState<string[]>(['family', 'link', 'text', 'margin', 'padding']);
  
  // Sync blur/saturation from effects context
  useEffect(() => {
    if (syncWithEffects && state.activeEffects.glass) {
      setBlur(state.glassSettings.blur);
      setBackdropBlur(state.glassSettings.blur);
      setSaturation(state.glassSettings.saturation);
    }
  }, [state.glassSettings, state.activeEffects.glass, syncWithEffects]);
  
  // Update effects when inspector values change (bidirectional sync)
  const handleBlurChange = useCallback((value: number) => {
    setBlur(value);
    if (syncWithEffects && state.activeEffects.glass) {
      updateGlassSettings({ blur: value });
    }
  }, [syncWithEffects, state.activeEffects.glass, updateGlassSettings]);
  
  const handleBackdropBlurChange = useCallback((value: number) => {
    setBackdropBlur(value);
    if (syncWithEffects && state.activeEffects.glass) {
      updateGlassSettings({ blur: value });
    }
  }, [syncWithEffects, state.activeEffects.glass, updateGlassSettings]);
  
  const handleSaturationChange = useCallback((value: number) => {
    setSaturation(value);
    if (syncWithEffects && state.activeEffects.glass) {
      updateGlassSettings({ saturation: value });
    }
  }, [syncWithEffects, state.activeEffects.glass, updateGlassSettings]);
  
  // Generate CSS from current inspector values
  const generatedCSS = useMemo(() => {
    const lines: string[] = [];
    if (opacity !== 100) lines.push(`opacity: ${opacity / 100};`);
    if (blur) lines.push(`filter: blur(${blur}px);`);
    if (backdropBlur) lines.push(`backdrop-filter: blur(${backdropBlur}px);`);
    if (brightness !== 100) lines.push(`filter: brightness(${brightness}%);`);
    if (saturation !== 100) lines.push(`filter: saturate(${saturation}%);`);
    if (hueRotate) lines.push(`filter: hue-rotate(${hueRotate}deg);`);
    if (translateX || translateY) lines.push(`transform: translate(${translateX}px, ${translateY}px);`);
    if (rotate) lines.push(`transform: rotate(${rotate}deg);`);
    if (scale !== 100) lines.push(`transform: scale(${scale / 100});`);
    if (bgColor) lines.push(`background-color: ${bgColor};`);
    if (borderColor) lines.push(`border-color: ${borderColor};`);
    if (textColor) lines.push(`color: ${textColor};`);
    return lines.join('\n');
  }, [opacity, blur, backdropBlur, brightness, saturation, hueRotate, translateX, translateY, rotate, scale, bgColor, borderColor, textColor]);
  
  const handleCopyCSS = useCallback(() => {
    navigator.clipboard.writeText(generatedCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "CSS copied to clipboard." });
  }, [generatedCSS]);
  
  const handleReset = useCallback(() => {
    setOpacity(100);
    setBlur(0);
    setBackdropBlur(0);
    setBrightness(100);
    setSaturation(100);
    setHueRotate(0);
    setGrayscale(0);
    setInvert(0);
    setTranslateX(0);
    setTranslateY(0);
    setRotate(0);
    setScale(100);
    setSkewX(0);
    setSkewY(0);
    setRotateX(0);
    setRotateY(0);
    setRotateZ(0);
    setPerspective(0);
    setBgColor(null);
    setBorderColor(null);
    setTextColor(null);
    toast({ title: "Reset", description: "Inspector values reset to defaults." });
  }, []);

  const ColorButton = ({ 
    color, 
    onChange, 
    label 
  }: { 
    color: string | null; 
    onChange: (color: string | null) => void; 
    label: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button className={`h-7 flex items-center gap-2 px-2 py-1 text-xs rounded-md border border-border bg-card ${!color ? 'opacity-30' : ''}`}>
          <div 
            className="w-4 h-4 rounded-full border border-border" 
            style={{ backgroundColor: color || 'hsl(var(--muted))' }}
          />
          <span className="text-xs truncate">{color ? label : `No ${label}`}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <HexColorPicker color={color || '#ffffff'} onChange={onChange} />
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2 text-xs"
          onClick={() => onChange(null)}
        >
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="bg-card border-border rounded-2xl shadow-[var(--shadow-panel)] w-80 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border py-2 px-4 bg-secondary/50 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-xs uppercase font-medium text-muted-foreground">h2</h3>
          <div className="flex border border-border rounded-md overflow-hidden">
            {(['EDIT', 'PROMPT', 'CODE'] as TabMode[]).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 py-1 text-[8px] font-medium transition-colors cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                    : 'bg-card text-muted-foreground hover:bg-secondary'
                } ${tab !== 'EDIT' ? 'border-l border-border' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full" 
            onClick={handleReset}
            title="Reset values"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-6 w-6 rounded-full ${syncWithEffects ? 'text-primary' : ''}`}
            onClick={() => setSyncWithEffects(!syncWithEffects)}
            title={syncWithEffects ? "Synced with effects" : "Not synced"}
          >
            <Link2 className="w-3 h-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full"
            onClick={handleCopyCSS}
            title="Copy CSS"
          >
            {copied ? <Check className="w-3 h-3 text-emerald" /> : <Copy className="w-3 h-3" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-1">
        {activeTab === 'PROMPT' ? (
          <form className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Describe what you want to change:
              </label>
              <div className="relative">
                <Textarea
                  placeholder="Adapt to dark mode, add details, make adaptive, change text to..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full resize-none min-h-[100px] max-h-[200px] overflow-y-auto text-xs hover:bg-secondary/50 pb-[40px] rounded-2xl"
                />
                <div className="absolute bottom-[16px] left-[9px] z-10 flex gap-1">
                  {[
                    { icon: WandSparkles, title: 'Prompt Builder' },
                    { icon: Sparkles, title: 'AI Model', label: 'GPT-5' },
                    { icon: Paperclip, title: 'Attach Files' },
                    { icon: Figma, title: 'Import from Figma' },
                  ].map(({ icon: Icon, title, label }) => (
                    <button 
                      key={title}
                      type="button"
                      className="flex items-center rounded-lg bg-card border border-border hover:border-primary/50 shadow-sm p-2 py-1 gap-1 text-[10px] hover:bg-secondary"
                      title={title}
                    >
                      <Icon className="h-3 w-3" />
                      {label && <>{label}<ChevronDown className="h-3 w-3" /></>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div>Selected: <span className="font-medium font-mono text-xs uppercase text-foreground">h2</span></div>
                <span className="text-[10px]">#aura-emgn5hp8g9knbc3d</span>
              </div>
              <div className="font-mono text-[10px] bg-secondary/50 border border-border rounded-lg px-2 py-2">
                px-2 pb-3 text-[18px] md:text-[20px] font-semibold tracking-tight
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2 mt-2">
                <Button type="submit" disabled={!promptText.trim()} className="flex p-2 px-3 gap-2 items-center">
                  <Send className="w-3 h-3" />
                  Apply Changes
                </Button>
                <Button type="button" variant="outline" onClick={() => setPromptText('')} className="p-2 px-3">
                  Cancel
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">Costs 1 prompt. Don't forget to save changes.</p>
            </div>
          </form>
        ) : activeTab === 'CODE' ? (
          <div className="flex flex-col h-full gap-3">
            <Textarea
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              className="flex-1 font-mono text-xs resize-none bg-secondary/50 border-border rounded-lg p-3 min-h-[400px]"
              spellCheck={false}
            />
            <div className="flex items-center justify-between border-t border-border py-2">
              <span className="text-[10px] text-muted-foreground">No changes</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled className="text-[10px] h-7 px-2">Reset</Button>
                <Button disabled className="text-[10px] h-7 px-2">Apply</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Breakpoint Selector */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex border border-border rounded-md overflow-hidden h-6">
                {['AUTO', '*', 'MD'].map((bp, i) => (
                  <button 
                    key={bp}
                    className={`px-2 text-[9px] transition-[var(--transition-smooth)] ${
                      bp === 'AUTO' ? 'bg-primary text-primary-foreground' : 
                      bp === 'MD' ? 'bg-accent/20 text-accent-foreground' : 
                      'bg-card text-muted-foreground hover:bg-secondary'
                    } ${i > 0 ? 'border-l border-border' : ''}`}
                  >
                    {bp}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground ml-2 flex items-center gap-1">
                <Laptop className="w-3 h-3" />
                <span>Auto Breakpoint</span>
              </span>
            </div>

            <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="space-y-1">
              {/* Family Elements */}
              <AccordionItem value="family" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Family Elements
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="flex flex-wrap items-center gap-1">
                    {['div', '├', 'div', 'div', 'p'].map((el, i) => (
                      el === '├' ? (
                        <span key={i} className="text-muted-foreground text-[10px]">{el}</span>
                      ) : (
                        <Button key={i} variant="outline" size="sm" className="h-6 text-[11px] px-1.5 py-0.5">{el}</Button>
                      )
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Link */}
              <AccordionItem value="link" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Link
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <Input type="text" placeholder="/page or url..." className="h-8 text-xs" />
                </AccordionContent>
              </AccordionItem>

              {/* Text Content */}
              <AccordionItem value="text" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Text Content
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <Textarea placeholder="Enter text content..." rows={1} className="resize-none text-xs" defaultValue="Layers" />
                </AccordionContent>
              </AccordionItem>

              {/* Tailwind Classes */}
              <AccordionItem value="tailwind" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Tailwind Classes
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <Textarea
                    placeholder="Enter Tailwind classes..."
                    rows={1}
                    className="resize-none text-xs opacity-50 cursor-not-allowed"
                    disabled
                    defaultValue="px-2 pb-3 text-[18px] md:text-[20px] font-semibold tracking-tight"
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Inline CSS */}
              <AccordionItem value="inline-css" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <span>Inline CSS</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <Textarea
                    placeholder="color: red; font-size: 16px;"
                    value={inlineCSS}
                    onChange={(e) => setInlineCSS(e.target.value)}
                    rows={2}
                    className="resize-none text-xs font-mono"
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Element ID */}
              <AccordionItem value="element-id" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-3 h-3" />
                    <span>Element ID</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <Input 
                    type="text" 
                    placeholder="unique-element-id" 
                    value={elementId}
                    onChange={(e) => setElementId(e.target.value)}
                    className="h-8 text-xs font-mono" 
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Margin */}
              <AccordionItem value="margin" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <Scan className="w-3 h-3" />
                    <span>Margin</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <IconInput icon={<UnfoldHorizontal className="w-3 h-3" />} />
                    <IconInput icon={<UnfoldVertical className="w-3 h-3" />} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Padding */}
              <AccordionItem value="padding" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <Square className="w-3 h-3" />
                    <span>Padding</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <LabeledInput label="L" defaultValue="2" />
                      <LabeledInput label="T" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <LabeledInput label="R" defaultValue="2" />
                      <LabeledInput label="B" defaultValue="3" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Position */}
              <AccordionItem value="position" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <GripVertical className="w-3 h-3" />
                    <span>Position</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <Select defaultValue="relative">
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['static', 'relative', 'absolute', 'fixed', 'sticky'].map(pos => (
                        <SelectItem key={pos} value={pos}>{pos.charAt(0).toUpperCase() + pos.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="L" />
                    <LabeledInput label="T" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="R" />
                    <LabeledInput label="B" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Size */}
              <AccordionItem value="size" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Size
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <IconInput icon={<UnfoldHorizontal className="w-3 h-3" />} placeholder="Width" />
                    <IconInput icon={<UnfoldVertical className="w-3 h-3" />} placeholder="Height" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="Max W" />
                    <LabeledInput label="Max H" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Spacing */}
              <AccordionItem value="spacing" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Spacing
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="Space X" />
                    <LabeledInput label="Space Y" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <LabeledInput label="Gap X" />
                    <LabeledInput label="Gap Y" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Alignment */}
              <AccordionItem value="alignment" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <AlignHorizontalJustifyCenter className="w-3 h-3" />
                    <span>Alignment</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="default">
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Justify" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Default', 'Start', 'Center', 'End', 'Between', 'Around', 'Evenly'].map(v => (
                          <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select defaultValue="default">
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Align" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Default', 'Start', 'Center', 'End', 'Stretch', 'Baseline'].map(v => (
                          <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Typography */}
              <AccordionItem value="typography" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Typography
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="inter">
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="default">
                      <SelectTrigger className="h-7 text-xs opacity-30"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="default">Default</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="semibold">
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semibold">Semibold</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="tight">
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tight">Tight</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <ColorButton color={textColor} onChange={setTextColor} label="Color" />
                </AccordionContent>
              </AccordionItem>

              {/* Appearance */}
              <AccordionItem value="appearance" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3 h-3" />
                    <span>Appearance</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="opacity">
                      <SelectTrigger className="h-7 text-xs opacity-30"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="opacity">Opacity</SelectItem></SelectContent>
                    </Select>
                    <Select defaultValue="blend">
                      <SelectTrigger className="h-7 text-xs opacity-30"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="blend">Blend</SelectItem></SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Background */}
              <AccordionItem value="background" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Background
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <ColorButton color={bgColor} onChange={setBgColor} label="Color" />
                    <button className="h-7 flex items-center gap-2 px-2 py-1 text-xs rounded-md border border-border bg-card opacity-30">
                      <div className="w-4 h-4 rounded border border-border bg-muted flex items-center justify-center">
                        <Image className="w-2.5 h-2.5 text-muted-foreground" />
                      </div>
                      <span className="text-xs truncate">No Image</span>
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Embed */}
              <AccordionItem value="embed" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Embed
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <button className="w-full h-7 flex items-center gap-2 px-2 py-1 text-xs rounded-md border border-border bg-card opacity-30">
                    <Layers className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs truncate">No Asset</span>
                  </button>
                </AccordionContent>
              </AccordionItem>

              {/* Border */}
              <AccordionItem value="border" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Border
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <ColorButton color={borderColor} onChange={setBorderColor} label="Border" />
                    <ColorButton color={ringColor} onChange={setRingColor} label="Ring" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground mb-1.5 block">Rounded</span>
                    <Tabs value={borderRadiusTab} onValueChange={(v) => setBorderRadiusTab(v as typeof borderRadiusTab)} className="w-full">
                      <TabsList className="grid grid-cols-5 h-7">
                        {['all', 't', 'r', 'b', 'l'].map(tab => (
                          <TabsTrigger key={tab} value={tab} className="text-[10px] px-2">{tab.toUpperCase()}</TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                    <SliderControl
                      icon={<Circle className="w-2.5 h-2.5" />}
                      label={`Radius ${borderRadiusTab.toUpperCase()}`}
                      value={borderRadius[borderRadiusTab]}
                      onChange={(v) => setBorderRadius(prev => ({ ...prev, [borderRadiusTab]: v }))}
                      min={0}
                      max={50}
                      unit="px"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Effects */}
              <AccordionItem value="effects" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Effects
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="none">
                      <SelectTrigger className="h-7 text-xs opacity-30"><SelectValue placeholder="Shadow" /></SelectTrigger>
                      <SelectContent>
                        {['None', 'SM', 'MD', 'LG', 'XL', '2XL'].map(v => (
                          <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <SliderControl icon={<Droplet className="w-2.5 h-2.5" />} label="Blur" value={blur} onChange={handleBlurChange} min={0} max={100} unit="px" />
                  <SliderControl icon={<Droplet className="w-2.5 h-2.5" />} label="Backdrop Blur" value={backdropBlur} onChange={handleBackdropBlurChange} min={0} max={100} unit="px" />
                  <SliderControl icon={<Contrast className="w-2.5 h-2.5" />} label="Hue Rotate" value={hueRotate} onChange={setHueRotate} min={0} max={360} unit="°" />
                  <SliderControl icon={<Sun className="w-2.5 h-2.5" />} label="Saturation" value={saturation} onChange={handleSaturationChange} min={0} max={200} unit="%" />
                  <SliderControl icon={<Sun className="w-2.5 h-2.5" />} label="Brightness" value={brightness} onChange={setBrightness} min={0} max={200} unit="%" />
                  <SliderControl icon={<FlipHorizontal className="w-2.5 h-2.5" />} label="Grayscale" value={grayscale} onChange={setGrayscale} min={0} max={100} unit="%" />
                  <SliderControl icon={<FlipHorizontal className="w-2.5 h-2.5" />} label="Invert" value={invert} onChange={setInvert} min={0} max={100} unit="%" />
                </AccordionContent>
              </AccordionItem>

              {/* Transforms */}
              <AccordionItem value="transforms" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  Transforms
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<Move className="w-2.5 h-2.5" />} label="Translate X" value={translateX} onChange={setTranslateX} min={-200} max={200} unit="" />
                    <SliderControl icon={<Move className="w-2.5 h-2.5" />} label="Translate Y" value={translateY} onChange={setTranslateY} min={-200} max={200} unit="" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<Zap className="w-2.5 h-2.5" />} label="Skew X" value={skewX} onChange={setSkewX} min={-45} max={45} unit="°" />
                    <SliderControl icon={<Zap className="w-2.5 h-2.5" />} label="Skew Y" value={skewY} onChange={setSkewY} min={-45} max={45} unit="°" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="Rotate" value={rotate} onChange={setRotate} min={-180} max={180} unit="°" />
                    <SliderControl icon={<Maximize className="w-2.5 h-2.5" />} label="Scale" value={scale} onChange={setScale} min={0} max={200} unit="%" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 3D Transform */}
              <AccordionItem value="3d-transform" className="border-none">
                <AccordionTrigger className="py-1.5 text-xs font-medium text-muted-foreground hover:no-underline">
                  3D Transform
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="3D Rotate X" value={rotateX} onChange={setRotateX} min={-180} max={180} unit="°" />
                    <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="3D Rotate Y" value={rotateY} onChange={setRotateY} min={-180} max={180} unit="°" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SliderControl icon={<RotateCw className="w-2.5 h-2.5" />} label="3D Rotate Z" value={rotateZ} onChange={setRotateZ} min={-180} max={180} unit="°" />
                    <SliderControl 
                      icon={<Maximize className="w-2.5 h-2.5" />} 
                      label="Perspective" 
                      value={perspective} 
                      onChange={setPerspective} 
                      min={0} 
                      max={6} 
                      unit=""
                      valueLabel={perspective === 0 ? "Default" : perspective.toString()}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const IconInput = ({ icon, placeholder }: { icon: React.ReactNode; placeholder?: string }) => (
  <div className="relative">
    <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none opacity-30">
      {icon}
    </div>
    <Input type="text" placeholder={placeholder} className="h-8 text-xs pl-8" />
  </div>
);

const LabeledInput = ({ label, defaultValue }: { label: string; defaultValue?: string }) => (
  <div className="relative">
    <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xs font-light text-foreground pointer-events-none ${!defaultValue ? 'opacity-30' : ''}`}>
      {label}
    </span>
    <Input type="text" defaultValue={defaultValue} className="h-8 text-xs pl-12" />
  </div>
);

const SliderControl = ({ 
  icon, 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  unit,
  valueLabel
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
  valueLabel?: string;
}) => (
  <div className="-space-y-1.5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-[10px] text-muted-foreground">
        {valueLabel || `${value}${unit}`}
      </span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer slider-thumb" 
    />
  </div>
);
