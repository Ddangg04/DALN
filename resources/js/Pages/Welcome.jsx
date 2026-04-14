import { Head, Link, router } from "@inertiajs/react";
import ChatbotUI from "@/Components/ChatbotUI";
import { useState } from "react";

export default function Welcome({ auth, featuredCampaigns, latestStatements }) {
    const [searchQuery, setSearchQuery] = useState("");
    const campaigns = featuredCampaigns || [];
    const statements = latestStatements || [];

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        router.get(route('campaigns.index'), { search: searchQuery });
    };

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDateShort = (dateStr) => {
        const d = new Date(dateStr);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    const safeRoute = (name, ...params) => {
        try { return route(name, ...params); } catch (e) { return "#"; }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Head title="Kết nối yêu thương - VNHeart Thiện Nguyện" />

            {/* Navbar */}
            <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
                            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden relative group-hover:shadow-rose-500/50 transition duration-300">
                                <span className="absolute inset-0 bg-white/20 blur-sm"></span>
                                <span className="relative font-bold text-xl">♥</span>
                            </div>
                            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-red-500 tracking-tight">
                                VNHeart
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href={safeRoute('campaigns.index')} className="text-gray-600 hover:text-rose-600 font-bold transition-colors">Dự án</Link>
                            <Link href={safeRoute('news.index')} className="text-gray-600 hover:text-rose-600 font-bold transition-colors">Tin tức</Link>
                            <Link href={safeRoute('transparency.index')} className="text-gray-600 hover:text-rose-600 font-bold transition-colors">Minh bạch</Link>
                            <a href="#about" className="text-gray-600 hover:text-rose-600 font-bold transition-colors">Về chúng tôi</a>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('home')}
                                    className="text-gray-700 hover:text-rose-600 font-bold flex items-center bg-rose-50 px-4 py-2 rounded-full border border-rose-100 transition"
                                >
                                    <span className="mr-2">👤</span>
                                    {auth.user.name}
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-600 hover:text-gray-900 font-bold px-4 py-2 transition"
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center scale-100 hover:scale-105 active:scale-95 text-sm uppercase tracking-wider"
                                    >
                                        Góp quỹ
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Transparency Ticker (Dòng chảy minh bạch) */}
            <div className="bg-rose-50 border-b border-rose-100 overflow-hidden whitespace-nowrap py-3 relative">
                <div className="absolute left-0 top-0 bottom-0 px-4 bg-rose-50 z-10 flex items-center font-bold text-rose-600 shadow-[10px_0_15px_-5px_rgba(255,241,242,1)]">
                    <span className="mr-2 animate-pulse">●</span> Dòng chảy Minh bạch
                </div>
                <div className="inline-block animate-marquee pl-[180px]">
                    {statements.length > 0 ? statements.map((st, i) => (
                        <span key={i} className="mx-8 text-sm font-medium text-gray-700">
                            <span className="text-rose-500 font-bold">{st.account_name || 'Nhà hảo tâm'}</span> vừa ủng hộ <span className="text-rose-600 font-extrabold">{new Intl.NumberFormat('vi-VN').format(st.amount)}đ</span> 
                            <span className="text-gray-400 ml-2">({formatDateShort(st.transaction_date)})</span>
                        </span>
                    )) : (
                        <span className="mx-8 text-sm text-gray-400">Đang cập nhật dòng chảy minh bạch...</span>
                    )}
                </div>
            </div>

            {/* Hero Section with Search */}
            <div className="relative overflow-hidden bg-white pt-16 pb-24 border-b border-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight mb-8">
                                Sức mạnh của <br />
                                <span className="text-rose-600">Sự tử tế</span>
                            </h1>
                            <p className="text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
                                Cùng VNHeart lan tỏa yêu thương qua những chiến dịch minh bạch, trực tiếp và an toàn tuyệt đối. Mọi đóng góp của bạn đều được ghi nhận tức thì.
                            </p>
                            
                            {/* Search Hero */}
                            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto lg:mx-0 group">
                                <div className="absolute inset-0 bg-rose-500 rounded-3xl blur-xl opacity-10 group-focus-within:opacity-20 transition duration-500"></div>
                                <div className="relative flex p-2 bg-white rounded-3xl shadow-2xl border border-gray-100 ring-4 ring-gray-50">
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Tìm dự án: Xây trường, Bữa cơm..."
                                        className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-gray-900 font-bold text-lg"
                                    />
                                    <button 
                                        type="submit"
                                        className="bg-gray-900 hover:bg-black text-white p-4 rounded-2xl transition shadow-lg flex items-center justify-center"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <div className="lg:w-1/2 relative">
                            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl transform rotate-2 group hover:rotate-0 transition duration-700">
                                <img src="/images/hero_charity.png" alt="Happy faces" className="w-full h-[550px] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            {/* Floating Stats Card */}
                            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 animate-float hidden lg:block">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-black text-2xl">♥</div>
                                    <div>
                                        <p className="text-3xl font-black text-gray-900">12M+</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Trái tim kết nối</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="bg-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: 'Dự án hoàn thành', val: '1,500+' },
                        { label: 'Số tiền quyên góp', val: '80T VNĐ' },
                        { label: 'Tình nguyện viên', val: '5k+' },
                        { label: 'Tỷ lệ minh bạch', val: '100%' },
                    ].map((m, i) => (
                        <div key={i} className="text-center group">
                            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">{m.label}</p>
                            <p className="text-3xl lg:text-4xl font-black text-white group-hover:text-rose-500 transition-colors">{m.val}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Campaigns */}
            <div id="campaigns" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <span className="text-rose-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Lan tỏa giá trị</span>
                            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">Dự án cộng đồng</h2>
                        </div>
                        <Link href={route('campaigns.index')} className="text-rose-600 font-bold hover:text-rose-700 flex items-center gap-2 group transition-all">
                            Xem tất cả <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {campaigns.length > 0 ? campaigns.map((campaign) => {
                            const prog = Math.min(100, Math.round((campaign.raised_amount / campaign.target_amount) * 100));
                            return (
                                <Link
                                    key={campaign.id}
                                    href={route('campaigns.show', campaign.id)}
                                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 group transition-all duration-500 flex flex-col"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        {campaign.image_url ? (
                                            <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
                                        ) : (
                                            <div className="w-full h-full bg-rose-50 flex items-center justify-center text-7xl">❤️</div>
                                        )}
                                        <div className="absolute top-5 left-5">
                                            <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black text-rose-600 shadow-sm uppercase tracking-widest">
                                                ĐANG KÊU GỌI
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-xl font-black text-gray-900 mb-6 line-clamp-2 leading-tight group-hover:text-rose-600 transition-colors">
                                            {campaign.title}
                                        </h3>
                                        <div className="mt-auto space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Đạt được</span>
                                                    <span className="text-lg font-black text-gray-900">{formatMoney(campaign.raised_amount)}</span>
                                                </div>
                                                <span className="text-sm font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-xl">{prog}%</span>
                                            </div>
                                            <div className="w-full bg-gray-50 rounded-full h-4 overflow-hidden p-1 border border-gray-100">
                                                <div 
                                                    className="bg-gradient-to-r from-rose-500 to-red-500 h-2 rounded-full shadow-sm transition-all duration-1000 ease-out" 
                                                    style={{ width: `${prog}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        }) : (
                            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 text-gray-400 font-bold italic">
                                Đang tải các dự án mới...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bảng vinh danh (Top Donors) - Thiennguyen.app style */}
            <div className="py-24 bg-rose-50/50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <span className="text-rose-500 font-bold uppercase tracking-widest text-xs mb-4 block">Những trái tim vàng</span>
                    <h2 className="text-4xl font-black text-gray-900 mb-12">Bảng vàng vinh danh</h2>
                    
                    <div className="flex flex-wrap justify-center gap-6">
                        {[
                            { name: 'Nguyễn Văn A', amount: '15,000,000đ', img: 'https://i.pravatar.cc/100?img=11' },
                            { name: 'Quỹ Từ Thiện ABC', amount: '50,000,000đ', img: 'https://i.pravatar.cc/100?img=12' },
                            { name: 'Trần Thị B', amount: '10,000,000đ', img: 'https://i.pravatar.cc/100?img=13' },
                            { name: 'Nhà hảo tâm ẩn danh', amount: '5,000,000đ', img: 'https://i.pravatar.cc/100?img=14' },
                            { name: 'Lê Văn C', amount: '20,000,000đ', img: 'https://i.pravatar.cc/100?img=15' },
                        ].map((d, i) => (
                            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-xl hover:-translate-y-2 transition duration-300 w-48">
                                <img src={d.img} className="w-16 h-16 rounded-full border-4 border-rose-50 mb-4" />
                                <p className="font-black text-gray-900 text-sm mb-1 text-center line-clamp-1">{d.name}</p>
                                <p className="text-rose-600 font-black text-xs">{d.amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* About / Why Section */}
            <div id="about" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">Cam kết Minh bạch <br /> Tuyệt đối 100%</h2>
                        <div className="space-y-6">
                            {[
                                { title: 'Sao kê thời gian thực', desc: 'Mọi giao dịch vào tài khoản thiện nguyện được hiển thị công khai ngay lập tức.', icon: '📊' },
                                { title: 'Giải ngân trực tiếp', desc: 'Tiền được chuyển thẳng tới người thụ hưởng hoặc nhà thầu thi công dự án.', icon: '🤝' },
                                { title: 'Xác thực định danh', desc: 'Sử dụng công nghệ xác thực CCCD/eKYC để đảm bảo mọi nhà hảo tâm đều minh bạch.', icon: '🆔' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 p-6 rounded-3xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                                    <div className="text-3xl">{item.icon}</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 mb-2">{item.title}</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-[3rem] p-12 text-white relative z-10 shadow-2xl">
                            <h3 className="text-3xl font-black mb-6 italic">"Đừng ngần ngại cho đi. Hành động nhỏ của bạn chính là hy vọng lớn của người khác."</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-black">♥</div>
                                <p className="font-bold text-rose-100 tracking-[0.2em] uppercase text-sm italic">VNHeart Foundation</p>
                            </div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-50 z-0"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 z-0"></div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 pt-24 pb-12 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
                        <div className="lg:col-span-2">
                             <Link href="/" className="flex items-center space-x-3 mb-8">
                                <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">♥</div>
                                <span className="text-2xl font-black text-white border-b-4 border-rose-500">VNHeart</span>
                            </Link>
                            <p className="text-gray-400 max-w-sm font-medium leading-relaxed mb-8">
                                VNHeart là mạng lưới thiện nguyện số hóa minh bạch, trực thuộc quỹ VNHeart Foundation. Cam kết 100% không thu phí quản lý từ nguồn tiền quyên góp.
                            </p>
                            <div className="flex space-x-4">
                                {[1,2,3,4].map(i => (
                                    <a key={i} href="#" className="w-10 h-10 bg-white/5 hover:bg-rose-600 rounded-xl flex items-center justify-center transition">
                                        <div className="w-5 h-5 bg-white/20 rounded-sm"></div>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black mb-8 uppercase tracking-widest text-xs text-rose-500">Nền tảng</h4>
                            <ul className="space-y-4 text-gray-400 font-bold text-sm">
                                <li><Link href={route('campaigns.index')} className="hover:text-white transition">Dự án cộng đồng</Link></li>
                                <li><Link href={route('transparency.index')} className="hover:text-white transition">Hệ thống Minh bạch</Link></li>
                                <li><Link href={route('news.index')} className="hover:text-white transition">Tin tức & Sự kiện</Link></li>
                                <li><a href="#" className="hover:text-white transition">Quy chế hoạt động</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black mb-8 uppercase tracking-widest text-xs text-rose-500">Liên hệ</h4>
                            <ul className="space-y-4 text-gray-400 font-bold text-sm">
                                <li>📞 1900 1234 (8:00 - 22:00)</li>
                                <li>✉️ hotro@vnheart.vn</li>
                                <li>📍 Cầu Giấy, Hà Nội</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 text-center text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                        © 2026 VNHeart Foundation. Tất cả quyền được bảo lưu.
                    </div>
                </div>
            </footer>

            <ChatbotUI />

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    display: inline-block;
                    animation: marquee 40s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
