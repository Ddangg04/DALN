import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import ChatbotUI from "@/Components/ChatbotUI";

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const pageProps = page?.props || {};
    const auth = pageProps.auth || {};
    const user = auth.user || null;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        if (window.innerWidth >= 1024) {
            setSidebarOpen(true);
        }
    }, []);

    const safeRoute = (name, ...params) => {
        try {
            if (typeof route === "function") return route(name, ...params);
        } catch (e) {}
        const fallback = {
            "admin.dashboard": "/admin/dashboard",
            "admin.users.index": "/admin/users",
            "admin.campaigns.index": "/admin/campaigns",
            "admin.donations.index": "/admin/donations",
            "admin.news.index": "/admin/news",
            "admin.users.create": "/admin/users/create",
            "campaigns.index": "/campaigns",
            "home": "/",
            logout: "/logout",
        };
        return fallback[name] || "/";
    };

    const isActive = (routeName, href) => {
        try {
            if (typeof route === "function" && typeof route().current === "function") {
                return route().current(routeName);
            }
        } catch (e) {}
        try {
            const path = window.location.pathname;
            return href && path === new URL(href, window.location.origin).pathname;
        } catch (e) { return false; }
    };

    const getNavigationItems = () => {
        const role = user?.role || (user ? user.roles?.[0]?.name ?? null : null);
        const roleNormalized = role ? String(role).toLowerCase() : null;

        const adminItems = [
            { name: "Tổng quan", routeName: "admin.dashboard", icon: "dashboard" },
            { name: "Quản lý người dùng", routeName: "admin.users.index", icon: "users" },
            { name: "Chiến dịch", routeName: "admin.campaigns.index", icon: "heart" },
            { name: "Quyên góp", routeName: "admin.donations.index", icon: "money" },
            { name: "Tin tức", routeName: "admin.news.index", icon: "news" },
        ];

        if (roleNormalized === "admin" || roleNormalized === "administrator") return adminItems;
        return adminItems; // Fallback for auth layout (admin only)
    };

    const navigationItems = getNavigationItems();

    const getIcon = (iconName) => {
        const common = { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" };
        const icons = {
            dashboard: <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
            users: <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            heart: <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
            money: <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            news: <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
        };
        return icons[iconName] ?? icons.dashboard;
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl transform transition-all duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                ${sidebarCollapsed ? "w-16 lg:w-16" : "w-64 lg:w-64"}
            `}>
                {/* Logo */}
                <div className="flex items-center h-20 bg-gradient-to-r from-rose-600 to-red-600 px-4 shadow-sm">
                    <div className="flex items-center space-x-3 w-full">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-600 font-extrabold text-xl shadow-sm flex-shrink-0">
                            ♥
                        </div>
                        {!sidebarCollapsed && (
                            <div>
                                <span className="text-white font-extrabold text-lg leading-none block">VNHeart</span>
                                <span className="text-rose-200 text-xs">Admin Panel</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Info */}
                <div className={`border-b border-gray-100 bg-gray-50 ${sidebarCollapsed ? 'p-3' : 'p-4'}`}>
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center font-extrabold flex-shrink-0 border border-rose-200">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        {!sidebarCollapsed && (
                            <div className="ml-3">
                                <p className="text-sm font-bold text-gray-900 truncate max-w-[140px]">{user?.name ?? "Admin"}</p>
                                <span className="text-xs bg-rose-100 text-rose-700 font-semibold px-2 py-0.5 rounded-full">Quản trị viên</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
                    {!sidebarCollapsed && (
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Quản lý</p>
                    )}
                    {navigationItems.map((item) => {
                        const href = safeRoute(item.routeName);
                        const active = isActive(item.routeName, href);
                        return (
                            <Link
                                key={item.name}
                                href={href}
                                className={`flex items-center rounded-xl text-sm font-semibold transition-all duration-150 group
                                    ${sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
                                    ${active
                                        ? "bg-rose-600 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-rose-50 hover:text-rose-700"
                                    }`}
                                title={sidebarCollapsed ? item.name : undefined}
                            >
                                <div className="flex-shrink-0">{getIcon(item.icon)}</div>
                                {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
                            </Link>
                        );
                    })}

                    {!sidebarCollapsed && (
                        <div className="pt-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Khác</p>
                            <Link
                                href={safeRoute('campaigns.index')}
                                className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-rose-50 hover:text-rose-700 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="ml-3">Xem ngoài trang</span>
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-gray-100">
                    <Link
                        href={safeRoute("logout")}
                        method="post"
                        as="button"
                        className={`flex items-center w-full rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors py-3 ${sidebarCollapsed ? 'px-3 justify-center' : 'px-4'}`}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {!sidebarCollapsed && <span className="ml-3">Đăng xuất</span>}
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className={`${sidebarOpen ? (sidebarCollapsed ? "lg:ml-16" : "lg:ml-64") : ""} transition-all duration-300`}>
                {/* Top bar */}
                <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
                    <div className="flex items-center justify-between px-4 py-4">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setSidebarOpen(s => !s)}
                                className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setSidebarCollapsed(s => !s)}
                                className="hidden lg:flex text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>

                        {header ? (
                            <div className="flex-1 px-4">{header}</div>
                        ) : (
                            <div className="flex-1" />
                        )}

                        <div className="flex items-center space-x-3">
                            <div className="hidden sm:flex items-center space-x-2 bg-rose-50 text-rose-700 text-sm font-bold px-4 py-2 rounded-xl border border-rose-100">
                                <span>♥</span>
                                <span>VNHeart Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">{children}</main>
            </div>

            {/* Global Chatbot UI */}
            <ChatbotUI />
        </div>
    );
}
