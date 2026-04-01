import * as fabric from 'fabric';

// Gradient Map Filter
export class GradientMapFilter extends fabric.filters.BaseFilter<any, any, any> {
  static type = 'GradientMap';
  colors: string[];

  constructor(options: { colors: string[] }) {
    super(options);
    this.colors = options.colors || ['#000000', '#ffffff'];
  }

  applyTo2d(options: { canvasEl: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData }) {
    const imageData = options.imageData;
    const data = imageData.data;
    const len = data.length;

    // Simple grayscale to gradient mapping
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Map gray (0-255) to color index
      const colorIndex = Math.floor((gray / 255) * (this.colors.length - 1));
      const color = this.hexToRgb(this.colors[colorIndex]);
      
      data[i] = color.r;
      data[i + 1] = color.g;
      data[i + 2] = color.b;
    }
  }

  private hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  toObject() {
    return {
      type: GradientMapFilter.type,
      colors: this.colors
    };
  }

  static async fromObject(object: any) {
    return new GradientMapFilter(object);
  }
}

// Split Toning Filter
export class SplitToningFilter extends fabric.filters.BaseFilter<any, any, any> {
  static type = 'SplitToning';
  shadows: string;
  highlights: string;

  constructor(options: { shadows: string; highlights: string }) {
    super(options);
    this.shadows = options.shadows || '#000000';
    this.highlights = options.highlights || '#ffffff';
  }

  applyTo2d(options: { canvasEl: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData }) {
    const imageData = options.imageData;
    const data = imageData.data;
    const len = data.length;
    const shadows = this.hexToRgb(this.shadows);
    const highlights = this.hexToRgb(this.highlights);

    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Apply shadows to dark areas, highlights to light areas
      const shadowFactor = 1 - (gray / 255);
      const highlightFactor = gray / 255;
      
      data[i] = r * shadowFactor + shadows.r * (1 - shadowFactor) + highlights.r * highlightFactor;
      data[i + 1] = g * shadowFactor + shadows.g * (1 - shadowFactor) + highlights.g * highlightFactor;
      data[i + 2] = b * shadowFactor + shadows.b * (1 - shadowFactor) + highlights.b * highlightFactor;
    }
  }

  private hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  toObject() {
    return {
      type: SplitToningFilter.type,
      shadows: this.shadows,
      highlights: this.highlights
    };
  }

  static async fromObject(object: any) {
    return new SplitToningFilter(object);
  }
}

// Pixelate Filter
export class PixelateFilter extends fabric.filters.BaseFilter<any, any, any> {
  static type = 'Pixelate';
  blockSize: number;

  constructor(options: { blockSize?: number } = {}) {
    super(options);
    this.blockSize = options.blockSize || 4;
  }

  applyTo2d(options: { canvasEl: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData }) {
    const imageData = options.imageData;
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;
    const size = Math.max(1, Math.floor(this.blockSize));

    for (let y = 0; y < h; y += size) {
      for (let x = 0; x < w; x += size) {
        const i = (y * w + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        for (let py = 0; py < size && y + py < h; py++) {
          for (let px = 0; px < size && x + px < w; px++) {
            const pi = ((y + py) * w + (x + px)) * 4;
            data[pi] = r;
            data[pi + 1] = g;
            data[pi + 2] = b;
            data[pi + 3] = a;
          }
        }
      }
    }
  }

  toObject() {
    return {
      type: PixelateFilter.type,
      blockSize: this.blockSize
    };
  }

  static async fromObject(object: any) {
    return new PixelateFilter(object);
  }
}

// Chromatic Aberration Filter
export class ChromaticAberrationFilter extends fabric.filters.BaseFilter<any, any, any> {
  static type = 'ChromaticAberration';
  offset: number;

  constructor(options: { offset?: number } = {}) {
    super(options);
    this.offset = options.offset || 5;
  }

  applyTo2d(options: { canvasEl: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData }) {
    const imageData = options.imageData;
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;
    const offset = Math.floor(this.offset);
    const newData = new Uint8ClampedArray(data);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        
        // Red channel offset left
        if (x - offset >= 0 && x - offset < w) {
          const ri = (y * w + (x - offset)) * 4;
          data[i] = newData[ri];
        }
        
        // Blue channel offset right
        if (x + offset >= 0 && x + offset < w) {
          const bi = (y * w + (x + offset)) * 4;
          data[i + 2] = newData[bi + 2];
        }
        
        // Green stays same
      }
    }
  }

  toObject() {
    return {
      type: ChromaticAberrationFilter.type,
      offset: this.offset
    };
  }

  static async fromObject(object: any) {
    return new ChromaticAberrationFilter(object);
  }
}

