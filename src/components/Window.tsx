import { useRef } from 'react';
import Draggable from 'react-draggable';
import styles from './Window.module.css';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  defaultPosition?: { x: number, y: number };
  zIndex: number;
  isActive: boolean;
  onFocus: (id: string) => void;
  onMinimize?: (id: string) => void;
  onClose?: (id: string) => void;
}

export const Window: React.FC<WindowProps> = ({ 
  id, 
  title, 
  children, 
  style, 
  defaultPosition = { x: 50, y: 50 },
  zIndex,
  isActive,
  onFocus,
  onMinimize,
  onClose
}) => {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef} handle=".handle" defaultPosition={defaultPosition} onMouseDown={() => onFocus(id)}>
      <div 
        ref={nodeRef}
        className={`${styles.window} ${isActive ? styles.active : ''}`} 
        style={{ ...style, zIndex }}
      >
        <div className={`${styles.titleBar} handle`}>
          <div className={styles.titleText}>{title}</div>
          <div className={styles.titleButtons}>
            <div 
              className={`${styles.button} ${styles.minMax}`} 
              onClick={(e) => { e.stopPropagation(); onMinimize && onMinimize(id); }}
            >
              _
            </div>
            <div className={`${styles.button} ${styles.minMax}`}>□</div>
            <div 
              className={`${styles.button} ${styles.close}`}
              onClick={(e) => { e.stopPropagation(); onClose && onClose(id); }}
            >
              X
            </div>
          </div>
        </div>
        <div className={styles.content} onMouseDown={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </Draggable>
  );
};
