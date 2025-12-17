import React, { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  useMemo, 
  useEffect,
  ReactNode 
} from 'react';
import { 
  HistoryState, 
  pushToHistory, 
  undoHistory, 
  redoHistory, 
  jumpToHistory, 
  useKeyboardShortcuts 
} from '@/hooks/useHistory';

// ============================================================================
// EFFECT TYPES
// ============================================================================

export type EffectType = 'glow' | 'glass' | 'neomorph' | 'clay';
export type ThemeModeType = 'dark' | 'light' | 'auto';
export type GlowAnimationType = 'none' | 'pulse' | 'breathe' | 'wave';
export type ShapeType = 'flat' | 'concave' | 'convex' | 'pressed';
export type SurfaceTexture = 'smooth' | 'matte' | 'glossy';

// ============================================================================
// THEME CUSTOMIZER TYPES
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';
export type ShapePreset = 'sharp' | 'rounded' | 'full';
export type SolidStyle = 'color' | 'inverse' | 'contrast';
export type EffectStyle = 'flat' | 'plastic';
export type SurfaceStyle = 'filled' | 'translucent';
export type DataStyle = 'categorical' | 'divergent' | 'sequential';
export type TransitionStyle = 'all' | 'micro' | 'macro' | 'none';

// ============================================================================
// EFFECT INTERFACES
// ============================================================================

export interface GlowSettings {
  lightness: number;
  chroma: number;
  hue: number;
  baseColor: string;
  animation: GlowAnimationType;
  animationSpeed: number;
  animationIntensity: number;
  // Shape configuration
  maskSize: number;
  glowScale: number;
  noiseEnabled: boolean;
  noiseIntensity: number;
}

export interface BlurSettings {
  x: number;
  y: number;
}

export interface GlassSettings {
  blur: number;
  opacity: number;
  saturation: number;
  borderWidth: number;
  borderOpacity: number;
  tint: string;
  tintStrength: number;
}

export interface NeomorphSettings {
  distance: number;
  blur: number;
  intensity: number;
  shape: ShapeType;
  lightSource: number;
  surfaceColor: string;
}

export type ShadowDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface ClaySettings {
  depth: number;
  spread: number;
  borderRadius: number;
  highlightColor: string;
  shadowColor: string;
  surfaceTexture: SurfaceTexture;
  bendAngle: number;
  opacity?: number;
  blur?: number;
  shadowDirection?: ShadowDirection;
}

export interface EffectState {
  powerOn: boolean;
  activeEffects: Record<EffectType, boolean>;
  themeMode: ThemeModeType;
  glowSettings: GlowSettings;
  blurSettings: BlurSettings;
  glassSettings: GlassSettings;
  neomorphSettings: NeomorphSettings;
  claySettings: ClaySettings;
}

// ============================================================================
// THEME CONFIG INTERFACE
// ============================================================================

