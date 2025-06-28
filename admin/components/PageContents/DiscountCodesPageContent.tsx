/* eslint-disable @typescript-eslint/no-unused-vars */
// components/PageContents/DiscountCodesPageContent.tsx
'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import styles from './DiscountCodesPageContent.module.css';
import sharedStyles from '../Content/Content.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useForm, SubmitHandler } from 'react-hook-form';

// --- Interfaces ---
interface DiscountCode {
  id: number;
  code: string;
  type: 'percentage' | 'fixed'; // Loại: phần trăm hoặc cố định
  value: number; // Giá trị giảm (ví dụ: 10 cho 10% hoặc 50000 cho 50k)
  min_amount?: number; // Áp dụng nếu tổng đơn hàng tối thiểu
  starts_at: string; // Ngày bắt đầu (YYYY-MM-DD)
  ends_at: string; // Ngày kết thúc (YYYY-MM-DD)
  usage_limit?: number; // Giới hạn số lần sử dụng
  used_count?: number; // Số lần đã sử dụng
}

// Kiểu dữ liệu cho form của React Hook Form
type DiscountCodeFormValues = {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_amount?: number;
  starts_at: string;
  ends_at: string;
  usage_limit?: number;
};

// Props cho DiscountCodesPageContent
interface DiscountCodesPageContentProps {
  isActive: boolean;
  searchTerm: string; // Để lọc mã giảm giá
}

// Dữ liệu mã giảm giá ban đầu (Mock Data)
const initialDiscountCodes: DiscountCode[] = [
  { id: 1, code: 'SALE2025', type: 'percentage', value: 10, min_amount: 100000, starts_at: '2025-01-01', ends_at: '2025-12-31', usage_limit: 100, used_count: 10 },
  { id: 2, code: 'FREESHIP50', type: 'fixed', value: 50000, starts_at: '2025-03-01', ends_at: '2025-06-30', used_count: 5 },
  { id: 3, code: 'VIPCODE', type: 'percentage', value: 15, min_amount: 500000, starts_at: '2025-05-01', ends_at: '2025-07-31', usage_limit: 50, used_count: 2 },
];

// Định nghĩa base URL cho API Laravel (giữ nguyên, sẽ không gọi cho demo)
const API_BASE_URL_DISCOUNT_CODES = 'http://localhost:8000/api/v1';

