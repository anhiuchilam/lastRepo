/* eslint-disable @typescript-eslint/no-unused-vars */
// components/Products/ProductFormModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray, Control } from 'react-hook-form';
import Image from 'next/image';
import styles from './ProductFormModal.module.css';
import { Category } from '@/contexts/CategoryContext';
import { Product, FormValues } from '../Products/ProductInterfaces';

const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  isLoadingFormSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<FormValues>;
  product: Product | null;
  categories: Category[];
  isLoadingFormSubmit: boolean;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const productType = watch('product_type');
  const mainImageFiles = watch("images");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          name: product.name,
          description: product.description,
          product_type: product.product_type,
          category_id: product.category_id,
          // Giá và Giảm giá giờ luôn được reset, bất kể product_type
          price: Number(product.price || 0),
          discount_price: Number(product.discount_price || 0),
          stock_quantity: product.stock_quantity ? Number(product.stock_quantity || 0) : 0, // Vẫn là mặc định 0 nếu không có
          variants: product.product_type === 'variable' && product.variants ? product.variants.map(v => ({
            id: v.id,
            sku: v.sku,
            price: Number(v.price),
            discount: Number(v.discount),
            stock_quantity: Number(v.stock_quantity),
            attributes: v.attributes,
          })) : [],
        });
        setImagePreview(product.image);
      } else {
        reset({
          name: '',
          description: '',
          product_type: 'simple',
          category_id: categories[0]?.id,
          price: 0, // Mặc định là 0
          discount_price: 0, // Mặc định là 0
          stock_quantity: 0, // Mặc định là 0
          images: undefined,
          variants: [],
        });
        setImagePreview(null);
      }
    }
  }, [product, isOpen, reset, categories]);

  useEffect(() => {
    if (mainImageFiles && mainImageFiles.length > 0) {
      const file = mainImageFiles[0];
      setImagePreview(URL.createObjectURL(file));
    } else if (product && product.image && !mainImageFiles) {
      setImagePreview(product.image);
    } else if (!product && !mainImageFiles) {
      setImagePreview(null);
    }
  }, [mainImageFiles, product]);

  const getVariantImagePreview = (variantIndex: number, variantImageFile?: FileList | null): string | null => {
    if (variantImageFile && variantImageFile.length > 0) {
      return URL.createObjectURL(variantImageFile[0]);
    }
    if (product && product.product_type === 'variable' && product.variants && product.variants[variantIndex]?.image) {
      return product.variants[variantIndex].image;
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Tên sản phẩm</label>
              <input
                id="name"
                {...register('name', { required: 'Tên sản phẩm là bắt buộc' })}
                className={styles.formInput}
                placeholder="Ví dụ: iPhone 15 Pro Max"
              />
              {errors.name && <p className={styles.formError}>{errors.name.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category_id">Danh mục</label>
              <select id="category_id" {...register('category_id', { required: 'Danh mục là bắt buộc' })} className={styles.formSelect}>
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category_id && <p className={styles.formError}>{errors.category_id.message}</p>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="product_type">Loại sản phẩm</label>
              <select
                id="product_type"
                {...register('product_type')}
                className={styles.formSelect}
                disabled={!!product}
              >
                <option value="simple">Đơn giản</option>
                <option value="variable">Biến thể</option>
              </select>
            </div>

            {/* DI CHUYỂN CÁC TRƯỜNG GIÁ RA NGOÀI sectionFields */}
            <div className={styles.formGroup}>
              <label htmlFor="price">Giá gốc (VNĐ)</label>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { required: true, min: { value: 0, message: 'Giá không được âm'} })} // Luôn required
                className={styles.formInput}
                placeholder="30000000"
              />
              {errors.price && <p className={styles.formError}>{errors.price.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="discount_price">Giá giảm (VNĐ)</label>
              <input
                id="discount_price"
                type="number"
                step="0.01"
                {...register('discount_price', { min: { value: 0, message: 'Giá không được âm'} })}
                className={styles.formInput}
                placeholder="29000000"
              />
            </div>

          </div> {/* End formGrid for basic details */}

          <div className={styles.formGroup}>
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className={styles.formTextarea}
              placeholder="Nhập mô tả chi tiết cho sản phẩm..."
            />
          </div>

          {/* Phần cho Số lượng tồn - Giờ đây chỉ chứa stock_quantity và hiển thị có điều kiện */}
          {productType === 'simple' && (
            <div className={styles.sectionFields}>
                <div className={styles.formGroup}>
                  <label htmlFor="stock_quantity">Số lượng tồn</label>
                  <input
                    id="stock_quantity"
                    type="number"
                    {...register('stock_quantity', { required: productType === 'simple' ? 'Số lượng là bắt buộc' : false, min: { value: 0, message: 'Số lượng không được âm'} })}
                    className={styles.formInput}
                    placeholder="100"
                  />
                  {errors.stock_quantity && <p className={styles.formError}>{errors.stock_quantity.message}</p>}
                </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="images">Ảnh sản phẩm chính</label>
            <input
              id="images"
              type="file"
              multiple // Cho phép nhiều file ảnh chính
              {...register('images')}
              className={styles.formInput}
              accept="image/*"
            />
            {imagePreview && (
                <div className={styles.imagePreview}>
                    <Image src={imagePreview} alt="Xem trước ảnh" width={100} height={100} style={{objectFit: 'cover', borderRadius: '8px'}} />
                </div>
            )}
          </div>

          {/* Phần cho sản phẩm Biến thể - Hiển thị có điều kiện */}
          {productType === 'variable' && (
            <div className={styles.variantsSection}>
              <h4 className={styles.sectionTitle}>Biến thể</h4>
              {fields.map((field, index) => (
                <fieldset key={field.id} className={styles.variantFieldset}>
                  <legend>Biến thể {index + 1}</legend>
                  <div className={styles.variantGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor={`variants.${index}.sku`}>SKU</label>
                      <input
                        id={`variants.${index}.sku`}
                        {...register(`variants.${index}.sku` as const, { required: productType === 'variable' ? 'SKU là bắt buộc' : false })}
                        className={styles.formInput}
                        placeholder="SKU"
                      />
                      {errors?.variants?.[index]?.sku && <p className={styles.formError}>{errors.variants[index].sku.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor={`variants.${index}.price`}>Giá</label>
                      <input
                        id={`variants.${index}.price`}
                        type="number"
                        step="0.01"
                        {...register(`variants.${index}.price` as const, { required: productType === 'variable' ? 'Giá biến thể là bắt buộc' : false, min: 0 })}
                        className={styles.formInput}
                        placeholder="Giá"
                      />
                      {errors?.variants?.[index]?.price && <p className={styles.formError}>{errors.variants[index].price.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor={`variants.${index}.discount`}>Giảm giá</label>
                      <input
                        id={`variants.${index}.discount`}
                        type="number"
                        step="0.01"
                        {...register(`variants.${index}.discount` as const, { min: 0 })}
                        className={styles.formInput}
                        placeholder="Giảm giá"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor={`variants.${index}.stock_quantity`}>Số lượng</label>
                      <input
                        id={`variants.${index}.stock_quantity`}
                        type="number"
                        {...register(`variants.${index}.stock_quantity` as const, { required: productType === 'variable' ? 'Số lượng tồn là bắt buộc' : false, min: 0 })}
                        className={styles.formInput}
                        placeholder="Tồn kho"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor={`variants.${index}.attributes`}>Thuộc tính (JSON)</label>
                      <input
                        id={`variants.${index}.attributes`}
                        type="text"
                        {...register(`variants.${index}.attributes` as const, {
                            validate: value => {
                                if (!value) return true;
                                try { JSON.parse(value); return true; } catch { return 'JSON không hợp lệ'; }
                            }
                        })}
                        className={styles.formInput}
                        placeholder='{"size":"M","color":"Đen"}'
                      />
                      {errors?.variants?.[index]?.attributes && <p className={styles.formError}>{errors.variants[index].attributes.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor={`variants.${index}.image`}>Ảnh biến thể</label>
                      <input
                        id={`variants.${index}.image`}
                        type="file"
                        {...register(`variants.${index}.image` as const)}
                        className={styles.formInput}
                        accept="image/*"
                      />
                      {getVariantImagePreview(index, watch(`variants.${index}.image`)) && (
                        <div className={styles.imagePreview}>
                          <Image
                            src={getVariantImagePreview(index, watch(`variants.${index}.image`)) || ''}
                            alt="Ảnh biến thể"
                            width={50}
                            height={50}
                            style={{objectFit: 'cover', borderRadius: '8px'}}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <button type="button" onClick={() => remove(index)} className={styles.removeVariantBtn}>
                    Xóa biến thể
                  </button>
                </fieldset>
              ))}
              <button type="button" onClick={() => append({
                sku: '', price: 0, discount: 0, stock_quantity: 0, attributes: ''
              })} className={styles.addVariantBtn}>
                + Thêm biến thể
              </button>
            </div>
          )}

          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={`${styles.btn} ${styles.btnSecondary}`} disabled={isSubmitting || isLoadingFormSubmit}>
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