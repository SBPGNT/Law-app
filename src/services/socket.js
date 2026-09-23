import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';

const SOCKET_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.38:5000/api')
  .replace(/\/api\/?$/, '');

let socket = null;

export const initSocket = async () => {
  const token = await AsyncStorage.getItem('userToken');
  
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};