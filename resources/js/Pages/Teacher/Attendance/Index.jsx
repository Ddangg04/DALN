import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AttendanceIndex({ classSession, students, date }) {
    const [selectedDate, setSelectedDate] = useState(date);
    const { data, setData, post, processing } = useForm({
        date: date,
        attendances: students.map((s) => ({
            enrollment_id: s.enrollment_id,
            status: s.attendance?.status || "present",
            note: s.attendance?.note || "",
        })),
    });

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        window.location.href = route("teacher.attendance.index", {
            classSession: classSession.id,
            date: newDate,
        });
    };

    const handleStatusChange = (index, status) => {
        const newAttendances = [...data.attendances];
        newAttendances[index].status = status;
        setData("attendances", newAttendances);
    };

    const handleNoteChange = (index, note) => {
        const newAttendances = [...data.attendances];
        newAttendances[index].note = note;
        setData("attendances", newAttendances);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("teacher.attendance.store", classSession.id));
    };

    const getStatusColor = (status) => {
        const colors = {
            present: "bg-green-100 text-green-800",
            absent: "bg-red-100 text-red-800",
            late: "bg-yellow-100 text-yellow-800",
            excused: "bg-blue-100 text-blue-800",
        };
        return colors[status] || colors.present;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                        📋 Điểm danh - {classSession.class_code}
                    </h2>
                    <Link
                        href={route("teacher.classes.show", classSession.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                        ← Quay lại
                    </Link>
                </div>
            }
        >
            <Head title="Điểm danh" />

            {/* Course Info */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <span className="text-sm text-gray-600">Học phần:</span>
                        <p className="font-semibold">
                            {classSession.course.name}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Mã lớp:</span>
                        <p className="font-semibold">
                            {classSession.class_code}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">
                            Số sinh viên:
                        </span>
                        <p className="font-semibold">{students.length}</p>
                    </div>
                </div>
            </div>

            {/* Date Selector */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn ngày điểm danh:
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Attendance Form */}
            <form onSubmit={handleSubmit}>
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
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Ghi chú
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((student, index) => (
                                <tr key={student.enrollment_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {student.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            {[
                                                "present",
                                                "absent",
                                                "late",
                                                "excused",
                                            ].map((status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            index,
                                                            status
                                                        )
                                                    }
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                                                        data.attendances[index]
                                                            .status === status
                                                            ? getStatusColor(
                                                                  status
                                                              )
                                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {status === "present"
                                                        ? "Có mặt"
                                                        : status === "absent"
                                                        ? "Vắng"
                                                        : status === "late"
                                                        ? "Muộn"
                                                        : "Có phép"}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="text"
                                            value={data.attendances[index].note}
                                            onChange={(e) =>
                                                handleNoteChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Ghi chú..."
                                            className="w-full border-gray-300 rounded text-sm"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50"
                    >
                        {processing ? "Đang lưu..." : "Lưu điểm danh"}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
