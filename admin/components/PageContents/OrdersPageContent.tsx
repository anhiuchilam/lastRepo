/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PageContents/OrdersPageContent.tsx
'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'; // Import useForm, SubmitHandler
import styles from './OrdersPageContent.module.css'; // CSS riêng cho trang này
import sharedStyles from '../Content/Content.module.css'; // CSS dùng chung
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Import icon X

// --- INTERFACES ---
interface Order {
  id: string; // Mã đơn hàng, ví dụ: #DH001
  customer_name: string; // Thường dùng snake_case nếu khớp API Laravel
  order_date: string; // Ngày đặt hàng (YYYY-MM-DD để dễ làm việc với input type="date")
  total_amount: number; // Tổng tiền (dùng number để dễ tính toán, format khi hiển thị)
  status: 'Đang xử lý' | 'Hoàn thành' | 'Đã hủy';
  statusCode: 'pending' | 'completed' | 'cancelled';
}

// Props cho OrdersPageContent
interface OrdersPageContentProps {
  isActive: boolean;
  searchTerm: string; // Để lọc đơn hàng
}

// Dữ liệu đơn hàng ban đầu (Mock Data) - Sẽ được thay thế bằng dữ liệu API
const initialOrders: Order[] = [
  {
    id: '#DH001',
    customer_name: 'Nguyễn Văn A',
    order_date: '2025-06-15',
    total_amount: 2500000,
    status: 'Đang xử lý',
    statusCode: 'pending',
  },
  {
    id: '#DH002',
    customer_name: 'Trần Thị B',
    order_date: '2025-06-14',
    total_amount: 1200000,
    status: 'Hoàn thành',
    statusCode: 'completed',
  },
  {
    id: '#DH003',
    customer_name: 'Lê Văn C',
    order_date: '2025-06-13',
    total_amount: 5000000,
    status: 'Đang xử lý',
    statusCode: 'pending',
  },
];

// Định nghĩa base URL cho API Laravel của bạn
const API_BASE_URL = 'http://localhost:8000/api/v1'; // Đảm bảo đúng prefix /v1

// --- Dành cho React Hook Form ---
type OrderFormValues = {
  customer_name: string;
  order_date: string;
  total_amount: number;
  status_code: 'pending' | 'completed' | 'cancelled';
};

