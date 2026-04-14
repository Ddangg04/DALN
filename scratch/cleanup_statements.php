<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Donation;
use App\Models\Campaign;
use App\Models\Statement;

echo "--- Dọn dẹp dữ liệu cũ trên Dòng chảy minh bạch ---\n";

// 1. Đồng bộ dữ liệu từ Donations đã bị xóa
$deletedDonationIds = Donation::onlyTrashed()->pluck('transaction_id')->filter()->toArray();
if (!empty($deletedDonationIds)) {
    $countD = Statement::whereIn('transaction_id', $deletedDonationIds)
        ->whereNull('deleted_at')
        ->update(['deleted_at' => now()]);
    echo "Đã ẩn $countD bản ghi sổ cái từ các khoản quyên góp đã xóa.\n";
} else {
    echo "Không tìm thấy khoản quyên góp nào bị xóa.\n";
}

// 2. Đồng bộ dữ liệu từ Campaigns đã bị xóa
$deletedCampaignIds = Campaign::onlyTrashed()->pluck('id')->toArray();
if (!empty($deletedCampaignIds)) {
    $countC = Statement::whereIn('campaign_id', $deletedCampaignIds)
        ->whereNull('deleted_at')
        ->update(['deleted_at' => now()]);
    echo "Đã ẩn $countC bản ghi sổ cái từ các chiến dịch đã xóa.\n";
} else {
    echo "Không tìm thấy chiến dịch nào bị xóa.\n";
}

echo "Hoàn thành dọn dẹp.\n";
