import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function StudentDashboard({
    stats,
    todaySchedule,
    upcomingSchedule,
    notifications,
    announcements,
}) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        🎓 Dashboard - Sinh viên
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
            <Head title="Student Dashboard" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Link
                    href={route("student.grades.index")}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all"
                >
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.gpa || 0}
                    </div>
                    <div className="text-blue-100">GPA</div>
                </Link>

                <Link
                    href={route("student.registration.index")}
                    className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all"
                >
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.totalCourses || 0}
                    </div>
                    <div className="text-green-100">Học phần đang học</div>
                </Link>

                <Link
                    href={route("student.tuition.index")}
                    className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all"
                >
                    <div className="text-4xl mb-2">💰</div>
                    <div className="text-3xl font-bold mb-1">
                        {(stats?.unpaidFees || 0).toLocaleString("vi-VN")}đ
                    </div>
                    <div className="text-orange-100">
                        Học phí chưa thanh toán
                    </div>
                </Link>

                <Link
                    href={route("student.notifications.index")}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all"
                >
                    <div className="text-4xl mb-2">🔔</div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.unreadNotifications || 0}
                    </div>
                    <div className="text-purple-100">Thông báo chưa đọc</div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Today's Schedule */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            📅 Lịch học hôm nay
                        </h3>
                        <Link
                            href={route("student.schedule.index")}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Xem tuần →
                        </Link>
                    </div>
                    <div className="p-6">
                        {!todaySchedule || todaySchedule.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">🎉</div>
                                <p>Hôm nay không có lịch học!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {todaySchedule.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {schedule.course.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {schedule.course.code} •{" "}
                                                    {schedule.room}
                                                </p>
                                                {schedule.instructor && (
                                                    <p className="text-sm text-gray-500">
                                                        GV:{" "}
                                                        {
                                                            schedule.instructor
                                                                .name
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-blue-600">
                                                    {schedule.start_time} -{" "}
                                                    {schedule.end_time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Notifications */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            🔔 Thông báo gần đây
                        </h3>
                        <Link
                            href={route("student.notifications.index")}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="p-6">
                        {!notifications || notifications.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                Chưa có thông báo
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-3 rounded transition-colors ${
                                            notif.is_read
                                                ? "bg-gray-50"
                                                : "bg-blue-50 border-l-4 border-blue-500"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 text-sm">
                                                    {notif.title}
                                                </h4>
                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(
                                                        notif.created_at
                                                    ).toLocaleString("vi-VN")}
                                                </p>
                                            </div>
                                            {!notif.is_read && (
                                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        📢 Thông báo chung
                    </h3>
                </div>
                <div className="p-6">
                    {!announcements || announcements.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            Chưa có thông báo
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {announcements.map((announcement) => {
                                const badge = {
                                    high: {
                                        class: "bg-red-100 text-red-800",
                                        label: "Quan trọng",
                                    },
                                    medium: {
                                        class: "bg-orange-100 text-orange-800",
                                        label: "Trung bình",
                                    },
                                    low: {
                                        class: "bg-green-100 text-green-800",
                                        label: "Thường",
                                    },
                                }[announcement.priority];

                                return (
                                    <div
                                        key={announcement.id}
                                        className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    {announcement.is_pinned && (
                                                        <span className="text-yellow-500">
                                                            📌
                                                        </span>
                                                    )}
                                                    <h4 className="font-semibold text-gray-900">
                                                        {announcement.title}
                                                    </h4>
                                                    <span
                                                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${badge.class}`}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {announcement.content}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {new Date(
                                                        announcement.created_at
                                                    ).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Link
                    href={route("student.registration.index")}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-center"
                >
                    <div className="text-4xl mb-2">📝</div>
                    <div className="text-sm font-medium text-gray-700">
                        Đăng ký học phần
                    </div>
                </Link>

                <Link
                    href={route("student.grades.index")}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-center"
                >
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-sm font-medium text-gray-700">
                        Xem điểm
                    </div>
                </Link>

                <Link
                    href={route("student.schedule.index")}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-center"
                >
                    <div className="text-4xl mb-2">📅</div>
                    <div className="text-sm font-medium text-gray-700">
                        Lịch học
                    </div>
                </Link>

                <Link
                    href={route("student.materials.index")}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-center"
                >
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-sm font-medium text-gray-700">
                        Tài liệu
                    </div>
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
