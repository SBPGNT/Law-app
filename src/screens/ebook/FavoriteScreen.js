import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getFavorites } from '../../services/ebookService';

export default function FavoriteScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Fetch favorites error:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>ยังไม่มี E-Book ในรายการโปรด</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('EbookDetail', { ebookId: item.ebook?.id || item.id })}
            >
              <Image source={{ uri: item.ebook?.coverUrl || 'https://via.placeholder.com/100' }} style={styles.cover} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.ebook?.title}</Text>
                <Text style={styles.author}>{item.ebook?.author}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 10, padding: 12, marginBottom: 12, elevation: 2 },
  cover: { width: 60, height: 80, borderRadius: 6 },
  info: { marginLeft: 12, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold' },
  author: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  emptyText: { color: '#9CA3AF', fontSize: 16 },
});