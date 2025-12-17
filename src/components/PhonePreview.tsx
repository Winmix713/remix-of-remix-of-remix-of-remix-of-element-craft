import { useEffects } from '@/contexts/ThemeContext';
import { Move, Smartphone, LayoutDashboard, User, CreditCard, Shuffle } from 'lucide-react';
import Draggable from 'react-draggable';
import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  OnboardingTemplate, 
  DashboardTemplate, 
  ProfileTemplate, 
  CardsTemplate,
  PreviewTemplate 
} from './PhonePreviewTemplates';

const templates: { id: PreviewTemplate; icon: React.ElementType; label: string }[] = [
  { id: 'onboarding', icon: Smartphone, label: 'Onboarding' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'cards', icon: CreditCard, label: 'Cards' },
];

// Random color generator
const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const lightness = 65 + Math.floor(Math.random() * 20);
  const chroma = 0.15 + Math.random() * 0.15;
  return { hue, lightness, chroma };
};

export const PhonePreview = () => {
  const { state, getOklchColor, updateBlurSettings, updateGlowSettings } = useEffects();
  const oklchColor = getOklchColor();
  const { x, y } = state.blurSettings;
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<PreviewTemplate>('onboarding');

  const noiseUrl = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /></filter><rect width='100%' height='100%' filter='url(%23n)' /></svg>";

  // Convert blur settings to draggable position (offset from default)
  const defaultX = -590;
  const defaultY = -1070;
  const dragX = x - defaultX;
  const dragY = y - defaultY;

  const handleDrag = (_: any, data: { x: number; y: number }) => {
    updateBlurSettings({
      x: defaultX + data.x,
      y: defaultY + data.y,
    });
  };

  // Random color handler
  const handleRandomColor = useCallback(() => {
    const { hue, lightness, chroma } = generateRandomColor();
    updateGlowSettings({ hue, lightness, chroma });
  }, [updateGlowSettings]);

  // Get shape settings with defaults
  const maskSize = state.glowSettings.maskSize ?? 0.3;
  const glowScale = state.glowSettings.glowScale ?? 0.9;
  const noiseEnabled = state.glowSettings.noiseEnabled ?? true;
  const noiseIntensity = state.glowSettings.noiseIntensity ?? 0.35;

  // Calculate glass effect styles
  const glassStyle = state.activeEffects.glass ? {
    backdropFilter: `blur(${state.glassSettings.blur}px) saturate(${state.glassSettings.saturation}%)`,
    backgroundColor: `${state.glassSettings.tint}${Math.round(state.glassSettings.opacity * 2.55).toString(16).padStart(2, '0')}`,
    border: `${state.glassSettings.borderWidth}px solid rgba(255,255,255,${state.glassSettings.borderOpacity / 100})`,
  } : {};

  // Calculate neomorph effect styles
  const getNeomorphShadow = () => {
    if (!state.activeEffects.neomorph) return {};
    const { distance, blur, intensity, lightSource, surfaceColor, shape } = state.neomorphSettings;
    const angle = (lightSource * Math.PI) / 180;
    const lightX = Math.round(Math.cos(angle) * distance);
    const lightY = Math.round(Math.sin(angle) * distance);
    const darkX = -lightX;
    const darkY = -lightY;
    const lightOpacity = intensity / 100 * 0.5;
    const darkOpacity = intensity / 100;

    let inset = '';
    if (shape === 'pressed') inset = 'inset ';
    else if (shape === 'concave') inset = 'inset ';

    return {
      backgroundColor: surfaceColor,
      boxShadow: `${inset}${lightX}px ${lightY}px ${blur}px rgba(255,255,255,${lightOpacity}), ${inset}${darkX}px ${darkY}px ${blur}px rgba(0,0,0,${darkOpacity})`,
    };
  };

  // Calculate clay effect styles
  const getClayStyle = () => {
    if (!state.activeEffects.clay) return {};
    const { depth, spread, borderRadius, highlightColor, shadowColor, surfaceTexture, bendAngle } = state.claySettings;
    
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

    return {
      borderRadius: `${borderRadius}px`,
      boxShadow: `0 ${depth}px ${spread}px ${shadowColor}60, 0 ${depth * 0.5}px ${spread * 0.5}px ${shadowColor}40`,
      background: gradient,
    };
  };

  const renderTemplate = () => {
    const templateProps = { getNeomorphShadow, getClayStyle };
    switch (activeTemplate) {
      case 'dashboard':
        return <DashboardTemplate {...templateProps} />;
      case 'profile':
        return <ProfileTemplate {...templateProps} />;
      case 'cards':
        return <CardsTemplate {...templateProps} />;
      default:
        return <OnboardingTemplate {...templateProps} />;
    }
  };

  // Animation variants for glow layers
  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: isDragging ? 0.7 : (state.glowSettings.animationIntensity / 100),
      scale: glowScale,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* Template selector with random color button */}
      <div className="flex gap-2 p-1.5 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm">
        {templates.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTemplate(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTemplate === id 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
            title={label}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
        
        {/* Random color button */}
        <button
          onClick={handleRandomColor}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          title="Random szín"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Phone preview */}
      <div className="relative">
        {/* Ambient glow with motion */}
        <motion.div 
          className="absolute -inset-10 opacity-70 blur-3xl pointer-events-none"
          animate={{
            background: `radial-gradient(circle at top, ${state.glowSettings.baseColor}80, transparent 60%)`
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Phone frame */}
        <div className="relative rounded-[2.4rem] bg-card/90 border border-border/80 shadow-[0_26px_80px_rgba(0,0,0,0.95)] p-2.5">
          <div 
            className="relative w-[375px] h-[812px] rounded-[40px] overflow-hidden shadow-2xl border-4 transition-colors duration-500 bg-background border-border"
          >
            {/* Draggable Glow layers with Framer Motion */}
            <AnimatePresence>
              {state.powerOn && state.activeEffects.glow && (
                <Draggable
                  nodeRef={nodeRef}
                  position={{ x: dragX, y: dragY }}
                  onDrag={handleDrag}
                  onStart={() => setIsDragging(true)}
                  onStop={() => setIsDragging(false)}
                >
                  <motion.div 
                    ref={nodeRef}
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`absolute w-[1700px] h-[2400px] cursor-move z-[1] ${
                      state.glowSettings.animation === 'pulse' ? 'animate-glow-pulse' :
                      state.glowSettings.animation === 'breathe' ? 'animate-glow-breathe' :
                      state.glowSettings.animation === 'wave' ? 'animate-glow-wave' : ''
                    }`}
                    style={{
                      maskImage: `linear-gradient(black ${maskSize * 100}%, transparent 100%)`,
                      transition: isDragging ? 'none' : 'opacity 0.2s',
                      left: `${defaultX}px`,
                      top: `${defaultY}px`,
                      '--glow-speed': `${state.glowSettings.animationSpeed}s`,
                    } as React.CSSProperties}
                  >
                    {/* Drag indicator */}
                    <div className={`absolute top-[800px] left-[750px] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                      <Move className="w-3 h-3 text-white/60" />
                      <span className="text-[10px] text-white/60">Húzd a mozgatáshoz</span>
                    </div>

                    {/* 4-layer glow effect */}
                    <motion.div 
                      className="absolute top-[400px] left-[300px] w-[1800px] rounded-full opacity-40 mix-blend-screen pointer-events-none"
                      animate={{ backgroundColor: oklchColor }}
                      transition={{ duration: 0.3 }}
                      style={{
                        height: '1140px',
                        filter: 'blur(180px)',
                      }}
                    />
                    <motion.div 
                      className="absolute top-[600px] left-[460px] w-[1300px] h-[1300px] rounded-full opacity-60 mix-blend-screen pointer-events-none"
                      animate={{ backgroundColor: oklchColor }}
                      transition={{ duration: 0.3 }}
                      style={{
                        filter: 'blur(120px)',
                      }}
                    />
                    <motion.div 
                      className="absolute top-[700px] left-[560px] w-[1000px] h-[800px] rounded-full mix-blend-screen pointer-events-none"
                      animate={{ backgroundColor: oklchColor }}
                      transition={{ duration: 0.3 }}
                      style={{
                        filter: 'blur(60px)',
                        opacity: 1,
                      }}
                    />
                    <div 
                      className="absolute top-[800px] left-[700px] w-[600px] h-[440px] rounded-full mix-blend-normal pointer-events-none"
                      style={{
                        backgroundColor: 'rgb(255, 255, 255)',
                        filter: 'blur(80px)',
                        opacity: 0.4,
                      }}
                    />
                  </motion.div>
                </Draggable>
              )}
            </AnimatePresence>

            {/* Glass effect overlay */}
            {state.powerOn && state.activeEffects.glass && (
              <motion.div 
                className="absolute inset-0 z-[2] pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={glassStyle}
              />
            )}

            {/* Noise texture overlay - controlled by settings */}
            <AnimatePresence>
              {noiseEnabled && (
                <motion.div 
                  className="absolute inset-0 w-full h-full pointer-events-none z-[5] mix-blend-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: noiseIntensity }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundImage: `url("${noiseUrl}")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px 200px',
                  }}
                />
              )}
            </AnimatePresence>

            {/* Content Template */}
            {renderTemplate()}

            {/* Footer link */}
            <a 
              href="https://ap.cx" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] z-10 opacity-50 hover:opacity-80 text-white/50 transition-opacity"
            >
              ap.cx
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
