import React from "react";
import { useForm, usePage } from "@inertiajs/react";

export default function Edit({ onSuccess = () => {} }) {
    const { auth } = usePage().props;
    const user = auth?.user ?? {};

    const form = useForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        date_of_birth: user.date_of_birth || "",
    });

    const submit = (e) => {
        e.preventDefault();
        const url =
            typeof route === "function"
                ? route("student.profile.update")
                : "/sinh-vien/profile";
        form.put(url, {
            onSuccess: () => {
                onSuccess();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-sm text-gray-600">Họ và tên</label>
                <input
                    value={form.data.name}
                    onChange={(e) => form.setData("name", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                />
                {form.errors.name && (
                    <div className="text-red-600 text-sm mt-1">
                        {form.errors.name}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData("email", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                />
                {form.errors.email && (
                    <div className="text-red-600 text-sm mt-1">
                        {form.errors.email}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm text-gray-600">
                    Số điện thoại
                </label>
                <input
                    value={form.data.phone}
                    onChange={(e) => form.setData("phone", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                />
                {form.errors.phone && (
                    <div className="text-red-600 text-sm mt-1">
                        {form.errors.phone}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm text-gray-600">Địa chỉ</label>
                <input
                    value={form.data.address}
                    onChange={(e) => form.setData("address", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                />
                {form.errors.address && (
                    <div className="text-red-600 text-sm mt-1">
                        {form.errors.address}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm text-gray-600">Ngày sinh</label>
                <input
                    type="date"
                    value={form.data.date_of_birth}
                    onChange={(e) =>
                        form.setData("date_of_birth", e.target.value)
                    }
                    className="mt-1 block w-full border rounded px-3 py-2"
                />
                {form.errors.date_of_birth && (
                    <div className="text-red-600 text-sm mt-1">
                        {form.errors.date_of_birth}
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={() => form.reset()}
                    className="px-4 py-2 border rounded text-gray-700"
                >
                    Đặt lại
                </button>
                <button
                    type="submit"
                    disabled={form.processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    {form.processing ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>
        </form>
    );
}
