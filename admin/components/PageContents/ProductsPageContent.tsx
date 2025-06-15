// components/PageContents/ProductsPageContent.tsx
'use client';

import React, { useState } from 'react';
import Image from "next/image";
import styles from './ProductsPageContent.module.css';
import sharedStyles from '../Content/Content.module.css';
import Pagination from '../Pagination/Pagination';

interface Product {
  id: number;
  name: string;
  desc: string;
  price: string;
  imageUrl: string;
}

interface ProductsPageContentProps {
  isActive: boolean;
  searchTerm: string;
}

const initialProducts: Product[] = [
  // Sửa đường dẫn ảnh cho sản phẩm đầu tiên ở đây
  { id: 1, name: 'Set 12 Thìa ăn Vỉ Dao', desc: 'Bộ dao thìa 100% không gỉ chính thương hiệu từ 5 đến 8 đúng hàng trình.', price: '1,658,000đ', imageUrl: '/img/08.webp' },
  { id: 2, name: 'Set 8 Thìa ăn Vỉ Dao', desc: 'Bộ dao 100% không gỉ sáng phẩm chính hãng là 6 đến 8 đúng hàng trình.', price: '709,000đ', imageUrl: '/placeholder-product.svg' },
  { id: 3, name: 'Set 24 Thìa ăn Vỉ Dao', desc: 'Bộ đũng 100% không gỉ sáng phẩm chính hãng là 8 đến 8 đúng hàng trình.', price: '3,198,000đ', imageUrl: '/placeholder-product.svg' },
  { id: 4, name: 'Set 24 Thìa ăn Vỉ Dao (Phiên bản 2)', desc: 'Bộ đũng 100% không gỉ sáng phẩm chính hãng là 8 đến 8 đúng hàng trình.', price: '3,198,000đ', imageUrl: '/placeholder-product.svg' },
];

const ProductsPageContent: React.FC<ProductsPageContentProps> = ({ isActive, searchTerm }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 4;

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages: number = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex: number = (currentPage - 1) * itemsPerPage;
  const endIndex: number = startIndex + itemsPerPage;
  const currentProducts: Product[] = filteredProducts.slice(startIndex, endIndex);

  const handleEdit = (product: Product) => {
    alert(`Chỉnh sửa sản phẩm: ${product.name}`);
  };

  const handleDelete = (productId: number) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm này?`)) {
      setProducts(products.filter((p: Product) => p.id !== productId));
      alert('Đã xóa sản phẩm');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`${sharedStyles.pageContent} ${isActive ? sharedStyles.active : ''}`}>
      <div className={styles.productTable}>
        <div className={styles.tableHeader}>
          <div>Img</div>
          <div>Name</div>
          <div className={styles.hideMobile}>Mô tả</div>
          <div>Giá</div>
          <div>Chức năng</div>
        </div>

        {currentProducts.map((product) => (
          <div className={styles.tableRow} key={product.id}>
            <Image src={product.imageUrl} alt={product.name} width={50} height={50} className={styles.productImage} />
            <div className={styles.productInfo}>
              <div className={styles.productName}>{product.name}</div>
              <div className={styles.productDesc}>{product.desc}</div>
            </div>
            <div className={styles.hideMobile}>{product.price}</div>
            <div className={styles.productPrice}>{product.price}</div>
            <div className={styles.productActions}>
              <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleEdit(product)}>Sửa</button>
              <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(product.id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
};

export default ProductsPageContent;