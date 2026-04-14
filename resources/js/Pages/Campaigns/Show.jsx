import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CampaignShow({ campaign }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const [activeTab, setActiveTab] = useState('story'); // 'story' or 'transparency'
    const [donateOpen, setDonateOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [presetAmount, setPresetAmount] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        donor_name: user?.name || '',
        donor_email: user?.email || '',
        message: '',
        is_anonymous: false,
        payment_method: 'bank_transfer',
    });

    const presets = [50000, 100000, 200000, 500000, 1000000, 2000000];

    const formatMoney = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

    const formatMoneyShort = (amount) => {
        if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'tr đ';
        if (amount >= 1000) return (amount / 1000).toFixed(0) + 'k đ';
        return amount + 'đ';
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');
    const formatDateTime = (d) => new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const raised = campaign.donations_sum_amount || campaign.raised_amount || 0;
    const goal = campaign.target_amount || 0;
    const progress = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

    const [currentDonationId, setCurrentDonationId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('campaigns.donate', campaign.id), {
            onSuccess: () => {
                setDonateOpen(false);
                setShowSuccess(true);
                // In a real app, I'd get the donation ID from the response
                setCurrentDonationId('VNH' + Math.floor(Math.random() * 900000 + 100000));
            }
        });
    };

    return (
        <AppLayout>
            <Head title={campaign.title + " - VNHeart"} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Campaign Image */}
                    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 relative group">
                        {campaign.image_url ? (
                            <img
                                src={campaign.image_url}
                                alt={campaign.title}
                                className="w-full h-96 object-cover"
                            />
                        ) : (
                            <div className="w-full h-96 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-8xl">
                                ❤️
                            </div>
                        )}
                        <div className="absolute top-6 left-6">
                            <span className={`px-5 py-2 rounded-2xl text-[10px] font-black shadow-lg uppercase tracking-[0.2em] ${
                                campaign.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                            }`}>
                                {campaign.status === 'active' ? '🟢 Đang kêu gọi' : '✅ Đã hoàn thành'}
                            </span>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-2 flex space-x-2">
                        <button 
                            onClick={() => setActiveTab('story')}
                            className={`flex-1 py-4 rounded-3xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                activeTab === 'story' ? 'bg-rose-600 text-white shadow-xl' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            📖 Câu chuyện
                        </button>
                        <button 
                            onClick={() => setActiveTab('transparency')}
                            className={`flex-1 py-4 rounded-3xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                activeTab === 'transparency' ? 'bg-rose-600 text-white shadow-xl' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            🛡️ Sao kê minh bạch
                        </button>
                    </div>

                    {/* Tab Content: Story */}
                    {activeTab === 'story' && (
                        <div className="space-y-6 animate-fade-in content-fade-in">
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10">
                                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-8 leading-tight tracking-tight">{campaign.title}</h1>
                                
                                <div className="flex items-center space-x-4 mb-10 p-5 bg-rose-50/50 rounded-3xl border border-rose-100">
                                    <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">♥</div>
                                    <div>
                                        <p className="text-[10px] text-rose-500 font-black uppercase tracking-[0.2em]">Được xác thực bởi</p>
                                        <p className="font-black text-gray-900 text-lg">Hệ thống VNHeart Charity</p>
                                    </div>
                                </div>

                                <div 
                                    className="prose prose-rose max-w-none text-gray-700 leading-relaxed text-lg font-medium"
                                    dangerouslySetInnerHTML={{ __html: campaign.content || campaign.description }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab Content: Transparency */}
                    {activeTab === 'transparency' && (
                        <div className="space-y-6 animate-fade-in content-fade-in">
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-10 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">Sổ cái chiến dịch</h2>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Cập nhật thời gian thực 24/7</p>
                                    </div>
                                    <div className="bg-white px-4 py-2 rounded-xl text-[10px] font-black text-rose-600 border border-rose-100 shadow-sm animate-pulse uppercase tracking-[0.2em]">
                                        ● Live
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/30">
                                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Thời gian</th>
                                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Chi tiết giao dịch</th>
                                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Số tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {campaign.statements && campaign.statements.length > 0 ? (
                                                campaign.statements.map((st) => (
                                                    <tr key={st.id} className="hover:bg-rose-50/30 transition-colors group">
                                                        <td className="px-10 py-6 whitespace-nowrap text-xs text-gray-500 font-bold uppercase tabular-nums">
                                                            {formatDateTime(st.transaction_date)}
                                                        </td>
                                                        <td className="px-10 py-6">
                                                            <div className="font-black text-gray-900 text-sm group-hover:text-rose-600 transition-colors">{st.content}</div>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-md">{st.account_name || 'ANONYMOUS'}</span>
                                                                <span className="text-[9px] text-rose-300 font-mono italic">{st.transaction_id || 'ID-INTERNAL'}</span>
                                                            </div>
                                                        </td>
                                                        <td className={`px-10 py-6 text-right font-black text-xl tabular-nums ${
                                                            st.type === 'in' ? 'text-green-600' : 'text-rose-600'
                                                        }`}>
                                                            {st.type === 'in' ? '+' : ''}{formatMoney(st.amount)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="px-10 py-24 text-center">
                                                        <div className="text-5xl mb-4">🛡️</div>
                                                        <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">
                                                            Đang chờ những tấm lòng vàng đầu tiên...
                                                        </p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-10 lg:sticky lg:top-28 transition-all duration-500">
                        {/* Progress */}
                        <div className="mb-10 text-center lg:text-left">
                            <div className="flex justify-between items-end mb-6">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Tiến độ dự án</span>
                                <span className="text-4xl font-black text-rose-600">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-50 rounded-full h-5 overflow-hidden mb-8 shadow-inner ring-4 ring-gray-100/50 relative p-1">
                                <div
                                    className="h-3 rounded-full bg-gradient-to-r from-rose-500 to-red-600 shadow-lg transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="w-full h-full opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-shimmer"></div>
                                </div>
                            </div>
                            <p className="text-4xl font-black text-gray-900 mb-2 tabular-nums">{formatMoney(raised)}</p>
                            <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em]">
                                Mục tiêu <span className="text-gray-900 ml-2">{formatMoney(goal)}</span>
                            </p>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-5 mb-10">
                            <div className="bg-rose-50/50 rounded-3xl p-6 text-center border border-rose-100/50 hover:bg-rose-100 transition duration-300">
                                <p className="text-3xl font-black text-rose-600 tabular-nums">{campaign.donations_count || (Math.floor(raised/100000))}</p>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-2">Người góp</p>
                            </div>
                            <div className="bg-blue-50/50 rounded-3xl p-6 text-center border border-blue-100/50 hover:bg-blue-100 transition duration-300">
                                <p className="text-3xl font-black text-blue-600 tabular-nums">
                                    {campaign.end_date ? Math.max(0, Math.ceil((new Date(campaign.end_date) - new Date()) / 86400000)) : '∞'}
                                </p>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-2">Ngày còn</p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        {campaign.status === 'active' ? (
                            <button
                                onClick={() => setDonateOpen(true)}
                                className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-800 text-white font-black py-6 rounded-3xl shadow-xl shadow-rose-200 hover:shadow-rose-400 hover:-translate-y-1 transition-all text-xl uppercase tracking-[0.2em] active:scale-95 group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <span className="text-2xl animate-pulse">❤️</span> Góp quỹ ngay
                                </span>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>
                            </button>
                        ) : (
                            <div className="w-full bg-gray-100 text-gray-400 font-black py-6 rounded-3xl text-center text-xl uppercase tracking-widest opacity-50 flex items-center justify-center gap-3">
                                ✅ Dự án hoàn thành
                            </div>
                        )}
                        
                        <div className="mt-8 text-center space-y-2">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                <span className="text-green-500">✔</span> Minh bạch 24/7
                            </p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                <span className="text-green-500">✔</span> Không phí quản lý
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 1: Donation Form Modal */}
            {donateOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fade-in" onClick={() => setDonateOpen(false)} />
                    <div className="relative bg-white rounded-[3.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-modal-in border border-white/20">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-rose-600 to-red-600 p-12 text-white relative">
                            <button onClick={() => setDonateOpen(false)} className="absolute top-10 right-10 text-white/50 hover:text-white transition text-4xl">✕</button>
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-rose-200 opacity-80">Lan tỏa yêu thương</div>
                            <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tighter leading-none">Mở lòng quyên góp</h2>
                            <p className="text-rose-100 font-bold text-lg leading-snug line-clamp-1 italic">"{campaign.title}"</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 lg:p-14 space-y-10 overflow-y-auto flex-1 custom-scrollbar">
                            {/* Amount Selector */}
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <label className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Chọn mức đóng góp</label>
                                    <span className="text-[10px] font-bold text-gray-400 italic">VNĐ (Việt Nam Đồng)</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {presets.map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => { setPresetAmount(p); setData('amount', p); }}
                                            className={`py-5 rounded-2xl text-xs font-black transition-all border-2 ${
                                                presetAmount === p && data.amount === p
                                                    ? 'border-rose-600 bg-rose-600 text-white shadow-xl scale-105'
                                                    : 'border-gray-100 text-gray-500 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50/30'
                                            }`}
                                        >
                                            {formatMoneyShort(p)}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xl">₫</span>
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={e => { setData('amount', e.target.value); setPresetAmount(null); }}
                                        placeholder="Nhập số tiền khác..."
                                        className={`w-full border-2 ${errors.amount ? 'border-red-400' : 'border-gray-100'} rounded-3xl pl-12 pr-6 py-6 focus:ring-8 focus:ring-rose-500/10 focus:border-rose-500 bg-gray-50 text-2xl font-black transition-all group-hover:border-rose-100 tabular-nums`}
                                        min="10000"
                                    />
                                    {errors.amount && <p className="text-red-500 text-xs font-bold mt-3 ml-4">⚠️ {errors.amount}</p>}
                                </div>
                            </div>

                            {/* Donor Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Họ tên người góp</label>
                                    <input
                                        type="text"
                                        value={data.donor_name}
                                        onChange={e => setData('donor_name', e.target.value)}
                                        className="w-full border-2 border-gray-100 rounded-2xl px-6 py-5 focus:ring-8 focus:ring-rose-500/10 focus:border-rose-500 bg-gray-50 font-black transition-all"
                                        disabled={data.is_anonymous}
                                        placeholder="Để vinh danh bạn"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Địa chỉ Email</label>
                                    <input
                                        type="email"
                                        value={data.donor_email}
                                        onChange={e => setData('donor_email', e.target.value)}
                                        className="w-full border-2 border-gray-100 rounded-2xl px-6 py-5 focus:ring-8 focus:ring-rose-500/10 focus:border-rose-500 bg-gray-50 font-black transition-all"
                                        placeholder="Để nhận báo cáo"
                                    />
                                </div>
                            </div>

                            {/* Message & Options */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Lời chúc (Tùy chọn)</label>
                                    <textarea
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        rows={2}
                                        placeholder="Gửi lời chúc ấm áp..."
                                        className="w-full border-2 border-gray-100 rounded-2xl px-6 py-5 focus:ring-8 focus:ring-rose-500/10 focus:border-rose-500 bg-gray-50 font-black transition-all"
                                    />
                                </div>
                                <label className="inline-flex items-center p-6 bg-gray-50 rounded-[2rem] border-2 border-gray-100 cursor-pointer hover:border-rose-200 transition-all w-full select-none">
                                    <input
                                        type="checkbox"
                                        checked={data.is_anonymous}
                                        onChange={e => setData('is_anonymous', e.target.checked)}
                                        className="w-6 h-6 text-rose-600 rounded-lg border-gray-200 focus:ring-rose-500"
                                    />
                                    <div className="ml-5">
                                        <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Góp ẩn danh</p>
                                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">Tên bạn vẫn được lưu bí mật trong sổ cái</p>
                                    </div>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing || !data.amount}
                                className="w-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-black py-7 rounded-[2.5rem] shadow-2xl shadow-rose-200 hover:shadow-rose-400 hover:-translate-y-1 transition-all disabled:opacity-50 text-xl uppercase tracking-[0.3em] active:scale-95"
                            >
                                {processing ? '⏳ Đang khởi tạo...' : `Kích hoạt quyên góp ❤️`}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Step 2: Payment Instruction / Success Modal (VietQR Style) */}
            {showSuccess && (
                <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-rose-900/40 backdrop-blur-xl animate-fade-in" onClick={() => setShowSuccess(false)} />
                    <div className="relative bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-lg overflow-hidden flex flex-col animate-success-in border border-white">
                        <div className="p-10 lg:p-14 text-center">
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-heart-beat">🎉</div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight leading-none">Cảm ơn Nhà hảo tâm!</h2>
                            <p className="text-gray-500 font-medium mb-8">Vui lòng thực hiện chuyển khoản để hoàn tất quyên góp của bạn.</p>
                            
                            {/* Bank Detail Box */}
                            <div className="bg-gray-50 rounded-[2.5rem] p-8 border-2 border-dashed border-gray-200 mb-8 relative group">
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full text-[9px] font-black text-rose-500 border border-rose-100 uppercase tracking-[0.2em] shadow-sm">Hướng dẫn chuyển khoản</span>
                                
                                <div className="space-y-6">
                                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50">
                                        <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                            {/* Mock QR Animation */}
                                            <div className="text-8xl opacity-10 font-bold rotate-12">QR CODE</div>
                                            <div className="absolute inset-4 rounded-xl border-4 border-black/5 flex flex-col items-center justify-center">
                                                 <div className="w-4/5 h-1 bg-black/5 mb-2 animate-scan"></div>
                                                 <div className="text-[40px]">📱</div>
                                                 <p className="text-[10px] font-black text-gray-300 mt-2 uppercase">VietQR Mockup</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="text-left space-y-3">
                                        <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-50">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngân hàng</span>
                                            <span className="text-sm font-black text-gray-900">VNHeart MBBank</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-50">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số tài khoản</span>
                                            <span className="text-base font-black text-rose-600 tracking-wider">1104 2026 8888</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-50">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số tiền</span>
                                            <span className="text-lg font-black text-gray-900">{formatMoney(data.amount)}</span>
                                        </div>
                                        <div className="flex flex-col gap-2 bg-rose-50 p-4 rounded-2xl border border-rose-100">
                                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Nội dung chuyển khoản (BẮT BUỘC)</span>
                                            <span className="text-xs font-black text-gray-900 break-all select-all cursor-pointer hover:text-rose-600 transition-colors uppercase tabular-nums">
                                                {currentDonationId || 'VNH-LOADING'} QC
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowSuccess(false)}
                                className="w-full bg-gray-900 text-white font-black py-6 rounded-3xl hover:bg-black transition-all text-sm uppercase tracking-[0.3em] shadow-xl"
                            >
                                Đã hoàn tất chuyển khoản
                            </button>
                            <p className="text-[9px] text-gray-400 font-bold mt-6 uppercase tracking-widest">Hệ thống sẽ cập nhật sau 1-3 phút</p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                @keyframes modal-in { 0% { transform: translateY(30px) scale(0.95); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
                @keyframes success-in { 0% { transform: scale(0.8) translateY(50px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
                @keyframes shimmer { 100% { background-position: 24px 24px; } }
                @keyframes scan { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(140px); } }
                @keyframes heart-beat { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
                
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
                .animate-modal-in { animation: modal-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                .animate-success-in { animation: success-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                .animate-shimmer { animation: shimmer 1s linear infinite; }
                .animate-scan { animation: scan 3s ease-in-out infinite; }
                .animate-heart-beat { animation: heart-beat 1s ease-in-out infinite; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                
                .content-fade-in { animation: fade-in 0.8s ease-out forwards; }
                
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #fee2e2; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #fca5a5; }
            `}</style>
        </AppLayout>
    );
}
