<?php
$content = file_get_contents('/home/raihan/PKL/HSE/be/app/Http/Controllers/DashboardController.php');

$trend_code = <<<PHP
        \$tahunIniStr = now()->format('Y');
        \$trendData = [];
        \$months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        for (\$i = 1; \$i <= 12; \$i++) {
            \$inspeksi = \App\Models\SafetyPatrol::whereYear('tanggal', \$tahunIniStr)
                ->whereMonth('tanggal', \$i)->count();
            
            \$temuan = \App\Models\Insiden::whereYear('tanggal_kejadian', \$tahunIniStr)
                ->whereMonth('tanggal_kejadian', \$i)->count();

            \$trendData[] = [
                'month' => \$months[\$i - 1],
                'Inspection' => \$inspeksi,
                'Finding' => \$temuan,
            ];
        }

PHP;

// Find where to insert in performanceBoard
$search = "\$todayDigits = array_map('intval', str_split(now()->format('dmY')));";
$content = str_replace($search, $search . "\n\n" . $trend_code, $content);

// Add trend_data to response
$search_response = "'insiden_bulan_lalu' => \$totalInsidenBulanLalu,";
$content = str_replace($search_response, $search_response . "\n            'trend_data' => \$trendData,", $content);

file_put_contents('/home/raihan/PKL/HSE/be/app/Http/Controllers/DashboardController.php', $content);
echo "Patched DashboardController.php\n";
