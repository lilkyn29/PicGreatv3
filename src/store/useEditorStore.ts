import * as fabric from 'fabric';
import { create } from 'zustand';
import { FILTERS, FilterDef, FilterCategory } from '../lib/filters';

interface EditorState {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  image: fabric.FabricImage | null;
  setImage: (image: fabric.FabricImage | null) => void;
  mainImageId: string | null;
  setMainImageId: (id: string | null) => void;
  
  videoElement: HTMLVideoElement | null;
  setVideoElement: (video: HTMLVideoElement | null) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  
  isComparing: boolean;
  toggleCompare: (value: boolean) => void;
  
  images: fabric.FabricImage[];
  addImage: (image: fabric.FabricImage) => void;
  removeImage: (image: fabric.FabricImage) => void;
  
  isCropping: boolean;
  setIsCropping: (isCropping: boolean) => void;
  
  // Basic Adjustments
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  exposure: number;
  shadows: number;
  highlights: number;
  warmth: number;
  vignette: number;
  grain: number;
  dehaze: number;
  vibrance: number;
  setAdjustment: (key: 'brightness' | 'contrast' | 'saturation' | 'hue' | 'exposure' | 'shadows' | 'highlights' | 'warmth' | 'vignette' | 'grain' | 'dehaze' | 'vibrance', value: number) => void;
  
  // Active Filter
  activeFilter: string | null;
  filterIntensity: number;
  setActiveFilter: (filter: string | null) => void;
  setFilterIntensity: (intensity: number) => void;
  
  // UI State
  activeTab: 'adjust' | 'filters' | 'stickers' | 'text' | 'draw' | 'shapes' | 'video';
  setActiveTab: (tab: 'adjust' | 'filters' | 'stickers' | 'text' | 'draw' | 'shapes' | 'video') => void;
  
  // Object Properties State
  selectedObject: fabric.Object | null;
  setSelectedObject: (obj: fabric.Object | null) => void;
  updateSelectedObject: (props: any) => void;
  
  // Drawing State
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  isErasing: boolean;
  setIsErasing: (isErasing: boolean) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  
  // Custom Filters
  customFilters: FilterDef[];
  saveCustomFilter: (name: string) => void;
  applyAllFilters: () => void;
  debouncedApplyFilters: () => void;
  clearCanvas: () => void;
  resetToOriginal: () => void;
  removeMainImage: () => void;
  // History
  history: any[];
  historyIndex: number;
  isCanvasEmpty: boolean;
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  jumpToHistory: (index: number) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  image: null,
  setImage: (image) => {
    set({ image });
    get().saveHistory();
  },
  mainImageId: null,
  setMainImageId: (mainImageId) => set({ mainImageId }),
  
  images: [],
  addImage: (image) => set((state) => ({ images: [...state.images, image] })),
  removeImage: (image) => set((state) => ({ images: state.images.filter(img => img !== image) })),
  
  isCropping: false,
  setIsCropping: (isCropping) => set({ isCropping }),
  
  videoElement: null,
  setVideoElement: (videoElement) => set({ videoElement }),
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  currentTime: 0,
  setCurrentTime: (currentTime) => set({ currentTime }),
  duration: 0,
  setDuration: (duration) => set({ duration }),
  
  isComparing: false,
  toggleCompare: (value) => {
    const { canvas, history, isComparing, historyIndex } = get();
    if (!canvas || history.length === 0) return;
    
    if (value && !isComparing) {
      // Show original
      const originalState = history[0].canvasState;
      canvas.loadFromJSON(originalState).then(() => {
        canvas.renderAll();
        set({ isComparing: true });
      }).catch(err => {
        console.error('Compare Error (Original):', err);
      });
    } else if (!value && isComparing) {
      // Show current
      const currentState = history[historyIndex].canvasState;
      canvas.loadFromJSON(currentState).then(() => {
        canvas.renderAll();
        set({ isComparing: false });
      }).catch(err => {
        console.error('Compare Error (Current):', err);
      });
    }
  },

  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  exposure: 0,
  shadows: 0,
  highlights: 0,
  warmth: 0,
  vignette: 0,
  grain: 0,
  dehaze: 0,
  vibrance: 0,
  setAdjustment: (key, value) => {
    set({ [key]: value });
    get().debouncedApplyFilters();
  },
  
