import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../context/DataContext';
import { Header, FilterBar, FloatingActionButton } from '../components/Common';
import { InvoiceCard } from '../components/Card';
import { FormModal, TextInputField, SelectField, ConfirmModal, DatePickerField, MonthPickerField } from '../components/FormComponents';
import { getMonthlyDueDate, parseInvoiceMonth } from '../utils/helpers';

const invoiceFilters = [
  { key: 'all', label: 'Tất cả' },
  { key: 'unpaid', label: 'Chưa trả' },
  { key: 'paid', label: 'Đã trả' },
];

export const InvoiceManagementScreen = ({ navigation }) => {
  const { invoices, rooms, tenants, addInvoice, updateInvoice, deleteInvoice, markInvoiceAsPaid, markInvoiceAsUnpaid } = useContext(DataContext);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Form states
  const [roomId, setRoomId] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [electricity, setElectricity] = useState('');
  const [water, setWater] = useState('');
  const [status, setStatus] = useState('unpaid');

  useEffect(() => {
    filterInvoices();
  }, [invoices, rooms, tenants, selectedFilter, searchText]);

  const getRoomTenants = (targetRoomId) => tenants.filter(tenant =>
    tenant.roomId === targetRoomId &&
    (tenant.status === 'active' || tenant.id === editingInvoice?.tenantId)
  );

  const getTenantById = (targetTenantId) => tenants.find(tenant => tenant.id === targetTenantId);

  const filterInvoices = () => {
    let filtered = invoices;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(invoice => (
        selectedFilter === 'paid'
          ? invoice.status === 'paid'
          : invoice.status !== 'paid'
      ));
    }

    if (searchText) {
      filtered = filtered.filter(invoice => {
        const room = rooms.find(r => r.id === invoice.roomId);
        const tenant = tenants.find(t => t.id === invoice.tenantId);
        return (
          (room && String(room.number).includes(searchText)) ||
          (tenant && String(tenant.name || '').toLowerCase().includes(searchText.toLowerCase()))
        );
      });
    }

    setFilteredInvoices(filtered);
  };

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setRoomId(null);
    setTenantId(null);
    setMonth('');
    setAmount('');
    setElectricity('');
    setWater('');
    setStatus('unpaid');
    setModalVisible(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setRoomId(invoice.roomId);
    setTenantId(invoice.tenantId || null);
    setMonth(invoice.month);
    setAmount(invoice.amount?.toString() || '');
    setElectricity(invoice.electricity?.toString() || '');
    setWater(invoice.water?.toString() || '');
    setStatus(invoice.status === 'paid' ? 'paid' : 'unpaid');
    setModalVisible(true);
  };

  const handleSaveInvoice = async () => {
    if (!roomId || !tenantId || !month || !amount) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const tenant = getTenantById(tenantId);
    if (!tenant || tenant.roomId !== roomId) {
      alert('Vui lòng chọn khách thuê trong phòng');
      return;
    }

    const invoiceMonthDate = parseInvoiceMonth(month);
    const dueDate = tenant?.startDate && invoiceMonthDate
      ? getMonthlyDueDate(tenant.startDate, invoiceMonthDate)
      : new Date().toISOString();

    if (editingInvoice) {
      await updateInvoice(editingInvoice.id, {
        roomId,
        tenantId: tenant.id,
        month,
        amount: parseInt(amount),
        electricity: parseInt(electricity) || 0,
        water: parseInt(water) || 0,
        status,
        dueDate,
        rentalStartDate: tenant.startDate,
      });
    } else {
      await addInvoice({
        roomId,
        tenantId: tenant.id,
        month,
        amount: parseInt(amount),
        electricity: parseInt(electricity) || 0,
        water: parseInt(water) || 0,
        status,
        dueDate,
        rentalStartDate: tenant.startDate,
      });
    }

    setModalVisible(false);
  };

  const handleRoomChange = (nextRoomId) => {
    setRoomId(nextRoomId);
    const roomTenants = getRoomTenants(nextRoomId);
    setTenantId(roomTenants[0]?.id || null);
    const selectedRoom = rooms.find(room => room.id === nextRoomId);
    if (!editingInvoice && selectedRoom?.price) {
      setAmount(selectedRoom.price.toString());
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    await deleteInvoice(invoiceId);
    setConfirmVisible(false);
    setDeletingInvoiceId(null);
  };

  const handleTogglePaymentStatus = async (invoice) => {
    if (invoice.status === 'paid') {
      await markInvoiceAsUnpaid(invoice.id);
      return;
    }

    await markInvoiceAsPaid(invoice.id);
  };

  const renderInvoice = ({ item }) => {
    const room = rooms.find(r => r.id === item.roomId);
    const tenant = tenants.find(t => t.id === item.tenantId);

    return (
      <InvoiceCard
        invoice={item}
        room={room}
        tenant={tenant}
        onEdit={() => handleEditInvoice(item)}
        onDelete={() => {
          setDeletingInvoiceId(item.id);
          setConfirmVisible(true);
        }}
        onPayment={() => handleTogglePaymentStatus(item)}
      />
    );
  };

  const selectableRooms = editingInvoice
    ? rooms
    : rooms.filter(room => getRoomTenants(room.id).length > 0);
  const roomItems = selectableRooms.map(room => {
    const roomTenants = getRoomTenants(room.id);
    const tenantLabel = roomTenants.length > 1
      ? ` - ${roomTenants.length} khách`
      : roomTenants[0] ? ` - ${roomTenants[0].name}` : '';

    return {
      label: `Phòng ${room.number}${tenantLabel}`,
      value: room.id,
    };
  });
  const tenantItems = roomId
    ? getRoomTenants(roomId).map(tenant => ({
        label: tenant.name,
        value: tenant.id,
      }))
    : [];
  const selectedTenantForForm = getTenantById(tenantId);

  return (
    <View style={styles.container}>
      <Header
        title="Danh sách hóa đơn"
        showNotification={false}
      />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo số phòng..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Filter Chips */}
      <FilterBar
        filters={invoiceFilters}
        selectedValue={selectedFilter}
        onChange={setSelectedFilter}
      />

      {/* Invoice List */}
      <FlatList
        data={filteredInvoices}
        renderItem={renderInvoice}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="file-document-off" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>Không tìm thấy hóa đơn nào</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Add Invoice Modal */}
      <FormModal
        visible={modalVisible}
        title={editingInvoice ? 'Chỉnh sửa hóa đơn' : 'Tạo hóa đơn mới'}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSaveInvoice}
      >
        <SelectField
          label="Chọn phòng"
          value={roomId}
          onValueChange={handleRoomChange}
          items={roomItems}
          placeholder="Chọn phòng đang thuê"
          icon="home"
        />

        <SelectField
          label="Chọn khách thuê"
          value={tenantId}
          onValueChange={setTenantId}
          items={tenantItems}
          placeholder="Chọn khách trong phòng"
          icon="account"
        />

        <DatePickerField
          label="Ngày bắt đầu thuê"
          value={selectedTenantForForm?.startDate || ''}
          onChangeText={() => {}}
          placeholder="Chọn phòng để xem ngày thuê"
          icon="calendar-start"
          disabled
        />

        <MonthPickerField
          label="Tháng hóa đơn"
          value={month}
          onChangeText={setMonth}
          placeholder="Chọn tháng hóa đơn"
          icon="calendar-month"
        />

        <TextInputField
          label="Tiền phòng (đ)"
          value={amount}
          onChangeText={setAmount}
          placeholder="3000000"
          icon="currency-usd"
          keyboardType="numeric"
        />

        <TextInputField
          label="Tiền điện (đ)"
          value={electricity}
          onChangeText={setElectricity}
          placeholder="420000"
          icon="lightning-bolt"
          keyboardType="numeric"
        />

        <TextInputField
          label="Tiền nước (đ)"
          value={water}
          onChangeText={setWater}
          placeholder="80000"
          icon="water"
          keyboardType="numeric"
        />

        <SelectField
          label="Trạng thái"
          value={status}
          onValueChange={setStatus}
          items={[
            { label: 'Chưa thanh toán', value: 'unpaid' },
            { label: 'Đã thanh toán', value: 'paid' },
          ]}
          placeholder="Chọn trạng thái"
          icon="alert-circle"
        />
      </FormModal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        visible={confirmVisible}
        title="Xóa hóa đơn"
        message="Bạn có chắc chắn muốn xóa hóa đơn này? Hành động này không thể hoàn tác."
        type="danger"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => handleDeleteInvoice(deletingInvoiceId)}
        onCancel={() => {
          setConfirmVisible(false);
          setDeletingInvoiceId(null);
        }}
      />

      <FloatingActionButton
        onPress={handleAddInvoice}
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
