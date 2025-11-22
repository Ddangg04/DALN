// resources/js/Pages/Admin/Dashboard.jsx
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AdminDashboard({
    stats,
    monthlyStats,
    usersByRole,
    coursesByDepartment,
    recentUsers,
    recentCourses,
    recentAnnouncements,
    recentReports,
    activities,
    systemHealth,
}) {
    // Helper functions
    const getRoleColor = (role) => {
        const colors = {
            admin: "bg-red-100 text-red-800",
            teacher: "bg-green-100 text-green-800",
            student: "bg-blue-100 text-blue-800",
        };
        return colors[role] || "bg-gray-100 text-gray-800";
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            high: { class: "bg-red-100 text-red-800", label: "Quan trọng" },
            medium: {
                class: "bg-orange-100 text-orange-800",
                label: "Trung bình",
            },
            low: { class: "bg-green-100 text-green-800", label: "Thường" },
        };
        return badges[priority] || badges.medium;
    };

    const getActivityIcon = (type) => {
        const icons = {
            user: "👤",
            book: "📚",
            megaphone: "📢",
            document: "📄",
        };
        return icons[type] || "ℹ️";
    };

    const getActivityColor = (color) => {
        const colors = {
            blue: "bg-blue-100 text-blue-600",
            green: "bg-green-100 text-green-600",
            yellow: "bg-yellow-100 text-yellow-600",
            purple: "bg-purple-100 text-purple-600",
        };
        return colors[color] || "bg-gray-100 text-gray-600";
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        🎓 Dashboard - Tổng quan Hệ thống
                    </h2>
                    <div className="text-sm text-gray-600">
                        {new Date().toLocaleDateString("vi-VN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            {/* ========== MAIN STATS CARDS ========== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Users */}
                <Link
                    href={route("admin.users.index")}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">👥</div>
                        <div className="text-sm bg-blue-400 px-2 py-1 rounded">
                            +{monthlyStats?.users || 0} tháng này
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.users || 0}
                    </div>
                    <div className="text-blue-100">Tổng người dùng</div>
                </Link>

                {/* Total Courses */}
                <Link
                    href={route("admin.courses.index")}
                    className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">📚</div>
                        <div className="text-sm bg-green-400 px-2 py-1 rounded">
                            +{monthlyStats?.courses || 0} tháng này
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.courses || 0}
                    </div>
                    <div className="text-green-100">Tổng học phần</div>
                </Link>

                {/* Total Departments */}
                <Link
                    href={route("admin.departments.index")}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">🏢</div>
                        <div className="text-sm bg-purple-400 px-2 py-1 rounded">
                            Active
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.departments || 0}
                    </div>
                    <div className="text-purple-100">Tổng khoa</div>
                </Link>

                {/* Total Announcements */}
                <Link
                    href={route("admin.announcements.index")}
                    className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">📢</div>
                        <div className="text-sm bg-orange-400 px-2 py-1 rounded">
                            +{monthlyStats?.announcements || 0} tháng này
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.announcements || 0}
                    </div>
                    <div className="text-orange-100">Thông báo</div>
                </Link>
            </div>

            {/* ========== USER BREAKDOWN BY ROLE ========== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            🔴 Admins
                        </h3>
                        <span className="text-2xl font-bold text-red-600">
                            {stats?.admins || 0}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-red-500"
                            style={{
                                width: `${
                                    ((stats?.admins || 0) /
                                        (stats?.users || 1)) *
                                    100
                                }%`,
                            }}
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Quản trị viên hệ thống
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            🟢 Teachers
                        </h3>
                        <span className="text-2xl font-bold text-green-600">
                            {stats?.teachers || 0}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500"
                            style={{
                                width: `${
                                    ((stats?.teachers || 0) /
                                        (stats?.users || 1)) *
                                    100
                                }%`,
                            }}
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Giảng viên (+{monthlyStats?.teachers || 0} tháng này)
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            🔵 Students
                        </h3>
                        <span className="text-2xl font-bold text-blue-600">
                            {stats?.students || 0}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500"
                            style={{
                                width: `${
                                    ((stats?.students || 0) /
                                        (stats?.users || 1)) *
                                    100
                                }%`,
                            }}
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Sinh viên (+{monthlyStats?.students || 0} tháng này)
                    </p>
                </div>
            </div>

            {/* ========== COURSE STATS ========== */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">
                        Học phần hoạt động
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                        {stats?.activeCourses || 0}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">
                        Học phần bắt buộc
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                        {stats?.requiredCourses || 0}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">
                        Học phần tự chọn
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                        {stats?.electiveCourses || 0}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">
                        Báo cáo tháng này
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                        {stats?.reportsThisMonth || 0}
                    </div>
                </div>
            </div>

            {/* ========== MAIN CONTENT GRID ========== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Recent Users */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            👤 Người dùng mới
                        </h3>
                        <Link
                            href={route("admin.users.index")}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="p-6">
                        {!recentUsers || recentUsers.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                Chưa có người dùng mới
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {user.avatar}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                                                    user.role
                                                )}`}
                                            >
                                                {user.role}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {user.created_at}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Courses */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            📚 Học phần mới
                        </h3>
                        <Link
                            href={route("admin.courses.index")}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="p-6">
                        {!recentCourses || recentCourses.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                Chưa có học phần mới
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-mono text-sm font-bold text-gray-700">
                                                    {course.code}
                                                </span>
                                                <span
                                                    className={`px-2 py-0.5 text-xs rounded-full ${
                                                        course.type ===
                                                        "required"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-blue-100 text-blue-800"
                                                    }`}
                                                >
                                                    {course.type === "required"
                                                        ? "Bắt buộc"
                                                        : "Tự chọn"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {course.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {course.department || "—"} •{" "}
                                                {course.credits} TC
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    course.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {course.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {course.created_at}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Announcements */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            📢 Thông báo gần đây
                        </h3>
                        <Link
                            href={route("admin.announcements.index")}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="p-6">
                        {!recentAnnouncements ||
                        recentAnnouncements.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                Chưa có thông báo
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentAnnouncements.map((announcement) => {
                                    const badge = getPriorityBadge(
                                        announcement.priority
                                    );
                                    return (
                                        <div
                                            key={announcement.id}
                                            className="border-l-4 border-blue-500 bg-gray-50 p-3 rounded hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        {announcement.is_pinned && (
                                                            <span className="text-yellow-500">
                                                                📌
                                                            </span>
                                                        )}
                                                        <h4 className="font-semibold text-gray-900 text-sm">
                                                            {announcement.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-xs text-gray-600 line-clamp-2">
                                                        {announcement.content}
                                                    </p>
                                                    <div className="flex items-center space-x-2 mt-2">
                                                        <span
                                                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${badge.class}`}
                                                        >
                                                            {badge.label}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {
                                                                announcement.author
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400 ml-2">
                                                    {announcement.created_at}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            📊 Báo cáo gần đây
                        </h3>
                        <Link
                            href={route("admin.reports.index")}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="p-6">
                        {!recentReports || recentReports.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                Chưa có báo cáo
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {recentReports.map((report) => (
                                    <Link
                                        key={report.id}
                                        href={route(
                                            "admin.reports.show",
                                            report.id
                                        )}
                                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors"
                                    >
                                        <div className="flex items-center flex-1">
                                            <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600">
                                                📄
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {report.title}
                                                </p>
                                                <p className="text-xs text-gray-500 capitalize">
                                                    {report.type}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {report.created_at}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ========== ACTIVITY LOG ========== */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        📋 Hoạt động gần đây (7 ngày)
                    </h3>
                </div>
                <div className="p-6">
                    {!activities || activities.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            Chưa có hoạt động nào
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {activities.map((activity, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(
                                                activity.color
                                            )}`}
                                        >
                                            <span className="text-xl">
                                                {getActivityIcon(activity.icon)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.title}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(
                                                activity.time
                                            ).toLocaleString("vi-VN")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ========== QUICK ACTIONS ========== */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        ⚡ Thao tác nhanh
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href={route("admin.users.create")}
                            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                        >
                            <div className="text-4xl mb-2">👤</div>
                            <span className="text-sm font-medium text-gray-700">
                                Thêm người dùng
                            </span>
                        </Link>

                        <Link
                            href={route("admin.courses.create")}
                            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                        >
                            <div className="text-4xl mb-2">📚</div>
                            <span className="text-sm font-medium text-gray-700">
                                Thêm học phần
                            </span>
                        </Link>

                        <Link
                            href={route("admin.announcements.create")}
                            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                        >
                            <div className="text-4xl mb-2">📢</div>
                            <span className="text-sm font-medium text-gray-700">
                                Đăng thông báo
                            </span>
                        </Link>

                        <Link
                            href={route("admin.reports.create")}
                            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                        >
                            <div className="text-4xl mb-2">📊</div>
                            <span className="text-sm font-medium text-gray-700">
                                Tạo báo cáo
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ========== SYSTEM HEALTH ========== */}
            {systemHealth && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Storage Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            💾 Bộ nhớ hệ thống
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Tổng dung lượng
                                </span>
                                <span className="font-semibold">
                                    {systemHealth.storage?.total}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Đã sử dụng
                                </span>
                                <span className="font-semibold text-blue-600">
                                    {systemHealth.storage?.used}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Còn trống</span>
                                <span className="font-semibold text-green-600">
                                    {systemHealth.storage?.free}
                                </span>
                            </div>
                            <div className="mt-4">
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{
                                            width: `${
                                                systemHealth.storage
                                                    ?.percentage || 0
                                            }%`,
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {systemHealth.storage?.percentage}% đã sử
                                    dụng
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Database Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            🗄️ Cơ sở dữ liệu
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Số lượng bảng
                                </span>
                                <span className="font-semibold">
                                    {systemHealth.database?.tables}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Kích thước DB
                                </span>
                                <span className="font-semibold text-purple-600">
                                    {systemHealth.database?.size}
                                </span>
                            </div>
                            <div className="mt-4 p-3 bg-green-50 rounded">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse" />
                                    <span className="text-sm text-green-700 font-medium">
                                        Kết nối bình thường
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== FOOTER INFO ========== */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">
                            🎓 Hệ thống Quản lý Trường Đại học
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Phiên bản 1.0 - Dashboard Admin
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-300">
                            Cập nhật lần cuối:{" "}
                            {new Date().toLocaleString("vi-VN")}
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
