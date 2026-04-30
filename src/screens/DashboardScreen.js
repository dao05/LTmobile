import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import { Header, StatCard, NotificationAlert, FloatingActionButton } from '../components/Common';

export const DashboardScreen = ({ navigation }) => {
  const { userData, userRole } = useContext(AuthContext);
  const { getDashboardStats, getExpiringContracts, getOverdueInvoices, rooms, tenants, invoices } = useContext(DataContext);
  const [stats, setStats] = useState({});
  const [expiringContracts, setExpiringContracts] = useState([]);
  const [overdueInvoices, setOverdueInvoices] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [rooms, tenants, invoices]);

  const loadDashboardData = () => {
    setStats(getDashboardStats());
    setExpiringContracts(getExpiringContracts(30));
    setOverdueInvoices(getOverdueInvoices());
  };

  const quickAccessItems = userRole === 'admin' 
    ? [
        { name: 'Phòng', icon: 'home-city', route: 'RoomManagement', color: '#3B82F6' },
        { name: 'Khách', icon: 'account-multiple', route: 'TenantManagement', color: '#10B981' },
        { name: 'Hóa đơn', icon: 'file-document', route: 'InvoiceManagement', color: '#F59E0B' },
        { name: 'Hợp đồng', icon: 'file-document-edit-outline', route: 'ContractManagement', color: '#8B5CF6' },
        { name: 'Báo cáo', icon: 'chart-line', route: 'Reports', color: '#EC4899' },
        { name: 'Quyền', icon: 'shield-account', route: 'UserRoleManagement', color: '#06B6D4' },
      ]
    : [
        { name: 'Phòng', icon: 'home-city', route: 'RoomManagement', color: '#3B82F6' },
        { name: 'Khách', icon: 'account-multiple', route: 'TenantManagement', color: '#10B981' },
        { name: 'Hóa đơn', icon: 'file-document', route: 'InvoiceManagement', color: '#F59E0B' },
        { name: 'Hợp đồng', icon: 'file-document-edit-outline', route: 'ContractManagement', color: '#8B5CF6' },
        { name: 'Báo cáo', icon: 'chart-line', route: 'Reports', color: '#EC4899' },
      ];
  const getRoomNumber = (roomId) => rooms.find(item => item.id === roomId)?.number || 'N/A';
  const overdueRoomNumbers = [
    ...new Set(overdueInvoices.map(invoice => getRoomNumber(invoice.roomId))),
  ].join(', ');
  const firstExpiringRoomNumber = getRoomNumber(expiringContracts[0]?.roomId);

  return (
    <View style={styles.container}>
      <Header
        title="Sanctuary"
        showNotification={true}
        notificationCount={expiringContracts.length + overdueInvoices.length}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <Avatar.Icon size={56} icon="account-circle" color="#FFFFFF" style={{ backgroundColor: '#3B82F6' }} />
          <View style={styles.userInfo}>
            <Text style={styles.userGreeting}>Xin chào,</Text>
            <Text style={styles.userName}>{userData?.name || 'Người dùng'}</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('UserProfile')} style={styles.profileButton}>
            <MaterialCommunityIcons name="cog" size={24} color="#6B7280" />
          </Pressable>
        </View>

        {/* Quick Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Thông tin nhanh</Text>
          <StatCard
            label="Doanh thu tháng"
            value={stats.totalRevenue?.toLocaleString('vi-VN') + 'đ' || '0đ'}
            icon={<MaterialCommunityIcons name="cash-multiple" size={28} color="#3B82F6" />}
            color="#3B82F6"
            onPress={() => navigation.navigate('Reports')}
          />
          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <StatCard
                label="Tổng số phòng"
                value={stats.totalRooms || '0'}
                color="#10B981"
                onPress={() => navigation.navigate('RoomManagement')}
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard
                label="Phòng trống"
                value={stats.availableRooms || '0'}
                color="#F59E0B"
                onPress={() => navigation.navigate('RoomManagement')}
              />
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <StatCard
                label="Khách thuê"
                value={stats.totalTenants || '0'}
                color="#8B5CF6"
                onPress={() => navigation.navigate('TenantManagement')}
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard
                label="Hóa đơn chưa trả"
                value={stats.unpaidInvoices || '0'}
                color="#EF4444"
                onPress={() => navigation.navigate('InvoiceManagement')}
              />
            </View>
          </View>
        </View>

        {/* Quick Access Section */}
        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Truy cập nhanh</Text>
          <View style={styles.quickAccessGrid}>
            {quickAccessItems.map((item, index) => (
              <Pressable
                key={index}
                style={styles.quickAccessItem}
                onPress={() => navigation.navigate(item.route)}
              >
                <View style={[styles.quickAccessIcon, { backgroundColor: item.color + '20' }]}>
                  <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.quickAccessLabel}>{item.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Notifications/Alerts Section */}
        {(expiringContracts.length > 0 || overdueInvoices.length > 0) && (
          <View style={styles.alertsSection}>
            <Text style={styles.sectionTitle}>Nhắc nhở</Text>
            {expiringContracts.length > 0 && (
              <NotificationAlert
                type="warning"
                title={`Hợp đồng phòng ${firstExpiringRoomNumber} sắp hết hạn`}
                message={`Còn ${Math.ceil((new Date(expiringContracts[0]?.endDate) - new Date()) / (1000 * 60 * 60 * 24))} ngày nữa. Hãy liên hệ khách thuê để gia hạn.`}
                actionText="GIA HẠN NGAY"
                onActionPress={() => navigation.navigate('ContractManagement')}
              />
            )}
            {overdueInvoices.length > 0 && (
              <NotificationAlert
                type="warning"
                title={`${overdueInvoices.length} hóa đơn quá hạn thanh toán`}
                message={`Phòng ${overdueRoomNumbers} chưa thanh toán.`}
                actionText="NHẮC NỢ"
                onActionPress={() => navigation.navigate('InvoiceManagement')}
              />
            )}
          </View>
        )}

        {/* Quick Report Section */}
        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>Báo cáo</Text>
          <Pressable style={styles.reportCard} onPress={() => navigation.navigate('Reports')}>
            <View style={styles.reportHeader}>
              <MaterialCommunityIcons name="chart-box" size={40} color="#3B82F6" />
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>Tổng quan nhanh</Text>
           
              </View>
            </View>
            <Pressable style={styles.reportButton} onPress={() => navigation.navigate('Reports')}>
              <Text style={styles.reportButtonText}>Xem báo cáo</Text>
            </Pressable>
          </Pressable>
        </View>
      </ScrollView>

      <FloatingActionButton
        onPress={() => {
          // Show menu for quick add
          navigation.navigate('RoomManagement');
        }}
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
  content: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  userGreeting: {
    fontSize: 12,
    color: '#6B7280',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  profileButton: {
    padding: 8,
  },
  statsSection: {
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  quickAccessSection: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAccessItem: {
    width: '31%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAccessIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  alertsSection: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  reportSection: {
    paddingHorizontal: 12,
    marginBottom: 110,
  },
  reportCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  reportDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  reportButton: {
    backgroundColor: '#0052CC',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  reportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
