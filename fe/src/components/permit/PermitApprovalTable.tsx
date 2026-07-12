'use client';

interface ApprovalRowConfig {
  label: string;
  statement?: string;
  tanggalField: string;
  namaField: string;
  jabatanField: string;
  parafField: string;
  bgClass?: string;
  disableName?: boolean;
  rowSpan?: number;
  subLabel?: string;
}

interface PermitApprovalTableProps {
  data: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
  rows: ApprovalRowConfig[];
  /** For "Mengetahui" section with multiple sub-rows */
  mengetahuiRows?: Array<{
    subLabel: string;
    tanggalField: string;
    namaField: string;
    jabatanField: string;
    parafField: string;
  }>;
}

function ApprovalCell({
  field, type, data, update, placeholder,
}: {
  field: string; type?: string; data: Record<string, unknown>;
  update: (k: string, v: unknown) => void; placeholder?: string;
}) {
  const isParaf = field.toLowerCase().includes('paraf');
  const actualPlaceholder = isParaf ? '(Tanda tangan manual)' : placeholder;

  return (
    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
      <input
        type={type || 'text'}
        className={`hse-input text-xs px-2 py-1 ${
          isParaf
            ? 'opacity-60 cursor-not-allowed select-none'
            : ''
        }`}
        value={isParaf ? '' : (data[field] as string) || ''}
        onChange={(e) => !isParaf && update(field, e.target.value)}
        placeholder={actualPlaceholder}
        readOnly={isParaf}
        disabled={isParaf}
      />
    </td>
  );
}

export default function PermitApprovalTable({ data, update, rows, mengetahuiRows }: PermitApprovalTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 min-w-[140px]">Keterangan</th>
            <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Pernyataan</th>
            <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 w-28">Tanggal</th>
            <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 min-w-[120px]">Nama</th>
            <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 min-w-[120px]">Jabatan</th>
            <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 min-w-[100px]">Paraf</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const bg = row.bgClass || (i % 2 === 0 ? '' : 'bg-gray-50 dark:bg-gray-800/30');
            return (
              <tr key={i}>
                <td className={`border border-gray-300 dark:border-gray-600 px-3 py-2 font-semibold text-gray-700 dark:text-gray-300 ${bg}`}>
                  {row.label}
                  {row.subLabel && <div className="text-[10px] font-normal text-gray-500 mt-0.5">{row.subLabel}</div>}
                </td>
                <td className={`border border-gray-300 dark:border-gray-600 px-3 py-2 text-[11px] text-gray-600 dark:text-gray-400 italic ${bg}`}>
                  {row.statement || ''}
                </td>
                <ApprovalCell field={row.tanggalField} type="date" data={data} update={update} />
                <ApprovalCell field={row.namaField} data={data} update={update} placeholder="Nama" />
                <ApprovalCell field={row.jabatanField} data={data} update={update} placeholder="Jabatan" />
                <ApprovalCell field={row.parafField} data={data} update={update} placeholder="Paraf" />
              </tr>
            );
          })}

          {/* Mengetahui Section */}
          {mengetahuiRows && mengetahuiRows.length > 0 && (
            <>
              {mengetahuiRows.map((mr, i) => (
                <tr key={`mengetahui-${i}`}>
                  {i === 0 && (
                    <td
                      className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-semibold text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20"
                      rowSpan={mengetahuiRows.length}
                    >
                      D. Mengetahui
                    </td>
                  )}
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-[11px] text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/20 italic">
                    {mr.subLabel}
                  </td>
                  <ApprovalCell field={mr.tanggalField} type="date" data={data} update={update} />
                  <ApprovalCell field={mr.namaField} data={data} update={update} placeholder="Nama" />
                  <ApprovalCell field={mr.jabatanField} data={data} update={update} placeholder="Jabatan" />
                  <ApprovalCell field={mr.parafField} data={data} update={update} placeholder="Paraf" />
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
