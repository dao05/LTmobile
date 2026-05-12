import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../context/DataContext';
import { Header, FilterBar, FloatingActionButton } from '../components/Common';
import { TenantCard } from '../components/Card';
import { FormModal, TextInputField, SelectField, ConfirmModal, DatePickerField } from '../components/FormComponents';

const tenantFilters = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Hoạt động' },
  { key: 'inactive', label: 'Đã thôi' },
];

export const TenantManagementScreen = ({ navigation }) => {
  const { tenants, rooms, addTenant, updateTenant, deleteTenant, getAvailableRooms, getRoomAvailableSlots } = useContext(DataContext);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletingTenantId, setDeletingTenantId] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [roomId, setRoomId] = useState(null);
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    filterTenants();
  }, [tenants, rooms, selectedFilter, searchText]);

  const filterTenants = () => {
    let filtered = tenants;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(tenant => tenant.status === selectedFilter);
    }

    if (searchText) {
      filtered = filtered.filter(tenant =>
        tenant.name.toLowerCase().includes(searchText.toLowerCase()) ||
        tenant.phone.includes(searchText)
      );
    }

    setFilteredTenants(filtered);
  };

  const handleAddTenant = () => {
    setEditingTenant(null);
    setName('');
    setPhone('');
    setIdCard('');
    setRoomId(null);
    setStartDate('');
    setModalVisible(true);
  };

  const handleEditTenant = (tenant) => {
    setEditingTenant(tenant);
    setName(tenant.name);
    setPhone(tenant.phone);
    setIdCard(tenant.idCard);
    setRoomId(tenant.roomId);
    setStartDate(tenant.startDate);
    setModalVisible(true);
  };

  const handleSaveTenant = async () => {
    if (!name || !phone || !idCard || !roomId || !startDate) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      if (editingTenant) {
        await updateTenant(editingTenant.id, {
          name,
          phone,
          idCard,
          roomId,
          startDate,
        });
      } else {
        await addTenant({
          name,
          phone,
          idCard,
          roomId,
          startDate,
        });
      }
    } catch (error) {
      alert(error.message || 'Không thể lưu khách thuê');
      return;
    }

    setModalVisible(false);
  };

  const handleDeleteTenant = async (tenantId) => {
    await deleteTenant(tenantId);
    setConfirmVisible(false);
    setDeletingTenantId(null);
  };

  const renderTenant = ({ item }) => {
    const room = rooms.find(r => r.id === item.roomId);
    return (
      <TenantCard
        tenant={item}
        room={room}
        onEdit={() => handleEditTenant(item)}
        onDelete={() => {
          setDeletingTenantId(item.id);
          setConfirmVisible(true);
        }}
        onView={() => navigation.navigate('TenantDetail', { tenantId: item.id })}
      />
    );
  };

  const selectableRooms = getAvailableRooms(editingTenant?.id);
  const availableRooms = selectableRooms.map(room => ({
    label: `Phòng ${room.number} - ${room.type} (còn ${getRoomAvailableSlots(room, editingTenant?.id)} chỗ)`,
    value: room.id,
  }));

  return (
    <View style={styles.container}>
      <Header
        title="Danh sách khách thuê"
        showNotification={false}
      />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm khách thuê..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Filter Chips */}
      <FilterBar
        filters={tenantFilters}
        selectedValue={selectedFilter}
        onChange={setSelectedFilter}
      />

      {/* Tenant List */}
      <FlatList
        data={filteredTenants}
        renderItem={renderTenant}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-off" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>Không tìm thấy khách thuê nào</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Add Tenant Modal */}
      <FormModal
        visible={modalVisible}
        title={editingTenant ? 'Chỉnh sửa khách thuê' : 'Thêm khách thuê mới'}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSaveTenant}
      >
        <TextInputField
          label="Họ và tên"
          value={name}
          onChangeText={setName}
          placeholder="Nguyễn Văn A"
          icon="account"
        />

        <TextInputField
          label="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          placeholder="0901234567"
          icon="phone"
          keyboardType="phone-pad"
        />

        <TextInputField
          label="CCCD / CMND"
          value={idCard}
          onChangeText={setIdCard}
          placeholder="001203004567"
          icon="card-account-details"
        />

        <SelectField
          label="Chọn phòng"
          value={roomId}
          onValueChange={setRoomId}
          items={availableRooms}
          placeholder="Chọn phòng còn chỗ"
          icon="home"
        />

        <DatePickerField
          label="Ngày bắt đầu thuê"
          value={startDate}
          onChangeText={setStartDate}
          placeholder="Chọn ngày bắt đầu thuê"
          icon="calendar"
        />
      </FormModal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        visible={confirmVisible}
        title="Xóa khách thuê"
        message="Bạn có chắc chắn muốn xóa khách thuê này? Hành động này không thể hoàn tác."
        type="danger"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => handleDeleteTenant(deletingTenantId)}
        onCancel={() => {
          setConfirmVisible(false);
          setDeletingTenantId(null);
        }}
      />

      <FloatingActionButton
        onPress={handleAddTenant}
        icon="plus"
        color="#3B82F6"
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
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8DEE9',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 110,
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
