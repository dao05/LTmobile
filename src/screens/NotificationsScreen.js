import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../context/DataContext';
import { Header, NotificationAlert } from '../components/Common';

export const NotificationsScreen = ({ navigation }) => {
  const { getExpiringContracts, getOverdueInvoices, rooms } = useContext(DataContext);
  const expiringContracts = getExpiringContracts(30);
  const overdueInvoices = getOverdueInvoices();

  const notifications = [
    ...expiringContracts.map(contract => ({
      id: `contract-${contract.id}`,
      type: 'contract',
      title: `Hợp đồng sắp hết hạn`,
      message: `Hợp đồng của khách thuê sẽ kết thúc vào ${contract.endDate}`,
      color: '#F59E0B',
      icon: 'file-document-edit-outline',
    })),
    ...overdueInvoices.map(invoice => {
      const room = rooms.find(item => item.id === invoice.roomId);
      const roomNumber = room?.number || invoice.roomNumber || 'N/A';

      return {
        id: `invoice-${invoice.id}`,
        type: 'invoice',
        title: `Hóa đơn quá hạn`,
        message: `Phòng ${roomNumber} chưa thanh toán hóa đơn tháng ${invoice.month}`,
        color: '#EF4444',
        icon: 'file-document-alert',
      };
    }),
  ];

  const renderNotification = ({ item }) => (
    <View style={[styles.notificationItem, { borderLeftColor: item.color, borderLeftWidth: 4 }]}>
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      <Pressable style={styles.closeButton}>
        <MaterialCommunityIcons name="close" size={20} color="#9CA3AF" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Thông báo"
        showNotification={false}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="bell-off" size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>Không có thông báo nào</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContent: {
    paddingVertical: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  message: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 18,
  },
  closeButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
