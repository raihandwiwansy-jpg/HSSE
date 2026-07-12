<?php

namespace App\Exports;

use App\Models\WhpPermit;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\BeforeSheet;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class WhpExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle, WithEvents
{
    protected $status;
    protected $dateFrom;
    protected $dateTo;
    protected $rowNumber = 0;

    public function __construct($status = null, $dateFrom = null, $dateTo = null)
    {
        $this->status = $status;
        $this->dateFrom = $dateFrom;
        $this->dateTo = $dateTo;
    }

    public function title(): string { return 'Laporan WHP'; }

    public function collection()
    {
        $query = WhpPermit::with('user');
        if ($this->status) $query->where('status', $this->status);
        if ($this->dateFrom) $query->where('tanggal', '>=', $this->dateFrom);
        if ($this->dateTo) $query->where('tanggal', '<=', $this->dateTo);
        return $query->orderBy('tanggal', 'desc')->get();
    }

    public function headings(): array
    {
        return ['No', 'Tanggal', 'Lokasi', 'Deskripsi Pekerjaan', 'Waktu Mulai', 'Waktu Selesai', 'Peralatan', 'Status', 'Catatan', 'Pemohon'];
    }

    public function map($whp): array
    {
        $this->rowNumber++;
        return [
            $this->rowNumber,
            $whp->tanggal ? \Carbon\Carbon::parse($whp->tanggal)->format('d/m/Y') : '-',
            $whp->lokasi ?? '-',
            $whp->deskripsi_pekerjaan ?? '-',
            $whp->waktu_mulai ?? '-',
            $whp->waktu_selesai ?? '-',
            $whp->peralatan ?? '-',
            ucfirst($whp->status ?? 'Draft'),
            $whp->catatan ?? '-',
            $whp->user->name ?? '-',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 11, 'color' => ['argb' => 'FFFFFF']]]];
    }

    private function getLastColumn($count): string { return chr(64 + $count); }

    public function registerEvents(): array
    {
        return [
            BeforeSheet::class => function (BeforeSheet $event) {
                $sheet = $event->sheet;
                $lastCol = $this->getLastColumn(10);
                $sheet->mergeCells('A1:' . $lastCol . '1');
                $sheet->setCellValue('A1', 'PT. INDUSTRI NABATI LESTARI - PABRIK MINYAK GORENG');
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14)->getColor()->setARGB('2E7D32');
                $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getRowDimension(1)->setRowHeight(30);
                $sheet->mergeCells('A2:' . $lastCol . '2');
                $sheet->setCellValue('A2', 'LAPORAN WORK AT HEIGHT PERMIT (WHP)');
                $sheet->getStyle('A2')->getFont()->setBold(true)->setSize(12)->getColor()->setARGB('1B5E20');
                $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getRowDimension(2)->setRowHeight(25);
                $sheet->mergeCells('A3:' . $lastCol . '3');
                $sheet->setCellValue('A3', 'No. Dokumen: FM-BSHS-19/04 | No. Revisi: 00 | Tgl. Berlaku: 2024-08-01 | Tgl. Cetak: ' . now()->format('d/m/Y H:i'));
                $sheet->getStyle('A3')->getFont()->setSize(9)->setItalic(true)->getColor()->setARGB('666666');
                $sheet->getStyle('A3')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            },
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;
                $lastRow = $sheet->getHighestRow();
                $lastCol = $this->getLastColumn(10);
                $headerRange = 'A4:' . $lastCol . '4';
                $sheet->getStyle($headerRange)->applyFromArray([
                    'font' => ['bold' => true, 'size' => 9, 'color' => ['argb' => 'FFFFFF']],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => '2E7D32']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => '1B5E20']]],
                ]);
                $sheet->getStyle('A5:' . $lastCol . $lastRow)->applyFromArray([
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'CCCCCC']]],
                    'alignment' => ['vertical' => Alignment::VERTICAL_TOP, 'wrapText' => true],
                ]);
                for ($row = 5; $row <= $lastRow; $row++) {
                    if ($row % 2 == 0) $sheet->getStyle('A' . $row . ':' . $lastCol . $row)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('F5FAF5');
                }
                foreach (range('A', $lastCol) as $col) $sheet->getColumnDimension($col)->setAutoSize(true);
                $sheet->getStyle('A4:' . $lastCol . $lastRow)->getFont()->setSize(9);
            },
        ];
    }
}
