import * as fabric from 'fabric';
import { 
  GradientMapFilter, 
  SplitToningFilter, 
  PixelateFilter, 
  ChromaticAberrationFilter, 
  DuotoneFilter, 
  PopArtFilter, 
  HalftoneFilter,
  VignetteFilter,
  GlitchFilter,
  BloomFilter
} from './customFilters';

export type FilterCategory = 'Cinematic' | 'Vintage' | 'Color Mood' | 'Artistic' | 'Modern Social' | 'Special Effects' | 'Custom' | 'Winter' | 'Spring' | 'Summer' | 'Autumn' | 'Warm' | 'Holiday' | 'Christmas' | 'Glitch' | 'Retro' | 'Duotone' | 'Pop Art' | 'Comic' | 'Sparkle' | 'Festive';

export interface FilterDef {
  id: string;
  name: string;
  category: FilterCategory;
  createFilters: (intensity: number) => fabric.filters.BaseFilter<any, any>[];
  texture?: string;
  blendMode?: string;
}

export const FILTERS: FilterDef[] = [
  {
    id: 'film-noir',
    name: 'Film Noir',
    category: 'Cinematic',
    createFilters: (i) => [
      new fabric.filters.Grayscale(),
      new fabric.filters.Contrast({ contrast: 0.3 * i }),
      new fabric.filters.Noise({ noise: 40 * i })
    ]
  },
  {
    id: 'hollywood',
    name: 'Hollywood',
    category: 'Cinematic',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#f5deb3', mode: 'multiply', alpha: 0.3 * i }),
      new fabric.filters.Contrast({ contrast: 0.1 * i })
    ]
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    category: 'Cinematic',
    createFilters: (i) => [
      new fabric.filters.ColorMatrix({
        matrix: [
          1.5, 0, 0, 0, 0,
          0, 0.5, 0, 0, 0,
          0, 0, 1.5, 0, 0,
          0, 0, 0, 1, 0
        ]
      }),
      new fabric.filters.Saturation({ saturation: 0.5 * i }),
      new fabric.filters.Contrast({ contrast: 0.2 * i })
    ]
  },
  {
    id: 'teal-orange',
    name: 'Teal & Orange',
    category: 'Cinematic',
    createFilters: (i) => [
      new fabric.filters.ColorMatrix({
        matrix: [
          1.2, 0, 0, 0, 0,
          0, 1.1, 0, 0, 0,
          0, 0, 0.8, 0, 0,
          0, 0, 0, 1, 0
        ]
      }),
      new fabric.filters.Contrast({ contrast: 0.1 * i })
    ]
  },
  {
    id: 'sepia',
    name: 'Sepia Classic',
    category: 'Vintage',
    createFilters: (i) => [
      new fabric.filters.Sepia()
    ]
  },
  {
    id: 'old-film',
    name: 'Old Film',
    category: 'Vintage',
    createFilters: (i) => [
      new fabric.filters.Sepia(),
      new fabric.filters.Noise({ noise: 50 * i }),
      new fabric.filters.Contrast({ contrast: -0.1 * i })
    ]
  },
  {
    id: 'warm-sunset',
    name: 'Warm Sunset',
    category: 'Color Mood',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#ff8c00', mode: 'overlay', alpha: 0.4 * i })
    ]
  },
  {
    id: 'cool-blue',
    name: 'Cool Blue',
    category: 'Color Mood',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#0000ff', mode: 'overlay', alpha: 0.2 * i })
    ]
  },
  {
    id: 'sketch',
    name: 'Sketch',
    category: 'Artistic',
    createFilters: (i) => [
      new fabric.filters.Convolute({
        matrix: [
          -1, -1, -1,
          -1,  8, -1,
          -1, -1, -1
        ]
      }),
      new fabric.filters.Grayscale()
    ]
  },
  {
    id: 'vsco',
    name: 'VSCO Minimal',
    category: 'Modern Social',
    createFilters: (i) => [
      new fabric.filters.Saturation({ saturation: -0.2 * i }),
      new fabric.filters.Contrast({ contrast: -0.1 * i }),
      new fabric.filters.Brightness({ brightness: 0.05 * i })
    ]
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    category: 'Spring',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#ffc0cb', mode: 'overlay', alpha: 0.3 * i }),
      new fabric.filters.Brightness({ brightness: 0.05 * i }),
      new fabric.filters.Saturation({ saturation: 0.1 * i })
    ]
  },
  {
    id: 'morning-dew',
    name: 'Morning Dew',
    category: 'Spring',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#e0f2f1', mode: 'screen', alpha: 0.2 * i }),
      new fabric.filters.Contrast({ contrast: 0.1 * i }),
      new fabric.filters.Saturation({ saturation: 0.2 * i })
    ]
  },
  {
    id: 'beach-day',
    name: 'Beach Day',
    category: 'Summer',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#00bcd4', mode: 'overlay', alpha: 0.2 * i }),
      new fabric.filters.Brightness({ brightness: 0.1 * i }),
      new fabric.filters.Saturation({ saturation: 0.4 * i })
    ]
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    category: 'Summer',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#ffa000', mode: 'overlay', alpha: 0.4 * i }),
      new fabric.filters.Brightness({ brightness: 0.05 * i }),
      new fabric.filters.Contrast({ contrast: 0.1 * i })
    ]
  },
  {
    id: 'misty-forest',
    name: 'Misty Forest',
    category: 'Autumn',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#4e342e', mode: 'multiply', alpha: 0.3 * i }),
      new fabric.filters.Brightness({ brightness: -0.1 * i }),
      new fabric.filters.Blur({ blur: 0.1 * i })
    ]
  },
  {
    id: 'pumpkin-spice',
    name: 'Pumpkin Spice',
    category: 'Autumn',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#ef6c00', mode: 'overlay', alpha: 0.3 * i }),
      new fabric.filters.Saturation({ saturation: 0.2 * i }),
      new fabric.filters.Contrast({ contrast: 0.1 * i })
    ]
  },
  {
    id: 'candlelight',
    name: 'Candlelight',
    category: 'Warm',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#ff8f00', mode: 'overlay', alpha: 0.5 * i }),
      new fabric.filters.Brightness({ brightness: -0.05 * i }),
      new fabric.filters.Contrast({ contrast: -0.1 * i })
    ]
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    category: 'Warm',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#bf360c', mode: 'multiply', alpha: 0.2 * i })
    ]
  },
  {
    id: 'christmas-tree',
    name: 'Christmas Tree',
    category: 'Holiday',
    createFilters: (i) => [
      new fabric.filters.ColorMatrix({
        matrix: [
          0.8, 0, 0, 0, 0,
          0, 1.5, 0, 0, 0,
          0, 0, 0.8, 0, 0,
          0, 0, 0, 1, 0
        ]
      }),
      new fabric.filters.Saturation({ saturation: 0.2 * i })
    ]
  },
  {
    id: 'mistletoe',
    name: 'Mistletoe',
    category: 'Holiday',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#2e7d32', mode: 'overlay', alpha: 0.3 * i }),
      new fabric.filters.Contrast({ contrast: 0.1 * i })
    ]
  },
  {
    id: 'diamond-dust',
    name: 'Diamond Dust',
    category: 'Sparkle',
    createFilters: (i) => [
      new fabric.filters.Brightness({ brightness: 0.3 * i }),
      new fabric.filters.Noise({ noise: 30 * i }),
      new fabric.filters.Contrast({ contrast: 0.2 * i })
    ]
  },
  {
    id: 'starlight',
    name: 'Starlight',
    category: 'Sparkle',
    createFilters: (i) => [
      new fabric.filters.Brightness({ brightness: 0.1 * i }),
      new fabric.filters.BlendColor({ color: '#ffffff', mode: 'screen', alpha: 0.4 * i })
    ]
  },
  {
    id: 'party-lights',
    name: 'Party Lights',
    category: 'Festive',
    createFilters: (i) => [
      new GradientMapFilter({ colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'] })
    ]
  },
  {
    id: 'confetti',
    name: 'Confetti',
    category: 'Festive',
    createFilters: (i) => [
      new fabric.filters.Noise({ noise: 150 * i }),
      new fabric.filters.Saturation({ saturation: 0.5 * i })
    ]
  },
  {
    id: 'spring-bloom',
    name: 'Spring Bloom',
    category: 'Spring',
    createFilters: (i) => [
      new fabric.filters.Saturation({ saturation: 0.2 * i }),
      new fabric.filters.Brightness({ brightness: 0.05 * i }),
      new fabric.filters.BlendColor({ color: '#ffb6c1', mode: 'overlay', alpha: 0.1 * i })
    ]
  },
  {
    id: 'summer-vibe',
    name: 'Summer Vibe',
    category: 'Summer',
    createFilters: (i) => [
      new fabric.filters.Saturation({ saturation: 0.3 * i }),
      new fabric.filters.Contrast({ contrast: 0.1 * i }),
      new fabric.filters.BlendColor({ color: '#ffd700', mode: 'overlay', alpha: 0.2 * i })
    ]
  },
  {
    id: 'autumn-gold',
    name: 'Autumn Gold',
    category: 'Autumn',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#d2691e', mode: 'multiply', alpha: 0.2 * i }),
      new fabric.filters.Contrast({ contrast: 0.1 * i })
    ]
  },
  {
    id: 'frosty-morning',
    name: 'Frosty Morning',
    category: 'Winter',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#e0f7fa', mode: 'overlay', alpha: 0.4 * i }),
      new fabric.filters.Brightness({ brightness: 0.1 * i }),
      new fabric.filters.Saturation({ saturation: -0.2 * i })
    ]
  },
  {
    id: 'ice-crystal',
    name: 'Ice Crystal',
    category: 'Winter',
    createFilters: (i) => [
      new fabric.filters.Contrast({ contrast: 0.3 * i }),
      new fabric.filters.Brightness({ brightness: 0.05 * i }),
      new fabric.filters.ColorMatrix({
        matrix: [
          1, 0, 0, 0, 0,
          0, 1.1, 0, 0, 0,
          0, 0, 1.5, 0, 0,
          0, 0, 0, 1, 0
        ]
      })
    ]
  },
  {
    id: 'aurora',
    name: 'Northern Lights',
    category: 'Winter',
    createFilters: (i) => [
      new GradientMapFilter({ colors: ['#000033', '#00ff00', '#9900ff'] })
    ]
  },
  {
    id: 'winter-solstice',
    name: 'Winter Solstice',
    category: 'Winter',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#1a237e', mode: 'multiply', alpha: 0.3 * i }),
      new fabric.filters.Contrast({ contrast: 0.2 * i }),
      new fabric.filters.Brightness({ brightness: -0.1 * i })
    ]
  },
  {
    id: 'blizzard',
    name: 'Blizzard',
    category: 'Winter',
    createFilters: (i) => [
      new fabric.filters.Noise({ noise: 100 * i }),
      new fabric.filters.BlendColor({ color: '#ffffff', mode: 'screen', alpha: 0.3 * i }),
      new fabric.filters.Contrast({ contrast: -0.2 * i })
    ]
  },
  {
    id: 'snow-glow',
    name: 'Snow Glow',
    category: 'Winter',
    createFilters: (i) => [
      new fabric.filters.Brightness({ brightness: 0.1 * i }),
      new fabric.filters.Contrast({ contrast: 0.05 * i }),
      new fabric.filters.BlendColor({ color: '#ffffff', mode: 'screen', alpha: 0.2 * i })
    ]
  },
  {
    id: 'cozy-indoor',
    name: 'Cozy Indoor',
    category: 'Warm',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#ffcc00', mode: 'overlay', alpha: 0.3 * i }),
      new fabric.filters.Contrast({ contrast: -0.1 * i })
    ]
  },
  {
    id: 'candy-cane',
    name: 'Candy Cane',
    category: 'Holiday',
    createFilters: (i) => [
      new fabric.filters.ColorMatrix({
        matrix: [
          1.5, 0, 0, 0, 0,
          0, 0.8, 0, 0, 0,
          0, 0, 0.8, 0, 0,
          0, 0, 0, 1, 0
        ]
      })
    ]
  },
  {
    id: 'sparkle',
    name: 'Sparkle',
    category: 'Sparkle',
    createFilters: (i) => [
      new fabric.filters.Brightness({ brightness: 0.2 * i }),
      new fabric.filters.Contrast({ contrast: 0.1 * i })
    ]
  },
  {
    id: 'festive-bright',
    name: 'Festive Bright',
    category: 'Festive',
    createFilters: (i) => [
      new fabric.filters.Saturation({ saturation: 0.3 * i }),
      new fabric.filters.Brightness({ brightness: 0.1 * i })
    ]
  },
  {
    id: 'gradient-map',
    name: 'Gradient Map',
    category: 'Artistic',
    createFilters: (i) => [
      new GradientMapFilter({ colors: ['#0000ff', '#ff0000'] })
    ]
  },
  {
    id: 'split-toning',
    name: 'Split Toning',
    category: 'Color Mood',
    createFilters: (i) => [
      new SplitToningFilter({ shadows: '#0000ff', highlights: '#ff0000' })
    ]
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    category: 'Artistic',
    createFilters: (i) => [
      new fabric.filters.Grayscale()
    ]
  },
  {
    id: 'invert',
    name: 'Invert',
    category: 'Artistic',
    createFilters: (i) => [
      new fabric.filters.Invert()
    ]
  },
  {
    id: 'christmas-glow',
    name: 'Christmas Glow',
    category: 'Christmas',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#ff0000', mode: 'overlay', alpha: 0.2 * i }),
      new fabric.filters.Brightness({ brightness: 0.1 * i }),
      new fabric.filters.Saturation({ saturation: 0.3 * i })
    ]
  },
  {
    id: 'winter-wonderland',
    name: 'Winter Wonderland',
    category: 'Christmas',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#e0f7fa', mode: 'screen', alpha: 0.3 * i }),
      new fabric.filters.Contrast({ contrast: 0.2 * i }),
      new fabric.filters.Saturation({ saturation: -0.1 * i })
    ]
  },
  {
    id: 'candy-cane-vibe',
    name: 'Candy Cane',
    category: 'Christmas',
    createFilters: (i) => [
      new fabric.filters.ColorMatrix({
        matrix: [
          1.4, 0, 0, 0, 0,
          0, 0.9, 0, 0, 0,
          0, 0, 0.9, 0, 0,
          0, 0, 0, 1, 0
        ]
      }),
      new fabric.filters.Contrast({ contrast: 0.1 * i })
    ]
  },
  {
    id: 'mistletoe-magic',
    name: 'Mistletoe Magic',
    category: 'Christmas',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#2e7d32', mode: 'overlay', alpha: 0.3 * i }),
      new fabric.filters.Saturation({ saturation: 0.2 * i })
    ]
  },
  {
    id: 'pixelate',
    name: 'Pixel Art',
    category: 'Retro',
    createFilters: (i) => [
      new PixelateFilter({ blockSize: 4 + 12 * i })
    ]
  },
  {
    id: 'gameboy',
    name: 'Game Boy',
    category: 'Retro',
    createFilters: (i) => [
      new fabric.filters.Grayscale(),
      new GradientMapFilter({ colors: ['#081820', '#346856', '#88c070', '#e0f8d0'] }),
      new PixelateFilter({ blockSize: 4 * i })
    ]
  },
  {
    id: 'chromatic',
    name: 'Chromatic',
    category: 'Glitch',
    createFilters: (i) => [
      new ChromaticAberrationFilter({ offset: 2 + 10 * i })
    ]
  },
  {
    id: 'vhs-glitch',
    name: 'VHS Glitch',
    category: 'Glitch',
    createFilters: (i) => [
      new ChromaticAberrationFilter({ offset: 5 * i }),
      new fabric.filters.Noise({ noise: 50 * i }),
      new fabric.filters.Contrast({ contrast: 0.1 * i })
    ]
  },
  {
    id: 'duotone-red',
    name: 'Red & Black',
    category: 'Duotone',
    createFilters: (i) => [
      new DuotoneFilter({ dark: '#000000', light: '#ff0000' })
    ]
  },
  {
    id: 'duotone-blue',
    name: 'Blue & White',
    category: 'Duotone',
    createFilters: (i) => [
      new DuotoneFilter({ dark: '#0000ff', light: '#ffffff' })
    ]
  },
  {
    id: 'duotone-purple',
    name: 'Purple & Gold',
    category: 'Duotone',
    createFilters: (i) => [
      new DuotoneFilter({ dark: '#4b0082', light: '#ffd700' })
    ]
  },
  {
    id: 'pop-art',
    name: 'Andy Warhol',
    category: 'Pop Art',
    createFilters: (i) => [
      new PopArtFilter()
    ]
  },
  {
    id: 'halftone',
    name: 'Comic Halftone',
    category: 'Comic',
    createFilters: (i) => [
      new HalftoneFilter({ size: 4 + 8 * i })
    ]
  },
  {
    id: 'comic-book',
    name: 'Comic Book',
    category: 'Comic',
    createFilters: (i) => [
      new fabric.filters.Contrast({ contrast: 0.5 * i }),
      new fabric.filters.Saturation({ saturation: 0.5 * i }),
      new HalftoneFilter({ size: 4 * i })
    ]
  },
  {
    id: 'blur',
    name: 'Blur Background',
    category: 'Special Effects',
    createFilters: (i) => [
      new fabric.filters.Blur({ blur: 0.5 * i })
    ]
  },
  {
    id: 'vignette',
    name: 'Vignette',
    category: 'Special Effects',
    createFilters: (i) => [
      new VignetteFilter({ amount: 0.8 * i })
    ]
  },
  {
    id: 'glitch-art',
    name: 'Glitch Art',
    category: 'Glitch',
    createFilters: (i) => [
      new GlitchFilter({ amount: i }),
      new ChromaticAberrationFilter({ offset: 10 * i })
    ]
  },
  {
    id: 'bloom-glow',
    name: 'Bloom Glow',
    category: 'Special Effects',
    createFilters: (i) => [
      new BloomFilter({ threshold: 0.4, amount: i })
    ]
  },
  {
    id: 'neon-night',
    name: 'Neon Night',
    category: 'Modern Social',
    createFilters: (i) => [
      new fabric.filters.ColorMatrix({
        matrix: [
          1.5, 0, 0, 0, 0,
          0, 0.5, 0, 0, 0,
          0, 0, 1.5, 0, 0,
          0, 0, 0, 1, 0
        ]
      }),
      new BloomFilter({ threshold: 0.3, amount: 0.5 * i }),
      new fabric.filters.Contrast({ contrast: 0.2 * i })
    ]
  },
  {
    id: 'dreamy-pastel',
    name: 'Dreamy Pastel',
    category: 'Color Mood',
    createFilters: (i) => [
      new fabric.filters.BlendColor({ color: '#ffecf2', mode: 'screen', alpha: 0.4 * i }),
      new BloomFilter({ threshold: 0.5, amount: 0.3 * i }),
      new fabric.filters.Saturation({ saturation: -0.1 * i })
    ]
  },
  {
    id: 'noir-glitch',
    name: 'Noir Glitch',
    category: 'Glitch',
    createFilters: (i) => [
      new fabric.filters.Grayscale(),
      new GlitchFilter({ amount: 0.5 * i }),
      new fabric.filters.Contrast({ contrast: 0.4 * i })
    ]
  },
  {
    id: 'retro-arcade',
    name: 'Retro Arcade',
    category: 'Retro',
    createFilters: (i) => [
      new PixelateFilter({ blockSize: 6 * i }),
      new fabric.filters.Contrast({ contrast: 0.3 * i }),
      new fabric.filters.Saturation({ saturation: 0.4 * i })
    ]
  }
];
