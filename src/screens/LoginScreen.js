import React, { useContext, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import { ActionButton } from '../components/Common';
import { TextInputField } from '../components/FormComponents';

export const LoginScreen = ({ navigation }) => {
  const { signIn, error } = useContext(AuthContext);
  const [email, setEmail] = useState('admin@rental.com');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Thieu thong tin', 'Nhap email va mat khau.');
      return;
    }

    setIsSubmitting(true);
    const ok = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (!ok) {
      Alert.alert('Dang nhap that bai', error || 'Email hoac mat khau khong dung.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoWrap}>
          <MaterialCommunityIcons name="home-city-outline" size={34} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Sanctuary</Text>
        <Text style={styles.subtitle}>Quan ly phong tro tren mobile</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.formWrap}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Dang nhap</Text>
          <Text style={styles.formDescription}>Su dung tai khoan quan tri, quan ly hoac tai khoan da dang ky.</Text>

          <TextInputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="admin@rental.com"
            icon="email-outline"
            keyboardType="email-address"
          />
          <TextInputField
            label="Mat khau"
            value={password}
            onChangeText={setPassword}
            placeholder="Nhap mat khau"
            icon="lock-outline"
            secureTextEntry
          />

          <ActionButton
            label={isSubmitting ? 'Dang xu ly...' : 'Dang nhap'}
            icon="login"
            onPress={handleLogin}
            disabled={isSubmitting}
            fullWidth
          />

          <View style={styles.helperBox}>
            <Text style={styles.helperTitle}>Tai khoan mau</Text>
            <Text style={styles.helperText}>Admin: `admin@rental.com` / `admin123`</Text>
            <Text style={styles.helperText}>Manager: `manager@rental.com` / `manager123`</Text>
          </View>

          <Pressable onPress={() => navigation.navigate('SignUp')} style={styles.linkButton}>
            <Text style={styles.linkText}>Chua co tai khoan? Dang ky</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  hero: {
    paddingTop: 96,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: '#1D4ED8',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 10,
  },
  logoWrap: {
    width: 62,
    height: 62,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#DBEAFE',
  },
  formWrap: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: -24,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  formDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6B7280',
  },
  helperBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  helperTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  helperText: {
    fontSize: 12,
    color: '#475569',
  },
  linkButton: {
    alignItems: 'center',
    paddingTop: 6,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
});

