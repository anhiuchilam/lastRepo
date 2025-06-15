// components/PageContents/ProfilePageContent.tsx
import React from 'react';
import styles from './ProfilePageContent.module.css';
import sharedStyles from '../Content/Content.module.css';

interface ProfilePageContentProps {
  isActive: boolean;
}

const ProfilePageContent: React.FC<ProfilePageContentProps> = ({ isActive }) => {
  return (
    <div className={`${sharedStyles.pageContent} ${isActive ? sharedStyles.active : ''}`}>
      <div className={styles.welcomeCard}>
        <h2>Thông tin Profile</h2>
        <p>Quản lý thông tin cá nhân và cài đặt tài khoản</p>
      </div>
    </div>
  );
};

export default ProfilePageContent;