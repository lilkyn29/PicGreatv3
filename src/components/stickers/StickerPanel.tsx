import React, { useState, useEffect } from 'react';
import { Search, Loader2, X, Sparkles, Ghost, Snowflake, TreePine } from 'lucide-react';
import * as fabric from 'fabric';
import { useEditorStore } from '../../store/useEditorStore';
import { motion, AnimatePresence } from 'motion/react';

const TENOR_API_KEY = process.env.VITE_TENOR_API_KEY || 'LIVDSRZULELA'; // Public demo key if not provided

export function StickerPanel() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'gifs' | 'stickers'>('stickers');
  const { canvas, setImage } = useEditorStore();

  const fetchTenor = async (query: string = '') => {
    setLoading(true);
    try {
      const endpoint = query ? 'search' : 'featured';
      const url = `https://tenor.googleapis.com/v2/${endpoint}?q=${query}&key=${TENOR_API_KEY}&client_key=picgreat&limit=20&contentfilter=medium&media_filter=minimal${type === 'stickers' ? '&searchfilter=sticker' : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Tenor API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTenor(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, type]);

  const addSticker = (url: string) => {
    if (!canvas) return;

    fabric.Image.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
      const scale = Math.min(
        (canvas.width! * 0.3) / img.width!,
        (canvas.height! * 0.3) / img.height!
      );
      
      img.set({
        scaleX: scale,
        scaleY: scale,
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center',
        selectable: true,
        evented: true,
        cornerStyle: 'circle',
        cornerColor: '#ff4d4d',
        cornerStrokeColor: '#ffffff',
        transparentCorners: false,
        borderColor: '#ff4d4d',
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      setImage(img);
      canvas.requestRenderAll();
      useEditorStore.getState().saveHistory();
    });
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="sidebar-section-title">Stickers & GIFs</h3>
        <div className="flex bg-black/40 rounded-lg p-1 border border-editor-border relative">
          <button
            onClick={() => setType('stickers')}
            className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md transition-all relative z-10 ${
              type === 'stickers' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Stickers
            {type === 'stickers' && (
              <motion.div 
                layoutId="stickerType"
                className="absolute inset-0 bg-editor-accent rounded-md -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
          <button
            onClick={() => setType('gifs')}
            className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md transition-all relative z-10 ${
              type === 'gifs' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            GIFs
            {type === 'gifs' && (
              <motion.div 
                layoutId="stickerType"
                className="absolute inset-0 bg-editor-accent rounded-md -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search Google ${type === 'stickers' ? 'Stickers' : 'GIFs'}...`}
          className="w-full bg-black/40 border border-editor-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-editor-accent transition-colors"
        />
        <AnimatePresence>
          {search && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-neutral-500" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSearch('Christmas')}
          className={`flex-1 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            search === 'Christmas' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-black/20 border-editor-border text-neutral-500 hover:border-neutral-700'
          }`}
        >
          <Snowflake size={12} />
          Christmas
        </button>
        <button
          onClick={() => setSearch('Santa')}
          className={`flex-1 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            search === 'Santa' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-black/20 border-editor-border text-neutral-500 hover:border-neutral-700'
          }`}
        >
          <Sparkles size={12} />
          Santa
        </button>
        <button
          onClick={() => setSearch('Reindeer')}
          className={`flex-1 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            search === 'Reindeer' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-black/20 border-editor-border text-neutral-500 hover:border-neutral-700'
          }`}
        >
          <TreePine size={12} />
          Reindeer
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-40 text-neutral-500 gap-3"
            >
              <Loader2 className="w-6 h-6 animate-spin text-editor-accent" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Searching Tenor...</span>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-3 pb-4"
            >
              {results.map((result, index) => (
                <motion.button
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => addSticker(result.media_formats.tinygif.url)}
                  className="group relative aspect-square bg-white/5 rounded-xl overflow-hidden border border-editor-border hover:border-editor-accent transition-all duration-300"
                >
                  <img
                    src={result.media_formats.tinygif.url}
                    alt={result.content_description}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-40 text-neutral-500 gap-3 text-center px-4"
            >
              <Ghost className="w-8 h-8 opacity-20" />
              <p className="text-[10px] uppercase tracking-widest font-bold leading-relaxed">
                No results found.<br/>Try a different search.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-4 border-t border-editor-border">
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-600">
          <img src="https://tenor.com/assets/img/tenor-logo-white.svg" alt="Tenor" className="h-2.5 opacity-30" />
          <span>Powered by Google</span>
        </div>
      </div>
    </div>
  );
}
