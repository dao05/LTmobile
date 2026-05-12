import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import { Header, ActionButton } from '../components/Common';

export const UserProfileScreen = ({ navigation }) => {
  const { userData, userRole, signOut } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut();
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'admin':
        return '#EF4444';
      case 'manager':
        return '#3B82F6';
      default:
        return '#10B981';
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin':
        return 'Quản trị viên';
      case 'manager':
        return 'Quản lý viên';
      
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Hồ sơ cá nhân"
        showNotification={false}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar.Icon
            size={80}
            icon="account-circle"
            style={{ backgroundColor: getRoleColor() }}
          />
          <Text style={styles.userName}>{userData?.name || 'Người dùng'}</Text>
          <Text style={styles.userEmail}>{userData?.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor() + '20' }]}>
            <Text style={[styles.roleText, { color: getRoleColor() }]}>
              {getRoleLabel()}
            </Text>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
          <ProfileItem
            icon="account"
            label="Tên"
            value={userData?.name || 'N/A'}
          />
          <ProfileItem
            icon="email"
            label="Email"
            value={userData?.email || 'N/A'}
          />
          <ProfileItem
            icon="shield-account"
            label="Vai trò"
            value={getRoleLabel()}
          />
          <ProfileItem
            icon="identifier"
            label="ID"
            value={userData?.id?.toString() || 'N/A'}
          />
        </View>

        {/* Quick Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          <Pressable style={styles.settingItem}>
            <MaterialCommunityIcons name="bell" size={24} color="#3B82F6" />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Thông báo</Text>
              <Text style={styles.settingDesc}>Quản lý thông báo</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#D1D5DB" />
          </Pressable>
          <Pressable style={styles.settingItem}>
            <MaterialCommunityIcons name="security" size={24} color="#3B82F6" />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Bảo mật</Text>
              <Text style={styles.settingDesc}>Đổi mật khẩu, 2FA</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#D1D5DB" />
          </Pressable>
          <Pressable style={styles.settingItem}>
            <MaterialCommunityIcons name="palette" size={24} color="#3B82F6" />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Giao diện</Text>
              <Text style={styles.settingDesc}>Chế độ tối, ngôn ngữ</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#D1D5DB" />
          </Pressable>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
          <ProfileItem
            icon="information"
            label="Phiên bản"
            value="1.0.0"
          />
          <ProfileItem
            icon="calendar"
            label="Đăng ký"
            value="30/04/2026"
          />
        </View>

        {/* Logout Button */}
        <View style={styles.buttonSection}>
          <ActionButton
            label="Đăng xuất"
            icon="logout"
            onPress={handleLogout}
            variant="danger"
            fullWidth
            size="large"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const ProfileItem = ({ icon, label, value }) => {
  return (
    <View style={styles.profileItem}>
      <View style={styles.itemLeft}>
        <MaterialCommunityIcons name={icon} size={20} color="#3B82F6" />
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    paddingVertical: 16,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    gap: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },
  settingDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  buttonSection: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
});
