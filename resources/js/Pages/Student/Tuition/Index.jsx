// resources/js/Pages/Student/Tuition/Index.jsx
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function TuitionIndex({ tuitionFees, stats }) {
    const getStatusBadge = (status) => {
        const badges = {
            unpaid: {
                class: "bg-red-100 text-red-800",
                label: "Chưa thanh toán",
            },
            partial: {
                class: "bg-yellow-100 text-yellow-800",
                label: "Thanh toán 1 phần",
            },
            paid: {
                class: "bg-green-100 text-green-800",
                label: "Đã thanh toán",
            },
            overdue: { class: "bg-red-100 text-red-800", label: "Quá hạn" },
        };
        return badges[status] || badges.unpaid;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold">💰 Học phí</h2>}
        >
            <Head title="Học phí" />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                    <div className="text-sm text-red-600 mb-2">Còn nợ</div>
                    <div className="text-2xl font-bold text-red-700">
                        {formatCurrency(stats?.totalOwed || 0)}
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                    <div className="text-sm text-green-600 mb-2">
                        Đã thanh toán
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                        {formatCurrency(stats?.totalPaid || 0)}
                    </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
                    <div className="text-sm text-orange-600 mb-2">
                        Số kỳ quá hạn
                    </div>
                    <div className="text-2xl font-bold text-orange-700">
                        {stats?.overdueFees || 0}
                    </div>
                </div>
            </div>

            {/* Tuition List */}
            <div className="space-y-4">
                {tuitionFees?.map((fee) => {
                    const badge = getStatusBadge(fee.status);
                    const progress = (fee.paid_amount / fee.total_amount) * 100;

                    return (
                        <div
                            key={fee.id}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {fee.semester} {fee.year}
                                        </h3>
                                        <span
                                            className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${badge.class}`}
                                        >
                                            {badge.label}
                                        </span>
                                    </div>
                                    <Link
                                        href={route(
                                            "student.tuition.show",
                                            fee.id
                                        )}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Xem chi tiết →
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <div className="text-sm text-gray-600">
                                            Tổng học phí
                                        </div>
                                        <div className="text-lg font-bold text-gray-900">
                                            {formatCurrency(fee.total_amount)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">
                                            Đã thanh toán
                                        </div>
                                        <div className="text-lg font-bold text-green-600">
                                            {formatCurrency(fee.paid_amount)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">
                                            Còn lại
                                        </div>
                                        <div className="text-lg font-bold text-red-600">
                                            {formatCurrency(
                                                fee.remaining_amount
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-2">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Tiến độ thanh toán</span>
                                        <span>{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600">
                                    Hạn thanh toán:{" "}
                                    {new Date(fee.due_date).toLocaleDateString(
                                        "vi-VN"
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AuthenticatedLayout>
    );
}
