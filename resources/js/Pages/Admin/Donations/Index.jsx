import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
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
                <h2 className="font-black text-2xl text-gray-800 leading-tight">
                    Lịch sử Đóng góp toàn hệ thống
                </h2>
            }
        >
            <Head title="Quản lý Đóng góp - Admin" />

            <div className="space-y-6">
                {/* Stats Summary Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tổng lượt đóng góp</p>
                        <p className="text-3xl font-black text-gray-900">{donations.total}</p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Tìm tên nhà hảo tâm hoặc dự án..."
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
                        className="bg-gray-50 border-gray-200 rounded-xl px-4 py-2 font-bold text-gray-700 focus:ring-rose-500 focus:border-rose-500"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="completed">Thành công</option>
                        <option value="pending">Chờ xử lý</option>
                    </select>
                    <button 
                        onClick={handleFilter}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-2 rounded-xl transition shadow-lg"
                    >
                        Lọc dữ liệu
                    </button>
                </div>

                {/* Donations Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Nhà hảo tâm</th>
                                    <th className="px-6 py-4">Dự án ủng hộ</th>
                                    <th className="px-6 py-4 text-center">Số tiền</th>
                                    <th className="px-6 py-4">Thời gian</th>
                                    <th className="px-6 py-4 text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {donations.data.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-black border border-rose-100">
                                                    {donation.user?.name?.charAt(0).toUpperCase() || "H"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{donation.user?.name || "Ẩn danh"}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{donation.user?.email || "No Email"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-gray-700 line-clamp-1 max-w-xs">
                                                {donation.campaign?.title || "Ủng hộ chung"}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-center font-black text-rose-600 text-lg">
                                            {formatMoney(donation.amount)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-xs font-bold text-gray-600">
                                                {new Date(donation.created_at).toLocaleString("vi-VN")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                                donation.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {donation.status === 'completed' ? 'Thành công' : 'Chờ xử lý'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {donations.total > donations.per_page && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-center gap-2">
                             {donations.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                                        link.active
                                            ? 'bg-rose-600 border-rose-600 text-white shadow-lg'
                                            : 'bg-white border-gray-100 text-gray-600 hover:border-rose-300'
                                    } ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
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
