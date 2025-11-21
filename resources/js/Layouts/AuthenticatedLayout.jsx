import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const pageProps = page?.props || {};
    const auth = pageProps.auth || {};
    const user = auth.user || null;

    const [sidebarOpen, setSidebarOpen] = useState(false); // mobile default closed
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapsed

    // open sidebar on large screen by default after mount
    useEffect(() => {
        if (window.innerWidth >= 1024) {
            setSidebarOpen(true);
        }
    }, []);

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
            "admin.dashboard": "/admin/dashboard",
            "admin.users.index": "/admin/users",
            "admin.departments.index": "/admin/departments",
            "admin.courses.index": "/admin/courses",
            "admin.users.create": "/admin/users/create",
            "admin.courses.create": "/admin/courses/create",
            "admin.announcements.create": "/admin/announcements/create",
            "admin.announcements.index": "/admin/announcements",
            "admin.reports.index": "/admin/reports",
            "teacher.dashboard": "/giang-vien/dashboard",
            "student.dashboard": "/sinh-vien/dashboard",
            logout: "/logout",
        };
        return fallback[name] || "/";
    };

    // check active route
    const isActive = (routeName, href) => {
        try {
            if (
                typeof route === "function" &&
                typeof route().current === "function"
            ) {
                return route().current(routeName);
            }
        } catch (e) {}
        try {
            const path = window.location.pathname;
            return (
                href && path === new URL(href, window.location.origin).pathname
            );
        } catch (e) {
            return false;
        }
    };

    const getNavigationItems = () => {
        // get role: prefer column role, then spatie roles first item
        const role =
            user?.role || (user ? user.roles?.[0]?.name ?? null : null);

        const adminItems = [
            {
                name: "Dashboard",
                routeName: "admin.dashboard",
                icon: "dashboard",
            },
            {
                name: "Quản lý người dùng",
                routeName: "admin.users.index",
                icon: "users",
            },
            {
                name: "Quản lý khoa",
                routeName: "admin.departments.index",
                icon: "building",
            },
            {
                name: "Quản lý học phần",
                routeName: "admin.courses.index",
                icon: "library",
            },
            {
                name: "Thông báo",
                routeName: "admin.announcements.create",
                icon: "megaphone",
            },
            {
                name: "Báo cáo",
                routeName: "admin.reports.index",
                icon: "chart",
            },
        ];

        const teacherItems = [
            {
                name: "Dashboard",
                routeName: "teacher.dashboard",
                icon: "dashboard",
            },
            {
                name: "Lớp học phần",
                routeName: "teacher.classes.index",
                icon: "users",
            },
            {
                name: "Điểm danh",
                routeName: "teacher.attendance.index",
                icon: "check",
            },
            {
                name: "Quản lý điểm",
                routeName: "teacher.grades.index",
                icon: "grade",
            },
            {
                name: "Lịch giảng dạy",
                routeName: "teacher.schedule",
                icon: "calendar",
            },
            {
                name: "Tài liệu",
                routeName: "teacher.materials.index",
                icon: "folder",
            },
        ];

        const studentItems = [
            {
                name: "Dashboard",
                routeName: "student.dashboard",
                icon: "dashboard",
            },
            {
                name: "Đăng ký học phần",
                routeName: "student.register",
                icon: "plus",
            },
            {
                name: "Thời khóa biểu",
                routeName: "student.schedule",
                icon: "calendar",
            },
            { name: "Xem điểm", routeName: "student.grades", icon: "grade" },
            { name: "Học phí", routeName: "student.tuition", icon: "money" },
            {
                name: "Tài liệu học tập",
                routeName: "student.materials",
                icon: "book",
            },
            {
                name: "Thông tin cá nhân",
                routeName: "student.profile",
                icon: "user",
            },
        ];

        if (!role) return []; // no role => no items

        const roleNormalized = String(role).toLowerCase();

        if (roleNormalized === "admin" || roleNormalized === "administrator")
            return adminItems;
        if (
            roleNormalized === "giang-vien" ||
            roleNormalized === "giangvien" ||
            roleNormalized === "teacher" ||
            roleNormalized === "chu-nhiem"
        )
            return teacherItems;
        if (
            roleNormalized === "sinh-vien" ||
            roleNormalized === "sinhvien" ||
            roleNormalized === "student"
        )
            return studentItems;

        return [];
    };

    const navigationItems = getNavigationItems();

    // SVG icons
    const getIcon = (iconName) => {
        const common = {
            className: "w-5 h-5",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
        };
        const icons = {
            dashboard: (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2"
                    />
                </svg>
            ),
            users: (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-1a4 4 0 00-4-4h-1M7 20h10M12 12a4 4 0 100-8 4 4 0 000 8z"
                    />
                </svg>
            ),
            building: (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 21V7a2 2 0 012-2h6v16H3zM21 21V11a2 2 0 00-2-2h-6v12h8z"
                    />
                </svg>
            ),
            library: (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v7M16 14v7M3 7h18M3 7l9-4 9 4"
                    />
                </svg>
            ),
            megaphone: (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592L5.436 13.683M18 13a3 3 0 100-6"
                    />
                </svg>
            ),
            chart: (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6M13 17V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v8M21 17V5a2 2 0 00-2-2h-2"
                    />
                </svg>
            ),
            check: (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2L22 5"
                    />
                </svg>
            ),
            grade: (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m-2-12l-7 7v6h14v-6l-7-7z"
                    />
                </svg>
            ),
            folder: (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    />
                </svg>
            ),
            plus: (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            ),
            money: (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
                    />
                </svg>
            ),
            user: (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            ),
        };
        return icons[iconName] ?? icons.dashboard;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out
                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }
                    ${sidebarCollapsed ? "w-16 lg:w-16" : "w-64 lg:w-64"}
                `}
            >
                {/* Logo */}
                <div className="flex items-center justify-center h-16 bg-blue-700 border-b px-3">
                    <div className="flex items-center w-full">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <svg
                                className="w-6 h-6 text-blue-700"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                            </svg>
                        </div>
                        {!sidebarCollapsed && (
                            <span className="text-white font-bold text-lg">
                                PHENIKAA LMS
                            </span>
                        )}
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name
                                ? user.name.charAt(0).toUpperCase()
                                : "U"}
                        </div>
                        {!sidebarCollapsed && (
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name ?? "Người dùng"}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {user?.role ?? ""}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    {navigationItems.length === 0 && (
                        <div className="px-4 text-sm text-gray-500">
                            (Không có menu — kiểm tra `auth.user` backend share)
                        </div>
                    )}

                    {navigationItems.map((item) => {
                        const href = safeRoute(item.routeName);
                        const active = isActive(item.routeName, href);
                        return (
                            <Link
                                key={item.name}
                                href={href}
                                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                }`}
                                title={sidebarCollapsed ? item.name : undefined}
                            >
                                <div
                                    className={`flex items-center ${
                                        sidebarCollapsed
                                            ? "justify-center w-full"
                                            : ""
                                    }`}
                                >
                                    <div className="flex-shrink-0">
                                        {getIcon(item.icon)}
                                    </div>
                                    {!sidebarCollapsed && (
                                        <span className="ml-3">
                                            {item.name}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t">
                    <Link
                        href={safeRoute("logout")}
                        method="post"
                        as="button"
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        {!sidebarCollapsed && (
                            <span className="ml-3">Đăng xuất</span>
                        )}
                    </Link>
                </div>
            </aside>

            {/* Main content area (margin-left depends on sidebar) */}
            <div
                className={`${
                    sidebarOpen
                        ? sidebarCollapsed
                            ? "lg:ml-16"
                            : "lg:ml-64"
                        : ""
                } transition-all duration-300`}
            >
                {/* Top bar */}
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="flex items-center justify-between px-4 py-4">
                        {/* Mobile hamburger */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen((s) => !s)}
                                className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-md"
                                aria-label="Toggle menu"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>

                            {/* Desktop collapse/expand */}
                            <button
                                onClick={() => setSidebarCollapsed((s) => !s)}
                                className="hidden lg:inline-flex items-center ml-2 p-2 rounded-md text-gray-600 hover:bg-gray-100"
                                title={
                                    sidebarCollapsed
                                        ? "Mở rộng menu"
                                        : "Thu gọn menu"
                                }
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* header */}
                        {header ? (
                            <div className="flex-1 px-4">{header}</div>
                        ) : (
                            <div className="flex-1" />
                        )}

                        <div className="flex items-center space-x-4">
                            {/* notification icon */}
                            <button className="relative text-gray-500 hover:text-gray-700">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
