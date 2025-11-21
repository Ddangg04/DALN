import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Grades({ grades = [] }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold">Xem điểm</h2>}
        >
            <Head title="Xem điểm" />
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left">Học phần</th>
                            <th className="p-3">CC</th>
                            <th className="p-3">GK</th>
                            <th className="p-3">CK</th>
                            <th className="p-3">TB</th>
                            <th className="p-3">Xếp loại</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.length ? (
                            grades.map((g, i) => (
                                <tr key={i} className="border-b">
                                    <td className="p-3">
                                        {g.course_name}{" "}
                                        <div className="text-sm text-gray-400">
                                            {g.course_code}
                                        </div>
                                    </td>
                                    <td className="p-3 text-center">
                                        {g.attendance_score ?? "-"}
                                    </td>
                                    <td className="p-3 text-center">
                                        {g.midterm_score ?? "-"}
                                    </td>
                                    <td className="p-3 text-center">
                                        {g.final_score ?? "-"}
                                    </td>
                                    <td className="p-3 text-center">
                                        {g.average_score ?? "-"}
                                    </td>
                                    <td className="p-3 text-center">
                                        {g.grade ?? "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="p-6 text-center text-gray-500"
                                >
                                    Chưa có điểm
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
