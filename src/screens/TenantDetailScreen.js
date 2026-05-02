import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../context/DataContext';
import { Header } from '../components/Common';
import { ContractCard, InvoiceCard } from '../components/Card';
import { formatAppDate } from '../utils/helpers';

export const TenantDetailScreen = ({ navigation, route }) => {
  const { tenantId } = route.params || {};
  const { getTenantById, getRoomById, getInvoicesByTenant, getContractsByTenant } = useContext(DataContext);
  const tenant = getTenantById(tenantId);

  if (!tenant) {
    return (
      <View style={styles.container}>
        <Header title="Chi tiet khach" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Khong tim thay khach thue.</Text>
        </View>
      </View>
    );
  }

  const room = getRoomById(tenant.roomId);
  const invoices = getInvoicesByTenant(tenant.id);
  const contracts = getContractsByTenant(tenant.id);

  return (
    <View style={styles.container}>
      <Header
        title="Thong tin khach thue"
        subtitle={`Phong ${room?.number || 'N/A'}`}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name="account" size={34} color="#2563EB" />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.name}>{tenant.name}</Text>
            <Text style={styles.status}>{tenant.status === 'active' ? 'Dang thue' : 'Da roi phong'}</Text>
          </View>
        </View>

        <InfoRow icon="phone" label="So dien thoai" value={tenant.phone || 'Chua cap nhat'} />
        <InfoRow icon="card-account-details-outline" label="CCCD/CMND" value={tenant.idCard || 'Chua cap nhat'} />
        <InfoRow icon="home-city" label="Phong" value={room ? `Phong ${room.number} - ${room.type}` : 'Chua gan phong'} />
        <InfoRow icon="calendar-start" label="Ngay bat dau" value={formatAppDate(tenant.startDate) || 'N/A'} />

        <Text style={styles.sectionTitle}>Hoa don lien quan</Text>
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              room={room}
              tenant={tenant}
            />
          ))
        ) : (
          <Text style={styles.mutedText}>Chua co hoa don.</Text>
        )}

        <Text style={styles.sectionTitle}>Hop dong lien quan</Text>
        {contracts.length > 0 ? (
          contracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              room={room}
              tenant={tenant}
            />
          ))
        ) : (
          <Text style={styles.mutedText}>Chua co hop dong.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={20} color="#6B7280" />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 14,
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
  },
  heroInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  status: {
    fontSize: 13,
    color: '#6B7280',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 12,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  sectionTitle: {
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  mutedText: {
    marginHorizontal: 12,
    color: '#6B7280',
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
