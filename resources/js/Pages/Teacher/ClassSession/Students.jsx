import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ClassSessionStudents({ classSession, students }) {
    const getGradeColor = (grade) => {
        if (!grade) return "text-gray-400";
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
                        Danh sách Sinh viên - {classSession.class_code}
                    </h2>
                    <Link
                        href={route("teacher.classes.show", classSession.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        ← Quay lại
                    </Link>
                </div>
            }
        >
            <Head title="Danh sách sinh viên" />

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600">Tổng sinh viên</div>
                    <div className="text-3xl font-bold text-blue-600">
                        {students.length}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600">Điểm trung bình</div>
                    <div className="text-3xl font-bold text-green-600">
                        {students.length > 0
                            ? (
                                  students.reduce(
                                      (sum, s) => sum + (s.total_score || 0),
                                      0
                                  ) / students.length
                              ).toFixed(2)
                            : "0"}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600">Có điểm</div>
                    <div className="text-3xl font-bold text-purple-600">
                        {students.filter((s) => s.total_score).length}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600">Chưa có điểm</div>
                    <div className="text-3xl font-bold text-orange-600">
                        {students.filter((s) => !s.total_score).length}
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                STT
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Họ tên
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Tỷ lệ điểm danh
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Điểm GK
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Điểm CK
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Tổng điểm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Xếp loại
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student, index) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {student.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        ID: {student.student_id}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {student.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {student.attendance_rate || 0}%
                                        </div>
                                        <div className="ml-2 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{
                                                    width: `${
                                                        student.attendance_rate ||
                                                        0
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                    {student.midterm_score || "—"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                    {student.final_score || "—"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                                    {student.total_score || "—"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {student.grade ? (
                                        <span
                                            className={`px-2 py-1 text-xs font-bold rounded-full ${getGradeColor(
                                                student.grade
                                            )}`}
                                        >
                                            {student.grade}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
