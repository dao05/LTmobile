import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const Header = ({
  title = 'Sanctuary',
  subtitle,
  showNotification,
  notificationCount,
  onNotificationPress,
  rightIcon,
  showBack = false,
  onBackPress,
}) => {
  return (
    <SafeAreaView edges={['top']} style={styles.header}>
      <View style={styles.headerContent}>
        {showBack && (
          <Pressable onPress={onBackPress} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0052CC" />
          </Pressable>
        )}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.headerActions}>
          {showNotification && (
            <Pressable onPress={onNotificationPress} style={styles.notificationButton}>
              <MaterialCommunityIcons name="bell-outline" size={24} color="#6B7280" />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </Pressable>
          )}
          {rightIcon && rightIcon}
        </View>
      </View>
    </SafeAreaView>
  );
};

export const StatCard = ({ label, value, icon, color = '#3B82F6', onPress }) => {
  return (
    <Pressable style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      {icon && <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>{icon}</View>}
    </Pressable>
  );
};

export const NotificationAlert = ({ type = 'warning', title, message, onActionPress, actionText = 'GIA HẠN NGAY' }) => {
  const getAlertColor = () => {
    switch (type) {
      case 'warning':
        return '#EF4444';
      case 'info':
        return '#F59E0B';
      case 'success':
        return '#10B981';
      default:
        return '#3B82F6';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return 'alert-circle';
      case 'info':
        return 'information';
      case 'success':
        return 'check-circle';
      default:
        return 'bell';
    }
  };

  return (
    <View style={[styles.alertContainer, { borderLeftColor: getAlertColor() }]}>
      <View style={styles.alertContent}>
        <View style={styles.alertHeader}>
          <MaterialCommunityIcons name={getIcon()} size={20} color={getAlertColor()} />
          <Text style={[styles.alertTitle, { color: getAlertColor() }]}>{title}</Text>
        </View>
        <Text style={styles.alertMessage}>{message}</Text>
        {onActionPress && (
          <Pressable onPress={onActionPress} style={styles.alertAction}>
            <Text style={[styles.alertActionText, { color: getAlertColor() }]}>{actionText}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export const FilterChip = ({ label, isSelected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterChip,
        isSelected && styles.filterChipSelected,
      ]}
    >
      <Text
        style={[
          styles.filterChipText,
          isSelected && styles.filterChipTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export const FilterBar = ({ filters, selectedValue, onChange }) => {
  return (
    <View style={styles.filterBar}>
      {filters.map(filter => {
        const isSelected = selectedValue === filter.key;

        return (
          <Pressable
            key={filter.key}
            onPress={() => onChange(filter.key)}
            style={[
              styles.filterButton,
              isSelected && styles.filterButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                isSelected && styles.filterButtonTextSelected,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.78}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export const SearchBar = ({ placeholder, onChangeText, value }) => {
  return (
    <View style={styles.searchBar}>
      <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" style={styles.searchIcon} />
      <Pressable style={styles.searchInput} onPress={() => {}}>
        <Text
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          style={styles.searchInputText}
        />
      </Pressable>
    </View>
  );
};

export const ActionButton = ({ label, icon, onPress, variant = 'primary', size = 'medium', fullWidth = false, disabled = false }) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.buttonSecondary;
      case 'outline':
        return styles.buttonOutline;
      case 'danger':
        return styles.buttonDanger;
      case 'success':
        return styles.buttonSuccess;
      default:
        return styles.buttonPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.buttonTextOutline;
      case 'danger':
        return styles.buttonTextDanger;
      default:
        return styles.buttonText;
    }
  };

  return (
    <Pressable
      style={[
        getButtonStyle(),
        size === 'small' && styles.buttonSmall,
        size === 'large' && styles.buttonLarge,
        fullWidth && styles.buttonFullWidth,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.buttonContent}>
        {icon && <MaterialCommunityIcons name={icon} size={20} color={variant === 'outline' ? '#0052CC' : '#FFFFFF'} style={styles.buttonIcon} />}
        <Text style={getTextStyle()} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>{label}</Text>
      </View>
    </Pressable>
  );
};

export const FloatingActionButton = ({ onPress, icon = 'plus', color = '#3B82F6' }) => {
  return (
    <Pressable style={[styles.fab, { backgroundColor: color }]} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={28} color="#FFFFFF" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D5BFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 6,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statIcon: {
    padding: 12,
    borderRadius: 8,
    marginLeft: 12,
  },
  alertContainer: {
    backgroundColor: '#FFF7ED',
    borderRadius: 8,
    borderLeftWidth: 4,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  alertContent: {
    gap: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  alertMessage: {
    fontSize: 12,
    color: '#5B5B5B',
    lineHeight: 18,
  },
  alertAction: {
    marginTop: 8,
  },
  alertActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E8EDF8',
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipSelected: {
    backgroundColor: '#0052CC',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 42,
  },
  filterButton: {
    flex: 1,
    minWidth: 0,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#E8EDF8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#0052CC',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  searchInputText: {
    fontSize: 14,
    color: '#1F2937',
  },
  buttonPrimary: {
    backgroundColor: '#0052CC',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#E8EDF8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#0052CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDanger: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSuccess: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonTextOutline: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0052CC',
  },
  buttonTextDanger: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonLarge: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  buttonFullWidth: {
    flex: 1,
    minWidth: 0,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  buttonIcon: {
    marginRight: 8,
    flexShrink: 0,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
