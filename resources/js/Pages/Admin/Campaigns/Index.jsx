import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ campaigns, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("admin.campaigns.index"), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa chiến dịch này không?")) {
            router.delete(route("admin.campaigns.destroy", id));
        }
    };

    const formatMoney = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-black text-2xl text-gray-800 leading-tight">
                        Quản lý Chiến dịch
                    </h2>
                    <Link
                        href={route("admin.campaigns.create")}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
                    >
                        <span>+</span> Tạo chiến dịch mới
                    </Link>
                </div>
            }
        >
            <Head title="Quản lý Chiến dịch - Admin" />

            <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <form onSubmit={handleSearch} className="flex gap-4 w-full md:w-auto flex-1">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Tìm tên chiến dịch..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-xl focus:ring-rose-500 focus:border-rose-500 font-medium"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <select
                            value={filters.status || ""}
                            onChange={(e) => router.get(route("admin.campaigns.index"), { search, status: e.target.value }, { preserveState: true })}
                            className="bg-gray-50 border-gray-200 rounded-xl px-4 py-2 font-bold text-gray-700 focus:ring-rose-500 focus:border-rose-500"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="active">Đang kêu gọi</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="closed">Đã đóng</option>
                        </select>
                        <button 
                            type="button"
                            onClick={() => router.get(route('admin.campaigns.index'), { search, status: 'trashed' })}
                            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 border shadow-sm ${
                                filters.status === 'trashed' 
                                ? 'bg-gray-900 border-black text-white' 
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <span>🗑️</span> Thùng rác
                        </button>
                    </form>
                    <div className="text-sm text-gray-500 font-bold">
                        Tổng số: <span className="text-rose-600">{campaigns.total}</span> chiến dịch
                    </div>
                </div>

                {/* Campaigns Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Chiến dịch</th>
                                    <th className="px-6 py-4">Mục tiêu / Đã nhận</th>
                                    <th className="px-6 py-4">Thời gian</th>
                                    <th className="px-6 py-4 text-center">Trạng thái</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {campaigns.data.map((campaign) => {
                                    const progress = Math.min(100, Math.round((campaign.raised_amount / campaign.target_amount) * 100));
                                    return (
                                        <tr key={campaign.id} className={`hover:bg-gray-50/50 transition-colors ${campaign.deleted_at ? 'opacity-70 bg-gray-50/30' : ''}`}>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                        {campaign.image_url ? (
                                                            <img src={campaign.image_url} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl">❤️</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 line-clamp-1">{campaign.title}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: {campaign.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-bold">
                                                        <span className="text-gray-900">{formatMoney(campaign.raised_amount)}</span>
                                                        <span className="text-gray-400">/ {formatMoney(campaign.target_amount)}</span>
                                                    </div>
                                                    <div className="w-32 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                        <div 
                                                            className="bg-rose-500 h-full rounded-full" 
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-xs font-medium text-gray-600">
                                                    <p>{new Date(campaign.start_date).toLocaleDateString("vi-VN")}</p>
                                                    <p className="text-gray-300">đến</p>
                                                    <p>{new Date(campaign.end_date).toLocaleDateString("vi-VN")}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                                        campaign.deleted_at ? 'bg-red-100 text-red-700' :
                                                        campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' : 
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {campaign.deleted_at ? 'Đã xóa' : (
                                                            campaign.status === 'active' ? 'Đang kêu gọi' :
                                                            campaign.status === 'completed' ? 'Hoàn thành' : 'Đã đóng'
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {campaign.deleted_at ? (
                                                        <>
                                                            <button
                                                                onClick={() => router.post(route('admin.campaigns.restore', campaign.id))}
                                                                className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-colors border border-green-100"
                                                                title="Khôi phục"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if(confirm('CẢNH BÁO: Xóa vĩnh viễn chiến dịch này sẽ xóa mất toàn bộ dữ liệu và hình ảnh liên quan. Tiếp tục?')) {
                                                                        router.delete(route('admin.campaigns.force-delete', campaign.id));
                                                                    }
                                                                }}
                                                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
                                                                title="Xóa vĩnh viễn"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Link
                                                                href={route("admin.campaigns.edit", campaign.id)}
                                                                className="p-2 bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors border border-gray-100"
                                                                title="Sửa"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(campaign.id)}
                                                                className="p-2 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors border border-gray-100"
                                                                title="Xóa tạm"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Placeholder (Simplify for now, use Link based pagination if total > paginate) */}
                    {campaigns.total > campaigns.per_page && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-center gap-2">
                             {campaigns.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                                        link.active
                                            ? 'bg-rose-600 border-rose-600 text-white shadow-lg'
                                            : 'bg-white border-gray-100 text-gray-600 hover:border-rose-300'
                                    } ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
