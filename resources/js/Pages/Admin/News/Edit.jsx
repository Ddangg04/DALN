import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";

export default function Edit({ news }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        title: news.title || "",
        summary: news.summary || "",
        content: news.content || "",
        status: news.status || "published",
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(news.image_url || null);
    const [generatingAI, setGeneratingAI] = useState(false);
    const [aiError, setAiError] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setData("image", file);
        }
    };

    const generateWithAI = async () => {
        if (!data.title) {
            setAiError("Vui lòng nhập tiêu đề bài viết trước khi sử dụng AI.");
            return;
        }

        setGeneratingAI(true);
        setAiError(null);

        try {
            const response = await axios.post(route("admin.api.ai-generate"), {
                title: data.title,
                type: 'news'
            });

            if (response.data) {
                setData(prev => ({
                    ...prev,
                    summary: response.data.summary || prev.summary,
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
        post(route("admin.news.update", news.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route("admin.news.index")} className="text-gray-400 hover:text-rose-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h2 className="font-black text-2xl text-gray-800 leading-tight">
                        Chỉnh sửa bài viết
                    </h2>
                </div>
            }
        >
            <Head title={`Sửa: ${news.title} - Admin`} />

            <div className="max-w-4xl mx-auto">
                <form onSubmit={submit} className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-10 space-y-8">
                        {/* Section: Basic Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-xs">1</div>
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Tiêu đề & Tóm tắt</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Tiêu đề bài viết</label>
                                        <button
                                            type="button"
                                            onClick={generateWithAI}
                                            disabled={generatingAI || !data.title}
                                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                                                generatingAI 
                                                    ? 'bg-gray-100 text-gray-400' 
                                                    : 'bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:shadow-gray-200 hover:-translate-y-0.5'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {generatingAI ? "Đang sáng tạo..." : "✨ Sáng tạo bằng AI"}
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-bold text-gray-900"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        placeholder="Nhập tiêu đề tin tức..."
                                    />
                                    {errors.title && <p className="mt-1 text-xs text-red-500 font-bold">{errors.title}</p>}
                                    {aiError && <p className="mt-1 text-xs text-orange-500 font-bold italic">{aiError}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tóm tắt ngắn</label>
                                    <textarea
                                        className="w-full px-5 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-medium text-gray-700 h-24"
                                        value={data.summary}
                                        onChange={(e) => setData("summary", e.target.value)}
                                        placeholder="Tóm tắt về nội dung bài viết..."
                                    />
                                    {errors.summary && <p className="mt-1 text-xs text-red-500 font-bold">{errors.summary}</p>}
                                </div>
                            </div>
                        </div>

                         {/* Section: Content & Media */}
                         <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-xs">2</div>
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Nội dung & Hình ảnh</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nội dung bài viết (HTML supported)</label>
                                    <textarea
                                        className="w-full px-5 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-medium text-gray-700 h-64"
                                        value={data.content}
                                        onChange={(e) => setData("content", e.target.value)}
                                        placeholder="Nhập nội dung chi tiết bài viết..."
                                    />
                                    {errors.content && <p className="mt-1 text-xs text-red-500 font-bold">{errors.content}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Hình ảnh bài viết</label>
                                    <div className="mt-2 flex items-center gap-6">
                                        <div className="w-40 h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                                            {imagePreview ? (
                                                <img src={imagePreview} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl text-gray-200">🖼️</span>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                id="news-image-upload"
                                            />
                                            <label
                                                htmlFor="news-image-upload"
                                                className="inline-block bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 cursor-pointer shadow-sm"
                                            >
                                                Thay đổi ảnh bài viết
                                            </label>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">JPG, PNG hoặc WebP. Tối đa 2MB.</p>
                                        </div>
                                    </div>
                                    {errors.image && <p className="mt-1 text-xs text-red-500 font-bold">{errors.image}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Trạng thái hiện tại</label>
                                    <select
                                        className="w-full px-5 py-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-bold text-gray-700"
                                        value={data.status}
                                        onChange={(e) => setData("status", e.target.value)}
                                    >
                                        <option value="published">Đã xuất bản</option>
                                        <option value="draft">Bản nháp</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-400 font-bold uppercase italic">* Đang cập nhật bản ghi bài viết ID: {news.id}</p>
                        <div className="flex gap-4">
                            <Link
                                href={route("admin.news.index")}
                                className="px-8 py-3 rounded-2xl font-bold text-gray-500 hover:text-gray-700 transition"
                            >
                                Hủy bỏ
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-gray-900 hover:bg-black text-white font-black px-10 py-3 rounded-2xl shadow-xl shadow-gray-200 hover:shadow-gray-300 hover:-translate-y-1 transition-all disabled:opacity-50 uppercase text-sm tracking-widest"
                            >
                                {processing ? "Đang xử lý..." : "Cập nhật bài viết"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
