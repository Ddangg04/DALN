import { Head, Link, router } from "@inertiajs/react";
import ChatbotUI from "@/Components/ChatbotUI";
import { useState, useEffect, useRef, Fragment } from "react";
import AppLayout from "@/Layouts/AppLayout";
import axios from "axios";
import { MapPin, Search, Phone, Mail, Loader2, User, Map as MapIcon, ChevronDown, Check } from "lucide-react";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, Transition } from '@headlessui/react';

export default function Welcome({ auth, featuredCampaigns, latestStatements, topDonors }) {
    const [searchQuery, setSearchQuery] = useState("");
    const campaigns = featuredCampaigns || [];
    const statements = latestStatements || [];
    const donors = topDonors || [];

    const getAvatarUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `/storage/${path}`;
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        router.get(route('campaigns.index'), { search: searchQuery });
    };

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDateShort = (dateStr) => {
        if (!dateStr) return '--:--';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return '--:--';
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        } catch (e) {
            return '--:--';
        }
    };

    const safeRoute = (name, ...params) => {
        try { return route(name, ...params); } catch (e) { return "#"; }
    };

    return (
        <AppLayout auth={auth}>
            <Head title="Kết nối yêu thương - VNHeart Thiện Nguyện" />

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

            {/* Bảng vinh danh (Top Donors) */}
            <div className="py-24 bg-rose-50/50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <span className="text-rose-500 font-bold uppercase tracking-widest text-xs mb-4 block">Những trái tim vàng</span>
                    <h2 className="text-4xl font-black text-gray-900 mb-12">Bảng vàng vinh danh</h2>
                    
                    <div className="flex flex-wrap justify-center gap-6">
                        {donors.length > 0 ? donors.map((d, i) => (
                            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-xl hover:-translate-y-2 transition duration-300 w-48 group">
                                <div className="w-20 h-20 rounded-full border-4 border-rose-50 mb-4 overflow-hidden shadow-inner group-hover:border-rose-200 transition-colors">
                                    {d.avatar ? (
                                        <img src={getAvatarUrl(d.avatar)} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-rose-50 flex items-center justify-center font-black text-rose-300 text-2xl uppercase">
                                            {d.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <p className="font-black text-gray-900 text-sm mb-1 text-center line-clamp-1">{d.name}</p>
                                <p className="text-rose-600 font-black text-xs">
                                    {new Intl.NumberFormat('vi-VN').format(d.total_amount)}đ
                                </p>
                            </div>
                        )) : (
                            <p className="text-gray-400 font-bold italic py-10">Đang cập nhật danh sách nhà hảo tâm...</p>
                        )}
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
                    </div>
                </div>
            </div>

            {/* Area Manager Search Section */}
            <AreaSearchSection />

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
        </AppLayout>
    );
}



function AreaSearchSection() {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selection, setSelection] = useState({ province: "", district: "", ward: "" });
    const [managers, setManagers] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);

    // Queries for filtering
    const [provinceQuery, setProvinceQuery] = useState("");
    const [districtQuery, setDistrictQuery] = useState("");
    const [wardQuery, setWardQuery] = useState("");

    useEffect(() => {
        axios.get('/api/provinces').then(res => setProvinces(res.data));
    }, []);

    const handleProvinceChange = (id) => {
        setSelection({ province: id, district: "", ward: "" });
        setDistricts([]);
        setWards([]);
        setDistrictQuery("");
        setWardQuery("");
        if (id) {
            axios.get(`/api/provinces/${id}/districts`).then(res => setDistricts(res.data));
        }
    };

    const handleDistrictChange = (id) => {
        setSelection(s => ({ ...s, district: id, ward: "" }));
        setWards([]);
        setWardQuery("");
        if (id) {
            axios.get(`/api/districts/${id}/wards`).then(res => setWards(res.data));
        }
    };

    const handleSearch = async () => {
        setSearching(true);
        try {
            const res = await axios.get('/api/search-managers', {
                params: {
                    ward_id: selection.ward,
                    district_id: selection.district,
                    province_id: selection.province
                }
            });
            setManagers(res.data.managers);
            setSearched(true);
        } catch (e) {
            console.error(e);
        } finally {
            setSearching(false);
        }
    };

    // Filter functions
    const filteredProvinces = provinceQuery === "" ? provinces : provinces.filter((p) => 
        p.name.toLowerCase().replace(/\s+/g, "").includes(provinceQuery.toLowerCase().replace(/\s+/g, ""))
    );

    const filteredDistricts = districtQuery === "" ? districts : districts.filter((d) => 
        d.name.toLowerCase().replace(/\s+/g, "").includes(districtQuery.toLowerCase().replace(/\s+/g, ""))
    );

    const filteredWards = wardQuery === "" ? wards : wards.filter((w) => 
        w.name.toLowerCase().replace(/\s+/g, "").includes(wardQuery.toLowerCase().replace(/\s+/g, ""))
    );

    const getSelectedItemName = (list, id) => {
        if (!id) return "";
        return list.find(item => String(item.id) === String(id))?.name || "";
    };

    return (
        <div className="py-24 bg-gradient-to-b from-white to-rose-50/30">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-rose-100 border border-rose-50 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Search Sidebar */}
                        <div className="lg:w-1/3 p-10 lg:p-16 bg-rose-600 text-white">
                            <h2 className="text-3xl font-black mb-6 leading-tight">Bạn cần sự giúp đỡ?</h2>
                            <p className="text-rose-100 mb-10 font-medium">
                                Hãy tìm kiếm người quản lý khu vực gần bạn nhất để được hỗ trợ kết nối với cộng đồng.
                            </p>
                            
                            <div className="space-y-6">
                                {/* Searchable Province */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-rose-200">Tỉnh / Thành phố</label>
                                    <Combobox value={selection.province} onChange={handleProvinceChange}>
                                        <div className="relative">
                                            <ComboboxInput
                                                className="w-full bg-rose-700/50 border-none rounded-2xl py-4 px-6 text-white font-bold focus:ring-2 focus:ring-white outline-none placeholder-rose-300"
                                                displayValue={(id) => getSelectedItemName(provinces, id)}
                                                onChange={(event) => setProvinceQuery(event.target.value)}
                                                placeholder="Nhập tên Tỉnh..."
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                <ChevronDown className="h-5 w-5 text-rose-200" aria-hidden="true" />
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                                afterLeave={() => setProvinceQuery("")}
                                            >
                                                <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                                    {filteredProvinces.length === 0 && provinceQuery !== "" ? (
                                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700 font-bold">Không tìm thấy.</div>
                                                    ) : (
                                                        filteredProvinces.map((p) => (
                                                            <ComboboxOption
                                                                key={p.id}
                                                                className={({ focus }) => `relative cursor-default select-none py-3 px-6 ${focus ? "bg-rose-600 text-white" : "text-gray-900"}`}
                                                                value={p.id}
                                                            >
                                                                {({ selected }) => (
                                                                    <span className={`block truncate ${selected ? "font-black" : "font-medium"}`}>
                                                                        {p.name}
                                                                    </span>
                                                                )}
                                                            </ComboboxOption>
                                                        ))
                                                    )}
                                                </ComboboxOptions>
                                            </Transition>
                                        </div>
                                    </Combobox>
                                </div>

                                {/* Searchable District */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-rose-200">Quận / Huyện</label>
                                    <Combobox value={selection.district} onChange={handleDistrictChange} disabled={!selection.province}>
                                        <div className="relative">
                                            <ComboboxInput
                                                className="w-full bg-rose-700/50 border-none rounded-2xl py-4 px-6 text-white font-bold focus:ring-2 focus:ring-white outline-none placeholder-rose-300 disabled:opacity-50"
                                                displayValue={(id) => getSelectedItemName(districts, id)}
                                                onChange={(event) => setDistrictQuery(event.target.value)}
                                                placeholder={selection.province ? "Nhập tên Huyện..." : "Chọn Tỉnh trước"}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                <ChevronDown className="h-5 w-5 text-rose-200" aria-hidden="true" />
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                                afterLeave={() => setDistrictQuery("")}
                                            >
                                                <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                                    {filteredDistricts.length === 0 && districtQuery !== "" ? (
                                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700 font-bold">Không tìm thấy.</div>
                                                    ) : (
                                                        filteredDistricts.map((d) => (
                                                            <ComboboxOption
                                                                key={d.id}
                                                                className={({ focus }) => `relative cursor-default select-none py-3 px-6 ${focus ? "bg-rose-600 text-white" : "text-gray-900"}`}
                                                                value={d.id}
                                                            >
                                                                {({ selected }) => <span className={`block truncate ${selected ? "font-black" : "font-medium"}`}>{d.name}</span>}
                                                            </ComboboxOption>
                                                        ))
                                                    )}
                                                </ComboboxOptions>
                                            </Transition>
                                        </div>
                                    </Combobox>
                                </div>

                                {/* Searchable Ward */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-rose-200">Xã / Phường / Thị trấn</label>
                                    <Combobox value={selection.ward} onChange={(id) => setSelection(s => ({ ...s, ward: id }))} disabled={!selection.district}>
                                        <div className="relative">
                                            <ComboboxInput
                                                className="w-full bg-rose-700/50 border-none rounded-2xl py-4 px-6 text-white font-bold focus:ring-2 focus:ring-white outline-none placeholder-rose-300 disabled:opacity-50"
                                                displayValue={(id) => getSelectedItemName(wards, id)}
                                                onChange={(event) => setWardQuery(event.target.value)}
                                                placeholder={selection.district ? "Nhập tên Xã..." : "Chọn Huyện trước"}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                <ChevronDown className="h-5 w-5 text-rose-200" aria-hidden="true" />
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                                afterLeave={() => setWardQuery("")}
                                            >
                                                <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                                    {filteredWards.length === 0 && wardQuery !== "" ? (
                                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700 font-bold">Không tìm thấy.</div>
                                                    ) : (
                                                        filteredWards.map((w) => (
                                                            <ComboboxOption
                                                                key={w.id}
                                                                className={({ focus }) => `relative cursor-default select-none py-3 px-6 ${focus ? "bg-rose-600 text-white" : "text-gray-900"}`}
                                                                value={w.id}
                                                            >
                                                                {({ selected }) => <span className={`block truncate ${selected ? "font-black" : "font-medium"}`}>{w.name}</span>}
                                                            </ComboboxOption>
                                                        ))
                                                    )}
                                                </ComboboxOptions>
                                            </Transition>
                                        </div>
                                    </Combobox>
                                </div>

                                <button 
                                    onClick={handleSearch}
                                    disabled={!selection.province || searching}
                                    className="w-full bg-white text-rose-600 hover:bg-rose-50 py-4 rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {searching ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                                    Tìm người phụ trách
                                </button>
                            </div>
                        </div>

                        {/* Search Results Area */}
                        <div className="lg:w-2/3 p-10 lg:p-16 relative min-h-[500px] flex flex-col justify-center">
                            {!searched ? (
                                <div className="text-center space-y-6">
                                    <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <MapIcon size={48} className="animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900">Tìm kiếm sự hỗ trợ ngay hôm nay</h3>
                                    <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                                        Vui lòng chọn khu vực của bạn để chúng tôi kết nối bạn với những người quản lý có thể giúp đỡ bạn.
                                    </p>
                                </div>
                            ) : managers.length > 0 ? (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                            <span className="bg-rose-100 text-rose-600 w-10 h-10 rounded-xl flex items-center justify-center text-lg">{managers.length}</span>
                                            Người hỗ trợ tìm thấy
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                        {managers.map(m => (
                                            <div key={m.id} className="bg-gray-50/50 hover:bg-white p-6 rounded-[2.5rem] border border-gray-100 hover:border-rose-200 transition-all duration-300 group hover:shadow-xl hover:shadow-rose-100/50">
                                                <div className="flex items-start gap-4 mb-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-rose-200 overflow-hidden">
                                                        {m.avatar ? <img src={`/storage/${m.avatar}`} className="w-full h-full object-cover" /> : m.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900 text-lg group-hover:text-rose-600 transition-colors">{m.name}</h4>
                                                        <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">{m.area_name}</p>
                                                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10} /> {m.location}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    {m.phone && (
                                                        <a href={`tel:${m.phone}`} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:border-rose-300 transition-colors">
                                                            <div className="w-8 h-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><Phone size={14} /></div>
                                                            <span className="text-sm font-bold text-gray-700">{m.phone}</span>
                                                        </a>
                                                    )}
                                                    <a href={`mailto:${m.email}`} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:border-rose-300 transition-colors">
                                                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Mail size={14} /></div>
                                                        <span className="text-sm font-bold text-gray-700 truncate">{m.email}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-6">
                                    <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <User size={48} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900">Rất tiếc, chưa tìm thấy người phụ trách</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        Khu vực này hiện chưa có người quản lý trực tiếp. Bạn vui lòng liên hệ hotline tổng đài 1900 xxxx để được hỗ trợ.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #fee2e2; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #fecaca; }
            `}} />
        </div>
    );
}
