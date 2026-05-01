import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../context/DataContext';
import { Header, StatCard } from '../components/Common';

export const ReportsScreen = ({ navigation }) => {
  const { getDashboardStats, invoices, rooms, tenants, contracts } = useContext(DataContext);
  const stats = getDashboardStats();

  const paidInvoices = invoices.filter(i => i.status === 'paid').length;
  const unpaidInvoices = invoices.filter(i => i.status !== 'paid').length;
  const occupancyRate = stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0;
  const activeContracts = contracts.filter(c => c.status === 'active').length;

  return (
    <View style={styles.container}>
      <Header
        title="Báo cáo doanh thu"
        showNotification={false}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng quan</Text>
          
          <StatCard
            label="Tổng doanh thu"
            value={stats.totalRevenue?.toLocaleString('vi-VN') + 'đ' || '0đ'}
            icon={<MaterialCommunityIcons name="cash-multiple" size={28} color="#10B981" />}
            color="#10B981"
          />

          <StatCard
            label="Tỷ lệ lấp đầy"
            value={occupancyRate + '%'}
            icon={<MaterialCommunityIcons name="percent" size={28} color="#3B82F6" />}
            color="#3B82F6"
          />

          <StatCard
            label="Số hợp đồng hoạt động"
            value={activeContracts}
            icon={<MaterialCommunityIcons name="file-document-edit-outline" size={28} color="#8B5CF6" />}
            color="#8B5CF6"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phòng</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statGridItem}>
              <Text style={styles.statLabel}>Tổng phòng</Text>
              <Text style={styles.statValue}>{stats.totalRooms}</Text>
            </View>
            <View style={styles.statGridItem}>
              <Text style={styles.statLabel}>Đã thuê</Text>
              <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.occupiedRooms}</Text>
            </View>
            <View style={styles.statGridItem}>
              <Text style={styles.statLabel}>Trống</Text>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>{stats.availableRooms}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hóa đơn</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statGridItem}>
              <Text style={styles.statLabel}>Đã thanh toán</Text>
              <Text style={[styles.statValue, { color: '#10B981' }]}>{paidInvoices}</Text>
            </View>
            <View style={styles.statGridItem}>
              <Text style={styles.statLabel}>Chưa thanh toán</Text>
              <Text style={[styles.statValue, { color: '#EF4444' }]}>{unpaidInvoices}</Text>
            </View>
            <View style={styles.statGridItem}>
              <Text style={styles.statLabel}>Tổng cộng</Text>
              <Text style={styles.statValue}>{invoices.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khách hàng</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statGridItem}>
              <Text style={styles.statLabel}>Tổng khách</Text>
              <Text style={styles.statValue}>{stats.totalTenants}</Text>
            </View>
            <View style={styles.statGridItem}>
              <Text style={styles.statLabel}>Hoạt động</Text>
              <Text style={[styles.statValue, { color: '#10B981' }]}>
                {tenants.filter(t => t.status === 'active').length}
              </Text>
            </View>
            <View style={styles.statGridItem}>
              <Text style={styles.statLabel}>Đã thôi</Text>
              <Text style={[styles.statValue, { color: '#6B7280' }]}>
                {tenants.filter(t => t.status === 'inactive').length}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thống kê tài chính</Text>
          
          <View style={styles.financialCard}>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Tổng doanh thu</Text>
              <Text style={styles.financialValue}>{stats.totalRevenue?.toLocaleString('vi-VN') || '0'}đ</Text>
            </View>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Nợ chưa thu</Text>
              <Text style={[styles.financialValue, { color: '#EF4444' }]}>
                {invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + (i.amount || 0), 0).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: 12,
  },
  section: {
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statGridItem: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 6,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  financialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  financialLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
    minWidth: 0,
  },
  financialValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    flexShrink: 0,
    marginLeft: 12,
  },
});