// --- COMPONENT MODAL FORM (Định nghĩa inline) ---
const OrderFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  order, // Dữ liệu đơn hàng khi ở chế độ sửa
  isLoadingFormSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<OrderFormValues>;
  order: Order | null;
  isLoadingFormSubmit: boolean;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>();

  useEffect(() => {
    if (isOpen) {
      if (order) {
        // Chế độ sửa: Điền dữ liệu
        reset({
          customer_name: order.customer_name,
          order_date: order.order_date,
          total_amount: order.total_amount,
          status_code: order.statusCode,
        });
      } else {
        // Chế độ thêm: Reset về mặc định
        const today = new Date().toISOString().split('T')[0]; // Ngày hiện tại YYYY-MM-DD
        reset({
          customer_name: '',
          order_date: today,
          total_amount: 0,
          status_code: 'pending',
        });
      }
    }
  }, [order, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{order ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng mới'}</h3>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="customer_name">Tên khách hàng</label>
              <input
                id="customer_name"
                {...register('customer_name', { required: 'Tên khách hàng là bắt buộc' })}
                className={styles.formInput}
                placeholder="Nguyễn Văn A"
                disabled={isLoadingFormSubmit}
              />
              {errors.customer_name && <p className={styles.formError}>{errors.customer_name.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="order_date">Ngày đặt</label>
              <input
                id="order_date"
                type="date"
                {...register('order_date', { required: 'Ngày đặt là bắt buộc' })}
                className={styles.formInput}
                disabled={isLoadingFormSubmit}
              />
              {errors.order_date && <p className={styles.formError}>{errors.order_date.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="total_amount">Tổng tiền (VNĐ)</label>
              <input
                id="total_amount"
                type="number"
                step="0.01"
                {...register('total_amount', { required: 'Tổng tiền là bắt buộc', min: 0 })}
                className={styles.formInput}
                placeholder="1000000"
                disabled={isLoadingFormSubmit}
              />
              {errors.total_amount && <p className={styles.formError}>{errors.total_amount.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="status_code">Trạng thái</label>
              <select
                id="status_code"
                {...register('status_code', { required: true })}
                className={styles.formSelect}
                disabled={isLoadingFormSubmit}
              >
                <option value="pending">Đang xử lý</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={`${styles.btn} ${styles.btnSecondary}`} disabled={isLoadingFormSubmit}>
              Huỷ
            </button>
            <button type="submit" disabled={isSubmitting || isLoadingFormSubmit} className={`${styles.btn} ${styles.btnPrimary}`}>
              {isSubmitting || isLoadingFormSubmit ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENT MODAL XÁC NHẬN XOÁ (Định nghĩa inline) ---
const OrderDeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  orderId,
  customerName,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
  customerName: string;
  isDeleting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ maxWidth: '450px' }}>
        <div className={styles.modalHeader}>
          <h3>Xác nhận xoá đơn hàng</h3>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          <p>
            Bạn có chắc chắn muốn xoá đơn hàng **{orderId}** của khách hàng **{customerName}** không? Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={`${styles.btn} ${styles.btnSecondary}`} disabled={isDeleting}>Huỷ</button>
          <button onClick={onConfirm} className={`${styles.btn} ${styles.btnDanger}`} disabled={isDeleting}>
            {isDeleting ? 'Đang xoá...' : 'Xác nhận Xoá'}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- COMPONENT CHÍNH OrdersPageContent ---
const OrdersPageContent: React.FC<OrdersPageContentProps> = ({ isActive, searchTerm }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders); // Giữ initialOrders để có dữ liệu mẫu ban đầu
  const [loading, setLoading] = useState<boolean>(true); // Loading cho fetch orders
  const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false); // Loading cho thao tác xóa
  const [isFormSubmitLoadingOrder, setIsFormSubmitLoadingOrder] = useState<boolean>(false); // Loading cho thao tác thêm/sửa form

  // State cho modals
  const [isOrderFormModalOpen, setIsOrderFormModalOpen] = useState(false);
  const [isOrderDeleteModalOpen, setIsOrderDeleteModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  // Hàm fetch đơn hàng từ API
  const fetchOrders = async () => { // Bỏ pageNumber nếu API list không dùng phân trang hoặc dùng API URL đầy đủ
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      setOrders(json.data); // Giả định API trả về { data: [...] }
    } catch (err: any) {
      console.error('Lỗi tải đơn hàng:', err);
      alert(`Lỗi tải đơn hàng: ${err.message}`);
      setOrders([]); // Đặt rỗng nếu lỗi
    } finally {
      setLoading(false);
    }
  };

  // useEffect để tải đơn hàng khi component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Lọc đơn hàng theo searchTerm
  const filteredOrders = orders.filter(order =>
    (order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Xử lý mở/đóng Modal ---
  const handleOpenAddModalOrder = () => {
    setEditingOrder(null); // Chế độ thêm mới
    setIsOrderFormModalOpen(true);
  };

  const handleOpenEditModalOrder = (order: Order) => {
    setEditingOrder(order); // Chế độ sửa
    setIsOrderFormModalOpen(true);
  };

  const handleOpenDeleteModalOrder = (order: Order) => {
    setDeletingOrder(order); // Đặt đơn hàng cần xóa
    setIsOrderDeleteModalOpen(true);
  };

  const handleCloseOrderModals = () => {
    setIsOrderFormModalOpen(false);
    setIsOrderDeleteModalOpen(false);
    setEditingOrder(null);
    setDeletingOrder(null);
  };

  // --- CRUD Handlers ---
  const handleOrderFormSubmit: SubmitHandler<OrderFormValues> = async (data) => {
    setIsFormSubmitLoadingOrder(true);
    const method = editingOrder ? 'PUT' : 'POST';
    const url = editingOrder ? `${API_BASE_URL}/orders/${editingOrder.id}` : `${API_BASE_URL}/orders`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra khi lưu đơn hàng');
      }

      alert(`Đơn hàng đã được ${editingOrder ? 'cập nhật' : 'thêm'} thành công!`);
      await fetchOrders(); // Tải lại dữ liệu đơn hàng
      handleCloseOrderModals();
    } catch (error: any) {
      console.error("Lỗi khi lưu đơn hàng:", error);
      alert(error instanceof Error ? error.message : 'Có lỗi không xác định khi lưu đơn hàng');
    } finally {
      setIsFormSubmitLoadingOrder(false);
    }
  };

  const handleDeleteOrderConfirm = async () => {
    if (!deletingOrder) return;
    setIsDeletingOrder(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${deletingOrder.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Xoá đơn hàng thất bại');
      }
      alert(`Đơn hàng "${deletingOrder.id}" của khách hàng "${deletingOrder.customer_name}" đã được xoá thành công!`);
      await fetchOrders(); // Tải lại dữ liệu đơn hàng
      handleCloseOrderModals();
    } catch (error: any) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Lỗi không xác định khi xoá đơn hàng');
    } finally {
      setIsDeletingOrder(false);
    }
  };

  // Hiển thị trạng thái loading chung nếu đang tải đơn hàng
  if (loading) {
    return <div className={styles.statusMessage}>Đang tải đơn hàng...</div>;
  }

  return (
    <div className={sharedStyles.pageContent} style={{padding: '20px 30px'}}> {/* Ensure padding matches other pages */}
      <div className={styles.orderPageHeader}>
        <h2 className={styles.title}>Quản lý đơn hàng</h2>
        <button onClick={handleOpenAddModalOrder} className={`${styles.addOrderBtn}`}>
          + Thêm đơn hàng
        </button>
      </div>

      <div className={styles.orderTable}>
        <div className={styles.tableHeader}>
          <div>Mã đơn</div>
          <div>Khách hàng</div>
          <div>Ngày đặt</div>
          <div>Tổng tiền</div>
          <div>Trạng thái</div>
          <div>Chức năng</div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className={styles.noResults}>Không có đơn hàng nào.</div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className={styles.tableRow}>
              <div>{order.id}</div>
              <div>{order.customer_name}</div>
              <div>{order.order_date}</div>
              <div className={styles.totalAmount}>
                {order.total_amount.toLocaleString('vi-VN')} ₫
              </div>
              <div>
                <span className={`${styles.status} ${styles[order.statusCode]}`}>
                  {order.status}
                </span>
              </div>
              <div className={styles.orderActions}>
                <button
                  onClick={() => handleOpenEditModalOrder(order)}
                  className={`${styles.actionBtn} ${styles.viewBtn}`}
                  disabled={isDeletingOrder || isFormSubmitLoadingOrder}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleOpenDeleteModalOrder(order)}
                  className={`${styles.actionBtn} ${styles.cancelBtn}`}
                  disabled={isDeletingOrder || isFormSubmitLoadingOrder}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Render Modals */}
      <OrderFormModal
        isOpen={isOrderFormModalOpen}
        onClose={handleCloseOrderModals}
        onSubmit={handleOrderFormSubmit}
        order={editingOrder}
        isLoadingFormSubmit={isFormSubmitLoadingOrder}
      />
      <OrderDeleteConfirmModal
        isOpen={isOrderDeleteModalOpen}
        onClose={handleCloseOrderModals}
        onConfirm={handleDeleteOrderConfirm}
        orderId={deletingOrder?.id || ''}
        customerName={deletingOrder?.customer_name || ''}
        isDeleting={isDeletingOrder}
      />
    </div>
  );
};

export default OrdersPageContent;