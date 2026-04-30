import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../context/DataContext';
import { Header } from '../components/Common';
import { FormModal, ConfirmModal } from '../components/FormComponents';

const ROLE_OPTIONS = [
  { label: 'Quản trị viên', value: 'admin' },
  { label: 'Quản lý viên', value: 'manager' },
];

const isProtectedAdmin = (user) => user?.id === 1 || user?.email === 'admin@rental.com';

export const UserRoleManagementScreen = ({ navigation }) => {
  const { users, updateUserRole, toggleUserStatus } = useContext(DataContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState('');
  const [searchText, setSearchText] = useState('');

  const handleChangeRole = (user) => {
    if (isProtectedAdmin(user)) {
      return;
    }

    setEditingUser(user);
    setSelectedRole(ROLE_OPTIONS.some(option => option.value === user.role) ? user.role : 'manager');
    setModalVisible(true);
  };

  const handleToggleStatus = (user) => {
    setEditingUser(user);
    setConfirmAction('status');
    setConfirmVisible(true);
  };

  const handleConfirm = async () => {
    if (confirmAction === 'status' && editingUser) {
      await toggleUserStatus(editingUser.id);
    }
    setConfirmVisible(false);
    setConfirmAction('');
    setEditingUser(null);
  };

  const handleSaveRole = async () => {
    if (!editingUser || !selectedRole) {
      return;
    }

    await updateUserRole(editingUser.id, selectedRole);
    handleCloseRoleModal();
  };

  const handleRoleSelect = async (role) => {
    if (!editingUser || !role) {
      return;
    }

    setSelectedRole(role);
    await updateUserRole(editingUser.id, role);
    handleCloseRoleModal();
  };

  const handleCloseRoleModal = () => {
    setModalVisible(false);
    setEditingUser(null);
    setSelectedRole('');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return '#EF4444';
      case 'manager':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'manager':
        return 'Quản lý viên';
      case 'tenant':
        return 'Khách thuê';
      default:
        return role;
    }
  };

  const getStatusLabel = (status) => {
    return status === 'active' ? 'Hoạt động' : 'Khóa';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#10B981' : '#EF4444';
  };

  const filteredUsers = users.filter(user => (
    user.role !== 'tenant' &&
    (
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
    )
  ));

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Avatar.Icon size={48} icon="account" style={{ backgroundColor: getRoleBadgeColor(item.role) }} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.userMeta}>
            <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(item.role) + '20' }]}>
              <Text style={[styles.roleText, { color: getRoleBadgeColor(item.role) }]}>
                {getRoleLabel(item.role)}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {getStatusLabel(item.status)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.userActions}>
        <Pressable
          style={[styles.actionButton, isProtectedAdmin(item) && styles.actionButtonDisabled]}
          onPress={() => handleChangeRole(item)}
          disabled={isProtectedAdmin(item)}
        >
          <MaterialCommunityIcons
            name="shield-edit"
            size={20}
            color={isProtectedAdmin(item) ? '#9CA3AF' : '#3B82F6'}
          />
          <Text style={[styles.actionText, isProtectedAdmin(item) && styles.actionTextDisabled]}>Đổi quyền</Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => handleToggleStatus(item)}
        >
          <MaterialCommunityIcons
            name={item.status === 'active' ? 'lock' : 'lock-open'}
            size={20}
            color={item.status === 'active' ? '#EF4444' : '#10B981'}
          />
          <Text style={[styles.actionText, { color: item.status === 'active' ? '#EF4444' : '#10B981' }]}>
            {item.status === 'active' ? 'Khóa' : 'Mở'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Phân quyền người dùng"
        showNotification={false}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm tài khoản..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information" size={20} color="#3B82F6" />
        <Text style={styles.infoText}>
          Bạn có {users.filter(u => u.role !== 'tenant' && u.status === 'active').length} tài khoản hoạt động
        </Text>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-off" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>Không tìm thấy tài khoản nào</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Change Role Modal */}
      <FormModal
        visible={modalVisible}
        title="Đổi quyền người dùng"
        onClose={handleCloseRoleModal}
        onSubmit={handleSaveRole}
        showFooter={false}
      >
        <View style={styles.roleOptionList}>
          {ROLE_OPTIONS.map(option => {
            const isSelected = selectedRole === option.value;

            return (
              <Pressable
                key={option.value}
                style={[styles.roleOption, isSelected && styles.roleOptionSelected]}
                onPress={() => handleRoleSelect(option.value)}
              >
                <MaterialCommunityIcons
                  name={option.value === 'admin' ? 'shield-account' : 'account-tie'}
                  size={22}
                  color={isSelected ? '#0052CC' : '#6B7280'}
                />
                <Text style={[styles.roleOptionText, isSelected && styles.roleOptionTextSelected]}>
                  {option.label}
                </Text>
                {isSelected && (
                  <MaterialCommunityIcons name="check" size={20} color="#0052CC" />
                )}
              </Pressable>
            );
          })}
        </View>
      </FormModal>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={confirmVisible}
        title={editingUser?.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
        message={
          editingUser?.status === 'active'
            ? `Bạn có chắc chắn muốn khóa tài khoản của ${editingUser?.name}?`
            : `Bạn có chắc chắn muốn mở khóa tài khoản của ${editingUser?.name}?`
        }
        type="danger"
        confirmText={editingUser?.status === 'active' ? 'Khóa' : 'Mở'}
        cancelText="Hủy"
        onConfirm={handleConfirm}
        onCancel={() => {
          setConfirmVisible(false);
          setConfirmAction('');
          setEditingUser(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  userDetails: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 6,
  },
  actionButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    flexShrink: 1,
    textAlign: 'center',
  },
  actionTextDisabled: {
    color: '#9CA3AF',
  },
  roleOptionList: {
    gap: 10,
    paddingBottom: 4,
  },
  roleOption: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roleOptionSelected: {
    borderColor: '#0052CC',
    backgroundColor: '#EFF6FF',
  },
  roleOptionText: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  roleOptionTextSelected: {
    color: '#0052CC',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
