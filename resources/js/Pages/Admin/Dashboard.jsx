import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { 
    Users, Heart, DollarSign, Calendar, ArrowUpRight, Activity, TrendingUp
} from "lucide-react";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';

export default function AdminDashboard({ auth, stats = {}, donationTrend = [], topCampaigns = [], recentDonations = [], recentUsers = [] }) {
    
    // Format currency
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    const totalUsers = stats?.users || 0;
    const totalCampaigns = stats?.campaigns || 0;
    const totalDonations = stats?.donations || 0;
    const totalRaised = stats?.total_raised || 0;
    const totalNews = stats?.news || 0;

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <span className="bg-rose-100 p-2 rounded-2xl">💖</span> 
                            VNHeart Dashboard
                        </h2>
                        <p className="text-gray-500 font-medium text-sm mt-1">Chào buổi tối, quản trị viên {auth?.user?.name}!</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <div className="bg-rose-50 p-2 rounded-xl text-rose-600">
                            <Calendar size={18} />
                        </div>
                        <div className="pr-4">
                            <p className="text-[10px] uppercase font-black text-gray-400 leading-none">Hôm nay</p>
                            <p className="text-sm font-bold text-gray-700">
                                {new Date().toLocaleDateString("vi-VN", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Quản trị tối cao - VNHeart" />

            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Funds */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/20 border border-gray-50 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="bg-rose-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200 mb-6 group-hover:rotate-12 transition-transform">
                            <DollarSign size={28} />
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Tổng tiền quyên góp</p>
                        <h3 className="text-2xl font-black text-gray-900 leading-none mb-4">{formatCurrency(totalRaised)}</h3>
                        <div className="flex items-center gap-1.5 text-green-500 font-bold text-xs bg-green-50 w-fit px-3 py-1 rounded-full">
                            <ArrowUpRight size={14} /> +12.5% <span className="text-gray-400 font-medium">tuần này</span>
                        </div>
                    </div>
                </div>

                {/* Total Users */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/20 border border-gray-50 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="bg-blue-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-6 group-hover:rotate-12 transition-transform">
                            <Users size={28} />
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Cộng đồng thành viên</p>
                        <h3 className="text-2xl font-black text-gray-900 leading-none mb-4">{totalUsers.toLocaleString()}</h3>
                        <div className="flex items-center gap-1.5 text-blue-500 font-bold text-xs bg-blue-50 w-fit px-3 py-1 rounded-full">
                             {stats?.managers || 0} Quản lý khu vực
                        </div>
                    </div>
                </div>

                {/* Campaigns */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/20 border border-gray-50 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="bg-purple-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200 mb-6 group-hover:rotate-12 transition-transform">
                            <Heart size={28} />
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Chiến dịch hoạt động</p>
                        <h3 className="text-2xl font-black text-gray-900 leading-none mb-4">{totalCampaigns}</h3>
                        <div className="flex items-center gap-1.5 text-purple-500 font-bold text-xs bg-purple-50 w-fit px-3 py-1 rounded-full">
                            {totalNews} Tin tức cộng đồng
                        </div>
                    </div>
                </div>

                {/* Total Donations */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/20 border border-gray-50 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="bg-orange-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200 mb-6 group-hover:rotate-12 transition-transform">
                            <Activity size={28} />
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Tổng lượt đóng góp</p>
                        <h3 className="text-2xl font-black text-gray-900 leading-none mb-4">{totalDonations.toLocaleString()}</h3>
                        <div className="flex items-center gap-1.5 text-orange-500 font-bold text-xs bg-orange-50 w-fit px-3 py-1 rounded-full">
                            <TrendingUp size={14} /> Tăng trưởng ổn định
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                {/* Main Donation Chart */}
                <div className="lg:col-span-8 bg-white rounded-[3rem] p-8 lg:p-10 shadow-xl shadow-rose-100/20 border border-gray-50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                                <span className="text-rose-500">📊</span> Biểu đồ quyên góp
                            </h3>
                            <p className="text-sm text-gray-400 font-medium mt-1">Sự biến động quỹ thiện nguyện trong 15 ngày gần nhất</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                            <span className="text-xs font-bold text-gray-500">Tiền quyên góp</span>
                        </div>
                    </div>
                    
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={donationTrend}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="date" 
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        return `${date.getDate()}/${date.getMonth() + 1}`;
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}}
                                    tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Tr`}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [formatCurrency(value), 'Quyên góp']}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString('vi-VN')}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="total" 
                                    stroke="#f43f5e" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorTotal)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Recent Activities */}
                <div className="lg:col-span-4 bg-white rounded-[3rem] p-8 lg:p-10 shadow-xl shadow-rose-100/20 border border-gray-50 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                            <span className="text-rose-500">⚡</span> Mới nhất
                        </h3>
                        <Link href={route('admin.donations.index')} className="text-rose-600 font-bold text-xs uppercase hover:underline">Tất cả</Link>
                    </div>

                    <div className="space-y-6 flex-1">
                        {recentDonations?.map((d, idx) => (
                            <div key={d.id} className="group flex items-start gap-4 relative">
                                {idx !== recentDonations.length - 1 && (
                                    <div className="absolute left-6 top-10 w-0.5 h-16 bg-gray-100"></div>
                                )}
                                <div className="z-10 bg-white border-2 border-rose-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100 shrink-0 group-hover:scale-110 transition-transform">
                                    <span className="text-xl">🎁</span>
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-black text-gray-900 text-sm truncate">{d.donor}</p>
                                        <p className="text-[10px] font-bold text-gray-400 shrink-0 uppercase">{d.time}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">Ủng hộ {d.campaign}</p>
                                    <p className="text-rose-600 font-black text-sm mt-1">+{formatCurrency(d.amount)}</p>
                                </div>
                            </div>
                        ))}

                        {recentDonations.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chưa có giao dịch nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-fit">
                {/* Campaigns Progress Table */}
                <div className="lg:col-span-8 bg-white rounded-[3rem] p-8 lg:p-10 shadow-xl shadow-rose-100/20 border border-gray-50">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                            <span className="text-rose-500">❤️</span> Chiến dịch tiêu biểu
                        </h3>
                        <Link href={route('admin.campaigns.index')} className="text-rose-600 font-bold text-xs uppercase hover:underline">Chi tiết</Link>
                    </div>

                    <div className="space-y-8">
                        {topCampaigns?.map(c => (
                            <div key={c.id}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg">📁</div>
                                        <div>
                                            <p className="font-black text-gray-900 text-sm">{c.title}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mục tiêu: {formatCurrency(c.target)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-rose-600 text-sm">{formatCurrency(c.raised)}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.progress}%</p>
                                    </div>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.min(c.progress, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Role breakdown with progress circles or simple bars */}
                <div className="lg:col-span-4 bg-white rounded-[3rem] p-8 lg:p-10 shadow-xl shadow-rose-100/20 border border-gray-50">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3 mb-8">
                        <span className="text-rose-500">👥</span> Phân đối tượng
                    </h3>
                    
                    <div className="space-y-6">
                        {[
                            { label: 'Nhà hảo tâm', count: stats.donors, color: 'bg-blue-500', icon: '💎' },
                            { label: 'Tình nguyện viên', count: stats.volunteers, color: 'bg-green-500', icon: '🤝' },
                            { label: 'Người kêu gọi', count: stats.requesters, color: 'bg-orange-500', icon: '📣' },
                            { label: 'Quản trị viên', count: stats.admins, color: 'bg-red-500', icon: '🛡️' },
                        ].map(item => (
                            <div key={item.label} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-sm font-bold text-gray-700">{item.label}</span>
                                    </div>
                                    <span className="font-black text-gray-900">{item.count}</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                        style={{ width: `${(item.count / totalUsers) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-rose-50 rounded-[2rem] border border-rose-100 text-center">
                        <div className="w-12 h-12 bg-white text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-rose-100">
                            <ArrowUpRight size={24} />
                        </div>
                        <h4 className="text-rose-900 font-black text-sm uppercase tracking-widest mb-2">Cộng đồng lớn mạnh</h4>
                        <p className="text-rose-700 text-[10px] font-bold leading-relaxed uppercase">Hơn 500 thành viên mới trong tháng này.</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
