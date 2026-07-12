'use client';

import { useState } from 'react';
import { FileText, FileSpreadsheet, Printer, Loader2 } from 'lucide-react';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';

interface ExportButtonsProps {
  isSingle?: boolean;
  module: string;
  id?: number;
  hideExcel?: boolean;
}

function downloadBlob(response: any, filename: string) {
  const blob = new Blob([response.data]);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function ExportButtons({ isSingle, module, id, hideExcel }: ExportButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (type: 'pdf' | 'excel' | 'single-pdf') => {
    setLoading(type);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (type === 'single-pdf') {
        let url: string;
        if (module === 'permit' && id) {
          url = `/export/permit-single/${id}`;
        } else {
          url = `/export/${module}-single/${id}`;
        }
        const res = await axios.get(url, {
          responseType: 'blob',
          headers,
        });
        downloadBlob(res, `${module}-${id}.pdf`);
        toast.success('PDF berhasil didownload');
      } else if (type === 'pdf') {
        const res = await axios.get(`/export/${module}-pdf`, {
          responseType: 'blob',
          headers,
        });
        downloadBlob(res, `${module}.pdf`);
        toast.success('PDF berhasil didownload');
      } else {
        const res = await axios.get(`/export/${module}-excel`, {
          responseType: 'blob',
          headers,
        });
        downloadBlob(res, `${module}.xlsx`);
        toast.success('Excel berhasil didownload');
      }
    } catch (error: any) {
      toast.error(`Gagal download: ${error?.response?.data?.message || error?.message || 'Terjadi kesalahan'}`);
    } finally {
      setLoading(null);
    }
  };

  if (isSingle) {
    return (
      <button
        onClick={() => handleExport('single-pdf')}
        disabled={loading === 'single-pdf'}
        className="hse-btn-primary btn-scale text-sm"
      >
        {loading === 'single-pdf' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Printer size={16} />
        )}
        {loading === 'single-pdf' ? 'Memproses...' : 'Cetak PDF'}
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport('pdf')}
        disabled={loading === 'pdf'}
        className="hse-btn-primary btn-scale text-sm"
      >
        {loading === 'pdf' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText size={16} />
        )}
        {loading === 'pdf' ? '...' : 'PDF'}
      </button>
      {!hideExcel && (
        <button
          onClick={() => handleExport('excel')}
          disabled={loading === 'excel'}
          className="hse-btn-secondary btn-scale text-sm"
        >
          {loading === 'excel' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet size={16} />
          )}
          {loading === 'excel' ? '...' : 'Excel'}
        </button>
      )}
    </div>
  );
}
