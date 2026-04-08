import { useState } from 'react';
import { Taskbar } from './components/Taskbar';
import { SystemProperties } from './components/apps/SystemProperties';
import { NotepadApp } from './components/apps/NotepadApp';
import { InternetExplorerApp } from './components/apps/InternetExplorerApp';
import { ExplorerApp } from './components/apps/ExplorerApp';
import { ControlPanelApp } from './components/apps/ControlPanelApp';

import styles from './App.module.css';
import resumeData from './data/resume.json';

type WindowData = {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
};

type WindowsState = {
  [key: string]: WindowData;
};

export default function App() {
  const [highestZIndex, setHighestZIndex] = useState(10);
  
  const [windows, setWindows] = useState<WindowsState>({
    system: { id: 'system', title: 'System Properties', isOpen: true, isMinimized: false, zIndex: 1 },
    notepad: { id: 'notepad', title: 'Education.txt - Notepad', isOpen: true, isMinimized: false, zIndex: 2 },
    ie: { id: 'ie', title: 'Work Experience', isOpen: true, isMinimized: false, zIndex: 3 },
    explorer: { id: 'explorer', title: 'My Projects', isOpen: true, isMinimized: false, zIndex: 4 },
    controlPanel: { id: 'controlPanel', title: 'Control Panel', isOpen: true, isMinimized: false, zIndex: 5 },
  });

  const activeWindowId = Object.values(windows)
    .filter(w => w.isOpen && !w.isMinimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.id;

  const focusWindow = (id: string) => {
    if (!windows[id].isOpen) return;
    setHighestZIndex(prev => prev + 1);
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], zIndex: highestZIndex + 1, isMinimized: false }
    }));
  };

  const toggleMinimize = (id: string) => {
    setWindows(prev => {
      const isMin = !prev[id].isMinimized;
      let newZ = prev[id].zIndex;
      if (!isMin) {
        setHighestZIndex(h => h + 1);
        newZ = highestZIndex + 1;
      }
      return { ...prev, [id]: { ...prev[id], isMinimized: isMin, zIndex: newZ } };
    });
  };

  const closeWindow = (id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
  };

  const openWindow = (id: string) => {
    setHighestZIndex(prev => prev + 1);
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: highestZIndex + 1 }
    }));
  };

  const getProps = (id: string, defaultPos: {x: number, y: number}) => ({
    id,
    isActive: activeWindowId === id,
    zIndex: windows[id].zIndex,
    defaultPosition: defaultPos,
    onFocus: focusWindow,
    onMinimize: toggleMinimize,
    onClose: closeWindow,
  });

  return (
    <div className={styles.desktop}>
      {/* Desktop Icons could go here */}

      {/* Windows */}
      {windows.system.isOpen && !windows.system.isMinimized && (
        <SystemProperties data={resumeData.header} windowProps={getProps('system', { x: 50, y: 50 })} />
      )}
      
      {windows.notepad.isOpen && !windows.notepad.isMinimized && (
        <NotepadApp data={resumeData.education} windowProps={getProps('notepad', { x: 100, y: 100 })} />
      )}
      
      {windows.ie.isOpen && !windows.ie.isMinimized && (
        <InternetExplorerApp data={resumeData.work_experience} windowProps={getProps('ie', { x: 150, y: 150 })} />
      )}
      
      {windows.explorer.isOpen && !windows.explorer.isMinimized && (
        <ExplorerApp data={resumeData.projects} windowProps={getProps('explorer', { x: 200, y: 200 })} />
      )}
      
      {windows.controlPanel.isOpen && !windows.controlPanel.isMinimized && (
        <ControlPanelApp data={resumeData.skills} windowProps={getProps('controlPanel', { x: 250, y: 250 })} />
      )}

      {/* Taskbar */}
      <Taskbar 
        windows={Object.values(windows)} 
        activeWindowId={activeWindowId} 
        onWindowClick={focusWindow} 
        onStartClick={() => {
          // Simplistic "Start" menu logic: re-open all windows if they are closed
          Object.keys(windows).forEach(id => openWindow(id));
        }}
      />
    </div>
  );
}
