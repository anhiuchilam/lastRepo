// app/layout.tsx - SỬA ĐỔI NƠI ĐÂY

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


// XÓA DÒNG NÀY (metadata) TỪ ĐÂY
// export const metadata = {
//   title: 'ADM Manager',
//   description: 'Next.js Dashboard Application',
// };

interface PageTitlesMap {
  [key: string]: string;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>('products');
  const [currentHeaderTitle, setCurrentHeaderTitle] = useState<string>('Quản lý Sản Phẩm');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const pageTitlesMap: PageTitlesMap = {
    home: 'Trang chủ',
    products: 'Quản lý Sản Phẩm',
    orders: 'Quản lý Đơn Hàng',
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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const handlePageChange = (pageId: string) => {
    setActivePage(pageId);
    setCurrentHeaderTitle(pageTitlesMap[pageId] || 'ADM Manager');
    setSearchTerm('');
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleAddClick = () => {
    alert('Chức năng thêm sản phẩm sẽ được phát triển trong phiên bản tiếp theo!');
  };

  return (
    <html lang="vi">
      <body>
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
              onAddClick={handleAddClick}
            />
            <div className={ContentStyles.content}>
              <HomePageContent isActive={activePage === 'home'} />
              <ProductsPageContent isActive={activePage === 'products'} searchTerm={searchTerm} />
              <OrdersPageContent isActive={activePage === 'orders'} />
              <PromotePageContent isActive={activePage === 'promote'} />
              <ProfilePageContent isActive={activePage === 'profile'} />
             
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}