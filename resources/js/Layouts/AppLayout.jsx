import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import ChatbotUI from "@/Components/ChatbotUI";

export default function AppLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Safe route helper
    const safeRoute = (name, ...params) => {
        try {
            if (typeof route === "function") {
                return route(name, ...params);
            }
        } catch (e) {}
        const fallback = {
            "home": "/",
            "dashboard": "/dashboard",
            "campaigns.index": "/campaigns",
            "transparency.index": "/transparency",
            "news.index": "/news",
            "logout": "/logout",
            "profile.edit": "/profile"
        };
        return fallback[name] || "/";
    };

    const getAvatarUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `/storage/${path}`;
    };

    const isActive = (routeName) => {
        try {
            if (typeof route === "function" && typeof route().current === "function") {
                return route().current(routeName);
            }
        } catch (e) {}
        return false;
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-rose-100 selection:text-rose-700">
            {/* Top Navbar with Glassmorphism */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
                scrolled 
                    ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3" 
                    : "bg-transparent py-5"
            }`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="flex justify-between items-center h-16">
                        {/* Left: Logo & Nav */}
                        <div className="flex items-center space-x-12">
                            <Link href="/" className="flex items-center space-x-3 group outline-none">
                                <div className="w-11 h-11 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg relative overflow-hidden group-hover:shadow-rose-500/50 transition duration-300 group-hover:scale-105 group-hover:rotate-3">
                                    <span className="relative font-bold text-xl">♥</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-red-500 tracking-tighter leading-none">
                                        VNHeart
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mt-1">Charity Org</span>
                                </div>
                            </Link>
                            
                            <div className="hidden lg:flex items-center space-x-2">
                                {[
                                    { name: 'Dự án', route: 'campaigns.index' },
                                    { name: 'Tin tức', route: 'news.index' },
                                    { name: 'Minh bạch', route: 'transparency.index' }
                                ].map(item => (
                                    <Link 
                                        key={item.name}
                                        href={safeRoute(item.route)} 
                                        className={`px-5 py-2.5 rounded-full text-sm font-black transition-all duration-300 uppercase tracking-widest outline-none ${
                                            isActive(item.route.replace('.index', '.*')) 
                                                ? 'bg-rose-50 text-rose-600' 
                                                : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50/50'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <Link href="/#about" className="px-5 py-2.5 rounded-full text-sm font-black text-gray-500 hover:text-rose-600 hover:bg-rose-50/50 transition-all duration-300 uppercase tracking-widest">About</Link>
                            </div>
                        </div>

                        {/* Right: Auth & Profile */}
                        <div className="flex items-center space-x-4">
                            {!user ? (
                                <div className="hidden md:flex items-center space-x-3">
                                    <Link href={safeRoute('login')} className="text-gray-500 hover:text-rose-600 font-black px-5 py-2.5 text-xs uppercase tracking-widest transition">Đăng nhập</Link>
                                    <Link href={safeRoute('register')} className="bg-gradient-to-r from-rose-600 to-red-600 text-white font-black px-8 py-3.5 rounded-full shadow-xl shadow-rose-200 hover:shadow-rose-500/40 hover:-translate-y-1 transition-all text-xs uppercase tracking-[0.2em]">Tham gia</Link>
                                </div>
                            ) : (
                                <div className="relative">
                                    <button 
                                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                        className="flex items-center space-x-3 p-1.5 pr-4 rounded-2xl bg-gray-50 hover:bg-rose-50 border border-gray-100 transition-all duration-300 outline-none"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-red-500 rounded-xl flex items-center justify-center text-white font-black shadow-sm overflow-hidden border-2 border-white">
                                            {user.avatar ? (
                                                <img src={getAvatarUrl(user.avatar)} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="text-left hidden lg:block">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Thành viên</p>
                                            <p className="text-xs font-black text-gray-800 truncate max-w-[100px]">{user.name}</p>
                                        </div>
                                        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>

                                    {profileDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)}></div>
                                            <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-4 border border-rose-50/50 z-50 animate-modal-in p-2">
                                                <div className="px-6 py-4 border-b border-gray-50 mb-3">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tài khoản</p>
                                                    <p className="text-sm font-black text-gray-900 truncate">{user.email}</p>
                                                </div>
                                                <Link href={safeRoute('dashboard')} className="flex items-center gap-4 px-5 py-4 text-sm text-gray-600 hover:bg-rose-50 hover:text-rose-600 font-bold mx-2 rounded-2xl transition-all">
                                                    <span className="text-xl">🏠</span> Bảng điều khiển
                                                </Link>
                                                <Link href={safeRoute('profile.edit')} className="flex items-center gap-4 px-5 py-4 text-sm text-gray-600 hover:bg-rose-50 hover:text-rose-600 font-bold mx-2 rounded-2xl transition-all">
                                                    <span className="text-xl">⚙️</span> Cài đặt hồ sơ
                                                </Link>
                                                {(user.role === 'admin' || user.roles?.some(r => r.name === 'admin')) && (
                                                    <Link href={safeRoute('admin.dashboard')} className="flex items-center gap-4 px-5 py-4 text-sm text-gray-600 hover:bg-rose-50 hover:text-rose-600 font-bold mx-2 rounded-2xl transition-all">
                                                        <span className="text-xl">🛡️</span> Quản trị viên
                                                    </Link>
                                                )}
                                                <div className="mt-3 pt-3 border-t border-gray-50">
                                                    <Link 
                                                        href={safeRoute('logout')} 
                                                        method="post" 
                                                        as="button" 
                                                        className="flex items-center gap-4 w-full text-left px-5 py-4 text-sm text-red-500 hover:bg-red-50 font-black rounded-2xl transition-all uppercase tracking-widest mx-2"
                                                    >
                                                        <span className="text-xl">🚪</span> Đăng xuất
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Mobile Toggle */}
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                                className="lg:hidden w-11 h-11 flex flex-col items-center justify-center space-y-1.5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-rose-50 transition-all outline-none"
                            >
                                <span className={`w-5 h-0.5 bg-gray-900 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`w-5 h-0.5 bg-gray-900 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`w-5 h-0.5 bg-gray-900 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white border-t border-gray-50 ${mobileMenuOpen ? 'max-h-[600px] shadow-xl' : 'max-h-0'}`}>
                    <div className="p-6 space-y-3">
                        <Link href="/" className="block px-6 py-4 font-black text-gray-700 hover:bg-rose-50 rounded-2xl uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link>
                        <Link href={safeRoute('campaigns.index')} className="block px-6 py-4 font-black text-gray-700 hover:bg-rose-50 rounded-2xl uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Dự án</Link>
                        <Link href={safeRoute('news.index')} className="block px-6 py-4 font-black text-gray-700 hover:bg-rose-50 rounded-2xl uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Tin tức</Link>
                        <Link href={safeRoute('transparency.index')} className="block px-6 py-4 font-black text-gray-700 hover:bg-rose-50 rounded-2xl uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Minh bạch</Link>
                        
                        <div className="pt-6 mt-6 border-t border-gray-100">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-4 mb-6 px-4">
                                        <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center font-black text-white text-xl">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">{user.name}</p>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{user.role}</p>
                                        </div>
                                    </div>
                                    <Link href={safeRoute('dashboard')} className="block px-6 py-4 font-black text-gray-700 hover:bg-rose-50 rounded-2xl uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>🏠 Bảng điều khiển</Link>
                                    <Link href={safeRoute('logout')} method="post" as="button" className="w-full text-left px-6 py-4 font-black text-red-600 hover:bg-red-50 rounded-2xl uppercase tracking-widest text-sm">🚪 Đăng xuất</Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    <Link href={safeRoute('login')} className="flex items-center justify-center py-5 bg-gray-50 rounded-[2rem] font-black text-gray-600 uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Đăng nhập</Link>
                                    <Link href={safeRoute('register')} className="flex items-center justify-center py-5 bg-rose-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-lg shadow-rose-100" onClick={() => setMobileMenuOpen(false)}>Tham gia ngay</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content Area */}
            <main className="flex-1 w-full mx-auto max-w-7xl pt-32 pb-24 px-6 lg:px-10 animate-fade-in-up">
                {children}
            </main>

            {/* Premium Multi-column Footer */}
            <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                        {/* Branding */}
                        <div className="space-y-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-md">♥</div>
                                <span className="text-xl font-black tracking-tighter text-gray-900">VNHeart</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed font-bold">
                                Kết nối những trái tim thiện nguyện, xây dựng cộng đồng nhân ái và minh bạch hàng đầu Việt Nam.
                            </p>
                            <div className="flex space-x-4">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer border border-gray-100">
                                        <div className="w-4 h-4 bg-current opacity-20 rounded-sm"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Điều hướng</h4>
                            <ul className="space-y-4">
                                <li><Link href={safeRoute('campaigns.index')} className="text-sm font-bold text-gray-600 hover:text-rose-600 transition-colors">Dự án thiện nguyện</Link></li>
                                <li><Link href={safeRoute('news.index')} className="text-sm font-bold text-gray-600 hover:text-rose-600 transition-colors">Cập nhật tin tức</Link></li>
                                <li><Link href={safeRoute('transparency.index')} className="text-sm font-bold text-gray-600 hover:text-rose-600 transition-colors">Báo cáo minh bạch</Link></li>
                                <li><Link href="/#about" className="text-sm font-bold text-gray-600 hover:text-rose-600 transition-colors">Về chúng tôi</Link></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Pháp lý</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-sm font-bold text-gray-600 hover:text-rose-600 transition-colors">Điều khoản sử dụng</Link></li>
                                <li><Link href="#" className="text-sm font-bold text-gray-600 hover:text-rose-600 transition-colors">Chính sách bảo mật</Link></li>
                                <li><Link href="#" className="text-sm font-bold text-gray-600 hover:text-rose-600 transition-colors">Quy trình đóng góp</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-rose-50/50 p-8 rounded-[2.5rem] border border-rose-100 space-y-6">
                            <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest">Bản tin hy vọng</h4>
                            <p className="text-xs text-gray-500 font-bold leading-relaxed">Để lại email để nhận thông báo về kết quả của các dự án thiện nguyện.</p>
                            <div className="relative">
                                <input type="email" placeholder="Email của bạn..." className="w-full bg-white border border-rose-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all" />
                                <button className="absolute right-2 top-2 bottom-2 bg-rose-600 text-white px-4 rounded-xl text-[10px] font-black uppercase hover:bg-rose-700 transition">Gửi</button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">© 2026 VNHeart Charity System. v2.0</p>
                        <div className="flex gap-4">
                            <div className="px-3 py-1 bg-gray-50 rounded-lg text-[8px] font-black text-gray-300 uppercase tracking-widest border border-gray-100">Verified Solution</div>
                            <div className="px-3 py-1 bg-gray-50 rounded-lg text-[8px] font-black text-gray-300 uppercase tracking-widest border border-gray-100">SSL Secure</div>
                        </div>
                    </div>
                </div>
            </footer>

            <ChatbotUI />

            <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes modal-in {
                    0% { opacity: 0; transform: translateY(10px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
                .animate-modal-in { animation: modal-in 0.3s ease-out forwards; }
                
                body {
                    scroll-behavior: smooth;
                }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #f9f9f9; }
                ::-webkit-scrollbar-thumb { background: #fca5a5; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #f87171; }
            `}</style>
        </div>
    );
}