export interface ThemeConfig {
  mode: ThemeMode;
  shape: ShapePreset;
  colors: {
    primary: string;
    accent: string;
    neutral: 'slate' | 'gray' | 'zinc';
  };
  solidStyle: SolidStyle;
  effectStyle: EffectStyle;
  surface: SurfaceStyle;
  scaling: number;
  dataStyle: DataStyle;
  transition: TransitionStyle;
  borderWidth: number;
  depthEffect: boolean;
  noiseEffect: boolean;
  fieldBaseSize: number;
  selectorBaseSize: number;
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface EffectContextType {
  state: EffectState;
  togglePower: () => void;
  toggleEffect: (effect: EffectType) => void;
  setThemeMode: (mode: ThemeModeType) => void;
  updateGlowSettings: (settings: Partial<GlowSettings>) => void;
  updateBlurSettings: (settings: Partial<BlurSettings>) => void;
  updateGlassSettings: (settings: Partial<GlassSettings>) => void;
  updateNeomorphSettings: (settings: Partial<NeomorphSettings>) => void;
  updateClaySettings: (settings: Partial<ClaySettings>) => void;
  resetBlurPosition: () => void;
  resetToDefaults: () => void;
  getActiveEffectsCount: () => number;
  getOklchColor: () => string;
  generateCSS: () => string;
  exportState: () => string;
  importState: (jsonString: string) => boolean;
  history: HistoryState<EffectState>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  jumpToHistoryEntry: (id: string) => void;
  clearHistory: () => void;
}

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'effect-editor';
const THEME_STORAGE_KEY = 'theme-customizer';
const DEFAULT_BLUR_X = -590;
const DEFAULT_BLUR_Y = -1070;

const defaultGlowSettings: GlowSettings = {
  lightness: 78,
  chroma: 0.18,
  hue: 70,
  baseColor: '#FF9F00',
  animation: 'none',
  animationSpeed: 2,
  animationIntensity: 50,
  // Shape defaults
  maskSize: 0.3,
  glowScale: 0.9,
  noiseEnabled: true,
  noiseIntensity: 0.35,
};

const defaultBlurSettings: BlurSettings = {
  x: DEFAULT_BLUR_X,
  y: DEFAULT_BLUR_Y,
};

const defaultGlassSettings: GlassSettings = {
  blur: 12,
  opacity: 20,
  saturation: 120,
  borderWidth: 1,
  borderOpacity: 20,
  tint: '#ffffff',
  tintStrength: 10,
};

const defaultNeomorphSettings: NeomorphSettings = {
  distance: 10,
  blur: 30,
  intensity: 50,
  shape: 'flat',
  lightSource: 145,
  surfaceColor: '#2a2a2a',
};

const defaultClaySettings: ClaySettings = {
  depth: 10,
  spread: 10,
  borderRadius: 24,
  highlightColor: '#ffffff',
  shadowColor: '#000000',
  surfaceTexture: 'smooth',
  bendAngle: 0,
  opacity: 100,
  blur: 20,
  shadowDirection: 'bottom-right',
};

export const defaultEffectState: EffectState = {
  powerOn: true,
  activeEffects: {
    glow: true,
    glass: false,
    neomorph: false,
    clay: false,
  },
  themeMode: 'dark',
  glowSettings: defaultGlowSettings,
  blurSettings: defaultBlurSettings,
  glassSettings: defaultGlassSettings,
  neomorphSettings: defaultNeomorphSettings,
  claySettings: defaultClaySettings,
};

export const defaultThemeConfig: ThemeConfig = {
  mode: 'dark',
  shape: 'rounded',
  colors: {
    primary: '217 91% 60%',
    accent: '280 85% 65%',
    neutral: 'slate',
  },
  solidStyle: 'color',
  effectStyle: 'flat',
  surface: 'filled',
  scaling: 100,
  dataStyle: 'categorical',
  transition: 'all',
  borderWidth: 1,
  depthEffect: false,
  noiseEffect: false,
  fieldBaseSize: 4,
  selectorBaseSize: 4,
};

// ============================================================================
// CONTEXTS
// ============================================================================

const EffectContext = createContext<EffectContextType | undefined>(undefined);
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// UTILITIES
// ============================================================================

const loadStateFromStorage = (): EffectState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultEffectState;
    const parsed = JSON.parse(stored);
    return { ...defaultEffectState, ...parsed };
  } catch (error) {
    console.error('Failed to load effect state from storage:', error);
    return defaultEffectState;
  }
};

const saveStateToStorage = (state: EffectState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save effect state to storage:', error);
  }
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const formatOklch = (lightness: number, chroma: number, hue: number): string => {
  const l = clamp(lightness, 0, 100) / 100;
  const c = clamp(chroma, 0, 0.4);
  const h = hue % 360;
  return `oklch(${l.toFixed(2)} ${c.toFixed(3)} ${h})`;
};

// ============================================================================
// EFFECT PROVIDER
// ============================================================================