// --- COMPONENT MODAL FORM (Định nghĩa inline) ---
const DiscountCodeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  discountCode, // Dữ liệu mã giảm giá khi ở chế độ sửa
  isLoadingFormSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<DiscountCodeFormValues>;
  discountCode: DiscountCode | null;
  isLoadingFormSubmit: boolean;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DiscountCodeFormValues>();

  const discountType = watch('type'); // Để hiển thị/ẩn trường giá trị

  useEffect(() => {
    if (isOpen) {
      if (discountCode) {
        reset({
          code: discountCode.code,
          type: discountCode.type,
          value: discountCode.value,
          min_amount: discountCode.min_amount || undefined,
          starts_at: discountCode.starts_at,
          ends_at: discountCode.ends_at,
          usage_limit: discountCode.usage_limit || undefined,
        });
      } else {
        const today = new Date().toISOString().split('T')[0];
        reset({
          code: '',
          type: 'percentage', // Mặc định là phần trăm
          value: 0,
          min_amount: undefined,
          starts_at: today,
          ends_at: today,
          usage_limit: undefined,
        });
      }
    }
  }, [discountCode, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{discountCode ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá mới'}</h3>
          <button onClick={onClose} className={styles.closeButton}><FontAwesomeIcon icon={faTimes} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="code">Mã giảm giá:</label>
              <input
                type="text"
                id="code"
                {...register('code', { required: 'Mã giảm giá là bắt buộc' })}
                className={styles.formInput}
                placeholder="VD: SALE20"
                disabled={isLoadingFormSubmit || isSubmitting}
              />
              {errors.code && <p className={styles.formError}>{errors.code.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="type">Loại giảm giá:</label>
              <select
                id="type"
                {...register('type', { required: true })}
                className={styles.formSelect}
                disabled={isLoadingFormSubmit || isSubmitting}
              >
                <option value="percentage">Phần trăm (%)</option>
                <option value="fixed">Cố định (VNĐ)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="value">Giá trị giảm:</label>
              <input
                type="number"
                id="value"
                step="0.01"
                {...register('value', {
                  required: 'Giá trị giảm là bắt buộc',
                  min: { value: 0, message: 'Giá trị không được âm' },
                  validate: val => {
                    if (discountType === 'percentage' && val > 100) return 'Phần trăm không được quá 100';
                    return true;
                  }
                })}
                className={styles.formInput}
                placeholder={discountType === 'percentage' ? '10 (cho 10%)' : '50000 (cho 50.000đ)'}
                disabled={isLoadingFormSubmit || isSubmitting}
              />
              {errors.value && <p className={styles.formError}>{errors.value.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="min_amount">Đơn tối thiểu (VNĐ):</label>
              <input
                type="number"
                id="min_amount"
                step="0.01"
                {...register('min_amount', { min: 0 })}
                className={styles.formInput}
                placeholder="100000 (nếu có)"
                disabled={isLoadingFormSubmit || isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="starts_at">Ngày bắt đầu:</label>
              <input
                type="date"
                id="starts_at"
                {...register('starts_at', { required: 'Ngày bắt đầu là bắt buộc' })}
                className={styles.formInput}
                disabled={isLoadingFormSubmit || isSubmitting}
              />
              {errors.starts_at && <p className={styles.formError}>{errors.starts_at.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ends_at">Ngày kết thúc:</label>
              <input
                type="date"
                id="ends_at"
                {...register('ends_at', { required: 'Ngày kết thúc là bắt buộc' })}
                className={styles.formInput}
                disabled={isLoadingFormSubmit || isSubmitting}
              />
              {errors.ends_at && <p className={styles.formError}>{errors.ends_at.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="usage_limit">Giới hạn sử dụng:</label>
              <input
                type="number"
                id="usage_limit"
                {...register('usage_limit', { min: 0 })}
                className={styles.formInput}
                placeholder="100 (tổng số lần)"
                disabled={isLoadingFormSubmit || isSubmitting}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={`${styles.btn} ${styles.btnSecondary}`} disabled={isLoadingFormSubmit || isSubmitting}>
              Huỷ
            </button>
            <button type="submit" disabled={isSubmitting || isLoadingFormSubmit} className={`${styles.btn} ${styles.btnPrimary}`}>
              {isLoadingFormSubmit || isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENT MODAL XÁC NHẬN XOÁ (Định nghĩa inline) ---
const DiscountCodeDeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  discountCodeName,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  discountCodeName: string;
  isDeleting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ maxWidth: '450px' }}>
        <div className={styles.modalHeader}>
          <h3>Xác nhận xoá mã giảm giá</h3>
          <button onClick={onClose} className={styles.closeButton}><FontAwesomeIcon icon={faTimes} /></button>
        </div>
        <div className={styles.modalBody}>
          <p>
            Bạn có chắc chắn muốn xoá mã giảm giá **{discountCodeName}** không? Hành động này không thể hoàn tác.
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

// --- COMPONENT CHÍNH DiscountCodesPageContent ---
const DiscountCodesPageContent: React.FC<DiscountCodesPageContentProps> = ({ isActive, searchTerm }) => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(initialDiscountCodes); // Sử dụng dữ liệu mẫu
  const [loading, setLoading] = useState<boolean>(false); // Giữ false, không có fetch API
  const [isDeletingDiscountCode, setIsDeletingDiscountCode] = useState<boolean>(false);
  const [isFormSubmitLoadingDiscountCode, setIsFormSubmitLoadingDiscountCode] = useState<boolean>(false);

  // State cho modals
  const [isDiscountCodeFormModalOpen, setIsDiscountCodeFormModalOpen] = useState(false);
  const [isDiscountCodeDeleteModalOpen, setIsDiscountCodeDeleteModalOpen] = useState(false);
  const [editingDiscountCode, setEditingDiscountCode] = useState<DiscountCode | null>(null);
  const [deletingDiscountCode, setDeletingDiscountCode] = useState<DiscountCode | null>(null);

  // Hàm fetch mã giảm giá (mock)
  const fetchDiscountCodes = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setDiscountCodes(initialDiscountCodes);
    setLoading(false);
  };

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  // Lọc mã giảm giá theo searchTerm
  const filteredDiscountCodes = discountCodes.filter(code =>
    (code.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Xử lý mở/đóng Modal ---
  const handleOpenAddModalDiscountCode = () => {
    setEditingDiscountCode(null);
    setIsDiscountCodeFormModalOpen(true);
  };

  const handleOpenEditModalDiscountCode = (code: DiscountCode) => {
    setEditingDiscountCode(code);
    setIsDiscountCodeFormModalOpen(true);
  };

  const handleOpenDeleteModalDiscountCode = (code: DiscountCode) => {
    setDeletingDiscountCode(code);
    setIsDiscountCodeDeleteModalOpen(true);
  };

  const handleCloseDiscountCodeModals = () => {
    setIsDiscountCodeFormModalOpen(false);
    setIsDiscountCodeDeleteModalOpen(false);
    setEditingDiscountCode(null);
    setDeletingDiscountCode(null);
  };

  // --- CRUD Handlers (Client-Side Only) ---
  const handleDiscountCodeFormSubmit: SubmitHandler<DiscountCodeFormValues> = async (data) => {
    setIsFormSubmitLoadingDiscountCode(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingDiscountCode) {
      setDiscountCodes(prevCodes => prevCodes.map(code =>
        code.id === editingDiscountCode.id ? { ...code, ...data, id: code.id } : code
      ));
      alert(`Mã giảm giá "${data.code}" đã được cập nhật!`);
    } else {
      const newId = discountCodes.length > 0 ? Math.max(...discountCodes.map(c => c.id)) + 1 : 1;
      const newCode: DiscountCode = { ...data, id: newId, used_count: 0 };
      setDiscountCodes(prevCodes => [...prevCodes, newCode]);
      alert(`Mã giảm giá "${data.code}" đã được thêm!`);
    }
    handleCloseDiscountCodeModals();
    setIsFormSubmitLoadingDiscountCode(false);
  };

  const handleDeleteDiscountCodeConfirm = async (id: number) => { // id là tham số, không phải deletingDiscountCode
    if (!deletingDiscountCode) return; // Kiểm tra deletingDiscountCode nếu bạn muốn dùng nó trong alert
    setIsDeletingDiscountCode(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setDiscountCodes(prevCodes => prevCodes.filter(code => code.id !== id)); // Lọc theo id
    alert(`Mã giảm giá "${deletingDiscountCode.code}" đã được xoá thành công!`);

    handleCloseDiscountCodeModals();
    setIsDeletingDiscountCode(false);
  };

  if (loading) {
    return <div className={styles.statusMessage}>Đang tải mã giảm giá...</div>;
  }

  return (
    <div className={`${sharedStyles.pageContent} ${isActive ? sharedStyles.active : ''}`}>
      <div className={styles.discountCodePageHeader}>
        <h2 className={styles.title}>Quản lý mã giảm giá</h2>
        <button onClick={handleOpenAddModalDiscountCode} className={`${styles.addDiscountCodeBtn}`}>
          + Thêm mã giảm giá
        </button>
      </div>

      <div className={styles.discountCodeTable}>
        <div className={styles.tableHeader}>
          <div>ID</div>
          <div>Mã</div>
          <div>Loại</div>
          <div>Giá trị</div>
          <div className={styles.hideMobile}>Đơn tối thiểu</div>
          <div className={styles.hideMobile}>Bắt đầu</div>
          <div className={styles.hideMobile}>Kết thúc</div>
          <div className={styles.hideMobile}>SL sử dụng</div>
          <div>Chức năng</div>
        </div>

        {filteredDiscountCodes.length === 0 ? (
          <div className={styles.noResults}>Không có mã giảm giá nào.</div>
        ) : (
          filteredDiscountCodes.map((code) => (
            <div key={code.id} className={styles.tableRow}>
              <div>{code.id}</div>
              <div>{code.code}</div>
              <div>{code.type === 'percentage' ? 'Phần trăm' : 'Cố định'}</div>
              <div>{code.value.toLocaleString('vi-VN')} {code.type === 'percentage' ? '%' : '₫'}</div>
              <div className={styles.hideMobile}>{code.min_amount ? code.min_amount.toLocaleString('vi-VN') + ' ₫' : '—'}</div>
              <div className={styles.hideMobile}>{code.starts_at}</div>
              <div className={styles.hideMobile}>{code.ends_at}</div>
              <div className={styles.hideMobile}>{code.usage_limit ? `${code.used_count || 0}/${code.usage_limit}` : (code.used_count || 0)}</div>
              <div className={styles.discountCodeActions}>
                <button
                  onClick={() => handleOpenEditModalDiscountCode(code)}
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                  disabled={isDeletingDiscountCode || isFormSubmitLoadingDiscountCode}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleOpenDeleteModalDiscountCode(code)}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  disabled={isDeletingDiscountCode || isFormSubmitLoadingDiscountCode}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Render Modals */}
      <DiscountCodeFormModal
        isOpen={isDiscountCodeFormModalOpen}
        onClose={handleCloseDiscountCodeModals}
        onSubmit={handleDiscountCodeFormSubmit}
        discountCode={editingDiscountCode}
        isLoadingFormSubmit={isFormSubmitLoadingDiscountCode}
      />
      <DiscountCodeDeleteConfirmModal
        isOpen={isDiscountCodeDeleteModalOpen}
        onClose={handleCloseDiscountCodeModals}
        onConfirm={() => handleDeleteDiscountCodeConfirm(deletingDiscountCode!.id)} // Pass ID
        discountCodeName={deletingDiscountCode?.code || ''}
        isDeleting={isDeletingDiscountCode}
      />
    </div>
  );
};

export default DiscountCodesPageContent;