  activeFilter: null,
  filterIntensity: 1,
  setActiveFilter: (filter) => {
    set({ activeFilter: filter });
    get().applyAllFilters();
    get().saveHistory();
  },
  setFilterIntensity: (intensity) => {
    set({ filterIntensity: intensity });
    get().debouncedApplyFilters();
  },
  
  activeTab: 'adjust',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  selectedObject: null,
  setSelectedObject: (obj) => set({ selectedObject: obj }),
  updateSelectedObject: (props) => {
    const { selectedObject, canvas } = get();
    if (selectedObject && canvas) {
      selectedObject.set(props);
      canvas.requestRenderAll();
      get().saveHistory();
      // Trigger re-render of properties panel
      set({ selectedObject: canvas.getActiveObject() });
    }
  },
  
  isDrawing: false,
  setIsDrawing: (isDrawing) => set({ isDrawing, isErasing: false }),
  isErasing: false,
  setIsErasing: (isErasing) => set({ isErasing, isDrawing: isErasing }),
  brushColor: '#ffffff',
  setBrushColor: (brushColor) => set({ brushColor }),
  brushSize: 5,
  setBrushSize: (brushSize) => set({ brushSize }),
  
  customFilters: [],
  saveCustomFilter: (name: string) => {
    const state = get();
    // Capture current state values to closure
    const {
      brightness, contrast, saturation, hue, exposure,
      shadows, highlights, warmth, vignette, grain, dehaze, vibrance
    } = state;

    const newFilter: FilterDef = {
      id: `custom-${Date.now()}`,
      name,
      category: 'Custom' as FilterCategory,
      createFilters: (i) => {
        const filters: fabric.filters.BaseFilter<any, any>[] = [];
        if (brightness !== 0) filters.push(new fabric.filters.Brightness({ brightness: brightness * i }));
        if (contrast !== 0) filters.push(new fabric.filters.Contrast({ contrast: contrast * i }));
        if (saturation !== 0) filters.push(new fabric.filters.Saturation({ saturation: saturation * i }));
        if (hue !== 0) filters.push(new fabric.filters.HueRotation({ rotation: hue * i }));
        if (exposure !== 0) {
          const g = Math.max(0.01, 1 + exposure * i);
          filters.push(new fabric.filters.Gamma({ gamma: [g, g, g] }));
        }
        if (shadows !== 0) {
          const g = Math.max(0.01, 1 + shadows * 0.5 * i);
          filters.push(new fabric.filters.Gamma({ gamma: [g, g, g] }));
        }
        if (highlights !== 0) filters.push(new fabric.filters.Brightness({ brightness: highlights * 0.2 * i }));
        if (warmth !== 0) {
          filters.push(new fabric.filters.ColorMatrix({
            matrix: [
              1 + warmth * 0.1 * i, 0, 0, 0, 0,
              0, 1 + warmth * 0.05 * i, 0, 0, 0,
              0, 0, 1 - warmth * 0.1 * i, 0, 0,
              0, 0, 0, 1, 0
            ]
          }));
        }
        if (vignette !== 0) {
          filters.push(new fabric.filters.ColorMatrix({
            matrix: [
              1 - vignette * 0.2 * i, 0, 0, 0, 0,
              0, 1 - vignette * 0.2 * i, 0, 0, 0,
              0, 0, 1 - vignette * 0.2 * i, 0, 0,
              0, 0, 0, 1, 0
            ]
          }));
        }
        if (grain !== 0) {
          filters.push(new fabric.filters.Noise({ noise: grain * 100 * i }));
        }
        if (dehaze !== 0) {
          filters.push(new fabric.filters.Contrast({ contrast: dehaze * 0.5 * i }));
          filters.push(new fabric.filters.Saturation({ saturation: dehaze * 0.5 * i }));
        }
        if (vibrance !== 0) {
          filters.push(new fabric.filters.Saturation({ saturation: vibrance * 0.5 * i }));
        }
        return filters;
      }
    };
    set({ customFilters: [...state.customFilters, newFilter] });
  },

