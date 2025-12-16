import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback,
  useMemo,
  ReactNode 
} from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';
export type ShapePreset = 'sharp' | 'rounded' | 'full';
export type SolidStyle = 'color' | 'inverse' | 'contrast';
export type EffectStyle = 'flat' | 'plastic';
export type SurfaceStyle = 'filled' | 'translucent';
export type DataStyle = 'categorical' | 'divergent' | 'sequential';
export type TransitionStyle = 'all' | 'micro' | 'macro' | 'none';
export type NeutralColor = 'slate' | 'gray' | 'zinc';

export interface ColorPalette {
  primary: string;
  accent: string;
  neutral: NeutralColor;
}

export interface ThemeState {
  mode: ThemeMode;
  shape: ShapePreset;
  colors: ColorPalette;
  solidStyle: SolidStyle;
  effectStyle: EffectStyle;
  surface: SurfaceStyle;
  scaling: number;
  dataStyle: DataStyle;
  transition: TransitionStyle;
  depthEffect: boolean;
  noiseEffect: boolean;
  borderWidth: number;
  fieldBaseSize: number;
  selectorBaseSize: number;
}

interface ThemeContextType {
  theme: ThemeState;
  setTheme: React.Dispatch<React.SetStateAction<ThemeState>>;
  updateTheme: (updates: Partial<ThemeState>) => void;
  resetTheme: () => void;
  isDark: boolean;
  toggleMode: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'theme-customizer';

const RADIUS_MAP: Record<ShapePreset, string> = {
  sharp: '0',
  rounded: '0.5rem',
  full: '9999px',
} as const;

export const defaultTheme: ThemeState = {
  mode: 'system',
  shape: 'rounded',
  colors: {
    primary: '217 91% 60%',
    accent: '142 76% 36%',
    neutral: 'slate',
  },
  solidStyle: 'color',
  effectStyle: 'flat',
  surface: 'translucent',
  scaling: 100,
  dataStyle: 'categorical',
  transition: 'all',
  depthEffect: false,
  noiseEffect: false,
  borderWidth: 1,
  fieldBaseSize: 4,
  selectorBaseSize: 4,
};

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// UTILITIES
// ============================================================================

const loadThemeFromStorage = (): ThemeState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultTheme;
    
    const parsed = JSON.parse(stored);
    return { ...defaultTheme, ...parsed };
  } catch (error) {
    console.error('Failed to load theme from storage:', error);
    return defaultTheme;
  }
};

const saveThemeToStorage = (theme: ThemeState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch (error) {
    console.error('Failed to save theme to storage:', error);
  }
};

const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getEffectiveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  return mode === 'system' ? getSystemTheme() : mode;
};

// ============================================================================
// PROVIDER
// ============================================================================

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeState>(loadThemeFromStorage);

  // Calculate effective theme (light/dark)
  const isDark = useMemo(
    () => getEffectiveTheme(theme.mode) === 'dark',
    [theme.mode]
  );

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;

    // Apply theme mode class
    root.classList.remove('light', 'dark');
    root.classList.add(getEffectiveTheme(theme.mode));

    // Apply CSS variables
    const cssVariables: Record<string, string> = {
      '--radius': RADIUS_MAP[theme.shape],
      '--primary': theme.colors.primary,
      '--accent': theme.colors.accent,
      '--theme-scaling': `${theme.scaling}%`,
      '--border-width': `${theme.borderWidth}px`,
    };

    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply data attributes for other theme properties
    root.dataset.solidStyle = theme.solidStyle;
    root.dataset.effectStyle = theme.effectStyle;
    root.dataset.surface = theme.surface;
    root.dataset.dataStyle = theme.dataStyle;
    root.dataset.transition = theme.transition;
    root.dataset.neutral = theme.colors.neutral;
    root.dataset.depthEffect = String(theme.depthEffect);
    root.dataset.noiseEffect = String(theme.noiseEffect);

    // Save to storage
    saveThemeToStorage(theme);
  }, [theme]);

  // Listen to system theme changes
  useEffect(() => {
    if (theme.mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.mode]);

  // Update theme with partial updates
  const updateTheme = useCallback((updates: Partial<ThemeState>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset theme to defaults
  const resetTheme = useCallback(() => {
    setTheme(defaultTheme);
  }, []);

  // Toggle between light and dark modes
  const toggleMode = useCallback(() => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  const contextValue = useMemo<ThemeContextType>(
    () => ({
      theme,
      setTheme,
      updateTheme,
      resetTheme,
      isDark,
      toggleMode,
    }),
    [theme, updateTheme, resetTheme, isDark, toggleMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

export const useThemeMode = () => {
  const { theme, updateTheme, isDark } = useTheme();
  
  const setMode = useCallback(
    (mode: ThemeMode) => updateTheme({ mode }),
    [updateTheme]
  );
  
  return { mode: theme.mode, setMode, isDark };
};

export const useThemeColors = () => {
  const { theme, updateTheme } = useTheme();
  
  const setColors = useCallback(
    (colors: Partial<ColorPalette>) => {
      updateTheme({ colors: { ...theme.colors, ...colors } });
    },
    [theme.colors, updateTheme]
  );
  
  return { colors: theme.colors, setColors };
};

export const useThemeShape = () => {
  const { theme, updateTheme } = useTheme();
  
  const setShape = useCallback(
    (shape: ShapePreset) => updateTheme({ shape }),
    [updateTheme]
  );
  
  return { shape: theme.shape, setShape };
};
