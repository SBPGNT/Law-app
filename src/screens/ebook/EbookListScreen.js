import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ข้อมูลจำลองสำหรับทดสอบ UI
const CATEGORIES = ['ทั้งหมด', 'ประมวลกฎหมาย', 'แพ่งและพาณิชย์', 'อาญา', 'แนวคำพิพากษา', 'คู่มือสัญญา'];

const MOCK_EBOOKS = [
  {
    id: '1',
    title: 'สรุปประมวลกฎหมายแพ่งและพาณิชย์ ฉบับประชาชน',
    author: 'ดร.สมชาย นิติศาตร์',
    category: 'แพ่งและพาณิชย์',
    coverUrl: 'https://picsum.photos/200/300?random=1',
    isFree: true,
    pageCount: 180,
    fileSize: '4.2 MB',
    description: 'รวบรวมหลักกฎหมายแพ่งและพาณิชย์ที่จำเป็นในชีวิตประจำวัน อ่านเข้าใจง่าย มีตัวอย่างคดีจริงประกอบ',
  },
  {
    id: '2',
    title: 'คู่มือการทำสัญญาและการฟ้องร้องคดีอาญา',
    author: 'ทนายวิชัย กฎหมายดี',
    category: 'อาญา',
    coverUrl: 'https://picsum.photos/200/300?random=2',
    isFree: false,
    price: 150,
    pageCount: 250,
    fileSize: '6.8 MB',
    description: 'เทคนิคการเขียนสัญญาและขั้นตอนการดำเนินการฟ้องร้องคดีอาญาอย่างละเอียด พร้อมแบบฟอร์มตัวอย่าง',
  },
  {
    id: '3',
    title: 'รวมแนวคำพิพากษาศาลฎีกาแรงงานปี 2025-2026',
    author: 'สำนักพิมพ์กฎหมายไทย',
    category: 'แนวคำพิพากษา',
    coverUrl: 'https://picsum.photos/200/300?random=3',
    isFree: true,
    pageCount: 310,
    fileSize: '8.1 MB',
    description: 'รวบรวมคำพิพากษาศาลฎีกาเกี่ยวกับคดีแรงงาน เลิกจ้าง ค่าชดเชย และการดำเนินคดีในศาลแรงงาน',
  },
];

export default function EbookListScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');

  // กรองหนังสือตามหมวดหมู่และคำค้นหา
  const filteredEbooks = MOCK_EBOOKS.filter((book) => {
    const matchesCategory = selectedCategory === 'ทั้งหมด' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderEbookCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('EbookDetail', { ebook: item })}
    >
      <Image source={{ uri: item.coverUrl }} style={styles.coverImage} />
      <View style={styles.badgeContainer}>
        <Text style={[styles.badgeText, { backgroundColor: item.isFree ? '#2e7d32' : '#d32f2f' }]}>
          {item.isFree ? 'FREE' : `฿${item.price}`}
        </Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="document-text-outline" size={12} color="#666" />
          <Text style={styles.metaText}>{item.pageCount} หน้า</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>คลังความรู้กฎหมาย</Text>
        <TouchableOpacity style={styles.myLibraryBtn} onPress={() => navigation.navigate('MyLibrary')}>
          <Ionicons name="bookmark-outline" size={24} color="#1a237e" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาชื่อหนังสือ หรือชื่อผู้แต่ง..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.selectedCategoryChip,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.selectedCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* E-Book Grid */}
      <FlatList
        data={filteredEbooks}
        keyExtractor={(item) => item.id}
        renderItem={renderEbookCard}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>ไม่พบหนังสือที่คุณค้นหา</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a237e' },
  myLibraryBtn: { padding: 4 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  categoryWrapper: { marginVertical: 12 },
  categoryContainer: { paddingHorizontal: 16 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e8eaf6',
    marginRight: 8,
  },
  selectedCategoryChip: { backgroundColor: '#1a237e' },
  categoryText: { fontSize: 13, color: '#1a237e', fontWeight: '500' },
  selectedCategoryText: { color: '#fff', fontWeight: 'bold' },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coverImage: { width: '100%', height: 180, resizeMode: 'cover' },
  badgeContainer: { position: 'absolute', top: 8, right: 8 },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardInfo: { padding: 10 },
  bookTitle: { fontSize: 13, fontWeight: 'bold', color: '#212121', marginBottom: 4, height: 36 },
  bookAuthor: { fontSize: 11, color: '#666', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 10, color: '#666', marginLeft: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 12, color: '#888', fontSize: 14 },
});