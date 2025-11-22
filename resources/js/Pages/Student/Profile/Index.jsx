import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Edit from "./Edit";
import ChangePassword from "./ChangePassword";

export default function Index() {
    const { auth, flash } = usePage().props;
    const student = auth?.user ?? null;

    const [showEdit, setShowEdit] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold">Hồ sơ cá nhân</h2>}
        >
            <Head title="Hồ sơ cá nhân" />

            <div className="max-w-4xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="p-3 bg-green-100 text-green-800 rounded">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="p-3 bg-red-100 text-red-800 rounded">
                        {flash.error}
                    </div>
                )}

                <div className="bg-white shadow rounded p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                            Thông tin cá nhân
                        </h3>
                        <div className="space-x-2">
                            <button
                                onClick={() => setShowEdit(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                onClick={() => setShowChangePassword(true)}
                                className="px-4 py-2 bg-gray-700 text-white rounded"
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Họ và tên</p>
                            <p className="text-lg">{student?.name ?? "-"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-lg">{student?.email ?? "-"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Số điện thoại
                            </p>
                            <p className="text-lg">{student?.phone ?? "-"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Địa chỉ</p>
                            <p className="text-lg">{student?.address ?? "-"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Ngày sinh</p>
                            <p className="text-lg">
                                {student?.date_of_birth
                                    ? new Date(
                                          student.date_of_birth
                                      ).toLocaleDateString()
                                    : "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Vai trò</p>
                            <p className="text-lg">
                                {student?.role ??
                                    student?.roles?.[0]?.name ??
                                    "-"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal-like panels */}
                {showEdit && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setShowEdit(false)}
                        />
                        <div className="relative bg-white rounded shadow-lg w-full max-w-2xl p-6 z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-medium">
                                    Chỉnh sửa thông tin
                                </h4>
                                <button
                                    onClick={() => setShowEdit(false)}
                                    className="text-gray-600"
                                >
                                    Đóng
                                </button>
                            </div>
                            <Edit
                                onSuccess={() => {
                                    setShowEdit(false);
                                }}
                            />
                        </div>
                    </div>
                )}

                {showChangePassword && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setShowChangePassword(false)}
                        />
                        <div className="relative bg-white rounded shadow-lg w-full max-w-md p-6 z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-medium">
                                    Đổi mật khẩu
                                </h4>
                                <button
                                    onClick={() => setShowChangePassword(false)}
                                    className="text-gray-600"
                                >
                                    Đóng
                                </button>
                            </div>
                            <ChangePassword
                                onSuccess={() => {
                                    setShowChangePassword(false);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
