import React, { useContext } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { AuthContext } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { RoomManagementScreen } from '../screens/RoomManagementScreen';
import { RoomDetailScreen } from '../screens/RoomDetailScreen';
import { TenantManagementScreen } from '../screens/TenantManagementScreen';
import { TenantDetailScreen } from '../screens/TenantDetailScreen';
import { InvoiceManagementScreen } from '../screens/InvoiceManagementScreen';
import { ContractManagementScreen } from '../screens/ContractManagementScreen';
import { UserRoleManagementScreen } from '../screens/UserRoleManagementScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { UserProfileScreen } from '../screens/UserProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

const screenOptions = { headerShown: false };

const RoomStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="RoomManagementScreen" component={RoomManagementScreen} />
    <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
  </Stack.Navigator>
);

const TenantStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="TenantManagementScreen" component={TenantManagementScreen} />
    <Stack.Screen name="TenantDetail" component={TenantDetailScreen} />
  </Stack.Navigator>
);

const InvoiceStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="InvoiceManagementScreen" component={InvoiceManagementScreen} />
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
    <Stack.Screen name="RoomManagement" component={RoomManagementScreen} />
    <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
    <Stack.Screen name="TenantManagement" component={TenantManagementScreen} />
    <Stack.Screen name="TenantDetail" component={TenantDetailScreen} />
    <Stack.Screen name="InvoiceManagement" component={InvoiceManagementScreen} />
    <Stack.Screen name="ContractManagement" component={ContractManagementScreen} />
    <Stack.Screen name="UserRoleManagement" component={UserRoleManagementScreen} />
    <Stack.Screen name="Reports" component={ReportsScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="UserProfile" component={UserProfileScreen} />
  </Stack.Navigator>
);

const MoreTabScreen = ({ navigation }) => {
  const { userRole } = useContext(AuthContext);
  const menuItems = [
    { label: 'Hợp đồng', icon: 'file-document-edit-outline', route: 'ContractManagementStack' },
    { label: 'Báo cáo', icon: 'chart-line', route: 'ReportsStack' },
    ...(userRole === 'admin'
      ? [{ label: 'Phân quyền', icon: 'shield-account', route: 'UserRoleManagementStack' }]
      : []),
  ];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.moreContainer}>
      <ScrollView contentContainerStyle={styles.moreContent}>
        <Text style={styles.moreTitle}>Menu</Text>
        {menuItems.map((item) => (
          <Pressable
            key={item.route}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <MaterialCommunityIcons name={item.icon} size={24} color="#3B82F6" />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#D1D5DB" />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const MoreTabNavigator = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="MoreTab" component={MoreTabScreen} />
    <Stack.Screen name="ContractManagementStack" component={ContractManagementScreen} />
    <Stack.Screen name="UserRoleManagementStack" component={UserRoleManagementScreen} />
    <Stack.Screen name="ReportsStack" component={ReportsScreen} />
  </Stack.Navigator>
);

export const MainNavigator = () => {
  const { userRole } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Rooms: 'home-city',
            Tenants: focused ? 'account-multiple' : 'account-multiple-outline',
            Invoices: focused ? 'file-document' : 'file-document-outline',
            More: 'menu',
          };

          return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Rooms" component={RoomStack} options={{ tabBarLabel: 'Phòng' }} />
      <Tab.Screen name="Tenants" component={TenantStack} options={{ tabBarLabel: 'Khách' }} />
      <Tab.Screen name="Invoices" component={InvoiceStack} options={{ tabBarLabel: 'Hóa đơn' }} />
      {userRole === 'admin' && (
        <Tab.Screen name="More" component={MoreTabNavigator} options={{ tabBarLabel: 'Thêm' }} />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  moreContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  moreContent: {
    padding: 12,
  },
  moreTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  menuLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 85,
    paddingBottom: 25,
    paddingTop: 6,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabBarIcon: {
    marginTop: 2,
  },
});
