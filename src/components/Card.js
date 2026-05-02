import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActionButton } from './Common';
import { formatAppDate, formatCurrency } from '../utils/helpers';

const getRoomStatusMeta = (status) => {
  switch (status) {
    case 'occupied':
      return { label: 'Dang thue', color: '#F59E0B', icon: 'account-group' };
    case 'under_maintenance':
      return { label: 'Bao tri', color: '#EF4444', icon: 'tools' };
    default:
      return { label: 'Trong', color: '#10B981', icon: 'door-open' };
  }
};

const getInvoiceStatusMeta = (status) => (
  status === 'paid'
    ? { label: 'Da thanh toan', color: '#10B981', icon: 'check-circle' }
    : { label: 'Chua thanh toan', color: '#EF4444', icon: 'clock-alert-outline' }
);

const getContractStatusMeta = (status) => {
  switch (status) {
    case 'expired':
      return { label: 'Het han', color: '#EF4444', icon: 'calendar-remove' };
    case 'expiring':
      return { label: 'Sap het han', color: '#F59E0B', icon: 'calendar-alert' };
    default:
      return { label: 'Con han', color: '#10B981', icon: 'calendar-check' };
  }
};

const getTenantStatusMeta = (status) => (
  status === 'active'
    ? { label: 'Dang thue', color: '#10B981', icon: 'account-check' }
    : { label: 'Da roi phong', color: '#6B7280', icon: 'account-off' }
);

const Badge = ({ icon, label, color }) => (
  <View style={[styles.badge, { backgroundColor: `${color}18` }]}>
    <MaterialCommunityIcons name={icon} size={14} color={color} />
    <Text style={[styles.badgeText, { color }]}>{label}</Text>
  </View>
);

const ActionRow = ({ actions = [] }) => {
  if (actions.filter(Boolean).length === 0) return null;

  return (
    <View style={styles.actionRow}>
      {actions.filter(Boolean).map((action) => (
        <ActionButton
          key={action.label}
          label={action.label}
          icon={action.icon}
          onPress={action.onPress}
          variant={action.variant || 'outline'}
          size="small"
        />
      ))}
    </View>
  );
};

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

export const RoomCard = ({ room, onView, onEdit, onDelete }) => {
  const statusMeta = getRoomStatusMeta(room.status);

  return (
    <Card>
      <View style={styles.headerRow}>
        <View style={styles.leadingRow}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="home-city" size={24} color="#3B82F6" />
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.title}>Phong {room.number}</Text>
            <Text style={styles.subtitle}>{room.type}</Text>
          </View>
        </View>
        <Badge {...statusMeta} />
      </View>

      <View style={styles.metaGrid}>
        <MetaItem icon="cash" label={formatCurrency(room.price)} />
        <MetaItem icon="ruler-square" label={`${room.area || 0} m2`} />
        <MetaItem icon="account-group" label={`${room.occupiedSlots || 0}/${room.capacity || 1} nguoi`} />
        <MetaItem icon="layers" label={`Tang ${room.floor || 1}`} />
      </View>

      <ActionRow
        actions={[
          onView && { label: 'Chi tiet', icon: 'eye-outline', onPress: onView },
          onEdit && { label: 'Sua', icon: 'pencil-outline', onPress: onEdit },
          onDelete && { label: 'Xoa', icon: 'trash-can-outline', onPress: onDelete, variant: 'danger' },
        ]}
      />
    </Card>
  );
};

export const TenantCard = ({ tenant, room, onView, onEdit, onDelete }) => {
  const statusMeta = getTenantStatusMeta(tenant.status);

  return (
    <Card>
      <View style={styles.headerRow}>
        <View style={styles.leadingRow}>
          <Avatar.Text
            size={48}
            label={(tenant.name || '?').slice(0, 1).toUpperCase()}
            style={{ backgroundColor: '#DBEAFE' }}
            color="#1D4ED8"
          />
          <View style={styles.infoColumn}>
            <Text style={styles.title}>{tenant.name}</Text>
            <Text style={styles.subtitle}>Phong {room?.number || 'N/A'}</Text>
          </View>
        </View>
        <Badge {...statusMeta} />
      </View>

      <View style={styles.detailList}>
        <DetailRow icon="phone" value={tenant.phone || 'Chua cap nhat'} />
        <DetailRow icon="card-account-details-outline" value={tenant.idCard || 'Chua cap nhat'} />
        <DetailRow icon="calendar-start" value={`Bat dau: ${formatAppDate(tenant.startDate) || 'N/A'}`} />
      </View>

      <ActionRow
        actions={[
          onView && { label: 'Chi tiet', icon: 'eye-outline', onPress: onView },
          onEdit && { label: 'Sua', icon: 'pencil-outline', onPress: onEdit },
          onDelete && { label: 'Xoa', icon: 'trash-can-outline', onPress: onDelete, variant: 'danger' },
        ]}
      />
    </Card>
  );
};

