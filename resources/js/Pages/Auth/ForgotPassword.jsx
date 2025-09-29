import { Head, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <>
            <Head title="Quên mật khẩu" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                    {/* Header */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                            <svg
                                className="w-7 h-7 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-blue-700">
                            QUÊN MẬT KHẨU
                        </h1>
                    </div>

                    {/* Intro */}
                    <div className="mb-4 text-sm text-gray-600">
                        Nhập địa chỉ email của bạn, chúng tôi sẽ gửi liên kết để
                        đặt lại mật khẩu mới.
                    </div>

                    {/* Status */}
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập email của bạn"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {processing
                                    ? "Đang gửi..."
                                    : "Gửi liên kết đặt lại mật khẩu"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
