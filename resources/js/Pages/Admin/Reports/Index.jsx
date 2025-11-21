import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ReportsIndex({ reports = [], filters = {} }) {
    const [type, setType] = useState(filters?.type ?? "");
    const [date, setDate] = useState(filters?.date ?? "");

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route("admin.reports.index"),
            { type, date },
            { preserveState: true }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) {
            router.delete(route("admin.reports.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Báo cáo hệ thống
                    </h2>

                    <Link
                        href={route("admin.reports.create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        + Tạo báo cáo
                    </Link>
                </div>
            }
        >
            <Head title="Báo cáo" />

            {/* Bộ lọc */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <form
                    onSubmit={handleFilter}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <div>
                        <label className="block text-sm mb-2 text-gray-700">
                            Loại báo cáo
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="">Tất cả</option>
                            <option value="users">Người dùng</option>
                            <option value="courses">Học phần</option>
                            <option value="departments">Khoa</option>
                            <option value="statistics">
                                Thống kê hệ thống
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-2 text-gray-700">
                            Ngày tạo
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            Lọc báo cáo
                        </button>
                    </div>
                </form>
            </div>

            {/* Danh sách báo cáo */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Tên báo cáo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Loại
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Ngày tạo
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                Thao tác
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {reports.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center text-gray-500 py-6"
                                >
                                    Không có báo cáo nào.
                                </td>
                            </tr>
                        ) : (
                            reports.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {r.title}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 capitalize">
                                        {r.type}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        {new Date(
                                            r.created_at
                                        ).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link
                                            href={route(
                                                "admin.reports.show",
                                                r.id
                                            )}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Xem
                                        </Link>

                                        <Link
                                            href={route(
                                                "admin.reports.download",
                                                r.id
                                            )}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            PDF
                                        </Link>

                                        <Link
                                            href={route(
                                                "admin.reports.export",
                                                r.id
                                            )}
                                            className="text-yellow-600 hover:text-yellow-800"
                                        >
                                            Excel
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Xóa
                                        </button>
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
