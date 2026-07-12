<?php

namespace App\Exports;

use App\Models\Apd;
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

class ApdExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle, WithEvents
{
    protected $status;
    protected $rowNumber = 0;

    public function __construct($status = null)
    {
        $this->status = $status;
    }

    public function title(): string
    {
        return 'Laporan APD';
    }

    public function collection()
    {
        $query = Apd::query();

        if ($this->status) {
            $query->where('status', $this->status);
        }

        return $query->orderBy('nama')->get();
    }

    public function headings(): array
    {
        return ['No', 'Kode', 'Nama APD', 'Stok', 'Satuan', 'Tanggal Kadaluarsa', 'Status'];
    }

    public function map($apd): array
    {
        $this->rowNumber++;
        return [
            $this->rowNumber,
            $apd->kode,
            $apd->nama,
            $apd->stok,
            $apd->satuan,
            $apd->tanggal_kadaluarsa ? \Carbon\Carbon::parse($apd->tanggal_kadaluarsa)->format('d/m/Y') : '-',
            ucfirst($apd->status),
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
                $colCount = 7;
                $lastCol = $this->getLastColumn($colCount);

                $sheet->mergeCells('A1:' . $lastCol . '1');
                $sheet->setCellValue('A1', 'PT. INDUSTRI NABATI LESTARI - PABRIK MINYAK GORENG');
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14)->getColor()->setARGB('2E7D32');
                $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getRowDimension(1)->setRowHeight(30);

                $sheet->mergeCells('A2:' . $lastCol . '2');
                $sheet->setCellValue('A2', 'LAPORAN ALAT PELINDUNG DIRI (APD)');
                $sheet->getStyle('A2')->getFont()->setBold(true)->setSize(12)->getColor()->setARGB('1B5E20');
                $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getRowDimension(2)->setRowHeight(25);

                $sheet->mergeCells('A3:' . $lastCol . '3');
                $sheet->setCellValue('A3', 'No. Dokumen: FM-BSHS-19/APD | No. Revisi: 00 | Tgl. Cetak: ' . now()->format('d/m/Y H:i'));
                $sheet->getStyle('A3')->getFont()->setSize(9)->setItalic(true)->getColor()->setARGB('666666');
                $sheet->getStyle('A3')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getRowDimension(3)->setRowHeight(20);
            },
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;
                $lastRow = $sheet->getHighestRow();
                $colCount = 7;
                $lastCol = $this->getLastColumn($colCount);

                $headerRow = 4;
                $headerRange = 'A' . $headerRow . ':' . $lastCol . $headerRow;

                $sheet->getStyle($headerRange)->applyFromArray([
                    'font' => ['bold' => true, 'size' => 10, 'color' => ['argb' => 'FFFFFF']],
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

                for ($row = 5; $row <= $lastRow; $row++) {
                    if ($row % 2 == 0) {
                        $sheet->getStyle('A' . $row . ':' . $lastCol . $row)
                            ->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('F5FAF5');
                    }
                }

                $sheet->getStyle('A' . $headerRow . ':' . $lastCol . $lastRow)->getFont()->setSize(9);
            },
        ];
    }
}
