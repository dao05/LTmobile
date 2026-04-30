import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../context/DataContext';
import { Header } from '../components/Common';
import { TenantCard, InvoiceCard, ContractCard } from '../components/Card';

export const RoomDetailScreen = ({ navigation, route }) => {
  const { roomId } = route.params || {};
  const { rooms, tenants, invoices, contracts } = useContext(DataContext);
  const room = rooms.find(item => item.id === roomId);
  const roomTenants = tenants.filter(item => item.roomId === roomId && item.status === 'active');
  const roomInvoices = invoices.filter(item => item.roomId === roomId);
  const roomContracts = contracts.filter(item => item.roomId === roomId);

  if (!room) {
    return (
      <View style={styles.container}>
        <Header title="Chi tiet phong" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Không tìm thấy phòng.</Text>
        </View>
      </View>
    );
  }

  const capacity = Math.max(parseInt(room.capacity, 10) || 1, 1);
  const occupiedSlots = roomTenants.length;
  const availableSlots = Math.max(capacity - occupiedSlots, 0);

  return (
    <View style={styles.container}>
      <Header
        title={`Phòng ${room.number}`}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <MaterialCommunityIcons name="home-city" size={40} color="#3B82F6" />
          <View style={styles.summaryInfo}>
            <Text style={styles.title}>Phòng {room.number}</Text>
            <Text style={styles.meta}>{room.type}</Text>
          </View>
        </View>

        <InfoRow icon="cash" label="Giá thuê" value={`${(room.price || 0).toLocaleString('vi-VN')}d`} />
        <InfoRow icon="ruler-square" label="Diện tích" value={`${room.area || 0}m2`} />
        <InfoRow icon="account-group" label="Sức chứa" value={`${occupiedSlots}/${capacity} người`} />
        <InfoRow icon="account-plus" label="Còn trống" value={`${availableSlots} chỗ`} />
        <InfoRow icon="layers" label="Tầng" value={String(room.floor || 1)} />
        <InfoRow icon="information" label="Trạng thái" value={getStatusLabel(room.status)} />

        <Text style={styles.sectionTitle}>Khách đang thuê</Text>
        {roomTenants.length > 0 ? (
          roomTenants.map(tenant => (
            <TenantCard key={tenant.id} tenant={tenant} room={room} />
          ))
        ) : (
          <Text style={styles.mutedText}>Phòng đang trống.</Text>
        )}

        <Text style={styles.sectionTitle}>Hóa đơn</Text>
        {roomInvoices.length > 0 ? (
          roomInvoices.map(invoice => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              room={room}
              tenant={tenants.find(item => item.id === invoice.tenantId)}
            />
          ))
        ) : (
          <Text style={styles.mutedText}>Chưa có hóa đơn.</Text>
        )}

        <Text style={styles.sectionTitle}>Hợp đồng</Text>
        {roomContracts.length > 0 ? (
          roomContracts.map(contract => (
            <ContractCard
              key={contract.id}
              contract={contract}
              room={room}
              tenant={tenants.find(item => item.id === contract.tenantId)}
            />
          ))
        ) : (
          <Text style={styles.mutedText}>Chưa có hợp đồng.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'occupied':
      return 'Đang thuê';
    case 'available':
      return 'Trống';
    case 'under_maintenance':
      return 'Bảo trì';
    default:
      return status || 'N/A';
  }
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={20} color="#6B7280" />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    paddingVertical: 12,
    paddingBottom: 32,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 14,
    borderRadius: 8,
    gap: 12,
  },
  summaryInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  infoLabel: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionTitle: {
    marginHorizontal: 12,
    marginTop: 14,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  mutedText: {
    marginHorizontal: 12,
    color: '#6B7280',
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#6B7280',
  },
});
