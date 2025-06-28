/* eslint-disable @typescript-eslint/no-unused-vars */
// components/PageContents/CustomersPageContent.tsx
'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import styles from './CustomersPageContent.module.css';
import sharedStyles from '../Content/Content.module.css';
// Không cần FontAwesomeIcon và faTimes nếu không có nút đóng modal/icon
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes } from '@fortawesome/free-solid-svg-icons';
// Không cần useForm và SubmitHandler nếu không có form
// import { useForm, SubmitHandler } from 'react-hook-form';


// --- Interfaces ---
interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

// Kiểu dữ liệu cho form của React Hook Form (Không dùng nếu không có form)
// type CustomerFormValues = {
//   name: string;
//   email: string;
//   phone?: string;
//   address?: string;
// };

// Props cho CustomersPageContent
interface CustomersPageContentProps {
  isActive: boolean;
  searchTerm: string; // Để lọc khách hàng
}

// Dữ liệu khách hàng ban đầu (Mock Data)
const initialCustomers: Customer[] = [
  { id: 1, name: 'Nguyễn Văn An', email: 'an.nguyen@example.com', phone: '0901234567', address: '123 Đường ABC, HCM' },
  { id: 2, name: 'Trần Thị Bình', email: 'binh.tran@example.com', phone: '0902345678', address: '456 Đường XYZ, Hà Nội' },
  { id: 3, name: 'Lê Văn Cường', email: 'cuong.le@example.com', phone: '0903456789', address: '789 Đường DEF, Đà Nẵng' },
  { id: 4, name: 'Phạm Thanh Hương', email: 'huong.pham@example.com', phone: '0904567890', address: '222 Đường CVA, Đà Nẵng' },
  { id: 5, name: 'Hoàng Minh Khôi', email: 'khoi.hoang@example.com', phone: '0905678901', address: '333 Đường GHT, TP.HCM' },
];

// API_BASE_URL_CUSTOMERS không cần nếu không gọi API
// const API_BASE_URL_CUSTOMERS = 'http://localhost:8000/api/v1';

// --- COMPONENT MODAL FORM (Định nghĩa inline) ---
// XÓA TOÀN BỘ CUSTOMERFORMMODAL NÀY (Vì không cần form thêm/sửa)
// const CustomerFormModal = ({ ... }) => { ... };


// --- COMPONENT MODAL XÁC NHẬN XOÁ (Định nghĩa inline) ---
// XÓA TOÀN BỘ CUSTOMERDELETECONFIRMMODAL NÀY (Vì không cần chức năng xóa)
// const CustomerDeleteConfirmModal = ({ ... }) => { ... };


// --- COMPONENT CHÍNH CustomersPageContent ---
const CustomersPageContent: React.FC<CustomersPageContentProps> = ({ isActive, searchTerm }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers); // Dữ liệu khách hàng
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false); // Giữ false, không có fetch API

  // XÓA CÁC STATE LIÊN QUAN ĐẾN MODAL VÀ LOADING CỦA CRUD
  // const [isDeletingCustomer, setIsDeletingCustomer] = useState<boolean>(false);
  // const [isFormSubmitLoadingCustomer, setIsFormSubmitLoadingCustomer] = useState<boolean>(false);
  // const [isCustomerFormModalOpen, setIsCustomerFormModalOpen] = useState(false);
  // const [isCustomerDeleteModalOpen, setIsCustomerDeleteModalOpen] = useState(false);
  // const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  // const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  // XÓA HÀM fetchCustomers NÀY, KHÔNG CẦN GỌI API NỮA
  // const fetchCustomers = async () => { ... };

  // XÓA useEffect NÀY, KHÔNG CẦN GỌI API KHI MOUNT
  // useEffect(() => { fetchCustomers(); }, []);

  // Lọc khách hàng theo searchTerm
  const filteredCustomers = customers.filter(customer => {
    if (!customer) return false; // Thêm kiểm tra này để loại bỏ undefined/null trong mảng
    return (
      (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // --- XÓA CÁC HÀM XỬ LÝ MỞ/ĐÓNG MODAL ---
  // const handleOpenAddModalCustomer = () => { ... };
  // const handleOpenEditModalCustomer = (customer: Customer) => { ... };
  // const handleOpenDeleteModalCustomer = (customer: Customer) => { ... };
  // const handleCloseCustomerModals = () => { ... };

  // --- XÓA CÁC HÀM CRUD HANDLERS ---
  // const handleCustomerFormSubmit = async (data: CustomerFormData, customerId?: number) => { ... };
  // const handleDeleteCustomerConfirm = async () => { ... };

  // Hiển thị trạng thái loading ban đầu nếu đang tải khách hàng (Giữ loading false)
  if (loading) {
    return <div className={styles.statusMessage}>Đang tải khách hàng...</div>;
  }

  return (
    <div className={`${sharedStyles.pageContent} ${isActive ? sharedStyles.active : ''}`}>
      <div className={styles.customerPageHeader}>
        <h2 className={styles.title}>Quản lý khách hàng</h2>
        {/* XÓA NÚT "+ Thêm khách hàng" */}
        {/* <button onClick={handleOpenAddModalCustomer} className={`${styles.addCustomerBtn}`}>
          + Thêm khách hàng
        </button> */}
      </div>

      <div className={styles.customerTable}>
        <div className={styles.tableHeader}>
          <div>ID</div>
          <div>Tên khách hàng</div>
          <div>Email</div>
          <div className={styles.hideMobile}>Số điện thoại</div>
          <div className={styles.hideMobile}>Địa chỉ</div>
          {/* XÓA CỘT CHỨC NĂNG */}
          {/* <div>Chức năng</div> */}
        </div>

        {filteredCustomers.length === 0 ? (
          <div className={styles.noResults}>Không có khách hàng nào.</div>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer.id} className={styles.tableRow}>
              <div>{customer.id}</div>
              <div>{customer.name}</div>
              <div>{customer.email}</div>
              <div className={styles.hideMobile}>{customer.phone || '—'}</div>
              <div className={styles.hideMobile}>{customer.address || '—'}</div>
              {/* XÓA NÚT CHỨC NĂNG CỦA MỖI HÀNG */}
              {/* <div className={styles.customerActions}>
                <button
                  onClick={() => handleOpenEditModalCustomer(customer)}
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                  disabled={isDeletingCustomer || isFormSubmitLoadingCustomer}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleOpenDeleteModalCustomer(customer)}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  disabled={isDeletingCustomer || isFormSubmitLoadingCustomer}
                >
                  Xóa
                </button>
              </div> */}
            </div>
          ))
        )}
      </div>

      {/* XÓA CÁC MODAL KHI RENDER */}
      {/* <CustomerFormModal
        isOpen={isCustomerFormModalOpen}
        onClose={handleCloseCustomerModals}
        onSubmit={handleCustomerFormSubmit}
        customer={editingCustomer}
        isLoadingFormSubmit={isFormSubmitLoadingCustomer}
      />
      <CustomerDeleteConfirmModal
        isOpen={isCustomerDeleteModalOpen}
        onClose={handleCloseCustomerModals}
        onConfirm={handleDeleteCustomerConfirm}
        customerName={deletingCustomer?.name || ''}
        isDeleting={isDeletingCustomer}
      /> */}
    </div>
  );
};

export default CustomersPageContent;