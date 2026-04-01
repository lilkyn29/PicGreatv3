import React, { useState, useMemo } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { FILTERS, FilterCategory } from '../../lib/filters';
import { Check, Plus, ImageIcon, Filter, Snowflake, Layers, History } from 'lucide-react';
import { LayersPanel } from '../layers/LayersPanel';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES: FilterCategory[] = [
  'Cinematic',
  'Vintage',
  'Color Mood',
  'Artistic',
  'Modern Social',
  'Special Effects',
  'Custom',
  'Spring',
  'Summer',
  'Autumn',
  'Winter',
  'Warm',
  'Holiday',
  'Christmas',
  'Glitch',
  'Retro',
  'Duotone',
  'Pop Art',
  'Comic',
  'Sparkle',
  'Festive'
];

export function SidebarRight() {
  const {
    activeFilter,
    filterIntensity,
    setActiveFilter,
    setFilterIntensity,
    customFilters,
    saveCustomFilter,
    image,
    history,
    historyIndex,
    jumpToHistory
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState<'filters' | 'layers' | 'history'>('filters');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('Cinematic');
  const [newFilterName, setNewFilterName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const allFilters = useMemo(() => [...FILTERS, ...customFilters], [customFilters]);
  const filteredFilters = useMemo(() => allFilters.filter(f => f.category === selectedCategory), [allFilters, selectedCategory]);

  const handleSavePreset = () => {
    if (newFilterName.trim()) {
      saveCustomFilter(newFilterName.trim());
      setNewFilterName('');
      setIsCreating(false);
    }
  };

  const getFilterStyle = (filterId: string) => {
    switch (filterId) {
      case 'film-noir': return 'grayscale(1) contrast(1.3) brightness(0.9)';
      case 'hollywood': return 'sepia(0.3) contrast(1.1) brightness(1.1)';
      case 'cyberpunk': return 'hue-rotate(300deg) saturate(1.5) contrast(1.2)';
      case 'teal-orange': return 'contrast(1.1) hue-rotate(-20deg) saturate(1.2)';
      case 'sepia': return 'sepia(1)';
      case 'old-film': return 'sepia(1) contrast(0.9) brightness(1.1)';
      case 'warm-sunset': return 'sepia(0.4) saturate(1.5) brightness(1.1)';
      case 'cool-blue': return 'hue-rotate(180deg) saturate(0.8) brightness(1.1)';
      case 'sketch': return 'grayscale(1) contrast(2) invert(1) opacity(0.5)';
      case 'vsco': return 'saturate(0.8) contrast(0.9) brightness(1.05)';
      case 'cherry-blossom': return 'sepia(0.2) hue-rotate(-30deg) saturate(1.2) brightness(1.1)';
      case 'morning-dew': return 'brightness(1.1) contrast(1.1) saturate(1.2) hue-rotate(160deg)';
      case 'beach-day': return 'hue-rotate(180deg) saturate(1.4) brightness(1.1)';
      case 'golden-hour': return 'sepia(0.5) saturate(1.5) brightness(1.1)';
      case 'misty-forest': return 'brightness(0.8) sepia(0.4) blur(1px)';
      case 'pumpkin-spice': return 'sepia(0.6) saturate(1.5) contrast(1.1)';
      case 'candlelight': return 'sepia(0.7) brightness(0.9) contrast(0.9) saturate(1.2)';
      case 'fireplace': return 'sepia(0.8) brightness(0.7) contrast(1.2)';
      case 'christmas-tree': return 'hue-rotate(100deg) saturate(1.5) contrast(1.1)';
      case 'mistletoe': return 'hue-rotate(90deg) saturate(1.2) contrast(1.1) brightness(0.9)';
      case 'diamond-dust': return 'brightness(1.3) contrast(1.2) saturate(0.8)';
      case 'starlight': return 'brightness(1.4) contrast(1.1) saturate(0.9)';
      case 'party-lights': return 'hue-rotate(45deg) saturate(2) contrast(1.5)';
      case 'confetti': return 'saturate(1.5) contrast(1.2)';
      case 'spring-bloom': return 'saturate(1.2) brightness(1.05) hue-rotate(-20deg)';
      case 'summer-vibe': return 'saturate(1.3) contrast(1.1) sepia(0.2)';
      case 'autumn-gold': return 'sepia(0.5) contrast(1.1) brightness(0.9)';
      case 'frosty-morning': return 'brightness(1.1) saturate(0.8) hue-rotate(180deg)';
      case 'ice-crystal': return 'contrast(1.3) brightness(1.05) hue-rotate(200deg) saturate(1.2)';
      case 'aurora': return 'hue-rotate(120deg) saturate(2) brightness(0.8)';
      case 'winter-solstice': return 'brightness(0.8) contrast(1.2) hue-rotate(220deg) saturate(1.5)';
      case 'blizzard': return 'brightness(1.3) contrast(0.8) blur(1px)';
      case 'snow-glow': return 'brightness(1.2) contrast(1.05) saturate(0.9)';
      case 'cozy-indoor': return 'sepia(0.3) contrast(0.9) brightness(1.1)';
      case 'candy-cane': return 'hue-rotate(-30deg) saturate(2) brightness(1.1)';
      case 'pixelate': return 'contrast(1.2) saturate(1.2)';
      case 'gameboy': return 'grayscale(1) brightness(1.2) contrast(1.2) sepia(0.5) hue-rotate(60deg)';
      case 'chromatic': return 'contrast(1.1) saturate(1.1)';
      case 'vhs-glitch': return 'contrast(1.1) saturate(1.1) blur(0.5px)';
      case 'duotone-red': return 'grayscale(1) contrast(1.2) sepia(1) hue-rotate(-50deg) saturate(5)';
      case 'duotone-blue': return 'grayscale(1) contrast(1.2) sepia(1) hue-rotate(180deg) saturate(5)';
      case 'duotone-purple': return 'grayscale(1) contrast(1.2) sepia(1) hue-rotate(240deg) saturate(5)';
      case 'pop-art': return 'saturate(2) contrast(1.5) brightness(1.1)';
      case 'halftone': return 'contrast(2) grayscale(1)';
      case 'comic-book': return 'contrast(1.5) saturate(1.5) brightness(1.1)';
      case 'sparkle': return 'brightness(1.2) contrast(1.1)';
      case 'festive-bright': return 'saturate(1.3) brightness(1.1)';
      case 'gradient-map': return 'hue-rotate(180deg) saturate(2)';
      case 'split-toning': return 'sepia(0.2) hue-rotate(180deg) contrast(1.1)';
      case 'blur': return 'blur(2px)';
      case 'grayscale': return 'grayscale(1)';
      case 'invert': return 'invert(1)';
      default: return 'none';
    }
  };

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Generate more snowflakes for a heavier snow effect
  const snowflakes = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 15,
    size: 5 + Math.random() * 12
  }));

  return (
    <div className="w-80 bg-editor-sidebar border-l border-editor-border flex flex-col h-full text-neutral-200 relative overflow-hidden">
      {/* Winter Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 via-transparent to-blue-900/5 pointer-events-none" />
      
      {/* Animated Snowflakes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {snowflakes.map((snow) => (
          <motion.div
            key={snow.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: 800, 
              opacity: [0, 0.4, 0],
              x: [0, 15, -15, 0]
            }}
            transition={{
              duration: snow.duration,
              repeat: Infinity,
              delay: snow.delay,
              ease: "linear"
            }}
            className="absolute text-blue-100/20"
            style={{ 
              left: snow.left,
              fontSize: snow.size
            }}
          >
            <Snowflake size={snow.size} />
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-b border-editor-border flex justify-between items-center h-14 relative z-10">
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-1 flex-1">
          {(['filters', 'layers', 'history'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] uppercase tracking-widest font-bold transition-all relative py-1 ${
                activeTab === tab ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {tab === 'layers' && <Layers size={12} />}
                {tab === 'history' && <History size={12} />}
                {tab === 'filters' ? 'Presets' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabRight"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-editor-accent"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
        {activeTab === 'filters' && (
          <button 
            onClick={() => {
              setSelectedCategory('Custom');
              setIsCreating(true);
            }}
            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md border border-editor-border transition-colors"
            title="Create Custom Filter"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {activeTab === 'layers' ? (
              <LayersPanel />
            ) : activeTab === 'history' ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                    <History className="w-8 h-8 mb-3" />
                    <p className="text-xs font-medium">No history yet</p>
                  </div>
                ) : (
                  history.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        index === historyIndex 
                          ? 'bg-editor-accent/10 border-editor-accent' 
                          : 'bg-white/5 border-transparent hover:border-white/10'
                      }`}
                      onClick={() => jumpToHistory(index)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${index === historyIndex ? 'text-white' : 'text-neutral-400'}`}>
                            {item.actionName}
                          </span>
                          <span className="text-[9px] text-neutral-600 font-mono">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {index === historyIndex && (
                          <div className="w-1.5 h-1.5 bg-editor-accent rounded-full" />
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              <>
                <div className="relative group/categories">
                  <div 
                    ref={scrollRef}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`flex overflow-x-auto border-b border-editor-border bg-black/20 scroll-smooth category-scrollbar pb-1 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                  >
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`whitespace-nowrap px-5 py-3.5 text-[10px] uppercase tracking-wider font-bold transition-all duration-300 relative ${
                          selectedCategory === cat ? 'text-editor-accent' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {cat}
                        {selectedCategory === cat && (
                          <motion.div 
                            layoutId="activeCategory"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-editor-accent" 
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence mode="popLayout">
                    {selectedCategory === 'Custom' && isCreating && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/5 border border-editor-border p-4 rounded-xl space-y-4"
                      >
                        <h3 className="text-[11px] uppercase tracking-wider font-bold text-white">Save Preset</h3>
                        <input
                          type="text"
                          value={newFilterName}
                          onChange={(e) => setNewFilterName(e.target.value)}
                          placeholder="Filter Name"
                          className="w-full bg-black/40 border border-editor-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-editor-accent transition-colors"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsCreating(false)}
                            className="flex-1 py-2 text-[10px] uppercase tracking-wider font-bold text-neutral-400 hover:text-white bg-black/20 rounded-lg border border-editor-border transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSavePreset}
                            disabled={!newFilterName.trim()}
                            className="flex-1 py-2 text-[10px] uppercase tracking-wider font-bold text-white bg-editor-accent hover:bg-red-600 rounded-lg disabled:opacity-50 transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {filteredFilters.length === 0 && !isCreating && (
                    <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                      <ImageIcon className="w-8 h-8 mb-3" />
                      <p className="text-xs font-medium">No filters in this category</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3">
                    <AnimatePresence mode="popLayout">
                      {filteredFilters.map((filter, index) => {
                        const isActive = activeFilter === filter.id;
                        return (
                          <motion.div
                            key={filter.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.03 }}
                            className={`relative rounded-xl border p-3 cursor-pointer transition-all duration-300 ${
                              isActive ? 'border-editor-accent bg-editor-accent/5' : 'border-editor-border bg-white/5 hover:border-neutral-700'
                            }`}
                            onClick={() => setActiveFilter(isActive ? null : filter.id)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-editor-accent' : 'text-neutral-300'}`}>
                                {filter.name}
                              </span>
                              {isActive && <Check className="w-3.5 h-3.5 text-editor-accent" />}
                            </div>
                            
                            <div className="h-24 bg-black/40 rounded-lg mb-3 overflow-hidden relative group">
                              <img 
                                src={`https://picsum.photos/seed/${filter.id}/300/200`} 
                                alt={filter.name}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-500"
                                style={{ filter: getFilterStyle(filter.id) }}
                                referrerPolicy="no-referrer"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                              <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-editor-accent rounded-full animate-pulse" />
                                <span className="text-[8px] text-white/50 uppercase tracking-widest font-bold">Live Preview</span>
                              </div>
                            </div>

                            <AnimatePresence>
                              {isActive && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="space-y-3 mt-4 pt-4 border-t border-editor-accent/10 overflow-hidden" 
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                    <span className="text-neutral-500">Intensity</span>
                                    <span className="text-white font-mono">{Math.round(filterIntensity * 100)}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={filterIntensity}
                                    onChange={(e) => setFilterIntensity(parseFloat(e.target.value))}
                                    onMouseUp={() => useEditorStore.getState().saveHistory()}
                                    onTouchEnd={() => useEditorStore.getState().saveHistory()}
                                    className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-editor-accent"
                                    disabled={!image}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
