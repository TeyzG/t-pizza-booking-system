import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader, Bot, User, Trash2 } from 'lucide-react';
import { chatbotApi } from '../api/client';
import { ChatMessage } from '../types';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '👋 Chào bạn! Tôi là trợ lý T\'Pizza. Tôi có thể giúp bạn:\n\n• Kiểm tra thông tin đặt bàn\n• Xem thực đơn & khuyến mãi\n• Thông tin chi nhánh & giờ mở cửa\n• Các câu hỏi về pizza & nguyên liệu\n\nHãy hỏi tôi bất cứ điều gì về T\'Pizza nhé! 🍕',
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmed,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatbotApi.sendMessage(trimmed, sessionId);

      const assistantMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: response.answer || 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Vui lòng thử lại!',
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      // Fallback: local intent matching when API is unavailable
      const fallback = getLocalResponse(trimmed);
      const fallbackMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: fallback,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = async () => {
    try {
      await chatbotApi.clearSession(sessionId);
    } catch {
      // ignore
    }
    setMessages([
      {
        id: 'welcome_new',
        role: 'assistant',
        content: '👋 Đã xóa lịch sử! Tôi sẵn sàng trợ giúp bạn.',
        created_at: new Date().toISOString(),
      },
      {
        id: 'welcome_re',
        role: 'assistant',
        content: '👋 Chào bạn! Tôi là trợ lý T\'Pizza. Tôi có thể giúp bạn các thông tin về thực đơn, chi nhánh và đặt bàn. Hãy hỏi tôi nhé! 🍕',
        created_at: new Date().toISOString(),
      }
    ]);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-[#4A4A3E] hover:bg-[#2C2C2C]'
        }`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] bg-white border border-[#E5E2DA] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in"
          style={{ maxHeight: '600px', height: '60vh' }}
        >
          {/* Header */}
          <div className="bg-[#4A4A3E] text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <span className="font-bold text-sm">T'Pizza Assistant</span>
                <span className="text-[10px] text-white/70 block">AI Chatbot • Trực tuyến</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleClear} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Xóa lịch sử">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F9F8F6]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-[#4A4A3E]' : 'bg-white border border-[#E5E2DA]'
                }`}>
                  {msg.role === 'user' 
                    ? <User className="w-4 h-4 text-white" />
                    : <Bot className="w-4 h-4 text-[#4A4A3E]" />
                  }
                </div>
                <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-[#4A4A3E] text-white rounded-tr-none'
                    : 'bg-white border border-[#E5E2DA] text-[#2C2C2C] rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#4A4A3E]" />
                </div>
                <div className="bg-white border border-[#E5E2DA] px-3 py-2 rounded-lg rounded-tl-none">
                  <Loader className="w-4 h-4 animate-spin text-[#4A4A3E]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#E5E2DA] p-3 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 border border-[#E5E2DA] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A4A3E]"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-[#4A4A3E] text-white p-2 rounded-lg hover:bg-[#2C2C2C] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Local fallback responses when the API is unavailable.
 * Matches common Vietnamese questions about T'Pizza.
 */
function getLocalResponse(input: string): string {
  const q = input.toLowerCase().trim();

  // Greetings
  if (/^(chào|hi|hello|hey|👋)/.test(q)) {
    return 'Chào bạn! 🖐️ Tôi có thể giúp gì cho bạn hôm nay? Bạn muốn đặt bàn, xem thực đơn hay hỏi về chi nhánh?';
  }

  // Booking info
  if (/(đặt bàn|booking|reservation|đặt chỗ)/.test(q)) {
    return 'Để đặt bàn tại T\'Pizza, bạn vui lòng:\n\n1️⃣ Vào tab **Đặt bàn ăn** trên thanh menu\n2️⃣ Chọn chi nhánh, ngày giờ, số lượng khách\n3️⃣ Xác nhận thông tin và gửi yêu cầu\n\nSau khi đặt, admin sẽ xác nhận và xếp bàn cho bạn. ⏳';
  }

  // Menu / food
  if (/(thực đơn|menu|món ăn|pizza|gọi món)/.test(q)) {
    return '🍕 **Thực đơn T\'Pizza gợi ý:**\n\n• Pizza lò củi: Phô mai Burrata, Prosciutto, Margherita\n• Mỳ Ý: Spaghetti Carbonara, Tagliatelle Bolognese\n• Khai vị: Salad Caesar, Bruschetta\n• Tráng miệng: Tiramisu, Panna Cotta\n• Đồ uống: Bia thủ công, Vang Ý\n\n👉 Ghé chi nhánh gần nhất để xem menu đầy đủ nhé!';
  }

  // Branch info
  if (/(chi nhánh|cơ sở|địa chỉ|ở đâu|branch|location)/.test(q)) {
    return '📍 **Hệ thống T\'Pizza gồm 6 chi nhánh:**\n\n• 🏙 Hồ Chí Minh: Hai Bà Trưng (Q.1), Võ Văn Tần (Q.3)\n• 🏙 Hà Nội: Lý Quốc Sư, Phan Chu Trinh\n• 🏙 Đà Nẵng: Bạch Đằng\n• 🏙 Hải Phòng: Điện Biên Phủ\n\n⏰ Giờ mở cửa: 11:00 - 22:00 (tất cả các ngày)';
  }

  // Contact / support
  if (/(liên hệ|hotline|sđt|phone|contact)/.test(q)) {
    return '📞 **Liên hệ T\'Pizza:**\n\n• Hotline trung tâm: 028 3622 0500\n• Email: hello@tpizza.com\n• Website: tpizza.com\n\nHoặc bạn có thể chat trực tiếp với nhân viên qua hệ thống này!';
  }

  // Hours
  if (/(giờ mở cửa|mấy giờ|thời gian|open|close)/.test(q)) {
    return '⏰ **T\'Pizza mở cửa tất cả các ngày trong tuần:**\n\n• 🍽 Trưa: 11:00 - 14:30\n• 🌙 Tối: 17:00 - 22:00\n\nRiêng tối Thứ 6, Thứ 7 mở đến 23:00 🎉';
  }

  // Check booking status
  if (/(kiểm tra|check|trạng thái|mã đặt|tình trạng)/.test(q)) {
    return '🔍 Để kiểm tra trạng thái đặt bàn:\n\n• Vào tab **Quản trị viên** (nếu bạn là admin)\n• Hoặc liên hệ hotline: 028 3622 0500\n• Cung cấp mã đặt bàn để được hỗ trợ nhanh nhất!';
  }

  // Price
  if (/(giá|bao nhiêu tiền|cost|price|rẻ|đắt)/.test(q)) {
    return '💰 **Giá tham khảo:**\n\n• Pizza lò củi: 180.000đ - 350.000đ\n• Mỳ Ý: 120.000đ - 250.000đ\n• Khai vị: 60.000đ - 150.000đ\n• Đồ uống: 30.000đ - 120.000đ\n\n💡 Giá có thể thay đổi theo chi nhánh. Vào tab Đặt bàn để xem chi tiết!';
  }

  // Thank you
  if (/(cảm ơn|thanks|thank|cám ơn)/.test(q)) {
    return 'Cảm ơn bạn! 😊 Nếu cần hỗ trợ thêm, đừng ngần ngại hỏi tôi nhé. Chúc bạn có bữa tối tuyệt vời tại T\'Pizza! 🍕✨';
  }

  // Ingredients info
  if (/(nguyên liệu|thành phần|phô mai|bột)/.test(q)) {
    return '🧀 **Nguyên liệu tại T\'Pizza:**\n\n• Bột sourdough lên men 48h\n• Phô mai Mozzarella nhập khẩu Ý\n• Burrata tươi từ Đà Lạt\n• Rau củ hữu cơ đạt chuẩn\n\nTất cả được nướng bằng lò củi 400°C để giữ trọn hương vị! 🔥';
  }

  // Default response
  return 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. 🤔\n\nBạn có thể hỏi tôi về:\n\n• 🍕 Thực đơn & món ăn\n• 📍 Chi nhánh & địa chỉ\n• 📅 Đặt bàn & kiểm tra\n• ⏰ Giờ mở cửa\n• 💰 Giá cả\n• 📞 Liên hệ hỗ trợ\n\nHoặc gõ "chào" để bắt đầu! 👋';
}
