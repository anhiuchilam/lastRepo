// components/PageContents/CategoriesPageContent.tsx
'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './CategoriesPageContent.module.css';
import sharedStyles from '../Content/Content.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCategories, Category } from '@/contexts/CategoryContext'; // Import useCategories và Category từ Context

// XÓA BỎ HOÀN TOÀN initialCategories khỏi đây, vì danh mục sẽ được tải từ API qua Context
// export const initialCategories: Category[] = [
//   { id: 5, name: 'Yến Sào', slug: 'yen-sao' },
//   { id: 6, name: 'Thực Phẩm Chức Năng', slug: 'thuc-pham-chuc-nang' },
//   { id: 7, name: 'Nhân Sâm', slug: 'nhan-sam' },
// ];

interface CategoryFormData {
  name: string;
}

interface CategoriesPageContentProps {
  isActive: boolean;
  searchTerm: string;
}

const CategoriesPageContent: React.FC<CategoriesPageContentProps> = ({ isActive, searchTerm }) => {
  // LẤY categories và các hàm thao tác từ Context thay vì quản lý state cục bộ
  const { categories, isLoadingCategories, addCategory, updateCategory, deleteCategory } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({ name: '' });
  const [isSaving, setIsSaving] = useState<boolean>(false); // Dùng riêng cho trạng thái lưu/xóa API

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '' });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true); // Bắt đầu loading cho thao tác lưu

    // Slug sẽ được tạo ở Backend, Frontend chỉ cần gửi 'name'
    // const slug = (formData.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    try {
      if (editingCategory) {
        // Gọi hàm updateCategory từ Context (sẽ gọi API PUT)
        await updateCategory(editingCategory.id, { name: formData.name });
        alert(`Danh mục "${formData.name}" đã được cập nhật!`);
      } else {
        // Gọi hàm addCategory từ Context (sẽ gọi API POST)
        await addCategory({ name: formData.name });
        alert(`Danh mục "${formData.name}" đã được thêm!`);
      }
      closeModal();
    } catch (error) {
      console.error('Lỗi khi lưu danh mục:', error);
      alert('Đã xảy ra lỗi khi lưu danh mục.');
    } finally {
      setIsSaving(false); // Kết thúc loading
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục này?`)) {
      return;
    }

    setIsSaving(true); // Bắt đầu loading cho thao tác xóa
    try {
      // Gọi hàm deleteCategory từ Context (sẽ gọi API DELETE)
      await deleteCategory(categoryId);
      alert('Danh mục đã được xóa thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
      alert('Đã xảy ra lỗi khi xóa danh mục.');
    } finally {
      setIsSaving(false); // Kết thúc loading
    }
  };

  // Lọc danh mục theo searchTerm (sử dụng `categories` từ Context)
  const filteredCategories = categories.filter(category =>
    (category.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hiển thị trạng thái loading ban đầu khi categories đang tải từ API
  if (isLoadingCategories) {
    return <div className={sharedStyles.loadingState}>Đang tải danh mục...</div>;
  }

  return (
    <div className={`${sharedStyles.pageContent} ${isActive ? sharedStyles.active : ''}`}>
      <div className={styles.categoryPageHeader}>
        <button className={styles.addCategoryBtn} onClick={openAddModal} disabled={isSaving}>
          + Thêm danh mục
        </button>
      </div>

      <div className={styles.categoryTable}>
        <div className={styles.tableHeader}>
          <div>ID</div>
          <div>Tên danh mục</div>
          <div>Slug</div>
          <div>Chức năng</div>
        </div>

        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div className={styles.tableRow} key={category.id}>
              <div>{category.id}</div>
              <div>{category.name}</div>
              <div>{category.slug}</div>
              <div className={styles.categoryActions}>
                <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEditModal(category)} disabled={isSaving}>Sửa</button>
                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(category.id)} disabled={isSaving}>Xóa</button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>Không tìm thấy danh mục nào.</div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeModal} disabled={isSaving}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3>{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="categoryName">Tên danh mục:</label>
                <input
                  type="text"
                  id="categoryName"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSaving}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                  {isSaving ? 'Đang lưu...' : (editingCategory ? 'Lưu thay đổi' : 'Thêm danh mục')}
                </button>
                <button type="button" className={styles.cancelBtn} onClick={closeModal} disabled={isSaving}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPageContent;