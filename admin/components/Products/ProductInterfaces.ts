/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Products/ProductInterfaces.ts
// Các interface chung cho sản phẩm và API

// Category interface (tái sử dụng từ Context)
import { Category } from '@/contexts/CategoryContext';

// Product interface - Đảm bảo khớp với API Laravel của bạn
interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string | null;
  discount_price: string | null;
  image: string | null; // URL của ảnh chính
  category: Category; // API trả về đối tượng category đầy đủ
  category_id: number; // API cũng trả về category_id (dành cho form)
  product_type: 'simple' | 'variable'; // Loại sản phẩm
  stock_quantity?: number; // Số lượng tồn kho nếu là simple product
  variants?: ProductVariant[]; // Biến thể nếu là variable product
  // Các trường khác từ API nếu có: images_collection, created_at, updated_at
}

// ProductVariant interface
interface ProductVariant {
  id?: number; // ID của biến thể nếu là sửa
  sku: string;
  price: string; // Giá gốc biến thể
  discount: string; // Giá giảm biến thể
  stock_quantity: number;
  attributes: string; // JSON string e.g., '{"size":"M","color":"Đen"}'
  image?: string; // URL ảnh của biến thể
}

// Định dạng dữ liệu API trả về danh sách sản phẩm
interface ApiResponse {
  data: Product[];
  links: any; // Thông tin về các link phân trang
  meta: any;  // Thông tin meta về phân trang (current_page, last_page, total, per_page, etc.)
}

// Dành cho React Hook Form - Kiểu dữ liệu form input
type FormValues = {
  name: string;
  description: string;
  category_id: number;
  product_type: 'simple' | 'variable'; // Loại sản phẩm
  // Trường cho sản phẩm đơn giản
  price?: number;
  discount_price?: number;
  stock_quantity?: number;
  // Ảnh chính (chỉ lấy 1 file đầu tiên nếu người dùng chọn nhiều)
  images?: FileList;
  // Trường cho sản phẩm biến thể (sử dụng useFieldArray)
  variants?: {
    id?: number; // ID biến thể hiện có
    sku: string;
    price: number;
    discount: number;
    stock_quantity: number;
    attributes: string; // JSON string
    image?: FileList; // FileList cho ảnh biến thể
  }[];
};

// Export tất cả các interfaces
export type { Category, Product, ApiResponse, FormValues, ProductVariant };