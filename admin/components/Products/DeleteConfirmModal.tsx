/* eslint-disable react/no-unescaped-entities */

// components/Products/DeleteConfirmModal.tsx
'use client';

import React from 'react';
import styles from './ProductFormModal.module.css'; // Tái sử dụng CSS của ProductFormModal cho modal chung

// --- COMPONENT MODAL XÁC NHẬN XOÁ ---
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName, isDeleting }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, productName: string, isDeleting: boolean }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} style={{maxWidth: '450px'}}> {/* Giảm maxWidth cho modal xác nhận */}
                <div className={styles.modalHeader}>
                    <h3>Xác nhận xoá</h3>
                    <button onClick={onClose} className={styles.closeButton}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <p>Bạn có chắc chắn muốn xoá sản phẩm <strong>"{productName}&rdquo;</strong> không? Hành động này không thể hoàn tác.</p>
                </div>
                <div className={styles.modalFooter}>
                    <button onClick={onClose} className={`${styles.btn} ${styles.btnSecondary}`} disabled={isDeleting}>Huỷ</button>
                    <button onClick={onConfirm} className={`${styles.btn} ${styles.btnDanger}`} disabled={isDeleting}>
                        {isDeleting ? 'Đang xoá...' : 'Xác nhận Xoá'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmModal;