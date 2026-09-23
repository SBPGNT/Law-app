import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

const CONSULT_TOPICS = [
  { id: 'topic_1', title: 'ปรึกษาสัญญาเช่า / อสังหาฯ', icon: 'file-contract', color: '#1E2B58' },
  { id: 'topic_2', title: 'กฎหมายแรงงาน / เลิกจ้าง', icon: 'briefcase', color: '#2B4C7E' },
  { id: 'topic_3', title: 'มรดก / ครอบครัว / หย่าร้าง', icon: 'users', color: '#4A6FA5' },
  { id: 'topic_4', title: 'คดีแพ่ง / หนี้สิน / กู้ยืม', icon: 'hand-holding-usd', color: '#2E5B88' },
  { id: 'topic_5', title: 'คดีอาญา / หมิ่นประมาท', icon: 'gavel', color: '#1E2B58' },
];

export default function ConsultScreen({ navigation }) {
  const handleSelectTopic = (topic) => {
    navigation.navigate('Chat', {
      roomId: topic.id,
      roomTitle: topic.title,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>ปรึกษาทนายความ</Text>
        <Text style={styles.headerSubtitle}>เลือกหมวดหมู่กฎหมายที่ต้องการขอคำปรึกษา</Text>
      </View>

      <FlatList
        data={CONSULT_TOPICS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.topicCard}
            onPress={() => handleSelectTopic(item)}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color }]}>
              <FontAwesome5 name={item.icon} size={22} color="#fff" />
            </View>
            <View style={styles.textBox}>
              <Text style={styles.topicTitle}>{item.title}</Text>
              <Text style={styles.topicSubText}>คลิกเพื่อเข้าห้องแชตปรึกษาทันที</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#888" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerBar: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1E2B58' },
  headerSubtitle: { fontSize: 13, color: '#666', marginTop: 4 },
  listContent: { padding: 16 },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textBox: { flex: 1 },
  topicTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  topicSubText: { fontSize: 12, color: '#888', marginTop: 2 },
});