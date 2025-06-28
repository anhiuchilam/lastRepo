// app/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import ContentStyles from '@/components/Content/Content.module.css';

// Import tất cả các component trang nội dung
import HomePageContent from '@/components/PageContents/HomePageContent';
import ProductsPageContent from '@/components/PageContents/ProductsPageContent';
import OrdersPageContent from '@/components/PageContents/OrdersPageContent';
import PromotePageContent from '@/components/PageContents/PromotePageContent';
// ProfilePageContent đã bị xóa theo yêu cầu trước đó, nên không import nữa
// import ProfilePageContent from '@/components/PageContents/ProfilePageContent';
import SettingsPageContent from '@/components/PageContents/SettingsPageContent';
import CategoriesPageContent from '@/components/PageContents/CategoriesPageContent';
import CustomersPageContent from '@/components/PageContents/CustomersPageContent';
import DiscountCodesPageContent from '@/components/PageContents/DiscountCodesPageContent'; // Import component Mã giảm giá MỚI

// Import Context Provider
import { CategoryProvider } from '@/contexts/CategoryContext';

// KHỐI METADATA KHÔNG ĐƯỢC ĐẶT Ở ĐÂY. NÓ THUỘC VỀ app/page.tsx
// export const metadata = {
//   title: 'ADM Manager',
//   description: 'Next.js Dashboard Application',
// };

interface PageTitlesMap {
  [key: string]: string;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>('products'); // Giá trị mặc định khi khởi động
  const [currentHeaderTitle, setCurrentHeaderTitle] = useState<string>('Quản lý Sản Phẩm');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // pageTitlesMap chứa tất cả các trang trong sidebar
  const pageTitlesMap: PageTitlesMap = {
    home: 'Trang chủ',
    products: 'Quản lý Sản Phẩm',
    orders: 'Quản lý Đơn Hàng',
    categories: 'Quản lý Danh Mục',
    customers: 'Quản lý Khách hàng',
    discount_codes: 'Mã giảm giá', // THÊM TIÊU ĐỀ CHO TRANG MỚI
    promote: 'Promote',
    // 'profile' đã bị XÓA khỏi pageTitlesMap theo yêu cầu trước đó
    // profile: 'Profile',
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
    setActivePage(pageId); // Cập nhật activePage dựa trên lựa chọn sidebar
    setCurrentHeaderTitle(pageTitlesMap[pageId] || 'ADM Manager');
    setSearchTerm('');
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleAddClick = () => {}; // Hàm này không dùng ở Header nữa

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomePageContent isActive={activePage === 'home'} />;
      case 'products':
        return <ProductsPageContent isActive={activePage === 'products'} searchTerm={searchTerm} />;
      case 'orders':
        return <OrdersPageContent isActive={activePage === 'orders'} searchTerm={searchTerm} />;
      case 'categories':
        return <CategoriesPageContent isActive={activePage === 'categories'} searchTerm={searchTerm} />;
      case 'customers':
        return <CustomersPageContent isActive={activePage === 'customers'} searchTerm={searchTerm} />;
      case 'discount_codes':
        return <DiscountCodesPageContent isActive={activePage === 'discount_codes'} searchTerm={searchTerm} />; // THÊM CASE NÀY
      case 'promote':
        return <PromotePageContent isActive={activePage === 'promote'} />;
      // 'profile' đã bị XÓA khỏi switch case
      // case 'profile':
      //   return <ProfilePageContent isActive={activePage === 'profile'} />;
      case 'settings':
        return <SettingsPageContent isActive={activePage === 'settings'} />;
      default: // Trường hợp activePage không khớp, hiển thị trang sản phẩm mặc định
        return <ProductsPageContent isActive={activePage === 'products'} searchTerm={searchTerm} />;
    }
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
              {/* CategoryProvider bao bọc renderContent() */}
              <CategoryProvider>
                {renderContent()}
              </CategoryProvider>
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}