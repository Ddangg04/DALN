import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AnnouncementsEdit({ announcement }) {
    const { data, setData, put, processing, errors } = useForm({
        title: announcement.title || "",
        content: announcement.content || "",
        priority: announcement.priority || "medium",
        is_pinned: announcement.is_pinned || false,
        published_at: announcement.published_at
            ? new Date(announcement.published_at).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.announcements.update", announcement.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Chỉnh sửa Thông báo
                    </h2>
                    <Link
                        href={route("admin.announcements.index")}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        ← Quay lại
                    </Link>
                </div>
            }
        >
            <Head title="Chỉnh sửa thông báo" />

            <div className="bg-white rounded-lg shadow">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập tiêu đề thông báo"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData("content", e.target.value)}
                            rows={6}
                            className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập nội dung thông báo"
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mức độ ưu tiên{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.priority}
                                onChange={(e) =>
                                    setData("priority", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="low">Thường</option>
                                <option value="medium">Trung bình</option>
                                <option value="high">Quan trọng</option>
                            </select>
                            {errors.priority && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.priority}
                                </p>
                            )}
                        </div>

                        {/* Published At */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thời gian đăng
                            </label>
                            <input
                                type="datetime-local"
                                value={data.published_at}
                                onChange={(e) =>
                                    setData("published_at", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.published_at && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.published_at}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Is Pinned */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_pinned"
                            checked={data.is_pinned}
                            onChange={(e) =>
                                setData("is_pinned", e.target.checked)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="is_pinned"
                            className="ml-2 block text-sm text-gray-700"
                        >
                            Ghim thông báo này lên đầu
                        </label>
                    </div>

                    {/* Author Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                            <strong>Người tạo:</strong>{" "}
                            {announcement.author?.name || "—"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            <strong>Ngày tạo:</strong>{" "}
                            {new Date(announcement.created_at).toLocaleString(
                                "vi-VN"
                            )}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Link
                            href={route("admin.announcements.index")}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {processing ? "Đang lưu..." : "Cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
