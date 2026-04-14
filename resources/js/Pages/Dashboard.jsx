import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ donations, totalDonated, campaignsSupported, recentDonations }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const getAvatarUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `/storage/${path}`;
    };

    const formatMoney = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const getRoleBadge = (roles) => {
        if (!roles || roles.length === 0) return { label: 'Thành viên', color: 'bg-gray-100 text-gray-700' };
        const map = {
            admin: { label: 'Quản trị viên', color: 'bg-purple-100 text-purple-700' },
            donor: { label: 'Nhà hảo tâm', color: 'bg-rose-100 text-rose-700' },
            volunteer: { label: 'Tình nguyện viên', color: 'bg-green-100 text-green-700' },
            requester: { label: 'Người kêu gọi', color: 'bg-orange-100 text-orange-700' },
            user: { label: 'Thành viên', color: 'bg-blue-100 text-blue-700' },
        };
        const firstRole = roles[0]?.name || roles[0];
        return map[firstRole] || { label: firstRole, color: 'bg-gray-100 text-gray-700' };
    };

    const badge = getRoleBadge(user?.roles);

    return (
        <AppLayout>
            <Head title={`Trang cá nhân - ${user?.name}`} />

            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                {/* Profile Hero Section */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-rose-100/20 overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-100/30">
                    {/* Cover Photo with Premium Aesthetic */}
                    <div className="h-48 bg-gradient-to-br from-rose-500 via-red-600 to-pink-600 relative overflow-hidden">
                        {/* Abstract Background Pattern */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 56c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-1 25c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm34-39c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm10 52c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-33-44c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM10 52c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm54 46c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM6 23c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm95 2c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM48 62c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM80 54c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM20 36c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm20 10c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm60-26c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0 56c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM4 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm100 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM0 100c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm100 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
                        }}></div>
                        <div className="absolute top-6 right-8">
                            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold border border-white/20">
                                🏠 Tài khoản cá nhân
                            </span>
                        </div>
                    </div>
                    <div className="px-10 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 relative z-10">
                            {/* User Profile Info */}
                            <div className="flex items-end space-x-6">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-white border-8 border-white shadow-2xl flex items-center justify-center text-5xl font-black text-rose-600 transition-transform hover:scale-105 duration-300 overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={getAvatarUrl(user.avatar)} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase() || '?'
                                    )}
                                </div>
                                <div className="mb-4">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user?.name}</h1>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${badge.color}`}>
                                            {badge.label}
                                        </span>
                                        <span className="text-xs font-bold text-gray-400">ID: VN-{user?.id?.toString().padStart(6, '0')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 md:mt-0 md:mb-4 flex flex-wrap gap-4">
                                <Link
                                    href={route('campaigns.index')}
                                    className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-rose-200 hover:shadow-rose-400 hover:-translate-y-1 transition-all flex items-center gap-2 uppercase text-sm tracking-widest"
                                >
                                    <span>❤️</span> Quyên góp ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tổng đóng góp</span>
                            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                                <span className="text-rose-600 text-lg">💰</span>
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900">{formatMoney(totalDonated)}</p>
                        <p className="text-sm text-gray-500 mt-1">Đã quyên góp từ trước đến nay</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Dự án ủng hộ</span>
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <span className="text-blue-600 text-lg">🌱</span>
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900">{campaignsSupported || 0}</p>
                        <p className="text-sm text-gray-500 mt-1">Chiến dịch đã tham gia</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Trái tim vàng</span>
                            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <span className="text-yellow-600 text-lg">⭐</span>
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900">
                            {Math.floor((totalDonated || 0) / 100000)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Điểm tích lũy thiện nguyện</p>
                    </div>
                </div>

                {/* Donation History */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-extrabold text-gray-900">📜 Lịch sử quyên góp</h2>
                        <Link href={route('campaigns.index')} className="text-rose-600 hover:text-rose-700 font-semibold text-sm">
                            Xem tất cả dự án →
                        </Link>
                    </div>
                    {recentDonations && recentDonations.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            {recentDonations.map((donation) => (
                                <div key={donation.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-xl">
                                            ❤️
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{donation.campaign?.title || 'Quyên góp tự do'}</p>
                                            <p className="text-sm text-gray-500">{formatDate(donation.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-extrabold text-rose-600 text-lg">{formatMoney(donation.amount)}</p>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                            donation.status === 'completed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {donation.status === 'completed' ? 'Thành công' : 'Đang xử lý'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <div className="text-6xl mb-4">💝</div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Bắt đầu hành trình thiện nguyện</h3>
                            <p className="text-gray-500 mb-6">Bạn chưa có lịch sử quyên góp nào. Hãy chung tay với cộng đồng ngay hôm nay!</p>
                            <Link
                                href={route('campaigns.index')}
                                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-colors inline-block"
                            >
                                Khám phá dự án thiện nguyện
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
