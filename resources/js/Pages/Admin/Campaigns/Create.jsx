import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        content: "",
        target_amount: "",
        start_date: "",
        end_date: "",
        status: "active",
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [generatingAI, setGeneratingAI] = useState(false);
    const [aiError, setAiError] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateWithAI = async () => {
        if (!data.title) {
            setAiError("Vui lòng nhập tiêu đề chiến dịch trước khi sử dụng AI.");
            return;
        }

        setGeneratingAI(true);
        setAiError(null);

        try {
            const response = await axios.post(route("admin.api.ai-generate"), {
                title: data.title,
                type: 'campaign'
            });

            if (response.data) {
                setData(prev => ({
                    ...prev,
                    description: response.data.summary || prev.description,
                    content: response.data.content || prev.content
                }));
            }
        } catch (error) {
            console.error("AI Generation Error:", error);
            setAiError("Không thể kết nối với AI. Vui lòng thử lại sau.");
        } finally {
            setGeneratingAI(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.campaigns.store"), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route("admin.campaigns.index")} className="text-gray-400 hover:text-rose-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h2 className="font-black text-2xl text-gray-800 leading-tight">
                        Tạo chiến dịch mới
                    </h2>
                </div>
            }
        >
            <Head title="Tạo chiến dịch - Admin" />

            <div className="max-w-4xl mx-auto">
                <form onSubmit={submit} className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-10 space-y-8">
                        {/* Section: Basic Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center font-bold">1</div>
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Thông tin cơ bản</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Tên chiến dịch</label>
                                        <button
                                            type="button"
                                            onClick={generateWithAI}
                                            disabled={generatingAI || !data.title}
                                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                                                generatingAI 
                                                    ? 'bg-gray-100 text-gray-400' 
                                                    : 'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:shadow-rose-200 hover:-translate-y-0.5'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {generatingAI ? (
                                                <>
                                                    <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Đang sáng tạo...
                                                </>
                                            ) : (
                                                <>✨ Sáng tạo bằng AI</>
                                            )}
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-bold text-gray-900"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        placeholder="Ví dụ: Xây dựng trường mầm non Bản Cao..."
                                    />
                                    {errors.title && <p className="mt-1 text-xs text-red-500 font-bold">{errors.title}</p>}
                                    {aiError && <p className="mt-1 text-xs text-orange-500 font-bold italic">{aiError}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mô tả ngắn</label>
                                    <textarea
                                        className="w-full px-5 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-medium text-gray-700 h-24"
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        placeholder="Tóm tắt về chiến dịch..."
                                    />
                                    {errors.description && <p className="mt-1 text-xs text-red-500 font-bold">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Finance & Time */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center font-bold">2</div>
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Mục tiêu & Thời gian</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mục tiêu quyên góp (VND)</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-bold text-rose-600"
                                        value={data.target_amount}
                                        onChange={(e) => setData("target_amount", e.target.value)}
                                        placeholder="0"
                                    />
                                    {errors.target_amount && <p className="mt-1 text-xs text-red-500 font-bold">{errors.target_amount}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-bold text-gray-700"
                                        value={data.start_date}
                                        onChange={(e) => setData("start_date", e.target.value)}
                                    />
                                    {errors.start_date && <p className="mt-1 text-xs text-red-500 font-bold">{errors.start_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-bold text-gray-700"
                                        value={data.end_date}
                                        onChange={(e) => setData("end_date", e.target.value)}
                                    />
                                    {errors.end_date && <p className="mt-1 text-xs text-red-500 font-bold">{errors.end_date}</p>}
                                </div>
                            </div>
                        </div>

                         {/* Section: Content & Media */}
                         <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center font-bold">3</div>
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Nội dung & Hình ảnh</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nội dung chi tiết (Dùng AI để gen đẹp)</label>
                                    <textarea
                                        className="w-full px-5 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-medium text-gray-700 h-64"
                                        value={data.content}
                                        onChange={(e) => setData("content", e.target.value)}
                                        placeholder="Nhập nội dung chi tiết chiến dịch hoặc sử dụng nút Sáng tạo bằng AI ở trên..."
                                    />
                                    {errors.content && <p className="mt-1 text-xs text-red-500 font-bold">{errors.content}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Hình ảnh đại diện</label>
                                    <div className="mt-2 flex items-center gap-6">
                                        <div className="w-40 h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                                            {imagePreview ? (
                                                <img src={imagePreview} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl text-gray-200">📸</span>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="inline-block bg-white border border-rose-200 text-rose-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-50 cursor-pointer shadow-sm"
                                            >
                                                Chọn ảnh tải lên
                                            </label>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">JPG, PNG hoặc WebP. Tối đa 2MB.</p>
                                        </div>
                                    </div>
                                    {errors.image && <p className="mt-1 text-xs text-red-500 font-bold">{errors.image}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Trạng thái mặc định</label>
                                    <select
                                        className="w-full px-5 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-bold text-gray-700"
                                        value={data.status}
                                        onChange={(e) => setData("status", e.target.value)}
                                    >
                                        <option value="active">Đang kêu gọi</option>
                                        <option value="completed">Hoàn thành</option>
                                        <option value="closed">Đã đóng</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-400 font-bold uppercase italic">* Vui lòng kiểm tra kỹ thông tin trước khi tạo</p>
                        <div className="flex gap-4">
                            <Link
                                href={route("admin.campaigns.index")}
                                className="px-8 py-3 rounded-2xl font-bold text-gray-500 hover:text-gray-700 transition"
                            >
                                Hủy bỏ
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-rose-600 hover:bg-rose-700 text-white font-black px-10 py-3 rounded-2xl shadow-xl shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-1 transition-all disabled:opacity-50 uppercase text-sm tracking-widest"
                            >
                                {processing ? "Đang xử lý..." : "Tạo chiến dịch"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
