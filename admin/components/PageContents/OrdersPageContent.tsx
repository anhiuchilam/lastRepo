// components/PageContents/OrdersPageContent.tsx
import React from 'react';
import styles from './OrdersPageContent.module.css';
import sharedStyles from '../Content/Content.module.css';

interface OrdersPageContentProps {
  isActive: boolean;
}

const OrdersPageContent: React.FC<OrdersPageContentProps> = ({ isActive }) => {
  return (
    <div className={`${sharedStyles.pageContent} ${isActive ? sharedStyles.active : ''}`}>
      <div className={styles.welcomeCard}>
        <h2>Quản lý Đơn hàng</h2>
        <p>Theo dõi và xử lý các đơn hàng từ khách hàng</p>
      </div>
    </div>
  );
};

export default OrdersPageContent;