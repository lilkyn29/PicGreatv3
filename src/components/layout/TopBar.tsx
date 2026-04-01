import React, { useState, useRef } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { Undo2, Redo2, Download, Trash2, Snowflake, Settings, X, Image as ImageIcon, Film, Loader2, Check, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChristmasLights } from './ChristmasLights';

export function TopBar() {
  const { 
    canvas, image, setImage, undo, redo, historyIndex, history, videoElement,
    isComparing, toggleCompare 
  } = useEditorStore();
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'image' | 'video'>('image');
  const [exportFormat, setExportFormat] = useState('png');
  const [exportQuality, setExportQuality] = useState(0.9);
  const [exportMultiplier, setExportMultiplier] = useState(2);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleImageExport = () => {
    if (!canvas) return;
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        const dataURL = canvas.toDataURL({
          format: exportFormat,
          quality: exportQuality,
          multiplier: exportMultiplier
        });
        const link = document.createElement('a');
        link.download = `picgreat-export-${Date.now()}.${exportFormat}`;
        link.href = dataURL;
        link.click();
        setShowExportModal(false);
      } catch (error) {
        console.error('Export Error:', error);
        alert('Failed to export image. Try a lower resolution.');
      } finally {
        setIsExporting(false);
      }
    }, 500);
  };

  const handleVideoExport = async () => {
    if (!canvas || !videoElement) return;
    setIsExporting(true);
    setExportProgress(0);

    try {
      const stream = (canvas.getElement() as any).captureStream(30);
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: exportQuality * 5000000 // Up to 5Mbps
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `picgreat-video-${Date.now()}.webm`;
        link.href = url;
        link.click();
        setIsExporting(false);
        setShowExportModal(false);
      };

      // Start recording
      videoElement.currentTime = 0;
      videoElement.play();
      recorder.start();

      const duration = videoElement.duration;
      const interval = setInterval(() => {
        const progress = (videoElement.currentTime / duration) * 100;
        setExportProgress(progress);
        if (videoElement.currentTime >= duration || videoElement.paused) {
          recorder.stop();
          videoElement.pause();
          clearInterval(interval);
        }
      }, 100);

    } catch (error) {
      console.error('Video Export Error:', error);
      alert('Failed to export video. Your browser may not support canvas recording.');
      setIsExporting(false);
    }
  };

  const handleClear = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#0a0a0a';
    setImage(null);
    useEditorStore.getState().setVideoElement(null);
  };

  // Generate more snowflakes for a heavier snow effect
  const snowflakes = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 8,
    duration: 4 + Math.random() * 12,
    size: 4 + Math.random() * 10
  }));

  return (
    <div className="h-14 bg-editor-sidebar border-b border-editor-border flex items-center justify-between px-6 relative overflow-hidden">
      <ChristmasLights />
      {/* Winter Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-blue-900/10 pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/snow.png')]" />
      
      {/* Animated Snowflakes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {snowflakes.map((snow) => (
          <motion.div
            key={snow.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: 80, 
              opacity: [0, 0.8, 0],
              x: [0, 10, -10, 0]
            }}
            transition={{
              duration: snow.duration,
              repeat: Infinity,
              delay: snow.delay,
              ease: "linear"
            }}
            className="absolute text-blue-100/40"
            style={{ 
              left: snow.left,
              fontSize: snow.size
            }}
          >
            <Snowflake size={snow.size} />
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-6 relative z-10">
        <div className="flex items-center gap-2">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 bg-editor-accent rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-editor-accent/20"
          >
            P
          </motion.div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
            PicGreat<span className="text-editor-accent">LK</span>
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="text-blue-300 ml-1"
            >
              <Snowflake size={14} />
            </motion.span>
          </h1>
        </div>
        <div className="h-4 w-px bg-editor-border" />
        <motion.span 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase flex items-center gap-2"
        >
          Winter Magic Edition
        </motion.span>
      </div>

      <div className="flex items-center gap-2 relative z-10">
        <button
          onClick={undo}
          disabled={!image || historyIndex <= 0}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Undo"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          disabled={!image || historyIndex >= history.length - 1}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Redo"
        >
          <Redo2 className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-neutral-800 mx-1" />

        <button
          onMouseDown={() => toggleCompare(true)}
          onMouseUp={() => toggleCompare(false)}
          onMouseLeave={() => isComparing && toggleCompare(false)}
          disabled={!image || history.length < 2}
          className={`p-2 rounded-lg transition-all flex items-center gap-2 ${
            isComparing ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Hold to Compare (Before/After)"
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Compare</span>
        </button>
        
        <div className="w-px h-6 bg-neutral-800 mx-2" />
        
        <button
          onClick={handleClear}
          disabled={!image && !videoElement}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Clear Canvas"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setShowExportModal(true)}
          disabled={!image && !videoElement}
          className="ml-2 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-900/20"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isExporting && setShowExportModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-editor-sidebar border border-editor-border rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-editor-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                    <Download size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Export Settings</h2>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Custom Quality & Format</p>
                  </div>
                </div>
                {!isExporting && (
                  <button 
                    onClick={() => setShowExportModal(false)}
                    className="p-2 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Export Type Toggle */}
                <div className="flex p-1 bg-black/40 rounded-xl border border-editor-border">
                  <button
                    onClick={() => setExportType('image')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                      exportType === 'image' ? 'bg-blue-600 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <ImageIcon size={14} />
                    Image
                  </button>
                  <button
                    onClick={() => setExportType('video')}
                    disabled={!videoElement}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                      exportType === 'video' ? 'bg-blue-600 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300 disabled:opacity-30'
                    }`}
                  >
                    <Film size={14} />
                    Video
                  </button>
                </div>

                {exportType === 'image' ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Format</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['png', 'jpeg', 'webp'].map((f) => (
                          <button
                            key={f}
                            onClick={() => setExportFormat(f)}
                            className={`py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${
                              exportFormat === f ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-editor-border bg-black/20 text-neutral-500 hover:border-neutral-700'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-neutral-500">Resolution (Multiplier)</span>
                        <span className="text-blue-400">{exportMultiplier}x</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 4].map((m) => (
                          <button
                            key={m}
                            onClick={() => setExportMultiplier(m)}
                            className={`py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${
                              exportMultiplier === m ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-editor-border bg-black/20 text-neutral-500 hover:border-neutral-700'
                            }`}
                          >
                            {m}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {exportFormat !== 'png' && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-neutral-500">Quality</span>
                          <span className="text-blue-400">{Math.round(exportQuality * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.05"
                          value={exportQuality}
                          onChange={(e) => setExportQuality(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                      <p className="text-[10px] text-blue-300 leading-relaxed uppercase tracking-wider font-bold text-center">
                        Recording will capture the canvas in real-time. Please don't close the modal while exporting.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-neutral-500">Video Bitrate (Quality)</span>
                        <span className="text-blue-400">{Math.round(exportQuality * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={exportQuality}
                        onChange={(e) => setExportQuality(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    {isExporting && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-neutral-500">Recording Progress</span>
                          <span className="text-blue-400">{Math.round(exportProgress)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${exportProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 bg-black/20 border-t border-editor-border">
                <button
                  onClick={exportType === 'image' ? handleImageExport : handleVideoExport}
                  disabled={isExporting}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      {exportType === 'image' ? 'Processing Image...' : 'Recording Canvas...'}
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Start Export
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
