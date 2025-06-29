/* eslint-disable @typescript-eslint/no-explicit-any */
// contexts/CategoryContext.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// --- Interfaces ---
export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at?: string; // Thêm trường này nếu API Laravel trả về
  updated_at?: string; // Thêm trường này nếu API Laravel trả về
}

// Định nghĩa kiểu cho Context Value
interface CategoryContextType {
  categories: Category[];
  isLoadingCategories: boolean; // Trạng thái loading khi tải danh mục
  addCategory: (newCategoryData: { name: string }) => Promise<void>; // Hàm thêm danh mục
  updateCategory: (id: number, updatedCategoryData: { name: string }) => Promise<void>; // Hàm cập nhật danh mục
  deleteCategory: (id: number) => Promise<void>; // Hàm xóa danh mục
  refetchCategories: () => Promise<void>; // Hàm để gọi lại API tải danh mục
}

// Tạo Context
const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// Định nghĩa base URL cho API Laravel của bạn
const API_BASE_URL = 'http://localhost:8000/api/v1/public'; // Đảm bảo đúng prefix API của bạn

// Provider Component
export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);

  // Hàm để gọi API lấy danh sách danh mục
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        // Log lỗi response đầy đủ nếu không OK
        const errorText = await response.text();
        console.error('Failed to fetch categories - Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      // Laravel API Resource thường trả về dữ liệu trong thuộc tính 'data'
      const data: { data: Category[] | undefined | null } = await response.json(); // Đảm bảo kiểu dữ liệu trả về

      // Đảm bảo setCategories luôn nhận một mảng
      setCategories(Array.isArray(data.data) ? data.data : []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) { // Bắt lỗi tổng quát hơn
      console.error('Failed to fetch categories:', error);
      alert(`Không thể tải danh mục. Vui lòng kiểm tra kết nối API: ${error.message}`);
      setCategories([]); // Đặt rỗng nếu lỗi
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Gọi API lấy danh mục khi component mount
  useEffect(() => {
    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount

  // Hàm để gọi API thêm danh mục (POST)
  const addCategory = async (newCatData: { name: string }) => {
    setIsLoadingCategories(true); // Có thể dùng trạng thái loading riêng cho thao tác này
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(newCatData), // Gửi dữ liệu dưới dạng JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Add Category Error:', errorData);
        throw new Error(errorData.message || 'Không thể thêm danh mục.');
      }

      // Sau khi thêm thành công, gọi lại API để cập nhật danh sách
      await fetchCategories();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error adding category:', error);
      alert(`Lỗi khi thêm danh mục: ${error.message}`);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Hàm để gọi API cập nhật danh mục (PUT)
  const updateCategory = async (id: number, updatedCatData: { name: string }) => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT', // Dùng PUT cho cập nhật toàn bộ tài nguyên
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updatedCatData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Update Category Error:', errorData);
        throw new Error(errorData.message || 'Không thể cập nhật danh mục.');
      }

      await fetchCategories(); // Cập nhật lại danh sách sau khi sửa
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error updating category:', error);
      alert(`Lỗi khi cập nhật danh mục: ${error.message}`);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Hàm để gọi API xóa danh mục (DELETE)
  const deleteCategory = async (id: number) => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Delete Category Error:', errorData);
        throw new Error(errorData.message || 'Không thể xóa danh mục.');
      }

      await fetchCategories(); // Cập nhật lại danh sách sau khi xóa
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert(`Lỗi khi xóa danh mục: ${error.message}`);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Giá trị Context sẽ được cung cấp cho các component con
  const contextValue: CategoryContextType = {
    categories,
    isLoadingCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    refetchCategories: fetchCategories, // Cung cấp hàm refetchCategories nếu cần
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};

// Custom Hook để sử dụng Context một cách dễ dàng trong các component
export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    // Đảm bảo hook được sử dụng bên trong CategoryProvider
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};