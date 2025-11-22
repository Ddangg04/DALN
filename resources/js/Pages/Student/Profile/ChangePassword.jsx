import React from "react";
import { useForm } from "@inertiajs/react";

export default function ChangePassword({ onSuccess = () => {} }) {
    const form = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        const url =
            typeof route === "function"
                ? route("student.profile.password")
                : "/sinh-vien/profile/password";
        form.post(url, {
            onSuccess: () => {
                form.reset(
                    "current_password",
                    "password",
                    "password_confirmation"
                );
                onSuccess();
            },
            onError: () => {
                // errors shown below
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-sm text-gray-600">
                    Mật khẩu hiện tại
                </label>
                <input
                    type="password"
                    value={form.data.current_password}
                    onChange={(e) =>
                        form.setData("current_password", e.target.value)
                    }
                    className="mt-1 block w-full border rounded px-3 py-2"
                />
                {form.errors.current_password && (
                    <div className="text-red-600 text-sm mt-1">
                        {form.errors.current_password}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm text-gray-600">
                    Mật khẩu mới
                </label>
                <input
                    type="password"
                    value={form.data.password}
                    onChange={(e) => form.setData("password", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                />
                {form.errors.password && (
                    <div className="text-red-600 text-sm mt-1">
                        {form.errors.password}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm text-gray-600">
                    Xác nhận mật khẩu
                </label>
                <input
                    type="password"
                    value={form.data.password_confirmation}
                    onChange={(e) =>
                        form.setData("password_confirmation", e.target.value)
                    }
                    className="mt-1 block w-full border rounded px-3 py-2"
                />
                {form.errors.password_confirmation && (
                    <div className="text-red-600 text-sm mt-1">
                        {form.errors.password_confirmation}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={form.processing}
                    className="px-4 py-2 bg-gray-700 text-white rounded"
                >
                    {form.processing ? "Đang cập nhật..." : "Đổi mật khẩu"}
                </button>
            </div>
        </form>
    );
}
