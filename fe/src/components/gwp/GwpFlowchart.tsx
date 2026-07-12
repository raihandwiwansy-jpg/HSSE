'use client';

import { CheckCircle, PlayCircle, XCircle } from 'lucide-react';
import type { GwpApproval } from '@/types';

interface FlowchartStep {
  key: string;
  label: string;
  sublabel: string;
}

interface GwpFlowchartProps {
  currentStatus: string;
  approvals?: GwpApproval[];
  submittedAt?: string;
  approvedAt?: string;
  completedAt?: string;
  catatanReject?: string;
}

const steps: FlowchartStep[] = [
  { key: 'draft', label: 'Draft', sublabel: 'Pemohon Izin' },
  { key: 'submitted', label: 'Submitted', sublabel: 'HSSE Review' },
  { key: 'approved', label: 'Approved', sublabel: 'HSSE Approve' },
  { key: 'completed', label: 'Completed', sublabel: 'Supervisor Verify' },
];

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function GwpFlowchart({
  currentStatus,
  approvals,
  submittedAt,
  approvedAt,
  completedAt,
  catatanReject,
}: GwpFlowchartProps) {
  const currentStepIndex = steps.findIndex(s => s.key === currentStatus);
  const isRejected = currentStatus === 'rejected';

  const getStepState = (stepIndex: number) => {
    if (isRejected && stepIndex === currentStepIndex) return 'rejected';
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const getStepColors = (state: string) => {
    switch (state) {
      case 'completed':
        return 'bg-[#1A365D] border-[#1A365D] text-white shadow-lg shadow-[#1A365D]/30';
      case 'current':
        return 'bg-[#3182CE] border-[#3182CE] text-white shadow-lg shadow-[#3182CE]/30';
      case 'rejected':
        return 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-700 dark:border-gray-600';
    }
  };

  const getLineColors = (state: string) => {
    switch (state) {
      case 'completed': return 'bg-[#1A365D]';
      case 'rejected': return 'bg-red-400';
      default: return 'bg-gray-200 dark:bg-gray-600';
    }
  };

  const pemohonApproval = approvals?.find(a => a.tipe === 'pemohon');
  const hseApproval = approvals?.find(a => a.tipe === 'hse');
  const supervisorApproval = approvals?.find(a => a.tipe === 'supervisor');

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:bg-[#1E1E2E] dark:border-[#333355]">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6 uppercase tracking-wide">
        Alur Flowchart GWP
      </h3>

      {/* Desktop: Horizontal Flow */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between relative mb-8">
          {steps.map((step, index) => {
            const state = getStepState(index);
            const isLast = index === steps.length - 1;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1 relative">
                {!isLast && (
                  <div className="absolute top-5 left-1/2 w-full h-1 -translate-y-1/2">
                    <div className={`h-full rounded-full transition-all duration-500 ${getLineColors(getStepState(index))}`} />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 font-bold text-sm transition-all duration-300 ${getStepColors(state)}`}>
                  {state === 'completed' && <CheckCircle className="h-5 w-5" />}
                  {state === 'current' && !isRejected && <PlayCircle className="h-5 w-5" />}
                  {state === 'rejected' && <XCircle className="h-5 w-5" />}
                  {state === 'upcoming' && <span>{index + 1}</span>}
                </div>
                <span className={`mt-2 text-xs font-semibold text-center ${state === 'current' ? 'text-[#3182CE] dark:text-[#3182CE]' : state === 'completed' ? 'text-[#1A365D] dark:text-[#3182CE]' : state === 'rejected' ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {step.label}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-0.5">{step.sublabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical Flow */}
      <div className="md:hidden space-y-0">
        {steps.map((step, index) => {
          const state = getStepState(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.key} className="flex items-start gap-3 relative">
              {!isLast && (
                <div className="absolute left-4 top-10 w-0.5 h-full">
                  <div className={`h-full w-full ${getLineColors(getStepState(index))}`} />
                </div>
              )}
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 flex-shrink-0 transition-all duration-300 ${getStepColors(state)}`}>
                {state === 'completed' && <CheckCircle className="h-4 w-4" />}
                {state === 'current' && !isRejected && <PlayCircle className="h-4 w-4" />}
                {state === 'rejected' && <XCircle className="h-4 w-4" />}
                {state === 'upcoming' && <span className="text-xs">{index + 1}</span>}
              </div>
              <div className="pb-6 flex-1">
                <p className={`text-sm font-semibold ${state === 'current' ? 'text-[#3182CE] dark:text-[#3182CE]' : state === 'completed' ? 'text-[#1A365D] dark:text-[#3182CE]' : state === 'rejected' ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{step.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actor Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
        {/* Pemohon */}
        <div className={`p-3 rounded-xl border transition-all ${pemohonApproval?.status === 'approved' ? 'border-[#1A365D] bg-[#EBF4FF] dark:border-[#3182CE] dark:bg-[#1E3A5F]' : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50'}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-[#EBF4FF] dark:bg-[#1E3A5F] flex items-center justify-center">
              <span className="text-xs font-bold text-[#1A365D] dark:text-[#3182CE]">1</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Pemohon Izin</p>
              <p className="text-[10px] text-gray-400">Langkah 1</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{pemohonApproval?.nama || '-'}</p>
          <p className="text-[10px] text-gray-400 mt-1">{formatDate(submittedAt)}</p>
        </div>

        {/* HSE */}
        <div className={`p-3 rounded-xl border transition-all ${hseApproval?.status === 'approved' ? 'border-[#1A365D] bg-[#EBF4FF] dark:border-[#3182CE] dark:bg-[#1E3A5F]' : hseApproval?.status === 'rejected' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50'}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-[#FEF3C7] dark:bg-[#422006] flex items-center justify-center">
              <span className="text-xs font-bold text-[#D97706] dark:text-[#FCD34D]">2</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">HSSE (Pemberi Izin)</p>
              <p className="text-[10px] text-gray-400">Langkah 2-3</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{hseApproval?.nama || '-'}</p>
          <p className="text-[10px] text-gray-400 mt-1">{formatDate(approvedAt)}</p>
          {hseApproval?.catatan && (
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 italic">&quot;{hseApproval.catatan}&quot;</p>
          )}
        </div>

        {/* Supervisor */}
        <div className={`p-3 rounded-xl border transition-all ${supervisorApproval?.status === 'approved' ? 'border-[#1A365D] bg-[#EBF4FF] dark:border-[#3182CE] dark:bg-[#1E3A5F]' : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50'}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-[#D1FAE5] dark:bg-[#064E3B] flex items-center justify-center">
              <span className="text-xs font-bold text-[#059669] dark:text-[#6EE7B7]">3</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Supervisor</p>
              <p className="text-[10px] text-gray-400">Langkah 4</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{supervisorApproval?.nama || '-'}</p>
          <p className="text-[10px] text-gray-400 mt-1">{formatDate(completedAt)}</p>
        </div>
      </div>

      {/* Rejected notice */}
      {isRejected && catatanReject && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl dark:bg-red-900/20 dark:border-red-800">
          <p className="text-xs font-semibold text-red-700 dark:text-red-400">Alasan Reject:</p>
          <p className="text-sm text-red-600 dark:text-red-300">{catatanReject}</p>
        </div>
      )}
    </div>
  );
}
