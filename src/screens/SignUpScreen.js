import React, { useContext, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import { ActionButton } from '../components/Common';
import { SelectField, TextInputField } from '../components/FormComponents';

const roleItems = [
  { label: 'Khach thue', value: 'tenant' },
  { label: 'Quan ly vien', value: 'manager' },
];

export const SignUpScreen = ({ navigation }) => {
  const { signUp, error } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('tenant');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Thieu thong tin', 'Vui long dien day du thong tin.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Mat khau khong khop', 'Nhap lai mat khau xac nhan.');
      return;
    }

    setIsSubmitting(true);
    const ok = await signUp(email.trim(), password, name.trim(), role);
    setIsSubmitting(false);

    if (!ok) {
      Alert.alert('Dang ky that bai', error || 'Khong the tao tai khoan.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#1F2937" />
        </Pressable>
        <Text style={styles.topTitle}>Dang ky tai khoan</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Tao tai khoan moi</Text>
            <Text style={styles.bannerText}>Tai khoan dang ky se duoc luu cung he thong va co the quan ly trong man nhan su.</Text>
          </View>

          <View style={styles.formCard}>
            <TextInputField
              label="Ho ten"
              value={name}
              onChangeText={setName}
              placeholder="Nguyen Van A"
              icon="account-outline"
            />
            <TextInputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              icon="email-outline"
              keyboardType="email-address"
            />
            <SelectField
              label="Vai tro"
              value={role}
              onValueChange={setRole}
              items={roleItems}
              placeholder="Chon vai tro"
              icon="shield-account"
            />
            <TextInputField
              label="Mat khau"
              value={password}
              onChangeText={setPassword}
              placeholder="Nhap mat khau"
              icon="lock-outline"
              secureTextEntry
            />
            <TextInputField
              label="Xac nhan mat khau"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Nhap lai mat khau"
              icon="lock-check-outline"
              secureTextEntry
            />

            <ActionButton
              label={isSubmitting ? 'Dang xu ly...' : 'Dang ky'}
              icon="account-plus-outline"
              onPress={handleSignUp}
              disabled={isSubmitting}
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  banner: {
    backgroundColor: '#1D4ED8',
    borderRadius: 18,
    padding: 18,
    gap: 8,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#DBEAFE',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
});

