'use client';

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Maximize2, Minimize2, Move } from 'lucide-react';

interface PermitModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  docNo: string;
  children: React.ReactNode;
}

export default function PermitModal({ isOpen, onClose, title, docNo, children }: PermitModalProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const savedScrollTop = useRef(0);

  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = savedScrollTop.current;
    }
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setPosition({ x: 0, y: 0 });
      setIsMaximized(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const clamp = useCallback((x: number, y: number) => {
    if (!modalRef.current) return { x, y };
    const w = modalRef.current.offsetWidth;
    const h = modalRef.current.offsetHeight;
    const m = 16;
    return {
      x: Math.max(-(w / 2) + m, Math.min(x, window.innerWidth - w / 2 - m)),
      y: Math.max(-(h / 2) + m, Math.min(y, window.innerHeight - h / 2 - m)),
    };
  }, []);

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (isMaximized || (typeof window !== 'undefined' && window.innerWidth < 640)) return;
    setIsDragging(true);
    offsetRef.current = { x: clientX - position.x, y: clientY - position.y };
  }, [isMaximized, position]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition(clamp(clientX - offsetRef.current.x, clientY - offsetRef.current.y));
  }, [isDragging, clamp]);

  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const onMouseUp = () => handleDragEnd();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => handleDragEnd();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-1 sm:p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-200 ${
          isMaximized
            ? 'inset-0 sm:inset-4 w-full h-full'
            : 'w-[calc(100vw-8px)] max-h-[85vh] sm:w-[95vw] sm:h-[92vh] sm:max-w-6xl'
        } ${!isMaximized ? 'animate-scale-in' : ''}`}
        style={!isMaximized ? { transform: `translate(${position.x}px, ${position.y}px)` } : undefined}
        onTransitionEnd={() => {
          if (!isMaximized) setPosition({ x: 0, y: 0 });
        }}
      >
        {/* Header - Draggable */}
        <div
          onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches.length === 1) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
          }}
          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl cursor-default sm:cursor-move select-none flex-shrink-0"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Move size={18} className="text-blue-200 flex-shrink-0 hidden sm:block" />
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-white truncate">{title}</h2>
              <p className="text-[10px] sm:text-xs text-blue-200">No. Dokumen: {docNo}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 sm:p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-blue-200 hover:text-white hover:bg-red-500/80 rounded-lg transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div ref={contentRef} className="flex-1 overflow-y-auto p-3 sm:p-6 permit-modal-content" onScroll={() => { savedScrollTop.current = contentRef.current?.scrollTop ?? 0; }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
