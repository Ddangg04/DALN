<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Donation;
use App\Models\Campaign;
use App\Models\Statement;

echo "--- Dọn dẹp triệt để dữ liệu mồ côi trên Dòng chảy minh bạch ---\n";

// Xóa các bản ghi 'in' không có Donation tương ứng
$statementsIn = Statement::where('type', 'in')->get();
$countDeletedIn = 0;
foreach ($statementsIn as $st) {
    if (!Donation::where('transaction_id', $st->transaction_id)->exists()) {
        $st->forceDelete();
        $countDeletedIn++;
    }
}
echo "Đã xóa vĩnh viễn $countDeletedIn bản ghi 'Thu' mồ côi.\n";

// Xóa các bản ghi 'out' không có Campaign tương ứng (hoặc chiến dịch đã bị xóa vĩnh viễn)
$statementsOut = Statement::where('type', 'out')->get();
$countDeletedOut = 0;
foreach ($statementsOut as $st) {
    if (!Campaign::where('id', $st->campaign_id)->exists()) {
        $st->forceDelete();
        $countDeletedOut++;
    }
}
echo "Đã xóa vĩnh viễn $countDeletedOut bản ghi 'Chi' mồ côi.\n";

echo "Dòng chảy minh bạch hiện đã sạch hoàn toàn dữ liệu mồ côi.\n";
