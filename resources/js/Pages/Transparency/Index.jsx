import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function TransparencyIndex({ statements, campaigns, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [campaignId, setCampaignId] = useState(filters.campaign_id || '');
    const [type, setType] = useState(filters.type || '');

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        router.get(route('transparency.index'), { search, campaign_id: campaignId, type }, { preserveState: true });
    };

    const formatMoney = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

    const formatDateTime = (dateStr) =>
        new Date(dateStr).toLocaleString('vi-VN', { 
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

    return (
        <AppLayout>
            <Head title="Minh bạch tài chính (Sao kê)" />

            <div className="space-y-8">
                {/* Header Section */}
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Sổ cái Minh bạch</h1>
                    <p className="text-gray-500 mt-2 text-lg">Mọi giao dịch thu chi của VNHeart đều được công khai minh bạch 24/7.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Tổng thu (Tiền vào)</p>
                        <p className="text-3xl font-extrabold text-green-600">{formatMoney(stats.total_in)}</p>
                        <div className="mt-4 flex items-center text-xs text-green-500 font-bold bg-green-50 w-fit px-2 py-1 rounded">
                            <span className="mr-1">↑</span> 100% minh bạch
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Tổng chi (Tiền ra)</p>
                        <p className="text-3xl font-extrabold text-rose-600">{formatMoney(stats.total_out)}</p>
                        <div className="mt-4 flex items-center text-xs text-rose-500 font-bold bg-rose-50 w-fit px-2 py-1 rounded">
                            <span className="mr-1">↓</span> Đã đối soát
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-rose-100 bg-rose-50/30">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Số dư hiện tại</p>
                        <p className="text-3xl font-extrabold text-gray-900">{formatMoney(stats.balance)}</p>
                        <div className="mt-4 flex items-center text-xs text-gray-500 font-bold bg-white border border-gray-100 w-fit px-2 py-1 rounded">
                            🛡️ Đang bảo vệ
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <form onSubmit={handleFilter} className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Tìm theo nội dung, ID giao dịch..."
                                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-gray-50"
                            />
                        </div>
                        <select
                            value={campaignId}
                            onChange={e => setCampaignId(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-gray-50 w-full lg:w-64"
                        >
                            <option value="">Tất cả dự án</option>
                            {campaigns.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-gray-50 w-full lg:w-48"
                        >
                            <option value="">Tất cả loại</option>
                            <option value="in">Tiền vào (+)</option>
                            <option value="out">Tiền ra (-)</option>
                        </select>
                        <button
                            type="submit"
                            className="bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl transition shadow-sm"
                        >
                            Lọc dữ liệu
                        </button>
                    </form>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Thời gian</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Chi tiết / ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Chiến dịch</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Số tiền</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {statements.data.length > 0 ? (
                                    statements.data.map((st) => (
                                        <tr key={st.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {formatDateTime(st.transaction_date)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 mb-0.5">{st.content}</div>
                                                <div className="text-xs text-gray-400 font-mono">{st.transaction_id || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {st.campaign ? (
                                                    <Link href={route('campaigns.show', st.campaign.id)} className="text-rose-600 hover:underline font-medium">
                                                        {st.campaign.title}
                                                    </Link>
                                                ) : (
                                                    <span className="text-gray-400 italic">Quyên góp chung</span>
                                                )}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-right font-extrabold text-base ${
                                                st.type === 'in' ? 'text-green-600' : 'text-rose-600'
                                            }`}>
                                                {st.type === 'in' ? '+' : ''}{formatMoney(st.amount)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            <div className="text-4xl mb-4">📭</div>
                                            Không có dữ liệu giao dịch nào khớp với bộ lọc.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {statements.links && statements.data.length > 0 && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                            <div className="flex gap-1">
                                {statements.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                                            link.active
                                                ? 'bg-rose-600 border-rose-600 text-white'
                                                : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300'
                                        } ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
