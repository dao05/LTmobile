import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { TextInputField, CheckboxField, SelectField } from '../components/FormComponents';
import { ActionButton } from '../components/Common';

export const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userRole, setUserRole] = useState('tenant');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signUp } = React.useContext(AuthContext);

  const handleSignUp = async () => {
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (!acceptTerms) {
      setError('Vui lòng chấp nhận điều khoản sử dụng');
      return;
    }

    setLoading(true);

    const success = await signUp(email, password, name, userRole);
    if (success) {
      setSuccess('Đăng ký thành công!');
    } else {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
    }

    setLoading(false);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#3B82F6" />
        </Pressable>
        <Text style={styles.headerTitle}>Đăng ký</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Tạo tài khoản mới</Text>
        <Text style={styles.formSubtitle}>Điền thông tin để bắt đầu sử dụng Sanctuary</Text>

        {error ? (
          <View style={styles.errorBox}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {success ? (
          <View style={styles.successBox}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
            <Text style={styles.successText}>{success}</Text>
          </View>
        ) : null}

        <TextInputField
          label="Họ và tên"
          value={name}
          onChangeText={setName}
          placeholder="Nhập họ và tên"
          icon="account"
        />

        <TextInputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          icon="email"
          keyboardType="email-address"
        />

        <TextInputField
          label="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          placeholder="0901234567"
          icon="phone"
          keyboardType="phone-pad"
        />

        <SelectField
          label="Loại tài khoản"
          value={userRole}
          onValueChange={setUserRole}
          items={[
            { label: 'Khách thuê', value: 'tenant' },
            { label: 'Quản lý viên', value: 'manager' },
            { label: 'Quản trị viên', value: 'admin' },
          ]}
          placeholder="Chọn loại tài khoản"
          icon="account-tie"
        />

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Mật khẩu</Text>
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

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Xác nhận mật khẩu</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="lock-check" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#D1D5DB"
              selectionColor="#3B82F6"
              underlineColorAndroid="transparent"
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <MaterialCommunityIcons name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        <CheckboxField
          label="Tôi đồng ý với các điều khoản sử dụng"
          value={acceptTerms}
          onValueChange={setAcceptTerms}
        />

        <ActionButton
          label={loading ? 'Đang đăng ký...' : 'Đăng ký'}
          onPress={handleSignUp}
          disabled={loading}
          fullWidth
          size="large"
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã có tài khoản? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Đăng nhập</Text>
          </Pressable>
        </View>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  form: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
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
  successBox: {
    flexDirection: 'row',
    backgroundColor: '#DCFCE7',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    gap: 12,
    alignItems: 'center',
  },
  successText: {
    fontSize: 13,
    color: '#059669',
    flex: 1,
    fontWeight: '500',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
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
});
