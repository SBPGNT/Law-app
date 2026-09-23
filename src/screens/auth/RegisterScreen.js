import React, { useState } from 'react';
import { Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '../../services/apiClient'; // เช็ก Path ของ apiClient ให้ถูกต้อง

export default function RegisterScreen({ navigation }) {
  // 1. สร้าง State สำหรับเก็บข้อมูลจากช่องกรอก
  const [formData, setFormData] = useState({
    idCardOrPass: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  // 2. ฟังก์ชันส่งข้อมูลไปยัง Backend
  const handleRegister = async () => {
    // เช็กค่าว่างเบื้องต้น
    if (!formData.email || !formData.password || !formData.firstName) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('แจ้งเตือน', 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/register', {
        idCardOrPass: formData.idCardOrPass,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dob: formData.dob,
      });

      Alert.alert('สำเร็จ', 'สมัครสมาชิกเรียบร้อยแล้ว!', [
        { text: 'ตกลง', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.error('Register Error:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
      Alert.alert('สมัครสมาชิกไม่สำเร็จ', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign Up</Text>
          <FontAwesome5 name="dove" size={50} color="#000" style={styles.logoIcon} />
          <Text style={styles.subtitle}>Legal Support, Anytime</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <FontAwesome name="id-card-o" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="ID / Passport Number"
              placeholderTextColor="#888"
              value={formData.idCardOrPass}
              onChangeText={(text) => handleChange('idCardOrPass', text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="user" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#888"
              value={formData.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="user" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#888"
              value={formData.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="mail" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="phone" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="calendar" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Date Of Birth (YYYY-MM-DD)"
              placeholderTextColor="#888"
              value={formData.dob}
              onChangeText={(text) => handleChange('dob', text)}
            />
          </View>

          {/* 3. เพิ่ม onPress={handleRegister} ที่ปุ่ม */}
          <TouchableOpacity 
            style={styles.signupButton} 
            onPress={handleRegister} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLinkContainer}>
            <Text style={styles.loginTextBold}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#000' },
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
    marginBottom: 12,
    height: 50,
  },
  inputIcon: { marginRight: 10, width: 24, textAlign: 'center' },
  input: { flex: 1, height: '100%', color: '#333' },
  signupButton: {
    backgroundColor: '#1E2B58',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  signupButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loginLinkContainer: { marginTop: 15, alignItems: 'center' },
  loginTextBold: { color: '#1E2B58', fontWeight: 'bold', fontSize: 16 },
});