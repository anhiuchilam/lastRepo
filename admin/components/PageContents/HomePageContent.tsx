// components/PageContents/HomePageContent.tsx
import React from 'react';
import styles from './HomePageContent.module.css';
import sharedStyles from '../Content/Content.module.css';

interface HomePageContentProps {
  isActive: boolean;
}

const HomePageContent: React.FC<HomePageContentProps> = ({ isActive }) => {
  return (
    <div className={`${sharedStyles.pageContent} ${isActive ? sharedStyles.active : ''}`}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>1,234</div>
          <div className={styles.statLabel}>Tổng sản phẩm</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>567</div>
          <div className={styles.statLabel}>Đơn hàng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>89</div>
          <div className={styles.statLabel}>Khuyến mãi</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>12</div>
          <div className={styles.statLabel}>Người dùng</div>
        </div>
      </div>
      <div className={styles.welcomeCard}>
        <h2>Chào mừng đến với ADM Manager</h2>
        <p>Hệ thống quản lý toàn diện cho doanh nghiệp của bạn</p>
      </div>
    </div>
  );
};

export default HomePageContent;