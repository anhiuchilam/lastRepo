/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './ProductsPageContent.module.css';
import ProductFormModal from "../Products/ProductFormModal";
import DeleteConfirmModal from "../Products/DeleteConfirmModal";

// Interfaces
interface Category { id: number; name: string; slug: string; }
interface Product { id: number; name: string; slug: string; description: string; price: string | null; discount_price: string | null; image: string | null; category: Category; }
interface ApiResponse { data: Product[]; meta: any; links: any; }
type FormValues = { name: string; description: string; price?: number; discount_price?: number; category_id: number; product_type: 'simple' | 'variable'; image?: FileList; };

// Custom hook: fetch products
const useProducts = (page: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<ApiResponse['meta'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/v1/products?page=${page}`);
        const json: ApiResponse = await res.json();
        setProducts(json.data);
        setPagination(json.meta);
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  return { products, pagination, loading, refresh: () => setLoading(true) };
};

// Custom hook: fetch categories
const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/categories`);
        const json = await res.json();
        setCategories(json.data);
      } catch (err) {
        console.error('Lỗi tải danh mục:', err);
      }
    };
    fetchCategories();
  }, []);

  return categories;
};

// Hook modal state
const useProductModals = () => {
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  return {
    isFormModalOpen, setFormModalOpen,
    isDeleteModalOpen, setDeleteModalOpen,
    editingProduct, setEditingProduct,
    deletingProduct, setDeletingProduct,
    openAddModal: () => { setEditingProduct(null); setFormModalOpen(true); },
    openEditModal: (p: Product) => { setEditingProduct(p); setFormModalOpen(true); },
    openDeleteModal: (p: Product) => { setDeletingProduct(p); setDeleteModalOpen(true); },
    closeAll: () => {
      setFormModalOpen(false);
      setDeleteModalOpen(false);
      setEditingProduct(null);
      setDeletingProduct(null);
    },
  };
};

const ProductsPageContent = () => {
  const [page, setPage] = useState(1);
  const { products, pagination, loading, refresh } = useProducts(page);
  const categories = useCategories();
  const modals = useProductModals();
  const [isDeleting, setIsDeleting] = useState(false);

  // Form submit handler
  const handleFormSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', String(data.price));
    if (data.discount_price !== undefined) formData.append('discount_price', String(data.discount_price));
    formData.append('category_id', String(data.category_id));
    formData.append('product_type', data.product_type);
    if (data.image?.length) formData.append('image', data.image[0]);
    if (modals.editingProduct) formData.append('_method', 'PUT');

    const url = modals.editingProduct
      ? `http://localhost:8000/api/v1/products/${modals.editingProduct.id}`
      : 'http://localhost:8000/api/v1/products';
    console.log(url, data);
    
    try {
      const res = await fetch(url, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Có lỗi xảy ra');
      refresh();
      modals.closeAll();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Có lỗi không xác định');
    }
  };

  // Delete confirm
  const handleDelete = async () => {
    if (!modals.deletingProduct) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/products/${modals.deletingProduct.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xoá thất bại');
      refresh();
      modals.closeAll();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Có lỗi không xác định');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2 className={styles.title}>Danh sách sản phẩm</h2>
        <button onClick={modals.openAddModal} className={`${styles.btn} ${styles.btnPrimary}`}>+ Thêm mới</button>
      </div>

      <div className={styles.productListContainer}>
        <div className={styles.tableHeader}>
          <div>Ảnh</div><div>Tên & Mô tả</div><div>Giá</div><div>Giảm giá</div><div style={{ textAlign: 'right' }}>Chức năng</div>
        </div>
        {loading ? (
          <div className={styles.statusMessage}>Đang tải...</div>
        ) : products.length === 0 ? (
          <div className={styles.statusMessage}>Không có sản phẩm nào.</div>
        ) : products.map(product => (
          <div key={product.id} className={styles.tableRow}>
            <div className={styles.productImageWrapper}>
              {product.image ? <Image src={product.image} alt={product.name} width={50} height={50} /> : <div className={styles.noImage} />}
            </div>
            <div><div>{product.name}</div><div>{product.description}</div></div>
            <div>{product.price ? `${Number(product.price).toLocaleString('vi-VN')} ₫` : '—'}</div>
            <div>{product.discount_price ? `${Number(product.discount_price).toLocaleString('vi-VN')} ₫` : '—'}</div>
            <div className={styles.productActions}>
              <button onClick={() => modals.openEditModal(product)} className={`${styles.actionBtn} ${styles.editBtn}`}>Sửa</button>
              <button onClick={() => modals.openDeleteModal(product)} className={`${styles.actionBtn} ${styles.deleteBtn}`}>Xoá</button>
            </div>
          </div>
        ))}
      </div>

      {pagination && pagination.last_page > 1 && (
        <div className={styles.pagination}>
          {pagination.links.map((link: any, i: number) => (
            <button key={i} disabled={!link.url}
              className={`${styles.pageButton} ${link.active ? styles.active : ''}`}
              onClick={() => { const u = new URL(link.url); setPage(Number(u.searchParams.get('page'))); }}
              dangerouslySetInnerHTML={{ __html: link.label }} />
          ))}
        </div>
      )}

      <ProductFormModal
        isOpen={modals.isFormModalOpen}
        onClose={modals.closeAll}
        onSubmit={handleFormSubmit}
        product={modals.editingProduct}
        categories={categories}
      />

      <DeleteConfirmModal
        isOpen={modals.isDeleteModalOpen}
        onClose={modals.closeAll}
        onConfirm={handleDelete}
        productName={modals.deletingProduct?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ProductsPageContent;
