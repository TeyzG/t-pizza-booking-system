import React from 'react';
import { Pizza, Salad, Cake, Beer, ScrollText, Star, Utensils } from 'lucide-react';

const menuCategories = [
  {
    id: 'pizza',
    name: 'Pizza Lò Củi Đặc Trưng',
    icon: Pizza,
    items: [
      { name: 'Pizza Burrata', desc: 'Phô mai Burrata tươi, cà chua San Marzano, lá basil', price: '280.000đ' },
      { name: 'Pizza Prosciutto e Funghi', desc: 'Thịt đùi heo muối Prosciutto, nấm tươi, phô mai Mozzarella', price: '265.000đ' },
      { name: 'Pizza Margherita DOC', desc: 'Cà chua San Marzano, Mozzarella di Bufala, lá basil tươi', price: '240.000đ' },
      { name: 'Pizza Bốn Mùa (Quattro Stagioni)', desc: 'Bốn loại topping khác nhau tượng trưng 4 mùa', price: '270.000đ' },
      { name: 'Pizza Hải Sản (Frutti di Mare)', desc: 'Hải sản tươi sống, sốt cà chua, olive', price: '320.000đ' },
    ],
  },
  {
    id: 'pasta',
    name: 'Mỳ Ý & Risotto',
    icon: Utensils,
    items: [
      { name: 'Spaghetti Carbonara', desc: 'Trứng, thịt xông khói Pancetta, phô mai Pecorino Romano', price: '185.000đ' },
      { name: 'Tagliatelle Bolognese', desc: 'Sốt thịt bò hầm truyền thống, mỳ dẹt tươi', price: '195.000đ' },
      { name: 'Linguine Vongole', desc: 'Nghêu tươi, tỏi, ớt, rượu vang trắng', price: '210.000đ' },
      { name: 'Risotto Nấm Truffle', desc: 'Gạo Arborio, nấm Truffle đen, phô mai Parmesan', price: '290.000đ' },
    ],
  },
  {
    id: 'appetizer',
    name: 'Khai Vị & Salad',
    icon: Salad,
    items: [
      { name: 'Salad Burrata & Cà Chua', desc: 'Phô mai Burrata, cà chua bi, dầu olive', price: '160.000đ' },
      { name: 'Bruschetta Trio', desc: 'Ba loại Bruschetta khác nhau: cà chua, nấm, patê', price: '120.000đ' },
      { name: 'Calamari Fritti', desc: 'Mực ống chiên giòn kiểu Ý', price: '145.000đ' },
      { name: 'Súp Bí Đỏ & Hạt Bí', desc: 'Súp kem bí đỏ tươi, hạt bí rang', price: '100.000đ' },
    ],
  },
  {
    id: 'dessert',
    name: 'Tráng Miệng',
    icon: Cake,
    items: [
      { name: 'Tiramisu Cổ Điển', desc: 'Bánh ladyfinger, cà phê, kem mascarpone', price: '95.000đ' },
      { name: 'Panna Cotta Dâu Rừng', desc: 'Panna Cotta mềm mịn, sốt dâu rừng tươi', price: '85.000đ' },
      { name: 'Gelato Ý (các vị)', desc: 'Kem Ý thủ công, nhiều hương vị để lựa chọn', price: '70.000đ' },
    ],
  },
  {
    id: 'drinks',
    name: 'Đồ Uống',
    icon: Beer,
    items: [
      { name: 'Bia Thủ Công T\'Pizza', desc: 'Độc quyền T\'Pizza (Pale Ale, IPA)', price: '80.000đ' },
      { name: 'Vang Ý (Ly/Chai)', desc: 'Tuyển chọn các dòng vang đỏ/trắng Ý', price: '120.000đ/ly' },
      { name: 'Nước Ép Tươi', desc: 'Cam, táo, dưa hấu, dứa', price: '65.000đ' },
      { name: 'Cà Phê Ý', desc: 'Espresso, Cappuccino, Latte', price: '50.000đ' },
    ],
  },
];

export default function MenuPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
      {/* Header Thực đơn */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-[#4A4A3E]/10 rounded-full text-[#4A4A3E] mb-4">
          <ScrollText className="w-6 h-6" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2C2C2C] mb-4">Thực Đơn T'Pizza</h1>
        <div className="w-24 h-1 bg-[#4A4A3E] mx-auto mb-6"></div>
        <p className="text-sm md:text-base text-[#4A4A3E] leading-relaxed max-w-2xl mx-auto italic">
          "Khám phá tinh hoa ẩm thực Ý đích thực với nguyên liệu tươi ngon nhất và công thức truyền thống nướng củi độc bản."
        </p>
      </div>

      {/* Danh sách món ăn theo Category */}
      <div className="grid grid-cols-1 gap-16">
        {menuCategories.map(category => (
          <section key={category.id}>
            <div className="flex items-center gap-4 mb-10">
              {category.icon && <category.icon className="w-6 h-6 text-[#4A4A3E]" />} {/* Đảm bảo icon được render an toàn */}
              <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] uppercase tracking-wider">{category.name}</h2>
              <div className="flex-1 h-px bg-[#E5E2DA]"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {category.items.map(item => (
                <div key={item.name} className="group flex justify-between items-start p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-[#E5E2DA]">
                  <div className="flex-1 pr-6">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#2C2C2C] group-hover:text-[#4A4A3E] transition-colors">{item.name}</h3>
                      {item.name.includes('Burrata') && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    </div>
                    <p className="text-xs text-[#4A4A3E] mt-1 opacity-80">{item.desc}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#4A4A3E] bg-[#F9F8F6] px-2 py-1 rounded">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 p-6 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-center text-sm text-[#4A4A3E]">
        <p className="font-bold">Lưu ý:</p>
        <p className="mt-2">Giá cả có thể thay đổi tùy theo mùa và chi nhánh. Vui lòng liên hệ trực tiếp nhà hàng để biết thêm chi tiết.</p>
        <p className="mt-1">Chúng tôi luôn sẵn lòng phục vụ các yêu cầu đặc biệt về dị ứng hoặc chế độ ăn kiêng.</p>
      </div>
    </div>
  );
}