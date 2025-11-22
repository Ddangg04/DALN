import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AnnouncementsIndex({ announcements, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [priority, setPriority] = useState(filters.priority || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.announcements.index"),
            {
                search,
                priority,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
            router.delete(route("admin.announcements.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    const togglePin = (id) => {
        router.post(
            route("admin.announcements.toggle-pin", id),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const rows = announcements?.data || [];

    const getPriorityBadge = (priority) => {
        const badges = {
            high: "bg-red-100 text-red-800",
            medium: "bg-orange-100 text-orange-800",
            low: "bg-green-100 text-green-800",
        };
        const labels = {
            high: "Quan trọng",
            medium: "Trung bình",
            low: "Thường",
        };
        return { class: badges[priority], label: labels[priority] };
    };

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

            {/* Success Message */}
            {flash?.success && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {flash.success}
                </div>
            )}

            {/* Search & Filter */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
                        className="flex-1 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Tất cả mức độ</option>
                        <option value="high">Quan trọng</option>
                        <option value="medium">Trung bình</option>
                        <option value="low">Thường</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Tìm kiếm
                    </button>
                    {(search || priority) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setPriority("");
                                router.get(route("admin.announcements.index"));
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    )}
                </form>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {rows.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        Chưa có thông báo
                    </div>
                ) : (
                    rows.map((announcement) => {
                        const badge = getPriorityBadge(announcement.priority);
                        return (
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
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full flex items-center">
                                                        📌 Ghim
                                                    </span>
                                                )}
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.class}`}
                                                >
                                                    {badge.label}
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
                                                    {announcement.author
                                                        ?.name ?? "—"}
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
                                            <button
                                                onClick={() =>
                                                    togglePin(announcement.id)
                                                }
                                                className={`p-2 rounded transition-colors ${
                                                    announcement.is_pinned
                                                        ? "text-yellow-600 hover:bg-yellow-50"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                                title={
                                                    announcement.is_pinned
                                                        ? "Bỏ ghim"
                                                        : "Ghim"
                                                }
                                            >
                                                📌
                                            </button>
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
                                                    handleDelete(
                                                        announcement.id
                                                    )
                                                }
                                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {announcements?.links && announcements.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {announcements.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                preserveState
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    link.active
                                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                } ${index === 0 ? "rounded-l-md" : ""} ${
                                    index === announcements.links.length - 1
                                        ? "rounded-r-md"
                                        : ""
                                } ${
                                    !link.url
                                        ? "cursor-not-allowed opacity-50"
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
