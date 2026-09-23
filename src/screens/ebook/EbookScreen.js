import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEbooks, toggleFavoriteEbook } from '../../services/ebookService';

export default function EbookScreen({ navigation }) {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchEbooks = async () => {
    try {
      const data = await getEbooks(search);
      setEbooks(data);
    } catch (error) {
      console.error('Fetch ebooks error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchEbooks();
  };

  useFocusEffect(
    useCallback(() => {
      fetchEbooks();
    }, [search])
  );

  const handleToggleFavorite = async (id) => {
    try {
      await toggleFavoriteEbook(id);
      setEbooks(prev => prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="ค้นหาหนังสือ ชื่อเรื่อง หรือผู้เขียน"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <FlatList
        data={ebooks}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('EbookDetail', {
              book: {
                ...item,
                image: item.coverUrl,
                desc: item.description,
                author: item.authorName,
                date: item.createdAt,
              },
            })}>
              <Image source={{ uri: item.coverUrl || 'https://via.placeholder.com/150' }} style={styles.cover} />
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.author}>{item.author}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleToggleFavorite(item.id)} style={styles.favButton}>
              <Text style={{ color: item.isFavorite ? 'red' : 'gray' }}>
                {item.isFavorite ? '❤️ ชื่นชอบ' : '🤍 เพิ่มในรายการโปรด'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 8 },
  searchInput: { backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, margin: 8, borderWidth: 1, borderColor: '#D1D5DB' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flex: 1, margin: 8, backgroundColor: '#FFF', borderRadius: 10, padding: 10, elevation: 2 },
  cover: { width: '100%', height: 160, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  author: { fontSize: 12, color: '#6B7280' },
  favButton: { marginTop: 8, alignItems: 'center' },
});