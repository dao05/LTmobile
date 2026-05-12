import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { TextInputField, CheckboxField } from '../components/FormComponents';
import { ActionButton } from '../components/Common';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('admin@rental.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = React.useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);
    setError('');

    const success = await signIn(email, password);
    if (!success) {
      setError('Email hoặc mật khẩu không đúng');
    }

    setLoading(false);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="home-city" size={40} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Sanctuary</Text>
          <Text style={styles.headerSubtitle}>Giải pháp quản lý bất động sản thông minh</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.welcomeTitle}>Chào mừng trở lại</Text>
        <Text style={styles.welcomeSubtitle}>Vui lòng đăng nhập để tiếp tục quản lý</Text>

        {error ? (
          <View style={styles.errorBox}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TextInputField
          label="Email hoặc Số điện thoại"
          value={email}
          onChangeText={setEmail}
          placeholder="tenant@example.com"
          icon="email"
          keyboardType="email-address"
        />

        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>Mật khẩu</Text>
            <Pressable onPress={() => setError('Vui lòng liên hệ admin để đặt lại mật khẩu')}>
              <Text style={styles.forgotLink}>Quên mật khẩu?</Text>
            </Pressable>
          </View>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              placeholderTextColor="#D1D5DB"
              selectionColor="#3B82F6"
              underlineColorAndroid="transparent"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <MaterialCommunityIcons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        <CheckboxField
          label="Duy trì đăng nhập"
          value={rememberMe}
          onValueChange={setRememberMe}
        />

        <ActionButton
          label={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          onPress={handleLogin}
          disabled={loading}
          fullWidth
          size="large"
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Hoặc</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <Pressable style={styles.socialButton}>
            <MaterialCommunityIcons name="google" size={24} color="#EA4335" />
            <Text style={styles.socialButtonText}>Google</Text>
          </Pressable>
          <Pressable style={styles.socialButton}>
            <MaterialCommunityIcons name="facebook" size={24} color="#1877F2" />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerLink}>Đăng ký</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.devInfo}>PHÁT TRIỂN BỞI DUAN CONG DAO</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0066CC',
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  form: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    gap: 12,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    flex: 1,
    fontWeight: '500',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  forgotLink: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  eyeIcon: {
    padding: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  socialButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B82F6',
  },
  devInfo: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
    letterSpacing: 1,
  },
});
