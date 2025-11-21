import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Materials({ materials = [] }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold">Tài liệu học tập</h2>}
        >
            <Head title="Tài liệu" />
            <div className="bg-white p-4 rounded shadow">
                {materials.length ? (
                    materials.map((m) => (
                        <div
                            key={m.id}
                            className="p-3 border-b flex justify-between items-center"
                        >
                            <div>
                                <div className="font-medium">{m.title}</div>
                            </div>
                            <a
                                href={m.file_url}
                                className="text-blue-600"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Tải xuống
                            </a>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 p-6">
                        Chưa có tài liệu
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