  applyAllFilters: () => {
    const { 
      image, canvas, brightness, contrast, saturation, hue, exposure, 
      shadows, highlights, warmth, vignette, grain, dehaze, vibrance,
      activeFilter, filterIntensity, customFilters 
    } = get();
    if (!image || !canvas) return;

    const filters: fabric.filters.BaseFilter<any, any>[] = [];

    // 1. Basic Adjustments
    if (brightness !== 0) filters.push(new fabric.filters.Brightness({ brightness }));
    if (contrast !== 0) filters.push(new fabric.filters.Contrast({ contrast }));
    if (saturation !== 0) filters.push(new fabric.filters.Saturation({ saturation }));
    if (hue !== 0) filters.push(new fabric.filters.HueRotation({ rotation: hue }));
    if (exposure !== 0) {
      const g = Math.max(0.01, 1 + exposure);
      filters.push(new fabric.filters.Gamma({ gamma: [g, g, g] }));
    }
    
    // Advanced Adjustments
    if (shadows !== 0) {
      const g = Math.max(0.01, 1 + shadows * 0.5);
      filters.push(new fabric.filters.Gamma({ gamma: [g, g, g] }));
    }
    if (highlights !== 0) filters.push(new fabric.filters.Brightness({ brightness: highlights * 0.2 }));
    if (warmth !== 0) {
      filters.push(new fabric.filters.ColorMatrix({
        matrix: [
          1 + warmth * 0.1, 0, 0, 0, 0,
          0, 1 + warmth * 0.05, 0, 0, 0,
          0, 0, 1 - warmth * 0.1, 0, 0,
          0, 0, 0, 1, 0
        ]
      }));
    }

    // Lightroom Effects
    if (vignette !== 0) {
      // Simple vignette using ColorMatrix (darkening edges is hard with just matrix, but we can darken overall and then we'd need a mask)
      // Fabric has a Vignette filter in some versions, or we can simulate it
      filters.push(new fabric.filters.ColorMatrix({
        matrix: [
          1 - vignette * 0.2, 0, 0, 0, 0,
          0, 1 - vignette * 0.2, 0, 0, 0,
          0, 0, 1 - vignette * 0.2, 0, 0,
          0, 0, 0, 1, 0
        ]
      }));
    }
    if (grain !== 0) {
      filters.push(new fabric.filters.Noise({ noise: grain * 100 }));
    }
    if (dehaze !== 0) {
      filters.push(new fabric.filters.Contrast({ contrast: dehaze * 0.5 }));
      filters.push(new fabric.filters.Saturation({ saturation: dehaze * 0.3 }));
    }
    if (vibrance !== 0) {
      filters.push(new fabric.filters.Saturation({ saturation: vibrance * 0.5 }));
      // Vibrance is usually smarter than saturation, but fabric doesn't have a native one.
      // We'll simulate it with saturation for now.
    }

    // 2. Creative Filter
    if (activeFilter) {
      const allFilters = [...FILTERS, ...customFilters];
      const filterDef = allFilters.find((f) => f.id === activeFilter);
      if (filterDef) {
        filters.push(...filterDef.createFilters(filterIntensity));
      }
    }

    image.filters = filters;
    image.applyFilters();
    canvas.requestRenderAll();
  },

