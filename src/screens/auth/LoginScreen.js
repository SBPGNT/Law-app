import React, { useState, useContext } from 'react';
import { Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../AuthContext';
import apiClient from '../../services/apiClient';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext); // 2. ดึงฟังก์ชัน login จาก AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('กรุณากรอก Email และ Password ให้ครบถ้วน');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const response = await apiClient.post('/auth/login', {
        email: email.trim(),
        password: password,
      });

      const { token, user } = response.data;
      await login(token, user);
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      const message = error.response?.data?.message
        || (error.request
          ? 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อและ URL ของ API'
          : 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo and Header */}
        <View style={styles.header}>
          <Text style={styles.title}>LOGIN</Text>
          <FontAwesome5 name="dove" size={50} color="#000" style={styles.logoIcon} />
          <Text style={styles.subtitle}>Legal Support, Anytime</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Feather name="mail" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {errorMessage ? (
            <Text style={styles.errorText} accessibilityRole="alert">
              {errorMessage}
            </Text>
          ) : null}

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Icons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialIconBtn}>
              <FontAwesome name="facebook" size={30} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconBtn}>
              <FontAwesome name="google" size={30} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconBtn}>
              <FontAwesome name="apple" size={30} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Navigate to Sign Up */}
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.signupLinkContainer}>
            <Text style={styles.signupText}>
              Don&apos;t have an account? <Text style={styles.signupTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  logoIcon: { marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#1E2B58', fontWeight: '600' },
  formContainer: { width: '100%' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: '100%', color: '#333' },
  errorText: { color: '#c62828', marginBottom: 8 },
  loginButton: {
    backgroundColor: '#1E2B58',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  divider: { flex: 1, height: 1, backgroundColor: '#ddd' },
  dividerText: { marginHorizontal: 10, color: '#888' },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30 },
  socialIconBtn: { padding: 10 },
  signupLinkContainer: { marginTop: 30, alignItems: 'center' },
  signupText: { color: '#555' },
  signupTextBold: { color: '#1E2B58', fontWeight: 'bold' },
});