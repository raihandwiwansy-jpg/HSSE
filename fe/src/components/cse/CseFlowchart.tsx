'use client';

import { CheckCircle, Clock, XCircle, FileEdit, Send } from 'lucide-react';

interface CseFlowchartProps {
  currentStatus: string;
  catatanReject?: string;
}

const steps = [
  { key: 'draft', label: 'Draft', sublabel: 'Pemohon Isi', icon: FileEdit },
  { key: 'submitted', label: 'Submitted', sublabel: 'Menunggu Review', icon: Send },
  { key: 'approved', label: 'Approved', sublabel: 'Disetujui HSSE', icon: CheckCircle },
  { key: 'completed', label: 'Completed', sublabel: 'Selesai', icon: CheckCircle },
];

export default function CseFlowchart({ currentStatus, catatanReject }: CseFlowchartProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStatus);
  const isRejected = currentStatus === 'rejected';
  const isClosed = currentStatus === 'closed';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 dark:bg-[#1E1E2E] dark:border-[#333355]">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
        Alur Status
      </h3>

      <div className="flex items-start justify-between relative">
        {steps.map((step, index) => {
          let state: 'completed' | 'current' | 'rejected' | 'upcoming' = 'upcoming';
          if (isRejected && index === currentIndex) state = 'rejected';
          else if (isClosed && index === steps.length - 1) state = 'completed';
          else if (index < currentIndex) state = 'completed';
          else if (index === currentIndex) state = 'current';

          const colors = {
            completed: 'bg-green-500 border-green-500 text-white',
            current: 'bg-blue-500 border-blue-500 text-white',
            rejected: 'bg-red-500 border-red-500 text-white',
            upcoming: 'bg-gray-200 border-gray-300 text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500',
          };
          const textColors = {
            completed: 'text-green-600 dark:text-green-400',
            current: 'text-blue-600 dark:text-blue-400',
            rejected: 'text-red-600 dark:text-red-400',
            upcoming: 'text-gray-400 dark:text-gray-500',
          };

          return (
            <div key={step.key} className="flex flex-col items-center flex-1 relative">
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 ${
                    index < currentIndex || (isClosed && index < steps.length - 1)
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  style={{ left: '50%', width: '100%' }}
                />
              )}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${colors[state]}`}
              >
                {state === 'completed' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : state === 'current' ? (
                  <Send className="h-4 w-4" />
                ) : state === 'rejected' ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <p className={`mt-2 text-xs font-semibold text-center ${textColors[state]}`}>
                {step.label}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                {step.sublabel}
              </p>
            </div>
          );
        })}
      </div>

      {(isRejected || isClosed) && (
        <div className={`mt-4 p-3 rounded-xl border ${
          isRejected
            ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-600'
        }`}>
          <p className={`text-xs font-semibold ${
            isRejected ? 'text-red-700 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {isRejected ? 'Ditolak' : 'Ditutup'}
          </p>
          {catatanReject && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{catatanReject}</p>
          )}
        </div>
      )}
    </div>
  );
}
