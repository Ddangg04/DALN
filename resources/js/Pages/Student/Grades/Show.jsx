import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function GradesShow({ enrollment }) {
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
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Chi tiết Điểm số
                    </h2>
                    <Link
                        href={route("student.grades.index")}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        ← Quay lại
                    </Link>
                </div>
            }
        >
            <Head title={`Điểm - ${enrollment.course.name}`} />

            {/* Course Info */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông tin học phần
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-600">
                            Tên học phần:
                        </span>
                        <p className="font-semibold text-gray-900">
                            {enrollment.course.name}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">
                            Mã học phần:
                        </span>
                        <p className="font-semibold text-gray-900 font-mono">
                            {enrollment.course.code}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Khoa:</span>
                        <p className="font-semibold text-gray-900">
                            {enrollment.course.department?.name}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">
                            Số tín chỉ:
                        </span>
                        <p className="font-semibold text-gray-900">
                            {enrollment.course.credits}
                        </p>
                    </div>
                </div>
            </div>

            {/* Grades Detail */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Bảng điểm chi tiết
                </h3>

                {enrollment.grades && enrollment.grades.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Thành phần
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Điểm số
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Trọng số
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Ghi chú
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {enrollment.grades.map((grade, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                                        {grade.component}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                        {grade.score}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {(grade.weight * 100).toFixed(0)}%
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {grade.notes || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Chưa có điểm chi tiết
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                    <div className="text-sm text-blue-600 mb-2">
                        Điểm giữa kỳ
                    </div>
                    <div className="text-3xl font-bold text-blue-700">
                        {enrollment.midterm_score || "—"}
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                    <div className="text-sm text-green-600 mb-2">
                        Điểm cuối kỳ
                    </div>
                    <div className="text-3xl font-bold text-green-700">
                        {enrollment.final_score || "—"}
                    </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
                    <div className="text-sm text-purple-600 mb-2">
                        Tổng điểm & Xếp loại
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="text-3xl font-bold text-purple-700">
                            {enrollment.total_score || "—"}
                        </div>
                        {enrollment.grade && (
                            <span
                                className={`px-3 py-1 text-xl font-bold rounded-full ${getGradeColor(
                                    enrollment.grade
                                )}`}
                            >
                                {enrollment.grade}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
