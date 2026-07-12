'use client';

import { useRef, useState, useCallback } from 'react';
import { Camera, Upload, X, Trash2, Image as ImageIcon, ZoomIn } from 'lucide-react';

interface PhotoItem {
  file: File;
  preview: string;
}

interface CameraCaptureProps {
  photos: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
  maxPhotos?: number;
}

export default function CameraCapture({ photos, onChange, maxPhotos = 10 }: CameraCaptureProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const remaining = maxPhotos - photos.length;
    const toAdd = arr.slice(0, remaining);
    const newPhotos: PhotoItem[] = [];
    let loaded = 0;

    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPhotos.push({ file, preview: ev.target?.result as string });
        loaded++;
        if (loaded === toAdd.length) {
          onChange([...photos, ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [photos, onChange, maxPhotos]);

  const removePhoto = (idx: number) => {
    onChange(photos.filter((_, i) => i !== idx));
  };

  const canAdd = photos.length < maxPhotos;

  return (
    <div className="space-y-3">
      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p, idx) => (
            <div key={idx} className="relative group aspect-square">
              <img
                src={p.preview}
                alt={`Foto ${idx + 1}`}
                className="w-full h-full object-cover rounded-xl border border-gray-200 dark:border-gray-600 cursor-zoom-in"
                onClick={() => setLightboxSrc(p.preview)}
              />
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1.5">
                <button
                  onClick={() => setLightboxSrc(p.preview)}
                  className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                  title="Lihat full"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={() => removePhoto(idx)}
                  className="p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <span className="absolute bottom-1 left-1 text-[9px] bg-black/50 text-white px-1.5 py-0.5 rounded-md font-medium">
                {idx + 1}/{photos.length}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add photo buttons */}
      {canAdd && (
        <div className="flex gap-2">
          {/* Camera button */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 border-2 border-dashed border-blue-400 dark:border-blue-500 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
          >
            <Camera size={22} className="group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold">Kamera</span>
          </button>

          {/* Gallery button */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-colors group"
          >
            <ImageIcon size={22} className="group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold">Galeri</span>
          </button>

          {/* Hidden inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
      )}

      {/* Count info */}
      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <span>{photos.length} foto ditambahkan</span>
        {!canAdd && (
          <span className="text-amber-500 font-medium">Maks {maxPhotos} foto</span>
        )}
        {canAdd && photos.length > 0 && (
          <span>Maks {maxPhotos} foto</span>
        )}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            onClick={() => setLightboxSrc(null)}
          >
            <X size={22} />
          </button>
          <img
            src={lightboxSrc}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
