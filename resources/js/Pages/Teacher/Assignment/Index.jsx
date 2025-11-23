import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AssignmentIndex({ assignments, courses, filters }) {
    const [courseId, setCourseId] = useState(filters?.course_id || "");

    const handleFilter = () => {
        router.get(
            route("teacher.assignments.index"),
            { course_id: courseId },
            { preserveState: true, replace: true }
        );
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: { class: "bg-gray-100 text-gray-800", label: "Nháp" },
            published: {
                class: "bg-green-100 text-green-800",
                label: "Đã đăng",
            },
            closed: { class: "bg-red-100 text-red-800", label: "Đã đóng" },
        };
        return badges[status] || badges.draft;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        📝 Quản lý Bài tập
                    </h2>
                    <Link
                        href={route("teacher.assignments.create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        + Tạo bài tập mới
                    </Link>
                </div>
            }
        >
            <Head title="Quản lý bài tập" />

            {/* Filter */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Lọc
                    </button>
                </div>
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
                {!assignments?.data || assignments.data.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                        <div className="text-4xl mb-4">📝</div>
                        <p className="text-lg">Chưa có bài tập nào</p>
                        <Link
                            href={route("teacher.assignments.create")}
                            className="inline-block mt-4 text-blue-600 hover:text-blue-700"
                        >
                            Tạo bài tập đầu tiên →
                        </Link>
                    </div>
                ) : (
                    assignments.data.map((assignment) => {
                        const badge = getStatusBadge(assignment.status);
                        const isOverdue =
                            new Date(assignment.due_date) < new Date();
                        const pendingCount =
                            assignment.submissions?.filter(
                                (s) => s.status === "submitted"
                            ).length || 0;

                        return (
                            <div
                                key={assignment.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {assignment.title}
                                                </h3>
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.class}`}
                                                >
                                                    {badge.label}
                                                </span>
                                                {isOverdue &&
                                                    assignment.status ===
                                                        "published" && (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                            Quá hạn
                                                        </span>
                                                    )}
                                            </div>

                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {assignment.description}
                                            </p>

                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>
                                                    📚 {assignment.course.name}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    📅 Hạn:{" "}
                                                    {new Date(
                                                        assignment.due_date
                                                    ).toLocaleString("vi-VN")}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    💯 {assignment.max_score}{" "}
                                                    điểm
                                                </span>
                                            </div>

                                            <div className="flex items-center space-x-4 mt-3">
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-600">
                                                        Tổng bài nộp:{" "}
                                                    </span>
                                                    <span className="ml-1 font-semibold text-blue-600">
                                                        {assignment.submissions_count ||
                                                            0}
                                                    </span>
                                                </div>
                                                {pendingCount > 0 && (
                                                    <div className="flex items-center">
                                                        <span className="text-sm text-gray-600">
                                                            Chờ chấm:{" "}
                                                        </span>
                                                        <span className="ml-1 font-semibold text-orange-600">
                                                            {pendingCount}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Link
                                            href={route(
                                                "teacher.assignments.show",
                                                assignment.id
                                            )}
                                            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Chi tiết →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {assignments?.links && assignments.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                        {assignments.links.map((link, index) => (
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
