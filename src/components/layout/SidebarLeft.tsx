import React from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../../store/useEditorStore';
import { SlidersHorizontal, Image as ImageIcon, RotateCw, Crop, RefreshCcw, Plus, Trash2, ArrowUp, ArrowDown, FlipHorizontal, Sticker, Snowflake, Video, TreePine, Type, PenTool, Square, Circle, Triangle, Palette, Droplet, Layers, Eraser } from 'lucide-react';
import { StickerPanel } from '../stickers/StickerPanel';
import { VideoPanel } from '../video/VideoPanel';
import { motion, AnimatePresence } from 'motion/react';

export function SidebarLeft() {
  const {
    activeTab,
    setActiveTab,
    brightness,
    contrast,
    saturation,
    hue,
    exposure,
    shadows,
    highlights,
    warmth,
    vignette,
    grain,
    dehaze,
    vibrance,
    setAdjustment,
    image,
    canvas,
    isCropping,
    setIsCropping
  } = useEditorStore();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleRotate = () => {
    if (!image || !canvas) return;
    const currentAngle = image.angle || 0;
    image.rotate(currentAngle + 90);
    canvas.requestRenderAll();
  };

  const handleCrop = () => {
    if (!image || !canvas) return;
    setIsCropping(!isCropping);
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (f) => {
        const data = f.target?.result;
        if (typeof data !== 'string') return;
        fabric.Image.fromURL(data).then((img) => {
          img.set({
            selectable: true,
            evented: true,
            cornerStyle: 'circle',
            cornerColor: '#ff4d4d',
            cornerStrokeColor: '#ffffff',
            transparentCorners: false,
            borderColor: '#ff4d4d',
          });
          const scale = Math.min(
            (canvas.width! * 0.5) / img.width!,
            (canvas.height! * 0.5) / img.height!
          );
          img.set({
            scaleX: scale,
            scaleY: scale,
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            originX: 'center',
            originY: 'center',
          });
          canvas.add(img);
          canvas.setActiveObject(img);
          useEditorStore.getState().setImage(img);
          canvas.requestRenderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setAdjustment('brightness', 0);
    setAdjustment('contrast', 0);
    setAdjustment('saturation', 0);
    setAdjustment('hue', 0);
    setAdjustment('exposure', 0);
    setAdjustment('shadows', 0);
    setAdjustment('highlights', 0);
    setAdjustment('warmth', 0);
    setAdjustment('vignette', 0);
    setAdjustment('grain', 0);
    setAdjustment('dehaze', 0);
    setAdjustment('vibrance', 0);
    useEditorStore.getState().saveHistory();
  };

  const handleAddText = (type: 'heading' | 'subheading' | 'body') => {
    if (!canvas) return;
    const text = new fabric.IText(type === 'heading' ? 'Heading' : type === 'subheading' ? 'Subheading' : 'Body text', {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: 'center' as const,
      originY: 'center' as const,
      fontFamily: 'Inter',
      fontSize: type === 'heading' ? 64 : type === 'subheading' ? 48 : 24,
      fill: '#ffffff',
      fontWeight: type === 'heading' ? 'bold' : type === 'subheading' ? '600' : 'normal',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
    useEditorStore.getState().saveHistory();
  };

  const handleAddShape = (type: 'rect' | 'circle' | 'triangle') => {
    if (!canvas) return;
    
    let shape;
    const commonProps = {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: 'center' as const,
      originY: 'center' as const,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 0,
      opacity: 1,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0)',
        blur: 0,
        offsetX: 0,
        offsetY: 0
      })
    };

    switch (type) {
      case 'rect':
        shape = new fabric.Rect({ ...commonProps, width: 150, height: 150, rx: 8, ry: 8 });
        break;
      case 'circle':
        shape = new fabric.Circle({ ...commonProps, radius: 75 });
        break;
      case 'triangle':
        shape = new fabric.Triangle({ ...commonProps, width: 150, height: 150 });
        break;
    }

    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.requestRenderAll();
      useEditorStore.getState().saveHistory();
    }
  };

  const selectedObject = useEditorStore(state => state.selectedObject);
  const updateSelectedObject = useEditorStore(state => state.updateSelectedObject);

  // Generate more snowflakes for a heavier snow effect
  const snowflakes = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 15,
    size: 5 + Math.random() * 12
  }));

  return (
    <div className="w-72 bg-editor-sidebar border-r border-editor-border flex flex-col h-full text-neutral-200 relative overflow-hidden">
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

      <div className="flex border-b border-editor-border relative z-10 overflow-x-auto custom-scrollbar">
        {(['adjust', 'filters', 'stickers', 'text', 'draw', 'shapes', 'video'] as const).map((tab) => (
          <button
            key={tab}
            className={`min-w-[70px] flex-1 py-3 text-[9px] uppercase tracking-widest font-bold flex flex-col items-center justify-center gap-1.5 transition-all relative ${
              activeTab === tab ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'adjust' && <SlidersHorizontal className="w-4 h-4" />}
            {tab === 'filters' && <ImageIcon className="w-4 h-4" />}
            {tab === 'stickers' && <Sticker className="w-4 h-4" />}
            {tab === 'text' && <Type className="w-4 h-4" />}
            {tab === 'draw' && <PenTool className="w-4 h-4" />}
            {tab === 'shapes' && <Square className="w-4 h-4" />}
            {tab === 'video' && <Video className="w-4 h-4" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTabLeft"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-editor-accent"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className={`h-full overflow-y-auto p-6 custom-scrollbar ${selectedObject && selectedObject.type !== 'image' ? 'pb-[45vh]' : ''}`}
          >
            {activeTab === 'adjust' && (
              <div className="space-y-10">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="sidebar-section-title">Transformation</h3>
                    <button onClick={handleReset} className="text-[10px] uppercase tracking-wider text-neutral-500 hover:text-white flex items-center gap-1.5 transition-colors">
                      <RefreshCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddImage}
                      className="tool-button tool-button-inactive"
                    >
                      <Plus className="w-5 h-5 mb-1" />
                      Add Image
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </button>
                    <button
                      onClick={handleRotate}
                      disabled={!image}
                      className={`tool-button ${image ? 'tool-button-inactive' : 'opacity-30 cursor-not-allowed'}`}
                    >
                      <RotateCw className="w-5 h-5 mb-1" />
                      Rotate
                    </button>
                    <button
                      onClick={handleCrop}
                      disabled={!image}
                      className={`tool-button ${image ? (isCropping ? 'bg-editor-accent text-white border-editor-accent' : 'tool-button-inactive') : 'opacity-30 cursor-not-allowed'}`}
                    >
                      <Crop className="w-5 h-5 mb-1" />
                      {isCropping ? 'Cancel Crop' : 'Crop'}
                    </button>
                    <button
                      onClick={() => {
                        if (image && canvas) {
                          image.flipX = !image.flipX;
                          canvas.requestRenderAll();
                          useEditorStore.getState().saveHistory();
                        }
                      }}
                      disabled={!image}
                      className={`tool-button ${image ? 'tool-button-inactive' : 'opacity-30 cursor-not-allowed'}`}
                    >
                      <FlipHorizontal className="w-5 h-5 mb-1" />
                      Flip
                    </button>
                    <button
                      onClick={() => {
                        if (image && canvas) {
                          canvas.bringObjectToFront(image);
                          canvas.requestRenderAll();
                        }
                      }}
                      disabled={!image}
                      className={`tool-button ${image ? 'tool-button-inactive' : 'opacity-30 cursor-not-allowed'}`}
                    >
                      <ArrowUp className="w-5 h-5 mb-1" />
                      Front
                    </button>
                    <button
                      onClick={() => {
                        if (image && canvas) {
                          canvas.sendObjectToBack(image);
                          canvas.requestRenderAll();
                        }
                      }}
                      disabled={!image}
                      className={`tool-button ${image ? 'tool-button-inactive' : 'opacity-30 cursor-not-allowed'}`}
                    >
                      <ArrowDown className="w-5 h-5 mb-1" />
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (image && canvas) {
                          canvas.remove(image);
                          canvas.discardActiveObject();
                          canvas.requestRenderAll();
                          useEditorStore.getState().setImage(null);
                        }
                      }}
                      disabled={!image}
                      className={`tool-button ${image ? 'tool-button-inactive text-red-400 hover:text-red-300' : 'opacity-30 cursor-not-allowed'}`}
                    >
                      <Trash2 className="w-5 h-5 mb-1" />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="sidebar-section-title">Color & Light</h3>
                  
                  <div className="space-y-6">
                    {[
                      { label: 'Brightness', key: 'brightness', min: -1, max: 1 },
                      { label: 'Contrast', key: 'contrast', min: -1, max: 1 },
                      { label: 'Saturation', key: 'saturation', min: -1, max: 1 },
                      { label: 'Hue', key: 'hue', min: -1, max: 1 },
                      { label: 'Exposure', key: 'exposure', min: -1, max: 1 },
                      { label: 'Shadows', key: 'shadows', min: -1, max: 1 },
                      { label: 'Highlights', key: 'highlights', min: -1, max: 1 },
                      { label: 'Warmth', key: 'warmth', min: -1, max: 1 },
                    ].map((adj) => (
                      <div key={adj.key} className="space-y-3">
                        <div className="flex justify-between text-[11px] font-medium">
                          <span className="text-neutral-500 uppercase tracking-wider">{adj.label}</span>
                          <span className="text-white font-mono">{Math.round((useEditorStore.getState() as any)[adj.key] * 100)}</span>
                        </div>
                        <input
                          type="range"
                          min={adj.min}
                          max={adj.max}
                          step="0.01"
                          value={(useEditorStore.getState() as any)[adj.key]}
                          onChange={(e) => setAdjustment(adj.key as any, parseFloat(e.target.value))}
                          onMouseUp={() => useEditorStore.getState().saveHistory()}
                          onTouchEnd={() => useEditorStore.getState().saveHistory()}
                          className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-editor-accent"
                          disabled={!image}
                        />
                      </div>
                    ))}

                    <div className="pt-4 border-t border-editor-border space-y-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Lightroom Effects</h4>
                      
                      {[
                        { label: 'Vignette', key: 'vignette', min: 0, max: 1 },
                        { label: 'Grain', key: 'grain', min: 0, max: 1 },
                        { label: 'Dehaze', key: 'dehaze', min: -1, max: 1 },
                        { label: 'Vibrance', key: 'vibrance', min: -1, max: 1 },
                      ].map((adj) => (
                        <div key={adj.key} className="space-y-3">
                          <div className="flex justify-between text-[11px] font-medium">
                            <span className="text-neutral-500 uppercase tracking-wider">{adj.label}</span>
                            <span className="text-white font-mono">{Math.round((useEditorStore.getState() as any)[adj.key] * 100)}</span>
                          </div>
                          <input
                            type="range"
                            min={adj.min}
                            max={adj.max}
                            step="0.01"
                            value={(useEditorStore.getState() as any)[adj.key]}
                            onChange={(e) => setAdjustment(adj.key as any, parseFloat(e.target.value))}
                            onMouseUp={() => useEditorStore.getState().saveHistory()}
                            onTouchEnd={() => useEditorStore.getState().saveHistory()}
                            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-editor-accent"
                            disabled={!image}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'filters' && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-6 h-6 text-neutral-600" />
                </div>
                <h4 className="text-sm font-medium text-white mb-2">Filter Library</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Select and customize professional filters from the right panel to transform your image.
                </p>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-6">
                <h3 className="sidebar-section-title">Add Text</h3>
                <div className="space-y-3">
                  <button onClick={() => handleAddText('heading')} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-editor-border rounded-xl text-2xl font-bold text-white transition-colors">
                    Add Heading
                  </button>
                  <button onClick={() => handleAddText('subheading')} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-editor-border rounded-xl text-xl font-semibold text-white transition-colors">
                    Add Subheading
                  </button>
                  <button onClick={() => handleAddText('body')} className="w-full py-2 bg-white/5 hover:bg-white/10 border border-editor-border rounded-xl text-sm text-white transition-colors">
                    Add body text
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'draw' && (
              <div className="space-y-6">
                <h3 className="sidebar-section-title">Freehand Drawing</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => useEditorStore.getState().setIsDrawing(!useEditorStore.getState().isDrawing)}
                    className={`w-full py-3 rounded-xl border font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      useEditorStore.getState().isDrawing && !useEditorStore.getState().isErasing
                        ? 'bg-editor-accent text-white border-editor-accent shadow-lg shadow-editor-accent/20' 
                        : 'bg-white/5 text-neutral-400 border-editor-border hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <PenTool size={16} />
                    Brush
                  </button>

                  <button 
                    onClick={() => useEditorStore.getState().setIsErasing(!useEditorStore.getState().isErasing)}
                    className={`w-full py-3 rounded-xl border font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      useEditorStore.getState().isErasing 
                        ? 'bg-editor-accent text-white border-editor-accent shadow-lg shadow-editor-accent/20' 
                        : 'bg-white/5 text-neutral-400 border-editor-border hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Eraser size={16} />
                    Eraser
                  </button>
                </div>

                <div className="space-y-6 pt-6 border-t border-editor-border">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-neutral-500 uppercase tracking-wider">Brush Size</span>
                      <span className="text-white font-mono">{useEditorStore.getState().brushSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={useEditorStore.getState().brushSize}
                      onChange={(e) => useEditorStore.getState().setBrushSize(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-editor-accent"
                    />
                  </div>

                  <div className={`space-y-3 ${useEditorStore.getState().isErasing ? 'opacity-50 pointer-events-none' : ''}`}>
                    <span className="text-neutral-500 text-[11px] font-medium uppercase tracking-wider">Brush Color</span>
                    <div className="grid grid-cols-5 gap-2">
                      {['#ffffff', '#000000', '#ff4d4d', '#4ade80', '#60a5fa', '#facc15', '#c084fc', '#f472b6', '#2dd4bf', '#fb923c'].map(color => (
                        <button
                          key={color}
                          onClick={() => useEditorStore.getState().setBrushColor(color)}
                          className={`w-full aspect-square rounded-full border-2 transition-all ${
                            useEditorStore.getState().brushColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shapes' && (
              <div className="space-y-6">
                <h3 className="sidebar-section-title">Add Shapes</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => handleAddShape('rect')} className="aspect-square flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-editor-border rounded-xl text-white transition-colors">
                    <Square size={24} />
                    <span className="text-[10px] uppercase tracking-wider">Rect</span>
                  </button>
                  <button onClick={() => handleAddShape('circle')} className="aspect-square flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-editor-border rounded-xl text-white transition-colors">
                    <Circle size={24} />
                    <span className="text-[10px] uppercase tracking-wider">Circle</span>
                  </button>
                  <button onClick={() => handleAddShape('triangle')} className="aspect-square flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-editor-border rounded-xl text-white transition-colors">
                    <Triangle size={24} />
                    <span className="text-[10px] uppercase tracking-wider">Triangle</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'stickers' && (
              <StickerPanel />
            )}

            {activeTab === 'video' && (
              <VideoPanel />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Object Properties Panel (Shows when an object is selected) */}
      <AnimatePresence>
        {selectedObject && selectedObject.type !== 'image' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-editor-bg border-t border-editor-border p-4 max-h-[40vh] overflow-y-auto z-20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Palette size={14} /> Object Properties
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* Blending Mode */}
              <div className="space-y-2">
                <span className="text-[10px] font-medium text-neutral-400 uppercase">Blend Mode</span>
                <select
                  value={selectedObject.globalCompositeOperation || 'source-over'}
                  onChange={(e) => updateSelectedObject({ globalCompositeOperation: e.target.value })}
                  className="w-full bg-black/20 border border-editor-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-editor-accent transition-colors"
                >
                  <option value="source-over">Normal</option>
                  <option value="multiply">Multiply</option>
                  <option value="screen">Screen</option>
                  <option value="overlay">Overlay</option>
                  <option value="darken">Darken</option>
                  <option value="lighten">Lighten</option>
                  <option value="color-dodge">Color Dodge</option>
                  <option value="color-burn">Color Burn</option>
                  <option value="hard-light">Hard Light</option>
                  <option value="soft-light">Soft Light</option>
                  <option value="difference">Difference</option>
                  <option value="exclusion">Exclusion</option>
                  <option value="hue">Hue</option>
                  <option value="saturation">Saturation</option>
                  <option value="color">Color</option>
                  <option value="luminosity">Luminosity</option>
                </select>
              </div>

              {/* Opacity */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-medium text-neutral-400 uppercase">
                  <span>Opacity</span>
                  <span>{Math.round((selectedObject.opacity || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedObject.opacity || 1}
                  onChange={(e) => updateSelectedObject({ opacity: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-editor-accent"
                />
              </div>

              {/* Text Properties */}
              {selectedObject.type === 'i-text' && (
                <div className="space-y-4 pt-2 border-t border-editor-border/50">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase">Text Settings</span>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-medium text-neutral-400 uppercase">
                      <span>Font Size</span>
                      <span>{(selectedObject as any).fontSize || 24}px</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="200"
                      value={(selectedObject as any).fontSize || 24}
                      onChange={(e) => updateSelectedObject({ fontSize: parseInt(e.target.value) })}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-editor-accent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <span className="text-[10px] font-medium text-neutral-400 uppercase">Weight</span>
                      <select
                        value={(selectedObject as any).fontWeight || 'normal'}
                        onChange={(e) => updateSelectedObject({ fontWeight: e.target.value })}
                        className="w-full bg-black/20 border border-editor-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-editor-accent transition-colors"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="100">Thin</option>
                        <option value="300">Light</option>
                        <option value="600">Semi Bold</option>
                        <option value="800">Extra Bold</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-medium text-neutral-400 uppercase">Align</span>
                      <select
                        value={(selectedObject as any).textAlign || 'left'}
                        onChange={(e) => updateSelectedObject({ textAlign: e.target.value })}
                        className="w-full bg-black/20 border border-editor-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-editor-accent transition-colors"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                        <option value="justify">Justify</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Fill Color */}
              {(selectedObject.type === 'rect' || selectedObject.type === 'circle' || selectedObject.type === 'triangle' || selectedObject.type === 'i-text') && (
                <div className="space-y-2">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase">Fill Color</span>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={(selectedObject.fill as string) || '#ffffff'}
                      onChange={(e) => updateSelectedObject({ fill: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <div className="flex-1 grid grid-cols-6 gap-1">
                      {['#ffffff', '#000000', '#ff4d4d', '#4ade80', '#60a5fa', 'transparent'].map(color => (
                        <button
                          key={color}
                          onClick={() => updateSelectedObject({ fill: color })}
                          className="w-full aspect-square rounded border border-editor-border relative overflow-hidden"
                          style={{ backgroundColor: color === 'transparent' ? '#222' : color }}
                        >
                          {color === 'transparent' && <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white/50">NONE</div>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Stroke */}
              {(selectedObject.type === 'rect' || selectedObject.type === 'circle' || selectedObject.type === 'triangle' || selectedObject.type === 'i-text') && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-medium text-neutral-400 uppercase">
                    <span>Stroke Width</span>
                    <span>{selectedObject.strokeWidth || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={selectedObject.strokeWidth || 0}
                    onChange={(e) => updateSelectedObject({ strokeWidth: parseInt(e.target.value) })}
                    className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-editor-accent"
                  />
                  <div className="flex gap-2 mt-2">
                    <input
                      type="color"
                      value={(selectedObject.stroke as string) || '#000000'}
                      onChange={(e) => updateSelectedObject({ stroke: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                  </div>
                </div>
              )}

              {/* Shadow */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-medium text-neutral-400 uppercase">
                  <span>Shadow Blur</span>
                  <span>{((selectedObject.shadow as fabric.Shadow)?.blur) || 0}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={((selectedObject.shadow as fabric.Shadow)?.blur) || 0}
                  onChange={(e) => {
                    const blur = parseInt(e.target.value);
                    const currentShadow = selectedObject.shadow as fabric.Shadow;
                    updateSelectedObject({
                      shadow: new fabric.Shadow({
                        color: currentShadow?.color || 'rgba(0,0,0,0.5)',
                        blur: blur,
                        offsetX: currentShadow?.offsetX || 0,
                        offsetY: currentShadow?.offsetY || 0
                      })
                    });
                  }}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-editor-accent"
                />
              </div>
              
              {/* Blending Mode */}
              <div className="space-y-2">
                <span className="text-[10px] font-medium text-neutral-400 uppercase">Blend Mode</span>
                <select 
                  value={selectedObject.globalCompositeOperation || 'source-over'}
                  onChange={(e) => updateSelectedObject({ globalCompositeOperation: e.target.value })}
                  className="w-full bg-neutral-900 border border-editor-border rounded-lg p-2 text-xs text-white outline-none focus:border-editor-accent"
                >
                  <option value="source-over">Normal</option>
                  <option value="multiply">Multiply</option>
                  <option value="screen">Screen</option>
                  <option value="overlay">Overlay</option>
                  <option value="darken">Darken</option>
                  <option value="lighten">Lighten</option>
                  <option value="color-dodge">Color Dodge</option>
                  <option value="color-burn">Color Burn</option>
                  <option value="hard-light">Hard Light</option>
                  <option value="soft-light">Soft Light</option>
                  <option value="difference">Difference</option>
                  <option value="exclusion">Exclusion</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
