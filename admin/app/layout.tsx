// app/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import ContentStyles from '@/components/Content/Content.module.css';

import HomePageContent from '@/components/PageContents/HomePageContent';
import ProductsPageContent from '@/components/PageContents/ProductsPageContent';
import OrdersPageContent from '@/components/PageContents/OrdersPageContent';
import PromotePageContent from '@/components/PageContents/PromotePageContent';
import ProfilePageContent from '@/components/PageContents/ProfilePageContent';
import SettingsPageContent from '@/components/PageContents/SettingsPageContent';
import CategoriesPageContent from '@/components/PageContents/CategoriesPageContent';

import { CategoryProvider } from '@/components/contexts/CategoryContext'; // ✅ THÊM DÒNG NÀY

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>('products');
  const [currentHeaderTitle, setCurrentHeaderTitle] = useState<string>('Quản lý Sản Phẩm');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const pageTitlesMap = {
    home: 'Trang chủ',
    products: 'Quản lý Sản Phẩm',
    orders: 'Quản lý Đơn Hàng',
    categories: 'Quản lý Danh Mục',
    promote: 'Promote',
    profile: 'Profile',
    settings: 'Setting',
  };

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  const handlePageChange = (pageId: string) => {
    setActivePage(pageId);
    setCurrentHeaderTitle(pageTitlesMap[pageId] || 'ADM Manager');
    setSearchTerm('');
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomePageContent isActive />;
      case 'products':
        return <ProductsPageContent isActive searchTerm={searchTerm} />;
      case 'orders':
        return <OrdersPageContent isActive />;
      case 'categories':
        return <CategoriesPageContent isActive searchTerm={searchTerm} />;
      case 'promote':
        return <PromotePageContent isActive />;
      case 'profile':
        return <ProfilePageContent isActive />;
      case 'settings':
        return <SettingsPageContent isActive />;
      default:
        return <ProductsPageContent isActive searchTerm={searchTerm} />;
    }
  };

  return (
    <html lang="vi">
      <body>
        <CategoryProvider> {/* ✅ BỌC TOÀN BỘ ỨNG DỤNG TRONG PROVIDER */}
          <div className="container" style={{ display: 'flex', height: '100vh' }}>
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              toggleSidebar={toggleSidebar}
              activePage={activePage}
              onPageChange={handlePageChange}
            />
            <div
              className="main-content"
              style={{
                marginLeft: isSidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)',
                transition: 'margin-left 0.3s ease',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Header
                pageTitle={currentHeaderTitle}
                onSearch={handleSearch}
                onAddClick={() => {}}
              />
              <div className={ContentStyles.content}>
                {renderContent()}
              </div>
            </div>
          </div>
          {children}
        </CategoryProvider>
      </body>
    </html>
  );
}
