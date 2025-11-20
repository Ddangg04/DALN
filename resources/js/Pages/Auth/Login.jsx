import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Welcome({ auth }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <>
            <Head title="Trang chủ">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <style>{`
                * {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
            `}</style>

            <div className="min-h-screen flex">
                {/* Left Side - Hero Section with Background */}
                <div
                    className="flex-1 relative bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2022&q=80')",
                    }}
                >
                    {/* Logo and Brand */}
                    <div className="absolute top-6 left-6 flex items-center">
                        <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center border-4 border-white shadow-lg mr-3">
                            <div className="text-white">
                                <svg
                                    className="w-8 h-8"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-white text-2xl font-bold tracking-wide">
                            ĐẠI HỌC PHENIKAA LMS
                        </span>
                    </div>

                    {/* Main Content */}
                    <div className="flex items-center justify-start h-full pl-12 pr-16">
                        <div className="max-w-2xl">
                            <div className="mb-6">
                                <p className="text-orange-400 font-bold text-lg tracking-wide uppercase mb-4">
                                    HỆ THỐNG QUẢN LÍ HỌC TẬP TRỰC TUYẾN
                                </p>
                            </div>
                            <h1 className="text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                                TRƯỜNG CÔNG NGHỆ THÔNG TIN
                                <br />
                                ĐẠI HỌC PHENIKAA
                            </h1>
                        </div>
                    </div>

                    {/* Footer Copyright */}
                    <div className="absolute bottom-6 left-6">
                        <p className="text-white text-sm">
                            Copyright@2025 Đại Học PHENIKAA
                        </p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-96 bg-white shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="p-6 bg-white">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-14 h-14 bg-blue-700 rounded-full flex items-center justify-center border-2 border-blue-800 mr-3">
                                <svg
                                    className="w-7 h-7 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-xs text-gray-600 uppercase tracking-wider font-medium">
                                    TRƯỜNG CÔNG NGHỆ THÔNG TIN PHENIKAA
                                </div>
                                <div className="text-red-600 font-bold text-sm tracking-wide">
                                    HỆ THỐNG QUẢN LÍ HỌC TẬP TRỰC TUYẾN
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="flex-1 px-6 pb-6 overflow-y-auto">
                        <form onSubmit={submit} className="space-y-4">
                            {/* Email Field */}
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="text"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className={`block w-full pl-10 pr-3 py-3 border ${
                                            errors.email
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                                        placeholder="Tên tài khoản / email"
                                        autoFocus
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className={`block w-full pl-10 pr-10 py-3 border ${
                                            errors.password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                                        placeholder="Mật khẩu"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        <svg
                                            className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            {showPassword ? (
                                                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                                            ) : (
                                                <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right">
                                <Link
                                    href={route("password.request")}
                                    className="text-xs text-gray-600 hover:text-blue-600"
                                >
                                    Bạn quên tên đăng nhập hoặc mật khẩu?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing
                                        ? "Đang đăng nhập..."
                                        : "Đăng nhập"}
                                </button>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 text-sm text-gray-600"
                                >
                                    Nhớ tên tài khoản
                                </label>
                            </div>
                        </form>

                        {/* Register Section */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-center text-sm text-gray-600 mb-3">
                                Chưa có tài khoản?
                            </p>
                            <Link
                                href={route("register")}
                                className="w-full flex justify-center py-3 px-4 border border-blue-600 text-sm font-bold rounded text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Đăng ký tài khoản
                            </Link>
                        </div>

                        {/* Divider */}
                        <div className="mt-6 mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-white text-gray-500">
                                        Đăng nhập bằng tài khoản của bạn trên:
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Google Login */}
                        <div className="flex items-center justify-center mb-6">
                            <a
                                href={route("auth.google")}
                                className="flex items-center justify-center space-x-2 px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors duration-200"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M21.35 11.1h-9.17v2.92h5.37c-.23 1.24-.92 2.29-1.97 2.99v2.49h3.18c1.86-1.71 2.93-4.24 2.93-7.24 0-.7-.06-1.37-.17-2.02z"
                                        fill="#EA4335"
                                    />
                                    <path
                                        d="M12.18 22c2.66 0 4.89-.88 6.52-2.39l-3.18-2.49c-.89.6-2.01.96-3.34.96-2.57 0-4.75-1.73-5.53-4.06H3.3v2.55C4.91 19.98 8.27 22 12.18 22z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M6.65 13.99c-.2-.6-.31-1.25-.31-1.92s.11-1.32.31-1.92V7.6H3.3A9.74 9.74 0 0 0 2 12.07c0 1.57.38 3.05 1.3 4.47l3.35-2.55z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12.18 4.92c1.45 0 2.75.5 3.78 1.48l2.82-2.82C16.92 1.86 14.7 1 12.18 1 8.27 1 4.91 3.01 3.3 6.14l3.35 2.55c.78-2.34 2.96-4.07 5.53-4.07z"
                                        fill="#4285F4"
                                    />
                                </svg>
                                <span className="text-sm font-medium">
                                    Đăng nhập bằng Google
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-white border-t border-gray-200">
                        <div className="text-center">
                            <div className="text-yellow-600 font-bold text-base mb-3 tracking-wide">
                                ABC E-LEARNING
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
