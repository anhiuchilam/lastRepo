// components/PageContents/PromotePageContent.tsx
import React from 'react';
import styles from './PromotePageContent.module.css';
import sharedStyles from '../Content/Content.module.css';

interface PromotePageContentProps {
  isActive: boolean;
}

const PromotePageContent: React.FC<PromotePageContentProps> = ({ isActive }) => {
  return (
    <div className={`${sharedStyles.pageContent} ${isActive ? sharedStyles.active : ''}`}>
      <div className={styles.welcomeCard}>
        <h2>Quản lý Khuyến mãi</h2>
        <p>Tạo và quản lý các chương trình khuyến mãi</p>
      </div>
    </div>
  );
};

export default PromotePageContent;