export const EffectProvider = ({ children }: { children: ReactNode }) => {
  const [historyState, setHistoryState] = useState<HistoryState<EffectState>>(() => {
    const initialState = loadStateFromStorage();
    return {
      past: [],
      present: initialState,
      future: [],
    };
  });

  const state = historyState.present;

  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  const pushHistory = useCallback((newState: EffectState, label: string) => {
    setHistoryState(prev => pushToHistory(prev, newState, label));
  }, []);

  const undo = useCallback(() => {
    setHistoryState(prev => undoHistory(prev) || prev);
  }, []);

  const redo = useCallback(() => {
    setHistoryState(prev => redoHistory(prev) || prev);
  }, []);

  const canUndo = historyState.past.length > 0;
  const canRedo = historyState.future.length > 0;

  useKeyboardShortcuts(undo, redo, canUndo, canRedo);

  const jumpToHistoryEntry = useCallback((id: string) => {
    setHistoryState(prev => jumpToHistory(prev, id) || prev);
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryState(prev => ({
      past: [],
      present: prev.present,
      future: [],
    }));
  }, []);

  const togglePower = useCallback(() => {
    const newState = { ...state, powerOn: !state.powerOn };
    pushHistory(newState, `Power ${newState.powerOn ? 'on' : 'off'}`);
  }, [state, pushHistory]);

  const toggleEffect = useCallback((effect: EffectType) => {
    const newActiveState = !state.activeEffects[effect];
    const newState = {
      ...state,
      activeEffects: {
        ...state.activeEffects,
        [effect]: newActiveState,
      },
    };
    pushHistory(
      newState, 
      `${effect.charAt(0).toUpperCase() + effect.slice(1)} ${newActiveState ? 'enabled' : 'disabled'}`
    );
  }, [state, pushHistory]);

  const setThemeMode = useCallback((mode: ThemeModeType) => {
    if (state.themeMode === mode) return;
    const newState = { ...state, themeMode: mode };
    pushHistory(newState, `Theme: ${mode}`);
  }, [state, pushHistory]);

  const updateGlowSettings = useCallback((settings: Partial<GlowSettings>) => {
    const newState = {
      ...state,
      glowSettings: { ...state.glowSettings, ...settings },
    };
    const key = Object.keys(settings)[0];
    pushHistory(newState, `Glow ${key} changed`);
  }, [state, pushHistory]);

  const updateBlurSettings = useCallback((settings: Partial<BlurSettings>) => {
    const newState = {
      ...state,
      blurSettings: { ...state.blurSettings, ...settings },
    };
    pushHistory(newState, 'Blur position changed');
  }, [state, pushHistory]);

  const updateGlassSettings = useCallback((settings: Partial<GlassSettings>) => {
    const newState = {
      ...state,
      glassSettings: { ...state.glassSettings, ...settings },
    };
    const key = Object.keys(settings)[0];
    pushHistory(newState, `Glass ${key} changed`);
  }, [state, pushHistory]);

  const updateNeomorphSettings = useCallback((settings: Partial<NeomorphSettings>) => {
    const newState = {
      ...state,
      neomorphSettings: { ...state.neomorphSettings, ...settings },
    };
    const key = Object.keys(settings)[0];
    pushHistory(newState, `Neomorph ${key} changed`);
  }, [state, pushHistory]);

  const updateClaySettings = useCallback((settings: Partial<ClaySettings>) => {
    const newState = {
      ...state,
      claySettings: { ...state.claySettings, ...settings },
    };
    const key = Object.keys(settings)[0];
    pushHistory(newState, `Clay ${key} changed`);
  }, [state, pushHistory]);

  const resetBlurPosition = useCallback(() => {
    const newState = {
      ...state,
      blurSettings: { ...defaultBlurSettings },
    };
    pushHistory(newState, 'Blur position reset');
  }, [state, pushHistory]);

  const resetToDefaults = useCallback(() => {
    pushHistory(defaultEffectState, 'Reset to defaults');
  }, [pushHistory]);

  const getActiveEffectsCount = useCallback((): number => {
    return Object.values(state.activeEffects).filter(Boolean).length;
  }, [state.activeEffects]);

  const getOklchColor = useCallback((): string => {
    const { lightness, chroma, hue } = state.glowSettings;
    return formatOklch(lightness, chroma, hue);
  }, [state.glowSettings]);

  const generateCSS = useCallback((): string => {
    const oklch = getOklchColor();
    const { x, y } = state.blurSettings;
    
    return `.glow-effect {
  background-color: ${oklch};
  filter: blur(180px);
}

.phone-preview {
  --glow-color: ${oklch};
  --blur-x: ${x}px;
  --blur-y: ${y}px;
}`;
  }, [getOklchColor, state.blurSettings]);

  const exportState = useCallback((): string => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importState = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      const newState = { ...defaultEffectState, ...parsed };
      pushHistory(newState, 'State imported');
      return true;
    } catch (error) {
      console.error('Failed to import state:', error);
      return false;
    }
  }, [pushHistory]);

  const contextValue = useMemo<EffectContextType>(() => ({
    state,
    togglePower,
    toggleEffect,
    setThemeMode,
    updateGlowSettings,
    updateBlurSettings,
    updateGlassSettings,
    updateNeomorphSettings,
    updateClaySettings,
    resetBlurPosition,
    resetToDefaults,
    getActiveEffectsCount,
    getOklchColor,
    generateCSS,
    exportState,
    importState,
    history: historyState,
    undo,
    redo,
    canUndo,
    canRedo,
    jumpToHistoryEntry,
    clearHistory,
  }), [
    state,
    togglePower,
    toggleEffect,
    setThemeMode,
    updateGlowSettings,
    updateBlurSettings,
    updateGlassSettings,
    updateNeomorphSettings,
    updateClaySettings,
    resetBlurPosition,
    resetToDefaults,
    getActiveEffectsCount,
    getOklchColor,
    generateCSS,
    exportState,
    importState,
    historyState,
    undo,
    redo,
    canUndo,
    canRedo,
    jumpToHistoryEntry,
    clearHistory,
  ]);

  return (
    <EffectContext.Provider value={contextValue}>
      {children}
    </EffectContext.Provider>
  );
};

