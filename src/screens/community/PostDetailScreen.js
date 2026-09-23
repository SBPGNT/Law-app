import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { communityService } from '../../services/communityService';

export default function PostDetailScreen({ route, navigation }) {
  // 1. ดึง postId จาก route params
  const postId = route.params?.postId;

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 2. ดึงข้อมูลใหม่ทุกครั้งที่เปิดเข้าหน้านี้ หรือเมื่อ postId เปลี่ยนแปลง
  useFocusEffect(
    useCallback(() => {
      if (postId) {
        fetchPostDetail(postId);
      } else {
        setLoading(false);
        Alert.alert('ข้อผิดพลาด', 'ไม่พบรหัสกระทู้');
      }
    }, [postId])
  );

  const fetchPostDetail = async (targetId) => {
    try {
      setLoading(true);
      setPost(null); // ล้างข้อมูลกระทู้เดิมก่อนดึงใหม่
      setComments([]);

      const res = await communityService.getPostById(targetId);
      const postData = res.data?.post || res.data;

      if (postData && postData.id) {
        setPost(postData);
        setComments(postData.comments || []);
      } else {
        Alert.alert('ข้อผิดพลาด', 'ไม่พบข้อมูลกระทู้นี้');
      }
    } catch (error) {
      console.error('Fetch post detail error:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลกระทู้ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อความก่อนส่งความคิดเห็น');
      return;
    }

    try {
      setSubmitting(true);
      const res = await communityService.addComment(postId, { content: commentText.trim() });
      const newComment = res.data?.comment || res.data;
      
      if (newComment) {
        setComments((prev) => [...prev, newComment]);
      } else {
        fetchPostDetail(postId);
      }

      setCommentText('');
    } catch (error) {
      console.error('Send comment error:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถส่งความคิดเห็นได้');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E2B58" />
      </View>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1E2B58" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>รายละเอียดกระทู้</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={{ fontSize: 16, color: '#666' }}>ไม่พบข้อมูลกระทู้นี้</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>รายละเอียดกระทู้</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* การ์ดกระทู้ */}
          <View style={styles.postCard}>
            <View style={styles.authorRow}>
              <FontAwesome5 name="user-circle" size={36} color="#1E2B58" />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>
                  {post.isAnonymous
                    ? 'ผู้ไม่ออกนาม'
                    : post.author
                    ? `${post.author.firstName} ${post.author.lastName || ''}`.trim()
                    : 'ผู้ใช้งาน'}
                </Text>
                <Text style={styles.postDate}>
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString('th-TH') : ''}
                </Text>
              </View>
            </View>

            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
          </View>

          {/* ส่วนความคิดเห็น */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              ความคิดเห็น ({comments.length})
            </Text>

            {comments.length === 0 ? (
              <Text style={styles.noCommentsText}>ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็นสิ!</Text>
            ) : (
              comments.map((item, index) => (
                <View key={item.id || index.toString()} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <FontAwesome5 name="user-circle" size={24} color="#555" />
                    <Text style={styles.commentAuthor}>
                      {item.author ? `${item.author.firstName} ${item.author.lastName || ''}`.trim() : 'ผู้ใช้งาน'}
                    </Text>
                    <Text style={styles.commentDate}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('th-TH') : ''}
                    </Text>
                  </View>
                  <Text style={styles.commentContent}>{item.content}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* ช่องพิมพ์ความคิดเห็น */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="เขียนความคิดเห็น..."
            placeholderTextColor="#888"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendComment}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Feather name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E2B58' },
  scrollContent: { padding: 16, paddingBottom: 20 },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  authorInfo: { marginLeft: 10 },
  authorName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  postDate: { fontSize: 12, color: '#888' },
  postTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E2B58', marginBottom: 8 },
  postContent: { fontSize: 15, color: '#444', lineHeight: 22 },
  commentsSection: { marginTop: 8 },
  commentsTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E2B58', marginBottom: 12 },
  noCommentsText: { textAlign: 'center', color: '#888', marginVertical: 20 },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  commentAuthor: { fontSize: 13, fontWeight: 'bold', color: '#333', marginLeft: 8, flex: 1 },
  commentDate: { fontSize: 11, color: '#aaa' },
  commentContent: { fontSize: 14, color: '#555', marginLeft: 32 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#1E2B58',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});