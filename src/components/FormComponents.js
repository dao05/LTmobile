import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActionButton } from './Common';
import { formatAppDate, formatInvoiceMonth, parseAppDate, parseInvoiceMonth } from '../utils/helpers';

export const FormModal = ({ visible, title, onClose, onSubmit, isLoading, children, showFooter = true }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
      >
      <Pressable style={styles.modalContent} onPress={() => {}}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#1F2937" />
          </Pressable>
        </View>
        <ScrollView
          style={styles.modalBody}
          contentContainerStyle={styles.modalBodyContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        {showFooter && (
          <View style={styles.modalFooter}>
            <ActionButton
              label="Hủy"
              variant="outline"
              onPress={onClose}
              fullWidth
            />
            <ActionButton
              label="Lưu"
              onPress={onSubmit}
              disabled={isLoading}
              fullWidth
            />
          </View>
        )}
      </Pressable>
      </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

export const ConfirmModal = ({ visible, title, message, onConfirm, onCancel, confirmText = 'Xác nhận', cancelText = 'Hủy', type = 'warning' }) => {
  const getColor = () => {
    switch (type) {
      case 'danger':
        return '#EF4444';
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return 'alert-circle';
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'alert-circle';
      default:
        return 'information';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.centeredModalBackdrop} onPress={onCancel}>
      <Pressable style={styles.confirmModal} onPress={() => {}}>
        <View style={[styles.confirmIcon, { backgroundColor: getColor() + '20' }]}>
          <MaterialCommunityIcons name={getIcon()} size={40} color={getColor()} />
        </View>
        <Text style={styles.confirmTitle}>{title}</Text>
        <Text style={styles.confirmMessage}>{message}</Text>
        <View style={styles.confirmButtons}>
          <ActionButton
            label={cancelText}
            variant="outline"
            onPress={onCancel}
            fullWidth
          />
          <ActionButton
            label={confirmText}
            onPress={onConfirm}
            variant={type === 'danger' ? 'danger' : 'primary'}
            fullWidth
          />
        </View>
      </Pressable>
      </Pressable>
    </Modal>
  );
};

export const TextInputField = ({ label, value, onChangeText, placeholder, secureTextEntry, icon, keyboardType = 'default', editable = true }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        {icon && <MaterialCommunityIcons name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={editable}
          placeholderTextColor="#D1D5DB"
        />
      </View>
    </View>
  );
};

export const DateInputField = ({ label, value, onChangeText, placeholder }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <MaterialCommunityIcons name="calendar" size={20} color="#9CA3AF" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.inputWithIcon]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#D1D5DB"
        />
      </View>
    </View>
  );
};

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTH_LABELS = ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'];

const getCalendarDays = (viewDate) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const leadingEmpty = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: leadingEmpty }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
};

