import React, { useState, useRef, useEffect } from 'react';
import { Video, Play, Pause, SkipBack, SkipForward, Loader2, Sparkles, Wand2, Film, Trash2, Download, Key } from 'lucide-react';
import * as fabric from 'fabric';
import { useEditorStore } from '../../store/useEditorStore';
import { motion, AnimatePresence } from 'motion/react';

export function VideoPanel() {
  const { 
    canvas, 
    videoElement, 
    isPlaying, 
    setIsPlaying, 
    currentTime, 
    setCurrentTime, 
    duration,
    setImage
  } = useEditorStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;

    video.onloadedmetadata = () => {
      const fabricVideo = new fabric.Image(video, {
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center',
        objectCaching: false,
      });

      const scale = Math.min(
        (canvas.width! * 0.8) / video.videoWidth,
        (canvas.height! * 0.8) / video.videoHeight
      );
      
      fabricVideo.scale(scale);
      canvas.add(fabricVideo);
      canvas.setActiveObject(fabricVideo);
      setImage(fabricVideo);
      
      useEditorStore.getState().setVideoElement(video);
      useEditorStore.getState().setDuration(video.duration);
      
      video.play();
      setIsPlaying(true);
      
      fabric.util.requestAnimFrame(function render() {
        canvas.renderAll();
        setCurrentTime(video.currentTime);
        fabric.util.requestAnimFrame(render);
      });
    };
  };

  const togglePlay = () => {
    if (!videoElement) return;
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoElement) return;
    const time = parseFloat(e.target.value);
    videoElement.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="sidebar-section-title">Video Controls</h3>
        {!videoElement ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-8 border-2 border-dashed border-editor-border rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-editor-accent hover:bg-editor-accent/5 transition-all group"
          >
            <div className="w-12 h-12 bg-editor-accent/10 rounded-full flex items-center justify-center text-editor-accent group-hover:scale-110 transition-transform">
              <Video size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Upload Video</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleVideoUpload}
              accept="video/*"
              className="hidden"
            />
          </button>
        ) : (
          <div className="space-y-4 bg-black/40 p-4 rounded-2xl border border-editor-border">
            <div className="flex items-center justify-center gap-6">
              <button className="text-neutral-500 hover:text-white transition-colors">
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlay}
                className="w-12 h-12 bg-editor-accent rounded-full flex items-center justify-center text-white shadow-lg shadow-editor-accent/20 hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>
              <button className="text-neutral-500 hover:text-white transition-colors">
                <SkipForward size={20} />
              </button>
            </div>
            
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={duration}
                step="0.01"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-editor-accent"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>{currentTime.toFixed(2)}s</span>
                <span>{duration.toFixed(2)}s</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {videoElement && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-2 gap-3 pt-4 border-t border-editor-border"
          >
            <button 
              onClick={() => {
                if (canvas && videoElement) {
                  const objects = canvas.getObjects();
                  const videoObj = objects.find(obj => (obj as any)._element === videoElement);
                  if (videoObj) canvas.remove(videoObj);
                  useEditorStore.getState().setVideoElement(null);
                  useEditorStore.getState().setImage(null);
                  canvas.requestRenderAll();
                }
              }}
              className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-editor-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <Trash2 size={14} />
              Remove
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-editor-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
              <Download size={14} />
              Export
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
