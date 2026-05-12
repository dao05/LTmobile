import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const Card = ({ title, subtitle, onPress, rightActions, children, style }) => {
  return (
    <View style={[styles.card, style]}>
      <Pressable style={styles.container} onPress={onPress}>
        <View style={styles.content}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {children}
        </View>
        {rightActions && (
          <View style={styles.actions}>
            {rightActions}
          </View>
        )}
      </Pressable>
    </View>
  );
};

export const RoomCard = ({ room, onPress, onEdit, onDelete, onView }) => {
  const capacity = Math.max(parseInt(room.capacity, 10) || 1, 1);
  const occupiedSlots = Math.max(parseInt(room.occupiedSlots, 10) || 0, 0);
  const availableSlots = room.availableSlots !== undefined
    ? Math.max(parseInt(room.availableSlots, 10) || 0, 0)
    : Math.max(capacity - occupiedSlots, 0);

  const getStatusColor = () => {
    if (room.status === 'under_maintenance') return '#EF4444';
    if (occupiedSlots > 0 && availableSlots > 0) return '#F59E0B';
    if (occupiedSlots > 0) return '#10B981';
    return '#3B82F6';
  };

  const getStatusLabel = () => {
    if (room.status === 'under_maintenance') return 'BẢO TRÌ';
    if (occupiedSlots > 0 && availableSlots > 0) return `CÒN ${availableSlots} CHỖ`;
    if (occupiedSlots > 0) return 'ĐÃ ĐẦY';
    return 'TRỐNG';
  };

  return (
    <Card
      title={`Phòng ${room.number}`}
      onPress={onPress}
      rightActions={
        <View style={styles.actionButtons}>
          {onView && (
            <Pressable onPress={onView} style={styles.iconButton}>
              <MaterialCommunityIcons name="eye" size={24} color="#3B82F6" />
            </Pressable>
          )}
          {onEdit && (
            <Pressable onPress={onEdit} style={styles.iconButton}>
              <MaterialCommunityIcons name="pencil" size={24} color="#10B981" />
            </Pressable>
          )}
          {onDelete && (
            <Pressable onPress={onDelete} style={styles.iconButton}>
              <MaterialCommunityIcons name="delete" size={24} color="#EF4444" />
            </Pressable>
          )}
        </View>
      }
      style={{ marginBottom: 8 }}
    >
      <View style={styles.roomDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Loại phòng:</Text>
          <Text style={styles.detailValue}>{room.type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Giá thuê:</Text>
          <Text style={styles.detailValue}>{room.price?.toLocaleString('vi-VN')}đ</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Diện tích:</Text>
          <Text style={styles.detailValue}>{room.area}m²</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Sức chứa:</Text>
          <Text style={styles.detailValue}>{occupiedSlots}/{capacity} người</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Còn trống:</Text>
          <Text style={styles.detailValue}>{availableSlots} chỗ</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20', borderColor: getStatusColor(), borderWidth: 1 }]}>
          <Text style={[styles.statusLabel, { color: getStatusColor() }]}>{getStatusLabel()}</Text>
        </View>
      </View>
    </Card>
  );
};

export const TenantCard = ({ tenant, room, onPress, onEdit, onDelete, onView }) => {
  const roomNumber = room?.number || tenant.roomNumber || 'N/A';

  return (
    <Card
      title={tenant.name}
      subtitle={`Phòng ${roomNumber}`}
      onPress={onPress}
      rightActions={
        <View style={styles.actionButtons}>
          {onView && (
            <Pressable onPress={onView} style={styles.iconButton}>
              <MaterialCommunityIcons name="information" size={24} color="#3B82F6" />
            </Pressable>
          )}
          {onEdit && (
            <Pressable onPress={onEdit} style={styles.iconButton}>
              <MaterialCommunityIcons name="pencil" size={24} color="#10B981" />
            </Pressable>
          )}
          {onDelete && (
            <Pressable onPress={onDelete} style={styles.iconButton}>
              <MaterialCommunityIcons name="delete" size={24} color="#EF4444" />
            </Pressable>
          )}
        </View>
      }
      style={{ marginBottom: 8 }}
    >
      <View style={styles.tenantDetails}>
        <View style={styles.tenantDetailRow}>
          <MaterialCommunityIcons name="phone" size={16} color="#6B7280" />
          <Text style={styles.tenantDetailText}>{tenant.phone}</Text>
        </View>
        <View style={styles.tenantDetailRow}>
          <MaterialCommunityIcons name="card-account-details" size={16} color="#6B7280" />
          <Text style={styles.tenantDetailText}>CCCD: {tenant.idCard}</Text>
        </View>
        <View style={styles.tenantDetailRow}>
          <MaterialCommunityIcons name="calendar" size={16} color="#6B7280" />
          <Text style={styles.tenantDetailText}>Bắt đầu: {tenant.startDate}</Text>
        </View>
      </View>
    </Card>
  );
};

export const InvoiceCard = ({ invoice, room, tenant, onPress, onEdit, onDelete, onPayment }) => {
  const getStatusColor = () => {
    return invoice.status === 'paid' ? '#10B981' : '#F59E0B';
  };

  const getStatusLabel = () => {
    return invoice.status === 'paid' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN';
  };

  const hasActions = onPayment || onEdit || onDelete;

  return (
    <Card
      title={`Phòng ${room?.number || 'N/A'}`}
      subtitle={tenant ? `${tenant.name} - Hóa đơn ${invoice.month}` : `Hóa đơn ${invoice.month}`}
      onPress={onPress}
      style={{ marginBottom: 8 }}
    >
      <View style={styles.invoiceDetails}>
        <View style={styles.invoiceHeader}>
          <View style={styles.invoiceSummary}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20', borderColor: getStatusColor(), borderWidth: 1 }]}>
              <Text style={[styles.statusLabel, { color: getStatusColor() }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>
                {getStatusLabel()}
              </Text>
            </View>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.76}>
              {(invoice.amount || 0).toLocaleString('vi-VN')}đ
            </Text>
          </View>
          {hasActions && (
            <View style={styles.invoiceActionButtons}>
              {onPayment && (
                <Pressable onPress={onPayment} style={styles.invoiceIconButton}>
                  <MaterialCommunityIcons
                    name={invoice.status === 'paid' ? 'undo' : 'credit-card'}
                    size={22}
                    color={invoice.status === 'paid' ? '#F59E0B' : '#10B981'}
                  />
                </Pressable>
              )}
              {onEdit && (
                <Pressable onPress={onEdit} style={styles.invoiceIconButton}>
                  <MaterialCommunityIcons name="pencil" size={22} color="#10B981" />
                </Pressable>
              )}
              {onDelete && (
                <Pressable onPress={onDelete} style={styles.invoiceIconButton}>
                  <MaterialCommunityIcons name="delete" size={22} color="#EF4444" />
                </Pressable>
              )}
            </View>
          )}
        </View>
        {tenant && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Khách thuê:</Text>
            <Text style={styles.detailValue}>{tenant.name}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tiền phòng:</Text>
          <Text style={styles.detailValue}>{(invoice.amount || 0).toLocaleString('vi-VN')}đ</Text>
        </View>
        {invoice.electricity > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tiền điện:</Text>
            <Text style={styles.detailValue}>{(invoice.electricity || 0).toLocaleString('vi-VN')}đ</Text>
          </View>
        )}
        {invoice.water > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tiền nước:</Text>
            <Text style={styles.detailValue}>{(invoice.water || 0).toLocaleString('vi-VN')}đ</Text>
          </View>
        )}
      </View>
    </Card>
  );
};

export const ContractCard = ({ contract, tenant, room, onPress, onEdit, onDelete, onRenew }) => {
  const getStatusColor = () => {
    switch (contract.status) {
      case 'active':
        return '#10B981';
      case 'expired':
        return '#EF4444';
      case 'expiring':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = () => {
    switch (contract.status) {
      case 'active':
        return 'CÒN HẠN';
      case 'expired':
        return 'HẾT HẠN';
      case 'expiring':
        return 'SẮP HẾT HẠN';
      default:
        return contract.status;
    }
  };

  return (
    <Card
      title={tenant?.name || 'N/A'}
      subtitle={`Phòng ${room?.number || 'N/A'}`}
      onPress={onPress}
      rightActions={
        <View style={styles.actionButtons}>
          {contract.status === 'active' && onRenew && (
            <Pressable onPress={onRenew} style={styles.iconButton}>
              <MaterialCommunityIcons name="refresh" size={24} color="#3B82F6" />
            </Pressable>
          )}
          {onEdit && (
            <Pressable onPress={onEdit} style={styles.iconButton}>
              <MaterialCommunityIcons name="pencil" size={24} color="#10B981" />
            </Pressable>
          )}
          {onDelete && (
            <Pressable onPress={onDelete} style={styles.iconButton}>
              <MaterialCommunityIcons name="delete" size={24} color="#EF4444" />
            </Pressable>
          )}
        </View>
      }
      style={{ marginBottom: 8 }}
    >
      <View style={styles.contractDetails}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20', borderColor: getStatusColor(), borderWidth: 1, alignSelf: 'flex-start' }]}>
          <Text style={[styles.statusLabel, { color: getStatusColor() }]}>{getStatusLabel()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>HẠN ĐẾN</Text>
          <Text style={styles.detailValue}>{contract.endDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>TIỀN PHÒNG</Text>
          <Text style={styles.detailValue}>{(contract.amount || 0).toLocaleString('vi-VN')}đ</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    padding: 16,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 10,
    maxWidth: 128,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF3FF',
  },
  roomDetails: {
    marginTop: 8,
    gap: 6,
  },
  tenantDetails: {
    marginTop: 8,
    gap: 6,
  },
  tenantDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tenantDetailText: {
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
  },
  invoiceDetails: {
    marginTop: 8,
    gap: 6,
  },
  contractDetails: {
    marginTop: 8,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    flexShrink: 1,
    minWidth: 92,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
  },
  invoiceSummary: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  invoiceActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
    gap: 6,
  },
  invoiceIconButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF3FF',
  },
});
