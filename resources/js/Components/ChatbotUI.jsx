import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatbotUI() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: "ai", text: "Xin chào! Mình là VNHeart AI. Bạn có thắc mắc gì về các chiến dịch thiện nguyện hay cách quyên góp không?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), sender: "user", text: inputValue };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await axios.post("/api/chat", { message: userMsg.text });
            const aiMsg = { id: Date.now() + 1, sender: "ai", text: response.data.reply };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg = { 
                id: Date.now() + 1, 
                sender: "ai", 
                text: error.response?.data?.reply || "Xin lỗi, đã có lỗi kết nối tới máy chủ AI. Vui lòng thử lại sau." 
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            {/* Chatbot Bubble */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="w-14 h-14 bg-gradient-to-r from-rose-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 focus:outline-none"
                    aria-label="Mở khung chat"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 transform translate-y-0 transition-transform origin-bottom-right">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-rose-500 to-red-600 p-4 text-white flex justify-between items-center shadow-md z-10">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative shadow-inner">
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                                <span className="text-xl">♥</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">VNHeart Assistant</h3>
                                <p className="text-xs text-rose-100">Đang trực tuyến</p>
                            </div>
                        </div>
                        <button onClick={toggleChat} className="text-rose-100 hover:text-white transition-colors focus:outline-none rounded-full p-1 hover:bg-rose-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                                    msg.sender === 'user' 
                                        ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-tr-sm' 
                                        : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                                }`}>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Nhập câu hỏi..."
                                className="flex-1 border-0 bg-gray-50 rounded-full px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm shadow-inner"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                                    inputValue.trim() && !isLoading
                                        ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <svg className="w-5 h-5 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
