// resources/js/Pages/Student/Material/Index.jsx
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function MaterialIndex({ materials, courses, filters }) {
    const [courseId, setCourseId] = useState(filters?.course_id || "");
    const [search, setSearch] = useState(filters?.search || "");

    const handleFilter = () => {
        router.get(
            route("student.materials.index"),
            { course_id: courseId, search },
            { preserveState: true, replace: true }
        );
    };

    const getFileIcon = (fileType) => {
        if (fileType === "pdf") return "📄";
        if (["doc", "docx"].includes(fileType)) return "📝";
        if (["ppt", "pptx"].includes(fileType)) return "📊";
        if (["xls", "xlsx"].includes(fileType)) return "📈";
        if (["jpg", "png", "gif"].includes(fileType)) return "🖼️";
        if (["mp4", "avi", "mov"].includes(fileType)) return "🎥";
        return "📎";
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold">📚 Tài liệu học tập</h2>}
        >
            <Head title="Tài liệu" />

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm tài liệu..."
                        className="border-gray-300 rounded-lg"
                    />
                    <select
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        className="border-gray-300 rounded-lg"
                    >
                        <option value="">Tất cả học phần</option>
                        {courses?.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.code} - {course.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleFilter}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Lọc
                    </button>
                </div>
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials?.data?.map((material) => (
                    <div
                        key={material.id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                        <div className="p-6">
                            <div className="text-5xl mb-4 text-center">
                                {getFileIcon(material.file_type)}
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                {material.title}
                            </h3>

                            <div className="space-y-2 mb-4 text-sm">
                                <div className="text-gray-600">
                                    <strong>Học phần:</strong>{" "}
                                    {material.course.name}
                                </div>
                                <div className="text-gray-600">
                                    <strong>Kích thước:</strong>{" "}
                                    {material.formatted_size}
                                </div>
                                <div className="text-gray-600">
                                    <strong>Đăng bởi:</strong>{" "}
                                    {material.uploader?.name || "—"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {new Date(
                                        material.created_at
                                    ).toLocaleDateString("vi-VN")}
                                </div>
                            </div>

                            {material.description && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {material.description}
                                </p>
                            )}

                            <a
                                href={route(
                                    "student.materials.download",
                                    material.id
                                )}
                                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-lg transition-colors"
                            >
                                ⬇️ Tải xuống
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {materials?.links && materials.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                        {materials.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                preserveState
                                className={`px-4 py-2 border text-sm ${
                                    link.active
                                        ? "bg-blue-50 border-blue-500 text-blue-600"
                                        : "bg-white border-gray-300 text-gray-500"
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