// Duotone Filter
export class DuotoneFilter extends fabric.filters.BaseFilter<any, any, any> {
  static type = 'Duotone';
  light: string;
  dark: string;

  constructor(options: { light?: string; dark?: string } = {}) {
    super(options);
    this.light = options.light || '#ffffff';
    this.dark = options.dark || '#000000';
  }

  applyTo2d(options: { canvasEl: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData }) {
    const imageData = options.imageData;
    const data = imageData.data;
    const len = data.length;
    const light = this.hexToRgb(this.light);
    const dark = this.hexToRgb(this.dark);

    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      data[i] = dark.r + gray * (light.r - dark.r);
      data[i + 1] = dark.g + gray * (light.g - dark.g);
      data[i + 2] = dark.b + gray * (light.b - dark.b);
    }
  }

  private hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  toObject() {
    return {
      type: DuotoneFilter.type,
      light: this.light,
      dark: this.dark
    };
  }

  static async fromObject(object: any) {
    return new DuotoneFilter(object);
  }
}

// Pop Art Filter (4-quadrant duotone)
export class PopArtFilter extends fabric.filters.BaseFilter<any, any, any> {
  static type = 'PopArt';

  applyTo2d(options: { canvasEl: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData }) {
    const imageData = options.imageData;
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;
    const midX = Math.floor(w / 2);
    const midY = Math.floor(h / 2);

    const colors = [
      { dark: { r: 255, g: 0, b: 0 }, light: { r: 255, g: 255, b: 0 } }, // Red/Yellow
      { dark: { r: 0, g: 0, b: 255 }, light: { r: 0, g: 255, b: 255 } }, // Blue/Cyan
      { dark: { r: 0, g: 255, b: 0 }, light: { r: 255, g: 0, b: 255 } }, // Green/Magenta
      { dark: { r: 255, g: 128, b: 0 }, light: { r: 255, g: 255, b: 255 } } // Orange/White
    ];

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        let quadrant = 0;
        if (x >= midX && y < midY) quadrant = 1;
        else if (x < midX && y >= midY) quadrant = 2;
        else if (x >= midX && y >= midY) quadrant = 3;
        
        const color = colors[quadrant];
        data[i] = color.dark.r + gray * (color.light.r - color.dark.r);
        data[i + 1] = color.dark.g + gray * (color.light.g - color.dark.g);
        data[i + 2] = color.dark.b + gray * (color.light.b - color.dark.b);
      }
    }
  }

  toObject() {
    return {
      type: PopArtFilter.type
    };
  }

  static async fromObject(object: any) {
    return new PopArtFilter();
  }
}

// Halftone Filter
export class HalftoneFilter extends fabric.filters.BaseFilter<any, any, any> {
  static type = 'Halftone';
  size: number;

  constructor(options: { size?: number } = {}) {
    super(options);
    this.size = options.size || 4;
  }

  applyTo2d(options: { canvasEl: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData }) {
    const imageData = options.imageData;
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;
    const size = Math.max(1, Math.floor(this.size));

    for (let y = 0; y < h; y += size) {
      for (let x = 0; x < w; x += size) {
        let totalGray = 0;
        let count = 0;

        for (let py = 0; py < size && y + py < h; py++) {
          for (let px = 0; px < size && x + px < w; px++) {
            const i = ((y + py) * w + (x + px)) * 4;
            totalGray += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            count++;
          }
        }

        const avgGray = totalGray / count;
        const radius = (size / 2) * (1 - avgGray / 255);

        for (let py = 0; py < size && y + py < h; py++) {
          for (let px = 0; px < size && x + px < w; px++) {
            const i = ((y + py) * w + (x + px)) * 4;
            const dx = px - size / 2;
            const dy = py - size / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius) {
              data[i] = 0;
              data[i + 1] = 0;
              data[i + 2] = 0;
            } else {
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
            }
          }
        }
      }
    }
  }

  toObject() {
    return {
      type: HalftoneFilter.type,
      size: this.size
    };
  }

  static async fromObject(object: any) {
    return new HalftoneFilter(object);
  }
}

// Vignette Filter
export class VignetteFilter extends fabric.filters.BaseFilter<any, any, any> {
  static type = 'Vignette';
  amount: number;

