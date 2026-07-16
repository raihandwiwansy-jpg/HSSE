<?php
require 'vendor/autoload.php';
$spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load('storage/app/templates/man_hours_template.xlsx');
$sheet = $spreadsheet->getSheetByName('rekap');
for ($col = 'A'; $col !== 'Z'; $col++) {
    echo $col . "3: " . $sheet->getCell($col.'3')->getValue() . "\n";
    echo $col . "4: " . $sheet->getCell($col.'4')->getValue() . "\n";
}
