import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ donations, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");

    const handleFilter = () => {
        router.get(route("admin.donations.index"), { search, status }, { preserveState: true });
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-black text-3xl text-gray-900 leading-tight">
                            Lịch sử Quyên góp
                        </h2>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Quản lý dòng tiền và đối soát hệ thống
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Quản lý Đóng góp - Admin" />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Stats Summary Panel */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <svg className="w-16 h-16 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Tổng lượt đóng góp</p>
                        <p className="text-4xl font-black text-gray-900">{donations.total}</p>
                        <div className="mt-4 flex items-center text-xs font-bold text-green-500">
                            <span>Hệ thống ổn định</span>
                            <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        </div>
                    </div>
                </div>

                {/* Unified Toolbar */}
                <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-2xl shadow-rose-500/5 border border-white flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email hoặc mã giao dịch..."
                            className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-rose-500/10 font-bold text-gray-700 placeholder:text-gray-300 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                        />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <select 
                            className="bg-gray-50/50 border-none rounded-[1.5rem] px-6 py-4 font-black text-gray-700 focus:ring-4 focus:ring-rose-500/10 min-w-[180px] appearance-none"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Trạng thái</option>
                            <option value="completed">Thành công</option>
                            <option value="pending">Chờ xử lý</option>
                        </select>

                        <button 
                            onClick={handleFilter}
                            className="bg-gray-900 hover:bg-black text-white font-black px-8 py-4 rounded-[1.5rem] transition-all shadow-lg active:scale-95 flex items-center gap-3 group"
                        >
                            <span>Lọc dữ liệu</span>
                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                        </button>

                        <div className="w-px h-10 bg-gray-100 mx-2 hidden lg:block"></div>

                        <button 
                            onClick={() => router.get(route('admin.donations.index'), { status: filters.status === 'trashed' ? '' : 'trashed' })}
                            className={`px-6 py-4 rounded-[1.5rem] font-black transition-all flex items-center gap-3 border-2 active:scale-95 ${
                                filters.status === 'trashed' 
                                ? 'bg-rose-600 border-rose-600 text-white shadow-xl shadow-rose-200' 
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Thùng rác</span>
                        </button>
                    </div>
                </div>

                {/* Enhanced Donations Table */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Nhà hảo tâm</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Chiến dịch</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Số tiền</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Thời gian</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Trạng thái</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {donations.data.length > 0 ? donations.data.map((donation) => (
                                    <tr key={donation.id} className={`group hover:bg-rose-50/30 transition-all duration-300 ${donation.deleted_at ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-rose-50 to-orange-50 text-rose-600 rounded-2xl flex items-center justify-center font-black border border-rose-100 group-hover:scale-110 transition-transform">
                                                    {donation.user?.name?.charAt(0).toUpperCase() || "H"}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-base">{donation.user?.name || donation.donor_name || "Ẩn danh"}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{donation.user?.email || donation.donor_email || "Không có email"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="max-w-[200px]">
                                                <p className="text-sm font-black text-gray-700 line-clamp-1 group-hover:text-rose-600 transition-colors">
                                                    {donation.campaign?.title || "Ủng hộ chung"}
                                                </p>
                                                <p className="text-[10px] text-gray-300 font-mono mt-1 font-bold tracking-tighter uppercase">{donation.transaction_id || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center font-black text-gray-900 text-lg">
                                            <span className="bg-gray-50 px-4 py-2 rounded-xl group-hover:bg-rose-100 group-hover:text-rose-600 transition-all">
                                                {formatMoney(donation.amount)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-xs font-bold text-gray-500">
                                                <p className="text-gray-900 font-black">{new Date(donation.created_at).toLocaleDateString("vi-VN")}</p>
                                                <p className="text-[10px] uppercase opacity-50">{new Date(donation.created_at).toLocaleTimeString("vi-VN")}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm inline-block min-w-[100px] ${
                                                donation.deleted_at ? 'bg-gray-100 text-gray-500' :
                                                donation.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {donation.deleted_at ? 'Đã xóa' : (donation.status === 'completed' ? 'Thành công' : 'Chờ xử lý')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {donation.deleted_at ? (
                                                    <>
                                                        <button
                                                            onClick={() => router.post(route('admin.donations.restore', donation.id))}
                                                            className="p-3 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-2xl transition-all shadow-sm border border-green-100"
                                                            title="Khôi phục"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if(confirm('CẢNH BÁO: Bạn đang thực hiện xóa VĨNH VIỄN bản ghi này. Hành động này không thể hoàn tác. Tiếp tục?')) {
                                                                    router.delete(route('admin.donations.force-delete', donation.id));
                                                                }
                                                            }}
                                                            className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm border border-red-100"
                                                            title="Xóa vĩnh viễn"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if(confirm('Đưa bản ghi này vào thùng rác?')) {
                                                                router.delete(route('admin.donations.destroy', donation.id));
                                                            }
                                                        }}
                                                        className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all shadow-sm border border-gray-100"
                                                        title="Xóa tạm"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl">🏜️</div>
                                                <p className="text-gray-400 font-bold italic">Không tìm thấy dữ liệu phù hợp...</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Enhanced Pagination */}
                    {donations.total > donations.per_page && (
                        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                Hiển thị {donations.from}-{donations.to} trên tổng số {donations.total} bản ghi
                            </p>
                            <div className="flex gap-2">
                                 {donations.links.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => link.url && router.get(link.url, filters)}
                                        className={`px-5 py-2.5 rounded-2xl text-xs font-black border-2 transition-all active:scale-95 ${
                                            link.active
                                                ? 'bg-gray-900 border-gray-900 text-white shadow-lg'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900'
                                        } ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
