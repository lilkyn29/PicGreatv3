import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../../store/useEditorStore';
import { Upload, TreePine, Snowflake } from 'lucide-react';
import { motion } from 'motion/react';

// Disable WebGL for filters to ensure custom 2D filters work correctly
// This fixes the issue where some presets cause the image to turn black
if (typeof fabric.setFilterBackend === 'function') {
  // @ts-ignore
  fabric.setFilterBackend(new fabric.Canvas2dFilterBackend());
}

export function CanvasArea() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCanvas, setImage, image, canvas, isCropping, setIsCropping, isDrawing, isErasing, brushColor, brushSize, setSelectedObject, isCanvasEmpty } = useEditorStore();
  const cropRectRef = useRef<fabric.Rect | null>(null);

  useEffect(() => {
    if (!canvas || !image) return;

    if (isCropping) {
      // Enter Crop Mode
      const imgWidth = image.getScaledWidth();
      const imgHeight = image.getScaledHeight();
      
      const cropRect = new fabric.Rect({
        left: image.left,
        top: image.top,
        width: imgWidth,
        height: imgHeight,
        originX: 'center',
        originY: 'center',
        fill: 'rgba(255, 255, 255, 0.2)',
        stroke: '#ff4d4d',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        cornerStyle: 'rect',
        cornerColor: '#ff4d4d',
        cornerSize: 12,
        transparentCorners: false,
        selectable: true,
        hasRotatingPoint: false,
      });

      canvas.add(cropRect);
      canvas.setActiveObject(cropRect);
      cropRectRef.current = cropRect;

      // Lock the image
      image.set({ selectable: false, evented: false });
      canvas.requestRenderAll();
    } else {
      // Exit Crop Mode
      if (cropRectRef.current) {
        canvas.remove(cropRectRef.current);
        cropRectRef.current = null;
      }
      if (image) {
        image.set({ selectable: true, evented: true });
      }
      canvas.requestRenderAll();
    }
  }, [isCropping, canvas, image]);

  useEffect(() => {
    if (!canvas) return;
    canvas.isDrawingMode = isDrawing;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = isErasing ? 'rgba(255,255,255,1)' : brushColor;
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [isDrawing, isErasing, brushColor, brushSize, canvas]);

  const applyCrop = () => {
    if (!canvas || !image || !cropRectRef.current) return;

    const rect = cropRectRef.current;
    
    // Calculate relative coordinates
    // Image is centered at image.left, image.top
    const imgLeft = image.left! - (image.getScaledWidth() / 2);
    const imgTop = image.top! - (image.getScaledHeight() / 2);
    
    const rectLeft = rect.left! - (rect.getScaledWidth() / 2);
    const rectTop = rect.top! - (rect.getScaledHeight() / 2);

    const relativeLeft = (rectLeft - imgLeft) / image.scaleX!;
    const relativeTop = (rectTop - imgTop) / image.scaleY!;
    const relativeWidth = rect.getScaledWidth() / image.scaleX!;
    const relativeHeight = rect.getScaledHeight() / image.scaleY!;

    // Apply crop
    image.set({
      cropX: (image.cropX || 0) + relativeLeft,
      cropY: (image.cropY || 0) + relativeTop,
      width: relativeWidth,
      height: relativeHeight,
    });

    // Reposition image to where the crop box was
    image.set({
      left: rect.left,
      top: rect.top,
    });

    setIsCropping(false);
    canvas.requestRenderAll();
    useEditorStore.getState().saveHistory();
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: 'transparent',
      selection: false,
    });

    setCanvas(initCanvas);

    // Sync selection with store
    initCanvas.on('selection:created', (e) => {
      if (e.selected?.[0] instanceof fabric.FabricImage) {
        setImage(e.selected[0]);
      }
    });

    initCanvas.on('selection:updated', (e) => {
      if (e.selected?.[0] instanceof fabric.FabricImage) {
        setImage(e.selected[0]);
      }
    });

    initCanvas.on('selection:cleared', () => {
      const objects = initCanvas.getObjects();
      // @ts-ignore
      const mainImg = objects.find(obj => obj.isMainImage) as fabric.FabricImage;
      if (mainImg) {
        setImage(mainImg);
      }
    });

    initCanvas.on('object:modified', () => {
      useEditorStore.getState().saveHistory();
    });

    initCanvas.on('path:created', (e: any) => {
      const path = e.path;
      if (useEditorStore.getState().isErasing) {
        path.set({
          globalCompositeOperation: 'destination-out',
          opacity: 1,
          selectable: false,
          evented: false
        });
        initCanvas.requestRenderAll();
      }
      useEditorStore.getState().saveHistory();
    });

    // Selection events
    initCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    initCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    initCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Zoom and Pan
    initCanvas.on('mouse:wheel', function(opt) {
      try {
        const e = opt.e as WheelEvent;
        const delta = e.deltaY;
        let zoom = initCanvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.1) zoom = 0.1;
        initCanvas.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), zoom);
        e.preventDefault();
        e.stopPropagation();
      } catch (err) {
        console.error('Zoom Error:', err);
      }
    });

    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    initCanvas.on('mouse:down', function(opt) {
      const evt = opt.e as MouseEvent;
      if (evt.altKey || evt.shiftKey || evt.button === 1) { // Middle click or Alt/Shift + click
        isDragging = true;
        initCanvas.selection = false;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
      }
    });

    initCanvas.on('mouse:move', function(opt) {
      if (isDragging) {
        const e = opt.e as MouseEvent;
        const vpt = initCanvas.viewportTransform;
        if (vpt) {
          vpt[4] += e.clientX - lastPosX;
          vpt[5] += e.clientY - lastPosY;
          initCanvas.requestRenderAll();
        }
        lastPosX = e.clientX;
        lastPosY = e.clientY;
      }
    });

    initCanvas.on('mouse:up', function() {
      initCanvas.setViewportTransform(initCanvas.viewportTransform!);
      isDragging = false;
      initCanvas.selection = true;
    });

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        initCanvas.setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
        const currentImage = useEditorStore.getState().image;
        if (currentImage) {
          centerImage(currentImage, initCanvas);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObjects = initCanvas.getActiveObjects();
        if (activeObjects.length > 0) {
          // Check if any active object is currently being edited (e.g., IText)
          const isEditingText = activeObjects.some(obj => (obj as any).isEditing);
          if (isEditingText) return;

          // Don't delete the main image
          const objectsToDelete = activeObjects.filter(obj => obj !== useEditorStore.getState().image);
          if (objectsToDelete.length > 0) {
            initCanvas.discardActiveObject();
            objectsToDelete.forEach(obj => initCanvas.remove(obj));
            useEditorStore.getState().saveHistory();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      resizeObserver.disconnect();
      initCanvas.dispose();
    };
  }, []);

  const centerImage = (img: fabric.FabricImage, c: fabric.Canvas) => {
    const scale = Math.min(
      (c.width! * 0.9) / img.width!,
      (c.height! * 0.9) / img.height!
    );
    img.set({
      scaleX: scale,
      scaleY: scale,
      left: c.width! / 2,
      top: c.height! / 2,
      originX: 'center',
      originY: 'center',
    });
    c.setViewportTransform([1, 0, 0, 1, 0, 0]);
    c.requestRenderAll();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!canvas) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result;
      if (typeof data !== 'string') return;

      fabric.FabricImage.fromURL(data).then((img) => {
        img.set({
          selectable: true,
          evented: true,
          cornerStyle: 'circle',
          cornerColor: '#ff4d4d',
          cornerStrokeColor: '#ffffff',
          transparentCorners: false,
          borderColor: '#ff4d4d',
          // @ts-ignore
          isMainImage: true,
          // @ts-ignore
          id: 'main-image'
        });
        
        centerImage(img, canvas);
        canvas.add(img);
        canvas.moveObjectTo(img, 0);
        canvas.setActiveObject(img);
        setImage(img);
      }).catch(err => {
        console.error('Error loading image:', err);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  // Generate snowflakes for the main canvas area
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 15,
    size: 8 + Math.random() * 12
  }));

  return (
    <div 
      ref={containerRef} 
      className="flex-1 relative bg-bg-main overflow-hidden flex items-center justify-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Animated Snowflakes for the middle section */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {snowflakes.map((snow) => (
          <motion.div
            key={snow.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: 1200, 
              opacity: [0, 0.3, 0],
              x: [0, 20, -20, 0]
            }}
            transition={{
              duration: snow.duration,
              repeat: Infinity,
              delay: snow.delay,
              ease: "linear"
            }}
            className="absolute text-blue-100/10"
            style={{ 
              left: snow.left,
              fontSize: snow.size
            }}
          >
            <Snowflake size={snow.size} />
          </motion.div>
        ))}
      </div>

      {!image && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="bg-bg-panel/80 backdrop-blur-xl p-12 rounded-3xl border border-border flex flex-col items-center gap-6 pointer-events-auto shadow-2xl shadow-black/50 relative overflow-hidden">
            {/* Festive Background Decorations */}
            <div className="absolute -top-4 -right-4 text-blue-400/20 rotate-12">
              <Snowflake size={64} />
            </div>
            <div className="absolute -bottom-4 -left-4 text-editor-accent/20 -rotate-12">
              <TreePine size={64} />
            </div>

            <div className="relative">
              <div className="w-20 h-20 bg-editor-accent/10 rounded-2xl flex items-center justify-center text-editor-accent relative z-10">
                <Upload className="w-10 h-10" />
              </div>
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 text-editor-accent-green"
              >
                <TreePine size={32} />
              </motion.div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-text-primary tracking-tight flex items-center justify-center gap-2">
                <TreePine className="text-editor-accent-green w-5 h-5" />
                Import Photo
                <TreePine className="text-editor-accent-green w-5 h-5" />
              </h3>
              <p className="text-sm text-text-muted mt-2 max-w-[200px]">Drag and drop your image here or browse your files</p>
            </div>
            <label className="mt-4 px-8 py-3 bg-editor-accent hover:bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer transition-all shadow-lg shadow-editor-accent/20 flex items-center gap-2">
              <TreePine size={14} />
              Select File
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} />
      {image && (
        <div className="absolute bottom-6 right-6 bg-bg-panel/80 backdrop-blur text-[10px] uppercase tracking-widest font-bold text-text-muted px-4 py-2.5 rounded-xl border border-border pointer-events-none flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-editor-accent rounded-full" /> Scroll to zoom</span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-editor-accent-green rounded-full" /> Alt+Drag to pan</span>
        </div>
      )}
      {isCropping && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-bg-panel/90 backdrop-blur-xl px-6 py-4 rounded-2xl border border-editor-accent flex items-center gap-6 shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-editor-accent">Crop Mode</span>
            <span className="text-xs text-text-muted">Adjust the box to crop your image</span>
          </div>
          <button
            onClick={applyCrop}
            className="px-6 py-2 bg-editor-accent hover:bg-red-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-editor-accent/20"
          >
            Apply Crop
          </button>
        </div>
      )}
    </div>
  );
}
