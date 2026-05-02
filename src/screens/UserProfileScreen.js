import React, { useContext, useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import { Header, StatCard } from '../components/Common';

export const UserProfileScreen = ({ navigation }) => {
  const { signOut, userData, userRole } = useContext(AuthContext);
  const { tenants, rooms, invoices, contracts } = useContext(DataContext);

  const stats = useMemo(() => {
    if (userRole === 'tenant') {
      const tenantRecord = tenants.find((item) => item.email === userData?.email || item.name === userData?.name);
      return {
        room: tenantRecord ? rooms.find((room) => room.id === tenantRecord.roomId)?.number : null,
        invoices: tenantRecord ? invoices.filter((invoice) => invoice.tenantId === tenantRecord.id).length : 0,
        contracts: tenantRecord ? contracts.filter((contract) => contract.tenantId === tenantRecord.id).length : 0,
      };
    }

    return {
      room: null,
      invoices: invoices.length,
      contracts: contracts.length,
    };
  }, [userRole, userData, tenants, rooms, invoices, contracts]);

  const handleLogout = () => {
    Alert.alert('Dang xuat', 'Ban muon dang xuat khoi he thong?', [
      { text: 'Huy', style: 'cancel' },
      { text: 'Dang xuat', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Quan tri vien';
      case 'manager':
        return 'Quan ly vien';
      case 'tenant':
        return 'Khach thue';
      default:
        return role || 'Nguoi dung';
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Thong tin nguoi dung"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <Avatar.Icon size={72} icon="account" style={styles.avatar} />
          <Text style={styles.name}>{userData?.name || 'Nguoi dung'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{getRoleLabel(userData?.role || userRole)}</Text>
          </View>
          <Text style={styles.email}>{userData?.email || 'Chua co email'}</Text>
        </View>

        <View style={styles.infoCard}>
          <ProfileRow icon="badge-account-horizontal-outline" label="Ma nguoi dung" value={String(userData?.id || 'N/A')} />
          <ProfileRow icon="shield-account" label="Vai tro" value={getRoleLabel(userData?.role || userRole)} />
          <ProfileRow icon="email-outline" label="Email" value={userData?.email || 'Chua cap nhat'} />
          <ProfileRow icon="calendar-check-outline" label="Trang thai" value="Dang hoat dong" />
        </View>

        <Text style={styles.sectionTitle}>Tong quan</Text>
        <StatCard
          label="Tong hoa don"
          value={String(stats.invoices)}
          color="#F59E0B"
          icon={<MaterialCommunityIcons name="file-document-outline" size={24} color="#F59E0B" />}
        />
        <StatCard
          label="Tong hop dong"
          value={String(stats.contracts)}
          color="#10B981"
          icon={<MaterialCommunityIcons name="file-document-edit-outline" size={24} color="#10B981" />}
        />
        {stats.room && (
          <StatCard
            label="Phong dang o"
            value={String(stats.room)}
            color="#3B82F6"
            icon={<MaterialCommunityIcons name="home-city-outline" size={24} color="#3B82F6" />}
          />
        )}

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>Dang xuat</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const ProfileRow = ({ icon, label, value }) => (
  <View style={styles.profileRow}>
    <MaterialCommunityIcons name={icon} size={18} color="#6B7280" />
    <Text style={styles.profileLabel}>{label}</Text>
    <Text style={styles.profileValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    paddingVertical: 12,
    paddingBottom: 36,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    borderRadius: 18,
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  avatar: {
    backgroundColor: '#2563EB',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#DBEAFE',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  email: {
    fontSize: 13,
    color: '#6B7280',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileLabel: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
  },
  profileValue: {
    maxWidth: '55%',
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'right',
  },
  sectionTitle: {
    marginHorizontal: 12,
    marginTop: 18,
    marginBottom: 4,
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 12,
    marginTop: 18,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#DC2626',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