  debouncedApplyFilters: (() => {
    let timeout: NodeJS.Timeout | null = null;
    return () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const { applyAllFilters } = get();
        applyAllFilters();
      }, 16); // ~1 frame delay for responsiveness
    };
  })(),

  clearCanvas: () => {
    const { canvas } = get();
    if (!canvas) return;

    canvas.clear();
    canvas.set('backgroundColor', 'transparent');
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.renderAll();

    set({
      image: null,
      mainImageId: null,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hue: 0,
      exposure: 0,
      shadows: 0,
      highlights: 0,
      warmth: 0,
      vignette: 0,
      grain: 0,
      dehaze: 0,
      vibrance: 0,
      activeFilter: null,
      filterIntensity: 1,
      isCanvasEmpty: true,
      selectedObject: null,
      isDrawing: false,
      isErasing: false,
      isCropping: false,
      videoElement: null,
      isPlaying: false,
      currentTime: 0,
      history: [],
      historyIndex: -1,
      activeTab: 'adjust',
      images: [],
    });
  },
  
  resetToOriginal: () => {
    const { history, jumpToHistory } = get();
    if (history.length > 0) {
      jumpToHistory(0);
    }
  },

  removeMainImage: () => {
    const { canvas, image } = get();
    if (canvas && image) {
      canvas.remove(image);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      set({
        image: null,
        mainImageId: null,
        brightness: 0,
        contrast: 0,
        saturation: 0,
        hue: 0,
        exposure: 0,
        shadows: 0,
        highlights: 0,
        warmth: 0,
        vignette: 0,
        grain: 0,
        dehaze: 0,
        vibrance: 0,
        activeFilter: null,
        filterIntensity: 1,
      });
      get().saveHistory();
    }
  },

  history: [],
  historyIndex: -1,
  isCanvasEmpty: true,
  saveHistory: () => {
    const state = get();
    if (!state.canvas) return;

    const objects = state.canvas.getObjects();
    const isCanvasEmpty = objects.length === 0;

    // Include 'id' and other custom properties in the JSON
    const canvasState = state.canvas.toObject(['id', 'selectable', 'evented', 'isMainImage']);
    
    const adjustments = {
      brightness: state.brightness,
      contrast: state.contrast,
      saturation: state.saturation,
      hue: state.hue,
      exposure: state.exposure,
      shadows: state.shadows,
      highlights: state.highlights,
      warmth: state.warmth,
      vignette: state.vignette,
      grain: state.grain,
      dehaze: state.dehaze,
      vibrance: state.vibrance,
      activeFilter: state.activeFilter,
      filterIntensity: state.filterIntensity,
    };
    
    const historyItem = {
      canvasState,
      adjustments,
      timestamp: Date.now(),
      actionName: state.historyIndex === -1 ? 'Original' : `Action ${state.history.length}`
    };

    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(historyItem);
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isCanvasEmpty
    });
  },
  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const prevState = history[newIndex];
    
    canvas.loadFromJSON(prevState.canvasState).then(() => {
      const objects = canvas.getObjects();
      const isCanvasEmpty = objects.length === 0;
      
      // Try to recover the active image reference
      const activeObject = canvas.getActiveObject() as fabric.FabricImage;
      
      set({
        ...prevState.adjustments,
        historyIndex: newIndex,
        isCanvasEmpty,
        image: activeObject && activeObject instanceof fabric.FabricImage ? activeObject : null
      });
      canvas.renderAll();
    }).catch(err => {
      console.error('Undo Error:', err);
    });
  },
  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const nextState = history[newIndex];
    
    canvas.loadFromJSON(nextState.canvasState).then(() => {
      const objects = canvas.getObjects();
      const isCanvasEmpty = objects.length === 0;
      
      const activeObject = canvas.getActiveObject() as fabric.FabricImage;

      set({
        ...nextState.adjustments,
        historyIndex: newIndex,
        isCanvasEmpty,
        image: activeObject && activeObject instanceof fabric.FabricImage ? activeObject : null
      });
      canvas.renderAll();
    }).catch(err => {
      console.error('Redo Error:', err);
    });
  },
  jumpToHistory: (index: number) => {
    const { canvas, history } = get();
    if (!canvas || index < 0 || index >= history.length) return;
    
    const targetState = history[index];
    canvas.loadFromJSON(targetState.canvasState).then(() => {
      const objects = canvas.getObjects();
      const isCanvasEmpty = objects.length === 0;
      
      const activeObject = canvas.getActiveObject() as fabric.FabricImage;

      set({
        ...targetState.adjustments,
        historyIndex: index,
        isCanvasEmpty,
        image: activeObject && activeObject instanceof fabric.FabricImage ? activeObject : null
      });
      canvas.renderAll();
    }).catch(err => {
      console.error('Jump to History Error:', err);
    });
  }
}));
