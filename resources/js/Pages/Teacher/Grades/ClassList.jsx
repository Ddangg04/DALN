import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function GradesClassList({ classes, filters }) {
    const [status, setStatus] = useState(filters?.status || "");
    const [semester, setSemester] = useState(filters?.semester || "");

    const handleFilter = () => {
        router.get(
            route("teacher.grades.list"),
            { status, semester },
            { preserveState: true, replace: true }
        );
    };

    const getStatusBadge = (status) => {
        const badges = {
            open: { class: "bg-blue-100 text-blue-800", label: "Mở" },
            in_progress: {
                class: "bg-green-100 text-green-800",
                label: "Đang dạy",
            },
            completed: {
                class: "bg-gray-100 text-gray-800",
                label: "Hoàn thành",
            },
        };
        return badges[status] || badges.open;
    };

    const getGradeProgress = (stats) => {
        if (!stats || stats.total_graded === 0) return 0;
        return Math.round((stats.completed / stats.total_graded) * 100);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-gray-800">
                    📊 Quản lý điểm - Chọn lớp
                </h2>
            }
        >
            <Head title="Quản lý điểm" />

            {/* Info Banner */}
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6">
                <div className="flex items-center">
                    <div className="text-indigo-700 mr-3">💡</div>
                    <div className="text-sm text-indigo-700">
                        Chọn lớp học để nhập và quản lý điểm số sinh viên
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="open">Mở</option>
                        <option value="in_progress">Đang dạy</option>
                        <option value="completed">Hoàn thành</option>
                    </select>

                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Tất cả học kỳ</option>
                        <option value="Fall">Fall</option>
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                    </select>

                    <button
                        onClick={handleFilter}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Lọc
                    </button>
                </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!classes?.data || classes.data.length === 0 ? (
                    <div className="col-span-full bg-white rounded-lg shadow p-12 text-center text-gray-500">
                        <div className="text-4xl mb-4">📚</div>
                        <p className="text-lg">Không có lớp nào</p>
                    </div>
                ) : (
                    classes.data.map((classSession) => {
                        const badge = getStatusBadge(classSession.status);
                        const progress = getGradeProgress(
                            classSession.grades_stats
                        );
                        const stats = classSession.grades_stats;

                        return (
                            <div
                                key={classSession.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {classSession.class_code}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {classSession.course.name}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.class}`}
                                        >
                                            {badge.label}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Mã môn:
                                            </span>
                                            <span className="font-semibold font-mono">
                                                {classSession.course.code}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Sinh viên:
                                            </span>
                                            <span className="font-semibold text-indigo-600">
                                                {classSession.enrollments_count}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Học kỳ:
                                            </span>
                                            <span className="font-semibold">
                                                {classSession.semester}{" "}
                                                {classSession.year}
                                            </span>
                                        </div>
                                        {stats && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Đã chấm:
                                                    </span>
                                                    <span className="font-semibold text-green-600">
                                                        {stats.completed}/
                                                        {stats.total_graded}
                                                    </span>
                                                </div>
                                                {stats.average_score && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            ĐTB:
                                                        </span>
                                                        <span className="font-bold text-blue-600">
                                                            {parseFloat(
                                                                stats.average_score
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    {stats && stats.total_graded > 0 && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                <span>Tiến độ chấm điểm</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Lock Status */}
                                    {stats && stats.locked > 0 && (
                                        <div className="mb-4 flex items-center text-xs text-orange-600">
                                            <span className="mr-1">🔒</span>
                                            <span>
                                                {stats.locked} điểm đã bị khóa
                                            </span>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <Link
                                        href={route(
                                            "teacher.grades.index",
                                            classSession.id
                                        )}
                                        className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center px-4 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        📝 Quản lý điểm
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {classes?.links && classes.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                        {classes.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                preserveState
                                className={`px-4 py-2 border text-sm ${
                                    link.active
                                        ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                } ${index === 0 ? "rounded-l-md" : ""} ${
                                    index === classes.links.length - 1
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