export const DatePickerField = ({ label, value, onChangeText, placeholder = 'Chọn ngày', icon = 'calendar', disabled = false }) => {
  const selectedDate = parseAppDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [value]);

  const handleSelectDate = (date) => {
    onChangeText(formatAppDate(date));
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    setViewDate(current => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const isSameDate = (date) => (
    selectedDate &&
    date &&
    selectedDate.getFullYear() === date.getFullYear() &&
    selectedDate.getMonth() === date.getMonth() &&
    selectedDate.getDate() === date.getDate()
  );

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        style={[styles.pickerWrapper, disabled && styles.fieldDisabled]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <MaterialCommunityIcons name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />
        <Text style={[styles.selectValue, styles.pickerWithIcon, !value && styles.selectPlaceholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        {!disabled && <MaterialCommunityIcons name={isOpen ? 'chevron-up' : 'chevron-down'} size={22} color="#6B7280" />}
      </Pressable>

      {isOpen && !disabled && (
        <View style={styles.calendarPanel}>
          <View style={styles.calendarHeader}>
            <Pressable style={styles.calendarNavButton} onPress={() => changeMonth(-1)}>
              <MaterialCommunityIcons name="chevron-left" size={22} color="#0052CC" />
            </Pressable>
            <Text style={styles.calendarTitle}>
              {`Tháng ${viewDate.getMonth() + 1}/${viewDate.getFullYear()}`}
            </Text>
            <Pressable style={styles.calendarNavButton} onPress={() => changeMonth(1)}>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#0052CC" />
            </Pressable>
          </View>
          <View style={styles.weekRow}>
            {WEEK_DAYS.map(day => (
              <Text key={day} style={styles.weekDay}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {getCalendarDays(viewDate).map((date, index) => (
              <Pressable
                key={date ? date.toISOString() : `empty-${index}`}
                style={[styles.dayCell, date && isSameDate(date) && styles.dayCellSelected]}
                onPress={() => date && handleSelectDate(date)}
                disabled={!date}
              >
                <Text style={[styles.dayText, date && isSameDate(date) && styles.dayTextSelected]}>
                  {date ? date.getDate() : ''}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export const MonthPickerField = ({ label, value, onChangeText, placeholder = 'Chọn tháng', icon = 'calendar-month' }) => {
  const selectedMonth = parseInvoiceMonth(value);
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState((selectedMonth || new Date()).getFullYear());

  useEffect(() => {
    if (selectedMonth) {
      setViewYear(selectedMonth.getFullYear());
    }
  }, [value]);

  const handleSelectMonth = (monthIndex) => {
    onChangeText(formatInvoiceMonth(new Date(viewYear, monthIndex, 1)));
    setIsOpen(false);
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.pickerWrapper} onPress={() => setIsOpen(!isOpen)}>
        <MaterialCommunityIcons name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />
        <Text style={[styles.selectValue, styles.pickerWithIcon, !value && styles.selectPlaceholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <MaterialCommunityIcons name={isOpen ? 'chevron-up' : 'chevron-down'} size={22} color="#6B7280" />
      </Pressable>
      {isOpen && (
        <View style={styles.calendarPanel}>
          <View style={styles.calendarHeader}>
            <Pressable style={styles.calendarNavButton} onPress={() => setViewYear(viewYear - 1)}>
              <MaterialCommunityIcons name="chevron-left" size={22} color="#0052CC" />
            </Pressable>
            <Text style={styles.calendarTitle}>{viewYear}</Text>
            <Pressable style={styles.calendarNavButton} onPress={() => setViewYear(viewYear + 1)}>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#0052CC" />
            </Pressable>
          </View>
          <View style={styles.monthGrid}>
            {MONTH_LABELS.map((monthLabel, index) => {
              const isSelected = selectedMonth && selectedMonth.getFullYear() === viewYear && selectedMonth.getMonth() === index;

              return (
                <Pressable
                  key={monthLabel}
                  style={[styles.monthCell, isSelected && styles.monthCellSelected]}
                  onPress={() => handleSelectMonth(index)}
                >
                  <Text style={[styles.monthText, isSelected && styles.monthTextSelected]}>{monthLabel}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export const SelectField = ({ label, value, onValueChange, items, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = items.find(item => {
    if (value === null || value === undefined) return item.value === value;
    return item.value === value || String(item.value) === String(value);
  });

  const handleSelect = (nextValue) => {
    onValueChange(nextValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.pickerWrapper} onPress={() => setIsOpen(!isOpen)}>
        {icon && <MaterialCommunityIcons name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />}
        <Text
          style={[
            styles.selectValue,
            icon && styles.pickerWithIcon,
            !selectedItem && styles.selectPlaceholder,
          ]}
          numberOfLines={1}
        >
          {selectedItem?.label || placeholder || 'Chọn'}
        </Text>
        <MaterialCommunityIcons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={22}
          color="#6B7280"
        />
      </Pressable>
      {isOpen && (
        <View style={styles.optionList}>
          {items.length === 0 ? (
            <View style={styles.optionItemDisabled}>
              <Text style={styles.optionTextDisabled}>Không có lựa chọn phù hợp</Text>
            </View>
          ) : (
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={styles.optionScroll}>
              {items.map(item => {
                const isSelected = selectedItem?.value === item.value || String(selectedItem?.value) === String(item.value);

                return (
                  <Pressable
                    key={`${item.value}`}
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]} numberOfLines={1}>
                      {item.label}
                    </Text>
                    {isSelected && (
                      <MaterialCommunityIcons name="check" size={18} color="#0052CC" />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

export const TextAreaField = ({ label, value, onChangeText, placeholder, numberOfLines = 4 }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#D1D5DB"
        multiline
        numberOfLines={numberOfLines}
      />
    </View>
  );
};

export const CheckboxField = ({ label, value, onValueChange }) => {
  return (
    <Pressable style={styles.checkboxContainer} onPress={() => onValueChange(!value)}>
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  keyboardAvoiding: {
    width: '100%',
  },
  centeredModalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    paddingHorizontal: 16,
  },
  modalBodyContent: {
    paddingVertical: 16,
    paddingBottom: 28,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  confirmIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  confirmButtons: {
    width: '100%',
    gap: 12,
    flexDirection: 'row',
    minWidth: 0,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: '#1F2937',
  },
  inputWithIcon: {
    marginLeft: 8,
  },
  inputIcon: {
    marginRight: 0,
  },
  textArea: {
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  picker: {
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 10,
    flex: 1,
    minWidth: 0,
  },
  fieldDisabled: {
    opacity: 0.75,
  },
  pickerWithIcon: {
    marginLeft: 8,
  },
  selectValue: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 12,
  },
  selectPlaceholder: {
    color: '#9CA3AF',
  },
  optionList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#D8DEE9',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  optionScroll: {
    maxHeight: 220,
  },
  optionItem: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  optionText: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#0052CC',
    fontWeight: '700',
  },
  optionItemDisabled: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  optionTextDisabled: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  calendarPanel: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#D8DEE9',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calendarNavButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
  },
  calendarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dayCellSelected: {
    backgroundColor: '#0052CC',
  },
  dayText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthCell: {
    width: '30.8%',
    minHeight: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  monthCellSelected: {
    backgroundColor: '#0052CC',
    borderColor: '#0052CC',
  },
  monthText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  monthTextSelected: {
    color: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#1F2937',
  },
});
