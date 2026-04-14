<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $apiKey = env('GEMINI_API_KEY');

        if (empty($apiKey)) {
            return response()->json([
                'reply' => "🤖 [CHẾ ĐỘ DEMO]\n\nChào bạn! Tôi là VNHeart AI. Hiện hệ thống đang ở chế độ Demo (chưa có API Key). \n\nTôi sẵn sàng hỗ trợ bạn tìm hiểu về các dự án thiện nguyện. Hãy thêm GEMINI_API_KEY vào tệp .env để bắt đầu nhé! ❤️"
            ]);
        }

        try {
            $userMessage = $request->input('message');

            // Thu thập dữ liệu chiến dịch thực tế (Chỉ thông tin công khai)
            $activeCampaigns = Campaign::where('status', 'active')
                ->get(['title', 'description', 'target_amount', 'raised_amount'])
                ->map(function($c) {
                    return "- " . $c->title . ": " . $c->description . " (Mục tiêu: " . number_format($c->target_amount) . " VND, Đã đạt: " . number_format($c->raised_amount) . " VND)";
                })->implode("\n");

            // Thu thập tin tức mới nhất
            $latestNews = News::where('status', 'published')
                ->latest()
                ->take(3)
                ->get(['title', 'summary'])
                ->map(function($n) {
                    return "- " . $n->title . ": " . $n->summary;
                })->implode("\n");

            // Xây dựng ngữ cảnh dữ liệu cho AI
            $dataContext = "DỮ LIỆU THỰC TẾ TỪ HỆ THỐNG VNHEART:\n\n";
            $dataContext .= "CÁC CHIẾN DỊCH ĐANG KÊU GỌI:\n" . ($activeCampaigns ?: "Hiện chưa có chiến dịch nào đang kêu gọi.") . "\n\n";
            $dataContext .= "TIN TỨC MỚI NHẤT:\n" . ($latestNews ?: "Chưa có tin tức mới.") . "\n\n";

            // Cấu trúc prompt định hướng AI sử dụng dữ liệu thực
            $systemPrompt = "Bạn là VNHeart AI, trợ lý ảo chính thức của nền tảng thiện nguyện VNHeart. \n" .
                            "Nhiệm vụ của bạn là trả lời dựa trên DỮ LIỆU THỰC TẾ được cung cấp bên dưới. \n" .
                            "Nếu người dùng hỏi về các chiến dịch hoặc tin tức, hãy ưu tiên sử dụng thông tin này. \n" .
                            "Nếu không có thông tin trong dữ liệu, hãy trả lời lịch sự rằng bạn chưa có thông tin cụ thể nhưng có thể hướng dẫn quyên góp chung. \n" .
                            "Phong cách: Lịch sự, ngắn gọn, nhân văn, truyền cảm hứng. Trả lời bằng tiếng Việt.\n\n" . 
                            $dataContext;

            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $systemPrompt . "\n\nCâu hỏi của khách: " . $userMessage]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 8192,
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Xin lỗi, tôi không thể tìm được câu trả lời lúc này.';
                
                return response()->json([
                    'reply' => $reply
                ]);
            }

            Log::error('Gemini API Error: ' . $response->body());
            $errorDetail = $response->json();
            $errorMessage = isset($errorDetail['error']['message']) ? $errorDetail['error']['message'] : 'Máy chủ AI đang bận. Vui lòng thử lại sau.';
            
            return response()->json([
                'reply' => 'Tôi đang gặp chút sự cố kết nối: ' . $errorMessage
            ], 500);

        } catch (\Exception $e) {
            Log::error('Gemini API Exception: ' . $e->getMessage());
            return response()->json([
                'reply' => 'Đã có lỗi hệ thống xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}
