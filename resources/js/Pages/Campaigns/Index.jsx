import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CampaignsIndex({ campaigns, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('campaigns.index'), { search, status }, { preserveState: true });
    };

    const formatMoney = (amount) =>
        new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';

    const getProgress = (raised, goal) =>
        goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

    const statusMap = {
        active: { label: 'Đang kêu gọi', color: 'bg-green-100 text-green-700' },
        completed: { label: 'Đã hoàn thành', color: 'bg-blue-100 text-blue-700' },
        paused: { label: 'Tạm dừng', color: 'bg-yellow-100 text-yellow-700' },
    };

    return (
        <AppLayout>
            <Head title="Khám phá dự án thiện nguyện" />

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Dự án Thiện Nguyện</h1>
                <p className="text-gray-500 mt-2 text-lg">Mỗi đóng góp nhỏ tạo ra sự thay đổi lớn — hãy cùng nhau lan tỏa yêu thương.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Tìm kiếm dự án..."
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-gray-50"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-gray-50 w-full sm:w-48"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Đang kêu gọi</option>
                        <option value="completed">Đã hoàn thành</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-sm whitespace-nowrap"
                    >
                        Tìm kiếm
                    </button>
                </form>
            </div>

            {/* Campaign Grid */}
            {campaigns.data.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-700">Không tìm thấy dự án</h3>
                    <p className="text-gray-500 mt-2">Thử tìm kiếm với từ khoá khác.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {campaigns.data.map((campaign) => {
                        const raised = campaign.donations_sum_amount || campaign.raised_amount || 0;
                        const progress = getProgress(raised, campaign.target_amount);
                        const st = statusMap[campaign.status] || { label: campaign.status, color: 'bg-gray-100 text-gray-700' };
                        return (
                            <Link
                                key={campaign.id}
                                href={route('campaigns.show', campaign.id)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 flex flex-col group transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Image */}
                                <div className="relative h-52 overflow-hidden bg-rose-50">
                                    {campaign.image_url ? (
                                        <img
                                            src={campaign.image_url}
                                            alt={campaign.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl">❤️</div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${st.color}`}>
                                            {st.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors leading-snug">
                                        {campaign.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                                        {campaign.description}
                                    </p>

                                    {/* Progress */}
                                    <div className="mt-auto">
                                        <div className="flex justify-between text-sm mb-1.5">
                                            <span className="font-bold text-gray-900">{formatMoney(raised)}</span>
                                            <span className="text-gray-400">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-rose-500 to-red-400 transition-all duration-700"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-xs text-gray-500">
                                                Mục tiêu: <span className="font-semibold text-gray-700">{formatMoney(campaign.target_amount)}</span>
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {campaign.donations_count || 0} người ủng hộ
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {campaigns.links && campaigns.data.length > 0 && (
                <div className="flex justify-center gap-2">
                    {campaigns.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                                link.active
                                    ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:text-rose-600'
                            } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
