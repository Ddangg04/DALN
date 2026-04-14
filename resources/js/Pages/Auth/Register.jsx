import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden font-sans">
            <Head title="Tham gia cộng đồng - VNHeart" />

            {/* Background Blobs for Atmosphere */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-rose-200/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-100/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3.5s' }}></div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row relative z-10 w-full overflow-y-auto">
                {/* Left Side: Visual Inspiration (60% on Desktop) */}
                <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden bg-gray-900">
                    <img 
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                        alt="Join the Movement" 
                        className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-70 scale-100 rotate-0' : 'opacity-0 scale-125 rotate-2'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/40 via-transparent to-black/20"></div>
                    
                    {/* Floating Branding Overlay */}
                    <div className="absolute top-12 left-12 flex items-center space-x-4 animate-fade-in">
                        <Link href="/" className="flex items-center space-x-4 group">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl transition-transform group-hover:scale-110">
                                <span className="text-white text-3xl font-black">♥</span>
                            </div>
                            <span className="text-white text-3xl font-black tracking-tighter">VNHeart</span>
                        </Link>
                    </div>

                    <div className={`absolute bottom-20 left-16 max-w-xl transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <p className="text-rose-400 font-black uppercase tracking-[0.4em] text-xs mb-4">Khởi đầu hành trình mới</p>
                        <h2 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-8">Trở thành một <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-400">người hùng</span> đời thực</h2>
                        <div className="flex items-center space-x-8">
                            <div className="flex flex-col">
                                <span className="text-white text-4xl font-black italic">500+</span>
                                <span className="text-white/50 text-[10px] uppercase font-black tracking-[0.2em]">Dự án hoàn thành</span>
                            </div>
                            <div className="h-10 w-px bg-white/20"></div>
                            <div className="flex flex-col">
                                <span className="text-white text-4xl font-black italic">2B+</span>
                                <span className="text-white/50 text-[10px] uppercase font-black tracking-[0.2em]">Tổng tiền quyên góp</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Register Form (40% on Desktop, 100% on Mobile) */}
                <div className="flex-1 lg:w-[40%] flex items-center justify-center p-6 lg:p-12">
                    <div className={`w-full max-w-lg transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        
                        <div className="bg-white/70 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white p-8 lg:p-14">
                            <div className="mb-10">
                                <h3 className="text-3xl font-black text-gray-900 mb-2 leading-none">Tham gia ngay</h3>
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Kiến tạo tương lai tươi đẹp</p>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Họ và tên</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                                            <svg className="w-5 h-5 text-gray-300 group-focus-within:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className={`w-full bg-gray-50/50 border-2 ${errors.name ? 'border-red-200' : 'border-gray-50'} focus:border-rose-400 focus:ring-8 focus:ring-rose-500/10 rounded-2xl py-4 pl-14 pr-6 font-bold text-gray-900 transition-all placeholder:text-gray-300`}
                                            placeholder="Danh Dang"
                                            required
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-4 mt-1">⚠️ {errors.name}</p>}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email xác nhận</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                                            <svg className="w-5 h-5 text-gray-300 group-focus-within:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            className={`w-full bg-gray-50/50 border-2 ${errors.email ? 'border-red-200' : 'border-gray-50'} focus:border-rose-400 focus:ring-8 focus:ring-rose-500/10 rounded-2xl py-4 pl-14 pr-6 font-bold text-gray-900 transition-all placeholder:text-gray-300`}
                                            placeholder="anhdang@example.com"
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-4 mt-1">⚠️ {errors.email}</p>}
                                </div>

                                {/* Password Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Mật khẩu</label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={data.password}
                                                onChange={(e) => setData("password", e.target.value)}
                                                className={`w-full bg-gray-50/50 border-2 ${errors.password ? 'border-red-200' : 'border-gray-50'} focus:border-rose-400 focus:ring-8 focus:ring-rose-500/10 rounded-2xl py-4 pl-6 pr-12 font-bold text-gray-900 transition-all placeholder:text-gray-300 text-sm`}
                                                placeholder="••••••••"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-gray-300">
                                                {showPassword ? "👁️" : "🔒"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Xác nhận lại</label>
                                        <div className="relative group">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                                className={`w-full bg-gray-50/50 border-2 ${errors.password_confirmation ? 'border-red-200' : 'border-gray-50'} focus:border-rose-400 focus:ring-8 focus:ring-rose-500/10 rounded-2xl py-4 pl-6 pr-12 font-bold text-gray-900 transition-all placeholder:text-gray-300 text-sm`}
                                                placeholder="••••••••"
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-4 flex items-center text-gray-300">
                                                {showConfirmPassword ? "👁️" : "🔒"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {(errors.password || errors.password_confirmation) && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-4 mt-1">⚠️ Mật khẩu không khớp hoặc không hợp lệ</p>}

                                {/* Terms */}
                                <div className="text-[10px] text-gray-400 font-bold text-center px-4 leading-relaxed group">
                                    Bằng cách bấm đăng ký, bạn đồng ý với <span className="text-rose-500 cursor-help border-b border-rose-200">Điều khoản vận hành</span> và <span className="text-rose-500 cursor-help border-b border-rose-200">Chính sách minh bạch</span> của VNHeart.
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black rounded-2xl shadow-xl shadow-rose-100 hover:shadow-rose-400/30 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.4em] text-sm"
                                >
                                    {processing ? "⏳ Đang tạo tài khoản..." : "Xác nhận tham gia"}
                                </button>
                            </form>

                            <div className="mt-10 text-center">
                                <p className="text-xs font-bold text-gray-400">Bạn đã là thành viên?</p>
                                <Link href={route("login")} className="inline-block mt-2 text-sm font-black text-rose-500 hover:text-rose-600 transition-all uppercase tracking-widest group">
                                    Trở về Đăng nhập <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 1.5s ease-out forwards; }
            `}</style>
        </div>
    );
}
