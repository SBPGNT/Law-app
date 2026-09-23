import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // เข้าสู่ระบบ
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // สมัครสมาชิก
  register: async (formData) => {
    const response = await apiClient.post('/auth/register', formData);
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // ออกจากระบบ
  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  },

  // ดึงข้อมูลโปรไฟล์ปัจจุบัน
  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};