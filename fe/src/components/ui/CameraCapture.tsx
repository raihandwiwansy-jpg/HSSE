'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
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

const base64ToFile = (base64String: string, filename: string): File => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export default function CameraCapture({ photos, onChange, maxPhotos = 10 }: CameraCaptureProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Gagal mengakses kamera. Pastikan izin kamera diberikan.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg');
      const filename = `photo_${Date.now()}.jpg`;
      const file = base64ToFile(base64, filename);
      
      onChange([...photos, { file, preview: base64 }]);
      stopCamera();
    }
  };

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
            onClick={startCamera}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 border-2 border-dashed border-blue-400 dark:border-blue-500 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
          >
            <Camera size={22} className="group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold">Kamera</span>
          </button>

          {/* Gallery button */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-55 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-550 transition-colors group"
          >
            <ImageIcon size={22} className="group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold">Galeri</span>
          </button>

          {/* Hidden input */}
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
      <div className="flex items-center justify-between text-[10px] text-gray-450">
        <span>{photos.length} foto ditambahkan</span>
        {!canAdd && (
          <span className="text-amber-500 font-medium">Maks {maxPhotos} foto</span>
        )}
        {canAdd && photos.length > 0 && (
          <span>Maks {maxPhotos} foto</span>
        )}
      </div>

      {/* Active Camera Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-[99999] bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video w-full max-w-md border border-gray-700 shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            
            {/* Overlay Shutter Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
              <button
                type="button"
                onClick={capturePhoto}
                className="w-14 h-14 bg-white hover:bg-gray-100 rounded-full border-4 border-gray-350 flex items-center justify-center shadow-lg transition-transform transform active:scale-95"
                title="Ambil Foto"
              >
                <div className="w-10 h-10 bg-red-600 hover:bg-red-750 rounded-full" />
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="p-2.5 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full transition-colors shadow"
                title="Tutup Kamera"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          {cameraError && (
            <p className="text-xs text-red-500 text-center font-medium mt-4">
              {cameraError}
            </p>
          )}
        </div>
      )}

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
