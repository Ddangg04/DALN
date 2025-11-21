import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Tuition({ tuition = {} }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold">Học phí</h2>}
        >
            <Head title="Học phí" />
            <div className="bg-white p-4 rounded shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded">
                        <div className="text-sm text-gray-500">Tổng</div>
                        <div className="text-xl font-bold">
                            {new Intl.NumberFormat("vi-VN").format(
                                tuition.total ?? 0
                            )}{" "}
                            đ
                        </div>
                    </div>
                    <div className="p-4 border rounded">
                        <div className="text-sm text-gray-500">Đã đóng</div>
                        <div className="text-xl font-bold">
                            {new Intl.NumberFormat("vi-VN").format(
                                tuition.paid ?? 0
                            )}{" "}
                            đ
                        </div>
                    </div>
                    <div className="p-4 border rounded">
                        <div className="text-sm text-gray-500">Còn nợ</div>
                        <div className="text-xl font-bold">
                            {new Intl.NumberFormat("vi-VN").format(
                                tuition.outstanding ?? 0
                            )}{" "}
                            đ
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
