import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatService } from '../../services/chatService';

export default function ChatScreen({ route, navigation }) {
  const { roomId, roomTitle } = route.params || { roomId: 'default_room', roomTitle: 'ห้องปรึกษา' };

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    initChat();

    return () => {
      // ล้าง listener เมื่อออกจากหน้า
      const socket = chatService.getSocket();
      if (socket) {
        socket.off('receive_message');
      }
    };
  }, [roomId]);

  const initChat = async () => {
    // 1. โหลดข้อมูลผู้ใช้ปัจจุบัน
    const storedUser = await AsyncStorage.getItem('userData');
    let user = storedUser ? JSON.parse(storedUser) : { id: 'user_guest', firstName: 'ผู้ใช้งาน' };
    setCurrentUser(user);

    // 2. เชื่อมต่อ Socket & Join Room
    const socket = chatService.connectSocket();
    chatService.joinRoom(roomId);

    // 3. ดึงประวัติแชตเดิม (ถ้ามี)
    try {
      const res = await chatService.getHistory(roomId);
      if (Array.isArray(res.data)) {
        setMessages(res.data);
      }
    } catch (err) {
      console.log('Load history optional err:', err.message);
    }

    // 4. ฟัง Event ข้อความใหม่ที่เด้งเข้ามา
    socket.off('receive_message'); // ป้องกัน Listener ซ้ำ
    socket.on('receive_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const messagePayload = {
      roomId,
      senderId: currentUser?.userId || currentUser?.id || 'guest',
      senderName: currentUser?.firstName ? `${currentUser.firstName}` : 'ผู้ใช้งาน',
      content: inputText.trim(),
    };

    // ส่งข้อความผ่าน Socket
    chatService.sendMessage(messagePayload);

    // พยายามบันทึกลง API แบบ background
    chatService.saveMessageAPI(messagePayload).catch(() => {});

    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1E2B58" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{roomTitle}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* รายการข้อความ */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isMyMessage = item.senderId === (currentUser?.userId || currentUser?.id);
            return (
              <View
                style={[
                  styles.messageBubble,
                  isMyMessage ? styles.myBubble : styles.otherBubble,
                ]}
              >
                {!isMyMessage && (
                  <Text style={styles.senderName}>{item.senderName || 'ทนายความ / ผู้ใช้งาน'}</Text>
                )}
                <Text style={[styles.messageText, isMyMessage ? styles.myText : styles.otherText]}>
                  {item.content}
                </Text>
                <Text style={[styles.timeText, isMyMessage ? styles.myTimeText : styles.otherTimeText]}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : ''}
                </Text>
              </View>
            );
          }}
        />

        {/* ช่องพิมพ์ข้อความ */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="พิมพ์ข้อความปรึกษา..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Feather name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#1E2B58', flex: 1, textAlign: 'center' },
  messageList: { padding: 16, paddingBottom: 10 },
  messageBubble: {
    maxWidth: '78%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E2B58',
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  senderName: { fontSize: 11, fontWeight: 'bold', color: '#6b7280', marginBottom: 4 },
  messageText: { fontSize: 15, lineHeight: 20 },
  myText: { color: '#fff' },
  otherText: { color: '#1f2937' },
  timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  myTimeText: { color: '#cbd5e1' },
  otherTimeText: { color: '#9ca3af' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1f2937',
  },
  sendButton: {
    backgroundColor: '#1E2B58',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});