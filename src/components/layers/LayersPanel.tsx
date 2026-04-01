import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { Eye, EyeOff, Lock, Unlock, Trash2, ChevronUp, ChevronDown, Layers as LayersIcon, Type, Image as ImageIcon, Square, PenTool, Eraser } from 'lucide-react';
import { motion, Reorder } from 'motion/react';

export function LayersPanel() {
  const { canvas } = useEditorStore();
  const [layers, setLayers] = useState<any[]>([]);
  const [, setUpdate] = useState(0);

  const forceUpdate = () => setUpdate(prev => prev + 1);

  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      const objects = [...canvas.getObjects()].reverse(); // Show top layers first
      setLayers(objects);
    };

    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
    canvas.on('selection:created', forceUpdate);
    canvas.on('selection:cleared', forceUpdate);
    canvas.on('selection:updated', forceUpdate);

    updateLayers();

    return () => {
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
      canvas.off('selection:created', forceUpdate);
      canvas.off('selection:cleared', forceUpdate);
      canvas.off('selection:updated', forceUpdate);
    };
  }, [canvas]);

  const toggleVisibility = (obj: any) => {
    obj.set('visible', !obj.visible);
    canvas?.renderAll();
    forceUpdate();
  };

  const toggleLock = (obj: any) => {
    const isLocked = obj.lockMovementX;
    obj.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockRotation: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
      hasControls: isLocked,
    });
    canvas?.renderAll();
    forceUpdate();
  };

  const deleteLayer = (obj: any) => {
    canvas?.remove(obj);
    canvas?.discardActiveObject();
    canvas?.renderAll();
  };

  const moveUp = (obj: any) => {
    obj.bringForward();
    canvas?.renderAll();
    forceUpdate();
  };

  const moveDown = (obj: any) => {
    obj.sendBackwards();
    canvas?.renderAll();
    forceUpdate();
  };

  const selectLayer = (obj: any) => {
    canvas?.setActiveObject(obj);
    canvas?.renderAll();
    forceUpdate();
  };

  const getLayerIcon = (type: string, obj: any) => {
    switch (type) {
      case 'i-text':
      case 'text': return <Type size={14} />;
      case 'image': return <ImageIcon size={14} />;
      case 'path': return obj.globalCompositeOperation === 'destination-out' ? <Eraser size={14} /> : <PenTool size={14} />;
      default: return <Square size={14} />;
    }
  };

  const getLayerName = (obj: any) => {
    if (obj.type === 'i-text' || obj.type === 'text') return obj.text.substring(0, 15) + (obj.text.length > 15 ? '...' : '');
    if (obj.type === 'image') return 'Image Layer';
    if (obj.type === 'path') return obj.globalCompositeOperation === 'destination-out' ? 'Eraser Stroke' : 'Drawing';
    return obj.type.charAt(0).toUpperCase() + obj.type.slice(1);
  };

  if (layers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
        <LayersIcon className="w-8 h-8 mb-3" />
        <p className="text-xs font-medium">No layers yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {layers.map((obj, index) => {
        const isSelected = canvas?.getActiveObject() === obj;
        const isLocked = obj.lockMovementX;
        const isVisible = obj.visible;

        return (
          <motion.div
            key={obj.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`group flex items-center gap-3 p-2 rounded-lg border transition-all ${
              isSelected 
                ? 'bg-editor-accent/10 border-editor-accent' 
                : 'bg-white/5 border-transparent hover:border-white/10'
            }`}
            onClick={() => selectLayer(obj)}
          >
            <div className={`p-1.5 rounded bg-black/40 ${isSelected ? 'text-editor-accent' : 'text-neutral-500'}`}>
              {getLayerIcon(obj.type, obj)}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-[11px] font-bold truncate ${isSelected ? 'text-white' : 'text-neutral-400'}`}>
                {getLayerName(obj)}
              </p>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); toggleVisibility(obj); }}
                className={`p-1 hover:bg-white/10 rounded transition-colors ${!isVisible ? 'text-red-400' : 'text-neutral-500'}`}
                title={isVisible ? 'Hide' : 'Show'}
              >
                {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleLock(obj); }}
                className={`p-1 hover:bg-white/10 rounded transition-colors ${isLocked ? 'text-yellow-400' : 'text-neutral-500'}`}
                title={isLocked ? 'Unlock' : 'Lock'}
              >
                {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
              <div className="flex flex-col">
                <button
                  onClick={(e) => { e.stopPropagation(); moveUp(obj); }}
                  className="p-0.5 hover:bg-white/10 rounded text-neutral-500"
                >
                  <ChevronUp size={10} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); moveDown(obj); }}
                  className="p-0.5 hover:bg-white/10 rounded text-neutral-500"
                >
                  <ChevronDown size={10} />
                </button>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteLayer(obj); }}
                className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded text-neutral-500 transition-colors"
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
