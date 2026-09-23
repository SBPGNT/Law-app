import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatService } from '../../services/chatService';

export default function ChatBoxScreen({ route }) {
  const { consultId } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
  const setupChat = async () => {
    try {
    const storedUser = await AsyncStorage.getItem('userData');
    if (storedUser) {
      setCurrentUserId(JSON.parse(storedUser).id);
    }
    if (!consultId) {
      console.error('Missing consultId for chat');
      return;
    }
    const res = await chatService.getHistory(consultId);
    setMessages(Array.isArray(res.data) ? res.data : []);
  } catch (error) {
    console.error('Fetch chat history error:', error?.response?.data || error.message);
    setMessages([]);
  }
  };

  setupChat();
  }, [consultId]);

  const sendMessage = async () => {
  if (!inputText.trim()) return;
  if (!consultId) return;

  try {
    const response = await chatService.sendMessageAPI(consultId, inputText);
    setMessages((previous) => [...previous, response.data]);
    setInputText('');
  } catch (error) {
    console.error('Send chat message error:', error?.response?.data || error.message);
  }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isMyMessage = item.senderId === currentUserId;
          return (
            <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
              <Text style={[styles.messageText, isMyMessage ? styles.myText : styles.otherText]}>
                {item.text}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="พิมพ์ข้อความ..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>ส่ง</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  messageContainer: { marginVertical: 4, marginHorizontal: 12, padding: 12, borderRadius: 16, maxWidth: '75%' },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#1E3A8A' },
  otherMessage: { alignSelf: 'flex-start', backgroundColor: '#E5E7EB' },
  myText: { color: '#FFF' },
  otherText: { color: '#1F2937' },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 16, height: 40 },
  sendButton: { marginLeft: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E3A8A', paddingHorizontal: 16, borderRadius: 20 },
  sendButtonText: { color: '#FFF', fontWeight: 'bold' },
});