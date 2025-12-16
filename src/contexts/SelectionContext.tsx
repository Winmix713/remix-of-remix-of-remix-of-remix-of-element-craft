import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface SelectedElement {
  id: string;
  type: string;
  tag: string;
  classes: string[];
  styles: Record<string, string>;
  text?: string;
  parentId?: string;
  children?: string[];
}

export interface InspectorValues {
  // Layout
  marginX: number;
  marginY: number;
  paddingL: number;
  paddingT: number;
  paddingR: number;
  paddingB: number;
  position: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  positionL?: number;
  positionT?: number;
  positionR?: number;
  positionB?: number;
  width?: string;
  height?: string;
  
  // Appearance
  opacity: number;
  bgColor: string | null;
  borderColor: string | null;
  textColor: string | null;
  borderRadius: number;
  
  // Effects
  blur: number;
  backdropBlur: number;
  brightness: number;
  saturation: number;
  hueRotate: number;
  grayscale: number;
  invert: number;
  
  // Transform
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  skewX: number;
  skewY: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  perspective: number;
}

interface SelectionContextType {
  selectedElement: SelectedElement | null;
  inspectorValues: InspectorValues;
  selectElement: (element: SelectedElement | null) => void;
  updateInspectorValue: <K extends keyof InspectorValues>(key: K, value: InspectorValues[K]) => void;
  updateInspectorValues: (values: Partial<InspectorValues>) => void;
  resetInspectorValues: () => void;
  generateElementCSS: () => string;
  generateElementTailwind: () => string;
}

// ============================================================================
// DEFAULTS
// ============================================================================

const defaultInspectorValues: InspectorValues = {
  marginX: 0,
  marginY: 0,
  paddingL: 0,
  paddingT: 0,
  paddingR: 0,
  paddingB: 0,
  position: 'relative',
  opacity: 100,
  bgColor: null,
  borderColor: null,
  textColor: null,
  borderRadius: 0,
  blur: 0,
  backdropBlur: 0,
  brightness: 100,
  saturation: 100,
  hueRotate: 0,
  grayscale: 0,
  invert: 0,
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scale: 100,
  skewX: 0,
  skewY: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  perspective: 0,
};

