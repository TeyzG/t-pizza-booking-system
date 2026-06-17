import React, { useState, useEffect } from 'react';
import { Pizza, Salad, Cake, Beer, ScrollText, Star, Utensils, Loader, AlertCircle } from 'lucide-react';
import { categoriesApi } from '../api/client';
import { Category } from '../types';

// Ánh xạ tên danh mục từ Database với Lucide Icon
const iconMap: Record<string, any> = {
  'Pizza Lò Củi Đặc Trưng': Pizza,
  'Mỳ Ý & Risotto': Utensils,
  'Khai Vị & Salad': Salad,
  'Tráng Miệng': Cake,
  'Đồ Uống': Beer,
};

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setIsLoading(true);
        const response = await categoriesApi.getAll();
        // DRF Pagination returns results in an object or array
        const data = Array.isArray(response) ? response : response.results;
        setCategories(data || []);
      } catch (err: any) {
        console.error('Failed to load menu:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadMenu();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
      {/* Header Thực đơn */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-[#4A4A3E]/10 rounded-full text-[#4A4A3E] mb-4">
          <ScrollText className="w-6 h-6" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2C2C2C] mb-4">Thực Đơn T'Pizza by MAYTECH</h1>
        <div className="w-24 h-1 bg-[#4A4A3E] mx-auto mb-6"></div>
        <p className="text-sm md:text-base text-[#4A4A3E] leading-relaxed max-w-2xl mx-auto italic">
          "Khám phá tinh hoa ẩm thực Ý đích thực với nguyên liệu tươi ngon nhất và công thức truyền thống nướng củi độc bản."
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader className="w-10 h-10 animate-spin text-[#4A4A3E] mb-4" />
          <p className="text-sm font-mono text-[#BCB8AF] uppercase tracking-widest">Đang tải tinh hoa ẩm thực...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-800 font-bold">Không thể tải thực đơn</p>
          <p className="text-red-600/70 text-xs mt-1">{error}</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-16">
        {categories.map(category => {
          const IconComponent = iconMap[category.name] || ScrollText;
          return (
            <section key={category.id}>
              <div className="flex items-center gap-4 mb-10">
                <IconComponent className="w-6 h-6 text-[#4A4A3E]" />
                <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] uppercase tracking-wider">{category.name}</h2>
                <div className="flex-1 h-px bg-[#E5E2DA]"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {category.menu_items.map(item => (
                  <div key={item.id} className="group flex justify-between items-start p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-[#E5E2DA]">
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#2C2C2C] group-hover:text-[#4A4A3E] transition-colors">{item.name}</h3>
                        {item.is_special && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                      </div>
                      <p className="text-xs text-[#4A4A3E] mt-1 opacity-80">{item.description}</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#4A4A3E] bg-[#F9F8F6] px-2 py-1 rounded">
                      {item.price_display}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      )}

      <div className="mt-16 p-6 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-center text-sm text-[#4A4A3E]">
        <p className="font-bold">Lưu ý:</p>
        <p className="mt-2">Giá cả có thể thay đổi tùy theo mùa và chi nhánh. Vui lòng liên hệ trực tiếp nhà hàng để biết thêm chi tiết.</p>
        <p className="mt-1">Chúng tôi luôn sẵn lòng phục vụ các yêu cầu đặc biệt về dị ứng hoặc chế độ ăn kiêng.</p>
      </div>
    </div>
  );
}