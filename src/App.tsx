/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { SidebarLeft } from './components/layout/SidebarLeft';
import { SidebarRight } from './components/layout/SidebarRight';
import { TopBar } from './components/layout/TopBar';
import { CanvasArea } from './components/canvas/CanvasArea';
import { StatusBar } from './components/layout/StatusBar';
import { useEditorStore } from './store/useEditorStore';

export default function App() {
  const { undo, redo } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="h-screen w-full flex flex-col bg-bg-main text-text-primary overflow-hidden font-sans selection:bg-editor-accent/30">
      <TopBar />
      <div className="flex-1 flex overflow-hidden border-t border-border">
        <SidebarLeft />
        <CanvasArea />
        <SidebarRight />
      </div>
      <StatusBar />
    </div>
  );
}
