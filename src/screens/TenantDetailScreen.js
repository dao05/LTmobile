import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../context/DataContext';
import { Header } from '../components/Common';
import { InvoiceCard, ContractCard } from '../components/Card';

export const TenantDetailScreen = ({ navigation, route }) => {
  const { tenantId } = route.params || {};
  const { tenants, rooms, invoices, contracts } = useContext(DataContext);
  const tenant = tenants.find(item => item.id === tenantId);
  const room = rooms.find(item => item.id === tenant?.roomId);
  const tenantInvoices = invoices.filter(item => item.tenantId === tenantId);
  const tenantContracts = contracts.filter(item => item.tenantId === tenantId);

  if (!tenant) {
    return (
      <View style={styles.container}>
        <Header title="Chi tiet khach" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Không tìm thấy khách thuê.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Chi tiết khách"
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.name}>{tenant.name}</Text>
            <Text style={styles.meta}>Phòng {room?.number || tenant.roomNumber || 'N/A'}</Text>
          </View>
        </View>

        <InfoRow icon="phone" label="Điện thoại" value={tenant.phone} />
        <InfoRow icon="card-account-details" label="CCCD / CMND" value={tenant.idCard} />
        <InfoRow icon="calendar" label="Ngày bắt đầu" value={tenant.startDate} />
        <InfoRow icon="check-circle" label="Trạng thái" value={tenant.status === 'active' ? 'Đang thuê' : 'Đã ngừng'} />

        <Text style={styles.sectionTitle}>Hóa đơn</Text>
        {tenantInvoices.length > 0 ? (
          tenantInvoices.map(invoice => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              room={room}
              tenant={tenant}
            />
          ))
        ) : (
          <Text style={styles.mutedText}>Chưa có hóa đơn.</Text>
        )}

        <Text style={styles.sectionTitle}>Hợp đồng</Text>
        {tenantContracts.length > 0 ? (
          tenantContracts.map(contract => (
            <ContractCard
              key={contract.id}
              contract={contract}
              room={room}
              tenant={tenant}
            />
          ))
        ) : (
          <Text style={styles.mutedText}>Chưa có hợp đồng.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={20} color="#6B7280" />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || 'N/A'}</Text>
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
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
  },
  summaryInfo: {
    flex: 1,
  },
  name: {
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