export const InvoiceCard = ({ invoice, room, tenant, onEdit, onDelete, onPayment }) => {
  const statusMeta = getInvoiceStatusMeta(invoice.status);
  const totalAmount = (invoice.amount || 0) + (invoice.electricity || 0) + (invoice.water || 0);

  return (
    <Card>
      <View style={styles.headerRow}>
        <View style={styles.infoColumn}>
          <Text style={styles.title}>Hoa don {invoice.month}</Text>
          <Text style={styles.subtitle}>
            Phong {room?.number || 'N/A'}{tenant?.name ? ` - ${tenant.name}` : ''}
          </Text>
        </View>
        <Badge {...statusMeta} />
      </View>

      <View style={styles.metaGrid}>
        <MetaItem icon="cash-multiple" label={formatCurrency(totalAmount)} />
        <MetaItem icon="home-outline" label={`Tien phong ${formatCurrency(invoice.amount || 0)}`} />
        <MetaItem icon="lightning-bolt" label={formatCurrency(invoice.electricity || 0)} />
        <MetaItem icon="water" label={formatCurrency(invoice.water || 0)} />
      </View>
      <DetailRow icon="calendar-clock" value={`Han thanh toan: ${formatAppDate(invoice.dueDate) || 'N/A'}`} />

      <ActionRow
        actions={[
          onPayment && {
            label: invoice.status === 'paid' ? 'Bo da tra' : 'Da tra',
            icon: invoice.status === 'paid' ? 'close-circle-outline' : 'check-circle-outline',
            onPress: onPayment,
            variant: invoice.status === 'paid' ? 'secondary' : 'success',
          },
          onEdit && { label: 'Sua', icon: 'pencil-outline', onPress: onEdit },
          onDelete && { label: 'Xoa', icon: 'trash-can-outline', onPress: onDelete, variant: 'danger' },
        ]}
      />
    </Card>
  );
};

export const ContractCard = ({ contract, room, tenant, onEdit, onDelete, onRenew }) => {
  const statusMeta = getContractStatusMeta(contract.status);

  return (
    <Card>
      <View style={styles.headerRow}>
        <View style={styles.infoColumn}>
          <Text style={styles.title}>Hop dong phong {room?.number || 'N/A'}</Text>
          <Text style={styles.subtitle}>{tenant?.name || 'Khach thue'}</Text>
        </View>
        <Badge {...statusMeta} />
      </View>

      <View style={styles.detailList}>
        <DetailRow icon="calendar-start" value={`Bat dau: ${formatAppDate(contract.startDate) || 'N/A'}`} />
        <DetailRow icon="calendar-end" value={`Ket thuc: ${formatAppDate(contract.endDate) || 'N/A'}`} />
        <DetailRow icon="cash" value={`Gia thue: ${formatCurrency(contract.amount || 0)}`} />
      </View>

      <ActionRow
        actions={[
          onRenew && { label: 'Gia han', icon: 'calendar-refresh', onPress: onRenew, variant: 'secondary' },
          onEdit && { label: 'Sua', icon: 'pencil-outline', onPress: onEdit },
          onDelete && { label: 'Xoa', icon: 'trash-can-outline', onPress: onDelete, variant: 'danger' },
        ]}
      />
    </Card>
  );
};

const MetaItem = ({ icon, label }) => (
  <View style={styles.metaItem}>
    <MaterialCommunityIcons name={icon} size={16} color="#6B7280" />
    <Text style={styles.metaText}>{label}</Text>
  </View>
);

const DetailRow = ({ icon, value }) => (
  <View style={styles.detailRow}>
    <MaterialCommunityIcons name={icon} size={16} color="#6B7280" />
    <Text style={styles.detailText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  leadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
  },
  infoColumn: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#374151',
    flexShrink: 1,
  },
  detailList: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#4B5563',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
