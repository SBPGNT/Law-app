import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { io } from 'socket.io-client';
import apiClient from '../../services/apiClient';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL
  ? process.env.EXPO_PUBLIC_API_URL.replace(/\/api\/?$/, '')
  : 'http://192.168.1.38:5000';

export default function ConsultChatScreen({ route }) {
  const { consultationId, currentUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // 1. ดึงประวัติการแชทเก่าจาก REST API
    fetchChatHistory();

    // 2. เชื่อมต่อ Socket.io
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: false,
    });
    socketRef.current = socket;

    console.log('🔌 Connecting to Socket URL:', SOCKET_URL);
    socket.on('connect', () => {
      console.log('🟢 Socket connected to backend with ID:', socket.id);
      socket.emit('join_room', { roomId: consultationId });
    });
    socket.on('connect_error', (err) => {
      console.error('🔴 Socket connection error:', err.message);
    });
    socket.on('error_message', ({ message }) => {
      console.error('🔴 Socket message error:', message);
    });

    // รับข้อความใหม่
    socket.on('receive_message', (newMessage) => {
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    // สถานะพิมพ์ข้อความ
    socket.on('user_typing', ({ userName }) => {
      setTypingUser(userName);
      setIsTyping(true);
    });

    socket.on('user_stop_typing', () => {
      setIsTyping(false);
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [consultationId]);

  const fetchChatHistory = async () => {
    try {
      const response = await apiClient.get(`/chat/${consultationId}/messages`);
      const history = response.data.messages || response.data;
      setMessages(Array.isArray(history) ? history.reverse() : []);
    } catch (error) {
      console.error('Fetch history error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const messageData = {
      roomId: consultationId,
      senderId: currentUserId,
      content: inputText.trim(),
    };

    console.log('Sending message:', messageData);
    socketRef.current.emit('send_message', messageData);
    socketRef.current.emit('stop_typing', { roomId: consultationId });
    setInputText('');
  };

  const handleInputChange = (text) => {
    setInputText(text);

    socketRef.current.emit('typing', { roomId: consultationId, userName: 'อีกฝ่าย' });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stop_typing', { roomId: consultationId });
    }, 2000);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        inverted // ให้ข้อความล่าสุดอยู่ด้านล่างสุด
        renderItem={({ item }) => {
          const isMyMessage = item.senderId === currentUserId;
          return (
            <View
              style={[
                styles.messageBubble,
                isMyMessage ? styles.myMessage : styles.otherMessage,
              ]}
            >
              <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
                {item.content ?? item.text}
              </Text>
            </View>
          );
        }}
      />

      {isTyping && (
        <Text style={styles.typingText}>{typingUser} กำลังพิมพ์...</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleInputChange}
          placeholder="พิมพ์ข้อความปรึกษา..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>ส่ง</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  messageBubble: {
    maxBottom: 10,
    marginVertical: 4,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 16,
    maxWidth: '75%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  myMessageText: { color: '#fff', fontSize: 15 },
  otherMessageText: { color: '#000', fontSize: 15 },
  typingText: { fontSize: 12, color: '#888', marginLeft: 16, marginBottom: 4 },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});