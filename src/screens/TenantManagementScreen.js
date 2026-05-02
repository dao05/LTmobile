import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../context/DataContext';
import { Header, FilterBar, FloatingActionButton } from '../components/Common';
import { TenantCard } from '../components/Card';
import { ConfirmModal, DatePickerField, FormModal, SelectField, TextInputField } from '../components/FormComponents';
import { formatAppDate } from '../utils/helpers';

const tenantFilters = [
  { key: 'all', label: 'Tat ca' },
  { key: 'active', label: 'Dang thue' },
  { key: 'inactive', label: 'Da roi phong' },
];

export const TenantManagementScreen = ({ navigation }) => {
  const { tenants, rooms, addTenant, updateTenant, deleteTenant, getRoomAvailableSlots, getRoomById } = useContext(DataContext);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [deletingTenantId, setDeletingTenantId] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [roomId, setRoomId] = useState(null);
  const [startDate, setStartDate] = useState(formatAppDate(new Date()));
  const [status, setStatus] = useState('active');

  useEffect(() => {
    let nextTenants = tenants;

    if (selectedFilter !== 'all') {
      nextTenants = nextTenants.filter((tenant) => tenant.status === selectedFilter);
    }

    if (searchText.trim()) {
      const keyword = searchText.trim().toLowerCase();
      nextTenants = nextTenants.filter((tenant) => {
        const room = getRoomById(tenant.roomId);
        return (
          tenant.name?.toLowerCase().includes(keyword) ||
          tenant.phone?.includes(keyword) ||
          tenant.idCard?.includes(keyword) ||
          String(room?.number || '').includes(keyword)
        );
      });
    }

    setFilteredTenants(nextTenants);
  }, [tenants, rooms, selectedFilter, searchText]);

  const roomItems = useMemo(() => {
    const availableRooms = rooms.filter((room) => (
      getRoomAvailableSlots(room, editingTenant?.id) > 0 ||
      room.id === editingTenant?.roomId
    ));

    return availableRooms.map((room) => ({
      label: `Phong ${room.number} - con ${getRoomAvailableSlots(room, editingTenant?.id)} cho`,
      value: room.id,
    }));
  }, [rooms, tenants, editingTenant, getRoomAvailableSlots]);

  const statusItems = [
    { label: 'Dang thue', value: 'active' },
    { label: 'Da roi phong', value: 'inactive' },
  ];

  const resetForm = () => {
    setEditingTenant(null);
    setName('');
    setPhone('');
    setIdCard('');
    setRoomId(roomItems[0]?.value ?? null);
    setStartDate(formatAppDate(new Date()));
    setStatus('active');
  };

  const handleAddTenant = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleEditTenant = (tenant) => {
    setEditingTenant(tenant);
    setName(tenant.name || '');
    setPhone(tenant.phone || '');
    setIdCard(tenant.idCard || '');
    setRoomId(tenant.roomId || null);
    setStartDate(formatAppDate(tenant.startDate) || formatAppDate(new Date()));
    setStatus(tenant.status || 'active');
    setModalVisible(true);
  };

  const handleSaveTenant = async () => {
    if (!name || !phone || !idCard || !roomId || !startDate) {
      Alert.alert('Thieu thong tin', 'Vui long dien day du thong tin.');
      return;
    }

    try {
      const payload = { name, phone, idCard, roomId, startDate, status };
      if (editingTenant) {
        await updateTenant(editingTenant.id, payload);
      } else {
        await addTenant(payload);
      }
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Khong the luu', error.message || 'Da co loi xay ra.');
    }
  };

  const handleDeleteTenant = async () => {
    await deleteTenant(deletingTenantId);
    setConfirmVisible(false);
    setDeletingTenantId(null);
  };

  return (
    <View style={styles.container}>
      <Header title="Quan ly khach thue" showNotification={false} />

      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tim theo ten, phong, so dien thoai..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <FilterBar
        filters={tenantFilters}
        selectedValue={selectedFilter}
        onChange={setSelectedFilter}
      />

      <FlatList
        data={filteredTenants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TenantCard
            tenant={item}
            room={getRoomById(item.roomId)}
            onView={() => navigation.navigate('TenantDetail', { tenantId: item.id })}
            onEdit={() => handleEditTenant(item)}
            onDelete={() => {
              setDeletingTenantId(item.id);
              setConfirmVisible(true);
            }}
          />
        )}
        ListEmptyComponent={(
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-search-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>Khong tim thay khach thue phu hop</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <FormModal
        visible={modalVisible}
        title={editingTenant ? 'Chinh sua khach thue' : 'Them khach thue'}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSaveTenant}
      >
        <TextInputField
          label="Ho ten"
          value={name}
          onChangeText={setName}
          placeholder="Nguyen Van A"
          icon="account"
        />
        <TextInputField
          label="So dien thoai"
          value={phone}
          onChangeText={setPhone}
          placeholder="0901234567"
          icon="phone"
          keyboardType="phone-pad"
        />
        <TextInputField
          label="CCCD/CMND"
          value={idCard}
          onChangeText={setIdCard}
          placeholder="012345678901"
          icon="card-account-details-outline"
          keyboardType="numeric"
        />
        <SelectField
          label="Phong thue"
          value={roomId}
          onValueChange={setRoomId}
          items={roomItems}
          placeholder="Chon phong"
          icon="home-city"
        />
        <DatePickerField
          label="Ngay bat dau thue"
          value={startDate}
          onChangeText={setStartDate}
          placeholder="Chon ngay bat dau"
          icon="calendar-start"
        />
        <SelectField
          label="Trang thai"
          value={status}
          onValueChange={setStatus}
          items={statusItems}
          placeholder="Chon trang thai"
          icon="toggle-switch"
        />
      </FormModal>

      <ConfirmModal
        visible={confirmVisible}
        title="Xoa khach thue"
        message="Ban chac chan muon xoa khach thue nay?"
        type="danger"
        confirmText="Xoa"
        cancelText="Huy"
        onConfirm={handleDeleteTenant}
        onCancel={() => {
          setConfirmVisible(false);
          setDeletingTenantId(null);
        }}
      />

      <FloatingActionButton onPress={handleAddTenant} />
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
    color: '#1F2937',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 96,
    paddingTop: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 72,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
