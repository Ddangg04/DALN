import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function GradesIndex({
    enrollments,
    stats,
    semesterGPA,
    filters,
}) {
    const [semester, setSemester] = useState(filters?.semester || "");
    const [year, setYear] = useState(filters?.year || "");

    const handleFilter = () => {
        router.get(
            route("student.grades.index"),
            { semester, year },
            { preserveState: true, replace: true }
        );
    };

    const getGradeColor = (grade) => {
        if (["A+", "A"].includes(grade)) return "text-green-600 bg-green-100";
        if (["B+", "B"].includes(grade)) return "text-blue-600 bg-blue-100";
        if (["C+", "C"].includes(grade)) return "text-yellow-600 bg-yellow-100";
        if (["D+", "D"].includes(grade)) return "text-orange-600 bg-orange-100";
        return "text-red-600 bg-red-100";
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-gray-800">📊 Điểm số</h2>
            }
        >
            <Head title="Điểm số" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.gpa || 0}
                    </div>
                    <div className="text-blue-100">GPA (Điểm trung bình)</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.totalCourses || 0}
                    </div>
                    <div className="text-green-100">Học phần đã hoàn thành</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
                    <div className="text-4xl mb-2">🎓</div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.totalCredits || 0}
                    </div>
                    <div className="text-purple-100">Tổng số tín chỉ</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Tất cả học kỳ</option>
                        <option value="Fall">Fall (Mùa thu)</option>
                        <option value="Spring">Spring (Mùa xuân)</option>
                        <option value="Summer">Summer (Mùa hè)</option>
                    </select>

                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Tất cả năm</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                    </select>

                    <button
                        onClick={handleFilter}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Lọc
                    </button>
                </div>
            </div>

            {/* GPA by Semester */}
            {semesterGPA && Object.keys(semesterGPA).length > 0 && (
                <div className="bg-white rounded-lg shadow mb-6 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Điểm trung bình theo học kỳ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(semesterGPA).map(([sem, data]) => (
                            <div key={sem} className="border rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">
                                    {sem}
                                </div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {data.gpa}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {data.credits} tín chỉ
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Grades Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Học phần
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã HP
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tín chỉ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Điểm giữa kỳ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Điểm cuối kỳ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tổng điểm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Xếp loại
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chi tiết
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {enrollments?.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    Chưa có điểm nào
                                </td>
                            </tr>
                        ) : (
                            enrollments?.map((enrollment) => (
                                <tr
                                    key={enrollment.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {enrollment.course.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {enrollment.course.department?.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-mono text-gray-900">
                                            {enrollment.course.code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {enrollment.course.credits}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {enrollment.midterm_score || "—"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {enrollment.final_score || "—"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-blue-600">
                                            {enrollment.total_score || "—"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {enrollment.grade ? (
                                            <span
                                                className={`px-2 py-1 text-xs font-bold rounded-full ${getGradeColor(
                                                    enrollment.grade
                                                )}`}
                                            >
                                                {enrollment.grade}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            href={route(
                                                "student.grades.show",
                                                enrollment.id
                                            )}
                                            className="text-blue-600 hover:text-blue-900 text-sm"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
