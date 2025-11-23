import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function GradesIndex({
    classSession,
    students,
    statistics,
    canEdit,
}) {
    const [editMode, setEditMode] = useState(false);
    const [showStats, setShowStats] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        grades: students.map((student) => ({
            enrollment_id: student.enrollment_id,
            attendance_score: student.grade?.attendance_score || "",
            midterm_score: student.grade?.midterm_score || "",
            final_score: student.grade?.final_score || "",
            bonus_score: student.grade?.bonus_score || 0,
            note: student.grade?.note || "",
        })),
    });

    const handleScoreChange = (index, field, value) => {
        const newGrades = [...data.grades];
        newGrades[index][field] = value;
        setData("grades", newGrades);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("teacher.grades.store", classSession.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditMode(false);
            },
        });
    };

    const calculateTotalScore = (grade) => {
        const attendance = parseFloat(grade.attendance_score) || 0;
        const midterm = parseFloat(grade.midterm_score) || 0;
        const final = parseFloat(grade.final_score) || 0;
        const bonus = parseFloat(grade.bonus_score) || 0;

        if (!midterm || !final) return "—";

        const total = attendance * 0.1 + midterm * 0.3 + final * 0.6 + bonus;
        return Math.min(10, total).toFixed(2);
    };

    const getLetterGrade = (totalScore) => {
        if (totalScore === "—") return "—";
        const score = parseFloat(totalScore);

        if (score >= 9.0) return "A+";
        if (score >= 8.5) return "A";
        if (score >= 8.0) return "B+";
        if (score >= 7.0) return "B";
        if (score >= 6.5) return "C+";
        if (score >= 5.5) return "C";
        if (score >= 5.0) return "D+";
        if (score >= 4.0) return "D";
        return "F";
    };

    const handleCalculateAttendance = () => {
        if (confirm("Tính điểm chuyên cần tự động từ dữ liệu điểm danh?")) {
            router.post(
                route("teacher.grades.calculate-attendance", classSession.id),
                {},
                {
                    preserveScroll: true,
                }
            );
        }
    };

    const handleLockGrades = () => {
        if (confirm("Khóa điểm sẽ không cho phép chỉnh sửa. Bạn chắc chắn?")) {
            router.post(route("teacher.grades.lock", classSession.id));
        }
    };

    const handleUnlockGrades = () => {
        if (confirm("Mở khóa điểm để chỉnh sửa?")) {
            router.post(route("teacher.grades.unlock", classSession.id));
        }
    };

    const exportGrades = () => {
        window.location.href = route("teacher.grades.export", classSession.id);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            📊 Quản lý điểm - {classSession.class_code}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {classSession.course.name} (
                            {classSession.course.code})
                        </p>
                    </div>
                    <Link
                        href={route("teacher.grades.list")}
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        ← Quay lại
                    </Link>
                </div>
            }
        >
            <Head title={`Điểm - ${classSession.class_code}`} />

            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-wrap gap-3">
                    {canEdit && !editMode && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            ✏️ Chỉnh sửa điểm
                        </button>
                    )}

                    {editMode && (
                        <>
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {processing ? "Đang lưu..." : "💾 Lưu điểm"}
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                ✖️ Hủy
                            </button>
                        </>
                    )}

                    <button
                        onClick={handleCalculateAttendance}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        🧮 Tính điểm chuyên cần
                    </button>

                    <button
                        onClick={() => setShowStats(!showStats)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        📈 {showStats ? "Ẩn" : "Hiện"} thống kê
                    </button>

                    <button
                        onClick={exportGrades}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        📥 Export Excel
                    </button>

                    {canEdit ? (
                        <button
                            onClick={handleLockGrades}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            🔒 Khóa điểm
                        </button>
                    ) : (
                        <button
                            onClick={handleUnlockGrades}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            🔓 Mở khóa
                        </button>
                    )}
                </div>
            </div>

            {/* Statistics Panel */}
            {showStats && statistics && (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg mb-6 p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">📊 Thống kê điểm</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-sm opacity-90">Tổng SV</div>
                            <div className="text-3xl font-bold">
                                {statistics.total_students}
                            </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-sm opacity-90">Điểm TB</div>
                            <div className="text-3xl font-bold">
                                {statistics.average}
                            </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-sm opacity-90">Cao nhất</div>
                            <div className="text-3xl font-bold">
                                {statistics.highest}
                            </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-sm opacity-90">Thấp nhất</div>
                            <div className="text-3xl font-bold">
                                {statistics.lowest}
                            </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-sm opacity-90">Tỷ lệ đậu</div>
                            <div className="text-3xl font-bold">
                                {statistics.pass_rate}%
                            </div>
                        </div>
                    </div>

                    {/* Grade Distribution */}
                    <div className="mt-4">
                        <div className="text-sm font-semibold mb-2">
                            Phân bổ xếp loại:
                        </div>
                        <div className="flex gap-3">
                            {Object.entries(statistics.grade_distribution).map(
                                ([grade, count]) => (
                                    <div
                                        key={grade}
                                        className="bg-white/20 rounded px-3 py-1 text-sm"
                                    >
                                        <span className="font-bold">
                                            {grade}:
                                        </span>{" "}
                                        {count}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="text-sm">
                    <span className="font-semibold">Công thức:</span> Tổng điểm
                    = (Chuyên cần × 10%) + (Giữa kỳ × 30%) + (Cuối kỳ × 60%) +
                    Điểm cộng
                </div>
            </div>

            {/* Grades Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    STT
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    MSSV
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Họ tên
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Chuyên cần
                                    <br />
                                    (10%)
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Giữa kỳ
                                    <br />
                                    (30%)
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Cuối kỳ
                                    <br />
                                    (60%)
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Điểm cộng
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Tổng điểm
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Xếp loại
                                </th>
                                {editMode && (
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Ghi chú
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((student, index) => {
                                const gradeData = editMode
                                    ? data.grades[index]
                                    : student.grade;
                                const totalScore = calculateTotalScore(
                                    gradeData || {}
                                );
                                const letterGrade = getLetterGrade(totalScore);

                                return (
                                    <tr
                                        key={student.enrollment_id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-mono text-gray-900">
                                            {student.student_code}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {student.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {student.email}
                                            </div>
                                        </td>

                                        {/* Attendance Score */}
                                        <td className="px-4 py-3 text-center">
                                            {editMode ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="10"
                                                    value={
                                                        data.grades[index]
                                                            .attendance_score
                                                    }
                                                    onChange={(e) =>
                                                        handleScoreChange(
                                                            index,
                                                            "attendance_score",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-20 text-center border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium">
                                                    {gradeData?.attendance_score ||
                                                        "—"}
                                                </span>
                                            )}
                                        </td>

                                        {/* Midterm Score */}
                                        <td className="px-4 py-3 text-center">
                                            {editMode ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="10"
                                                    value={
                                                        data.grades[index]
                                                            .midterm_score
                                                    }
                                                    onChange={(e) =>
                                                        handleScoreChange(
                                                            index,
                                                            "midterm_score",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-20 text-center border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium">
                                                    {gradeData?.midterm_score ||
                                                        "—"}
                                                </span>
                                            )}
                                        </td>

                                        {/* Final Score */}
                                        <td className="px-4 py-3 text-center">
                                            {editMode ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="10"
                                                    value={
                                                        data.grades[index]
                                                            .final_score
                                                    }
                                                    onChange={(e) =>
                                                        handleScoreChange(
                                                            index,
                                                            "final_score",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-20 text-center border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium">
                                                    {gradeData?.final_score ||
                                                        "—"}
                                                </span>
                                            )}
                                        </td>

                                        {/* Bonus Score */}
                                        <td className="px-4 py-3 text-center">
                                            {editMode ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="2"
                                                    value={
                                                        data.grades[index]
                                                            .bonus_score
                                                    }
                                                    onChange={(e) =>
                                                        handleScoreChange(
                                                            index,
                                                            "bonus_score",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-20 text-center border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-green-600">
                                                    +
                                                    {gradeData?.bonus_score ||
                                                        0}
                                                </span>
                                            )}
                                        </td>

                                        {/* Total Score */}
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-lg font-bold text-blue-600">
                                                {totalScore}
                                            </span>
                                        </td>

                                        {/* Letter Grade */}
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${
                                                    letterGrade === "A+" ||
                                                    letterGrade === "A"
                                                        ? "bg-green-100 text-green-800"
                                                        : letterGrade.startsWith(
                                                              "B"
                                                          )
                                                        ? "bg-blue-100 text-blue-800"
                                                        : letterGrade.startsWith(
                                                              "C"
                                                          )
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : letterGrade.startsWith(
                                                              "D"
                                                          )
                                                        ? "bg-orange-100 text-orange-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {letterGrade}
                                            </span>
                                        </td>

                                        {/* Note */}
                                        {editMode && (
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={
                                                        data.grades[index].note
                                                    }
                                                    onChange={(e) =>
                                                        handleScoreChange(
                                                            index,
                                                            "note",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Ghi chú..."
                                                    className="w-full text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {students.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-4xl mb-4">👥</div>
                        <p className="text-lg">
                            Chưa có sinh viên nào trong lớp
                        </p>
                    </div>
                )}
            </div>

            {/* Info Footer */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="font-semibold">Lưu ý:</span>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>
                                Điểm chuyên cần có thể tính tự động từ điểm danh
                            </li>
                            <li>
                                Điểm giữa kỳ và cuối kỳ là bắt buộc để tính tổng
                                điểm
                            </li>
                            <li>Điểm cộng tối đa 2 điểm</li>
                            <li>Khóa điểm sẽ không cho phép chỉnh sửa</li>
                        </ul>
                    </div>
                    <div>
                        <span className="font-semibold">Thang điểm:</span>
                        <div className="mt-2 space-y-1">
                            <div>A+, A: Xuất sắc (≥ 8.5)</div>
                            <div>B+, B: Giỏi (≥ 7.0)</div>
                            <div>C+, C: Khá (≥ 5.5)</div>
                            <div>D+, D: Trung bình (≥ 4.0)</div>
                            <div>F: Không đạt (&lt; 4.0)</div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
