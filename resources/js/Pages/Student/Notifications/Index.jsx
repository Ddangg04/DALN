// resources/js/Pages/Student/Notification/Index.jsx
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function NotificationIndex({
    notifications,
    filters,
    unreadCount,
}) {
    const [status, setStatus] = useState(filters?.status || "");
    const [type, setType] = useState(filters?.type || "");

    const handleFilter = () => {
        router.get(
            route("student.notifications.index"),
            { status, type },
            { preserveState: true, replace: true }
        );
    };

    const markAsRead = (notificationId) => {
        router.post(
            route("student.notifications.read", notificationId),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const markAllAsRead = () => {
        if (confirm("Đánh dấu tất cả thông báo là đã đọc?")) {
            router.post(route("student.notifications.mark-all-read"));
        }
    };

    const getTypeIcon = (type) => {
        const icons = {
            enrollment: "📝",
            grade: "📊",
            payment: "💰",
            announcement: "📢",
        };
        return icons[type] || "ℹ️";
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">🔔 Thông báo</h2>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Đánh dấu tất cả đã đọc
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Thông báo" />

            {/* Stats */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
                <div className="text-lg font-semibold text-blue-900">
                    Bạn có {unreadCount} thông báo chưa đọc
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border-gray-300 rounded-lg"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="unread">Chưa đọc</option>
                        <option value="read">Đã đọc</option>
                    </select>

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border-gray-300 rounded-lg"
                    >
                        <option value="">Tất cả loại</option>
                        <option value="enrollment">Đăng ký học phần</option>
                        <option value="grade">Điểm số</option>
                        <option value="payment">Học phí</option>
                        <option value="announcement">Thông báo chung</option>
                    </select>

                    <button
                        onClick={handleFilter}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Lọc
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {notifications?.data?.map((notif) => (
                    <div
                        key={notif.id}
                        className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ${
                            !notif.is_read ? "border-l-4 border-blue-500" : ""
                        }`}
                        onClick={() => !notif.is_read && markAsRead(notif.id)}
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="text-3xl">
                                        {getTypeIcon(notif.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {notif.title}
                                            </h3>
                                            {!notif.is_read && (
                                                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span className="capitalize">
                                                {notif.type}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {new Date(
                                                    notif.created_at
                                                ).toLocaleString("vi-VN")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {notifications?.links && (
                <div className="mt-6 flex justify-center">
                    <nav className="inline-flex rounded-md shadow-sm">
                        {notifications.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                preserveState
                                className={`px-4 py-2 border text-sm ${
                                    link.active
                                        ? "bg-blue-50 text-blue-600"
                                        : "bg-white text-gray-500"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
