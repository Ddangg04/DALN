import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ReportsEdit({ report }) {
    const [title, setTitle] = useState(report?.title ?? "");
    const [type, setType] = useState(report?.type ?? "statistics");
    const [content, setContent] = useState(report?.content ?? "");

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route("admin.reports.update", report.id), {
            title,
            type,
            content,
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl">Sửa báo cáo</h2>}>
            <Head title="Sửa báo cáo" />

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-2">Tiêu đề</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Loại</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="statistics">Thống kê</option>
                            <option value="users">Người dùng</option>
                            <option value="courses">Học phần</option>
                            <option value="departments">Khoa</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Nội dung</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="6"
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() =>
                                router.visit(route("admin.reports.index"))
                            }
                            className="px-4 py-2 border rounded-lg"
                        >
                            Hủy
                        </button>

                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
