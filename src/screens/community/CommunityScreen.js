import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { communityService } from '../../services/communityService';

export default function CommunityScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ดึงรายการโพสต์ทั้งหมดจาก Server
  const fetchPosts = async () => {
    try {
      const response = await communityService.getPosts();
      // รองรับโครงสร้างข้อมูลทั้งแบบ Array โดยตรง หรือแบบ { posts: [...] }
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.posts || response.data || [];
      setPosts(data);
    } catch (error) {
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ดึงข้อมูลใหม่ทุกครั้งที่ผู้ใช้สลับกลับมาหน้านี้
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E2B58" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header หน้าชุมชน */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>ชุมชนนักกฎหมาย</Text>
      </View>

      {/* รายการโพสต์ทั้งหมด */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="comments" size={50} color="#ccc" />
            <Text style={styles.emptyText}>ยังไม่มีกระทู้ในขณะนี้</Text>
            <Text style={styles.emptySubText}>กดปุ่ม + ด้านล่างเพื่อสร้างกระทู้แรกเลย!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              // ✅ ส่ง postId ของกระทู้นั้นๆ ไปที่หน้า PostDetail
              navigation.navigate('PostDetail', { postId: item.id });
            }}
          >
            <View style={styles.authorRow}>
              <FontAwesome5 name="user-circle" size={28} color="#1E2B58" />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>
                  {item.isAnonymous
                    ? 'ผู้ไม่ออกนาม'
                    : item.author
                    ? `${item.author.firstName} ${item.author.lastName || ''}`.trim()
                    : 'ผู้ใช้งาน'}
                </Text>
                <Text style={styles.postDate}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('th-TH') : ''}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content} numberOfLines={2}>
              {item.content}
            </Text>

            <View style={styles.cardFooter}>
              <View style={styles.commentCountBox}>
                <Feather name="message-square" size={14} color="#666" />
                <Text style={styles.commentCountText}>
                  {item.comments ? item.comments.length : 0} ความคิดเห็น
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color="#999" />
            </View>
          </TouchableOpacity>
        )}
      />

      {/* ปุ่มสร้างกระทู้ใหม่ (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Feather name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E2B58',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorInfo: {
    marginLeft: 8,
  },
  authorName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  postDate: {
    fontSize: 11,
    color: '#888',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  commentCountBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCountText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#1E2B58',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});