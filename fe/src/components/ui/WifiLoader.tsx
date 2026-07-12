'use client';

import React from 'react';

interface WifiLoaderProps {
  text?: string;
  className?: string;
  fullscreen?: boolean;
}

export default function WifiLoader({ text = 'Memuat...', className = '', fullscreen = false }: WifiLoaderProps) {
  const loader = (
    <div id="wifi-loader" className={className} style={{ transform: 'scale(1)' }}>
      <svg className="circle-outer" viewBox="0 0 86 86">
        <circle className="back" cx="43" cy="43" r="40"></circle>
        <circle className="front" cx="43" cy="43" r="40"></circle>
        <circle className="new" cx="43" cy="43" r="40"></circle>
      </svg>
      <svg className="circle-middle" viewBox="0 0 60 60">
        <circle className="back" cx="30" cy="30" r="27"></circle>
        <circle className="front" cx="30" cy="30" r="27"></circle>
      </svg>
      <svg className="circle-inner" viewBox="0 0 34 34">
        <circle className="back" cx="17" cy="17" r="14"></circle>
        <circle className="front" cx="17" cy="17" r="14"></circle>
      </svg>
      <div className="text" data-text={text}></div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50/85 dark:bg-[#0A0A14]/85 backdrop-blur-sm transition-all duration-300">
        {loader}
      </div>
    );
  }

  return loader;
}
