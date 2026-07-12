<?php

namespace App\Exports;

use App\Models\CsePermit;
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

class CseExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle, WithEvents
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

    public function title(): string
    {
        return 'Laporan CSE';
    }

    public function collection()
    {
        $query = CsePermit::with('user');

        if ($this->status) {
            $query->where('status', $this->status);
        }
        if ($this->dateFrom) {
            $query->where('tanggal', '>=', $this->dateFrom);
        }
        if ($this->dateTo) {
            $query->where('tanggal', '<=', $this->dateTo);
        }

        return $query->orderBy('tanggal', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Tanggal',
            'Supervisor',
            'Fasilitas',
            'Lokasi',
            'Alasan',
            'Jml Pekerja',
            '%LEL',
            '%O2',
            'PPM H2S',
            'Status',
            'Catatan',
            'Pemohon',
        ];
    }

    public function map($cse): array
    {
        $this->rowNumber++;
        $hasilGas = $cse->hasil_gas ?? [];

        $lel = $hasilGas['lel'] ?? '-';
        $o2 = $hasilGas['o2'] ?? '-';
        $h2s = $hasilGas['h2s'] ?? '-';

        return [
            $this->rowNumber,
            $cse->tanggal ? \Carbon\Carbon::parse($cse->tanggal)->format('d/m/Y') : '-',
            $cse->supervisor ?? '-',
            $cse->fasilitas ?? '-',
            $cse->lokasi ?? '-',
            $cse->alasan ?? '-',
            $cse->jumlah_pekerja ?? '-',
            $lel,
            $o2,
            $h2s,
            ucfirst($cse->status ?? 'Draft'),
            $cse->catatan ?? '-',
            $cse->user->name ?? '-',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 11, 'color' => ['argb' => 'FFFFFF']]],
        ];
    }

    private function getLastColumn($count): string
    {
        return chr(64 + $count);
    }

    public function registerEvents(): array
    {
        return [
            BeforeSheet::class => function (BeforeSheet $event) {
                $sheet = $event->sheet;
                $colCount = 13;
                $lastCol = $this->getLastColumn($colCount);

                $sheet->mergeCells('A1:' . $lastCol . '1');
                $sheet->setCellValue('A1', 'PT. INDUSTRI NABATI LESTARI - PABRIK MINYAK GORENG');
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14)->getColor()->setARGB('2E7D32');
                $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getRowDimension(1)->setRowHeight(30);

                $sheet->mergeCells('A2:' . $lastCol . '2');
                $sheet->setCellValue('A2', 'LAPORAN CONFINED SPACE ENTRY (CSE)');
                $sheet->getStyle('A2')->getFont()->setBold(true)->setSize(12)->getColor()->setARGB('1B5E20');
                $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getRowDimension(2)->setRowHeight(25);

                $sheet->mergeCells('A3:' . $lastCol . '3');
                $sheet->setCellValue('A3', 'No. Dokumen: FM-BSHS-19/02 | No. Revisi: 00 | Tgl. Berlaku: 2024-08-01 | Tgl. Cetak: ' . now()->format('d/m/Y H:i'));
                $sheet->getStyle('A3')->getFont()->setSize(9)->setItalic(true)->getColor()->setARGB('666666');
                $sheet->getStyle('A3')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getRowDimension(3)->setRowHeight(20);
            },
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;
                $lastRow = $sheet->getHighestRow();
                $colCount = 13;
                $lastCol = $this->getLastColumn($colCount);

                $headerRow = 4;
                $headerRange = 'A' . $headerRow . ':' . $lastCol . $headerRow;

                $sheet->getStyle($headerRange)->applyFromArray([
                    'font' => ['bold' => true, 'size' => 9, 'color' => ['argb' => 'FFFFFF']],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => '2E7D32']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => '1B5E20']]],
                ]);
                $sheet->getRowDimension($headerRow)->setRowHeight(35);

                $dataRange = 'A5:' . $lastCol . $lastRow;
                $sheet->getStyle($dataRange)->applyFromArray([
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'CCCCCC']]],
                    'alignment' => ['vertical' => Alignment::VERTICAL_TOP, 'wrapText' => true],
                ]);

                $sheet->getStyle('A5:A' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('B5:B' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('G5:G' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('H5:J' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('K5:K' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

                for ($row = 5; $row <= $lastRow; $row++) {
                    if ($row % 2 == 0) {
                        $sheet->getStyle('A' . $row . ':' . $lastCol . $row)
                            ->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('F5FAF5');
                    }
                    $sheet->getRowDimension($row)->setRowHeight(-1);
                }

                foreach (range('A', $lastCol) as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }

                $sheet->getStyle('A' . $headerRow . ':' . $lastCol . $lastRow)->getFont()->setSize(9);
            },
        ];
    }
}
