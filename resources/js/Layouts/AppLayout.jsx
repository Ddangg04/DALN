import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import ChatbotUI from "@/Components/ChatbotUI";

export default function AppLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    // safe route fallback
    const safeRoute = (name, ...params) => {
        try {
            if (typeof route === "function") {
                return route(name, ...params);
            }
        } catch (e) {
            // ignore
        }
        const fallback = {
            "home": "/dashboard",
            "campaigns.index": "/campaigns",
            "transparency.index": "/transparency",
            "news.index": "/news",
            "logout": "/logout",
        };
        return fallback[name] || "/";
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
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Top Navbar */}
            <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo & Desktop Nav */}
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="flex items-center space-x-3 group">
                                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden relative group-hover:shadow-rose-500/50 transition duration-300">
                                    <span className="absolute inset-0 bg-white/20 blur-sm"></span>
                                    <span className="relative font-bold text-xl">♥</span>
                                </div>
                                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-red-500 tracking-tight">
                                    VNHeart
                                </span>
                            </Link>
                            
                            <div className="hidden md:flex items-center space-x-6">
                                <Link 
                                    href="/" 
                                    className="text-gray-600 hover:text-rose-600 font-semibold transition"
                                >
                                    Trang chủ
                                </Link>
                                <Link 
                                    href={safeRoute('news.index')} 
                                    className={`font-semibold transition ${isActive('news.*') ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'}`}
                                >
                                    Tin tức
                                </Link>
                                <Link 
                                    href={safeRoute('campaigns.index')} 
                                    className={`font-semibold transition ${isActive('campaigns.*') ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'}`}
                                >
                                    Dự án
                                </Link>
                                <Link 
                                    href={safeRoute('transparency.index')} 
                                    className={`font-semibold transition ${isActive('transparency.*') ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'}`}
                                >
                                    Minh bạch
                                </Link>
                            </div>
                        </div>

                        {/* Right Top Nav */}
                        <div className="hidden md:flex items-center space-x-4">
                            {!user ? (
                                <div className="flex items-center space-x-3">
                                    <Link 
                                        href={route('login')} 
                                        className="text-gray-600 hover:text-rose-600 font-bold px-4 py-2 transition"
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link 
                                        href={route('register')} 
                                        className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-800 text-white font-black px-6 py-2.5 rounded-full shadow-lg hover:shadow-rose-500/30 transition-all active:scale-95 text-xs uppercase tracking-wider"
                                    >
                                        Tham gia ngay
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <button className="text-gray-500 hover:text-rose-600 transition p-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Profile Dropdown */}
                                    <div className="relative">
                                        <button 
                                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                            className="flex items-center space-x-3 p-1 pr-3 rounded-full hover:bg-gray-100 transition focus:outline-none"
                                        >
                                            <div className="w-10 h-10 bg-rose-100 border-2 border-rose-200 text-rose-600 font-bold rounded-full flex items-center justify-center">
                                                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div className="text-left hidden lg:block">
                                                <p className="text-sm font-bold text-gray-800 leading-none">{user?.name}</p>
                                                <p className="text-xs text-gray-500 mt-1 capitalize">{user?.role || "Thành viên"}</p>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </button>

                                        {profileDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50">
                                                <Link href={safeRoute('home')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 font-medium">Trang cá nhân</Link>
                                                {(user?.role === 'admin' || user?.role === 'administrator') && (
                                                    <Link href={safeRoute('admin.dashboard')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 font-medium">Bảng điều khiển Admin</Link>
                                                )}
                                                <div className="border-t border-gray-100 my-1"></div>
                                                <Link 
                                                    href={safeRoute('logout')} 
                                                    method="post" 
                                                    as="button" 
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                                                >
                                                    Đăng xuất
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-500 hover:text-gray-700 p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-200 animate-fade-in">
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            <Link href="/" className="block px-3 py-3 rounded-xl text-base font-bold text-gray-900 hover:bg-rose-50 hover:text-rose-600 transition">Trang chủ</Link>
                            <Link href={safeRoute('campaigns.index')} className="block px-3 py-3 rounded-xl text-base font-bold text-gray-900 hover:bg-rose-50 hover:text-rose-600 transition">Dự án thiện nguyện</Link>
                            <Link href={safeRoute('news.index')} className="block px-3 py-3 rounded-xl text-base font-bold text-gray-900 hover:bg-rose-50 hover:text-rose-600 transition">Tin tức & Sự kiện</Link>
                            <Link href={safeRoute('transparency.index')} className="block px-3 py-3 rounded-xl text-base font-bold text-gray-900 hover:bg-rose-50 hover:text-rose-600 transition">Sổ cái minh bạch</Link>
                            
                            <div className="border-t border-gray-100 my-4 pt-4">
                                {user ? (
                                    <>
                                        <Link href={safeRoute('home')} className="block px-3 py-3 rounded-xl text-base font-bold text-gray-900 hover:bg-rose-50 hover:text-rose-600 transition">Trang cá nhân</Link>
                                        <Link href={safeRoute('logout')} method="post" as="button" className="block w-full text-left px-3 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50 transition">Đăng xuất</Link>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 px-3">
                                        <Link href={route('login')} className="flex items-center justify-center py-3 rounded-xl font-bold text-gray-700 bg-gray-50 border border-gray-200">Đăng nhập</Link>
                                        <Link href={route('register')} className="flex items-center justify-center py-3 rounded-xl font-bold text-white bg-rose-600 shadow-lg shadow-rose-200">Đăng ký</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Page Header (Optional) */}
            {header && (
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="flex-1 w-full mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    © 2026 VNHeart Foundation. All rights reserved.
                </div>
            </footer>

            <ChatbotUI />
        </div>
    );
}
