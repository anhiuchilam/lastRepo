
'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBoxOpen, faClipboardList, faBullhorn, faUser, faCog, faAngleLeft, faAngleRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.css';

interface MenuItem {
  id: string;
  name: string;
  icon: IconDefinition;
}

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  activePage: string;
  onPageChange: (pageId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, activePage, onPageChange }) => {
  const menuItems: MenuItem[] = [
    { id: 'home', name: 'Trang chủ', icon: faHome },
    { id: 'products', name: 'Quản lý sản phẩm', icon: faBoxOpen },
    { id: 'orders', name: 'Quản lý đơn hàng', icon: faClipboardList },
    { id: 'promote', name: 'Promote', icon: faBullhorn },
    { id: 'profile', name: 'Profile', icon: faUser },
    { id: 'settings', name: 'Setting', icon: faCog },
  ];

  const handleMenuItemClick = (pageId: string) => {
    onPageChange(pageId);
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      <div
        className={`${styles.sidebarOverlay} ${isCollapsed ? '' : styles.show}`}
        onClick={toggleSidebar}
      ></div>

      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>A</div>
            <div className={styles.logoText}>ADM Manager</div>
          </div>
          <button className={styles.toggleBtn} onClick={toggleSidebar}>
            <FontAwesomeIcon icon={isCollapsed ? faAngleRight : faAngleLeft} />
          </button>
        </div>

        <div className={styles.menu}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.menuItem} ${activePage === item.id ? styles.active : ''}`}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <div className={styles.menuIcon}>
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <div className={styles.menuText}>{item.name}</div>
              {isCollapsed && <div className={styles.tooltip}>{item.name}</div>}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;