// components/Header/Header.tsx
'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';

interface HeaderProps {
  pageTitle: string;
  onSearch: (query: string) => void;
  onAddClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, onSearch, onAddClick }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.headerRight}>
       
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>HR</div>
          <div className={styles.userName}>Hồ Hùng Rene</div>
        </div>
      </div>
    </div>
  );
};

export default Header;