import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../context/DataContext';
import { Header, FilterBar, FloatingActionButton } from '../components/Common';
import { ContractCard } from '../components/Card';
import { FormModal, TextInputField, SelectField, ConfirmModal, DatePickerField } from '../components/FormComponents';
import { formatAppDate, parseAppDate } from '../utils/helpers';

const contractFilters = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Còn hạn' },
  { key: 'expiring', label: 'Sắp hết' },
  { key: 'expired', label: 'Hết hạn' },
];

export const ContractManagementScreen = ({ navigation }) => {
  const { contracts, rooms, tenants, addContract, updateContract, deleteContract, renewContract } = useContext(DataContext);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [renewModalVisible, setRenewModalVisible] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletingContractId, setDeletingContractId] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Form states
  const [tenantId, setTenantId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState('');
  const [renewDays, setRenewDays] = useState('365');

  useEffect(() => {
    filterContracts();
  }, [contracts, selectedFilter, searchText]);

  const filterContracts = () => {
    let filtered = contracts;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === selectedFilter);
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(contract => {
        const tenant = tenants.find(t => t.id === contract.tenantId);
        return tenant && tenant.name.toLowerCase().includes(searchLower);
      });
    }

    setFilteredContracts(filtered);
  };

  const handleAddContract = () => {
    setEditingContract(null);
    setTenantId(null);
    setRoomId(null);
    setStartDate('');
    setEndDate('');
    setAmount('');
    setModalVisible(true);
  };

  const handleEditContract = (contract) => {
    setEditingContract(contract);
    setTenantId(contract.tenantId);
    setRoomId(contract.roomId);
    setStartDate(contract.startDate);
    setEndDate(contract.endDate);
    setAmount(contract.amount?.toString() || '');
    setModalVisible(true);
  };

  const handleSaveContract = async () => {
    const tenant = tenants.find(item => item.id === tenantId);
    const contractStartDate = tenant?.startDate || startDate;

    if (!tenantId || !roomId || !contractStartDate || !endDate || !amount) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (editingContract) {
      await updateContract(editingContract.id, {
        tenantId,
        roomId,
        startDate: contractStartDate,
        endDate,
        amount: parseInt(amount),
      });
    } else {
      await addContract({
        tenantId,
        roomId,
        startDate: contractStartDate,
        endDate,
        amount: parseInt(amount),
      });
    }

    setModalVisible(false);
  };

  const handleTenantChange = (value) => {
    setTenantId(value);
    const tenant = tenants.find(t => t.id === value);
    const room = rooms.find(r => r.id === tenant?.roomId);
    setRoomId(tenant?.roomId || null);
    setStartDate(tenant?.startDate || '');
    if (tenant?.startDate && !endDate) {
      const parsedStartDate = parseAppDate(tenant.startDate);
      if (parsedStartDate) {
        setEndDate(formatAppDate(new Date(parsedStartDate.getFullYear() + 1, parsedStartDate.getMonth(), parsedStartDate.getDate())));
      }
    }
    if (room && !amount) {
      setAmount(room.price?.toString() || '');
    }
  };

  const handleRenewContract = async (contract) => {
    setEditingContract(contract);
    setRenewDays('365');
    setRenewModalVisible(true);
  };

  const handleConfirmRenew = async () => {
    if (!editingContract || !renewDays) {
      alert('Vui lòng nhập số ngày gia hạn');
      return;
    }

    const currentEndDate = parseAppDate(editingContract.endDate);
    if (!currentEndDate) {
      alert('Ngày kết thúc hợp đồng không hợp lệ');
      return;
    }
    const newEndDate = new Date(currentEndDate.getTime() + parseInt(renewDays) * 24 * 60 * 60 * 1000);
    await renewContract(editingContract.id, formatAppDate(newEndDate));
    setRenewModalVisible(false);
    setEditingContract(null);
  };

  const handleDeleteContract = async (contractId) => {
    await deleteContract(contractId);
    setConfirmVisible(false);
    setDeletingContractId(null);
  };

  const renderContract = ({ item }) => {
    const tenant = tenants.find(t => t.id === item.tenantId);
    const room = rooms.find(r => r.id === item.roomId);

    return (
      <ContractCard
        contract={item}
        tenant={tenant}
        room={room}
        onEdit={() => handleEditContract(item)}
        onDelete={() => {
          setDeletingContractId(item.id);
          setConfirmVisible(true);
        }}
        onRenew={() => handleRenewContract(item)}
      />
    );
  };

  const tenantItems = tenants.map(t => ({ label: t.name, value: t.id }));
  const roomItems = rooms.map(r => ({ label: `Phong ${r.number} - ${r.type}`, value: r.id }));

  return (
    <View style={styles.container}>
      <Header
        title="Danh sách hợp đồng"
        showNotification={false}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm hợp đồng..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Filter Chips */}
      <FilterBar
        filters={contractFilters}
        selectedValue={selectedFilter}
        onChange={setSelectedFilter}
      />

      {/* Contract List */}
      <FlatList
        data={filteredContracts}
        renderItem={renderContract}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="file-document-edit-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>Không tìm thấy hợp đồng nào</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Add/Edit Contract Modal */}
      <FormModal
        visible={modalVisible}
        title={editingContract ? 'Chỉnh sửa hợp đồng' : 'Tạo hợp đồng mới'}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSaveContract}
      >
        <SelectField
          label="Chọn khách thuê"
          value={tenantId}
          onValueChange={handleTenantChange}
          items={tenantItems}
          placeholder="Chọn khách thuê"
          icon="account"
        />

        <SelectField
          label="Phong"
          value={roomId}
          onValueChange={setRoomId}
          items={roomItems}
          placeholder="Chọn phòng"
          icon="home"
        />

        <DatePickerField
          label="Ngày bắt đầu thuê"
          value={startDate}
          onChangeText={setStartDate}
          placeholder="Chọn khách thuê để lấy ngày bắt đầu"
          icon="calendar-start"
          disabled={!!tenantId}
        />

        <DatePickerField
          label="Ngày kết thúc"
          value={endDate}
          onChangeText={setEndDate}
          placeholder="Chọn ngày kết thúc"
          icon="calendar-end"
        />

        <TextInputField
          label="Tiền phòng hàng tháng (đ)"
          value={amount}
          onChangeText={setAmount}
          placeholder="3000000"
          icon="currency-usd"
          keyboardType="numeric"
        />
      </FormModal>

      {/* Renew Contract Modal */}
      <FormModal
        visible={renewModalVisible}
        title="Gia hạn hợp đồng"
        onClose={() => setRenewModalVisible(false)}
        onSubmit={handleConfirmRenew}
      >
        <TextInputField
          label="Số ngày gia hạn"
          value={renewDays}
          onChangeText={setRenewDays}
          placeholder="365"
          icon="calendar-plus"
          keyboardType="numeric"
        />
      </FormModal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        visible={confirmVisible}
        title="Xóa hợp đồng"
        message="Bạn có chắc chắn muốn xóa hợp đồng này? Hành động này không thể hoàn tác."
        type="danger"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => handleDeleteContract(deletingContractId)}
        onCancel={() => {
          setConfirmVisible(false);
          setDeletingContractId(null);
        }}
      />

      <FloatingActionButton
        onPress={handleAddContract}
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
