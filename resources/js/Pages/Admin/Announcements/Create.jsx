// resources/js/Pages/Admin/Announcements/Index.jsx
import { Head, Link, router } from "@inertiajs/react";
import { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AnnouncementsIndex({
    announcements = { data: [], links: [], from: 0, to: 0, total: 0 },
}) {
    // debug: xem server gửi gì
    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log("AnnouncementsIndex props:", { announcements });
    }, [announcements]);

    const handleDelete = (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
            router.delete(route("admin.announcements.destroy", id));
        }
    };

    const rows = Array.isArray(announcements?.data) ? announcements.data : [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Quản lý Thông báo
                    </h2>
                    <Link
                        href={route("admin.announcements.create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        + Thêm thông báo
                    </Link>
                </div>
            }
        >
            <Head title="Quản lý thông báo" />

            <div className="space-y-4">
                {rows.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        Chưa có thông báo
                    </div>
                ) : (
                    rows.map((announcement) => (
                        <div
                            key={announcement.id}
                            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {announcement.title}
                                            </h3>
                                            {announcement.is_pinned && (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                                    Ghim
                                                </span>
                                            )}
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    announcement.priority ===
                                                    "high"
                                                        ? "bg-red-100 text-red-800"
                                                        : announcement.priority ===
                                                          "medium"
                                                        ? "bg-orange-100 text-orange-800"
                                                        : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {announcement.priority ===
                                                "high"
                                                    ? "Quan trọng"
                                                    : announcement.priority ===
                                                      "medium"
                                                    ? "Trung bình"
                                                    : "Thường"}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-3 line-clamp-2">
                                            {announcement.content}
                                        </p>

                                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                                            <span className="flex items-center">
                                                <svg
                                                    className="w-4 h-4 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                {announcement.author?.name ??
                                                    "—"}
                                            </span>

                                            <span className="flex items-center">
                                                <svg
                                                    className="w-4 h-4 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                {announcement.created_at
                                                    ? new Date(
                                                          announcement.created_at
                                                      ).toLocaleDateString(
                                                          "vi-VN"
                                                      )
                                                    : "—"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 ml-4">
                                        <Link
                                            href={route(
                                                "admin.announcements.edit",
                                                announcement.id
                                            )}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            Sửa
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(announcement.id)
                                            }
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {announcements?.links && Array.isArray(announcements.links) && (
                <div className="mt-6 flex justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {announcements.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    link.active
                                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                } ${index === 0 ? "rounded-l-md" : ""} ${
                                    index === announcements.links.length - 1
                                        ? "rounded-r-md"
                                        : ""
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