// ============================================================================
// CONTEXT
// ============================================================================

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [inspectorValues, setInspectorValues] = useState<InspectorValues>(defaultInspectorValues);

  const selectElement = useCallback((element: SelectedElement | null) => {
    setSelectedElement(element);
    if (element?.styles) {
      // Parse element styles into inspector values
      const parsed: Partial<InspectorValues> = {};
      
      if (element.styles.opacity) {
        parsed.opacity = parseFloat(element.styles.opacity) * 100;
      }
      if (element.styles.filter) {
        const blur = element.styles.filter.match(/blur\((\d+)px\)/);
        if (blur) parsed.blur = parseInt(blur[1]);
      }
      
      setInspectorValues(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  const updateInspectorValue = useCallback(<K extends keyof InspectorValues>(
    key: K, 
    value: InspectorValues[K]
  ) => {
    setInspectorValues(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateInspectorValues = useCallback((values: Partial<InspectorValues>) => {
    setInspectorValues(prev => ({ ...prev, ...values }));
  }, []);

  const resetInspectorValues = useCallback(() => {
    setInspectorValues(defaultInspectorValues);
  }, []);

  const generateElementCSS = useCallback((): string => {
    const v = inspectorValues;
    const lines: string[] = [];

    // Layout
    if (v.marginX || v.marginY) {
      lines.push(`margin: ${v.marginY}px ${v.marginX}px;`);
    }
    if (v.paddingL || v.paddingT || v.paddingR || v.paddingB) {
      lines.push(`padding: ${v.paddingT}px ${v.paddingR}px ${v.paddingB}px ${v.paddingL}px;`);
    }
    if (v.position !== 'static') {
      lines.push(`position: ${v.position};`);
    }
    if (v.width) lines.push(`width: ${v.width};`);
    if (v.height) lines.push(`height: ${v.height};`);

    // Appearance
    if (v.opacity !== 100) lines.push(`opacity: ${v.opacity / 100};`);
    if (v.bgColor) lines.push(`background-color: ${v.bgColor};`);
    if (v.borderColor) lines.push(`border-color: ${v.borderColor};`);
    if (v.textColor) lines.push(`color: ${v.textColor};`);
    if (v.borderRadius) lines.push(`border-radius: ${v.borderRadius}px;`);

    // Filters
    const filters: string[] = [];
    if (v.blur) filters.push(`blur(${v.blur}px)`);
    if (v.brightness !== 100) filters.push(`brightness(${v.brightness}%)`);
    if (v.saturation !== 100) filters.push(`saturate(${v.saturation}%)`);
    if (v.hueRotate) filters.push(`hue-rotate(${v.hueRotate}deg)`);
    if (v.grayscale) filters.push(`grayscale(${v.grayscale}%)`);
    if (v.invert) filters.push(`invert(${v.invert}%)`);
    if (filters.length) lines.push(`filter: ${filters.join(' ')};`);

    if (v.backdropBlur) {
      lines.push(`backdrop-filter: blur(${v.backdropBlur}px);`);
    }

    // Transform
    const transforms: string[] = [];
    if (v.translateX || v.translateY) transforms.push(`translate(${v.translateX}px, ${v.translateY}px)`);
    if (v.rotate) transforms.push(`rotate(${v.rotate}deg)`);
    if (v.scale !== 100) transforms.push(`scale(${v.scale / 100})`);
    if (v.skewX) transforms.push(`skewX(${v.skewX}deg)`);
    if (v.skewY) transforms.push(`skewY(${v.skewY}deg)`);
    if (v.rotateX) transforms.push(`rotateX(${v.rotateX}deg)`);
    if (v.rotateY) transforms.push(`rotateY(${v.rotateY}deg)`);
    if (v.rotateZ) transforms.push(`rotateZ(${v.rotateZ}deg)`);
    if (transforms.length) {
      lines.push(`transform: ${transforms.join(' ')};`);
      if (v.perspective) lines.push(`perspective: ${v.perspective}px;`);
    }

    return `.element {\n  ${lines.join('\n  ')}\n}`;
  }, [inspectorValues]);

  const generateElementTailwind = useCallback((): string => {
    const v = inspectorValues;
    const classes: string[] = [];

    // Layout
    if (v.marginX) classes.push(`mx-${v.marginX}`);
    if (v.marginY) classes.push(`my-${v.marginY}`);
    if (v.paddingL) classes.push(`pl-${v.paddingL}`);
    if (v.paddingT) classes.push(`pt-${v.paddingT}`);
    if (v.paddingR) classes.push(`pr-${v.paddingR}`);
    if (v.paddingB) classes.push(`pb-${v.paddingB}`);
    if (v.position !== 'static') classes.push(v.position);

    // Appearance
    if (v.opacity !== 100) classes.push(`opacity-${v.opacity}`);
    if (v.borderRadius) classes.push(`rounded-[${v.borderRadius}px]`);

    // Effects
    if (v.blur) classes.push(`blur-[${v.blur}px]`);
    if (v.backdropBlur) classes.push(`backdrop-blur-[${v.backdropBlur}px]`);
    if (v.brightness !== 100) classes.push(`brightness-${v.brightness}`);
    if (v.saturation !== 100) classes.push(`saturate-${v.saturation}`);
    if (v.grayscale) classes.push(`grayscale-${v.grayscale}`);
    if (v.invert) classes.push(`invert-${v.invert}`);
    if (v.hueRotate) classes.push(`hue-rotate-${v.hueRotate}`);

    // Transform
    if (v.translateX) classes.push(`translate-x-[${v.translateX}px]`);
    if (v.translateY) classes.push(`translate-y-[${v.translateY}px]`);
    if (v.rotate) classes.push(`rotate-[${v.rotate}deg]`);
    if (v.scale !== 100) classes.push(`scale-[${v.scale / 100}]`);
    if (v.skewX) classes.push(`skew-x-[${v.skewX}deg]`);
    if (v.skewY) classes.push(`skew-y-[${v.skewY}deg]`);

    return classes.join(' ');
  }, [inspectorValues]);

  const value = useMemo<SelectionContextType>(() => ({
    selectedElement,
    inspectorValues,
    selectElement,
    updateInspectorValue,
    updateInspectorValues,
    resetInspectorValues,
    generateElementCSS,
    generateElementTailwind,
  }), [
    selectedElement,
    inspectorValues,
    selectElement,
    updateInspectorValue,
    updateInspectorValues,
    resetInspectorValues,
    generateElementCSS,
    generateElementTailwind,
  ]);

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useSelection = (): SelectionContextType => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within SelectionProvider');
  }
  return context;
};
