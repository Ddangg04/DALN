import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AdminDashboard({ auth, stats, recentUsers }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        💖 Bảng điều khiển VNHeart Admin
                    </h2>
                    <div className="text-sm text-gray-600">
                        {new Date().toLocaleDateString("vi-VN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard - VNHeart" />

            {/* ========== MAIN STATS CARDS ========== */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {/* Total Users */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">👥</div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.users || 0}
                    </div>
                    <div className="text-blue-100">Tổng người dùng</div>
                </div>

                {/* Total Campaigns */}
                <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">❤️</div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.campaigns || 0}
                    </div>
                    <div className="text-rose-100">Chiến dịch quyên góp</div>
                </div>

                {/* Total Donations */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">💰</div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.donations || 0}
                    </div>
                    <div className="text-green-100">Lượt ủng hộ</div>
                </div>

                {/* Total News */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">📢</div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                        {stats?.news || 0}
                    </div>
                    <div className="text-purple-100">Tin tức cộng đồng</div>
                </div>
            </div>

            {/* ========== USER BREAKDOWN BY ROLE ========== */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Admins</h3>
                        <span className="text-2xl font-bold text-red-600">{stats?.admins || 0}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Donors</h3>
                        <span className="text-2xl font-bold text-blue-600">{stats?.donors || 0}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Volunteers</h3>
                        <span className="text-2xl font-bold text-green-600">{stats?.volunteers || 0}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Requesters</h3>
                        <span className="text-2xl font-bold text-orange-600">{stats?.requesters || 0}</span>
                    </div>
                </div>
            </div>
            
        </AuthenticatedLayout>
    );
}
