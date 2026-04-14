<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Campaign;
use App\Models\Statement;
use App\Models\News;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        foreach (['admin', 'user', 'donor', 'volunteer', 'requester'] as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@daln.com'],
            ['name' => 'Admin VNHeart', 'password' => bcrypt('123456')]
        );
        if (!$admin->hasRole('admin')) $admin->assignRole('admin');

        // Basic user
        $user = User::firstOrCreate(
            ['email' => 'user@daln.com'],
            ['name' => 'Nguyen Van A', 'password' => bcrypt('123456')]
        );
        if (!$user->hasRole('user')) $user->assignRole('user');

        // Donor
        $donor = User::firstOrCreate(
            ['email' => 'donor@daln.com'],
            ['name' => 'Tran Thi B', 'password' => bcrypt('123456')]
        );
        if (!$donor->hasRole('donor')) $donor->assignRole('donor');

        // Sample Campaigns
        $campaigns = [
            [
                'title' => 'Xây Trường Mầm Non Bản Cao',
                'slug' => 'xay-truong-mam-non-ban-cao',
                'description' => 'Hơn 200 em nhỏ vùng cao đang học trong những phòng học tạm bợ dột nát. Hãy cùng nhau xây dựng ngôi trường mới khang trang, ấm áp cho các em.',
                'content' => '<p>Bản Cao là một bản làng hẻo lánh nằm ở độ cao 1.200m so với mực nước biển thuộc tỉnh Hà Giang. Điều kiện kinh tế của người dân nơi đây còn rất nhiều khó khăn.</p>
                <p>Hơn 200 em nhỏ đang phải học trong những phòng học được dựng bằng tre nứa, mái lợp lá cọ, mỗi khi trời mưa bão là lại bị dột, gió lùa. Mùa đông giá rét, các em phải co ro trong những chiếc áo mỏng manh, trên những chiếc ghế gỗ cũ kỹ.</p>
                <p>Dự án <strong>Xây Trường Mầm Non Bản Cao</strong> mong muốn huy động đủ kinh phí để xây dựng một ngôi trường mầm non kiên cố, có đủ phòng học, nhà vệ sinh, sân chơi cho trẻ em. Mỗi đồng quyên góp của bạn sẽ là nền tảng cho tương lai tươi sáng của các em.</p>',
                'target_amount' => 200000000,
                'raised_amount' => 156000000,
                'start_date' => now()->subDays(30),
                'end_date' => now()->addDays(60),
                'status' => 'active',
                'image_url' => '/images/campaign_1.png',
            ],
            [
                'title' => 'Bữa Cơm Yêu Thương Bệnh Nhi',
                'slug' => 'bua-com-yeu-thuong-benh-nhi',
                'description' => 'Mỗi ngày có hàng trăm bệnh nhi nghèo điều trị tại bệnh viện nhưng không có tiền mua cơm. Hãy cùng chúng tôi mang những bữa cơm ấm đến với các em.',
                'content' => '<p>Tại các bệnh viện nhi lớn ở Hà Nội và TP.HCM, mỗi ngày có hàng trăm gia đình nghèo phải đưa con lên điều trị bệnh. Nhiều gia đình đến từ vùng sâu vùng xa, không có tiền trọ, tiền ăn.</p>
                <p>Chương trình <strong>Bữa Cơm Yêu Thương</strong> đã hoạt động được 3 năm, mỗi ngày cung cấp miễn phí 300-500 suất cơm cho bệnh nhi và người thân. Nhưng nguồn kinh phí đang dần cạn kiệt. Chúng tôi cần sự giúp đỡ của cộng đồng để duy trì hoạt động này.</p>',
                'target_amount' => 50000000,
                'raised_amount' => 45000000,
                'start_date' => now()->subDays(45),
                'end_date' => now()->addDays(15),
                'status' => 'active',
                'image_url' => '/images/campaign_2.png',
            ],
            [
                'title' => 'Áo Ấm Vùng Cao Mùa Đông 2026',
                'slug' => 'ao-am-vung-cao-mua-dong-2026',
                'description' => 'Mùa đông vùng cao nhiệt độ xuống dưới 5°C. Hàng nghìn em nhỏ không có áo ấm để mặc. Mỗi chiếc áo bạn trao là một mùa đông ấm áp.',
                'content' => '<p>Vùng núi phía Bắc Việt Nam mùa đông thường xuyên có sương muối, nhiệt độ xuống dưới 0°C. Trẻ em nghèo ở đây thiếu quần áo ấm trầm trọng.</p>
                <p>Chúng tôi đang thu mua áo khoác mới, chăn ấm để gửi đến các bé. Mỗi suất gồm 1 áo khoác + 1 bộ quần áo ấm, trị giá 200.000đ. Số tiền quyên góp sẽ được công khai minh bạch 100%.</p>',
                'target_amount' => 300000000,
                'raised_amount' => 120000000,
                'start_date' => now()->subDays(10),
                'end_date' => now()->addDays(80),
                'status' => 'active',
                'image_url' => '/images/campaign_3.png',
            ],
            [
                'title' => 'Học Bổng Ước Mơ Vùng Cao 2026',
                'slug' => 'hoc-bong-uoc-mo-vung-cao-2026',
                'description' => 'Giúp 50 học sinh giỏi vùng cao có hoàn cảnh khó khăn được đến trường. Mỗi suất học bổng 3.000.000đ/năm sẽ thắp sáng ước mơ các em.',
                'content' => '<p>Năm 2026, Quỹ Ước Mơ Nhỏ tiếp tục phát động chương trình Học Bổng Ước Mơ Vùng Cao, nhằm hỗ trợ 50 học sinh giỏi có hoàn cảnh đặc biệt khó khăn tại các tỉnh vùng núi phía Bắc.</p>',
                'target_amount' => 150000000,
                'raised_amount' => 78000000,
                'start_date' => now()->subDays(20),
                'end_date' => now()->addDays(40),
                'status' => 'active',
                'image_url' => null,
            ],
        ];

        foreach ($campaigns as $c) {
            $campaign = Campaign::firstOrCreate(['slug' => $c['slug']], $c);
            
            // Add some sample statements for transparency
            if ($campaign->id == 1) { // Xây trường
                Statement::create([
                    'transaction_date' => now()->subDays(15),
                    'amount' => 50000000,
                    'content' => 'Quyên góp từ Tập đoàn ABC cho quỹ xây trường',
                    'account_name' => 'TAP DOAN ABC',
                    'type' => 'in',
                    'campaign_id' => $campaign->id,
                    'transaction_id' => 'MBVNH' . rand(10000, 99999)
                ]);
                Statement::create([
                    'transaction_date' => now()->subDays(10),
                    'amount' => -20000000,
                    'content' => 'Thanh toán đợt 1 tiền nguyên vật liệu xây dựng (xi măng, sắt thép)',
                    'account_name' => 'CONG TY VAT LIEU XAY DUNG HANOI',
                    'type' => 'out',
                    'campaign_id' => $campaign->id,
                    'transaction_id' => 'MBVNH' . rand(10000, 99999)
                ]);
            }
            
            if ($campaign->id == 2) { // Bữa cơm
                Statement::create([
                    'transaction_date' => now()->subDays(5),
                    'amount' => 10000000,
                    'content' => 'Ủng hộ 1000 suất cơm từ nhà hảo tâm ẩn danh',
                    'account_name' => 'NHA HAO TAM AN DANH',
                    'type' => 'in',
                    'campaign_id' => $campaign->id,
                    'transaction_id' => 'MBVNH' . rand(10000, 99999)
                ]);
            }
        }

        // Add sample news
        $news = [
            [
                'title' => 'VNHeart chính thức đạt mốc 80 tỷ đồng quyên góp',
                'slug' => 'vnheart-dat-moc-80-ty-dong',
                'summary' => 'Hành trình 2 năm kết nối yêu thương đã mang lại những thay đổi kỳ diệu cho hàng nghìn trẻ em vùng cao.',
                'content' => '<p>Ngày hôm nay, VNHeart tự hào thông báo chúng ta đã chính thức vượt mốc 80 tỷ đồng tổng giá trị quyên góp được giải ngân...</p>',
                'image_url' => '/images/news_1.png',
                'status' => 'published',
                'author_id' => $admin->id,
            ],
            [
                'title' => 'Khánh thành điểm trường mầm non Bản Cao tại Hà Giang',
                'slug' => 'khanh-thanh-diem-truong-ban-cao',
                'summary' => 'Sau 4 tháng thi công khẩn trương, điểm trường đã hoàn thành trong niềm vui sướng của thầy cô và các em nhỏ.',
                'content' => '<p>Sáng ngày 14/04, lễ khánh thành điểm trường mầm non Bản Cao đã diễn ra trong không khí ấm áp...</p>',
                'image_url' => '/images/news_2.png',
                'status' => 'published',
                'author_id' => $admin->id,
            ],
        ];

        foreach ($news as $n) {
            News::firstOrCreate(['slug' => $n['slug']], $n);
        }
    }
}