// ============================================================================
// THEME PROVIDER
// ============================================================================

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all required fields exist by merging with defaults
        return {
          ...defaultThemeConfig,
          ...parsed,
          colors: {
            ...defaultThemeConfig.colors,
            ...(parsed.colors || {}),
          },
        };
      }
      return defaultThemeConfig;
    } catch {
      // Clear corrupted data
      localStorage.removeItem(THEME_STORAGE_KEY);
      return defaultThemeConfig;
    }
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  const updateTheme = useCallback((updates: Partial<ThemeConfig>) => {
    setTheme(prev => ({
      ...prev,
      ...updates,
      colors: updates.colors ? { ...prev.colors, ...updates.colors } : prev.colors,
    }));
  }, []);

  const resetTheme = useCallback(() => {
    setTheme(defaultThemeConfig);
    localStorage.removeItem(THEME_STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({ theme, updateTheme, resetTheme }), [theme, updateTheme, resetTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

export const useEffects = (): EffectContextType => {
  const context = useContext(EffectContext);
  if (!context) {
    throw new Error('useEffects must be used within EffectProvider');
  }
  return context;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return safe defaults if used outside provider (shouldn't happen in production)
    console.warn('useTheme must be used within ThemeProvider - using defaults');
    return {
      theme: defaultThemeConfig,
      updateTheme: () => {},
      resetTheme: () => {},
    };
  }
  return context;
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

export const useEffectToggle = (effect: EffectType) => {
  const { state, toggleEffect } = useEffects();
  
  return {
    isActive: state.activeEffects[effect],
    toggle: () => toggleEffect(effect),
  };
};

export const useGlowControls = () => {
  const { state, updateGlowSettings, getOklchColor } = useEffects();
  
  return {
    settings: state.glowSettings,
    updateSettings: updateGlowSettings,
    oklchColor: getOklchColor(),
  };
};

export const useBlurControls = () => {
  const { state, updateBlurSettings, resetBlurPosition } = useEffects();
  
  return {
    settings: state.blurSettings,
    updateSettings: updateBlurSettings,
    reset: resetBlurPosition,
  };
};
