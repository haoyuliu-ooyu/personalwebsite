import { useState, useEffect } from 'react';
import styles from './Taskbar.module.css';

interface WindowData {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

interface Props {
  windows: WindowData[];
  activeWindowId: string | undefined;
  onWindowClick: (id: string) => void;
  onStartClick: () => void;
}

export const Taskbar: React.FC<Props> = ({ windows, activeWindowId, onWindowClick, onStartClick }) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const openWindows = windows.filter(w => w.isOpen);

  return (
    <div className={styles.taskbar}>
      <div className={styles.startButton} onClick={onStartClick} style={{ cursor: 'pointer' }}>
        <span style={{ fontSize: '18px', fontStyle: 'normal' }}>⊞</span> start
      </div>
      <div className={styles.taskbarItems}>
        {openWindows.map(w => (
          <div 
            key={w.id}
            className={`${styles.taskbarItem} ${activeWindowId === w.id ? styles.active : ''}`}
            onClick={() => onWindowClick(w.id)}
            style={{ minWidth: '150px' }}
          >
            {w.title}
          </div>
        ))}
      </div>
      <div className={styles.systemTray}>
        <div className={styles.clock}>{time}</div>
      </div>
    </div>
  );
};
