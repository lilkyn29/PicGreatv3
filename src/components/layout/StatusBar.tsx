import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { ZoomIn, Maximize, MousePointer2, Layers, TreePine } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function StatusBar() {
  const { canvas, image, history } = useEditorStore();
  const [zoom, setZoom] = React.useState(100);

  React.useEffect(() => {
    if (!canvas) return;

    const updateZoom = () => {
      setZoom(Math.round(canvas.getZoom() * 100));
    };

    canvas.on('mouse:wheel', updateZoom);
    canvas.on('after:render', updateZoom);

    return () => {
      canvas.off('mouse:wheel', updateZoom);
      canvas.off('after:render', updateZoom);
    };
  }, [canvas]);

  const resetZoom = () => {
    if (!canvas) return;
    canvas.setZoom(1);
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.renderAll();
  };

  return (
    <div className="h-8 bg-editor-sidebar border-t border-editor-border flex items-center justify-between px-4 text-[10px] uppercase tracking-widest font-bold text-neutral-500 relative z-20">
      <div className="flex items-center gap-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <MousePointer2 size={12} className="text-editor-accent" />
          <AnimatePresence mode="wait">
            <motion.span
              key={image ? 'selected' : 'none'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {image ? 'Object Selected' : 'No Selection'}
            </motion.span>
          </AnimatePresence>
        </motion.div>
        {image && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-neutral-700">|</span>
            <span>{Math.round(image.width! * image.scaleX!)} x {Math.round(image.height! * image.scaleY!)} px</span>
          </motion.div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-neutral-700">|</span>
          <Layers size={12} className="text-editor-accent-green" />
          <AnimatePresence mode="wait">
            <motion.span
              key={canvas?.getObjects().length || 0}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {canvas?.getObjects().length || 0} Layers
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <TreePine size={12} className="text-editor-accent-green" />
          <AnimatePresence mode="wait">
            <motion.span
              key={history.length}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              History: {history.length} steps
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ZoomIn size={12} />
            <AnimatePresence mode="wait">
              <motion.span 
                key={zoom}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="font-mono"
              >
                {zoom}%
              </motion.span>
            </AnimatePresence>
          </div>
          <button 
            onClick={resetZoom}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Maximize size={12} />
            Reset View
          </button>
        </div>
      </div>
    </div>
  );
}
