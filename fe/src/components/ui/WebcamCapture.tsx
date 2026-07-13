'use client';

import { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Upload, Trash2, CameraOff } from 'lucide-react';
import Button from './Button';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface WebcamCaptureProps {
  onCapture: (base64OrFile: string | File | null, previewUrl: string | null) => void;
  initialPreview?: string | null;
}

export default function WebcamCapture({ onCapture, initialPreview = null }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPreview) {
      setPreview(initialPreview);
    }
  }, [initialPreview]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
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
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Gagal mengakses kamera. Pastikan izin kamera diberikan.');
      setIsCameraActive(false);
      toast.error('Tidak dapat mengakses kamera');
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
      setPreview(base64);
      onCapture(base64, base64);
      stopCamera();
      toast.success('Foto berhasil diambil!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran foto maksimal adalah 2MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Format foto harus JPEG atau PNG');
        return;
      }
      setPreview(URL.createObjectURL(file));
      onCapture(file, URL.createObjectURL(file));
      stopCamera();
    }
  };

  const removePhoto = () => {
    setPreview(null);
    onCapture(null, null);
  };

  return (
    <div className="space-y-4">
      {/* Active Camera View */}
      {isCameraActive && (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video w-full max-w-md mx-auto border border-gray-700 shadow-inner">
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
              className="w-14 h-14 bg-white hover:bg-gray-100 rounded-full border-4 border-gray-300 flex items-center justify-center shadow-lg transition-transform transform active:scale-95"
              title="Ambil Foto"
            >
              <div className="w-10 h-10 bg-red-650 hover:bg-red-750 rounded-full" />
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
      )}

      {/* Preview captured image */}
      {!isCameraActive && preview && (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-800 p-2 max-w-sm mx-auto shadow-sm">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden">
            <Image
              src={preview}
              alt="Bukti Foto"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={removePhoto}
            className="absolute top-4 right-4 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
            title="Hapus Foto"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Capture trigger panel */}
      {!isCameraActive && !preview && (
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {/* Active webcam button */}
          <button
            type="button"
            onClick={startCamera}
            className="flex flex-col items-center justify-center gap-2 py-5 border-2 border-dashed border-red-200 dark:border-red-900/40 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/10 hover:border-red-400 transition-all group"
          >
            <Camera size={26} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Ambil Foto (Kamera)</span>
          </button>

          {/* Upload file button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 py-5 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-55/50 dark:hover:bg-gray-800/50 hover:border-gray-400 transition-all group"
          >
            <Upload size={26} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Pilih File (Galeri)</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {cameraError && (
        <p className="text-xs text-red-500 text-center font-medium mt-2">
          {cameraError}
        </p>
      )}
    </div>
  );
}