  constructor(options: { amount?: number } = {}) {
    super(options);
    this.amount = options.amount || 0.5;
  }

  applyTo2d(options: { canvasEl: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData }) {
    const imageData = options.imageData;
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;
    const centerX = w / 2;
    const centerY = h / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ratio = dist / maxDist;
        const vignette = 1 - (ratio * this.amount);
        
        data[i] *= vignette;
        data[i + 1] *= vignette;
        data[i + 2] *= vignette;
      }
    }
  }

  toObject() {
    return {
      type: VignetteFilter.type,
      amount: this.amount
    };
  }

  static async fromObject(object: any) {
    return new VignetteFilter(object);
  }
}

// Glitch Filter
export class GlitchFilter extends fabric.filters.BaseFilter<any, any, any> {
  static type = 'Glitch';
  amount: number;

  constructor(options: { amount?: number } = {}) {
    super(options);
    this.amount = options.amount || 0.5;
  }

  applyTo2d(options: { canvasEl: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData }) {
    const imageData = options.imageData;
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;
    const amount = this.amount;
    const newData = new Uint8ClampedArray(data);

    for (let y = 0; y < h; y++) {
      // Random horizontal shift for some rows
      const shift = Math.random() < 0.05 * amount ? (Math.random() - 0.5) * 20 * amount : 0;
      
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        let sx = Math.floor(x + shift);
        sx = Math.max(0, Math.min(w - 1, sx));
        const si = (y * w + sx) * 4;
        
        data[i] = newData[si];
        data[i + 1] = newData[si + 1];
        data[i + 2] = newData[si + 2];
        
        // Random color channel swap
        if (Math.random() < 0.001 * amount) {
          data[i] = newData[si + 1];
          data[i + 1] = newData[si + 2];
          data[i + 2] = newData[si];
        }
      }
    }
  }

  toObject() {
    return {
      type: GlitchFilter.type,
      amount: this.amount
    };
  }

  static async fromObject(object: any) {
    return new GlitchFilter(object);
  }
}

// Bloom Filter (Simplified)
export class BloomFilter extends fabric.filters.BaseFilter<any, any, any> {
  static type = 'Bloom';
  threshold: number;
  amount: number;

  constructor(options: { threshold?: number; amount?: number } = {}) {
    super(options);
    this.threshold = options.threshold || 0.5;
    this.amount = options.amount || 0.5;
  }

  applyTo2d(options: { canvasEl: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData }) {
    const imageData = options.imageData;
    const data = imageData.data;
    const len = data.length;
    const threshold = this.threshold * 255;
    const amount = this.amount;

    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      if (brightness > threshold) {
        const boost = (brightness - threshold) / (255 - threshold) * amount;
        data[i] = Math.min(255, r + 255 * boost);
        data[i + 1] = Math.min(255, g + 255 * boost);
        data[i + 2] = Math.min(255, b + 255 * boost);
      }
    }
  }

  toObject() {
    return {
      type: BloomFilter.type,
      threshold: this.threshold,
      amount: this.amount
    };
  }

  static async fromObject(object: any) {
    return new BloomFilter(object);
  }
}

// Register filters
const registerFilter = (name: string, filterClass: any) => {
  // Add to fabric.filters for backward compatibility and to avoid "not extensible" errors
  // if we can't use classRegistry
  try {
    (fabric.filters as any)[name] = filterClass;
  } catch (e) {
    console.warn(`Could not add ${name} to fabric.filters:`, e);
  }

  // Use classRegistry for Fabric v6+
  const registry = (fabric as any).classRegistry;
  if (registry) {
    if (typeof registry.register === 'function') {
      registry.register(filterClass);
    } else if (typeof registry.setClass === 'function') {
      registry.setClass(name, filterClass);
    } else if (typeof registry.add === 'function') {
      registry.add(filterClass);
    }
  }
};

registerFilter('GradientMap', GradientMapFilter);
registerFilter('SplitToning', SplitToningFilter);
registerFilter('Pixelate', PixelateFilter);
registerFilter('ChromaticAberration', ChromaticAberrationFilter);
registerFilter('Duotone', DuotoneFilter);
registerFilter('PopArt', PopArtFilter);
registerFilter('Halftone', HalftoneFilter);
registerFilter('Vignette', VignetteFilter);
registerFilter('Glitch', GlitchFilter);
registerFilter('Bloom', BloomFilter);
